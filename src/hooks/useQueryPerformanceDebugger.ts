// Query Performance Debugger Hook
// Provides real-time performance monitoring and debugging capabilities

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { queryBatcher } from '@/utils/queryBatcher';
import { debugLog } from '@/utils/debugLogger';

interface QueryPerformanceData {
  queryStats: Map<string, any>;
  cacheStats: {
    size: number;
    keys: string[];
  };
  slowQueries: any[];
  memoryUsage: any;
  networkStats: any;
  recommendations: string[];
}

export const useQueryPerformanceDebugger = (enabled: boolean = false) => {
  const [performanceData, setPerformanceData] = useState<QueryPerformanceData>({
    queryStats: new Map(),
    cacheStats: { size: 0, keys: [] },
    slowQueries: [],
    memoryUsage: null,
    networkStats: null,
    recommendations: []
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      try {
        // Collect performance metrics
        const queryStats = performanceMonitor.getAllStats();
        const cacheStats = queryBatcher.getCacheStatus();
        const slowQueries = performanceMonitor.getSlowOperations(1000); // 1s threshold
        const memoryUsage = performanceMonitor.getBrowserMetrics().memory;
        
        // Generate performance recommendations
        const recommendations: string[] = [];
        
        // Check for slow queries
        if (slowQueries.length > 0) {
          recommendations.push(`${slowQueries.length} slow queries detected (>1s)`);
        }
        
        // Check cache efficiency
        if (cacheStats.size > 50) {
          recommendations.push('Query cache is large, consider clearing old entries');
        }
        
        // Check memory usage
        if (memoryUsage && memoryUsage.used > memoryUsage.limit * 0.8) {
          recommendations.push('High memory usage detected, consider optimization');
        }
        
        // Check for excessive parallel queries
        const recentChallengeQueries = Array.from(queryStats.keys())
          .filter(key => key.includes('challenge'))
          .length;
        if (recentChallengeQueries > 10) {
          recommendations.push('Many challenge queries running, consider batching');
        }

        setPerformanceData({
          queryStats,
          cacheStats,
          slowQueries: slowQueries.slice(0, 10), // Top 10 slowest
          memoryUsage,
          networkStats: performanceMonitor.getBrowserMetrics().connection,
          recommendations
        });

        // Log performance summary
        debugLog.debug('Query Performance Summary', {
          component: 'QueryPerformanceDebugger',
          totalQueries: queryStats.size,
          cacheSize: cacheStats.size,
          slowQueriesCount: slowQueries.length,
          memoryUsedMB: memoryUsage ? Math.round(memoryUsage.used / 1024 / 1024) : 'N/A',
          recommendations: recommendations.length
        });

      } catch (error) {
        debugLog.error('Performance monitoring error', {}, error as Error);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [enabled, queryClient]);

  const clearPerformanceData = () => {
    performanceMonitor.getAllStats().clear();
    queryBatcher.clearCache();
    queryClient.clear();
    setPerformanceData({
      queryStats: new Map(),
      cacheStats: { size: 0, keys: [] },
      slowQueries: [],
      memoryUsage: null,
      networkStats: null,
      recommendations: []
    });
  };

  const getDetailedStats = (queryKey: string) => {
    return performanceMonitor.getStats(queryKey);
  };

  const getTopSlowQueries = (limit: number = 5) => {
    return performanceMonitor.getSlowOperations(500).slice(0, limit);
  };

  const getCacheEfficiency = () => {
    const cacheStats = queryBatcher.getCacheStatus();
    const queryStats = performanceMonitor.getAllStats();
    
    // Calculate cache hit ratio (simplified)
    const totalQueries = Array.from(queryStats.values()).reduce((sum, stat) => sum + stat.count, 0);
    const cacheHitRatio = cacheStats.size > 0 ? (totalQueries - cacheStats.size) / totalQueries : 0;
    
    return {
      hitRatio: Math.max(0, cacheHitRatio),
      cacheSize: cacheStats.size,
      totalQueries,
      efficiency: cacheHitRatio > 0.7 ? 'good' : cacheHitRatio > 0.4 ? 'fair' : 'poor'
    };
  };

  return {
    performanceData,
    clearPerformanceData,
    getDetailedStats,
    getTopSlowQueries,
    getCacheEfficiency,
    enabled
  };
};