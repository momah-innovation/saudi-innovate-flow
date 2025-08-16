/**
 * Optimized React Query Client Configuration
 * Main query client setup with enhanced performance settings
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { logger } from '@/utils/logger';
// EMERGENCY PERFORMANCE CONFIG - Aggressive caching for app freeze fix
const queryConfig: DefaultOptions = {
  queries: {
    // EXTENDED: Cache for 10 minutes to reduce refetching
    staleTime: 10 * 60 * 1000,
    // EXTENDED: Keep in cache for 30 minutes
    gcTime: 30 * 60 * 1000,
    // DISABLED: Prevent aggressive refetching that causes freezes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    // REDUCED: Minimize retries to prevent cascade failures
    retry: 1,
    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // OPTIMIZED: Use cache-first approach
    networkMode: 'offlineFirst'
  },
  mutations: {
    // REDUCED: Retry mutations only once to prevent freezes
    retry: 1,
    // OPTIMIZED: Use offline-first for mutations too
    networkMode: 'offlineFirst'
  }
};

// Create optimized query client
export const createOptimizedQueryClient = () => {
  const client = new QueryClient({
    defaultOptions: queryConfig
  });

  // Lightweight React Query event logging (dev-friendly)
  try {
    const qc = client.getQueryCache();
    qc.subscribe((event: any) => {
      const type = event?.type;
      const q = event?.query;
      if (type && q) {
        try {
          logger.debug(`RQ:${type}`, {
            component: 'ReactQuery',
            query: JSON.stringify(q.queryKey),
            status: q.state?.status,
            responseTime: q.state?.dataUpdatedAt ? Date.now() - q.state.dataUpdatedAt : undefined,
          });
        } catch {}
      }
    });

    const mc = client.getMutationCache();
    mc.subscribe((event: any) => {
      const type = event?.type;
      const m = event?.mutation;
      if (type && m) {
        try {
          logger.debug(`RQ mutation:${type}`, {
            component: 'ReactQuery',
            operation: m.options?.mutationKey ? JSON.stringify(m.options.mutationKey) : 'unknown',
            status: m.state?.status,
          });
        } catch {}
      }
    });
  } catch {}

  return client;
};
// Export query client instance
export const queryClient = createOptimizedQueryClient();
