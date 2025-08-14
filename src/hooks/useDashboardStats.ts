import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { debugLog } from '@/utils/debugLogger';

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

      // Get user's innovator profile
      const { data: innovatorData } = await supabase
        .from('innovators')
        .select('id')
        .eq('user_id', userProfile.id)
        .single();

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

      if (innovatorData) {
        // Load user ideas
        const { data: ideas } = await supabase
          .from('ideas')
          .select('id, status, challenge_id')
          .eq('innovator_id', innovatorData.id);

        // Load user challenge participations
        const { data: challengeParticipations } = await supabase
          .from('challenge_participants')
          .select('challenge_id')
          .eq('user_id', userProfile.id);

        // Load user event participations
        const { data: eventParticipations } = await supabase
          .from('event_participants')
          .select('event_id')
          .eq('user_id', userProfile.id);

        // Load user achievements
        const { data: userAchievements } = await supabase
          .from('user_achievements')
          .select('points_earned')
          .eq('user_id', userProfile.id);

        // Calculate stats
        const totalIdeas = ideas?.length || 0;
        const activeIdeas = ideas?.filter(idea => ['pending', 'under_review'].includes(idea.status))?.length || 0;
        const evaluatedIdeas = ideas?.filter(idea => ['approved', 'rejected'].includes(idea.status))?.length || 0;
        const totalPoints = userAchievements?.reduce((sum, ach) => sum + ach.points_earned, 0) || 0;
        
        // Calculate innovation score based on various factors
        const innovationScore = Math.min(
          Math.round(
            totalIdeas * 10 + 
            challengeParticipations?.length * 15 + 
            eventParticipations?.length * 5 + 
            (totalPoints / 10)
          ), 
          100
        );

        userStats = {
          totalIdeas,
          activeIdeas,
          evaluatedIdeas,
          activeChallenges: challengeParticipations?.length || 0,
          totalPoints,
          innovationScore,
          challengesParticipated: challengeParticipations?.length || 0,
          eventsAttended: eventParticipations?.length || 0,
          totalAchievements: userAchievements?.length || 0,
          collaborations: Math.floor(totalIdeas * 0.3) // Estimate based on ideas
        };
      }

      // Get global active challenges count
      const { count: activeChallengesCount } = await supabase
        .from('challenges')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      userStats.activeChallenges = activeChallengesCount || 0;

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