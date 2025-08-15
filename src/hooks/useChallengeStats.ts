import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryBatcher } from '@/utils/queryBatcher';

interface ChallengeStats {
  participants_count: number;
  submissions_count: number; 
  experts_count: number;
  discussions_count: number;
}

export const useChallengeStats = (challengeId: string | undefined) => {
  return useQuery<ChallengeStats>({
    queryKey: ['challenge-stats', challengeId],
    queryFn: async () => {
      if (!challengeId) throw new Error('Challenge ID required');

      const [participantsRes, submissionsRes, expertsRes, discussionsRes] = await Promise.all([
        queryBatcher.batch(`challenge-participants-${challengeId}`, async () =>
          supabase.from('challenge_participants').select('*', { count: 'exact', head: true }).eq('challenge_id', challengeId)
        ),
        queryBatcher.batch(`challenge-submissions-${challengeId}`, async () =>
          supabase.from('challenge_submissions').select('*', { count: 'exact', head: true }).eq('challenge_id', challengeId)
        ),
        queryBatcher.batch(`challenge-experts-${challengeId}`, async () =>
          supabase.from('challenge_experts').select('*', { count: 'exact', head: true }).eq('challenge_id', challengeId)
        ),
        queryBatcher.batch(`challenge-comments-${challengeId}`, async () =>
          supabase.from('challenge_comments').select('*', { count: 'exact', head: true }).eq('challenge_id', challengeId)
        )
      ]);

      return {
        participants_count: (participantsRes as any)?.count || 0,
        submissions_count: (submissionsRes as any)?.count || 0,
        experts_count: (expertsRes as any)?.count || 0,
        discussions_count: (discussionsRes as any)?.count || 0
      };
    },
    enabled: !!challengeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};