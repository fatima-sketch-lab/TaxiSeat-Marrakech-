export type Language = 'fr' | 'ar' | 'en';
export type UserRole = 'passenger' | 'driver' | 'admin';

export type TaxiType = 'small' | 'large';
export type SeatStatus = 'available' | 'reserved' | 'occupied';
export type SeatPosition = 'front' | 'middle' | 'rear';

export interface Landmark {
  id: string;
  name: Record<Language, string>;
  district: Record<Language, string>;
  coords: [number, number]; // [lat, lng]
  popular?: boolean;
}

export interface Seat {
  id: string;
  code: string;
  position: SeatPosition;
  label: Record<Language, string>;
  status: SeatStatus;
  bookingId?: string;
  passengerName?: string;
}

export interface Taxi {
  id: string;
  driverId: string;
  type: TaxiType;
  model: string;
  plateNumber: string;
  colorLabel: Record<Language, string>;
  capacity: number;
  seats: Seat[];
  stops: string[]; // ordered landmark IDs along the active corridor
  currentStopIndex: number; // index in stops array
  currentPosition: [number, number];
  baseFareMad: number;
  perStopMad: number;
  isOnline: boolean;
  acceptingBookings: boolean;
  headingLabel: Record<Language, string>;
}

export interface PassengerUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  preferredLanguage: Language;
  totalTrips: number;
  joinedAt: string;
}

export interface DriverUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  licenseNumber: string;
  taxiId: string;
  rating: number;
  ratingCount: number;
  totalRides: number;
  verified: boolean;
  todayEarningsMad: number;
  weeklyEarningsMad: number;
  monthlyEarningsMad: number;
  dailyChartMad: number[]; // 7 days Mon-Sun
}

export type BookingStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'driver_approaching'
  | 'picked_up'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cmi_card_sim' | 'wallet_sim' | 'mobile_pay_sim';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface PaymentRecord {
  id: string;
  bookingId: string;
  baseFareMad: number;
  serviceFeeMad: number;
  totalMad: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  reference: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  driverId: string;
  taxiId: string;
  seatId: string;
  seatCode: string;
  pickupId: string;
  destinationId: string;
  status: BookingStatus;
  fareMad: number;
  serviceFeeMad: number;
  totalMad: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  etaMinutes: number;
  distanceKm: number;
  passengerConfirmedArrival: boolean;
  driverConfirmedDeparture: boolean;
  ratingGiven?: number;
  ratingComment?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | 'booking_confirmed'
  | 'driver_approaching'
  | 'booking_cancelled'
  | 'passenger_boarded'
  | 'journey_completed'
  | 'payment_confirmed'
  | 'booking_requested';

export interface AppNotification {
  id: string;
  targetRole: UserRole | 'all';
  type: NotificationType;
  title: Record<Language, string>;
  message: Record<Language, string>;
  bookingId?: string;
  read: boolean;
  timestamp: string;
}

export interface MatchedTaxiResult {
  taxi: Taxi;
  driver: DriverUser;
  availableSeatsCount: number;
  distanceToPassengerKm: number;
  etaMinutes: number;
  estimatedFareMad: number;
  journeyDurationMin: number;
  routeCompatibilityScore: number; // 0-100
  pickupStopIndex: number;
  destinationStopIndex: number;
  stopsBetween: number;
}

export type SortOption = 'closest' | 'cheapest' | 'fastest' | 'comfortable';

export interface SearchFilters {
  taxiType: 'all' | TaxiType;
  maxPriceMad: number;
  maxWaitMin: number;
  minSeats: number;
}
