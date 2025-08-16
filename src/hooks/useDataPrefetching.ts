/**
 * Data Prefetching Hook - Phase 3 Implementation
 * Intelligent data prefetching based on user behavior and routing
 */

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { prefetchStrategies } from '@/lib/query/prefetch-strategies';
import { queryKeys } from '@/lib/query/query-keys';

interface PrefetchConfig {
  enabled?: boolean;
  aggressive?: boolean;
  userBehaviorTracking?: boolean;
}

export const useDataPrefetching = (config: PrefetchConfig = {}) => {
  const { enabled = true, aggressive = false, userBehaviorTracking = true } = config;
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const location = useLocation();

  // Authentication-triggered prefetching
  const prefetchUserData = useCallback(() => {
    if (!user?.id) return;

    // Prefetch user dashboard data
    prefetchStrategies.prefetchUserDashboard(queryClient, user.id);

    // Prefetch user-specific data based on role
    if (user.role === 'admin') {
      prefetchStrategies.prefetchSystemData(queryClient);
    }

    // Prefetch user analytics (using correct query key structure)
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.user.profile(user.id), 'analytics'],
      staleTime: 5 * 60 * 1000 // 5 minutes
    });

    // Prefetch user preferences
    queryClient.prefetchQuery({
      queryKey: queryKeys.user.preferences(user.id),
      staleTime: 15 * 60 * 1000 // 15 minutes
    });
  }, [queryClient, user]);

  // Route-based query preloading
  const prefetchRouteData = useCallback((pathname: string) => {
    const routePatterns = {
      '/challenges': () => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.challenges.list({ status: 'active', limit: 20 }),
          staleTime: 3 * 60 * 1000
        });
        queryClient.prefetchQuery({
          queryKey: [...queryKeys.challenges.all, 'featured'],
          staleTime: 10 * 60 * 1000
        });
      },
      '/ideas': () => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.ideas.list({ status: 'published', limit: 20 }),
          staleTime: 3 * 60 * 1000
        });
        queryClient.prefetchQuery({
          queryKey: [...queryKeys.ideas.all, 'trending'],
          staleTime: 5 * 60 * 1000
        });
      },
      '/events': () => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.events.list({ upcoming: true, limit: 10 }),
          staleTime: 5 * 60 * 1000
        });
        queryClient.prefetchQuery({
          queryKey: [...queryKeys.events.all, 'featured'],
          staleTime: 10 * 60 * 1000
        });
      },
      '/dashboard': () => {
        if (user?.id) {
          prefetchUserData();
          // Prefetch dashboard stats
          queryClient.prefetchQuery({
            queryKey: [...queryKeys.system.all, 'stats'],
            staleTime: 2 * 60 * 1000
          });
        }
      }
    };

    // Find matching route pattern
    const matchedPattern = Object.keys(routePatterns).find(pattern => 
      pathname.startsWith(pattern)
    );

    if (matchedPattern) {
      routePatterns[matchedPattern as keyof typeof routePatterns]();
    }
  }, [queryClient, user, prefetchUserData]);

  // Intelligent cache warming
  const warmCache = useCallback(() => {
    if (!enabled) return;

    // Core system data (departments, sectors, etc.)
    prefetchStrategies.prefetchSystemData(queryClient);

    // Featured content
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.challenges.all, 'featured'],
      staleTime: 15 * 60 * 1000
    });

    queryClient.prefetchQuery({
      queryKey: [...queryKeys.ideas.all, 'featured'],
      staleTime: 15 * 60 * 1000
    });

    // Navigation data
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.system.all, 'navigation'],
      staleTime: 30 * 60 * 1000
    });
  }, [queryClient, enabled]);

  // User behavior prediction
  const predictivePreload = useCallback((hoveredElement: string, targetPath: string) => {
    if (!userBehaviorTracking) return;

    // Preload based on user hover behavior
    if (hoveredElement.includes('challenge')) {
      const challengeId = hoveredElement.split('-')[1];
      if (challengeId) {
        prefetchStrategies.prefetchChallengeDetails(queryClient, challengeId);
      }
    }

    // Preload target route data
    setTimeout(() => {
      prefetchRouteData(targetPath);
    }, 100); // Small delay to avoid unnecessary requests
  }, [queryClient, userBehaviorTracking, prefetchRouteData]);

  // Trigger prefetching on authentication
  useEffect(() => {
    if (user?.id && enabled) {
      prefetchUserData();
    }
  }, [user?.id, enabled, prefetchUserData]);

  // Trigger prefetching on route change
  useEffect(() => {
    if (enabled) {
      prefetchRouteData(location.pathname);
    }
  }, [location.pathname, enabled, prefetchRouteData]);

  // Initial cache warming
  useEffect(() => {
    if (enabled) {
      // Delay initial warming to avoid blocking initial render
      const timer = setTimeout(warmCache, 500);
      return () => clearTimeout(timer);
    }
  }, [enabled, warmCache]);

  return {
    prefetchUserData,
    prefetchRouteData,
    warmCache,
    predictivePreload,
    isEnabled: enabled
  };
};