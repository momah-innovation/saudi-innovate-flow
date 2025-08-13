/**
 * Centralized Analytics Hook
 * Replaces scattered metrics hooks with unified, RBAC-enabled analytics
 */

import { useState, useEffect, useCallback } from 'react';
import { analyticsService, CoreMetrics, SecurityMetrics, RoleBasedMetrics, AnalyticsFilters } from '@/services/analytics/AnalyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { logger } from '@/utils/logger';

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

  const [coreMetrics, setCoreMetrics] = useState<CoreMetrics | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [roleBasedMetrics, setRoleBasedMetrics] = useState<RoleBasedMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Check access permissions
  const hasAccess = {
    core: !!user,
    security: canAccess('canViewAnalytics'), // Using existing permission
    analytics: canAccess('canViewAnalytics') || canAccess('canManageSystem')
  };

  const fetchMetrics = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const userRole = getPrimaryRole();

      // Fetch core metrics (always included)
      if (hasAccess.core) {
        const core = await analyticsService.getCoreMetrics(user.id, filters);
        setCoreMetrics(core);
      }

      // Fetch security metrics if requested and user has access
      if (includeSecurity && hasAccess.security) {
        try {
          const security = await analyticsService.getSecurityMetrics(user.id);
          setSecurityMetrics(security);
        } catch (securityError) {
          logger.warn('Security metrics access denied', { component: 'useAnalytics', userId: user.id });
          setSecurityMetrics(null);
        }
      }

      // Fetch role-based metrics if requested
      if (includeRoleSpecific && hasAccess.analytics) {
        try {
          const roleBased = await analyticsService.getRoleBasedMetrics(user.id, userRole, filters);
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
  }, [user?.id, filters, includeRoleSpecific, includeSecurity, hasAccess, getPrimaryRole]);

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

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || !user?.id) return;

    const interval = setInterval(() => {
      if (!isLoading && !isRefreshing) {
        refresh();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, user?.id, isLoading, isRefreshing, refresh]);

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
    includeSecurity: true,
    autoRefresh: true,
    refreshInterval: 2 * 60 * 1000 // 2 minutes for admin
  });
};

export const useSecurityAnalytics = () => {
  return useAnalytics({
    includeSecurity: true,
    autoRefresh: true,
    refreshInterval: 1 * 60 * 1000 // 1 minute for security
  });
};