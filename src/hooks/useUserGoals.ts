import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from './useCurrentUser';

interface Goal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  goal_type: 'ideas' | 'challenges' | 'events' | 'custom';
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export const useUserGoals = () => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user-goals', user?.id],
    queryFn: async (): Promise<Goal[]> => {
      if (!user?.id) return [];

      try {
        // Return empty array since user_goals table doesn't exist yet
        return [];
      } catch (error) {
        console.warn('Failed to fetch goals:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ goalId, updates }: { goalId: string; updates: Partial<Goal> }) => {
      // Mock implementation since table doesn't exist
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals', user?.id] });
    }
  });

  return {
    ...query,
    updateGoal: updateGoalMutation.mutate,
    isUpdatingGoal: updateGoalMutation.isPending
  };
};