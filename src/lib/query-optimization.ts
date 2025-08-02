/**
 * Phase 8: Performance Optimization - Enhanced React Query Configuration
 * Optimized caching strategies and query management
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';

// Enhanced query configuration with optimized defaults
const queryConfig: DefaultOptions = {
  queries: {
    // Cache for 5 minutes by default
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests 3 times with exponential backoff
    retry: (failureCount, error: any) => {
      // Don't retry 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
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

/**
 * Query key factories for consistent caching
 */
export const queryKeys = {
  // User-related queries
  user: {
    all: ['users'] as const,
    profile: (userId: string) => [...queryKeys.user.all, 'profile', userId] as const,
    preferences: (userId: string) => [...queryKeys.user.all, 'preferences', userId] as const
  },
  
  // Challenge-related queries
  challenges: {
    all: ['challenges'] as const,
    lists: () => [...queryKeys.challenges.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.challenges.lists(), filters] as const,
    details: () => [...queryKeys.challenges.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.challenges.details(), id] as const,
    analytics: (id: string) => [...queryKeys.challenges.detail(id), 'analytics'] as const,
    participants: (id: string) => [...queryKeys.challenges.detail(id), 'participants'] as const
  },
  
  // Idea-related queries
  ideas: {
    all: ['ideas'] as const,
    lists: () => [...queryKeys.ideas.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.ideas.lists(), filters] as const,
    details: () => [...queryKeys.ideas.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.ideas.details(), id] as const,
    analytics: (id: string) => [...queryKeys.ideas.detail(id), 'analytics'] as const
  },
  
  // Event-related queries
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.events.lists(), filters] as const,
    details: () => [...queryKeys.events.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.events.details(), id] as const,
    registrations: (eventId: string) => [...queryKeys.events.detail(eventId), 'registrations'] as const
  },
  
  // System data queries
  system: {
    all: ['system'] as const,
    departments: () => [...queryKeys.system.all, 'departments'] as const,
    sectors: () => [...queryKeys.system.all, 'sectors'] as const,
    domains: () => [...queryKeys.system.all, 'domains'] as const,
    partners: () => [...queryKeys.system.all, 'partners'] as const,
    experts: () => [...queryKeys.system.all, 'experts'] as const
  }
};

/**
 * Cache invalidation strategies
 */
export const cacheInvalidation = {
  // Invalidate challenge-related data after mutations
  onChallengeUpdate: (queryClient: QueryClient, challengeId?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all });
    if (challengeId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.detail(challengeId) });
    }
  },
  
  // Invalidate idea-related data after mutations
  onIdeaUpdate: (queryClient: QueryClient, ideaId?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.ideas.all });
    if (ideaId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.detail(ideaId) });
    }
  },
  
  // Invalidate event-related data after mutations
  onEventUpdate: (queryClient: QueryClient, eventId?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    if (eventId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
    }
  },
  
  // Invalidate user data after profile updates
  onUserUpdate: (queryClient: QueryClient, userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.user.preferences(userId) });
  }
};

/**
 * Prefetching strategies for better UX
 */
export const prefetchStrategies = {
  // Prefetch challenge details when hovering over challenge cards
  prefetchChallengeDetails: (queryClient: QueryClient, challengeId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.challenges.detail(challengeId),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },
  
  // Prefetch user dashboard data on login
  prefetchUserDashboard: (queryClient: QueryClient, userId: string) => {
    // Prefetch user profile
    queryClient.prefetchQuery({
      queryKey: queryKeys.user.profile(userId),
      staleTime: 15 * 60 * 1000 // 15 minutes
    });
    
    // Prefetch active challenges
    queryClient.prefetchQuery({
      queryKey: queryKeys.challenges.list({ status: 'active', limit: 10 }),
      staleTime: 5 * 60 * 1000 // 5 minutes
    });
  },
  
  // Prefetch system data for admin panels
  prefetchSystemData: (queryClient: QueryClient) => {
    const systemQueries = [
      queryKeys.system.departments(),
      queryKeys.system.sectors(),
      queryKeys.system.domains(),
      queryKeys.system.partners(),
      queryKeys.system.experts()
    ];
    
    systemQueries.forEach(queryKey => {
      queryClient.prefetchQuery({
        queryKey,
        staleTime: 30 * 60 * 1000 // 30 minutes - system data changes rarely
      });
    });
  }
};

/**
 * Background sync for real-time updates
 */
export const backgroundSync = {
  // Enable background refetching for critical data
  enableRealtimeUpdates: (queryClient: QueryClient) => {
    // Refetch active challenges every 2 minutes in the background
    setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.challenges.list({ status: 'active' }),
        refetchType: 'active' 
      });
    }, 2 * 60 * 1000);
    
    // Refetch user notifications every minute
    setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['notifications'],
        refetchType: 'active'
      });
    }, 60 * 1000);
  },
  
  // Sync data when app becomes visible
  setupVisibilitySync: (queryClient: QueryClient) => {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Refetch critical data when user returns to app
        queryClient.refetchQueries({
          type: 'active',
          stale: true
        });
      }
    });
  }
};

/**
 * Query optimization hooks
 */
export const queryOptimizations = {
  // Optimistic updates for better UX
  optimisticUpdate: <T>(
    queryClient: QueryClient,
    queryKey: any[],
    updater: (old: T | undefined) => T
  ) => {
    queryClient.setQueryData(queryKey, updater);
  },
  
  // Batch query invalidations
  batchInvalidate: (queryClient: QueryClient, queryKeys: any[][]) => {
    queryClient.invalidateQueries({
      predicate: (query) => queryKeys.some(key => 
        JSON.stringify(query.queryKey).includes(JSON.stringify(key))
      )
    });
  }
};

export default {
  createOptimizedQueryClient,
  queryKeys,
  cacheInvalidation,
  prefetchStrategies,
  backgroundSync,
  queryOptimizations
};
