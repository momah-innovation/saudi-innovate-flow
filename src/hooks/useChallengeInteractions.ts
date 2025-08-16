/**
 * Challenge Interactions Hook
 * Handles challenge likes, participation, and user interactions
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debugLog } from '@/utils/debugLogger';

export const useChallengeInteractions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Join challenge as participant
  const joinChallenge = useCallback(async (challengeId: string, userId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('challenge_participants').insert({
        challenge_id: challengeId,
        user_id: userId,
        participation_type: 'individual'
      });

      if (error) throw error;

      debugLog.debug('User joined challenge', { challengeId, userId });
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join challenge';
      debugLog.error('Failed to join challenge', { challengeId, userId, error: err });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle challenge like
  const toggleChallengeLike = useCallback(async (challengeId: string, userId: string, isCurrentlyLiked: boolean) => {
    setLoading(true);
    try {
      if (isCurrentlyLiked) {
        const { error } = await supabase
          .from('challenge_likes')
          .delete()
          .eq('challenge_id', challengeId)
          .eq('user_id', userId);
        
        if (error) throw error;
        debugLog.debug('Challenge unliked', { challengeId, userId });
        return { isLiked: false };
      } else {
        const { error } = await supabase.from('challenge_likes').insert({
          challenge_id: challengeId,
          user_id: userId
        });
        
        if (error) throw error;
        debugLog.debug('Challenge liked', { challengeId, userId });
        return { isLiked: true };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update like';
      debugLog.error('Failed to toggle challenge like', { challengeId, userId, error: err });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    joinChallenge,
    toggleChallengeLike
  };
};