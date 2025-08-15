/**
 * Optimized User Achievements Hook - Prevents duplicate requests
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryBatcher } from '@/utils/queryBatcher';
import { timeAsync } from '@/utils/performanceMonitor';

export const useOptimizedUserAchievements = (userId?: string) => {
  return useQuery({
    queryKey: ['user-achievements', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      return await timeAsync(async () => {
        const key = `user-achievements:${userId}`;
        return await queryBatcher.batch(key, async () => {
          const { data, error } = await supabase
            .from('user_achievements')
            .select('points_earned')
            .eq('user_id', userId);
          
          if (error) throw error;
          return data || [];
        });
      }, 'user-achievements-fetch', { userId });
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  });
};