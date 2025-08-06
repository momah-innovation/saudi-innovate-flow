/**
 * React Query Cache Strategies
 * Extracted from query-optimization.ts for better organization
 */

import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

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
  },
  
  // Invalidate translations after updates
  onTranslationUpdate: (queryClient: QueryClient, language?: string) => {
    if (language) {
      queryClient.invalidateQueries({ queryKey: queryKeys.system.translation(language) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.system.translations() });
    }
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
 * Query optimization utilities
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