import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Language,
  UserRole,
  Taxi,
  DriverUser,
  PassengerUser,
  Booking,
  PaymentMethod,
  PaymentRecord,
  AppNotification,
  TaxiType,
} from '../types';
import {
  MARRAKECH_LANDMARKS,
  INITIAL_TAXIS,
  INITIAL_DRIVERS,
  INITIAL_PASSENGERS,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
  buildSeats,
} from '../data/marrakechData';
import { translations, Translations } from '../i18n/translations';
import { canPerformBookingTransition, getLandmarkById } from '../utils/matching';

export type ToastMessage = {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
};

interface TaxiSeatState {
  language: Language;
  role: UserRole;
  showWelcome: boolean;
  currentPassengerId: string | null;
  currentDriverId: string;
  passengers: PassengerUser[];
  drivers: DriverUser[];
  taxis: Taxi[];
  bookings: Booking[];
  payments: PaymentRecord[];
  notifications: AppNotification[];
  isSimulatingMovement: boolean;
}

const STORAGE_KEY = 'taxiseat_prototype_state_v1';

function loadInitialState(): TaxiSeatState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TaxiSeatState;
      if (parsed && Array.isArray(parsed.taxis) && Array.isArray(parsed.drivers)) {
        return parsed;
      }
    }
  } catch {
    // ignore corrupted storage
  }
  return {
    language: 'fr',
    role: 'passenger',
    showWelcome: true,
    currentPassengerId: 'pass_1',
    currentDriverId: 'drv_1',
    passengers: INITIAL_PASSENGERS,
    drivers: INITIAL_DRIVERS,
    taxis: INITIAL_TAXIS,
    bookings: INITIAL_BOOKINGS,
    payments: [],
    notifications: INITIAL_NOTIFICATIONS,
    isSimulatingMovement: true,
  };
}

interface TaxiSeatContextValue extends TaxiSeatState {
  t: Translations;
  dir: 'ltr' | 'rtl';
  currentPassenger: PassengerUser | null;
  currentDriver: DriverUser;
  currentDriverTaxi: Taxi;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  pushToast: (type: ToastMessage['type'], text: string) => void;
  setLanguage: (lang: Language) => void;
  setRole: (role: UserRole) => void;
  enterAppAsRole: (role: UserRole) => void;
  setShowWelcome: (show: boolean) => void;
  toggleSimulation: () => void;
  resetDemoData: () => void;

  // Auth & profiles
  loginPassenger: (email: string, password: string) => { ok: boolean; error?: string };
  registerPassenger: (data: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }) => { ok: boolean; error?: string };
  updatePassengerProfile: (data: { fullName: string; phone: string; email: string }) => void;
  logoutPassenger: () => void;

  switchActiveDriver: (driverId: string) => void;
  registerOrUpdateDriver: (data: {
    fullName: string;
    phone: string;
    email: string;
    licenseNumber: string;
    taxiType: TaxiType;
    model: string;
    plateNumber: string;
    capacity: number;
  }) => void;

  // Driver route & seat controls
  toggleDriverOnline: () => void;
  toggleDriverAcceptingBookings: () => void;
  updateDriverRoute: (stops: string[], originId: string, destinationId: string) => void;
  advanceDriverAlongRoute: () => void;
  toggleManualSeat: (taxiId: string, seatId: string) => void;

  // Booking & Payment lifecycle
  createReservationAndPay: (params: {
    taxiId: string;
    seatId: string;
    pickupId: string;
    destinationId: string;
    fareMad: number;
    etaMinutes: number;
    distanceKm: number;
    paymentMethod: PaymentMethod;
  }) => { ok: boolean; booking?: Booking; error?: string };

  driverAcceptBooking: (bookingId: string) => void;
  driverRejectBooking: (bookingId: string) => void;
  driverMarkApproaching: (bookingId: string) => void;
  driverConfirmBoarding: (bookingId: string) => void;
  passengerConfirmArrival: (bookingId: string) => void;
  driverConfirmDeparture: (bookingId: string) => void;
  passengerCancelBooking: (bookingId: string) => void;
  rateBookingDriver: (bookingId: string, rating: number, comment?: string) => void;

  // Notifications
  markAllNotificationsRead: () => void;
}

const TaxiSeatContext = createContext<TaxiSeatContextValue | null>(null);

export const TaxiSeatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TaxiSeatState>(loadInitialState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const t = translations[state.language];
  const dir: 'ltr' | 'rtl' = state.language === 'ar' ? 'rtl' : 'ltr';

  // Sync HTML lang and dir for proper RTL layout
  useEffect(() => {
    document.documentElement.lang = state.language;
    document.documentElement.dir = dir;
  }, [state.language, dir]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota error
    }
  }, [state]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback((type: ToastMessage['type'], text: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  // Simulated GPS movement of online taxis along their Marrakech stops
  useEffect(() => {
    if (!state.isSimulatingMovement) return;
    const interval = setInterval(() => {
      setState((prev) => {
        const nextTaxis = prev.taxis.map((taxi) => {
          if (!taxi.isOnline || taxi.stops.length < 2) return taxi;
          const nextIdx = Math.min(taxi.currentStopIndex + 1, taxi.stops.length - 1);
          const targetLm = getLandmarkById(MARRAKECH_LANDMARKS, taxi.stops[nextIdx]);
          if (!targetLm) return taxi;

          const [lat, lng] = taxi.currentPosition;
          const [tLat, tLng] = targetLm.coords;
          const dLat = tLat - lat;
          const dLng = tLng - lng;
          const dist = Math.hypot(dLat, dLng);

          if (dist < 0.0018) {
            // Reached next stop; if at end of route, loop gently back to start for continuous demo
            if (nextIdx >= taxi.stops.length - 1) {
              const startLm = getLandmarkById(MARRAKECH_LANDMARKS, taxi.stops[0]);
              return {
                ...taxi,
                currentStopIndex: 0,
                currentPosition: startLm ? startLm.coords : taxi.currentPosition,
              };
            }
            return {
              ...taxi,
              currentStopIndex: nextIdx,
              currentPosition: targetLm.coords,
            };
          }

          // Smooth step towards next stop
          const step = 0.0011;
          return {
            ...taxi,
            currentPosition: [
              lat + (dLat / dist) * step,
              lng + (dLng / dist) * step,
            ] as [number, number],
          };
        });
        return { ...prev, taxis: nextTaxis };
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [state.isSimulatingMovement]);

  const appendNotification = (
    prev: TaxiSeatState,
    notif: Omit<AppNotification, 'id' | 'read' | 'timestamp'>
  ): AppNotification[] => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    return [newNotif, ...prev.notifications].slice(0, 30);
  };

  const setLanguage = (language: Language) => {
    setState((prev) => ({ ...prev, language }));
  };

  const setRole = (role: UserRole) => {
    setState((prev) => ({ ...prev, role, showWelcome: false }));
  };

  const enterAppAsRole = (role: UserRole) => {
    setState((prev) => ({
      ...prev,
      role,
      showWelcome: false,
      currentPassengerId: prev.currentPassengerId || prev.passengers[0]?.id || 'pass_1',
    }));
  };

  const setShowWelcome = (showWelcome: boolean) => {
    setState((prev) => ({ ...prev, showWelcome }));
  };

  const toggleSimulation = () => {
    setState((prev) => ({ ...prev, isSimulatingMovement: !prev.isSimulatingMovement }));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      language: state.language,
      role: 'passenger',
      showWelcome: false,
      currentPassengerId: 'pass_1',
      currentDriverId: 'drv_1',
      passengers: INITIAL_PASSENGERS,
      drivers: INITIAL_DRIVERS,
      taxis: INITIAL_TAXIS,
      bookings: INITIAL_BOOKINGS,
      payments: [],
      notifications: INITIAL_NOTIFICATIONS,
      isSimulatingMovement: true,
    });
    pushToast('info', state.language === 'fr' ? 'Données de démonstration réinitialisées.' : state.language === 'ar' ? 'تمت إعادة ضبط البيانات التجريبية.' : 'Demo data reset.');
  };

  const loginPassenger = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { ok: false, error: t.welcome.authErrorMissing };
    }
    const found = state.passengers.find((p) => p.email.toLowerCase() === cleanEmail);
    if (!found || (found.password !== password && password !== 'demo')) {
      return { ok: false, error: t.welcome.authErrorInvalid };
    }
    setState((prev) => ({
      ...prev,
      currentPassengerId: found.id,
      role: 'passenger',
      showWelcome: false,
    }));
    return { ok: true };
  };

  const registerPassenger = (data: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }) => {
    if (!data.fullName.trim() || !data.phone.trim() || !data.email.trim() || !data.password.trim()) {
      return { ok: false, error: t.welcome.authErrorMissing };
    }
    if (!data.email.includes('@') || data.password.length < 4) {
      return { ok: false, error: t.welcome.authErrorInvalid };
    }
    const newPassenger: PassengerUser = {
      id: `pass_${Date.now()}`,
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      preferredLanguage: state.language,
      totalTrips: 0,
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    setState((prev) => ({
      ...prev,
      passengers: [newPassenger, ...prev.passengers],
      currentPassengerId: newPassenger.id,
      role: 'passenger',
      showWelcome: false,
    }));
    return { ok: true };
  };

  const updatePassengerProfile = (data: { fullName: string; phone: string; email: string }) => {
    setState((prev) => ({
      ...prev,
      passengers: prev.passengers.map((p) =>
        p.id === prev.currentPassengerId
          ? { ...p, fullName: data.fullName, phone: data.phone, email: data.email }
          : p
      ),
    }));
    pushToast('success', t.common.save);
  };

  const logoutPassenger = () => {
    setState((prev) => ({ ...prev, showWelcome: true }));
  };

  const switchActiveDriver = (driverId: string) => {
    setState((prev) => ({ ...prev, currentDriverId: driverId }));
  };

  const registerOrUpdateDriver = (data: {
    fullName: string;
    phone: string;
    email: string;
    licenseNumber: string;
    taxiType: TaxiType;
    model: string;
    plateNumber: string;
    capacity: number;
  }) => {
    setState((prev) => {
      const driver = prev.drivers.find((d) => d.id === prev.currentDriverId);
      if (!driver) return prev;
      const updatedDrivers = prev.drivers.map((d) =>
        d.id === driver.id
          ? {
              ...d,
              fullName: data.fullName,
              phone: data.phone,
              email: data.email,
              licenseNumber: data.licenseNumber,
            }
          : d
      );
      const updatedTaxis = prev.taxis.map((tx) => {
        if (tx.id !== driver.taxiId) return tx;
        const typeChanged = tx.type !== data.taxiType;
        const nextSeats = typeChanged ? buildSeats(data.taxiType) : tx.seats;
        return {
          ...tx,
          type: data.taxiType,
          model: data.model,
          plateNumber: data.plateNumber,
          capacity: data.taxiType === 'small' ? 3 : 6,
          seats: nextSeats,
        };
      });
      return { ...prev, drivers: updatedDrivers, taxis: updatedTaxis };
    });
    pushToast('success', t.driver.updateProfileSuccess);
  };

  const toggleDriverOnline = () => {
    setState((prev) => {
      const driver = prev.drivers.find((d) => d.id === prev.currentDriverId);
      if (!driver) return prev;
      return {
        ...prev,
        taxis: prev.taxis.map((tx) =>
          tx.id === driver.taxiId ? { ...tx, isOnline: !tx.isOnline } : tx
        ),
      };
    });
  };

  const toggleDriverAcceptingBookings = () => {
    setState((prev) => {
      const driver = prev.drivers.find((d) => d.id === prev.currentDriverId);
      if (!driver) return prev;
      return {
        ...prev,
        taxis: prev.taxis.map((tx) =>
          tx.id === driver.taxiId ? { ...tx, acceptingBookings: !tx.acceptingBookings } : tx
        ),
      };
    });
  };

  const updateDriverRoute = (stops: string[], originId: string, destinationId: string) => {
    if (stops.length < 2) return;
    const originLm = getLandmarkById(MARRAKECH_LANDMARKS, originId);
    const destLm = getLandmarkById(MARRAKECH_LANDMARKS, destinationId);
    if (!originLm || !destLm) return;

    setState((prev) => {
      const driver = prev.drivers.find((d) => d.id === prev.currentDriverId);
      if (!driver) return prev;
      return {
        ...prev,
        taxis: prev.taxis.map((tx) =>
          tx.id === driver.taxiId
            ? {
                ...tx,
                stops,
                currentStopIndex: 0,
                currentPosition: originLm.coords,
                headingLabel: {
                  fr: `${originLm.name.fr} → ${destLm.name.fr}`,
                  ar: `${originLm.name.ar} ← ${destLm.name.ar}`,
                  en: `${originLm.name.en} → ${destLm.name.en}`,
                },
              }
            : tx
        ),
      };
    });
    pushToast('success', t.driver.updateRoute);
  };

  const advanceDriverAlongRoute = () => {
    setState((prev) => {
      const driver = prev.drivers.find((d) => d.id === prev.currentDriverId);
      if (!driver) return prev;
      return {
        ...prev,
        taxis: prev.taxis.map((tx) => {
          if (tx.id !== driver.taxiId) return tx;
          const nextIndex = (tx.currentStopIndex + 1) % tx.stops.length;
          const lm = getLandmarkById(MARRAKECH_LANDMARKS, tx.stops[nextIndex]);
          return {
            ...tx,
            currentStopIndex: nextIndex,
            currentPosition: lm ? lm.coords : tx.currentPosition,
          };
        }),
      };
    });
  };

  const toggleManualSeat = (taxiId: string, seatId: string) => {
    setState((prev) => ({
      ...prev,
      taxis: prev.taxis.map((tx) => {
        if (tx.id !== taxiId) return tx;
        return {
          ...tx,
          seats: tx.seats.map((s) => {
            if (s.id !== seatId) return s;
            // Cannot manually override a seat tied to an active online booking
            if (s.bookingId) return s;
            return {
              ...s,
              status: s.status === 'available' ? 'occupied' : 'available',
            };
          }),
        };
      }),
    }));
  };

  const createReservationAndPay: TaxiSeatContextValue['createReservationAndPay'] = ({
    taxiId,
    seatId,
    pickupId,
    destinationId,
    fareMad,
    etaMinutes,
    distanceKm,
    paymentMethod,
  }) => {
    const passenger =
      state.passengers.find((p) => p.id === state.currentPassengerId) || state.passengers[0];
    const targetTaxi = state.taxis.find((tx) => tx.id === taxiId);
    if (!passenger || !targetTaxi) {
      return { ok: false, error: t.seatSelection.seatUnavailableError };
    }

    const targetSeat = targetTaxi.seats.find((s) => s.id === seatId);
    if (!targetSeat || targetSeat.status !== 'available') {
      return { ok: false, error: t.seatSelection.seatUnavailableError };
    }

    const serviceFeeMad = 2;
    const totalMad = fareMad + serviceFeeMad;
    const bookingId = `bk_${Date.now()}`;
    const reference = `TXS-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const newBooking: Booking = {
      id: bookingId,
      reference,
      passengerId: passenger.id,
      passengerName: passenger.fullName,
      passengerPhone: passenger.phone,
      driverId: targetTaxi.driverId,
      taxiId: targetTaxi.id,
      seatId: targetSeat.id,
      seatCode: targetSeat.code,
      pickupId,
      destinationId,
      status: 'pending_confirmation',
      fareMad,
      serviceFeeMad,
      totalMad,
      paymentStatus: 'paid',
      paymentMethod,
      etaMinutes,
      distanceKm,
      passengerConfirmedArrival: false,
      driverConfirmedDeparture: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const paymentRecord: PaymentRecord = {
      id: `pay_${Date.now()}`,
      bookingId,
      baseFareMad: fareMad,
      serviceFeeMad,
      totalMad,
      method: paymentMethod,
      status: 'paid',
      reference: `PAY-${reference}`,
      createdAt: nowIso,
    };

    setState((prev) => {
      // Double-check seat atomicity inside state updater
      const latestTaxi = prev.taxis.find((tx) => tx.id === taxiId);
      const latestSeat = latestTaxi?.seats.find((s) => s.id === seatId);
      if (!latestSeat || latestSeat.status !== 'available') return prev;

      const nextTaxis = prev.taxis.map((tx) =>
        tx.id === taxiId
          ? {
              ...tx,
              seats: tx.seats.map((s) =>
                s.id === seatId
                  ? {
                      ...s,
                      status: 'reserved' as const,
                      bookingId,
                      passengerName: passenger.fullName,
                    }
                  : s
              ),
            }
          : tx
      );

      let nextNotifs = appendNotification(prev, {
        targetRole: 'passenger',
        type: 'payment_confirmed',
        bookingId,
        title: {
          fr: `Paiement confirmé · ${reference}`,
          ar: `تم تأكيد الدفع · ${reference}`,
          en: `Payment confirmed · ${reference}`,
        },
        message: {
          fr: `Siège ${targetSeat.code} réservé (${totalMad} MAD). En attente de confirmation du chauffeur.`,
          ar: `تم حجز المقعد ${targetSeat.code} (${totalMad} درهم). في انتظار تأكيد السائق.`,
          en: `Seat ${targetSeat.code} held (${totalMad} MAD). Waiting for driver confirmation.`,
        },
      });

      nextNotifs = appendNotification({ ...prev, notifications: nextNotifs }, {
        targetRole: 'driver',
        type: 'booking_requested',
        bookingId,
        title: {
          fr: `Nouvelle réservation · Siège ${targetSeat.code}`,
          ar: `طلب حجز جديد · المقعد ${targetSeat.code}`,
          en: `New seat request · Seat ${targetSeat.code}`,
        },
        message: {
          fr: `${passenger.fullName} souhaite réserver le siège ${targetSeat.code} (${fareMad} MAD).`,
          ar: `يرغب ${passenger.fullName} في حجز المقعد ${targetSeat.code} (${fareMad} درهم).`,
          en: `${passenger.fullName} requested seat ${targetSeat.code} (${fareMad} MAD).`,
        },
      });

      return {
        ...prev,
        taxis: nextTaxis,
        bookings: [newBooking, ...prev.bookings],
        payments: [paymentRecord, ...prev.payments],
        notifications: nextNotifs,
      };
    });

    return { ok: true, booking: newBooking };
  };

  const driverAcceptBooking = (bookingId: string) => {
    setState((prev) => {
      const b = prev.bookings.find((item) => item.id === bookingId);
      if (!b || !canPerformBookingTransition(b.status, 'driver_accept')) return prev;
      return {
        ...prev,
        bookings: prev.bookings.map((item) =>
          item.id === bookingId
            ? { ...item, status: 'confirmed', updatedAt: new Date().toISOString() }
            : item
        ),
        notifications: appendNotification(prev, {
          targetRole: 'passenger',
          type: 'booking_confirmed',
          bookingId,
          title: {
            fr: `Réservation confirmée · ${b.reference}`,
            ar: `تم تأكيد الحجز · ${b.reference}`,
            en: `Booking confirmed · ${b.reference}`,
          },
          message: {
            fr: `Le chauffeur a accepté votre siège ${b.seatCode}. Préparez-vous au point de départ.`,
            ar: `وافق السائق على مقعدك ${b.seatCode}. يرجى الاستعداد في نقطة الانطلاق.`,
            en: `Driver accepted your seat ${b.seatCode}. Please be ready at your pickup stop.`,
          },
        }),
      };
    });
    pushToast('success', t.bookingStatus.confirmed);
  };

  const driverRejectBooking = (bookingId: string) => {
    setState((prev) => {
      const b = prev.bookings.find((item) => item.id === bookingId);
      if (!b || !canPerformBookingTransition(b.status, 'driver_reject')) return prev;
      return {
        ...prev,
        bookings: prev.bookings.map((item) =>
          item.id === bookingId
            ? {
                ...item,
                status: 'cancelled',
                paymentStatus: 'refunded',
                updatedAt: new Date().toISOString(),
              }
            : item
        ),
        taxis: prev.taxis.map((tx) =>
          tx.id === b.taxiId
            ? {
                ...tx,
                seats: tx.seats.map((s) =>
                  s.id === b.seatId
                    ? { ...s, status: 'available', bookingId: undefined, passengerName: undefined }
                    : s
                ),
              }
            : tx
        ),
        notifications: appendNotification(prev, {
          targetRole: 'passenger',
          type: 'booking_cancelled',
          bookingId,
          title: {
            fr: `Réservation refusée · ${b.reference}`,
            ar: `تم رفض الحجز · ${b.reference}`,
            en: `Booking declined · ${b.reference}`,
          },
          message: {
            fr: `Le chauffeur n’a pas pu accepter la demande. Paiement remboursé (${b.totalMad} MAD).`,
            ar: `تعذر على السائق قبول الطلب. تم استرداد المبلغ (${b.totalMad} درهم).`,
            en: `Driver could not accept the request. ${b.totalMad} MAD refunded.`,
          },
        }),
      };
    });
    pushToast('info', t.bookingStatus.cancelled);
  };

  const driverMarkApproaching = (bookingId: string) => {
    setState((prev) => {
      const b = prev.bookings.find((item) => item.id === bookingId);
      if (!b || !canPerformBookingTransition(b.status, 'driver_approaching')) return prev;
      return {
        ...prev,
        bookings: prev.bookings.map((item) =>
          item.id === bookingId
            ? {
                ...item,
                status: 'driver_approaching',
                etaMinutes: Math.max(1, Math.min(2, item.etaMinutes)),
                updatedAt: new Date().toISOString(),
              }
            : item
        ),
        notifications: appendNotification(prev, {
          targetRole: 'passenger',
          type: 'driver_approaching',
          bookingId,
          title: {
            fr: `Taxi en approche · ${b.reference}`,
            ar: `الطاكسي يقترب · ${b.reference}`,
            en: `Driver approaching · ${b.reference}`,
          },
          message: {
            fr: `Votre taxi arrive dans ~2 min pour le siège ${b.seatCode}.`,
            ar: `سيصل الطاكسي خلال دقيقتين تقريباً للمقعد ${b.seatCode}.`,
            en: `Your taxi is ~2 min away for seat ${b.seatCode}.`,
          },
        }),
      };
    });
    pushToast('info', t.bookingStatus.driver_approaching);
  };

  const driverConfirmBoarding = (bookingId: string) => {
    setState((prev) => {
      const b = prev.bookings.find((item) => item.id === bookingId);
      if (!b || !canPerformBookingTransition(b.status, 'driver_board_passenger')) return prev;
      return {
        ...prev,
        bookings: prev.bookings.map((item) =>
          item.id === bookingId
            ? { ...item, status: 'picked_up', updatedAt: new Date().toISOString() }
            : item
        ),
        taxis: prev.taxis.map((tx) =>
          tx.id === b.taxiId
            ? {
                ...tx,
                seats: tx.seats.map((s) =>
                  s.id === b.seatId ? { ...s, status: 'occupied' } : s
                ),
              }
            : tx
        ),
        notifications: appendNotification(prev, {
          targetRole: 'passenger',
          type: 'passenger_boarded',
          bookingId,
          title: {
            fr: `Montée confirmée · ${b.reference}`,
            ar: `تم تأكيد الركوب · ${b.reference}`,
            en: `Boarding confirmed · ${b.reference}`,
          },
          message: {
            fr: `Bon trajet ! Vous occupez le siège ${b.seatCode}.`,
            ar: `رحلة موفقة! مقعدك هو ${b.seatCode}.`,
            en: `Enjoy your ride in seat ${b.seatCode}.`,
          },
        }),
      };
    });
    pushToast('success', t.bookingStatus.picked_up);
  };

  const passengerConfirmArrival = (bookingId: string) => {
    setState((prev) => {
      const b = prev.bookings.find((item) => item.id === bookingId);
      if (!b || !canPerformBookingTransition(b.status, 'passenger_complete')) return prev;
      // NOTE: Seat remains 'occupied' until driver also confirms departure!
      return {
        ...prev,
        bookings: prev.bookings.map((item) =>
          item.id === bookingId
            ? {
                ...item,
                status: 'completed',
                passengerConfirmedArrival: true,
                updatedAt: new Date().toISOString(),
              }
            : item
        ),
        notifications: appendNotification(prev, {
          targetRole: 'driver',
          type: 'journey_completed',
          bookingId,
          title: {
            fr: `Arrivée passager confirmée · Siège ${b.seatCode}`,
            ar: `تأكيد وصول المسافر · المقعد ${b.seatCode}`,
            en: `Passenger confirmed arrival · Seat ${b.seatCode}`,
          },
          message: {
            fr: `${b.passengerName} a confirmé son arrivée. Confirmez la descente pour libérer le siège ${b.seatCode}.`,
            ar: `أكد ${b.passengerName} وصوله. يرجى تأكيد نزوله لتحرير المقعد ${b.seatCode}.`,
            en: `${b.passengerName} confirmed arrival. Confirm departure to release seat ${b.seatCode}.`,
          },
        }),
      };
    });
    pushToast('success', t.bookings.waitingDriverRelease);
  };

  const driverConfirmDeparture = (bookingId: string) => {
    setState((prev) => {
      const b = prev.bookings.find((item) => item.id === bookingId);
      if (!b || !canPerformBookingTransition(b.status, 'driver_confirm_departure')) return prev;
      if (b.driverConfirmedDeparture) return prev;

      const updatedBookings = prev.bookings.map((item) =>
        item.id === bookingId
          ? {
              ...item,
              status: 'completed' as const,
              driverConfirmedDeparture: true,
              updatedAt: new Date().toISOString(),
            }
          : item
      );

      // Now release the occupied seat back to available
      const updatedTaxis = prev.taxis.map((tx) =>
        tx.id === b.taxiId
          ? {
              ...tx,
              seats: tx.seats.map((s) =>
                s.id === b.seatId
                  ? { ...s, status: 'available' as const, bookingId: undefined, passengerName: undefined }
                  : s
              ),
            }
          : tx
      );

      const updatedDrivers = prev.drivers.map((d) => {
        if (d.id !== b.driverId) return d;
        const nextChart = [...d.dailyChartMad];
        nextChart[nextChart.length - 1] = (nextChart[nextChart.length - 1] || 0) + b.fareMad;
        return {
          ...d,
          totalRides: d.totalRides + 1,
          todayEarningsMad: d.todayEarningsMad + b.fareMad,
          weeklyEarningsMad: d.weeklyEarningsMad + b.fareMad,
          monthlyEarningsMad: d.monthlyEarningsMad + b.fareMad,
          dailyChartMad: nextChart,
        };
      });

      const updatedPassengers = prev.passengers.map((p) =>
        p.id === b.passengerId ? { ...p, totalTrips: p.totalTrips + 1 } : p
      );

      return {
        ...prev,
        bookings: updatedBookings,
        taxis: updatedTaxis,
        drivers: updatedDrivers,
        passengers: updatedPassengers,
        notifications: appendNotification(prev, {
          targetRole: 'passenger',
          type: 'journey_completed',
          bookingId,
          title: {
            fr: `Trajet finalisé · ${b.reference}`,
            ar: `اكتمال الرحلة · ${b.reference}`,
            en: `Trip finalized · ${b.reference}`,
          },
          message: {
            fr: `Descente confirmée par le chauffeur. Le siège ${b.seatCode} est de nouveau libre.`,
            ar: `أكد السائق النزول. المقعد ${b.seatCode} أصبح متاحاً من جديد.`,
            en: `Driver confirmed departure. Seat ${b.seatCode} is now available again.`,
          },
        }),
      };
    });
    pushToast('success', t.bookings.seatReleasedNote);
  };

  const passengerCancelBooking = (bookingId: string) => {
    setState((prev) => {
      const b = prev.bookings.find((item) => item.id === bookingId);
      if (!b || !canPerformBookingTransition(b.status, 'passenger_cancel')) return prev;
      return {
        ...prev,
        bookings: prev.bookings.map((item) =>
          item.id === bookingId
            ? {
                ...item,
                status: 'cancelled',
                paymentStatus: item.paymentStatus === 'paid' ? 'refunded' : item.paymentStatus,
                updatedAt: new Date().toISOString(),
              }
            : item
        ),
        payments: prev.payments.map((p) =>
          p.bookingId === bookingId ? { ...p, status: 'refunded' } : p
        ),
        taxis: prev.taxis.map((tx) =>
          tx.id === b.taxiId
            ? {
                ...tx,
                seats: tx.seats.map((s) =>
                  s.id === b.seatId
                    ? { ...s, status: 'available', bookingId: undefined, passengerName: undefined }
                    : s
                ),
              }
            : tx
        ),
        notifications: appendNotification(prev, {
          targetRole: 'all',
          type: 'booking_cancelled',
          bookingId,
          title: {
            fr: `Réservation annulée · ${b.reference}`,
            ar: `تم إلغاء الحجز · ${b.reference}`,
            en: `Booking cancelled · ${b.reference}`,
          },
          message: {
            fr: `Siège ${b.seatCode} libéré et ${b.totalMad} MAD remboursés (simulé).`,
            ar: `تم تحرير المقعد ${b.seatCode} واسترداد ${b.totalMad} درهم (محاكاة).`,
            en: `Seat ${b.seatCode} released and ${b.totalMad} MAD refunded (simulated).`,
          },
        }),
      };
    });
    pushToast('info', t.bookingStatus.cancelled);
  };

  const rateBookingDriver = (bookingId: string, rating: number, comment?: string) => {
    setState((prev) => {
      const b = prev.bookings.find((item) => item.id === bookingId);
      if (!b || b.ratingGiven) return prev;
      return {
        ...prev,
        bookings: prev.bookings.map((item) =>
          item.id === bookingId
            ? { ...item, ratingGiven: rating, ratingComment: comment }
            : item
        ),
        drivers: prev.drivers.map((d) => {
          if (d.id !== b.driverId) return d;
          const totalScore = d.rating * d.ratingCount + rating;
          const nextCount = d.ratingCount + 1;
          return {
            ...d,
            rating: Number((totalScore / nextCount).toFixed(2)),
            ratingCount: nextCount,
          };
        }),
      };
    });
    pushToast('success', t.bookings.ratedLabel);
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const currentPassenger =
    state.passengers.find((p) => p.id === state.currentPassengerId) || state.passengers[0] || null;
  const currentDriver =
    state.drivers.find((d) => d.id === state.currentDriverId) || state.drivers[0];
  const currentDriverTaxi =
    state.taxis.find((tx) => tx.id === currentDriver.taxiId) || state.taxis[0];

  return (
    <TaxiSeatContext.Provider
      value={{
        ...state,
        t,
        dir,
        currentPassenger,
        currentDriver,
        currentDriverTaxi,
        toasts,
        dismissToast,
        pushToast,
        setLanguage,
        setRole,
        enterAppAsRole,
        setShowWelcome,
        toggleSimulation,
        resetDemoData,
        loginPassenger,
        registerPassenger,
        updatePassengerProfile,
        logoutPassenger,
        switchActiveDriver,
        registerOrUpdateDriver,
        toggleDriverOnline,
        toggleDriverAcceptingBookings,
        updateDriverRoute,
        advanceDriverAlongRoute,
        toggleManualSeat,
        createReservationAndPay,
        driverAcceptBooking,
        driverRejectBooking,
        driverMarkApproaching,
        driverConfirmBoarding,
        passengerConfirmArrival,
        driverConfirmDeparture,
        passengerCancelBooking,
        rateBookingDriver,
        markAllNotificationsRead,
      }}
    >
      {children}
    </TaxiSeatContext.Provider>
  );
};

export function useTaxiSeat() {
  const ctx = useContext(TaxiSeatContext);
  if (!ctx) {
    throw new Error('useTaxiSeat must be used within TaxiSeatProvider');
  }
  return ctx;
}
