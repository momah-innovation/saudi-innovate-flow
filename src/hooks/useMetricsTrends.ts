import { useState, useEffect, useCallback } from 'react';

// Types for metrics trends
export interface MetricTrend {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  label: string;
}

export interface MetricsTrendsData {
  users: {
    total: MetricTrend;
    active: MetricTrend;
    growth: MetricTrend;
  };
  challenges: {
    total: MetricTrend;
    active: MetricTrend;
    submissions: MetricTrend;
    completion: MetricTrend;
  };
  system: {
    performance: MetricTrend;
    storage: MetricTrend;
    uptime: MetricTrend;
  };
  security: {
    score: MetricTrend;
    incidents: MetricTrend;
    riskLevel: MetricTrend;
  };
  lastUpdated: string;
}

export interface UseMetricsTrendsReturn {
  trends: MetricsTrendsData | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refresh: () => void;
}

export const useMetricsTrends = (
  currentMetrics: any, // AdminDashboardMetrics
  options: {
    comparisonPeriod?: 'yesterday' | 'lastWeek' | 'lastMonth'; // default 'lastWeek'
    enabled?: boolean; // default true
  } = {}
): UseMetricsTrendsReturn => {
  const {
    comparisonPeriod = 'lastWeek',
    enabled = true
  } = options;

  const [trends, setTrends] = useState<MetricsTrendsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTrend = useCallback((current: number, previous: number): 'up' | 'down' | 'stable' => {
    const threshold = 0.05; // 5% threshold for stability
    const change = previous > 0 ? (current - previous) / previous : 0;
    
    if (Math.abs(change) < threshold) return 'stable';
    return change > 0 ? 'up' : 'down';
  }, []);

  const createMetricTrend = useCallback((
    current: number,
    previous: number,
    label: string
  ): MetricTrend => {
    const change = current - previous;
    const changePercentage = previous > 0 ? (change / previous) * 100 : 0;
    const trend = calculateTrend(current, previous);

    return {
      current,
      previous,
      change,
      changePercentage: Math.round(changePercentage * 100) / 100, // Round to 2 decimal places
      trend,
      label
    };
  }, [calculateTrend]);

  const calculateTrends = useCallback(() => {
    if (!currentMetrics || !enabled) {
      setTrends(null);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // For demonstration, we'll simulate historical data
      // In a real implementation, this would fetch historical metrics from the database
      const simulateHistoricalData = (currentValue: number, variance: number = 0.1) => {
        const randomChange = (Math.random() - 0.5) * 2 * variance;
        return Math.max(0, Math.floor(currentValue * (1 - randomChange)));
      };

      const trendsData: MetricsTrendsData = {
        users: {
          total: createMetricTrend(
            currentMetrics.users?.total || 0,
            simulateHistoricalData(currentMetrics.users?.total || 0, 0.05),
            'Total Users'
          ),
          active: createMetricTrend(
            currentMetrics.users?.active || 0,
            simulateHistoricalData(currentMetrics.users?.active || 0, 0.15),
            'Active Users'
          ),
          growth: createMetricTrend(
            currentMetrics.users?.growthRate || 0,
            simulateHistoricalData(currentMetrics.users?.growthRate || 0, 0.3),
            'Growth Rate'
          )
        },
        challenges: {
          total: createMetricTrend(
            currentMetrics.challenges?.total || 0,
            simulateHistoricalData(currentMetrics.challenges?.total || 0, 0.1),
            'Total Challenges'
          ),
          active: createMetricTrend(
            currentMetrics.challenges?.active || 0,
            simulateHistoricalData(currentMetrics.challenges?.active || 0, 0.2),
            'Active Challenges'
          ),
          submissions: createMetricTrend(
            currentMetrics.challenges?.submissions || 0,
            simulateHistoricalData(currentMetrics.challenges?.submissions || 0, 0.25),
            'Submissions'
          ),
          completion: createMetricTrend(
            currentMetrics.challenges?.completionRate || 0,
            simulateHistoricalData(currentMetrics.challenges?.completionRate || 0, 0.1),
            'Completion Rate'
          )
        },
        system: {
          performance: createMetricTrend(
            currentMetrics.system?.performance || 0,
            simulateHistoricalData(currentMetrics.system?.performance || 0, 0.05),
            'Performance Score'
          ),
          storage: createMetricTrend(
            currentMetrics.system?.storageUsed || 0,
            simulateHistoricalData(currentMetrics.system?.storageUsed || 0, 0.1),
            'Storage Usage'
          ),
          uptime: createMetricTrend(
            currentMetrics.system?.uptime || 0,
            simulateHistoricalData(currentMetrics.system?.uptime || 0, 0.01),
            'System Uptime'
          )
        },
        security: {
          score: createMetricTrend(
            currentMetrics.security?.securityScore || 0,
            simulateHistoricalData(currentMetrics.security?.securityScore || 0, 0.05),
            'Security Score'
          ),
          incidents: createMetricTrend(
            currentMetrics.security?.incidents || 0,
            simulateHistoricalData(currentMetrics.security?.incidents || 0, 0.3),
            'Security Incidents'
          ),
          riskLevel: createMetricTrend(
            currentMetrics.security?.riskLevel === 'low' ? 1 : 
            currentMetrics.security?.riskLevel === 'medium' ? 2 : 3,
            Math.floor(Math.random() * 3) + 1,
            'Risk Level'
          )
        },
        lastUpdated: new Date().toISOString()
      };

      setTrends(trendsData);
      
      console.log('Metrics trends calculated:', {
        usersTrend: trendsData.users.total.trend,
        challengesTrend: trendsData.challenges.total.trend,
        securityTrend: trendsData.security.score.trend
      });

    } catch (err) {
      console.error('Error calculating trends:', err);
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Failed to calculate trends');
    } finally {
      setIsLoading(false);
    }
  }, [currentMetrics, enabled, comparisonPeriod, createMetricTrend]);

  const refresh = useCallback(() => {
    calculateTrends();
  }, [calculateTrends]);

  // Calculate trends when current metrics change
  useEffect(() => {
    calculateTrends();
  }, [calculateTrends]);

  return {
    trends,
    isLoading,
    isError,
    error,
    refresh
  };
};