'use client';

import type { Driver } from '@/services/fleetService';

interface DriverTableProps {
  drivers: Driver[];
}

const STATUS_BADGE: Record<Driver['status'], { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-green-100 text-green-800', text: 'text-green-600', label: 'Active' },
  on_delivery: { bg: 'bg-amber-100 text-amber-800', text: 'text-amber-600', label: 'On Delivery' },
  inactive: { bg: 'bg-red-100 text-red-800', text: 'text-red-600', label: 'Inactive' },
};

/**
 * Sortable table showing all fleet drivers.
 */
export function DriverTable({ drivers }: DriverTableProps) {
  return (
    <div id="driver-table" className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Name', 'Status', 'Vehicle', 'Plate', 'Rating', 'Deliveries', 'Last Active'].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {drivers.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                No drivers found.
              </td>
            </tr>
          ) : (
            drivers.map((d) => {
              const badge = STATUS_BADGE[d.status];
              return (
                <tr key={d.id} className="hover:bg-indigo-50/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    <div>
                      <p>{d.name}</p>
                      <p className="text-xs text-gray-400">{d.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{d.vehicleType}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-mono text-xs">
                    {d.licensePlate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    ⭐ {d.rating.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{d.totalDeliveries}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-400 text-xs">
                    {new Date(d.lastActive).toLocaleString()}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
