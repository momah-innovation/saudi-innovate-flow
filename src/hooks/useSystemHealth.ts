import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types for system health
export interface SystemHealthStatus {
  overall: 'healthy' | 'warning' | 'critical' | 'unknown';
  score: number; // 0-100
  components: {
    database: {
      status: 'healthy' | 'warning' | 'critical';
      responseTime: number;
      connections: number;
      lastChecked: string;
    };
    storage: {
      status: 'healthy' | 'warning' | 'critical';
      usage: number; // percentage
      totalSpace: number;
      usedSpace: number;
      lastChecked: string;
    };
    authentication: {
      status: 'healthy' | 'warning' | 'critical';
      activeUsers: number;
      failedLogins24h: number;
      lastChecked: string;
    };
    api: {
      status: 'healthy' | 'warning' | 'critical';
      responseTime: number;
      requestsPerMinute: number;
      errorRate: number;
      lastChecked: string;
    };
    security: {
      status: 'healthy' | 'warning' | 'critical';
      riskLevel: 'low' | 'medium' | 'high';
      incidentsLast24h: number;
      lastSecurityScan: string;
    };
  };
  uptime: {
    current: number; // percentage
    last24h: number;
    last7d: number;
    last30d: number;
  };
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    component: string;
    timestamp: string;
    acknowledged: boolean;
  }>;
  lastUpdated: string;
}

export interface UseSystemHealthReturn {
  health: SystemHealthStatus | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => void;
}

export const useSystemHealth = (
  options: {
    enabled?: boolean; // default true
    refreshInterval?: number; // in milliseconds, default 60 seconds
    includeAlerts?: boolean; // default true
  } = {}
): UseSystemHealthReturn => {
  const {
    enabled = true,
    refreshInterval = 60 * 1000, // 60 seconds
    includeAlerts = true
  } = options;

  const [health, setHealth] = useState<SystemHealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const calculateComponentStatus = useCallback((score: number): 'healthy' | 'warning' | 'critical' => {
    if (score >= 90) return 'healthy';
    if (score >= 70) return 'warning';
    return 'critical';
  }, []);

  const calculateOverallStatus = useCallback((components: any): 'healthy' | 'warning' | 'critical' | 'unknown' => {
    const statuses = Object.values(components).map((comp: any) => comp.status);
    
    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    if (statuses.every(status => status === 'healthy')) return 'healthy';
    
    return 'unknown';
  }, []);

  const fetchSystemHealth = useCallback(async () => {
    if (!enabled) return;

    try {
      setIsError(false);
      setError(null);

      // Parallel queries to check system health
      const [
        systemMetricsResult,
        securityMetricsResult,
        storageStatsResult,
        recentActivitiesResult
      ] = await Promise.all([
        supabase.from('system_metrics_view').select('*').single(),
        supabase.from('security_metrics_view').select('*').single(),
        // Simulate storage stats - in real implementation, this would be from edge function
        Promise.resolve({ data: { usage: 45, total: 1000000000, used: 450000000 } }),
        supabase.from('activity_events').select('*').order('created_at', { ascending: false }).limit(100)
      ]);

      if (systemMetricsResult.error) {
        throw new Error('Failed to fetch system metrics');
      }

      if (securityMetricsResult.error) {
        throw new Error('Failed to fetch security metrics');
      }

      const systemMetrics = systemMetricsResult.data;
      const securityMetrics = securityMetricsResult.data;
      const storageStats = storageStatsResult.data;
      const recentActivities = recentActivitiesResult.data || [];

      // Calculate component health scores
      const dbScore = Math.min(100, Math.max(0, 100 - (systemMetrics.events_24h / 1000) * 10));
      const storageScore = Math.min(100, Math.max(0, 100 - storageStats.usage));
      const authScore = Math.min(100, Math.max(0, 100 - (securityMetrics.access_denied_24h * 5)));
      const apiScore = Math.min(100, Math.max(0, 100 - (systemMetrics.events_24h / 500) * 10));
      const securityScore = securityMetrics.security_score;

      const now = new Date().toISOString();

      const components = {
        database: {
          status: calculateComponentStatus(dbScore),
          responseTime: Math.floor(Math.random() * 100) + 50, // Simulated
          connections: Math.floor(Math.random() * 50) + 10, // Simulated
          lastChecked: now
        },
        storage: {
          status: calculateComponentStatus(storageScore),
          usage: storageStats.usage,
          totalSpace: storageStats.total,
          usedSpace: storageStats.used,
          lastChecked: now
        },
        authentication: {
          status: calculateComponentStatus(authScore),
          activeUsers: systemMetrics.active_users_24h || 0,
          failedLogins24h: securityMetrics.access_denied_24h || 0,
          lastChecked: now
        },
        api: {
          status: calculateComponentStatus(apiScore),
          responseTime: Math.floor(Math.random() * 200) + 100, // Simulated
          requestsPerMinute: Math.floor(Math.random() * 1000) + 200, // Simulated
          errorRate: Math.random() * 5, // Simulated percentage
          lastChecked: now
        },
        security: {
          status: calculateComponentStatus(securityScore),
          riskLevel: securityScore > 80 ? 'low' : securityScore > 60 ? 'medium' : 'high',
          incidentsLast24h: securityMetrics.security_events_24h || 0,
          lastSecurityScan: now
        }
      };

      const overallScore = Math.floor((dbScore + storageScore + authScore + apiScore + securityScore) / 5);

      // Generate alerts based on component status
      const alerts: SystemHealthStatus['alerts'] = [];
      
      if (components.database.status === 'critical') {
        alerts.push({
          id: 'db-critical',
          type: 'critical',
          message: 'Database performance is critically low',
          component: 'database',
          timestamp: now,
          acknowledged: false
        });
      }

      if (components.storage.usage > 85) {
        alerts.push({
          id: 'storage-warning',
          type: 'warning',
          message: 'Storage usage is approaching limit',
          component: 'storage',
          timestamp: now,
          acknowledged: false
        });
      }

      if (components.security.riskLevel === 'high') {
        alerts.push({
          id: 'security-high-risk',
          type: 'error',
          message: 'High security risk detected',
          component: 'security',
          timestamp: now,
          acknowledged: false
        });
      }

      const healthStatus: SystemHealthStatus = {
        overall: calculateOverallStatus(components),
        score: overallScore,
        components,
        uptime: {
          current: 99.9, // Simulated - would come from monitoring service
          last24h: 99.8,
          last7d: 99.5,
          last30d: 99.2
        },
        alerts: includeAlerts ? alerts : [],
        lastUpdated: now
      };

      setHealth(healthStatus);
      setLastUpdated(new Date());

      console.log('System health updated:', {
        overall: healthStatus.overall,
        score: healthStatus.score,
        alertsCount: healthStatus.alerts.length
      });

    } catch (err) {
      console.error('Error fetching system health:', err);
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Failed to fetch system health');
    } finally {
      setIsLoading(false);
    }
  }, [enabled, includeAlerts, calculateComponentStatus, calculateOverallStatus]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchSystemHealth();
  }, [fetchSystemHealth]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setHealth(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        alerts: prev.alerts.map(alert =>
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      };
    });
  }, []);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchSystemHealth();
    }
  }, [enabled, fetchSystemHealth]);

  // Auto-refresh interval
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      fetchSystemHealth();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enabled, refreshInterval, fetchSystemHealth]);

  return {
    health,
    isLoading,
    isError,
    error,
    lastUpdated,
    refresh,
    acknowledgeAlert
  };
};