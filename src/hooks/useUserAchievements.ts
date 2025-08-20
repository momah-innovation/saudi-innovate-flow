import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from './useCurrentUser';

interface Achievement {
  id: string;
  achievement_name_ar: string;
  achievement_name_en: string;
  description_ar: string;
  description_en: string;
  points_earned: number;
  badge_icon: string;
  badge_color: string;
  earned_at: string;
  achievement_type: string;
}

export const useUserAchievements = () => {
  const { user } = useCurrentUser();

  return useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async (): Promise<Achievement[]> => {
      if (!user?.id) return [];

      try {
        // Using existing user_achievements table
        const { data, error } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

        if (error) {
          console.warn('Could not load achievements:', error);
          return [];
        }

        return (data || []).map(ach => ({
          id: ach.id,
          achievement_name_ar: ach.title || 'إنجاز',
          achievement_name_en: ach.title || 'Achievement', 
          description_ar: ach.description || '',
          description_en: ach.description || '',
          points_earned: ach.points_earned || 0,
          badge_icon: ach.icon_name || 'trophy',
          badge_color: '#FFD700',
          earned_at: ach.earned_at,
          achievement_type: ach.achievement_type || 'general'
        }));
      } catch (error) {
        console.warn('Failed to fetch achievements:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1
  });
};