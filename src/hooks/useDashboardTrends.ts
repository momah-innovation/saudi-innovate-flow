import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Trend {
  id: string;
  trend_name_ar: string;
  trend_name_en: string;
  trend_category: string;
  growth_percentage: number;
  current_value: number;
  trend_direction: 'up' | 'down' | 'stable';
}

export const useDashboardTrends = () => {
  return useQuery({
    queryKey: ['dashboard-trends'],
    queryFn: async (): Promise<Trend[]> => {
      try {
        // Return mock trends since trend_analytics table doesn't exist yet
        return [
          {
            id: '1',
            trend_name_ar: 'التكنولوجيا',
            trend_name_en: 'Technology',
            trend_category: 'technology',
            growth_percentage: 35.2,
            current_value: 42,
            trend_direction: 'up' as const
          },
          {
            id: '2', 
            trend_name_ar: 'الابتكار',
            trend_name_en: 'Innovation',
            trend_category: 'innovation',
            growth_percentage: 28.8,
            current_value: 35,
            trend_direction: 'up' as const
          }
        ];
      } catch (error) {
        console.warn('Failed to fetch trends:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1
  });
};