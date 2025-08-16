/**
 * Challenge Page Data Hook
 * Handles all data operations for the challenges page
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

export const useChallengePageData = () => {
  const [loading, setLoading] = useState(false);

  // Handle challenge participation
  const joinChallenge = useCallback(async (challengeId: string, userId: string, participationType: string = 'individual') => {
    setLoading(true);
    try {
      const { error } = await supabase.from('challenge_participants').insert({
        challenge_id: challengeId,
        user_id: userId,
        participation_type: participationType
      });

      if (error) throw error;

      debugLog.debug('User joined challenge', { challengeId, userId });
      return { success: true };
    } catch (err) {
      debugLog.error('Failed to join challenge', { challengeId, userId, error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle challenge likes
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
      debugLog.error('Failed to toggle challenge like', { challengeId, userId, error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user's liked challenges
  const loadUserLikes = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('challenge_likes')
        .select('challenge_id')
        .eq('user_id', userId);

      if (error) throw error;

      const likedChallengeIds = data.map(like => like.challenge_id);
      debugLog.debug('User likes loaded', { userId, count: likedChallengeIds.length });
      
      return new Set(likedChallengeIds);
    } catch (err) {
      debugLog.error('Failed to load user likes', { userId, error: err });
      throw err;
    }
  }, []);

  return {
    loading,
    joinChallenge,
    toggleChallengeLike,
    loadUserLikes
  };
};