import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/api';

const USER_KEY = ['auth', 'user'];

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: USER_KEY,
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      queryClient.setQueryData(USER_KEY, response.data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      queryClient.setQueryData(USER_KEY, response.data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch {
        // Ignore logout errors
      }
    },
    onSettled: () => {
      queryClient.setQueryData(USER_KEY, null);
      queryClient.clear();
    },
  });

  const extractError = (mutationError) => {
    if (!mutationError) return null;
    const data = mutationError.response?.data;
    if (!data) return mutationError.message;
    if (data.error?.message) return data.error.message;
    if (data.error) return data.error;
    if (typeof data === 'object') {
      const firstKey = Object.keys(data)[0];
      if (firstKey && Array.isArray(data[firstKey])) {
        return data[firstKey][0];
      }
    }
    return mutationError.message;
  };

  return {
    user: user ?? null,
    isLoading: isLoadingUser || loginMutation.isPending || registerMutation.isPending,
    error: extractError(loginMutation.error) || extractError(registerMutation.error),
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
    clearError: () => {
      loginMutation.reset();
      registerMutation.reset();
    },
  };
}
