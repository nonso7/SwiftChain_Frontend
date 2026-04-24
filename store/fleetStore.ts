import { create } from 'zustand';

export type UserRole =
  | 'Customer'
  | 'Driver'
  | 'Admin'
  | 'Fleet Operator';

interface AuthState {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
}

/**
 * Minimal auth / role store.
 * In production this would be populated after login via JWT claims.
 */
export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  setRole: (role: UserRole) => set({ role }),
  clearRole: () => set({ role: null }),
}));
