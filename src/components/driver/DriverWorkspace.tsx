import React, { useState } from 'react';
import {
  Power,
  Navigation,
  CheckCircle2,
  XCircle,
  UserCheck,
  LogOut as DepartureIcon,
  TrendingUp,
  Car,
  Users,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useTaxiSeat } from '../../context/TaxiSeatContext';
import { MARRAKECH_LANDMARKS } from '../../data/marrakechData';
import { getLandmarkById, canPerformBookingTransition } from '../../utils/matching';
import { MarrakechMap } from '../MarrakechMap';
import { SeatMap } from '../SeatMap';
import { BookingStatusIndicator, LanguageSelector } from '../SharedControls';
import { TaxiType } from '../../types';

export type DriverTab = 'dashboard' | 'route' | 'bookings' | 'earnings' | 'profile';

export const DriverWorkspace: React.FC<{ activeTab: DriverTab; onTabChange: (tab: DriverTab) => void }> = ({
  activeTab,
  onTabChange,
}) => {
  const {
    t,
    language,
    drivers,
    currentDriver,
    currentDriverTaxi,
    bookings,
    toggleDriverOnline,
    toggleDriverAcceptingBookings,
    updateDriverRoute,
    advanceDriverAlongRoute,
    toggleManualSeat,
    driverAcceptBooking,
    driverRejectBooking,
    driverMarkApproaching,
    driverConfirmBoarding,
    driverConfirmDeparture,
    switchActiveDriver,
    registerOrUpdateDriver,
    setRole,
  } = useTaxiSeat();

  // Route editor state
  const [originId, setOriginId] = useState(currentDriverTaxi.stops[0] || 'gueliz');
  const [destId, setDestId] = useState(
    currentDriverTaxi.stops[currentDriverTaxi.stops.length - 1] || 'jemaa'
  );
  const [midStops, setMidStops] = useState<string[]>(
    currentDriverTaxi.stops.slice(1, Math.max(1, currentDriverTaxi.stops.length - 1))
  );

  // Driver profile editor state
  const [drvName, setDrvName] = useState(currentDriver.fullName);
  const [drvPhone, setDrvPhone] = useState(currentDriver.phone);
  const [drvEmail, setDrvEmail] = useState(currentDriver.email);
  const [drvLicense, setDrvLicense] = useState(currentDriver.licenseNumber);
  const [drvTaxiType, setDrvTaxiType] = useState<TaxiType>(currentDriverTaxi.type);
  const [drvModel, setDrvModel] = useState(currentDriverTaxi.model);
  const [drvPlate, setDrvPlate] = useState(currentDriverTaxi.plateNumber);

  React.useEffect(() => {
    setOriginId(currentDriverTaxi.stops[0] || 'gueliz');
    setDestId(currentDriverTaxi.stops[currentDriverTaxi.stops.length - 1] || 'jemaa');
    setMidStops(currentDriverTaxi.stops.slice(1, Math.max(1, currentDriverTaxi.stops.length - 1)));
    setDrvName(currentDriver.fullName);
    setDrvPhone(currentDriver.phone);
    setDrvEmail(currentDriver.email);
    setDrvLicense(currentDriver.licenseNumber);
    setDrvTaxiType(currentDriverTaxi.type);
    setDrvModel(currentDriverTaxi.model);
    setDrvPlate(currentDriverTaxi.plateNumber);
  }, [currentDriver.id, currentDriverTaxi.id]);

  const availableSeats = currentDriverTaxi.seats.filter((s) => s.status === 'available').length;
  const reservedOrOccupied = currentDriverTaxi.capacity - availableSeats;
  const currentStopLm = getLandmarkById(
    MARRAKECH_LANDMARKS,
    currentDriverTaxi.stops[currentDriverTaxi.currentStopIndex] || currentDriverTaxi.stops[0]
  );
  const destStopLm = getLandmarkById(
    MARRAKECH_LANDMARKS,
    currentDriverTaxi.stops[currentDriverTaxi.stops.length - 1]
  );

  const driverBookings = bookings.filter((b) => b.driverId === currentDriver.id);
  const activeDriverBookings = driverBookings.filter(
    (b) =>
      b.status !== 'cancelled' &&
      (b.status !== 'completed' || !b.driverConfirmedDeparture)
  );
  const completedDriverBookings = driverBookings.filter(
    (b) => b.status === 'completed' && b.driverConfirmedDeparture
  );

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (originId === destId) return;
    const uniqueMid = midStops.filter((id) => id !== originId && id !== destId);
    updateDriverRoute([originId, ...uniqueMid, destId], originId, destId);
  };

  const toggleMidStop = (id: string) => {
    if (id === originId || id === destId) return;
    setMidStops((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    registerOrUpdateDriver({
      fullName: drvName,
      phone: drvPhone,
      email: drvEmail,
      licenseNumber: drvLicense,
      taxiType: drvTaxiType,
      model: drvModel,
      plateNumber: drvPlate,
      capacity: drvTaxiType === 'small' ? 3 : 6,
    });
  };

  // --- DASHBOARD TAB ---
  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6 pb-8">
        {/* Top Availability Control Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#2563EB]">
              {t.taxiTypes[currentDriverTaxi.type]} · {currentDriverTaxi.model} ·{' '}
              <span className="font-mono-tabular">{currentDriverTaxi.plateNumber}</span>
            </p>
            <h1 className="text-xl font-extrabold text-[#1E293B]">{currentDriver.fullName}</h1>
            <p className="text-xs text-[#64748B]">
              {currentDriverTaxi.isOnline ? t.driver.statusOnline : t.driver.statusOffline} ·{' '}
              {currentDriverTaxi.acceptingBookings
                ? t.driver.acceptingBookings
                : t.driver.pausedBookings}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={toggleDriverOnline}
              className={`min-h-[44px] px-4 rounded-xl font-semibold text-xs inline-flex items-center gap-2 transition-colors ${
                currentDriverTaxi.isOnline
                  ? 'bg-[#16A34A] text-white hover:bg-green-700'
                  : 'bg-slate-200 text-[#1E293B] hover:bg-slate-300'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>
                {currentDriverTaxi.isOnline ? t.driver.statusOnline : t.driver.statusOffline}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleDriverAcceptingBookings}
              className={`min-h-[44px] px-4 rounded-xl border font-semibold text-xs transition-colors ${
                currentDriverTaxi.acceptingBookings
                  ? 'border-[#2563EB] bg-[#DBEAFE]/50 text-[#173B75]'
                  : 'border-amber-300 bg-amber-50 text-amber-800'
              }`}
            >
              {currentDriverTaxi.acceptingBookings
                ? t.driver.acceptingBookings
                : t.driver.pausedBookings}
            </button>
          </div>
        </div>

        {/* 4-Column Driver KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-[#64748B]">{t.driver.availableSeats}</p>
            <p className="text-2xl font-extrabold text-[#2563EB] tabular-nums mt-1">
              {availableSeats} / {currentDriverTaxi.capacity}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-[#64748B]">{t.driver.reservedSeats}</p>
            <p className="text-2xl font-extrabold text-[#1E293B] tabular-nums mt-1">
              {reservedOrOccupied}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-[#64748B]">{t.driver.activeBookings}</p>
            <p className="text-2xl font-extrabold text-[#173B75] tabular-nums mt-1">
              {activeDriverBookings.length}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-[#64748B]">{t.driver.estimatedEarnings}</p>
            <p className="text-2xl font-extrabold text-[#16A34A] tabular-nums mt-1">
              {currentDriver.todayEarningsMad} {t.common.mad}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Active Route + GPS Position */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#64748B]">{t.driver.currentLocation}</p>
                <p className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  <span>{currentStopLm?.name[language]}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">{t.driver.currentDestination}</p>
                <p className="text-sm font-bold text-[#173B75] mt-0.5">
                  {destStopLm?.name[language]}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-[#64748B] mb-1.5">{t.driver.currentRoute}</p>
                <p className="text-xs font-semibold text-[#1E293B] leading-relaxed">
                  {currentDriverTaxi.stops
                    .map((id) => getLandmarkById(MARRAKECH_LANDMARKS, id)?.name[language])
                    .join(' → ')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={advanceDriverAlongRoute}
                className="min-h-[42px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#173B75] text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.driver.advanceRouteBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => onTabChange('bookings')}
                className="min-h-[42px] px-4 rounded-xl border border-slate-200 bg-[#F5F7FA] hover:bg-[#DBEAFE] text-xs font-semibold text-[#173B75]"
              >
                {t.nav.bookings} ({activeDriverBookings.length})
              </button>
            </div>
          </div>

          {/* Live Driver Map */}
          <div className="lg:col-span-7">
            <MarrakechMap
              landmarks={MARRAKECH_LANDMARKS}
              taxis={[currentDriverTaxi]}
              language={language}
              selectedTaxiId={currentDriverTaxi.id}
              heightClass="h-[320px]"
            />
          </div>
        </div>
      </div>
    );
  }

  // --- MY ROUTE TAB ---
  if (activeTab === 'route') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-[#173B75]">
              {t.driver.manageRouteTitle}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!currentDriverTaxi.isOnline) toggleDriverOnline();
                }}
                className="min-h-[38px] px-3.5 rounded-xl bg-[#16A34A] text-white text-xs font-semibold"
              >
                {t.driver.startJourney}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentDriverTaxi.isOnline) toggleDriverOnline();
                }}
                className="min-h-[38px] px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#64748B]"
              >
                {t.driver.endJourney}
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveRoute} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  {t.driver.originLabel}
                </label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm"
                >
                  {MARRAKECH_LANDMARKS.map((lm) => (
                    <option key={lm.id} value={lm.id}>
                      {lm.name[language]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  {t.driver.destinationLabel}
                </label>
                <select
                  value={destId}
                  onChange={(e) => setDestId(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm"
                >
                  {MARRAKECH_LANDMARKS.map((lm) => (
                    <option key={lm.id} value={lm.id}>
                      {lm.name[language]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#1E293B] mb-2">
                {t.driver.addStopLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {MARRAKECH_LANDMARKS.filter(
                  (lm) => lm.id !== originId && lm.id !== destId
                ).map((lm) => {
                  const selected = midStops.includes(lm.id);
                  return (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => toggleMidStop(lm.id)}
                      className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold border transition-colors ${
                        selected
                          ? 'bg-[#2563EB] border-[#2563EB] text-white'
                          : 'bg-[#F5F7FA] border-slate-200 text-[#64748B]'
                      }`}
                    >
                      {lm.name[language].split(' (')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="min-h-[44px] px-5 rounded-xl bg-[#173B75] hover:bg-[#2563EB] text-white text-sm font-semibold transition-colors"
            >
              {t.driver.updateRoute}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <h3 className="text-base font-bold text-[#1E293B]">
              {t.driver.seatControlTitle}
            </h3>
            <p className="text-xs text-[#64748B]">{t.driver.seatControlDesc}</p>
          </div>
          <SeatMap
            taxiType={currentDriverTaxi.type}
            seats={currentDriverTaxi.seats}
            onSelectSeat={(seatId) => toggleManualSeat(currentDriverTaxi.id, seatId)}
            language={language}
            t={t}
            driverMode
          />
        </div>
      </div>
    );
  }

  // --- BOOKINGS MANAGEMENT TAB ---
  if (activeTab === 'bookings') {
    return (
      <div className="space-y-5 pb-8">
        <h2 className="text-xl font-extrabold text-[#173B75]">{t.driver.incomingTitle}</h2>

        {activeDriverBookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
            <Users className="w-10 h-10 text-[#64748B] mx-auto" />
            <h3 className="text-base font-bold text-[#1E293B]">{t.driver.noBookingsTitle}</h3>
            <p className="text-xs text-[#64748B]">{t.driver.noBookingsDesc}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDriverBookings.map((b) => {
              const pickupLm = getLandmarkById(MARRAKECH_LANDMARKS, b.pickupId);
              const destLm = getLandmarkById(MARRAKECH_LANDMARKS, b.destinationId);

              const canAccept = canPerformBookingTransition(b.status, 'driver_accept');
              const canReject = canPerformBookingTransition(b.status, 'driver_reject');
              const canApproach = canPerformBookingTransition(b.status, 'driver_approaching');
              const canBoard = canPerformBookingTransition(b.status, 'driver_board_passenger');
              const canDepart =
                canPerformBookingTransition(b.status, 'driver_confirm_departure') &&
                !b.driverConfirmedDeparture;

              return (
                <div
                  key={b.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono-tabular font-bold text-[#173B75]">
                          {b.reference}
                        </span>
                        <span className="text-slate-300" aria-hidden="true">·</span>
                        <BookingStatusIndicator status={b.status} />
                      </div>
                      <h3 className="text-base font-bold text-[#1E293B]">{b.passengerName}</h3>
                      <p className="text-xs text-[#64748B]">
                        {pickupLm?.name[language]} → {destLm?.name[language]} ·{' '}
                        <span className="font-bold text-[#2563EB]">
                          {t.common.seat} {b.seatCode}
                        </span>
                      </p>
                    </div>

                    <div className="text-end">
                      <p className="text-lg font-extrabold text-[#16A34A] tabular-nums">
                        {b.fareMad} {t.common.mad}
                      </p>
                      <p className="text-xs text-[#64748B]">{b.passengerPhone}</p>
                    </div>
                  </div>

                  {b.passengerConfirmedArrival && !b.driverConfirmedDeparture && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900">
                      {t.driver.passengerConfirmedWait}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
                    {canAccept && (
                      <button
                        type="button"
                        onClick={() => driverAcceptBooking(b.id)}
                        className="min-h-[42px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#173B75] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.driver.accept}</span>
                      </button>
                    )}
                    {canReject && (
                      <button
                        type="button"
                        onClick={() => driverRejectBooking(b.id)}
                        className="min-h-[42px] px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t.driver.reject}</span>
                      </button>
                    )}
                    {canApproach && (
                      <button
                        type="button"
                        onClick={() => driverMarkApproaching(b.id)}
                        className="min-h-[42px] px-4 rounded-xl bg-[#DBEAFE] hover:bg-blue-200 text-[#173B75] text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>{t.driver.markApproaching}</span>
                      </button>
                    )}
                    {canBoard && (
                      <button
                        type="button"
                        onClick={() => driverConfirmBoarding(b.id)}
                        className="min-h-[42px] px-4 rounded-xl bg-[#16A34A] hover:bg-green-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{t.driver.confirmBoarding}</span>
                      </button>
                    )}
                    {canDepart && (
                      <button
                        type="button"
                        onClick={() => driverConfirmDeparture(b.id)}
                        className="min-h-[42px] px-4 rounded-xl bg-[#173B75] hover:bg-[#2563EB] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <DepartureIcon className="w-4 h-4" />
                        <span>{t.driver.confirmDeparture}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- EARNINGS TAB ---
  if (activeTab === 'earnings') {
    const maxDay = Math.max(...currentDriver.dailyChartMad, 1);
    const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
      <div className="space-y-6 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-[#64748B]">{t.driver.earningsToday}</p>
            <p className="text-2xl font-extrabold text-[#16A34A] tabular-nums mt-1">
              {currentDriver.todayEarningsMad} {t.common.mad}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-[#64748B]">{t.driver.earningsWeek}</p>
            <p className="text-2xl font-extrabold text-[#173B75] tabular-nums mt-1">
              {currentDriver.weeklyEarningsMad} {t.common.mad}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-[#64748B]">{t.driver.earningsMonth}</p>
            <p className="text-2xl font-extrabold text-[#2563EB] tabular-nums mt-1">
              {currentDriver.monthlyEarningsMad} {t.common.mad}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-[#64748B]">{t.driver.completedRides}</p>
            <p className="text-2xl font-extrabold text-[#1E293B] tabular-nums mt-1">
              {currentDriver.totalRides}
            </p>
          </div>
        </div>

        {/* 7-day SVG Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              <span>{t.driver.weeklyChartTitle}</span>
            </h3>
          </div>
          <div className="grid grid-cols-7 gap-3 items-end h-44 pt-4">
            {currentDriver.dailyChartMad.map((val, idx) => {
              const pct = Math.round((val / maxDay) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-mono-tabular font-semibold text-[#64748B]">
                    {val}
                  </span>
                  <div className="w-full max-w-[44px] bg-[#F5F7FA] rounded-t-xl h-28 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-xl transition-all ${
                        idx === 6 ? 'bg-[#2563EB]' : 'bg-[#173B75]/75'
                      }`}
                      style={{ height: `${Math.max(12, pct)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#1E293B]">{dayLabels[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Rides Payout History */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#1E293B]">{t.driver.recentPayouts}</h3>
          </div>
          {completedDriverBookings.length === 0 ? (
            <p className="p-6 text-xs text-[#64748B]">{t.bookings.noHistoryDesc}</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {completedDriverBookings.map((b) => (
                <div key={b.id} className="px-5 py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono-tabular font-bold text-[#173B75]">{b.reference}</span>
                    <span className="text-slate-300 mx-2">·</span>
                    <span className="font-semibold text-[#1E293B]">{b.passengerName}</span>
                    <span className="text-slate-300 mx-2">·</span>
                    <span className="text-[#64748B]">
                      {t.common.seat} {b.seatCode}
                    </span>
                  </div>
                  <span className="font-bold text-[#16A34A] tabular-nums">
                    +{b.fareMad} {t.common.mad}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DRIVER PROFILE & REGISTRATION TAB ---
  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
      {/* Demo Driver Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <p className="text-xs font-bold text-[#64748B]">{t.driver.switchDemoDriver}</p>
        <div className="flex flex-wrap gap-2">
          {drivers.map((drv) => (
            <button
              key={drv.id}
              type="button"
              onClick={() => {
                switchActiveDriver(drv.id);
                setDrvName(drv.fullName);
                setDrvPhone(drv.phone);
                setDrvEmail(drv.email);
                setDrvLicense(drv.licenseNumber);
              }}
              className={`min-h-[38px] px-3 rounded-xl text-xs font-semibold border transition-colors ${
                drv.id === currentDriver.id
                  ? 'bg-[#2563EB] border-[#2563EB] text-white'
                  : 'bg-[#F5F7FA] border-slate-200 text-[#1E293B]'
              }`}
            >
              {drv.fullName}
            </button>
          ))}
        </div>
      </div>

      {/* Registration / Vehicle Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#DBEAFE] text-[#173B75] flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#1E293B]">{t.driver.registerTitle}</h2>
            <p className="text-xs text-[#64748B]">{t.driver.registerSubtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.welcome.fullName}
            </label>
            <input
              type="text"
              value={drvName}
              onChange={(e) => setDrvName(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.welcome.phone}
            </label>
            <input
              type="tel"
              value={drvPhone}
              onChange={(e) => setDrvPhone(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.welcome.email}
            </label>
            <input
              type="email"
              value={drvEmail}
              onChange={(e) => setDrvEmail(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.driver.licenseLabel}
            </label>
            <input
              type="text"
              value={drvLicense}
              onChange={(e) => setDrvLicense(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm font-mono-tabular"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.search.taxiTypeLabel}
            </label>
            <select
              value={drvTaxiType}
              onChange={(e) => setDrvTaxiType(e.target.value as TaxiType)}
              className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm"
            >
              <option value="small">{t.taxiTypes.small} (3 {t.common.seats})</option>
              <option value="large">{t.taxiTypes.large} (6 {t.common.seats})</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.driver.modelLabel}
            </label>
            <input
              type="text"
              value={drvModel}
              onChange={(e) => setDrvModel(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.driver.plateLabel}
            </label>
            <input
              type="text"
              value={drvPlate}
              onChange={(e) => setDrvPlate(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm font-mono-tabular"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.driver.capacityLabel}
            </label>
            <input
              type="text"
              readOnly
              value={`${drvTaxiType === 'small' ? 3 : 6} ${t.common.seats}`}
              className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-100 text-sm text-[#64748B]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="min-h-[44px] px-5 rounded-xl bg-[#2563EB] hover:bg-[#173B75] text-white text-sm font-semibold transition-colors"
        >
          {t.common.save}
        </button>
      </form>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
        <LanguageSelector />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRole('passenger')}
            className="min-h-[40px] px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#173B75]"
          >
            {t.welcome.continuePassenger}
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className="min-h-[40px] px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#64748B]"
          >
            <ShieldCheck className="w-3.5 h-3.5 inline me-1" />
            {t.roles.admin}
          </button>
        </div>
      </div>
    </div>
  );
};
