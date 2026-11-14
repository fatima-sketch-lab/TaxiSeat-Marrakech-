import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Clock,
  Navigation,
  UserCheck,
  Ban,
} from 'lucide-react';
import { BookingStatus, Language } from '../types';
import { useTaxiSeat } from '../context/TaxiSeatContext';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useTaxiSeat();
  const langs: Array<{ code: Language; label: string; short: string }> = [
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'ar', label: 'العربية', short: 'AR' },
    { code: 'en', label: 'English', short: 'EN' },
  ];

  return (
    <div
      className="inline-flex items-center bg-[#F5F7FA] border border-slate-200 rounded-xl p-0.5"
      role="group"
      aria-label="Language switcher"
    >
      {langs.map((item) => {
        const active = language === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            className={`min-h-[34px] px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              active
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            {compact ? item.short : item.label}
          </button>
        );
      })}
    </div>
  );
};

export const NotificationBell: React.FC = () => {
  const { notifications, role, language, t, markAllNotificationsRead } = useTaxiSeat();
  const [open, setOpen] = useState(false);

  const relevant = notifications.filter(
    (n) => n.targetRole === role || n.targetRole === 'all' || role === 'admin'
  );
  const unreadCount = relevant.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 bg-white hover:bg-[#F5F7FA] flex items-center justify-center text-[#1E293B] transition-colors"
        aria-label={t.common.notifications}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute end-0 mt-2 w-80 sm:w-96 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-[#1E293B]">
                {t.common.notifications}
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  {t.common.markAllRead}
                </button>
              )}
            </div>
            <div className="max-w-full max-h-80 overflow-y-auto divide-y divide-slate-100">
              {relevant.length === 0 ? (
                <p className="p-6 text-center text-xs text-[#64748B]">
                  {t.common.noNotifications}
                </p>
              ) : (
                relevant.slice(0, 8).map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 ${n.read ? 'bg-white' : 'bg-[#DBEAFE]/35'}`}
                  >
                    <p className="text-xs font-bold text-[#1E293B]">
                      {n.title[language]}
                    </p>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {n.message[language]}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const BookingStatusIndicator: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const { t } = useTaxiSeat();

  const config: Record<
    BookingStatus,
    { textColor: string; icon: React.ReactNode }
  > = {
    pending_confirmation: {
      textColor: 'text-[#B45309]',
      icon: <Clock className="w-4 h-4 text-[#F59E0B]" />,
    },
    confirmed: {
      textColor: 'text-[#173B75]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />,
    },
    driver_approaching: {
      textColor: 'text-[#2563EB]',
      icon: <Navigation className="w-4 h-4 text-[#2563EB]" />,
    },
    picked_up: {
      textColor: 'text-[#15803D]',
      icon: <UserCheck className="w-4 h-4 text-[#16A34A]" />,
    },
    completed: {
      textColor: 'text-[#16A34A]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />,
    },
    cancelled: {
      textColor: 'text-[#64748B]',
      icon: <Ban className="w-4 h-4 text-red-500" />,
    },
  };

  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${c.textColor}`}>
      {c.icon}
      <span>{t.bookingStatus[status]}</span>
    </span>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useTaxiSeat();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 end-4 z-[60] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-2.5 p-3.5 rounded-xl border shadow-lg bg-white ${
            toast.type === 'error'
              ? 'border-red-200 text-red-900'
              : toast.type === 'success'
              ? 'border-green-200 text-[#1E293B]'
              : 'border-blue-200 text-[#1E293B]'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          )}
          <span className="text-xs font-medium flex-1 leading-relaxed">{toast.text}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
