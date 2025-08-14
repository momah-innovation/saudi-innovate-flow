import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { useTimerManager } from '@/utils/timerManager';

interface UseEnhancedViewTrackingProps {
  opportunityId: string;
  enabled?: boolean;
}

export const useEnhancedViewTracking = ({ 
  opportunityId, 
  enabled = true 
}: UseEnhancedViewTrackingProps) => {
  const sessionIdRef = useRef<string>(
    sessionStorage.getItem('opportunity-session') || (() => {
      const newSession = crypto.randomUUID();
      sessionStorage.setItem('opportunity-session', newSession);
      return newSession;
    })()
  );

  const startTimeRef = useRef<number>();
  const viewTrackedRef = useRef(false);
  const pageViewsRef = useRef(0);
  const behaviorEventsRef = useRef<Array<{ action: string; timestamp: number }>>([]);

  // Track behavior events
  const trackBehavior = useCallback(async (actionType: string, actionTarget?: string, durationMs?: number) => {
    if (!enabled) return;

    try {
      await supabase.functions.invoke('track-opportunity-analytics', {
        body: {
          opportunityId,
          sessionId: sessionIdRef.current,
          action: 'behavior',
          metadata: {
            actionType,
            actionTarget,
            durationMs,
            behaviorMetadata: {
              timestamp: Date.now(),
              userAgent: navigator.userAgent,
              pageUrl: window.location.href
            }
          }
        }
      });

      behaviorEventsRef.current.push({
        action: actionType,
        timestamp: Date.now()
      });
    } catch (error) {
      logger.error('Error tracking behavior', { component: 'useEnhancedViewTracking', action: 'trackBehavior', opportunityId, actionType }, error as Error);
    }
  }, [opportunityId, enabled]);

  // Track journey steps
  const trackJourneyStep = useCallback(async (stepName: string, timeSpentSeconds?: number) => {
    if (!enabled) return;

    try {
      await supabase.functions.invoke('track-opportunity-analytics', {
        body: {
          opportunityId,
          sessionId: sessionIdRef.current,
          action: 'journey',
          metadata: {
            stepName,
            timeSpentSeconds,
            stepMetadata: {
              timestamp: Date.now(),
              pageUrl: window.location.href,
              referrer: document.referrer
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error tracking journey step', { component: 'useEnhancedViewTracking', action: 'trackJourneyStep', opportunityId, stepName }, error as Error);
    }
  }, [opportunityId, enabled]);

  // Initialize tracking
  useEffect(() => {
    if (!enabled || !opportunityId || viewTrackedRef.current) return;

    const initializeTracking = async () => {
      startTimeRef.current = Date.now();
      pageViewsRef.current += 1;

      // Get user's geographic info (simplified - in production use IP geolocation)
      const getLocationInfo = () => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const locale = navigator.language;
        
        // Simple mapping - in production use proper IP geolocation
        return {
          countryCode: 'SA',
          countryName: 'Saudi Arabia',
          city: 'Riyadh'
        };
      };

      try {
        const locationInfo = getLocationInfo();
        
        await supabase.functions.invoke('track-opportunity-analytics', {
          body: {
            opportunityId,
            sessionId: sessionIdRef.current,
            action: 'view',
            metadata: {
              ...locationInfo,
              userAgent: navigator.userAgent,
              referrer: document.referrer,
              pageUrl: window.location.href,
              timestamp: Date.now(),
              utmSource: new URLSearchParams(window.location.search).get('utm_source'),
              utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
              utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign')
            }
          }
        });

        // Track initial journey step
        await trackJourneyStep('page_view');
        
        viewTrackedRef.current = true;
      } catch (error) {
        logger.error('Error initializing tracking', { component: 'useEnhancedViewTracking', action: 'initializeTracking', opportunityId }, error as Error);
      }
    };

    const { setTimeout: scheduleTimeout } = useTimerManager();
    const clearTimer = scheduleTimeout(initializeTracking, 1000);
    return clearTimer;
  }, [opportunityId, enabled, trackJourneyStep]);

  // Track time spent on unmount
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (!enabled || !startTimeRef.current) return;

      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const bounce = timeSpent < 30; // Less than 30 seconds is considered bounce

      try {
        await supabase.functions.invoke('track-opportunity-analytics', {
          body: {
            opportunityId,
            sessionId: sessionIdRef.current,
            action: 'timeSpent',
            metadata: {
              durationSeconds: timeSpent,
              pageViews: pageViewsRef.current,
              bounce,
              behaviorEvents: behaviorEventsRef.current.length
            }
          }
        });
      } catch (error) {
        logger.error('Error tracking time spent', { component: 'useEnhancedViewTracking', action: 'trackTimeSpent', opportunityId }, error as Error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleBeforeUnload();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      handleBeforeUnload();
    };
  }, [opportunityId, enabled]);

  // Auto-track common interactions
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const actionTarget = target.tagName.toLowerCase();
      const hasLink = target.closest('a');
      const hasButton = target.closest('button');
      
      if (hasLink || hasButton) {
        trackBehavior('click', hasLink ? 'link' : 'button');
      }
    };

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > 0 && scrollPercent % 25 === 0) {
        trackBehavior('scroll', `${scrollPercent}%`);
      }
    };

    let scrollTimer: (() => void) | undefined;
    const { setTimeout: scheduleTimeout } = useTimerManager();
    const debouncedScroll = () => {
      if (scrollTimer) scrollTimer();
      scrollTimer = scheduleTimeout(handleScroll, 250);
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', debouncedScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', debouncedScroll);
    };
  }, [enabled, trackBehavior]);

  return {
    sessionId: sessionIdRef.current,
    trackBehavior,
    trackJourneyStep
  };
};