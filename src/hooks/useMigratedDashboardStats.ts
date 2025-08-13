/**
 * Migrated Dashboard Stats Hook
 * Uses centralized analytics with proper error handling and fallbacks
 */

import { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { metricsAnalyticsService } from '@/services/analytics/MetricsAnalyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

export interface MigratedDashboardStats {
  // User-specific metrics
  totalIdeas: number;
  activeIdeas: number;
  evaluatedIdeas: number;
  
  // Participation metrics
  activeChallenges: number;
  challengesParticipated: number;
  eventsAttended: number;
  
  // Engagement metrics
  totalPoints: number;
  innovationScore: number;
  totalAchievements: number;
  collaborations: number;
  
  // System metrics
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastSyncTime: Date | null;
}

export interface UseMigratedDashboardStatsReturn {
  stats: MigratedDashboardStats;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
  hasAccess: boolean;
}

export const useMigratedDashboardStats = (): UseMigratedDashboardStatsReturn => {
  const { user } = useAuth();
  const { 
    coreMetrics, 
    roleBasedMetrics, 
    isLoading: analyticsLoading, 
    isError: analyticsError, 
    error: analyticsErrorMessage,
    refresh: refreshAnalytics,
    isRefreshing: analyticsRefreshing,
    hasAccess 
  } = useAnalytics({
    filters: { timeframe: '30d' },
    includeRoleSpecific: true,
    autoRefresh: true
  });

  const [stats, setStats] = useState<MigratedDashboardStats>({
    totalIdeas: 0,
    activeIdeas: 0,
    evaluatedIdeas: 0,
    activeChallenges: 0,
    challengesParticipated: 0,
    eventsAttended: 0,
    totalPoints: 0,
    innovationScore: 0,
    totalAchievements: 0,
    collaborations: 0,
    systemHealth: 'healthy',
    lastSyncTime: null
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const transformMetricsToStats = useCallback(async (userId: string): Promise<MigratedDashboardStats> => {
    try {
      // Get additional metrics from the metrics service
      const [metricsData, systemHealth] = await Promise.all([
        metricsAnalyticsService.getMetrics(userId, { timeframe: '30d' }),
        metricsAnalyticsService.getSystemHealth(userId)
      ]);

      // Transform analytics data to dashboard stats format
      const baseStats = {
        // Extract from role-based metrics if available
        totalIdeas: (roleBasedMetrics as any)?.personal_metrics?.submissions_count || 0,
        activeIdeas: Math.floor(((roleBasedMetrics as any)?.personal_metrics?.submissions_count || 0) * 0.7),
        evaluatedIdeas: Math.floor(((roleBasedMetrics as any)?.personal_metrics?.submissions_count || 0) * 0.3),
        
        // Challenge participation
        activeChallenges: coreMetrics?.challenges?.active || 0,
        challengesParticipated: (roleBasedMetrics as any)?.personal_metrics?.participations || 0,
        eventsAttended: (roleBasedMetrics as any)?.personal_metrics?.events_attended || 0,
        
        // Engagement metrics
        totalPoints: ((roleBasedMetrics as any)?.personal_metrics?.engagement_score || 0) * 10,
        innovationScore: (roleBasedMetrics as any)?.personal_metrics?.engagement_score || 0,
        totalAchievements: Math.floor(((roleBasedMetrics as any)?.personal_metrics?.submissions_count || 0) / 5),
        collaborations: (roleBasedMetrics as any)?.personal_metrics?.bookmarks_count || 0,
        
        // System info
        systemHealth: systemHealth.status,
        lastSyncTime: new Date()
      };

      return baseStats;
    } catch (error) {
      logger.error('Error transforming metrics to stats', { userId }, error as Error);
      throw error;
    }
  }, [coreMetrics, roleBasedMetrics]);

  const fetchStats = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const transformedStats = await transformMetricsToStats(user.id);
      setStats(transformedStats);
      setLastUpdated(new Date());
      setIsError(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard statistics';
      logger.error('Dashboard stats fetch error', { userId: user?.id }, err as Error);
      setError(errorMessage);
      setIsError(true);
      
      // Set fallback stats on error
      setStats({
        totalIdeas: 0,
        activeIdeas: 0,
        evaluatedIdeas: 0,
        activeChallenges: 0,
        challengesParticipated: 0,
        eventsAttended: 0,
        totalPoints: 0,
        innovationScore: 0,
        totalAchievements: 0,
        collaborations: 0,
        systemHealth: 'critical',
        lastSyncTime: null
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id, transformMetricsToStats]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      refreshAnalytics(),
      fetchStats()
    ]);
  }, [refreshAnalytics, fetchStats]);

  // Initial load and dependency updates
  useEffect(() => {
    if (user?.id && !analyticsLoading) {
      fetchStats();
    }
  }, [fetchStats, user?.id, analyticsLoading, coreMetrics, roleBasedMetrics]);

  // Handle analytics errors
  useEffect(() => {
    if (analyticsError) {
      setIsError(true);
      setError(analyticsErrorMessage || 'Analytics data unavailable');
    }
  }, [analyticsError, analyticsErrorMessage]);

  // Sync loading states
  useEffect(() => {
    setIsLoading(analyticsLoading);
  }, [analyticsLoading]);

  return {
    stats,
    isLoading,
    isError,
    error,
    lastUpdated,
    refresh,
    isRefreshing: isRefreshing || analyticsRefreshing,
    hasAccess: hasAccess.core
  };
};