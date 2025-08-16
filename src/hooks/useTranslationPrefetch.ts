/**
 * Translation Prefetching Hook - Phase 2 Implementation
 * Optimizes i18n loading by preloading namespaces based on user patterns
 */

import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { debugLog } from '@/utils/debugLogger';

interface TranslationPrefetchConfig {
  enabled?: boolean;
  preloadCoreNamespaces?: boolean;
  preloadRoleBasedNamespaces?: boolean;
  preloadNavigationNamespaces?: boolean;
}

const CORE_NAMESPACES = ['common', 'navigation', 'dashboard'];
const ROLE_BASED_NAMESPACES = {
  admin: ['admin', 'analytics', 'management', 'security'],
  super_admin: ['admin', 'analytics', 'management', 'security', 'system'],
  expert: ['evaluation', 'expertise', 'challenges'],
  team_member: ['collaboration', 'teams', 'projects'],
  innovator: ['ideas', 'challenges', 'collaboration'],
  evaluator: ['evaluation', 'scoring', 'feedback'],
  partner: ['partnerships', 'events', 'collaboration'],
  stakeholder: ['insights', 'reports', 'analytics']
};

const NAVIGATION_NAMESPACES = {
  '/dashboard': ['dashboard', 'analytics', 'insights'],
  '/challenges': ['challenges', 'ideas', 'collaboration'],
  '/events': ['events', 'registration', 'feedback'],
  '/ideas': ['ideas', 'innovation', 'collaboration'],
  '/opportunities': ['opportunities', 'partnerships', 'business'],
  '/admin': ['admin', 'management', 'analytics', 'security']
};

export const useTranslationPrefetch = (config: TranslationPrefetchConfig = {}) => {
  const { 
    enabled = true,
    preloadCoreNamespaces = true,
    preloadRoleBasedNamespaces = true,
    preloadNavigationNamespaces = true
  } = config;

  const { i18n } = useTranslation();
  const { user } = useCurrentUser();

  // Prefetch core namespaces
  const prefetchCoreTranslations = useCallback(async () => {
    if (!enabled || !preloadCoreNamespaces) return;

    try {
      debugLog.debug('🌐 Prefetching core translations', { 
        component: 'TranslationPrefetch',
        namespaces: CORE_NAMESPACES
      });

      await Promise.all(
        CORE_NAMESPACES.map(namespace => 
          i18n.loadNamespaces(namespace)
        )
      );

      debugLog.debug('✅ Core translations prefetched successfully');
    } catch (error) {
      debugLog.error('❌ Failed to prefetch core translations', {}, error as Error);
    }
  }, [enabled, preloadCoreNamespaces, i18n]);

  // Prefetch role-based namespaces
  const prefetchRoleBasedTranslations = useCallback(async (userRoles: string[]) => {
    if (!enabled || !preloadRoleBasedNamespaces || !userRoles.length) return;

    try {
      const namespacesToLoad = new Set<string>();
      
      userRoles.forEach(role => {
        const roleNamespaces = ROLE_BASED_NAMESPACES[role as keyof typeof ROLE_BASED_NAMESPACES];
        if (roleNamespaces) {
          roleNamespaces.forEach(ns => namespacesToLoad.add(ns));
        }
      });

      const namespaceList = Array.from(namespacesToLoad);
      
      debugLog.debug('🌐 Prefetching role-based translations', { 
        component: 'TranslationPrefetch',
        roles: userRoles,
        namespaces: namespaceList
      });

      await Promise.all(
        namespaceList.map(namespace => 
          i18n.loadNamespaces(namespace)
        )
      );

      debugLog.debug('✅ Role-based translations prefetched successfully');
    } catch (error) {
      debugLog.error('❌ Failed to prefetch role-based translations', {}, error as Error);
    }
  }, [enabled, preloadRoleBasedNamespaces, i18n]);

  // Prefetch navigation-based namespaces
  const prefetchNavigationTranslations = useCallback(async (currentPath: string) => {
    if (!enabled || !preloadNavigationNamespaces) return;

    try {
      // Find matching navigation namespaces
      const matchingNamespaces = Object.entries(NAVIGATION_NAMESPACES)
        .filter(([path]) => currentPath.startsWith(path))
        .flatMap(([, namespaces]) => namespaces);

      if (matchingNamespaces.length === 0) return;

      debugLog.debug('🌐 Prefetching navigation translations', { 
        component: 'TranslationPrefetch',
        path: currentPath,
        namespaces: matchingNamespaces
      });

      await Promise.all(
        matchingNamespaces.map(namespace => 
          i18n.loadNamespaces(namespace)
        )
      );

      debugLog.debug('✅ Navigation translations prefetched successfully');
    } catch (error) {
      debugLog.error('❌ Failed to prefetch navigation translations', {}, error as Error);
    }
  }, [enabled, preloadNavigationNamespaces, i18n]);

  // Prefetch on mount and user changes
  useEffect(() => {
    if (!enabled) return;

    const initializePrefetching = async () => {
      // Always prefetch core namespaces first
      await prefetchCoreTranslations();

      // Prefetch role-based namespaces if user has roles
      if (user) {
        // Get user roles from auth metadata or user context
        const userRoles = user.app_metadata?.roles || [];
        if (userRoles.length > 0) {
          await prefetchRoleBasedTranslations(userRoles);
        }

        // Prefetch based on current location
        // Use proper pathname access for prefetch navigation
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        await prefetchNavigationTranslations(currentPath);
      }
    };

    initializePrefetching();
  }, [enabled, user, prefetchCoreTranslations, prefetchRoleBasedTranslations, prefetchNavigationTranslations]);

  // Return prefetch functions for manual use
  return {
    prefetchForRoute: prefetchNavigationTranslations,
    prefetchForRole: prefetchRoleBasedTranslations,
    prefetchCore: prefetchCoreTranslations,
  };
};