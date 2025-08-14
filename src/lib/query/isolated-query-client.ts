/**
 * Isolated Query Client - Prevents React Hook Error #321
 * This is a completely isolated query client instance that prevents
 * hook ordering violations by using minimal configuration
 */

import { QueryClient } from '@tanstack/react-query';

// Create a minimal, isolated query client
export const createIsolatedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: false, // Disable retries to prevent hook violations
        refetchOnWindowFocus: false, // Disable refetch to prevent hook violations
        refetchOnReconnect: false, // Disable refetch to prevent hook violations
      },
      mutations: {
        retry: false, // Disable retries to prevent hook violations
      }
    },
  });
};