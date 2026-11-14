import React from 'react';
import { Check, Lock, User, Armchair } from 'lucide-react';
import { Seat, TaxiType, Language } from '../types';
import { Translations } from '../i18n/translations';

interface SeatMapProps {
  taxiType: TaxiType;
  seats: Seat[];
  selectedSeatId?: string | null;
  onSelectSeat: (seatId: string) => void;
  language: Language;
  t: Translations;
  driverMode?: boolean;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  taxiType,
  seats,
  selectedSeatId,
  onSelectSeat,
  language,
  t,
  driverMode = false,
}) => {
  const frontSeats = seats.filter((s) => s.position === 'front');
  const middleSeats = seats.filter((s) => s.position === 'middle');
  const rearSeats = seats.filter((s) => s.position === 'rear');

  const renderSeatButton = (seat: Seat) => {
    const isSelected = selectedSeatId === seat.id;
    const isAvailable = seat.status === 'available';
    const isReserved = seat.status === 'reserved';
    const isLockedByBooking = Boolean(seat.bookingId);

    const canClick = driverMode ? !isLockedByBooking : isAvailable;

    let styleClasses =
      'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed';
    if (isSelected) {
      styleClasses =
        'bg-[#2563EB] border-[#173B75] text-white shadow-md shadow-blue-600/20 ring-2 ring-[#DBEAFE] cursor-pointer';
    } else if (isAvailable) {
      styleClasses =
        'bg-[#DBEAFE]/70 border-[#2563EB]/50 text-[#173B75] hover:bg-[#DBEAFE] hover:border-[#2563EB] cursor-pointer';
    } else if (isReserved) {
      styleClasses =
        'bg-amber-50 border-amber-300 text-amber-800 cursor-not-allowed';
    }

    return (
      <button
        key={seat.id}
        type="button"
        disabled={!canClick}
        onClick={() => canClick && onSelectSeat(seat.id)}
        className={`min-h-[64px] rounded-xl border-2 p-2.5 flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98] ${styleClasses}`}
        aria-label={`${seat.code} - ${seat.label[language]} - ${t.seatStatus[seat.status]}`}
      >
        <div className="flex items-center gap-1.5">
          {isSelected ? (
            <Check className="w-4 h-4" />
          ) : isAvailable ? (
            <Armchair className="w-4 h-4" />
          ) : (
            <Lock className="w-3.5 h-3.5" />
          )}
          <span className="font-mono-tabular text-xs font-bold">{seat.code}</span>
        </div>
        <span className="text-[11px] font-medium leading-tight text-center truncate max-w-full">
          {isSelected
            ? t.seatSelection.selectedSeatLabel
            : t.seatStatus[seat.status]}
        </span>
        {driverMode && seat.passengerName && (
          <span className="text-[10px] opacity-80 truncate max-w-[90px]">
            {seat.passengerName}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
      {/* Cabin shell */}
      <div className="max-w-sm mx-auto bg-[#F5F7FA] border border-slate-200 rounded-3xl p-4 sm:p-5 space-y-4">
        {/* Windshield visual cue */}
        <div className="h-2 w-2/3 mx-auto rounded-full bg-slate-300" />

        {/* Front Row: Driver + S1 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="min-h-[64px] rounded-xl border border-slate-300 bg-slate-200/70 text-slate-600 p-2.5 flex flex-col items-center justify-center gap-1">
            <User className="w-4 h-4" />
            <span className="text-[11px] font-semibold">{t.seatSelection.driverCabin}</span>
          </div>
          {frontSeats.map(renderSeatButton)}
        </div>

        {/* Middle Row (Large Taxi only) */}
        {taxiType === 'large' && middleSeats.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5">
            {middleSeats.map(renderSeatButton)}
          </div>
        )}

        {/* Rear Row */}
        <div
          className={`grid gap-3 ${
            rearSeats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {rearSeats.map(renderSeatButton)}
        </div>
      </div>

      {/* Clean legend with explicit text labels (no hue-only signaling) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs text-[#64748B]">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-[#DBEAFE] border border-[#2563EB]" />
          {t.seatStatus.available}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-[#2563EB]" />
          {t.seatSelection.selectedSeatLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-400" />
          {t.seatStatus.reserved}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-400" />
          {t.seatStatus.occupied}
        </span>
      </div>
    </div>
  );
};
