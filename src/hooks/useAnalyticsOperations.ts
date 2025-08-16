import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debugLog } from '@/utils/debugLogger';

export interface AnalyticsEvent {
  event_type: string;
  event_category: string;
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  session_id?: string;
  properties?: Record<string, any>;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
}

export interface AnalyticsQuery {
  timeframe: string;
  metric_type: string;
  filters?: Record<string, any>;
  group_by?: string[];
  aggregation?: string;
}

export interface AnalyticsData {
  metric_category: string;
  total_users: number;
  total_challenges: number;
  total_ideas: number;
  total_events: number;
  total_partners: number;
  total_campaigns: number;
  implemented_ideas: number;
  completed_challenges: number;
  idea_implementation_rate: number;
  challenge_completion_rate: number;
  total_budget_utilized: number;
}

export const useAnalyticsOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const trackEvent = useCallback(async (eventData: AnalyticsEvent) => {
    try {
      const { error: insertError } = await supabase
        .from('analytics_events')
        .insert([{
          event_type: eventData.event_type,
          event_category: eventData.event_category,
          entity_type: eventData.entity_type,
          entity_id: eventData.entity_id,
          user_id: eventData.user_id,
          session_id: eventData.session_id,
          properties: eventData.properties || {},
          page_url: eventData.page_url,
          referrer: eventData.referrer,
          user_agent: eventData.user_agent,
          ip_address: eventData.ip_address,
          timestamp: new Date().toISOString()
        }]);

      if (insertError) throw insertError;
    } catch (err) {
      debugLog.error('Failed to track analytics event', { component: 'AnalyticsOperations' }, err);
      // Don't show toast for analytics errors to avoid UX disruption
    }
  }, []);

  const trackOpportunityView = useCallback(async (opportunityId: string, sessionId: string, metadata?: Record<string, any>) => {
    await trackEvent({
      event_type: 'view',
      event_category: 'opportunity',
      entity_type: 'opportunity',
      entity_id: opportunityId,
      session_id: sessionId,
      properties: {
        view_duration: 0,
        ...metadata
      }
    });
  }, [trackEvent]);

  const trackOpportunityLike = useCallback(async (opportunityId: string, userId: string, liked: boolean) => {
    await trackEvent({
      event_type: liked ? 'like' : 'unlike',
      event_category: 'engagement',
      entity_type: 'opportunity',
      entity_id: opportunityId,
      user_id: userId,
      properties: {
        action: liked ? 'add' : 'remove'
      }
    });
  }, [trackEvent]);

  const trackOpportunityBookmark = useCallback(async (opportunityId: string, userId: string, bookmarked: boolean) => {
    await trackEvent({
      event_type: bookmarked ? 'bookmark' : 'unbookmark',
      event_category: 'engagement',
      entity_type: 'opportunity',
      entity_id: opportunityId,
      user_id: userId,
      properties: {
        action: bookmarked ? 'add' : 'remove'
      }
    });
  }, [trackEvent]);

  const trackOpportunityShare = useCallback(async (opportunityId: string, shareMethod: string, userId?: string) => {
    await trackEvent({
      event_type: 'share',
      event_category: 'engagement',
      entity_type: 'opportunity',
      entity_id: opportunityId,
      user_id: userId,
      properties: {
        share_method: shareMethod
      }
    });
  }, [trackEvent]);

  const trackChallengeView = useCallback(async (challengeId: string, sessionId: string, viewDuration?: number) => {
    await trackEvent({
      event_type: 'view',
      event_category: 'challenge',
      entity_type: 'challenge',
      entity_id: challengeId,
      session_id: sessionId,
      properties: {
        view_duration: viewDuration || 0
      }
    });
  }, [trackEvent]);

  const trackPageView = useCallback(async (pageUrl: string, userId?: string, sessionId?: string) => {
    await trackEvent({
      event_type: 'page_view',
      event_category: 'navigation',
      user_id: userId,
      session_id: sessionId,
      page_url: pageUrl,
      properties: {
        timestamp: Date.now()
      }
    });
  }, [trackEvent]);

  const getAnalyticsData = useCallback(async (query: AnalyticsQuery): Promise<AnalyticsData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: queryError } = await supabase.functions.invoke('get-analytics-data', {
        body: {
          timeframe: query.timeframe,
          metric_type: query.metric_type,
          filters: query.filters,
          group_by: query.group_by,
          aggregation: query.aggregation
        }
      });

      if (queryError) throw queryError;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get analytics data';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getUserEngagement = useCallback(async (userId: string, timeframe: string = '30d') => {
    setLoading(true);
    
    try {
      const { data, error: queryError } = await supabase
        .from('analytics_events')
        .select('event_type, event_category, timestamp, properties')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString())
        .order('timestamp', { ascending: false });

      if (queryError) throw queryError;

      // Process engagement data
      const engagement = {
        total_events: data?.length || 0,
        page_views: data?.filter(e => e.event_type === 'page_view').length || 0,
        likes: data?.filter(e => e.event_type === 'like').length || 0,
        bookmarks: data?.filter(e => e.event_type === 'bookmark').length || 0,
        shares: data?.filter(e => e.event_type === 'share').length || 0,
        views: data?.filter(e => e.event_type === 'view').length || 0
      };

      return engagement;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user engagement';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTopContent = useCallback(async (contentType: string, timeframe: string = '30d', limit: number = 10) => {
    setLoading(true);
    
    try {
      const { data, error: queryError } = await supabase
        .from('analytics_events')
        .select('entity_id, entity_type, event_type')
        .eq('entity_type', contentType)
        .in('event_type', ['view', 'like', 'bookmark', 'share'])
        .gte('timestamp', new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString())
        .limit(1000);

      if (queryError) throw queryError;

      // Aggregate by entity_id
      const aggregated = data?.reduce((acc, event) => {
        if (!acc[event.entity_id]) {
          acc[event.entity_id] = {
            entity_id: event.entity_id,
            views: 0,
            likes: 0,
            bookmarks: 0,
            shares: 0,
            total_engagement: 0
          };
        }
        
        acc[event.entity_id][event.event_type + 's']++;
        acc[event.entity_id].total_engagement++;
        
        return acc;
      }, {} as Record<string, any>);

      // Sort by total engagement and return top items
      const topContent = Object.values(aggregated || {})
        .sort((a: any, b: any) => b.total_engagement - a.total_engagement)
        .slice(0, limit);

      return topContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get top content';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const exportAnalytics = useCallback(async (query: AnalyticsQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: exportError } = await supabase.functions.invoke('export-analytics', {
        body: query
      });

      if (exportError) throw exportError;

      toast({
        title: 'Success',
        description: 'Analytics data exported successfully'
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export analytics';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    error,
    trackEvent,
    trackOpportunityView,
    trackOpportunityLike,
    trackOpportunityBookmark,
    trackOpportunityShare,
    trackChallengeView,
    trackPageView,
    getAnalyticsData,
    getUserEngagement,
    getTopContent,
    exportAnalytics
  };
};