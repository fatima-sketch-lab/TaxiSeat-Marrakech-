import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  User,
  LogOut,
  RotateCcw,
  Car,
} from 'lucide-react';
import { useTaxiSeat } from '../../context/TaxiSeatContext';
import { MARRAKECH_LANDMARKS } from '../../data/marrakechData';
import { getLandmarkById, canPerformBookingTransition } from '../../utils/matching';
import { BookingStatusIndicator, LanguageSelector } from '../SharedControls';
import { MarrakechMap } from '../MarrakechMap';

export const PassengerBookingsTab: React.FC<{
  onGoSearch: () => void;
}> = ({ onGoSearch }) => {
  const {
    t,
    dir,
    language,
    bookings,
    taxis,
    drivers,
    currentPassenger,
    passengerCancelBooking,
    passengerConfirmArrival,
    rateBookingDriver,
    driverAcceptBooking,
    driverMarkApproaching,
    driverConfirmBoarding,
    pushToast,
  } = useTaxiSeat();

  const [ratingTargetId, setRatingTargetId] = useState<string | null>(null);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  // Show active bookings + newly completed bookings awaiting rating or driver departure release
  const relevantBookings = bookings.filter(
    (b) =>
      b.passengerId === currentPassenger?.id &&
      (b.status !== 'cancelled' &&
        (b.status !== 'completed' || !b.driverConfirmedDeparture || !b.ratingGiven))
  );

  const advanceSimulatedStep = (bookingId: string, status: string) => {
    if (status === 'pending_confirmation') driverAcceptBooking(bookingId);
    else if (status === 'confirmed') driverMarkApproaching(bookingId);
    else if (status === 'driver_approaching') driverConfirmBoarding(bookingId);
  };

  if (relevantBookings.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 max-w-xl mx-auto">
        <Car className="w-10 h-10 text-[#2563EB] mx-auto" />
        <h2 className="text-lg font-bold text-[#1E293B]">{t.bookings.noActiveTitle}</h2>
        <p className="text-xs sm:text-sm text-[#64748B]">{t.bookings.noActiveDesc}</p>
        <button
          type="button"
          onClick={onGoSearch}
          className="min-h-[44px] px-5 rounded-xl bg-[#2563EB] hover:bg-[#173B75] text-white text-xs sm:text-sm font-semibold transition-colors"
        >
          {t.bookings.findFirstTaxi}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <h2 className="text-xl font-extrabold text-[#173B75]">{t.bookings.activeTitle}</h2>

      <div className="space-y-5">
        {relevantBookings.map((b) => {
          const taxi = taxis.find((tx) => tx.id === b.taxiId);
          const driver = drivers.find((d) => d.id === b.driverId);
          const pickupLm = getLandmarkById(MARRAKECH_LANDMARKS, b.pickupId);
          const destLm = getLandmarkById(MARRAKECH_LANDMARKS, b.destinationId);

          const canCancel = canPerformBookingTransition(b.status, 'passenger_cancel');
          const canComplete = canPerformBookingTransition(b.status, 'passenger_complete');

          const stepOrder = [
            'pending_confirmation',
            'confirmed',
            'driver_approaching',
            'picked_up',
            'completed',
          ];
          const currentStepIdx = stepOrder.indexOf(b.status);

          return (
            <div
              key={b.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="font-mono-tabular font-bold text-[#173B75]">
                      {b.reference}
                    </span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <BookingStatusIndicator status={b.status} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E293B] flex items-center gap-2">
                    <span>{pickupLm?.name[language]}</span>
                    <DirectionalArrow className="w-4 h-4 text-[#2563EB]" />
                    <span>{destLm?.name[language]}</span>
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {driver?.fullName} · {taxi ? t.taxiTypes[taxi.type] : ''} ({taxi?.plateNumber}) ·{' '}
                    <span className="font-semibold text-[#1E293B]">
                      {t.common.seat} {b.seatCode}
                    </span>
                  </p>
                </div>

                <div className="text-end">
                  <p className="text-lg font-extrabold text-[#173B75] tabular-nums">
                    {b.totalMad} {t.common.mad}
                  </p>
                  <p className="text-xs font-semibold text-[#16A34A]">
                    {b.paymentStatus === 'refunded'
                      ? t.bookings.refundedBadge
                      : t.bookings.paidBadge}
                  </p>
                </div>
              </div>

              {/* Lifecycle Stepper */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {stepOrder.map((st, idx) => (
                  <div key={st} className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full transition-colors ${
                        idx <= currentStepIdx ? 'bg-[#2563EB]' : 'bg-slate-200'
                      }`}
                    />
                    <p className="text-[10px] text-[#64748B] truncate hidden sm:block">
                      {t.bookingStatus[st as keyof typeof t.bookingStatus]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Route Map Preview for Active Trip */}
              {taxi && (
                <MarrakechMap
                  landmarks={MARRAKECH_LANDMARKS}
                  taxis={[taxi]}
                  language={language}
                  pickupId={b.pickupId}
                  destinationId={b.destinationId}
                  selectedTaxiId={taxi.id}
                  heightClass="h-[220px]"
                />
              )}

              {/* Driver Contact + Lifecycle Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      pushToast(
                        'info',
                        `${t.bookings.simulatedCallNotice} ${driver?.fullName} (${driver?.phone})`
                      )
                    }
                    className="min-h-[40px] px-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] hover:bg-[#DBEAFE] text-xs font-semibold text-[#1E293B] inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{t.bookings.callDriver}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      pushToast('info', `${driver?.fullName}: ETA ~${b.etaMinutes} min`)
                    }
                    className="min-h-[40px] px-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] hover:bg-[#DBEAFE] text-xs font-semibold text-[#1E293B] inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{t.bookings.messageDriver}</span>
                  </button>

                  {['pending_confirmation', 'confirmed', 'driver_approaching'].includes(
                    b.status
                  ) && (
                    <button
                      type="button"
                      onClick={() => advanceSimulatedStep(b.id, b.status)}
                      className="min-h-[40px] px-3.5 rounded-xl bg-[#DBEAFE] hover:bg-blue-200 text-xs font-semibold text-[#173B75]"
                    >
                      {t.bookings.simulateDriverAdvance}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => passengerCancelBooking(b.id)}
                      className="min-h-[42px] px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 inline-flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{t.bookings.cancelBooking}</span>
                    </button>
                  )}

                  {canComplete && (
                    <button
                      type="button"
                      onClick={() => passengerConfirmArrival(b.id)}
                      className="min-h-[44px] px-4 rounded-xl bg-[#16A34A] hover:bg-green-700 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.bookings.journeyCompletedBtn}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Dual-confirmation notice */}
              {b.status === 'completed' && !b.driverConfirmedDeparture && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900">
                  {t.bookings.waitingDriverRelease}
                </div>
              )}

              {b.status === 'completed' && b.driverConfirmedDeparture && (
                <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs font-medium text-green-800">
                  {t.bookings.seatReleasedNote}
                </div>
              )}

              {/* Rating UI after completion */}
              {b.status === 'completed' && !b.ratingGiven && (
                <div className="pt-3 border-t border-slate-100">
                  {ratingTargetId === b.id ? (
                    <div className="bg-[#F5F7FA] rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#1E293B]">
                          {t.bookings.rateDriverTitle} · {driver?.fullName}
                        </p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setStars(n)}
                              className="p-1"
                              aria-label={`${n} stars`}
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  n <= stars
                                    ? 'text-[#F59E0B] fill-[#F59E0B]'
                                    : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t.bookings.rateCommentPlaceholder}
                        className="w-full min-h-[40px] px-3 rounded-xl border border-slate-200 bg-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          rateBookingDriver(b.id, stars, comment);
                          setRatingTargetId(null);
                          setComment('');
                        }}
                        className="min-h-[40px] px-4 rounded-xl bg-[#2563EB] text-white text-xs font-semibold"
                      >
                        {t.bookings.submitRating}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRatingTargetId(b.id)}
                      className="min-h-[40px] px-4 rounded-xl bg-[#173B75] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                      <span>{t.bookings.rateDriverTitle}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PassengerHistoryTab: React.FC = () => {
  const { t, language, bookings, drivers, taxis, currentPassenger } = useTaxiSeat();

  const history = bookings.filter(
    (b) =>
      b.passengerId === currentPassenger?.id &&
      (b.status === 'completed' || b.status === 'cancelled')
  );

  return (
    <div className="space-y-5 pb-8">
      <h2 className="text-xl font-extrabold text-[#173B75]">{t.bookings.historyTitle}</h2>

      {history.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
          <h3 className="text-base font-bold text-[#1E293B]">{t.bookings.noHistoryTitle}</h3>
          <p className="text-xs text-[#64748B]">{t.bookings.noHistoryDesc}</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
          {history.map((b) => {
            const pickupLm = getLandmarkById(MARRAKECH_LANDMARKS, b.pickupId);
            const destLm = getLandmarkById(MARRAKECH_LANDMARKS, b.destinationId);
            const driver = drivers.find((d) => d.id === b.driverId);
            const taxi = taxis.find((tx) => tx.id === b.taxiId);

            return (
              <div
                key={b.id}
                className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono-tabular font-bold text-[#173B75]">
                      {b.reference}
                    </span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <BookingStatusIndicator status={b.status} />
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="text-[#64748B] font-mono-tabular">
                      {b.createdAt.slice(0, 10)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#1E293B]">
                    {pickupLm?.name[language]} → {destLm?.name[language]}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {driver?.fullName} · {taxi ? t.taxiTypes[taxi.type] : ''} · {t.common.seat}{' '}
                    {b.seatCode}
                  </p>
                </div>

                <div className="text-end space-y-1">
                  <p className="text-base font-extrabold text-[#1E293B] tabular-nums">
                    {b.totalMad} {t.common.mad}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {b.paymentStatus === 'refunded'
                      ? t.bookings.refundedBadge
                      : t.bookings.paidBadge}
                    {b.ratingGiven ? ` · ★ ${b.ratingGiven}/5` : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const PassengerProfileTab: React.FC = () => {
  const {
    t,
    currentPassenger,
    updatePassengerProfile,
    logoutPassenger,
    setRole,
    resetDemoData,
  } = useTaxiSeat();

  const [fullName, setFullName] = useState(currentPassenger?.fullName || '');
  const [phone, setPhone] = useState(currentPassenger?.phone || '');
  const [email, setEmail] = useState(currentPassenger?.email || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) return;
    updatePassengerProfile({ fullName, phone, email });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#DBEAFE] text-[#173B75] flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#1E293B]">
              {currentPassenger?.fullName}
            </h2>
            <p className="text-xs text-[#64748B] tabular-nums">
              {currentPassenger?.totalTrips} {t.admin.tripsCount} · {currentPassenger?.joinedAt}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.welcome.fullName}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.welcome.phone}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              {t.welcome.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm"
            />
          </div>
          <button
            type="submit"
            className="min-h-[44px] px-5 rounded-xl bg-[#2563EB] hover:bg-[#173B75] text-white text-sm font-semibold transition-colors"
          >
            {t.common.save}
          </button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-bold text-[#1E293B]">{t.common.language}</span>
          <LanguageSelector />
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setRole('driver')}
            className="min-h-[42px] px-4 rounded-xl border border-slate-200 bg-[#F5F7FA] hover:bg-[#DBEAFE] text-xs font-semibold text-[#173B75]"
          >
            {t.welcome.continueDriver}
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className="min-h-[42px] px-4 rounded-xl border border-slate-200 bg-[#F5F7FA] hover:bg-[#DBEAFE] text-xs font-semibold text-[#173B75]"
          >
            {t.welcome.continueAdmin}
          </button>
          <button
            type="button"
            onClick={resetDemoData}
            className="min-h-[42px] px-4 rounded-xl border border-slate-200 text-xs font-semibold text-[#64748B] inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.common.reset}</span>
          </button>
          <button
            type="button"
            onClick={logoutPassenger}
            className="min-h-[42px] px-4 rounded-xl border border-red-200 text-xs font-semibold text-red-700 inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.common.signOut}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
