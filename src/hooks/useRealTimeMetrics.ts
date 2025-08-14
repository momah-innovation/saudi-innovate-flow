import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

// Types for real-time metrics
export interface RealTimeMetrics {
  activeUsers: {
    current: number;
    online: number;
    trend: 'up' | 'down' | 'stable';
  };
  systemHealth: {
    score: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    uptime: number;
    responseTime: number;
    trend: 'up' | 'down' | 'stable';
  };
  recentActivity: {
    eventsLastHour: number;
    activitiesLastHour: number;
    topActivityTypes: Array<{
      type: string;
      count: number;
    }>;
  };
  security: {
    incidentsLast24h: number;
    criticalEvents: number;
    highRiskEvents: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  recentEvents: Array<{
    type: string;
    timestamp: string;
    metadata: Record<string, any>;
  }>;
  lastUpdated: string;
  refreshInterval: number;
}

export interface UseRealTimeMetricsReturn {
  metrics: RealTimeMetrics | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isConnected: boolean;
  refresh: () => Promise<void>;
}

export const useRealTimeMetrics = (
  options: {
    enabled?: boolean; // default true
    refreshInterval?: number; // in milliseconds, default 30 seconds
  } = {}
): UseRealTimeMetricsReturn => {
  const {
    enabled = true,
    refreshInterval = 30 * 1000 // 30 seconds
  } = options;

  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchRealTimeStats = useCallback(async () => {
    if (!enabled) return;

    try {
      setIsError(false);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('get-real-time-stats');

      if (functionError) {
        throw new Error(functionError.message || 'Failed to fetch real-time stats');
      }

      if (!data) {
        throw new Error('No data received from real-time stats API');
      }

      setMetrics(data);
      setLastUpdated(new Date());
      setIsConnected(true);
      
      debugLog.log('Real-time metrics updated', {
        activeUsers: data.activeUsers?.current,
        systemHealth: data.systemHealth?.score,
        recentEvents: data.recentEvents?.length
      });

    } catch (err) {
      debugLog.error('Error fetching real-time stats', { error: err });
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Failed to fetch real-time stats');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchRealTimeStats();
  }, [fetchRealTimeStats]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchRealTimeStats();
    }
  }, [enabled, fetchRealTimeStats]);

  // Real-time refresh interval
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      fetchRealTimeStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enabled, refreshInterval, fetchRealTimeStats]);

  // Handle visibility change to pause/resume updates
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Resume updates when tab becomes visible
        fetchRealTimeStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, fetchRealTimeStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setMetrics(null);
      setIsLoading(false);
      setIsError(false);
      setError(null);
      setIsConnected(false);
    };
  }, []);

  return {
    metrics,
    isLoading,
    isError,
    error,
    lastUpdated,
    isConnected,
    refresh
  };
};