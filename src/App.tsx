import React, { useState } from 'react';
import {
  Home,
  Search,
  Ticket,
  History,
  User,
  LayoutDashboard,
  Route,
  ClipboardList,
  Wallet,
  Users,
  Car,
  BarChart3,
} from 'lucide-react';
import { TaxiSeatProvider, useTaxiSeat } from './context/TaxiSeatContext';
import { WelcomeView } from './components/WelcomeView';
import {
  LanguageSelector,
  NotificationBell,
  ToastContainer,
} from './components/SharedControls';
import { PassengerSearchAndDetails } from './components/passenger/PassengerSearchAndDetails';
import {
  PassengerBookingsTab,
  PassengerHistoryTab,
  PassengerProfileTab,
} from './components/passenger/PassengerBookingsAndProfile';
import { DriverWorkspace, DriverTab } from './components/driver/DriverWorkspace';
import { AdminWorkspace, AdminTab } from './components/admin/AdminWorkspace';
import { UserRole } from './types';

type PassengerTab = 'home' | 'search' | 'bookings' | 'history' | 'profile';

const AppShell: React.FC = () => {
  const { t, role, setRole, showWelcome, setShowWelcome } = useTaxiSeat();

  const [passengerTab, setPassengerTab] = useState<PassengerTab>('home');
  const [driverTab, setDriverTab] = useState<DriverTab>('dashboard');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  const [pickupId, setPickupId] = useState<string>('gueliz');
  const [destinationId, setDestinationId] = useState<string>('jemaa');

  if (showWelcome) {
    return (
      <>
        <WelcomeView />
        <ToastContainer />
      </>
    );
  }

  const passengerNav: Array<{ key: PassengerTab; label: string; icon: React.ReactNode }> = [
    { key: 'home', label: t.nav.home, icon: <Home className="w-5 h-5" /> },
    { key: 'search', label: t.nav.search, icon: <Search className="w-5 h-5" /> },
    { key: 'bookings', label: t.nav.bookings, icon: <Ticket className="w-5 h-5" /> },
    { key: 'history', label: t.nav.history, icon: <History className="w-5 h-5" /> },
    { key: 'profile', label: t.nav.profile, icon: <User className="w-5 h-5" /> },
  ];

  const driverNav: Array<{ key: DriverTab; label: string; icon: React.ReactNode }> = [
    { key: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'route', label: t.nav.route, icon: <Route className="w-5 h-5" /> },
    { key: 'bookings', label: t.nav.bookings, icon: <ClipboardList className="w-5 h-5" /> },
    { key: 'earnings', label: t.nav.earnings, icon: <Wallet className="w-5 h-5" /> },
    { key: 'profile', label: t.nav.profile, icon: <User className="w-5 h-5" /> },
  ];

  const adminNav: Array<{ key: AdminTab; label: string; icon: React.ReactNode }> = [
    { key: 'overview', label: t.nav.overview, icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'passengers', label: t.nav.passengers, icon: <Users className="w-4 h-4" /> },
    { key: 'drivers', label: t.nav.drivers, icon: <User className="w-4 h-4" /> },
    { key: 'taxis', label: t.nav.taxis, icon: <Car className="w-4 h-4" /> },
    { key: 'bookings', label: t.nav.bookings, icon: <ClipboardList className="w-4 h-4" /> },
    { key: 'analytics', label: t.nav.analytics, icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const currentNav =
    role === 'passenger' ? passengerNav : role === 'driver' ? driverNav : adminNav;
  const activeNavKey =
    role === 'passenger' ? passengerTab : role === 'driver' ? driverTab : adminTab;

  const handleNavSelect = (key: string) => {
    if (role === 'passenger') setPassengerTab(key as PassengerTab);
    else if (role === 'driver') setDriverTab(key as DriverTab);
    else setAdminTab(key as AdminTab);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1E293B] flex flex-col">
      {/* Top Bar: 52px on mobile, 64px on desktop */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-[52px] lg:h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => setShowWelcome(true)}
          className="text-lg lg:text-xl font-extrabold tracking-tight text-[#173B75] whitespace-nowrap shrink-0 text-start"
        >
          Taxi<span className="text-[#2563EB]">Seat</span>
        </button>

        {/* Zone 2: Desktop Single-Line Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {currentNav.map((item) => {
            const isActive = item.key === activeNavKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavSelect(item.key)}
                className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#2563EB] text-[#173B75] font-semibold'
                    : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Utility Group */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSelector compact />
          <NotificationBell />
        </div>
      </header>

      {/* Workspace Mode Toolbar (Below Top Bar) */}
      <div className="bg-white/80 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center bg-[#F5F7FA] border border-slate-200 rounded-xl p-0.5">
            {(['passenger', 'driver', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`min-h-[32px] px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  role === r
                    ? 'bg-[#173B75] text-white'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {t.roles[r]}
              </button>
            ))}
          </div>

          <p className="text-[11px] font-medium text-[#64748B] hidden sm:block">
            {t.common.simulatedNotice}
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-20 lg:pb-10">
        {role === 'passenger' && (
          <>
            {(passengerTab === 'home' || passengerTab === 'search') && (
              <PassengerSearchAndDetails
                activeTab={passengerTab}
                onNavigateTab={setPassengerTab}
                pickupId={pickupId}
                setPickupId={setPickupId}
                destinationId={destinationId}
                setDestinationId={setDestinationId}
              />
            )}
            {passengerTab === 'bookings' && (
              <PassengerBookingsTab onGoSearch={() => setPassengerTab('home')} />
            )}
            {passengerTab === 'history' && <PassengerHistoryTab />}
            {passengerTab === 'profile' && <PassengerProfileTab />}
          </>
        )}

        {role === 'driver' && (
          <DriverWorkspace activeTab={driverTab} onTabChange={setDriverTab} />
        )}

        {role === 'admin' && <AdminWorkspace activeTab={adminTab} />}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (<= 56px height) */}
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 start-0 end-0 z-40 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-flow-col auto-cols-fr items-center px-1"
      >
        {currentNav.map((item) => {
          const isActive = item.key === activeNavKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavSelect(item.key)}
              className={`h-full flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-[#2563EB]' : 'text-[#64748B]'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-semibold tracking-tight truncate max-w-[66px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <TaxiSeatProvider>
      <AppShell />
    </TaxiSeatProvider>
  );
}
