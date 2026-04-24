import { useCallback, useEffect, useState } from 'react';
import { fleetService } from '@/services/fleetService';
import type { Driver, FleetStats } from '@/services/fleetService';
import { useAuthStore } from '@/store/fleetStore';

interface UseFleetReturn {
  drivers: Driver[];
  stats: FleetStats | null;
  isLoading: boolean;
  error: string | null;
  isAuthorised: boolean;
  refetch: () => Promise<void>;
}

const EMPTY_STATS: FleetStats = {
  totalDrivers: 0,
  activeDrivers: 0,
  onDeliveryDrivers: 0,
  inactiveDrivers: 0,
  avgRating: 0,
  totalDeliveriesToday: 0,
};

/**
 * useFleet — the single hook for fleet-dashboard state.
 *
 * 1. Gates access by checking the user role from the auth store.
 * 2. Fetches driver data from the backend via fleetService.
 * 3. Exposes loading / error states for the component layer.
 */
export function useFleet(): UseFleetReturn {
  const role = useAuthStore((s) => s.role);
  const isAuthorised = role === 'Fleet Operator';

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState<FleetStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    if (!isAuthorised) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fleetService.getDrivers();
      setDrivers(res.drivers);
      setStats(res.stats);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load fleet data';
      setError(message);
      setDrivers([]);
      setStats(EMPTY_STATS);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthorised]);

  useEffect(() => {
    void fetchDrivers();
  }, [fetchDrivers]);

  return { drivers, stats, isLoading, error, isAuthorised, refetch: fetchDrivers };
}
