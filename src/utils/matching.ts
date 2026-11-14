import {
  Landmark,
  Taxi,
  DriverUser,
  MatchedTaxiResult,
  SearchFilters,
  SortOption,
  BookingStatus,
} from '../types';

/**
 * Haversine distance in kilometers between two [lat, lng] coordinates.
 */
export function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function getLandmarkById(landmarks: Landmark[], id: string): Landmark | undefined {
  return landmarks.find((l) => l.id === id);
}

/**
 * Strict route matching algorithm:
 * Only returns taxis that:
 * 1. Are online and accepting bookings
 * 2. Have at least 1 available seat
 * 3. Have BOTH pickup and destination (or close stops <= 1.2km) along their REMAINING route
 *    in the forward travel order: pickupStopIndex >= currentStopIndex && destinationStopIndex > pickupStopIndex
 *    Note: also allows pickup at currentStopIndex - 1 ONLY if taxi is within 0.45km of pickup.
 */
export function matchTaxisForJourney(params: {
  taxis: Taxi[];
  drivers: DriverUser[];
  landmarks: Landmark[];
  pickupId: string;
  destinationId: string;
}): MatchedTaxiResult[] {
  const { taxis, drivers, landmarks, pickupId, destinationId } = params;
  if (!pickupId || !destinationId || pickupId === destinationId) return [];

  const pickupLm = getLandmarkById(landmarks, pickupId);
  const destLm = getLandmarkById(landmarks, destinationId);
  if (!pickupLm || !destLm) return [];

  const results: MatchedTaxiResult[] = [];

  for (const taxi of taxis) {
    if (!taxi.isOnline || !taxi.acceptingBookings) continue;

    const availableSeatsCount = taxi.seats.filter((s) => s.status === 'available').length;
    if (availableSeatsCount === 0) continue;

    // Find pickup stop along remaining route (or exact match at currentStopIndex)
    let pickupStopIndex = taxi.stops.indexOf(pickupId);
    let pickupProximityPenalty = 0;

    if (pickupStopIndex === -1) {
      // Check if any remaining stop on the taxi's route is within 1.1km of pickup
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = taxi.currentStopIndex; i < taxi.stops.length - 1; i++) {
        const stopLm = getLandmarkById(landmarks, taxi.stops[i]);
        if (!stopLm) continue;
        const d = haversineKm(pickupLm.coords, stopLm.coords);
        if (d <= 1.1 && d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      pickupStopIndex = bestIdx;
      pickupProximityPenalty = bestDist * 10;
    }

    if (pickupStopIndex === -1 || pickupStopIndex < taxi.currentStopIndex) continue;

    // Find destination stop STRICTLY AFTER pickupStopIndex
    let destinationStopIndex = -1;
    let destProximityPenalty = 0;

    const directDestIdx = taxi.stops.indexOf(destinationId, pickupStopIndex + 1);
    if (directDestIdx !== -1) {
      destinationStopIndex = directDestIdx;
    } else {
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = pickupStopIndex + 1; i < taxi.stops.length; i++) {
        const stopLm = getLandmarkById(landmarks, taxi.stops[i]);
        if (!stopLm) continue;
        const d = haversineKm(destLm.coords, stopLm.coords);
        if (d <= 1.15 && d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      destinationStopIndex = bestIdx;
      destProximityPenalty = bestDist * 10;
    }

    if (destinationStopIndex === -1 || destinationStopIndex <= pickupStopIndex) continue;

    const driver = drivers.find((d) => d.id === taxi.driverId);
    if (!driver) continue;

    const distanceToPassengerKm = Number(
      Math.max(0.2, haversineKm(taxi.currentPosition, pickupLm.coords)).toFixed(1)
    );
    const stopsBetween = destinationStopIndex - pickupStopIndex;
    const stopsUntilPickup = Math.max(0, pickupStopIndex - taxi.currentStopIndex);
    const etaMinutes = Math.max(2, Math.round(distanceToPassengerKm * 3.1 + stopsUntilPickup * 2));

    const routeDistanceKm = Math.max(1.2, haversineKm(pickupLm.coords, destLm.coords));
    const journeyDurationMin = Math.max(5, Math.round(routeDistanceKm * 3.4 + stopsBetween * 2));
    const estimatedFareMad = taxi.baseFareMad + Math.max(0, stopsBetween - 1) * taxi.perStopMad;

    const rawScore = 100 - Math.round(pickupProximityPenalty + destProximityPenalty) - stopsUntilPickup * 3;
    const routeCompatibilityScore = Math.max(76, Math.min(100, rawScore));

    results.push({
      taxi,
      driver,
      availableSeatsCount,
      distanceToPassengerKm,
      etaMinutes,
      estimatedFareMad,
      journeyDurationMin,
      routeCompatibilityScore,
      pickupStopIndex,
      destinationStopIndex,
      stopsBetween,
    });
  }

  return results;
}

export function filterAndSortMatches(
  matches: MatchedTaxiResult[],
  filters: SearchFilters,
  sortBy: SortOption
): MatchedTaxiResult[] {
  const filtered = matches.filter((m) => {
    if (filters.taxiType !== 'all' && m.taxi.type !== filters.taxiType) return false;
    if (m.estimatedFareMad > filters.maxPriceMad) return false;
    if (m.etaMinutes > filters.maxWaitMin) return false;
    if (m.availableSeatsCount < filters.minSeats) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'cheapest':
        return a.estimatedFareMad - b.estimatedFareMad || a.etaMinutes - b.etaMinutes;
      case 'closest':
        return a.distanceToPassengerKm - b.distanceToPassengerKm;
      case 'fastest':
        return a.etaMinutes - b.etaMinutes;
      case 'comfortable':
        // Large taxis or taxis with more open seats & higher driver rating rank higher
        return (
          (b.taxi.type === 'large' ? 1 : 0) - (a.taxi.type === 'large' ? 1 : 0) ||
          b.availableSeatsCount - a.availableSeatsCount ||
          b.driver.rating - a.driver.rating
        );
      default:
        return 0;
    }
  });
}

/**
 * Consistent booking state machine validator
 */
export type BookingTransitionAction =
  | 'driver_accept'
  | 'driver_reject'
  | 'driver_approaching'
  | 'driver_board_passenger'
  | 'passenger_complete'
  | 'driver_confirm_departure'
  | 'passenger_cancel';

export function canPerformBookingTransition(
  currentStatus: BookingStatus,
  action: BookingTransitionAction
): boolean {
  switch (action) {
    case 'driver_accept':
      return currentStatus === 'pending_confirmation';
    case 'driver_reject':
      return currentStatus === 'pending_confirmation';
    case 'driver_approaching':
      return currentStatus === 'confirmed';
    case 'driver_board_passenger':
      return currentStatus === 'confirmed' || currentStatus === 'driver_approaching';
    case 'passenger_complete':
      return currentStatus === 'picked_up';
    case 'driver_confirm_departure':
      return currentStatus === 'picked_up' || currentStatus === 'completed';
    case 'passenger_cancel':
      return (
        currentStatus === 'pending_confirmation' ||
        currentStatus === 'confirmed' ||
        currentStatus === 'driver_approaching'
      );
    default:
      return false;
  }
}
