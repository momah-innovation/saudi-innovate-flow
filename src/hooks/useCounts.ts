import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryBatcher } from '@/utils/queryBatcher';

interface CountQuery {
  table: string;
  filters?: Record<string, any>;
  key: string;
}

interface UseCountsOptions {
  queries: CountQuery[];
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export const useCounts = (options: UseCountsOptions) => {
  const { queries, enabled = true, staleTime = 2 * 60 * 1000, gcTime = 5 * 60 * 1000 } = options;
  
  const queryKey = ['counts', ...queries.map(q => q.key)];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const results = await Promise.all(
        queries.map(async ({ table, filters, key }) => {
          const result = await queryBatcher.batch(`${table}-count-${key}`, async () => {
            let query = supabase.from(table as any).select('*', { count: 'exact', head: true });
            
            // Apply filters if provided
            if (filters) {
              Object.entries(filters).forEach(([column, value]) => {
                query = query.eq(column, value);
              });
            }
            
            return query;
          });
          return { key, count: (result as any)?.count || 0 };
        })
      );
      
      // Convert array to object for easier access
      return results.reduce((acc, { key, count }) => {
        acc[key] = count;
        return acc;
      }, {} as Record<string, number>);
    },
    enabled,
    staleTime,
    gcTime,
  });
};

// Predefined common count queries
export const useCommonCounts = () => {
  return useCounts({
    queries: [
      { table: 'profiles', key: 'totalUsers' },
      { table: 'challenges', key: 'totalChallenges' },
      { table: 'challenges', filters: { status: 'status.active' }, key: 'activeChallenges' },
      { table: 'challenge_participants', key: 'totalParticipants' },
      { table: 'challenge_submissions', key: 'totalSubmissions' },
      { table: 'events', key: 'totalEvents' },
      { table: 'event_participants', key: 'totalEventParticipants' },
    ],
  });
};