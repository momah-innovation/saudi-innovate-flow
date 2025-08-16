/**
 * Navigation Preloading Hook - Phase 2 Implementation
 * Preloads translations and data on navigation hover/focus
 */

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { debugLog } from '@/utils/debugLogger';

interface NavigationPreloadConfig {
  enabled?: boolean;
  preloadTranslations?: boolean;
  preloadData?: boolean;
  debounceMs?: number;
}

const ROUTE_TRANSLATION_MAP = {
  '/dashboard': ['dashboard', 'analytics', 'insights'],
  '/challenges': ['challenges', 'ideas', 'collaboration'],
  '/challenges-browse': ['challenges', 'browse', 'filters'],
  '/events': ['events', 'registration', 'feedback'],
  '/ideas': ['ideas', 'innovation', 'collaboration'],
  '/opportunities': ['opportunities', 'partnerships', 'business'],
  '/admin': ['admin', 'management'],
  '/admin/analytics': ['admin', 'analytics', 'charts'],
  '/admin/storage': ['admin', 'storage', 'files'],
  '/admin/security': ['admin', 'security', 'monitoring'],
  '/admin/ai-management': ['admin', 'ai', 'models'],
  '/settings': ['settings', 'preferences', 'profile']
};

const ROUTE_DATA_MAP = {
  '/dashboard': [
    ['user-dashboard-data'],
    ['user-notifications'],
    ['user-challenges-summary']
  ],
  '/challenges': [
    ['challenges-list'],
    ['featured-challenges'],
    ['challenge-categories']
  ],
  '/admin/analytics': [
    ['admin-metrics'],
    ['system-analytics'],
    ['performance-stats']
  ],
  '/admin/storage': [
    ['storage-overview'],
    ['bucket-stats']
  ]
};

let preloadTimeouts: Record<string, NodeJS.Timeout> = {};

export const useNavigationPreload = (config: NavigationPreloadConfig = {}) => {
  const {
    enabled = true,
    preloadTranslations = true,
    preloadData = true,
    debounceMs = 300
  } = config;

  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  const preloadTranslationsForRoute = useCallback(async (route: string) => {
    if (!enabled || !preloadTranslations) return;

    try {
      const namespaces = ROUTE_TRANSLATION_MAP[route as keyof typeof ROUTE_TRANSLATION_MAP];
      if (!namespaces) return;

      debugLog.debug('🌐 Preloading translations for route', { 
        component: 'NavigationPreload',
        route,
        namespaces
      });

      await Promise.all(
        namespaces.map(namespace => i18n.loadNamespaces(namespace))
      );

      debugLog.debug('✅ Route translations preloaded', { route });
    } catch (error) {
      debugLog.error('❌ Failed to preload route translations', { route }, error as Error);
    }
  }, [enabled, preloadTranslations, i18n]);

  const preloadDataForRoute = useCallback(async (route: string) => {
    if (!enabled || !preloadData) return;

    try {
      const queryKeys = ROUTE_DATA_MAP[route as keyof typeof ROUTE_DATA_MAP];
      if (!queryKeys) return;

      debugLog.debug('💾 Preloading data for route', { 
        component: 'NavigationPreload',
        route,
        queries: queryKeys.length
      });

      // Only prefetch if not already in cache
      queryKeys.forEach(queryKey => {
        const existingData = queryClient.getQueryData(queryKey);
        if (!existingData) {
          // Prefetch with a short stale time to avoid unnecessary requests
          queryClient.prefetchQuery({
            queryKey,
            queryFn: () => Promise.resolve(null), // Placeholder - actual queries handled by components
            staleTime: 30000, // 30 seconds
            gcTime: 60000, // 1 minute
          });
        }
      });

      debugLog.debug('✅ Route data preloaded', { route });
    } catch (error) {
      debugLog.error('❌ Failed to preload route data', { route }, error as Error);
    }
  }, [enabled, preloadData, queryClient]);

  const preloadRoute = useCallback((route: string) => {
    if (!enabled) return;

    // Clear existing timeout for this route
    if (preloadTimeouts[route]) {
      clearTimeout(preloadTimeouts[route]);
    }

    // Debounce preloading
    preloadTimeouts[route] = setTimeout(async () => {
      await Promise.all([
        preloadTranslationsForRoute(route),
        preloadDataForRoute(route)
      ]);
      delete preloadTimeouts[route];
    }, debounceMs);
  }, [enabled, debounceMs, preloadTranslationsForRoute, preloadDataForRoute]);

  const cancelPreload = useCallback((route: string) => {
    if (preloadTimeouts[route]) {
      clearTimeout(preloadTimeouts[route]);
      delete preloadTimeouts[route];
    }
  }, []);

  const preloadOnHover = useCallback((route: string) => {
    return {
      onMouseEnter: () => preloadRoute(route),
      onMouseLeave: () => cancelPreload(route),
    };
  }, [preloadRoute, cancelPreload]);

  const preloadOnFocus = useCallback((route: string) => {
    return {
      onFocus: () => preloadRoute(route),
      onBlur: () => cancelPreload(route),
    };
  }, [preloadRoute, cancelPreload]);

  return {
    preloadRoute,
    cancelPreload,
    preloadOnHover,
    preloadOnFocus,
    preloadTranslationsForRoute,
    preloadDataForRoute,
  };
};