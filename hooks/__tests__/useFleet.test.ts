import { renderHook, act } from '@testing-library/react';
import { useFleet } from '@/hooks/useFleet';
import { useAuthStore } from '@/store/fleetStore';
import { fleetService } from '@/services/fleetService';

/* ── Mocks ──────────────────────────────────── */

jest.mock('@/services/fleetService', () => ({
  fleetService: {
    getDrivers: jest.fn(),
  },
}));

const mockDriversResponse = {
  drivers: [
    {
      id: 'd1',
      name: 'Alice Okafor',
      email: 'alice@example.com',
      phone: '+2348012345678',
      status: 'active' as const,
      vehicleType: 'Motorcycle',
      licensePlate: 'LAG-123-AB',
      rating: 4.8,
      totalDeliveries: 120,
      currentLocation: { lat: 6.52, lng: 3.37 },
      lastActive: '2026-04-24T12:00:00Z',
    },
    {
      id: 'd2',
      name: 'Bob Eze',
      email: 'bob@example.com',
      phone: '+2348098765432',
      status: 'on_delivery' as const,
      vehicleType: 'Van',
      licensePlate: 'ABJ-456-CD',
      rating: 4.3,
      totalDeliveries: 85,
      currentLocation: { lat: 9.06, lng: 7.49 },
      lastActive: '2026-04-24T14:30:00Z',
    },
  ],
  stats: {
    totalDrivers: 2,
    activeDrivers: 1,
    onDeliveryDrivers: 1,
    inactiveDrivers: 0,
    avgRating: 4.55,
    totalDeliveriesToday: 12,
  },
};

/* ── Tests ──────────────────────────────────── */

describe('useFleet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      useAuthStore.getState().clearRole();
    });
  });

  it('should mark isAuthorised=false when role is not Fleet Operator', () => {
    act(() => {
      useAuthStore.getState().setRole('Customer');
    });

    const { result } = renderHook(() => useFleet());
    expect(result.current.isAuthorised).toBe(false);
    // Should NOT call the API
    expect(fleetService.getDrivers).not.toHaveBeenCalled();
  });

  it('should mark isAuthorised=false when role is null', () => {
    const { result } = renderHook(() => useFleet());
    expect(result.current.isAuthorised).toBe(false);
    expect(fleetService.getDrivers).not.toHaveBeenCalled();
  });

  it('should fetch drivers when role is Fleet Operator', async () => {
    (fleetService.getDrivers as jest.Mock).mockResolvedValueOnce(mockDriversResponse);

    act(() => {
      useAuthStore.getState().setRole('Fleet Operator');
    });

    const { result } = renderHook(() => useFleet());

    // Wait for the async fetch to complete
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.isAuthorised).toBe(true);
    expect(fleetService.getDrivers).toHaveBeenCalledTimes(1);
    expect(result.current.drivers).toHaveLength(2);
    expect(result.current.stats?.totalDrivers).toBe(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set error when API call fails', async () => {
    (fleetService.getDrivers as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    act(() => {
      useAuthStore.getState().setRole('Fleet Operator');
    });

    const { result } = renderHook(() => useFleet());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.drivers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should not call API for Admin role', () => {
    act(() => {
      useAuthStore.getState().setRole('Admin');
    });

    const { result } = renderHook(() => useFleet());
    expect(result.current.isAuthorised).toBe(false);
    expect(fleetService.getDrivers).not.toHaveBeenCalled();
  });

  it('should not call API for Driver role', () => {
    act(() => {
      useAuthStore.getState().setRole('Driver');
    });

    const { result } = renderHook(() => useFleet());
    expect(result.current.isAuthorised).toBe(false);
    expect(fleetService.getDrivers).not.toHaveBeenCalled();
  });
});
