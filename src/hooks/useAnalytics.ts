/**
 * Centralized Analytics Hook
 * Replaces scattered metrics hooks with unified, RBAC-enabled analytics
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAnalyticsService } from '@/hooks/useAnalyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { logger } from '@/utils/logger';
import type { CoreMetrics, SecurityMetrics, RoleBasedMetrics, AnalyticsFilters } from '@/types/common';

export interface UseAnalyticsOptions {
  filters?: AnalyticsFilters;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  includeRoleSpecific?: boolean;
  includeSecurity?: boolean;
}

export interface UseAnalyticsReturn {
  coreMetrics: CoreMetrics | null;
  securityMetrics: SecurityMetrics | null;
  roleBasedMetrics: RoleBasedMetrics | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
  hasAccess: {
    core: boolean;
    security: boolean;
    analytics: boolean;
  };
}

export const useAnalytics = (options: UseAnalyticsOptions = {}): UseAnalyticsReturn => {
  const {
    filters = {},
    autoRefresh = true,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    includeRoleSpecific = false,
    includeSecurity = false
  } = options;

  const { user, userProfile } = useAuth();
  const { getPrimaryRole, canAccess } = useRoleAccess();
  const { operations: analyticsService } = useAnalyticsService();

  const [coreMetrics, setCoreMetrics] = useState<CoreMetrics | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [roleBasedMetrics, setRoleBasedMetrics] = useState<RoleBasedMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

// Stabilize filters and permissions to avoid re-renders
const stableFilters = useMemo(() => filters, [filters.timeframe, filters.userRole, filters.department, filters.sector]);
const primaryRole = useMemo(() => getPrimaryRole(), [getPrimaryRole]);

// Check access permissions (memoized to prevent infinite loops)
const hasAccess = useMemo(() => ({
  core: !!user,
  security: canAccess('canViewAnalytics'),
  analytics: canAccess('canViewAnalytics') || canAccess('canManageSystem')
}), [user?.id, userProfile?.user_roles]);

  const fetchMetrics = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      // Fetch core metrics (always included)
      if (hasAccess.core) {
        const core = await analyticsService.getCoreMetrics(stableFilters);
        setCoreMetrics(core);
      }

      // Fetch security metrics if requested and user has access
      if (includeSecurity && hasAccess.security) {
        try {
          const security = await analyticsService.getSecurityMetrics();
          setSecurityMetrics(security);
        } catch (securityError) {
          logger.warn('Security metrics access denied', { component: 'useAnalytics', userId: user.id });
          setSecurityMetrics(null);
        }
      }

      // Fetch role-based metrics if requested
      if (includeRoleSpecific && hasAccess.analytics) {
        try {
          const roleBased = await analyticsService.getRoleBasedMetrics(primaryRole, stableFilters);
          setRoleBasedMetrics(roleBased);
        } catch (roleError) {
          logger.warn('Role-based metrics access limited', { component: 'useAnalytics', userId: user.id });
          setRoleBasedMetrics(null);
        }
      }

      setLastUpdated(new Date());
      setIsError(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics data';
      logger.error('Analytics fetch error', { component: 'useAnalytics', userId: user?.id }, err as Error);
      setError(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id, stableFilters, includeRoleSpecific, includeSecurity, hasAccess, primaryRole]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchMetrics();
  }, [fetchMetrics]);

  // Initial load
  useEffect(() => {
    if (user?.id) {
      fetchMetrics();
    }
  }, [fetchMetrics, user?.id]);

  // Auto-refresh setup with improved performance
  useEffect(() => {
    if (!autoRefresh || !user?.id || isLoading || isRefreshing) return;

    const intervalId = setInterval(() => {
      // Only refresh if component is still mounted and user is active
      if (!isLoading && !isRefreshing && document.visibilityState === 'visible') {
        refresh();
      }
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, user?.id, refresh]); // Removed isLoading and isRefreshing

  return {
    coreMetrics,
    securityMetrics,
    roleBasedMetrics,
    isLoading,
    isError,
    error,
    lastUpdated,
    refresh,
    isRefreshing,
    hasAccess
  };
};

// Specialized hooks for common use cases
export const useDashboardAnalytics = (userRole: string = 'innovator') => {
  return useAnalytics({
    filters: { timeframe: '30d' },
    includeRoleSpecific: true,
    autoRefresh: true
  });
};

export const useAdminAnalytics = () => {
  return useAnalytics({
    filters: { timeframe: '30d' },
    includeRoleSpecific: true,
    includeSecurity: false, // Only enable security analytics when explicitly needed
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000 // 5 minutes for admin (reduced from 2 minutes)
  });
};

export const useSecurityAnalytics = () => {
  return useAnalytics({
    includeSecurity: true,
    autoRefresh: false, // Disable auto-refresh to prevent constant calls
    refreshInterval: 5 * 60 * 1000 // 5 minutes if manually refreshed
  });
};