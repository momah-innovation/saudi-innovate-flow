import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface UserJourneyTrackerProps {
  opportunityId: string;
  sessionId: string;
}

interface JourneyStep {
  step: string;
  data?: Record<string, any>;
  timestamp?: Date;
}

export const useUserJourneyTracker = ({ opportunityId, sessionId }: UserJourneyTrackerProps) => {
  const [previousStep, setPreviousStep] = useState<string | null>(null);
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const { user } = useCurrentUser();

  const trackJourneyStep = async (step: string, data: Record<string, any> = {}) => {
    try {
      const now = Date.now();
      const timeFromPrevious = previousStep ? now - stepStartTime : 0;
      
      await supabase
        .from('opportunity_user_journeys')
        .insert({
          opportunity_id: opportunityId,
          user_id: user?.id,
          session_id: sessionId,
          journey_step: step,
          step_data: data,
          step_timestamp: new Date().toISOString(),
          page_url: window.location.href,
          previous_step: previousStep,
          time_from_previous_ms: timeFromPrevious
        });

      setPreviousStep(step);
      setStepStartTime(now);
    } catch (error) {
      logger.error('Failed to track journey step', { component: 'useUserJourneyTracker', action: 'trackStep', stepName: step }, error as Error);
    }
  };

  const trackScrollDepth = (percentage: number) => {
    trackJourneyStep('scroll', { 
      scroll_percentage: percentage,
      viewport_height: window.innerHeight,
      page_height: document.documentElement.scrollHeight
    });
  };

  const trackSectionView = (sectionId: string, sectionName: string) => {
    trackJourneyStep('section_click', { 
      section_id: sectionId,
      section_name: sectionName
    });
  };

  const trackTimeSpent = (seconds: number) => {
    trackJourneyStep('time_spent', { 
      duration_seconds: seconds,
      engagement_level: seconds > 30 ? 'high' : seconds > 10 ? 'medium' : 'low'
    });
  };

  return {
    trackJourneyStep,
    trackScrollDepth,
    trackSectionView,
    trackTimeSpent
  };
};