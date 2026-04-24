'use client';

import { useFleet } from '@/hooks/useFleet';
import { FleetStatsCards } from '@/components/fleet/FleetStatsCards';
import { DriverTable } from '@/components/fleet/DriverTable';
import { FleetCharts } from '@/components/fleet/FleetCharts';
import { FleetMap } from '@/components/fleet/FleetMap';

/**
 * Fleet Dashboard Page
 *
 * Restricted to users holding the "Fleet Operator" role.
 * Uses the Component → Hook → Service layered architecture:
 *   - This component renders UI only.
 *   - useFleet() manages data-fetching + role gating.
 *   - fleetService talks to the backend API.
 */
export default function FleetDashboardPage() {
  const { drivers, stats, isLoading, error, isAuthorised } = useFleet();

  /* ── Role guard ────────────────────────────── */
  if (!isAuthorised) {
    return (
      <div
        id="fleet-access-denied"
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-xl">
          <span className="text-5xl">🔒</span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-500">
            This dashboard is restricted to users with the{' '}
            <strong className="text-indigo-600">Fleet Operator</strong> role.
          </p>
        </div>
      </div>
    );
  }

  /* ── Loading state ─────────────────────────── */
  if (isLoading) {
    return (
      <div
        id="fleet-loading"
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm text-gray-500">Loading fleet data…</p>
        </div>
      </div>
    );
  }

  /* ── Error state ───────────────────────────── */
  if (error) {
    return (
      <div
        id="fleet-error"
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-xl">
          <span className="text-5xl">⚠️</span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  /* ── Dashboard ─────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 id="fleet-heading" className="text-2xl font-bold text-gray-900">
              🚛 Fleet Dashboard
            </h1>
            <p className="text-sm text-gray-500">Monitor drivers, vehicles, and delivery performance</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Stats */}
        {stats && <FleetStatsCards stats={stats} />}

        {/* Map */}
        <FleetMap drivers={drivers} />

        {/* Charts */}
        {stats && <FleetCharts stats={stats} />}

        {/* Driver table */}
        <DriverTable drivers={drivers} />
      </main>
    </div>
  );
}
