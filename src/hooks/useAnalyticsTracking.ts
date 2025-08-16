/**
 * Final Centralized Analytics Hook
 * Consolidates all remaining analytics tracking patterns
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsEventData {
  event_type: string;
  event_category: string;
  properties?: Record<string, any>;
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  page_url?: string;
  session_id?: string;
}

export const useAnalyticsTracking = () => {
  const { user } = useAuth();

  const trackEvent = useCallback(async (eventData: AnalyticsEventData) => {
    try {
      const enrichedData = {
        ...eventData,
        user_id: eventData.user_id || user?.id,
        // Use proper pathname access for analytics tracking
        page_url: eventData.page_url || (typeof window !== 'undefined' ? window.location.pathname : '/'),
        session_id: eventData.session_id || `${user?.id}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        properties: {
          ...eventData.properties,
          browser: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      };

      const { error } = await supabase.from('analytics_events').insert(enrichedData);
      
      if (error) {
        debugLog.error('Analytics tracking failed', { error, eventData: enrichedData });
      } else {
        debugLog.debug('Analytics event tracked', { eventType: eventData.event_type });
      }
    } catch (error) {
      debugLog.error('Analytics tracking error', { error, eventData });
    }
  }, [user]);

  // Specific tracking functions
  const trackDashboardView = useCallback(async (dashboardType: string) => {
    await trackEvent({
      event_type: 'dashboard_view',
      event_category: 'analytics',
      properties: {
        dashboard_type: dashboardType
      }
    });
  }, [trackEvent]);

  const trackSearchPerformed = useCallback(async (query: string, resultCount: number) => {
    await trackEvent({
      event_type: 'search_performed',
      event_category: 'user_interaction',
      properties: {
        query,
        result_count: resultCount,
        search_timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  const trackChallengeView = useCallback(async (challengeId: string) => {
    await trackEvent({
      event_type: 'challenge_viewed',
      event_category: 'engagement',
      entity_type: 'challenge',
      entity_id: challengeId
    });
  }, [trackEvent]);

  const trackOpportunityView = useCallback(async (opportunityId: string) => {
    await trackEvent({
      event_type: 'opportunity_viewed',
      event_category: 'engagement',
      entity_type: 'opportunity',
      entity_id: opportunityId
    });
  }, [trackEvent]);

  const trackEventRegistration = useCallback(async (eventId: string) => {
    await trackEvent({
      event_type: 'event_registration',
      event_category: 'conversion',
      entity_type: 'event',
      entity_id: eventId
    });
  }, [trackEvent]);

  const trackFileOperation = useCallback(async (operation: string, fileName: string, fileSize?: number) => {
    await trackEvent({
      event_type: 'file_operation',
      event_category: 'storage',
      properties: {
        operation,
        file_name: fileName,
        file_size: fileSize
      }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackDashboardView,
    trackSearchPerformed,
    trackChallengeView,
    trackOpportunityView,
    trackEventRegistration,
    trackFileOperation
  };
};

export default useAnalyticsTracking;