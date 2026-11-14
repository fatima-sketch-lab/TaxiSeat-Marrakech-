import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Car,
  Route,
  CreditCard,
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
} from 'lucide-react';
import { useTaxiSeat } from '../context/TaxiSeatContext';
import { LanguageSelector } from './SharedControls';
import heroImg from '../assets/images/welcome_marrakech_hero_1794684110957.jpg';

export const WelcomeView: React.FC = () => {
  const { t, dir, enterAppAsRole, loginPassenger, registerPassenger } = useTaxiSeat();
  const [authTab, setAuthTab] = useState<'login' | 'register'>('register');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (authTab === 'login') {
      const res = loginPassenger(email, password);
      if (!res.ok && res.error) setError(res.error);
    } else {
      const res = registerPassenger({ fullName, phone, email, password });
      if (!res.ok && res.error) setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1E293B] flex flex-col">
      {/* Clean 3-zone top bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between gap-4 sticky top-0 z-30">
        <span className="text-xl font-extrabold tracking-tight text-[#173B75] whitespace-nowrap shrink-0">
          Taxi<span className="text-[#2563EB]">Seat</span>
        </span>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#64748B]">
          <button
            type="button"
            onClick={() => enterAppAsRole('passenger')}
            className="hover:text-[#1E293B] transition-colors whitespace-nowrap shrink-0"
          >
            {t.roles.passenger}
          </button>
          <button
            type="button"
            onClick={() => enterAppAsRole('driver')}
            className="hover:text-[#1E293B] transition-colors whitespace-nowrap shrink-0"
          >
            {t.roles.driver}
          </button>
          <button
            type="button"
            onClick={() => enterAppAsRole('admin')}
            className="hover:text-[#1E293B] transition-colors whitespace-nowrap shrink-0"
          >
            {t.roles.admin}
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <LanguageSelector compact />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Hero + Features */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold text-[#2563EB]">
                {t.welcome.badge}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#173B75] leading-[1.15] tracking-tight text-balance max-w-2xl">
                {t.welcome.title}
              </h1>
              <p className="text-base text-[#64748B] leading-relaxed max-w-xl">
                {t.welcome.subtitle}
              </p>

              {/* Direct Workspace Entry Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => enterAppAsRole('passenger')}
                  className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#173B75] text-white font-semibold text-sm flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap shrink-0"
                >
                  <span>{t.welcome.continuePassenger}</span>
                  <DirectionalArrow className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => enterAppAsRole('driver')}
                  className="min-h-[46px] px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#2563EB] text-[#1E293B] font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <Car className="w-4 h-4 text-[#2563EB]" />
                  <span>{t.welcome.continueDriver}</span>
                </button>
                <button
                  type="button"
                  onClick={() => enterAppAsRole('admin')}
                  className="min-h-[46px] px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#173B75] text-[#64748B] hover:text-[#1E293B] font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t.welcome.continueAdmin}</span>
                </button>
              </div>
            </div>

            {/* Marrakech Hero Visual */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-[#173B75] aspect-[16/9]">
              {!imgFailed ? (
                <img
                  src={heroImg}
                  alt="Marrakech urban taxi mobility on Avenue Mohammed V"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white bg-gradient-to-br from-[#173B75] to-[#2563EB]">
                  <Car className="w-12 h-12 mb-2 opacity-90" />
                  <p className="text-lg font-bold">TaxiSeat · Marrakech</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#173B75]/75 via-transparent to-transparent flex items-end p-5">
                <p className="text-white text-xs sm:text-sm font-medium">
                  {t.brandTagline} · {t.taxiTypes.small} &amp; {t.taxiTypes.large}
                </p>
              </div>
            </div>
          </div>

          {/* Right Auth Card (Registration & Login) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <h2 className="text-lg font-bold text-[#1E293B]">{t.welcome.authTitle}</h2>
                <div className="inline-flex bg-[#F5F7FA] p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('register');
                      setError(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      authTab === 'register'
                        ? 'bg-white text-[#173B75] shadow-xs'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {t.welcome.registerTab}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('login');
                      setError(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      authTab === 'login'
                        ? 'bg-white text-[#173B75] shadow-xs'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {t.welcome.loginTab}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {authTab === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                        {t.welcome.fullName}
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Salma Benali"
                        className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
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
                        placeholder="+212 6 61 00 00 00"
                        className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    {t.welcome.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="salma.benali@taxiseat.ma"
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    {t.welcome.password}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                {error && (
                  <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full min-h-[46px] rounded-xl bg-[#173B75] hover:bg-[#2563EB] text-white font-semibold text-sm transition-colors"
                >
                  {authTab === 'login' ? t.welcome.signIn : t.welcome.createAccount}
                </button>
              </form>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-[#64748B]">ou / or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={() => enterAppAsRole('passenger')}
                className="w-full min-h-[44px] rounded-xl border border-[#2563EB]/30 bg-[#DBEAFE]/50 hover:bg-[#DBEAFE] text-[#173B75] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-[#2563EB]" />
                <span>{t.welcome.quickDemoBtn}</span>
              </button>
            </div>

            <p className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-[#64748B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>{t.welcome.demoNote}</span>
            </p>
          </div>
        </div>

        {/* 3-Column Feature Summary Strip below Hero */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E293B]">{t.welcome.feature1Title}</h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{t.welcome.feature1Desc}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E293B]">{t.welcome.feature2Title}</h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{t.welcome.feature2Desc}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E293B]">{t.welcome.feature3Title}</h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{t.welcome.feature3Desc}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
