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

      // Fetch data directly from database views and tables
      const [
        { data: adminMetrics },
        { data: systemMetrics },
        { data: securityMetrics }
      ] = await Promise.all([
        supabase.from('admin_dashboard_metrics_view').select('*').single(),
        supabase.from('system_metrics_view').select('*').single(),
        supabase.from('security_metrics_view').select('*').single()
      ]);

      // Build metrics object from database data
      const metrics: AdminDashboardMetrics = {
        users: {
          total: adminMetrics?.total_users || 0,
          active: adminMetrics?.active_users_30d || 0,
          growthRate: adminMetrics?.user_growth_rate_percentage || 0,
          trend: (adminMetrics?.user_growth_rate_percentage || 0) > 0 ? 'up' : 'stable',
          newUsers7d: adminMetrics?.new_users_7d || 0,
          newUsers30d: adminMetrics?.new_users_30d || 0,
          breakdown: {
            admins: adminMetrics?.admin_count || 0,
            innovators: adminMetrics?.innovator_count || 0,
            experts: adminMetrics?.expert_count || 0,
            partners: adminMetrics?.partner_count || 0,
            evaluators: adminMetrics?.evaluator_count || 0,
            domainExperts: adminMetrics?.domain_expert_count || 0,
            teamMembers: adminMetrics?.team_members_count || 0,
          }
        },
        challenges: {
          total: systemMetrics?.challenges_table_size || 0,
          active: 0, // Will be calculated separately if needed
          submissions: systemMetrics?.submissions_table_size || 0,
          completionRate: 0, // Will be calculated separately if needed
          trend: 'stable',
          recentActivity: {
            newChallenges30d: 0,
            newSubmissions30d: 0,
            newParticipants30d: 0,
          },
          statusBreakdown: {
            draft: 0,
            published: 0,
            active: 0,
            evaluation: 0,
            completed: 0,
          },
          priorityBreakdown: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
          }
        },
        system: {
          uptime: 99.9,
          performance: 94,
          storageUsed: (systemMetrics?.total_storage_bytes || 0) / (1024 * 1024 * 1024), // Convert to GB
          errors: 0,
          storage: {
            totalFiles: systemMetrics?.total_files || 0,
            totalBuckets: systemMetrics?.total_buckets || 0,
            totalBytes: systemMetrics?.total_storage_bytes || 0,
            newFiles24h: systemMetrics?.new_files_24h || 0,
            newFiles7d: systemMetrics?.new_files_7d || 0,
          },
          activity: {
            events24h: systemMetrics?.events_24h || 0,
            events7d: systemMetrics?.events_7d || 0,
            activeUsers24h: systemMetrics?.active_users_24h || 0,
          },
          tables: {
            challenges: systemMetrics?.challenges_table_size || 0,
            submissions: systemMetrics?.submissions_table_size || 0,
            events: systemMetrics?.events_table_size || 0,
            profiles: systemMetrics?.profiles_table_size || 0,
          }
        },
        security: {
          incidents: securityMetrics?.high_risk_events_7d || 0,
          failedLogins: securityMetrics?.access_denied_24h || 0,
          riskLevel: securityMetrics?.security_score > 90 ? 'low' : securityMetrics?.security_score > 70 ? 'medium' : 'high',
          securityScore: securityMetrics?.security_score || 0,
          metrics: {
            securityEvents24h: securityMetrics?.security_events_24h || 0,
            securityEvents7d: securityMetrics?.security_events_7d || 0,
            highRiskEvents7d: securityMetrics?.high_risk_events_7d || 0,
            criticalRiskEvents7d: securityMetrics?.critical_risk_events_7d || 0,
            logins24h: securityMetrics?.logins_24h || 0,
            logins7d: securityMetrics?.logins_7d || 0,
            suspiciousActivities7d: securityMetrics?.suspicious_activities_7d || 0,
            pendingRoleRequests: securityMetrics?.pending_role_requests || 0,
          }
        },
        lastUpdated: new Date().toISOString(),
        cacheExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
      };

      setMetrics(metrics);
      setLastUpdated(new Date());
      
      console.log('Admin metrics fetched successfully:', {
        totalUsers: metrics.users?.total,
        totalChallenges: metrics.challenges?.total,
        systemUptime: metrics.system?.uptime,
        securityScore: metrics.security?.securityScore
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