import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeAnalyticsProps {
  opportunityId: string;
  onAnalyticsUpdate?: (analytics: any) => void;
}

interface AnalyticsUpdate {
  view_count?: number;
  like_count?: number;
  application_count?: number;
  share_count?: number;
}

export const useRealTimeAnalytics = ({ opportunityId, onAnalyticsUpdate }: RealTimeAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsUpdate>({});

  useEffect(() => {
    if (!opportunityId) return;

    // Subscribe to real-time changes for this opportunity's analytics
    const channel = supabase
      .channel('opportunity-analytics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunity_analytics',
          filter: `opportunity_id=eq.${opportunityId}`
        },
        (payload) => {
          console.log('Real-time analytics update:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new) {
            const newAnalytics = {
              view_count: payload.new.view_count,
              like_count: payload.new.like_count,
              application_count: payload.new.application_count,
              share_count: payload.new.share_count
            };
            
            setAnalytics(newAnalytics);
            onAnalyticsUpdate?.(newAnalytics);
          }
        }
      )
      .subscribe();

    // Also subscribe to application changes
    const applicationChannel = supabase
      .channel('opportunity-applications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'opportunity_applications',
          filter: `opportunity_id=eq.${opportunityId}`
        },
        (payload) => {
          console.log('New application:', payload);
          // Trigger analytics refresh
          refreshAnalytics();
        }
      )
      .subscribe();

    // Subscribe to likes changes
    const likesChannel = supabase
      .channel('opportunity-likes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunity_likes',
          filter: `opportunity_id=eq.${opportunityId}`
        },
        (payload) => {
          console.log('Likes update:', payload);
          refreshAnalytics();
        }
      )
      .subscribe();

    // Subscribe to shares changes
    const sharesChannel = supabase
      .channel('opportunity-shares-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'opportunity_shares',
          filter: `opportunity_id=eq.${opportunityId}`
        },
        (payload) => {
          console.log('New share:', payload);
          refreshAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(applicationChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(sharesChannel);
    };
  }, [opportunityId, onAnalyticsUpdate]);

  const refreshAnalytics = async () => {
    try {
      const { data } = await supabase.rpc('refresh_opportunity_analytics', {
        p_opportunity_id: opportunityId
      });
      
      // Get updated analytics
      const { data: analyticsData } = await supabase
        .from('opportunity_analytics')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .maybeSingle();
      
      if (analyticsData) {
        const updatedAnalytics = {
          view_count: analyticsData.view_count,
          like_count: analyticsData.like_count,
          application_count: analyticsData.application_count,
          share_count: analyticsData.share_count
        };
        
        setAnalytics(updatedAnalytics);
        onAnalyticsUpdate?.(updatedAnalytics);
      }
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    }
  };

  return { analytics, refreshAnalytics };
};