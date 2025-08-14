/**
 * Optimized React Query Client Configuration
 * Main query client setup with enhanced performance settings
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';

// Enhanced query configuration with optimized defaults
const queryConfig: DefaultOptions = {
  queries: {
    // Cache for 5 minutes by default
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Disable retries to prevent hook ordering issues
    retry: false,
    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus for critical data
    refetchOnWindowFocus: true,
    // Background refetching
    refetchOnReconnect: true,
    // Network mode
    networkMode: 'online'
  },
  mutations: {
    // Retry mutations only once
    retry: 1,
    // Network mode for mutations
    networkMode: 'online'
  }
};

// Create optimized query client
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryConfig
  });
};

// Export query client instance
export const queryClient = createOptimizedQueryClient();
