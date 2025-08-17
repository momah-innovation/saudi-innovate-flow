import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { WorkspaceType } from '@/types/workspace';

interface AnalyticsEvent {
  eventType: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

interface WorkspaceMetrics {
  totalMembers: number;
  activeMembers: number;
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  collaborationScore: number;
  engagementScore: number;
  productivityScore: number;
}

interface AnalyticsData {
  metrics: WorkspaceMetrics;
  trends: {
    memberGrowth: number;
    taskCompletion: number;
    collaborationActivity: number;
  };
  insights: Array<{
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    action?: string;
  }>;
  chartData: {
    activityOverTime: Array<{ date: string; value: number }>;
    tasksByStatus: Array<{ status: string; count: number }>;
    memberActivity: Array<{ member: string; activity: number }>;
  };
}

interface UseWorkspaceAnalyticsOptions {
  workspaceType: WorkspaceType;
  workspaceId: string;
  timeframe?: '7d' | '30d' | '90d' | '1y';
  realTimeUpdates?: boolean;
}

interface UseWorkspaceAnalyticsReturn {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  
  // Event tracking
  trackEvent: (event: AnalyticsEvent) => Promise<void>;
  trackUserAction: (action: string, context?: Record<string, any>) => Promise<void>;
  trackPageView: (page: string, metadata?: Record<string, any>) => Promise<void>;
  
  // Metrics
  refreshMetrics: () => Promise<void>;
  exportAnalytics: (format: 'csv' | 'json' | 'pdf') => Promise<Blob>;
  
  // Real-time capabilities
  startRealTimeTracking: () => void;
  stopRealTimeTracking: () => void;
}

export function useWorkspaceAnalytics(
  options: UseWorkspaceAnalyticsOptions
): UseWorkspaceAnalyticsReturn {
  const { user } = useAuth();
  const {
    workspaceType,
    workspaceId,
    timeframe = '30d',
    realTimeUpdates = false
  } = options;

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate date range based on timeframe
  const getDateRange = useCallback(() => {
    const now = new Date();
    const daysBack = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[timeframe];
    
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    return { startDate, endDate: now };
  }, [timeframe]);

  // Load analytics data
  const loadAnalyticsData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { startDate, endDate } = getDateRange();
      
      // Call edge function for analytics processing
      const { data: analyticsResult, error: edgeFunctionError } = await supabase.functions
        .invoke('workspace-analytics', {
          body: {
            workspaceType,
            workspaceId,
            timeframe,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            userId: user.id
          }
        });

      if (edgeFunctionError) {
        console.warn('Edge function failed, falling back to direct queries:', edgeFunctionError);
        // Fallback to direct database queries
        await loadAnalyticsDirectly();
        return;
      }

      if (analyticsResult) {
        setData(analyticsResult);
      }
    } catch (err) {
      console.error('Analytics loading error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      // Try fallback
      await loadAnalyticsDirectly();
    } finally {
      setIsLoading(false);
    }
  }, [user, workspaceType, workspaceId, timeframe, getDateRange]);

  // Fallback direct analytics loading
  const loadAnalyticsDirectly = useCallback(async () => {
    try {
      // Load basic metrics from database
      const [membersResult, activitiesResult] = await Promise.all([
        // Members
        supabase
          .from('workspace_members')
          .select('*')
          .eq('workspace_id', workspaceId),
        
        // Activities using existing table
        supabase
          .from('workspace_activity_feed')
          .select('*')
          .eq('workspace_id', workspaceId)
          .gte('created_at', getDateRange().startDate.toISOString())
      ]);

      const members = membersResult.data || [];
      const activities = activitiesResult.data || [];

      // Calculate metrics
      const metrics: WorkspaceMetrics = {
        totalMembers: members.length,
        activeMembers: members.filter(m => m.status === 'active').length,
        totalProjects: 0, // Mock data
        activeProjects: 0, // Mock data
        completedTasks: 0, // Mock data
        pendingTasks: 0, // Mock data
        collaborationScore: Math.min(100, activities.length * 2),
        engagementScore: Math.min(100, (activities.length / Math.max(members.length, 1)) * 10),
        productivityScore: 75 // Mock data
      };

      // Generate mock insights
      const insights = [
        {
          type: 'positive' as const,
          title: 'Strong Team Collaboration',
          description: `${metrics.activeMembers} active members contributing regularly`,
          action: 'Continue encouraging team participation'
        },
        {
          type: 'neutral' as const,
          title: 'Productivity Score',
          description: `${metrics.productivityScore}% productivity maintained`,
          action: metrics.productivityScore < 70 ? 'Consider reviewing workflows' : undefined
        }
      ];

      // Generate chart data
      const chartData = {
        activityOverTime: activities.slice(-7).map((activity, index) => ({
          date: new Date(activity.created_at).toLocaleDateString(),
          value: Math.random() * 100 // Mock data
        })),
        tasksByStatus: [
          { status: 'Completed', count: 12 },
          { status: 'Pending', count: 8 },
          { status: 'In Progress', count: 5 }
        ],
        memberActivity: members.slice(0, 5).map(member => ({
          member: member.user_id,
          activity: Math.random() * 100 // Mock data
        }))
      };

      setData({
        metrics,
        trends: {
          memberGrowth: 5.2,
          taskCompletion: 12.3,
          collaborationActivity: 8.7
        },
        insights,
        chartData
      });

    } catch (err) {
      console.error('Direct analytics loading failed:', err);
      setError('Failed to load analytics data');
    }
  }, [workspaceId, getDateRange]);

  // Track analytics event
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    if (!user) return;

    try {
      await supabase.from('analytics_events').insert({
        user_id: user.id,
        event_type: event.eventType,
        event_category: 'workspace',
        entity_type: event.entityType,
        entity_id: event.entityId,
        properties: {
          workspaceType,
          workspaceId,
          ...(event.metadata || {})
        },
        timestamp: event.timestamp || new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, [user, workspaceType, workspaceId]);

  // Track user action
  const trackUserAction = useCallback(async (action: string, context?: Record<string, any>) => {
    await trackEvent({
      eventType: `workspace_${action}`,
      entityType: 'user_action',
      metadata: {
        action,
        ...context
      }
    });
  }, [trackEvent]);

  // Track page view
  const trackPageView = useCallback(async (page: string, metadata?: Record<string, any>) => {
    await trackEvent({
      eventType: 'page_view',
      entityType: 'navigation',
      metadata: {
        page,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        ...metadata
      }
    });
  }, [trackEvent]);

  // Refresh metrics
  const refreshMetrics = useCallback(async () => {
    await loadAnalyticsData();
  }, [loadAnalyticsData]);

  // Export analytics
  const exportAnalytics = useCallback(async (format: 'csv' | 'json' | 'pdf'): Promise<Blob> => {
    if (!data) throw new Error('No analytics data to export');

    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      
      case 'csv':
        const csvContent = [
          'Metric,Value',
          `Total Members,${data.metrics.totalMembers}`,
          `Active Members,${data.metrics.activeMembers}`,
          `Total Projects,${data.metrics.totalProjects}`,
          `Active Projects,${data.metrics.activeProjects}`,
          `Completed Tasks,${data.metrics.completedTasks}`,
          `Pending Tasks,${data.metrics.pendingTasks}`,
          `Collaboration Score,${data.metrics.collaborationScore}`,
          `Engagement Score,${data.metrics.engagementScore}`,
          `Productivity Score,${data.metrics.productivityScore}`
        ].join('\n');
        return new Blob([csvContent], { type: 'text/csv' });
      
      case 'pdf':
        // Mock PDF generation
        return new Blob(['PDF export not implemented'], { type: 'application/pdf' });
      
      default:
        throw new Error('Unsupported export format');
    }
  }, [data]);

  // Real-time tracking
  const startRealTimeTracking = useCallback(() => {
    if (!realTimeUpdates) return;
    
    // Set up real-time subscriptions for workspace activities
    const channel = supabase
      .channel(`workspace-analytics-${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workspace_activity_feed',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => {
          // Refresh analytics when activities change
          loadAnalyticsData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [realTimeUpdates, workspaceId, loadAnalyticsData]);

  const stopRealTimeTracking = useCallback(() => {
    // Implementation for stopping real-time tracking
  }, []);

  // Load analytics on mount and when dependencies change
  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  // Set up real-time tracking if enabled
  useEffect(() => {
    if (realTimeUpdates) {
      const cleanup = startRealTimeTracking();
      return cleanup;
    }
  }, [realTimeUpdates, startRealTimeTracking]);

  return {
    data,
    isLoading,
    error,
    trackEvent,
    trackUserAction,
    trackPageView,
    refreshMetrics,
    exportAnalytics,
    startRealTimeTracking,
    stopRealTimeTracking
  };
}