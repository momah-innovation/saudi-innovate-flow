import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryBatcher } from '@/utils/queryBatcher';

interface OpportunityStats {
  view_count: number;
  like_count: number;
  application_count: number;
  shares_count: number;
  bookmarks_count: number;
  comments_count: number;
}

export const useOpportunityStats = (opportunityId: string | undefined) => {
  return useQuery<OpportunityStats>({
    queryKey: ['opportunity-stats', opportunityId],
    queryFn: async () => {
      if (!opportunityId) throw new Error('Opportunity ID required');

      const [analyticsRes, likesRes, applicationsRes, sharesRes, bookmarksRes, commentsRes] = await Promise.all([
        queryBatcher.batch(`opportunity-analytics-${opportunityId}`, async () =>
          supabase.from('opportunity_analytics').select('view_count, like_count, application_count').eq('opportunity_id', opportunityId).maybeSingle()
        ),
        queryBatcher.batch(`opportunity-likes-${opportunityId}`, async () =>
          supabase.from('opportunity_likes').select('*', { count: 'exact', head: true }).eq('opportunity_id', opportunityId)
        ),
        queryBatcher.batch(`opportunity-applications-${opportunityId}`, async () =>
          supabase.from('opportunity_applications').select('*', { count: 'exact', head: true }).eq('opportunity_id', opportunityId)
        ),
        queryBatcher.batch(`opportunity-shares-${opportunityId}`, async () =>
          supabase.from('opportunity_shares').select('*', { count: 'exact', head: true }).eq('opportunity_id', opportunityId)
        ),
        queryBatcher.batch(`opportunity-bookmarks-${opportunityId}`, async () =>
          supabase.from('opportunity_bookmarks').select('*', { count: 'exact', head: true }).eq('opportunity_id', opportunityId)
        ),
        queryBatcher.batch(`opportunity-comments-${opportunityId}`, async () =>
          supabase.from('opportunity_comments').select('*', { count: 'exact', head: true }).eq('opportunity_id', opportunityId).eq('is_public', true)
        )
      ]);

      const analytics = (analyticsRes as any)?.data;
      
      return {
        view_count: analytics?.view_count || 0,
        like_count: (likesRes as any)?.count || analytics?.like_count || 0,
        application_count: (applicationsRes as any)?.count || analytics?.application_count || 0,
        shares_count: (sharesRes as any)?.count || 0,
        bookmarks_count: (bookmarksRes as any)?.count || 0,
        comments_count: (commentsRes as any)?.count || 0
      };
    },
    enabled: !!opportunityId,
    staleTime: 30 * 1000, // 30 seconds for real-time feel
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};