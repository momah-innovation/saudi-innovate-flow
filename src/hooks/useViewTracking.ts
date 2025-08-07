import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

interface UseViewTrackingProps {
  opportunityId: string;
  enabled?: boolean;
}

export const useViewTracking = ({ opportunityId, enabled = true }: UseViewTrackingProps) => {
  const { user } = useAuth();
  const sessionId = useRef<string>();
  
  // Initialize session ID
  if (!sessionId.current) {
    const stored = sessionStorage.getItem('opportunity-session');
    if (stored) {
      sessionId.current = stored;
    } else {
      const newSessionId = crypto.randomUUID();
      sessionStorage.setItem('opportunity-session', newSessionId);
      sessionId.current = newSessionId;
    }
  }
  
  const startTime = useRef<number>(Date.now());
  const tracked = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled || !opportunityId || tracked.current) return;

    const trackView = async () => {
      try {
        // Track the view
        await supabase.functions.invoke('track-opportunity-analytics', {
          body: {
            opportunityId,
            action: 'view',
            userId: user?.id,
            sessionId: sessionId.current,
            metadata: {
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              referrer: document.referrer,
              url: window.location.href
            }
          }
        });

        tracked.current = true;
      } catch (error) {
        logger.error('Failed to track view', { component: 'useViewTracking', action: 'trackView', opportunityId }, error as Error);
      }
    };

    // Track view after a short delay to ensure it's a meaningful view
    const timer = setTimeout(trackView, 1000);

    return () => {
      clearTimeout(timer);
      
      // Track time spent when component unmounts
      if (tracked.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        
        supabase.functions.invoke('track-opportunity-analytics', {
          body: {
            opportunityId,
            action: 'view',
            userId: user?.id,
            sessionId: sessionId.current,
            timeSpent,
            metadata: {
              timeSpent,
              endTime: new Date().toISOString()
            }
          }
        }).catch(error => {
          logger.error('Failed to track time spent', { component: 'useViewTracking', action: 'trackTimeSpent', opportunityId }, error as Error);
        });
      }
    };
  }, [opportunityId, enabled, user?.id]);

  return {
    sessionId: sessionId.current || '',
    trackCustomEvent: async (action: string, metadata?: Record<string, unknown>) => {
      try {
        await supabase.functions.invoke('track-opportunity-analytics', {
          body: {
            opportunityId,
            action,
            userId: user?.id,
            sessionId: sessionId.current,
            metadata: {
              timestamp: new Date().toISOString(),
              ...metadata
            }
          }
        });
      } catch (error) {
        logger.error('Failed to track custom event', { component: 'useViewTracking', action: 'trackCustomEvent' }, error as Error);
      }
    }
  };
};