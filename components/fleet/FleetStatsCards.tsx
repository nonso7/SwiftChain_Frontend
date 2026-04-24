'use client';

import type { FleetStats } from '@/services/fleetService';

interface FleetStatsCardsProps {
  stats: FleetStats;
}

/**
 * Stats overview cards rendered at the top of the fleet dashboard.
 */
export function FleetStatsCards({ stats }: FleetStatsCardsProps) {
  const cards = [
    {
      id: 'stat-total',
      label: 'Total Drivers',
      value: stats.totalDrivers,
      color: '#6366f1',
      icon: '👥',
    },
    {
      id: 'stat-active',
      label: 'Active Now',
      value: stats.activeDrivers,
      color: '#22c55e',
      icon: '🟢',
    },
    {
      id: 'stat-on-delivery',
      label: 'On Delivery',
      value: stats.onDeliveryDrivers,
      color: '#f59e0b',
      icon: '🚚',
    },
    {
      id: 'stat-inactive',
      label: 'Inactive',
      value: stats.inactiveDrivers,
      color: '#ef4444',
      icon: '🔴',
    },
    {
      id: 'stat-rating',
      label: 'Avg Rating',
      value: stats.avgRating.toFixed(1),
      color: '#8b5cf6',
      icon: '⭐',
    },
    {
      id: 'stat-deliveries-today',
      label: 'Deliveries Today',
      value: stats.totalDeliveriesToday,
      color: '#0ea5e9',
      icon: '📦',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c) => (
        <div
          key={c.id}
          id={c.id}
          className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg transition-transform hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${c.color}cc, ${c.color}88)`,
          }}
        >
          <span className="text-3xl">{c.icon}</span>
          <p className="mt-2 text-sm font-medium opacity-90">{c.label}</p>
          <p className="text-2xl font-bold">{c.value}</p>
          {/* decorative circle */}
          <div
            className="absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20"
            style={{ background: c.color }}
          />
        </div>
      ))}
    </div>
  );
}
