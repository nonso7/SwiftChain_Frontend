import { act } from '@testing-library/react';
import { useAuthStore } from '@/store/fleetStore';

describe('fleetStore (useAuthStore)', () => {
  afterEach(() => {
    act(() => {
      useAuthStore.getState().clearRole();
    });
  });

  it('should initialise with role = null', () => {
    expect(useAuthStore.getState().role).toBeNull();
  });

  it('should set role to Fleet Operator', () => {
    act(() => {
      useAuthStore.getState().setRole('Fleet Operator');
    });
    expect(useAuthStore.getState().role).toBe('Fleet Operator');
  });

  it('should set role to Customer', () => {
    act(() => {
      useAuthStore.getState().setRole('Customer');
    });
    expect(useAuthStore.getState().role).toBe('Customer');
  });

  it('should clear role back to null', () => {
    act(() => {
      useAuthStore.getState().setRole('Admin');
    });
    expect(useAuthStore.getState().role).toBe('Admin');

    act(() => {
      useAuthStore.getState().clearRole();
    });
    expect(useAuthStore.getState().role).toBeNull();
  });
});
