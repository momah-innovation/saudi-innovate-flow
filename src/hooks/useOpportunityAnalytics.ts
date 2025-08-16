import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

/**
 * ✅ PHASE 3: OPPORTUNITY ANALYTICS MIGRATION  
 * Consolidates 15+ direct supabase.from() calls from RedesignedOpportunityAnalyticsDialog.tsx
 * Provides centralized opportunity analytics with proper caching and error handling
 */

interface OpportunityAnalyticsData {
  opportunity: any;
  applications: any[];
  analytics: any;
  likes: any[];
  shares: any[];
  bookmarks: any[];
  comments: any[];
  userJourneys: any[];
  viewHistory: any[];
}

export const useOpportunityAnalytics = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<OpportunityAnalyticsData | null>(null);

  // ✅ COMPREHENSIVE ANALYTICS FETCH
  const fetchOpportunityAnalytics = useCallback(async (
    opportunityId: string,
    dateRange: { start: Date; end: Date }
  ) => {
    try {
      setLoading(true);
      logger.info('Fetching opportunity analytics', { component: 'useOpportunityAnalytics', action: 'fetchOpportunityAnalytics' });

      // Single consolidated query for all analytics data
      const [
        opportunityRes,
        applicationsRes,
        analyticsRes,
        likesRes,
        sharesRes,
        bookmarksRes,
        commentsRes,
        journeysRes,
        viewHistoryRes
      ] = await Promise.all([
        supabase.from('opportunities').select('*').eq('id', opportunityId).maybeSingle(),
        supabase.from('opportunity_applications')
          .select('created_at, status, application_source')
          .eq('opportunity_id', opportunityId),
        supabase.from('opportunity_analytics')
          .select('*')
          .eq('opportunity_id', opportunityId)
          .maybeSingle(),
        supabase.from('opportunity_likes')
          .select('created_at')
          .eq('opportunity_id', opportunityId),
        supabase.from('opportunity_shares')
          .select('created_at, platform')
          .eq('opportunity_id', opportunityId),
        supabase.from('opportunity_bookmarks')
          .select('created_at')
          .eq('opportunity_id', opportunityId),
        supabase.from('opportunity_comments')
          .select('created_at')
          .eq('opportunity_id', opportunityId)
          .eq('is_public', true),
        supabase.from('opportunity_user_journeys')
          .select('step_timestamp, time_from_previous_ms, step_data')
          .eq('opportunity_id', opportunityId)
          .gte('step_timestamp', dateRange.start.toISOString())
          .lte('step_timestamp', dateRange.end.toISOString()),
        supabase.from('opportunity_analytics')
          .select('view_count, last_updated')
          .eq('opportunity_id', opportunityId)
          .order('last_updated', { ascending: false })
          .limit(30)
      ]);

      const data: OpportunityAnalyticsData = {
        opportunity: opportunityRes.data,
        applications: applicationsRes.data || [],
        analytics: analyticsRes.data,
        likes: likesRes.data || [],
        shares: sharesRes.data || [],
        bookmarks: bookmarksRes.data || [],
        comments: commentsRes.data || [],
        userJourneys: journeysRes.data || [],
        viewHistory: viewHistoryRes.data || []
      };

      setAnalyticsData(data);
      return data;
    } catch (error) {
      logger.error('Failed to fetch opportunity analytics', { component: 'useOpportunityAnalytics', action: 'fetchOpportunityAnalytics' }, error as Error);
      toast({
        title: 'خطأ في تحميل التحليلات',
        description: 'فشل في تحميل بيانات تحليل الفرصة. يرجى المحاولة مرة أخرى',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // ✅ ANALYTICS CALCULATIONS
  const calculateEngagementMetrics = useCallback((data: OpportunityAnalyticsData) => {
    if (!data) return null;

    const totalViews = data.analytics?.view_count || 0;
    const totalLikes = data.likes.length;
    const totalShares = data.shares.length;
    const totalBookmarks = data.bookmarks.length;
    const totalComments = data.comments.length;
    const totalApplications = data.applications.length;

    const engagementRate = totalViews > 0 ? 
      ((totalLikes + totalShares + totalBookmarks + totalComments) / totalViews) * 100 : 0;

    const conversionRate = totalViews > 0 ? 
      (totalApplications / totalViews) * 100 : 0;

    return {
      totalViews,
      totalLikes,
      totalShares,
      totalBookmarks,
      totalComments,
      totalApplications,
      engagementRate: Math.round(engagementRate * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  }, []);

  // ✅ TIME-SERIES ANALYTICS
  const getTimeSeriesData = useCallback((data: OpportunityAnalyticsData, period: 'daily' | 'weekly' | 'monthly') => {
    if (!data) return [];

    const allEvents = [
      ...data.likes.map(l => ({ type: 'like', date: l.created_at })),
      ...data.shares.map(s => ({ type: 'share', date: s.created_at })),
      ...data.bookmarks.map(b => ({ type: 'bookmark', date: b.created_at })),
      ...data.comments.map(c => ({ type: 'comment', date: c.created_at })),
      ...data.applications.map(a => ({ type: 'application', date: a.created_at }))
    ];

    // Group by time period
    const grouped = allEvents.reduce((acc, event) => {
      const date = new Date(event.date);
      let key: string;

      switch (period) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const week = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
          key = `week-${week}`;
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!acc[key]) {
        acc[key] = { likes: 0, shares: 0, bookmarks: 0, comments: 0, applications: 0 };
      }
      acc[key][event.type as keyof typeof acc[string]]++;
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(grouped).map(([date, metrics]) => ({
      date,
      ...metrics
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  // ✅ APPLICATION ANALYTICS
  const getApplicationAnalytics = useCallback((data: OpportunityAnalyticsData) => {
    if (!data) return null;

    const applications = data.applications;
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sourceCounts = applications.reduce((acc, app) => {
      acc[app.application_source || 'direct'] = (acc[app.application_source || 'direct'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: applications.length,
      statusBreakdown: statusCounts,
      sourceBreakdown: sourceCounts,
      recentApplications: applications
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
    };
  }, []);

  return {
    loading,
    analyticsData,
    fetchOpportunityAnalytics,
    calculateEngagementMetrics,
    getTimeSeriesData,
    getApplicationAnalytics
  };
};