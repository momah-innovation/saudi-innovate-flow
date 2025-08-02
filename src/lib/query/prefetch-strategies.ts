/**
 * Prefetching Strategies for React Query
 * Extracted from query-optimization.ts for better organization
 */

import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

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