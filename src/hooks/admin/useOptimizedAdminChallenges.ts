import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { timeAsync } from '@/utils/performanceMonitor';
import { queryBatcher } from '@/utils/queryBatcher';

export interface AdminChallengesFilters {
  status?: string; // 'all' | specific status
  priority?: string; // 'all' | specific
  sensitivity?: string; // 'all' | specific
  search?: string; // search term
}

export interface AdminChallengeListItem {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  priority_level: string;
  challenge_type: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  created_at: string;
  sensitivity_level: string;
}

export const useOptimizedAdminChallenges = (filters: AdminChallengesFilters) => {
  return useQuery<AdminChallengeListItem[], Error>({
    queryKey: ['admin-challenges', filters],
    queryFn: async () => {
      return await timeAsync(async () => {
        const key = `admin-challenges:${JSON.stringify(filters)}`;
        return await queryBatcher.batch(key, async () => {
          let q = supabase
            .from('challenges')
            .select(
              `id, title_ar, title_en, description_ar, description_en, status, priority_level, challenge_type, start_date, end_date, estimated_budget, created_at, sensitivity_level`
            )
            .order('created_at', { ascending: false });

          if (filters.status && filters.status !== 'all') {
            q = q.eq('status', filters.status);
          }
          if (filters.priority && filters.priority !== 'all') {
            q = q.eq('priority_level', filters.priority);
          }
          if (filters.sensitivity && filters.sensitivity !== 'all') {
            q = q.eq('sensitivity_level', filters.sensitivity);
          }
          if (filters.search && filters.search.trim().length > 0) {
            const term = `%${filters.search.trim()}%`;
            q = q.or(`title_ar.ilike.${term},description_ar.ilike.${term}`);
          }

          const { data, error } = await q;
          if (error) throw error;
          return (data || []) as AdminChallengeListItem[];
        });
      }, 'admin-challenges-fetch', filters);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};
