/**
 * Optimized React Query Client Configuration
 * Main query client setup with enhanced performance settings
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { logger } from '@/utils/logger';
// Enhanced query configuration with optimized defaults
const queryConfig: DefaultOptions = {
  queries: {
    // Cache for 2 minutes by default (reduced from 5)
    staleTime: 2 * 60 * 1000,
    // Keep in cache for 5 minutes (reduced from 10)
    gcTime: 5 * 60 * 1000,
    // Disable retries to prevent hook ordering issues
    retry: false,
    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Disable refetching on window focus for performance
    refetchOnWindowFocus: false,
    // Background refetching only on reconnect
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
