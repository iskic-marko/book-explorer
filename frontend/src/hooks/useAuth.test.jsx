import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './useAuth';

vi.mock('../services/api', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

import { authService } from '../services/api';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authService.getCurrentUser.mockRejectedValue({ response: { status: 401 } });
  });

  it('should have null user when not authenticated', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.user).toBeNull();
  });

  it('should login successfully', async () => {
    const mockUser = { id: 1, username: 'test', email: 'test@test.com' };
    authService.login.mockResolvedValue({ data: { user: mockUser } });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await result.current.login({ username: 'test', password: 'password' });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should register successfully', async () => {
    const mockUser = { id: 1, username: 'newuser', email: 'new@test.com' };
    authService.register.mockResolvedValue({ data: { user: mockUser } });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await result.current.register({ username: 'newuser', password: 'password' });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should logout successfully', async () => {
    authService.logout.mockResolvedValue({});

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.logout();

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
    });
  });
});
