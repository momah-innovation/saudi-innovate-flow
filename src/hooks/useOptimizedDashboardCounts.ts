/**
 * Optimized Dashboard Counts Hook - Prevents duplicate count queries
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryBatcher } from '@/utils/queryBatcher';
import { timeAsync } from '@/utils/performanceMonitor';

interface DashboardCounts {
  totalUsers: number;
  totalIdeas: number;
  totalChallenges: number;
  totalEvents: number;
  publishedChallenges: number;
  activeChallenges: number;
}

interface UserSpecificCounts {
  userIdeas: number;
  userChallenges: number;
  userEvents: number;
}

export const useOptimizedDashboardCounts = () => {
  return useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: async (): Promise<DashboardCounts> => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('dashboard-counts', async () => {
          const [usersRes, ideasRes, challengesRes, eventsRes, publishedRes, activeRes] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact' }),
            supabase.from('ideas').select('id', { count: 'exact' }),
            supabase.from('challenges').select('id', { count: 'exact' }),
            supabase.from('events').select('id', { count: 'exact' }),
            supabase.from('challenges').select('id', { count: 'exact' }).eq('status', 'published'),
            supabase.from('challenges').select('id', { count: 'exact' }).eq('status', 'active')
          ]);

          return {
            totalUsers: usersRes.count || 0,
            totalIdeas: ideasRes.count || 0,
            totalChallenges: challengesRes.count || 0,
            totalEvents: eventsRes.count || 0,
            publishedChallenges: publishedRes.count || 0,
            activeChallenges: activeRes.count || 0
          };
        });
      }, 'dashboard-counts-fetch');
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

export const useOptimizedUserSpecificCounts = (userId?: string) => {
  return useQuery({
    queryKey: ['user-specific-counts', userId],
    queryFn: async (): Promise<UserSpecificCounts> => {
      if (!userId) return { userIdeas: 0, userChallenges: 0, userEvents: 0 };
      
      return await timeAsync(async () => {
        const cacheKey = `user-specific-counts:${userId}`;
        return await queryBatcher.batch(cacheKey, async () => {
          const [userIdeasRes, userChallengesRes, userEventsRes] = await Promise.all([
            supabase.from('ideas').select('id', { count: 'exact' }).eq('innovator_id', userId),
            supabase.from('challenge_participants').select('id', { count: 'exact' }).eq('user_id', userId),
            supabase.from('event_participants').select('id', { count: 'exact' }).eq('user_id', userId)
          ]);

          return {
            userIdeas: userIdeasRes.count || 0,
            userChallenges: userChallengesRes.count || 0,
            userEvents: userEventsRes.count || 0
          };
        });
      }, 'user-specific-counts-fetch', { userId });
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

// Hook for innovation team member counts specifically
export const useOptimizedTeamCounts = () => {
  return useQuery({
    queryKey: ['team-counts'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('team-counts', async () => {
          const { count, error } = await supabase
            .from('innovation_team_members')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');
          
          if (error) throw error;
          return count || 0;
        });
      }, 'team-counts-fetch');
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};