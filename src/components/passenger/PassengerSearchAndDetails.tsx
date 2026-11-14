import React, { useState, useMemo } from 'react';
import {
  MapPin,
  LocateFixed,
  ArrowUpDown,
  Search,
  Star,
  Clock,
  Users,
  CheckCircle2,
  CreditCard,
  Wallet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Play,
  Pause,
  AlertTriangle,
  Car,
} from 'lucide-react';
import { useTaxiSeat } from '../../context/TaxiSeatContext';
import { MARRAKECH_LANDMARKS, POPULAR_CORRIDORS } from '../../data/marrakechData';
import {
  matchTaxisForJourney,
  filterAndSortMatches,
  getLandmarkById,
} from '../../utils/matching';
import {
  MatchedTaxiResult,
  PaymentMethod,
  SearchFilters,
  SortOption,
} from '../../types';
import { MarrakechMap } from '../MarrakechMap';
import { SeatMap } from '../SeatMap';
import smallTaxiImg from '../../assets/images/small_taxi_card_1794684111938.jpg';
import largeTaxiImg from '../../assets/images/large_taxi_card_1794684111898.jpg';

interface PassengerSearchProps {
  activeTab: 'home' | 'search';
  onNavigateTab: (tab: 'home' | 'search' | 'bookings' | 'history' | 'profile') => void;
  pickupId: string;
  setPickupId: (id: string) => void;
  destinationId: string;
  setDestinationId: (id: string) => void;
}

export const PassengerSearchAndDetails: React.FC<PassengerSearchProps> = ({
  activeTab,
  onNavigateTab,
  pickupId,
  setPickupId,
  destinationId,
  setDestinationId,
}) => {
  const {
    t,
    dir,
    language,
    taxis,
    drivers,
    bookings,
    currentPassenger,
    isSimulatingMovement,
    toggleSimulation,
    createReservationAndPay,
    pushToast,
  } = useTaxiSeat();

  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [sortBy, setSortBy] = useState<SortOption>('closest');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    taxiType: 'all',
    maxPriceMad: 40,
    maxWaitMin: 25,
    minSeats: 1,
  });

  // Booking flow sub-steps: null -> 'seat' -> 'payment' -> 'success'
  const [selectedMatch, setSelectedMatch] = useState<MatchedTaxiResult | null>(null);
  const [bookingStep, setBookingStep] = useState<'seat' | 'payment' | 'success' | null>(null);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cmi_card_sim');
  const [isPaying, setIsPaying] = useState(false);
  const [createdBookingRef, setCreatedBookingRef] = useState<string | null>(null);
  const [mapSelectedTaxiId, setMapSelectedTaxiId] = useState<string | undefined>(undefined);

  const BackIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;

  const activeBooking = bookings.find(
    (b) =>
      b.passengerId === currentPassenger?.id &&
      b.status !== 'completed' &&
      b.status !== 'cancelled'
  );

  const rawMatches = useMemo(() => {
    return matchTaxisForJourney({
      taxis,
      drivers,
      landmarks: MARRAKECH_LANDMARKS,
      pickupId,
      destinationId,
    });
  }, [taxis, drivers, pickupId, destinationId]);

  const displayedMatches = useMemo(() => {
    return filterAndSortMatches(rawMatches, filters, sortBy);
  }, [rawMatches, filters, sortBy]);

  // Keep selectedMatch synced with live taxi seat state
  const liveSelectedTaxi = useMemo(() => {
    if (!selectedMatch) return null;
    return taxis.find((tx) => tx.id === selectedMatch.taxi.id) || selectedMatch.taxi;
  }, [selectedMatch, taxis]);

  const pickupLm = getLandmarkById(MARRAKECH_LANDMARKS, pickupId);
  const destLm = getLandmarkById(MARRAKECH_LANDMARKS, destinationId);

  const filteredFromLandmarks = MARRAKECH_LANDMARKS.filter((lm) =>
    lm.name[language].toLowerCase().includes(fromQuery.toLowerCase()) ||
    lm.district[language].toLowerCase().includes(fromQuery.toLowerCase())
  );

  const filteredToLandmarks = MARRAKECH_LANDMARKS.filter((lm) =>
    lm.name[language].toLowerCase().includes(toQuery.toLowerCase()) ||
    lm.district[language].toLowerCase().includes(toQuery.toLowerCase())
  );

  const handleDetectGps = () => {
    setPickupId('gueliz');
    const lm = getLandmarkById(MARRAKECH_LANDMARKS, 'gueliz');
    if (lm) setFromQuery(lm.name[language]);
    setSearchError(null);
    pushToast('info', t.passengerHome.gpsDetected);
  };

  const handleSwap = () => {
    const prevP = pickupId;
    const prevD = destinationId;
    setPickupId(prevD);
    setDestinationId(prevP);
    const pLm = getLandmarkById(MARRAKECH_LANDMARKS, prevD);
    const dLm = getLandmarkById(MARRAKECH_LANDMARKS, prevP);
    setFromQuery(pLm ? pLm.name[language] : '');
    setToQuery(dLm ? dLm.name[language] : '');
  };

  const triggerSearch = (from = pickupId, to = destinationId) => {
    setSearchError(null);
    if (!from || !to) {
      setSearchError(t.passengerHome.missingPointError);
      return;
    }
    if (from === to) {
      setSearchError(t.passengerHome.samePointError);
      return;
    }
    setIsSearching(true);
    onNavigateTab('search');
    setTimeout(() => {
      setIsSearching(false);
    }, 320);
  };

  const handleCorridorSelect = (fromId: string, toId: string) => {
    setPickupId(fromId);
    setDestinationId(toId);
    const f = getLandmarkById(MARRAKECH_LANDMARKS, fromId);
    const d = getLandmarkById(MARRAKECH_LANDMARKS, toId);
    setFromQuery(f ? f.name[language] : '');
    setToQuery(d ? d.name[language] : '');
    triggerSearch(fromId, toId);
  };

  const openSeatSelection = (match: MatchedTaxiResult) => {
    setSelectedMatch(match);
    setSelectedSeatId(null);
    setBookingStep('seat');
  };

  const handleConfirmPayment = () => {
    if (!selectedMatch || !selectedSeatId || !liveSelectedTaxi) return;
    const chosenSeat = liveSelectedTaxi.seats.find((s) => s.id === selectedSeatId);
    if (!chosenSeat || chosenSeat.status !== 'available') {
      pushToast('error', t.seatSelection.seatUnavailableError);
      setBookingStep('seat');
      return;
    }
    setIsPaying(true);
    setTimeout(() => {
      const res = createReservationAndPay({
        taxiId: liveSelectedTaxi.id,
        seatId: selectedSeatId,
        pickupId,
        destinationId,
        fareMad: selectedMatch.estimatedFareMad,
        etaMinutes: selectedMatch.etaMinutes,
        distanceKm: selectedMatch.distanceToPassengerKm,
        paymentMethod,
      });
      setIsPaying(false);
      if (res.ok && res.booking) {
        setCreatedBookingRef(res.booking.reference);
        setBookingStep('success');
      } else {
        pushToast('error', res.error || t.seatSelection.seatUnavailableError);
        setBookingStep('seat');
      }
    }, 650);
  };

  // --- SUB-VIEW: SEAT SELECTION / PAYMENT / SUCCESS ---
  if (bookingStep && selectedMatch && liveSelectedTaxi) {
    const chosenSeat = liveSelectedTaxi.seats.find((s) => s.id === selectedSeatId);
    const serviceFee = 2;
    const totalDue = selectedMatch.estimatedFareMad + serviceFee;

    return (
      <div className="max-w-4xl mx-auto space-y-5 pb-8">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (bookingStep === 'payment') setBookingStep('seat');
              else {
                setBookingStep(null);
                setSelectedMatch(null);
              }
            }}
            className="min-h-[42px] px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-sm font-semibold text-[#1E293B] inline-flex items-center gap-1.5"
          >
            <BackIcon className="w-4 h-4" />
            <span>{t.common.back}</span>
          </button>
          <span className="text-xs font-medium text-[#64748B]">
            {t.taxiTypes[liveSelectedTaxi.type]} · {liveSelectedTaxi.plateNumber}
          </span>
        </div>

        {bookingStep === 'seat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-5">
              {/* Driver & Route Summary */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#2563EB]">
                      {t.taxiTypes[liveSelectedTaxi.type]} · {liveSelectedTaxi.model}
                    </p>
                    <h2 className="text-xl font-bold text-[#1E293B] mt-0.5">
                      {selectedMatch.driver.fullName}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#1E293B]">
                        <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="tabular-nums">{selectedMatch.driver.rating}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{liveSelectedTaxi.plateNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {selectedMatch.etaMinutes} {t.common.min}
                      </span>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-xs text-[#64748B]">{t.search.estimatedFare}</p>
                    <p className="text-xl font-extrabold text-[#173B75] tabular-nums">
                      {selectedMatch.estimatedFareMad} {t.common.mad}
                    </p>
                  </div>
                </div>

                {/* Route Stop Timeline */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-[#64748B] mb-2.5">
                    {t.seatSelection.routePreview}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {liveSelectedTaxi.stops.map((stopId, idx) => {
                      const lm = getLandmarkById(MARRAKECH_LANDMARKS, stopId);
                      const isPickupStop = idx === selectedMatch.pickupStopIndex;
                      const isDestStop = idx === selectedMatch.destinationStopIndex;
                      const isPassed = idx < liveSelectedTaxi.currentStopIndex;
                      return (
                        <React.Fragment key={stopId}>
                          <span
                            className={`font-medium ${
                              isPickupStop
                                ? 'text-[#2563EB] font-bold underline underline-offset-4'
                                : isDestStop
                                ? 'text-[#173B75] font-bold underline underline-offset-4'
                                : isPassed
                                ? 'text-slate-400 line-through'
                                : 'text-[#1E293B]'
                            }`}
                          >
                            {lm?.name[language]}
                          </span>
                          {idx < liveSelectedTaxi.stops.length - 1 && (
                            <span className="text-slate-300" aria-hidden="true">
                              →
                            </span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Seat Map */}
              <div className="space-y-2.5">
                <h3 className="text-base font-bold text-[#1E293B]">
                  {t.seatSelection.chooseSeat}
                </h3>
                <SeatMap
                  taxiType={liveSelectedTaxi.type}
                  seats={liveSelectedTaxi.seats}
                  selectedSeatId={selectedSeatId}
                  onSelectSeat={(id) => setSelectedSeatId(id)}
                  language={language}
                  t={t}
                />
              </div>
            </div>

            {/* Fare Breakdown & CTA */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 lg:sticky lg:top-20">
              <h3 className="text-base font-bold text-[#1E293B]">
                {t.seatSelection.fareBreakdown}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>{t.seatSelection.pickupPoint}</span>
                  <span className="font-semibold text-[#1E293B]">{pickupLm?.name[language]}</span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>{t.seatSelection.destinationPoint}</span>
                  <span className="font-semibold text-[#1E293B]">{destLm?.name[language]}</span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>{t.seatSelection.selectedSeatLabel}</span>
                  <span className="font-bold text-[#2563EB] font-mono-tabular">
                    {chosenSeat ? `${chosenSeat.code} · ${chosenSeat.label[language]}` : '—'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-sm">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>{t.seatSelection.baseSeatFare}</span>
                  <span className="font-semibold text-[#1E293B] tabular-nums">
                    {selectedMatch.estimatedFareMad} {t.common.mad}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>{t.seatSelection.platformFee}</span>
                  <span className="font-semibold text-[#1E293B] tabular-nums">
                    {serviceFee} {t.common.mad}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">{t.seatSelection.totalToPay}</span>
                  <span className="text-lg font-extrabold text-[#173B75] tabular-nums">
                    {totalDue} {t.common.mad}
                  </span>
                </div>
              </div>

              {!selectedSeatId && (
                <p className="text-xs text-[#64748B] bg-[#F5F7FA] rounded-xl p-3">
                  {t.seatSelection.noSeatSelected}
                </p>
              )}

              <button
                type="button"
                disabled={!selectedSeatId}
                onClick={() => setBookingStep('payment')}
                className="w-full min-h-[48px] rounded-xl bg-[#2563EB] hover:bg-[#173B75] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors"
              >
                {t.seatSelection.continueToPayment}
              </button>
            </div>
          </div>
        )}

        {bookingStep === 'payment' && (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#1E293B]">{t.payment.title}</h2>
              <p className="text-xs text-[#64748B] mt-1">{t.payment.subtitle}</p>
            </div>

            <div className="bg-[#F5F7FA] border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">{t.seatSelection.selectedSeatLabel}</span>
                <span className="font-bold text-[#1E293B] font-mono-tabular">
                  {chosenSeat?.code} · {t.taxiTypes[liveSelectedTaxi.type]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">{t.seatSelection.routePreview}</span>
                <span className="font-medium text-[#1E293B] text-xs">
                  {pickupLm?.name[language]} → {destLm?.name[language]}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-[#1E293B]">{t.seatSelection.totalToPay}</span>
                <span className="text-lg font-extrabold text-[#2563EB] tabular-nums">
                  {totalDue} {t.common.mad}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-bold text-[#1E293B]">{t.payment.methodTitle}</p>
              {[
                {
                  id: 'cmi_card_sim' as PaymentMethod,
                  title: t.payment.methodCard,
                  desc: t.payment.methodCardDesc,
                  icon: <CreditCard className="w-5 h-5 text-[#2563EB]" />,
                },
                {
                  id: 'wallet_sim' as PaymentMethod,
                  title: t.payment.methodWallet,
                  desc: t.payment.methodWalletDesc,
                  icon: <Wallet className="w-5 h-5 text-[#2563EB]" />,
                },
                {
                  id: 'mobile_pay_sim' as PaymentMethod,
                  title: t.payment.methodMobile,
                  desc: t.payment.methodMobileDesc,
                  icon: <Smartphone className="w-5 h-5 text-[#2563EB]" />,
                },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full min-h-[58px] p-3.5 rounded-xl border text-start flex items-center gap-3 transition-colors ${
                    paymentMethod === m.id
                      ? 'border-[#2563EB] bg-[#DBEAFE]/40'
                      : 'border-slate-200 bg-white hover:bg-[#F5F7FA]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1E293B]">{m.title}</p>
                    <p className="text-xs text-[#64748B]">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-[#64748B] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>{t.payment.disclaimer}</span>
            </p>

            <button
              type="button"
              disabled={isPaying}
              onClick={handleConfirmPayment}
              className="w-full min-h-[48px] rounded-xl bg-[#16A34A] hover:bg-green-700 text-white font-semibold text-sm transition-colors"
            >
              {isPaying ? t.payment.processing : `${t.payment.payNow} (${totalDue} ${t.common.mad})`}
            </button>
          </div>
        )}

        {bookingStep === 'success' && (
          <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-7 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-[#16A34A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-[#1E293B]">{t.payment.successTitle}</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">{t.payment.successDesc}</p>
            {createdBookingRef && (
              <p className="font-mono-tabular text-sm font-bold text-[#173B75]">
                {t.common.reference}: {createdBookingRef}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setBookingStep(null);
                setSelectedMatch(null);
                onNavigateTab('bookings');
              }}
              className="w-full min-h-[46px] rounded-xl bg-[#2563EB] hover:bg-[#173B75] text-white font-semibold text-sm transition-colors"
            >
              {t.payment.viewBooking}
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- HOME TAB ---
  if (activeTab === 'home') {
    return (
      <div className="space-y-6 pb-8">
        {/* Active Trip Quick Banner */}
        {activeBooking && (
          <div className="bg-[#173B75] text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-[#DBEAFE] font-semibold">
                {t.passengerHome.activeTripBanner} · {activeBooking.reference}
              </p>
              <p className="text-sm font-bold mt-0.5">
                {t.bookingStatus[activeBooking.status]} · {t.common.seat} {activeBooking.seatCode}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('bookings')}
              className="min-h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              {t.passengerHome.trackTrip}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Search & Booking Panel */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#173B75] text-balance">
                {t.passengerHome.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                {t.passengerHome.subtitle}
              </p>
            </div>

            {/* FROM Input with GPS Detect + Autocomplete */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#1E293B]">
                  {t.passengerHome.fromLabel}
                </label>
                <button
                  type="button"
                  onClick={handleDetectGps}
                  className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>{t.passengerHome.detectGps}</span>
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#2563EB] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={fromQuery || (pickupLm ? pickupLm.name[language] : '')}
                  onFocus={() => setShowFromSuggestions(true)}
                  onChange={(e) => {
                    setFromQuery(e.target.value);
                    setPickupId('');
                    setShowFromSuggestions(true);
                  }}
                  placeholder={t.passengerHome.fromPlaceholder}
                  className="w-full min-h-[46px] ps-10 pe-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>
              {showFromSuggestions && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto divide-y divide-slate-100">
                  {filteredFromLandmarks.map((lm) => (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => {
                        setPickupId(lm.id);
                        setFromQuery(lm.name[language]);
                        setShowFromSuggestions(false);
                        setSearchError(null);
                      }}
                      className="w-full px-3.5 py-2.5 text-start hover:bg-[#DBEAFE]/40 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#1E293B]">{lm.name[language]}</span>
                      <span className="text-[#64748B]">{lm.district[language]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-end -my-2">
              <button
                type="button"
                onClick={handleSwap}
                aria-label={t.passengerHome.swapLocations}
                className="min-h-[36px] min-w-[36px] rounded-xl border border-slate-200 bg-[#F5F7FA] hover:bg-[#DBEAFE] text-[#173B75] flex items-center justify-center transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* TO Input with Autocomplete */}
            <div className="relative">
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                {t.passengerHome.toLabel}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#173B75] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={toQuery || (destLm ? destLm.name[language] : '')}
                  onFocus={() => setShowToSuggestions(true)}
                  onChange={(e) => {
                    setToQuery(e.target.value);
                    setDestinationId('');
                    setShowToSuggestions(true);
                  }}
                  placeholder={t.passengerHome.toPlaceholder}
                  className="w-full min-h-[46px] ps-10 pe-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>
              {showToSuggestions && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto divide-y divide-slate-100">
                  {filteredToLandmarks.map((lm) => (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => {
                        setDestinationId(lm.id);
                        setToQuery(lm.name[language]);
                        setShowToSuggestions(false);
                        setSearchError(null);
                      }}
                      className="w-full px-3.5 py-2.5 text-start hover:bg-[#DBEAFE]/40 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#1E293B]">{lm.name[language]}</span>
                      <span className="text-[#64748B]">{lm.district[language]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {searchError && (
              <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {searchError}
              </p>
            )}

            <button
              type="button"
              onClick={() => triggerSearch()}
              className="w-full min-h-[48px] rounded-xl bg-[#2563EB] hover:bg-[#173B75] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>{t.passengerHome.findTaxis}</span>
            </button>

            {/* Popular Corridors */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-xs font-bold text-[#64748B]">
                {t.passengerHome.popularCorridors}
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CORRIDORS.map((c) => {
                  const f = getLandmarkById(MARRAKECH_LANDMARKS, c.fromId);
                  const d = getLandmarkById(MARRAKECH_LANDMARKS, c.toId);
                  if (!f || !d) return null;
                  return (
                    <button
                      key={`${c.fromId}_${c.toId}`}
                      type="button"
                      onClick={() => handleCorridorSelect(c.fromId, c.toId)}
                      className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#F5F7FA] hover:bg-[#DBEAFE] border border-slate-200 text-xs font-semibold text-[#173B75] transition-colors"
                    >
                      {f.name[language].split(' (')[0]} → {d.name[language].split(' (')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-[#1E293B]">
                {t.passengerHome.activeTaxisOnMap} ({taxis.filter((tx) => tx.isOnline).length})
              </p>
              <button
                type="button"
                onClick={toggleSimulation}
                className="min-h-[36px] px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#1E293B] inline-flex items-center gap-1.5 hover:bg-[#F5F7FA]"
              >
                {isSimulatingMovement ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{t.passengerHome.pauseSimulation}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{t.passengerHome.simulateMovement}</span>
                  </>
                )}
              </button>
            </div>
            <MarrakechMap
              landmarks={MARRAKECH_LANDMARKS}
              taxis={taxis}
              language={language}
              pickupId={pickupId}
              destinationId={destinationId}
              selectedTaxiId={mapSelectedTaxiId}
              onSelectTaxi={(id) => setMapSelectedTaxiId(id)}
            />
          </div>
        </div>
      </div>
    );
  }

  // --- SEARCH RESULTS TAB ---
  return (
    <div className="space-y-5 pb-8">
      {/* Journey Summary Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-[#173B75]">{t.search.resultsTitle}</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            {pickupLm && destLm
              ? `${pickupLm.name[language]} → ${destLm.name[language]} · ${t.search.matchingRuleNote}`
              : t.search.resultsSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="min-h-[40px] px-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] hover:bg-[#DBEAFE] text-xs font-semibold text-[#1E293B] inline-flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
            <span>{t.search.filtersTitle}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('home')}
            className="min-h-[40px] px-3.5 rounded-xl bg-[#173B75] text-white text-xs font-semibold"
          >
            {t.search.modifySearch}
          </button>
        </div>
      </div>

      {/* Comparison Sort Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { key: 'closest', label: t.search.sortClosest },
            { key: 'cheapest', label: t.search.sortCheapest },
            { key: 'fastest', label: t.search.sortFastest },
            { key: 'comfortable', label: t.search.sortComfortable },
          ] as Array<{ key: SortOption; label: string }>
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSortBy(tab.key)}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
              sortBy === tab.key
                ? 'bg-[#2563EB] border-[#2563EB] text-white'
                : 'bg-white border-slate-200 text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Collapsible Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              {t.search.taxiTypeLabel}
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#F5F7FA] p-1 rounded-xl border border-slate-200">
              {(['all', 'small', 'large'] as const).map((typeOpt) => (
                <button
                  key={typeOpt}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, taxiType: typeOpt }))}
                  className={`py-1.5 text-xs font-semibold rounded-lg ${
                    filters.taxiType === typeOpt
                      ? 'bg-white text-[#173B75] shadow-xs'
                      : 'text-[#64748B]'
                  }`}
                >
                  {typeOpt === 'all' ? t.common.all : t.taxiTypes[typeOpt]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              {t.search.maxPriceLabel}: <span className="tabular-nums text-[#2563EB]">{filters.maxPriceMad}</span>
            </label>
            <input
              type="range"
              min={8}
              max={50}
              value={filters.maxPriceMad}
              onChange={(e) => setFilters((f) => ({ ...f, maxPriceMad: Number(e.target.value) }))}
              className="w-full accent-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              {t.search.maxWaitLabel}: <span className="tabular-nums text-[#2563EB]">{filters.maxWaitMin}</span>
            </label>
            <input
              type="range"
              min={3}
              max={30}
              value={filters.maxWaitMin}
              onChange={(e) => setFilters((f) => ({ ...f, maxWaitMin: Number(e.target.value) }))}
              className="w-full accent-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              {t.search.minSeatsLabel}: <span className="tabular-nums text-[#2563EB]">{filters.minSeats}</span>
            </label>
            <input
              type="range"
              min={1}
              max={4}
              value={filters.minSeats}
              onChange={(e) => setFilters((f) => ({ ...f, minSeats: Number(e.target.value) }))}
              className="w-full accent-[#2563EB]"
            />
          </div>
        </div>
      )}

      {/* Results List */}
      {isSearching ? (
        <div className="space-y-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="h-32 rounded-2xl bg-white border border-slate-200 p-5 animate-pulse flex items-center justify-between"
            >
              <div className="space-y-2 w-2/3">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
              <div className="h-10 w-28 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : displayedMatches.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <Car className="w-10 h-10 text-[#64748B] mx-auto" />
          <h3 className="text-base font-bold text-[#1E293B]">{t.search.noResultsTitle}</h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
            {t.search.noResultsDesc}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                setFilters({ taxiType: 'all', maxPriceMad: 50, maxWaitMin: 30, minSeats: 1 })
              }
              className="min-h-[42px] px-4 rounded-xl border border-slate-200 text-xs font-semibold text-[#1E293B]"
            >
              {t.common.reset}
            </button>
            <button
              type="button"
              onClick={() => handleCorridorSelect('gueliz', 'jemaa')}
              className="min-h-[42px] px-4 rounded-xl bg-[#2563EB] text-white text-xs font-semibold"
            >
              Guéliz → Jemaa el-Fna
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-3.5">
            {displayedMatches.map((match) => {
              const imgSrc = match.taxi.type === 'small' ? smallTaxiImg : largeTaxiImg;
              return (
                <article
                  key={match.taxi.id}
                  className="bg-white border border-slate-200 hover:border-[#2563EB] rounded-2xl p-4 sm:p-5 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={imgSrc}
                        alt={t.taxiTypes[match.taxi.type]}
                        referrerPolicy="no-referrer"
                        className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-[#F5F7FA]"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-[#2563EB]">
                            {t.taxiTypes[match.taxi.type]}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-[#64748B] truncate">{match.taxi.model}</span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="font-mono-tabular text-[#64748B]">
                            {match.taxi.plateNumber}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#1E293B]">
                          {match.driver.fullName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]">
                          <span className="inline-flex items-center gap-1 font-semibold text-[#1E293B]">
                            <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                            <span className="tabular-nums">{match.driver.rating}</span>
                          </span>
                          <span className="tabular-nums">
                            {match.distanceToPassengerKm} {t.common.km}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[#173B75] font-semibold tabular-nums">
                            <Clock className="w-3.5 h-3.5" />
                            {match.etaMinutes} {t.common.min}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[#16A34A] font-semibold tabular-nums">
                            <Users className="w-3.5 h-3.5" />
                            {match.availableSeatsCount} {t.search.seatsAvailable}
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B] pt-1">
                          {match.taxi.headingLabel[language]} ·{' '}
                          <span className="font-semibold text-[#16A34A] tabular-nums">
                            {match.routeCompatibilityScore}% {t.search.routeMatch}
                          </span>{' '}
                          · <span className="tabular-nums">~{match.journeyDurationMin} {t.common.min}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                      <div className="text-start sm:text-end">
                        <p className="text-[11px] text-[#64748B]">{t.search.estimatedFare}</p>
                        <p className="text-lg font-extrabold text-[#173B75] tabular-nums">
                          {match.estimatedFareMad} {t.common.mad}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openSeatSelection(match)}
                        className="min-h-[42px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#173B75] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        {t.search.selectSeatCta}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <MarrakechMap
              landmarks={MARRAKECH_LANDMARKS}
              taxis={displayedMatches.map((m) => m.taxi)}
              language={language}
              pickupId={pickupId}
              destinationId={destinationId}
              selectedTaxiId={displayedMatches[0]?.taxi.id}
              onSelectTaxi={(id) => {
                const found = displayedMatches.find((m) => m.taxi.id === id);
                if (found) openSeatSelection(found);
              }}
              heightClass="h-[320px] lg:h-[440px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
