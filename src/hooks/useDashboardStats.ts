import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { debugLog } from '@/utils/debugLogger';
import { queryBatcher } from '@/utils/queryBatcher';
import { timeAsync } from '@/utils/performanceMonitor';

export interface DashboardStats {
  totalIdeas: number;
  activeIdeas: number;
  evaluatedIdeas: number;
  activeChallenges: number;
  totalPoints: number;
  innovationScore: number;
  challengesParticipated: number;
  eventsAttended: number;
  totalAchievements: number;
  collaborations: number;
}

export interface UseDashboardStatsReturn {
  stats: DashboardStats;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalIdeas: 0,
    activeIdeas: 0,
    evaluatedIdeas: 0,
    activeChallenges: 0,
    totalPoints: 0,
    innovationScore: 0,
    challengesParticipated: 0,
    eventsAttended: 0,
    totalAchievements: 0,
    collaborations: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userProfile?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Get user's innovator profile - de-duped and timed
      const { data: innovatorData } = await queryBatcher.batch(
        `innovator:${userProfile.id}`,
        async () =>
          supabase
            .from('innovators')
            .select('id')
            .eq('user_id', userProfile.id)
            .limit(1)
            .maybeSingle()
      );

      let userStats: DashboardStats = {
        totalIdeas: 0,
        activeIdeas: 0,
        evaluatedIdeas: 0,
        activeChallenges: 0,
        totalPoints: 0,
        innovationScore: 0,
        challengesParticipated: 0,
        eventsAttended: 0,
        totalAchievements: 0,
        collaborations: 0
      };

      // Fetch all dependent datasets in parallel to avoid waterfalls
      const result = await timeAsync(async () => {
        if (!innovatorData) return { ideas: [], challengeParticipations: [], eventParticipations: [], userAchievements: [], activeChallengesCount: 0 };

        const [ideasRes, challengeRes, eventRes, achievementsRes, activeHead] = await Promise.all([
          queryBatcher.batch(`ideas:${innovatorData.id}`, async () =>
            supabase.from('ideas').select('id, status, challenge_id').eq('innovator_id', innovatorData.id)
          ),
          queryBatcher.batch(`challenge_participants:${userProfile.id}`, async () =>
            supabase.from('challenge_participants').select('challenge_id').eq('user_id', userProfile.id)
          ),
          queryBatcher.batch(`event_participants:${userProfile.id}`, async () =>
            supabase.from('event_participants').select('event_id').eq('user_id', userProfile.id)
          ),
          queryBatcher.batch(`user_achievements:${userProfile.id}`, async () =>
            supabase.from('user_achievements').select('points_earned').eq('user_id', userProfile.id)
          ),
          queryBatcher.batch('active_challenges_count', async () =>
            supabase.from('challenges').select('*', { count: 'exact', head: true }).eq('status', 'active')
          )
        ]);

        return {
          ideas: ideasRes.data || [],
          challengeParticipations: challengeRes.data || [],
          eventParticipations: eventRes.data || [],
          userAchievements: achievementsRes.data || [],
          activeChallengesCount: activeHead.count || 0
        };
      }, 'dashboard-stats-fetch', { userId: userProfile.id });

      const totalIdeas = (result.ideas as any[]).length || 0;
      const activeIdeas = (result.ideas as any[]).filter((idea: any) => ['pending', 'under_review'].includes(idea.status))?.length || 0;
      const evaluatedIdeas = (result.ideas as any[]).filter((idea: any) => ['approved', 'rejected'].includes(idea.status))?.length || 0;
      const totalPoints = (result.userAchievements as any[]).reduce((sum: number, ach: any) => sum + ach.points_earned, 0) || 0;

      const innovationScore = Math.min(
        Math.round(
          totalIdeas * 10 +
            (result.challengeParticipations as any[]).length * 15 +
            (result.eventParticipations as any[]).length * 5 +
            totalPoints / 10
        ),
        100
      );

      userStats = {
        totalIdeas,
        activeIdeas,
        evaluatedIdeas,
        activeChallenges: result.activeChallengesCount || 0,
        totalPoints,
        innovationScore,
        challengesParticipated: (result.challengeParticipations as any[]).length || 0,
        eventsAttended: (result.eventParticipations as any[]).length || 0,
        totalAchievements: (result.userAchievements as any[]).length || 0,
        collaborations: Math.floor(totalIdeas * 0.3)
      };

      setStats(userStats);
      setLastUpdated(new Date());

      debugLog.log('Dashboard stats fetched successfully', { userStats });

    } catch (err) {
      debugLog.error('Error fetching dashboard stats', { error: err });
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.id]);

  const refresh = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    isError,
    error,
    lastUpdated,
    refresh
  };
};