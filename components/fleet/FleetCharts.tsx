'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { FleetStats } from '@/services/fleetService';

interface FleetChartsProps {
  stats: FleetStats;
}

const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

/**
 * Visual charts — driver status breakdown (pie) and performance bar chart.
 */
export function FleetCharts({ stats }: FleetChartsProps) {
  const statusData = [
    { name: 'Active', value: stats.activeDrivers },
    { name: 'On Delivery', value: stats.onDeliveryDrivers },
    { name: 'Inactive', value: stats.inactiveDrivers },
  ];

  const barData = [
    { metric: 'Drivers', value: stats.totalDrivers },
    { metric: 'Deliveries Today', value: stats.totalDeliveriesToday },
    { metric: 'Avg Rating', value: stats.avgRating },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie — driver status breakdown */}
      <div id="chart-status-pie" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <h3 className="mb-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Driver Status Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {statusData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar — quick performance overview */}
      <div id="chart-performance-bar" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <h3 className="mb-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Fleet Performance
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
