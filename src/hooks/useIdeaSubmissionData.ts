/**
 * Idea Submission Data Hook
 * Handles loading challenges and focus questions for idea submission
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  sector_id?: string;
  priority_level: string;
}

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  challenge_id: string;
}

export const useIdeaSubmissionData = () => {
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);

  // Load challenges and focus questions
  const loadChallengesAndQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const [challengesResponse, questionsResponse] = await Promise.all([
        supabase
          .from('challenges')
          .select('id, title_ar, description_ar, sector_id, priority_level')
          .eq('status', 'active'),
        supabase
          .from('focus_questions')
          .select('id, question_text_ar, challenge_id')
      ]);

      if (challengesResponse.error) throw challengesResponse.error;
      if (questionsResponse.error) throw questionsResponse.error;

      setChallenges(challengesResponse.data || []);
      setFocusQuestions(questionsResponse.data || []);

      debugLog.debug('Loaded challenges and questions', {
        challengesCount: challengesResponse.data?.length || 0,
        questionsCount: questionsResponse.data?.length || 0
      });

      return {
        challenges: challengesResponse.data || [],
        focusQuestions: questionsResponse.data || []
      };
    } catch (err) {
      debugLog.error('Failed to load challenges and questions', { error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get focus questions for specific challenge
  const getFocusQuestionsForChallenge = useCallback((challengeId: string) => {
    return focusQuestions.filter(q => q.challenge_id === challengeId);
  }, [focusQuestions]);

  return {
    loading,
    challenges,
    focusQuestions,
    loadChallengesAndQuestions,
    getFocusQuestionsForChallenge
  };
};