import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_delivery';
  vehicleType: string;
  licensePlate: string;
  rating: number;
  totalDeliveries: number;
  currentLocation: {
    lat: number;
    lng: number;
  };
  lastActive: string;
}

export interface FleetStats {
  totalDrivers: number;
  activeDrivers: number;
  onDeliveryDrivers: number;
  inactiveDrivers: number;
  avgRating: number;
  totalDeliveriesToday: number;
}

export interface FleetDriversResponse {
  drivers: Driver[];
  stats: FleetStats;
}

/* ──────────────────────────────────────────────
   Service — API communication only.
   Hooks call this; components never call it directly.
   ────────────────────────────────────────────── */

export const fleetService = {
  /**
   * Fetch all drivers belonging to the authenticated fleet operator.
   */
  async getDrivers(): Promise<FleetDriversResponse> {
    const { data } = await axios.get<FleetDriversResponse>(
      `${API_BASE_URL}/api/fleet/drivers`,
    );
    return data;
  },
};
