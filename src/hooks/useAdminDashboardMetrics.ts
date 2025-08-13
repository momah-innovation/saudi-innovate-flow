import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types for the admin dashboard metrics
export interface AdminDashboardMetrics {
  users: {
    total: number;
    active: number;
    growthRate: number;
    trend: 'up' | 'down' | 'stable';
    newUsers7d: number;
    newUsers30d: number;
    breakdown: {
      admins: number;
      innovators: number;
      experts: number;
      partners: number;
      evaluators: number;
      domainExperts: number;
      teamMembers: number;
    };
  };
  challenges: {
    total: number;
    active: number;
    submissions: number;
    completionRate: number;
    trend: 'up' | 'down' | 'stable';
    recentActivity: {
      newChallenges30d: number;
      newSubmissions30d: number;
      newParticipants30d: number;
    };
    statusBreakdown: {
      draft: number;
      published: number;
      active: number;
      evaluation: number;
      completed: number;
    };
    priorityBreakdown: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  system: {
    uptime: number;
    performance: number;
    storageUsed: number;
    errors: number;
    storage: {
      totalFiles: number;
      totalBuckets: number;
      totalBytes: number;
      newFiles24h: number;
      newFiles7d: number;
    };
    activity: {
      events24h: number;
      events7d: number;
      activeUsers24h: number;
    };
    tables: {
      challenges: number;
      submissions: number;
      events: number;
      profiles: number;
    };
  };
  security: {
    incidents: number;
    failedLogins: number;
    riskLevel: 'low' | 'medium' | 'high';
    securityScore: number;
    metrics: {
      securityEvents24h: number;
      securityEvents7d: number;
      highRiskEvents7d: number;
      criticalRiskEvents7d: number;
      logins24h: number;
      logins7d: number;
      suspiciousActivities7d: number;
      pendingRoleRequests: number;
    };
  };
  lastUpdated: string;
  cacheExpiresAt: string;
}

export interface UseAdminDashboardMetricsReturn {
  metrics: AdminDashboardMetrics | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
}

export const useAdminDashboardMetrics = (
  options: {
    refreshInterval?: number; // in milliseconds, default 5 minutes
    autoRefresh?: boolean; // default true
    timeframe?: string; // default '30d'
  } = {}
): UseAdminDashboardMetricsReturn => {
  const {
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    autoRefresh = true,
    timeframe = '30d'
  } = options;

  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      setIsError(false);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('get-admin-metrics', {
        body: { timeframe }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to fetch admin metrics');
      }

      if (!data) {
        throw new Error('No data received from metrics API');
      }

      setMetrics(data);
      setLastUpdated(new Date());
      
      console.log('Admin metrics fetched successfully:', {
        totalUsers: data.users?.total,
        totalChallenges: data.challenges?.total,
        systemUptime: data.system?.uptime,
        securityScore: data.security?.securityScore
      });

    } catch (err) {
      console.error('Error fetching admin metrics:', err);
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [timeframe]);

  const refresh = useCallback(async () => {
    await fetchMetrics(true);
  }, [fetchMetrics]);

  // Initial fetch
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Only auto-refresh if we're not currently loading or refreshing
      if (!isLoading && !isRefreshing) {
        fetchMetrics(true);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isLoading, isRefreshing, fetchMetrics]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setMetrics(null);
      setIsLoading(false);
      setIsRefreshing(false);
      setIsError(false);
      setError(null);
    };
  }, []);

  return {
    metrics,
    isLoading,
    isError,
    error,
    lastUpdated,
    refresh,
    isRefreshing
  };
};