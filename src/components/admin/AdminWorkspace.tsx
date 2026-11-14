import React, { useState } from 'react';
import {
  Users,
  Car,
  CheckCircle2,
  XCircle,
  Search,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { useTaxiSeat } from '../../context/TaxiSeatContext';
import { MARRAKECH_LANDMARKS } from '../../data/marrakechData';
import { getLandmarkById } from '../../utils/matching';
import { BookingStatusIndicator } from '../SharedControls';
import { BookingStatus } from '../../types';

export type AdminTab =
  | 'overview'
  | 'passengers'
  | 'drivers'
  | 'taxis'
  | 'bookings'
  | 'analytics';

export const AdminWorkspace: React.FC<{ activeTab: AdminTab }> = ({ activeTab }) => {
  const { t, language, passengers, drivers, taxis, bookings } = useTaxiSeat();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');

  const activeTaxisCount = taxis.filter((tx) => tx.isOnline).length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;
  const estimatedRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalMad, 0);

  const totalSeats = taxis.reduce((sum, tx) => sum + tx.capacity, 0);
  const occupiedSeats = taxis.reduce(
    (sum, tx) => sum + tx.seats.filter((s) => s.status !== 'available').length,
    0
  );
  const occupancyPct = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  // Status distribution for chart
  const statusCounts: Array<{ key: BookingStatus; count: number; color: string }> = [
    {
      key: 'pending_confirmation',
      count: bookings.filter((b) => b.status === 'pending_confirmation').length,
      color: 'bg-[#F59E0B]',
    },
    {
      key: 'confirmed',
      count: bookings.filter((b) => b.status === 'confirmed').length,
      color: 'bg-[#2563EB]',
    },
    {
      key: 'driver_approaching',
      count: bookings.filter((b) => b.status === 'driver_approaching').length,
      color: 'bg-[#173B75]',
    },
    {
      key: 'picked_up',
      count: bookings.filter((b) => b.status === 'picked_up').length,
      color: 'bg-blue-500',
    },
    {
      key: 'completed',
      count: completedCount,
      color: 'bg-[#16A34A]',
    },
    {
      key: 'cancelled',
      count: cancelledCount,
      color: 'bg-red-500',
    },
  ];
  const maxStatusCount = Math.max(...statusCounts.map((s) => s.count), 1);

  const corridors = [
    { label: 'Guéliz → Jemaa el-Fna', value: 42 },
    { label: 'Gare ONCF → Guéliz', value: 34 },
    { label: 'Guéliz → Ménara', value: 28 },
    { label: 'Jemaa el-Fna → Majorelle', value: 24 },
    { label: 'Médina → M Avenue', value: 19 },
  ];

  // --- OVERVIEW TAB ---
  if (activeTab === 'overview') {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#173B75]">{t.admin.title}</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">{t.admin.subtitle}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {[
            { label: t.admin.totalPassengers, value: passengers.length, color: 'text-[#1E293B]' },
            { label: t.admin.totalDrivers, value: drivers.length, color: 'text-[#1E293B]' },
            { label: t.admin.activeTaxis, value: `${activeTaxisCount}/${taxis.length}`, color: 'text-[#2563EB]' },
            { label: t.admin.totalBookings, value: bookings.length, color: 'text-[#173B75]' },
            { label: t.admin.completedBookings, value: completedCount, color: 'text-[#16A34A]' },
            { label: t.admin.cancelledBookings, value: cancelledCount, color: 'text-red-600' },
            {
              label: t.admin.platformRevenue,
              value: `${estimatedRevenue} ${t.common.mad}`,
              color: 'text-[#16A34A]',
            },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-[11px] font-medium text-[#64748B] leading-snug">{kpi.label}</p>
              <p className={`text-xl font-extrabold tabular-nums mt-1.5 ${kpi.color}`}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2563EB]" />
              <span>{t.admin.bookingsByStatus}</span>
            </h2>
            <div className="space-y-3">
              {statusCounts.map((s) => (
                <div key={s.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1E293B]">{t.bookingStatus[s.key]}</span>
                    <span className="font-mono-tabular font-bold text-[#1E293B]">{s.count}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#F5F7FA] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.color}`}
                      style={{ width: `${Math.round((s.count / maxStatusCount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              <span>{t.admin.topCorridors}</span>
            </h2>
            <div className="space-y-3">
              {corridors.map((c) => (
                <div key={c.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1E293B]">{c.label}</span>
                    <span className="font-mono-tabular text-[#64748B]">{c.value}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#F5F7FA] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2563EB]"
                      style={{ width: `${Math.round((c.value / 45) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PASSENGERS TABLE ---
  if (activeTab === 'passengers') {
    const filtered = passengers.filter(
      (p) =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-[#173B75]">{t.nav.passengers}</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#64748B] absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.common.searchPlaceholder}
              className="w-full min-h-[40px] ps-9 pe-3 rounded-xl border border-slate-200 bg-white text-xs"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#F5F7FA] text-[#64748B] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{t.welcome.fullName}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.welcome.phone}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.welcome.email}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.admin.tripsCount}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.admin.joinedDate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#F5F7FA]/70">
                  <td className="px-4 py-3 font-bold text-[#1E293B]">{p.fullName}</td>
                  <td className="px-4 py-3 font-mono-tabular text-[#64748B]">{p.phone}</td>
                  <td className="px-4 py-3 text-[#64748B]">{p.email}</td>
                  <td className="px-4 py-3 text-end font-mono-tabular font-semibold">{p.totalTrips}</td>
                  <td className="px-4 py-3 text-end font-mono-tabular text-[#64748B]">{p.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- DRIVERS TABLE ---
  if (activeTab === 'drivers') {
    return (
      <div className="space-y-4 pb-8">
        <h2 className="text-xl font-extrabold text-[#173B75]">{t.nav.drivers}</h2>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#F5F7FA] text-[#64748B] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{t.common.driver}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.driver.licenseLabel}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.search.taxiTypeLabel}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.common.rating}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.admin.tripsCount}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.driver.earningsMonth}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drivers.map((d) => {
                const taxi = taxis.find((tx) => tx.id === d.taxiId);
                return (
                  <tr key={d.id} className="hover:bg-[#F5F7FA]/70">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#1E293B]">{d.fullName}</div>
                      <div className="text-[11px] text-[#64748B]">{d.phone}</div>
                    </td>
                    <td className="px-4 py-3 font-mono-tabular text-[#64748B]">{d.licenseNumber}</td>
                    <td className="px-4 py-3 text-[#173B75] font-semibold">
                      {taxi ? t.taxiTypes[taxi.type] : '—'}
                    </td>
                    <td className="px-4 py-3 text-end font-mono-tabular font-bold">★ {d.rating}</td>
                    <td className="px-4 py-3 text-end font-mono-tabular">{d.totalRides}</td>
                    <td className="px-4 py-3 text-end font-mono-tabular font-bold text-[#16A34A]">
                      {d.monthlyEarningsMad} {t.common.mad}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- TAXIS FLEET TABLE ---
  if (activeTab === 'taxis') {
    return (
      <div className="space-y-4 pb-8">
        <h2 className="text-xl font-extrabold text-[#173B75]">{t.nav.taxis}</h2>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#F5F7FA] text-[#64748B] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{t.common.vehicle}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.common.plate}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.driver.currentRoute}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.admin.occupancy}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.common.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {taxis.map((tx) => {
                const occ = tx.seats.filter((s) => s.status !== 'available').length;
                return (
                  <tr key={tx.id} className="hover:bg-[#F5F7FA]/70">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#1E293B]">{tx.model}</div>
                      <div className="text-[11px] text-[#2563EB] font-semibold">
                        {t.taxiTypes[tx.type]}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono-tabular text-[#64748B]">{tx.plateNumber}</td>
                    <td className="px-4 py-3 text-[#1E293B]">{tx.headingLabel[language]}</td>
                    <td className="px-4 py-3 text-end font-mono-tabular font-bold">
                      {occ} / {tx.capacity}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <span
                        className={`font-semibold ${
                          tx.isOnline ? 'text-[#16A34A]' : 'text-[#64748B]'
                        }`}
                      >
                        {tx.isOnline ? t.common.online : t.common.offline}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- BOOKINGS LEDGER ---
  if (activeTab === 'bookings') {
    const filtered = bookings.filter(
      (b) => statusFilter === 'all' || b.status === statusFilter
    );

    return (
      <div className="space-y-4 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-[#173B75]">{t.nav.bookings}</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | BookingStatus)}
            className="min-h-[40px] px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
          >
            <option value="all">{t.common.all}</option>
            {statusCounts.map((s) => (
              <option key={s.key} value={s.key}>
                {t.bookingStatus[s.key]}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#F5F7FA] text-[#64748B] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{t.common.reference}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.roles.passenger}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.driver.currentRoute}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.common.status}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.search.estimatedFare}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => {
                const pLm = getLandmarkById(MARRAKECH_LANDMARKS, b.pickupId);
                const dLm = getLandmarkById(MARRAKECH_LANDMARKS, b.destinationId);
                return (
                  <tr key={b.id} className="hover:bg-[#F5F7FA]/70">
                    <td className="px-4 py-3 font-mono-tabular font-bold text-[#173B75]">
                      {b.reference}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#1E293B]">
                      {b.passengerName} ({b.seatCode})
                    </td>
                    <td className="px-4 py-3 text-[#64748B]">
                      {pLm?.name[language]} → {dLm?.name[language]}
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusIndicator status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-end font-mono-tabular font-bold text-[#1E293B]">
                      {b.totalMad} {t.common.mad}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- ANALYTICS TAB ---
  const completionRate =
    bookings.length > 0 ? Math.round((completedCount / bookings.length) * 100) : 0;
  const cancellationRate =
    bookings.length > 0 ? Math.round((cancelledCount / bookings.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-8">
      <h2 className="text-xl font-extrabold text-[#173B75]">{t.nav.analytics}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>{t.admin.fleetOccupancy}</span>
            <Car className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-3xl font-extrabold text-[#173B75] tabular-nums">{occupancyPct}%</p>
          <p className="text-xs text-[#64748B] tabular-nums">
            {occupiedSeats} / {totalSeats} {t.common.seats}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>{t.admin.completionRate}</span>
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          </div>
          <p className="text-3xl font-extrabold text-[#16A34A] tabular-nums">{completionRate}%</p>
          <p className="text-xs text-[#64748B] tabular-nums">
            {completedCount} / {bookings.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>{t.admin.cancellationRate}</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-3xl font-extrabold text-red-600 tabular-nums">{cancellationRate}%</p>
          <p className="text-xs text-[#64748B] tabular-nums">
            {cancelledCount} / {bookings.length}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#2563EB]" />
          <span>{t.admin.topCorridors}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {corridors.map((c) => (
            <div key={c.label} className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200">
              <p className="text-xs font-bold text-[#1E293B]">{c.label}</p>
              <p className="text-xl font-extrabold text-[#2563EB] tabular-nums mt-1">
                {c.value}
              </p>
              <p className="text-[11px] text-[#64748B]">{t.admin.corridorDemand}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
