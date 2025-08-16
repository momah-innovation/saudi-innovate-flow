import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { timeAsync } from '@/utils/performanceMonitor';
import { queryBatcher } from '@/utils/queryBatcher';
import { logger } from '@/utils/logger';

interface ChallengeDetailsData {
  challenge: any;
  focusQuestions: any[];
  assignedExperts: any[];
  orgHierarchy: any;
  loading: boolean;
  error: string | null;
}

export const useChallengeDetails = (challengeId: string | undefined) => {
  const [data, setData] = useState<ChallengeDetailsData>({
    challenge: null,
    focusQuestions: [],
    assignedExperts: [],
    orgHierarchy: {},
    loading: true,
    error: null
  });

  // Prevent duplicate fetches (e.g., StrictMode double-invoke) for the same challengeId
  const hasFetchedRef = useRef<string | null>(null);

  const fetchOrganizationalHierarchy = async (challenge: any) => {
    // Batch organizational queries in parallel with de-duplication
    const queries: Array<Promise<any>> = [];

    if (challenge.sector_id) {
      queries.push(
        queryBatcher.batch(`sector:${challenge.sector_id}`, async () => {
          return await supabase
            .from('sectors')
            .select('id, name, name_ar')
            .eq('id', challenge.sector_id)
            .maybeSingle();
        })
      );
    }

    if (challenge.deputy_id) {
      queries.push(
        queryBatcher.batch(`deputy:${challenge.deputy_id}`, async () => {
          return await supabase
            .from('deputies')
            .select('id, name, name_ar')
            .eq('id', challenge.deputy_id)
            .maybeSingle();
        })
      );
    }

    if (challenge.department_id) {
      queries.push(
        queryBatcher.batch(`department:${challenge.department_id}`, async () => {
          return await supabase
            .from('departments')
            .select('id, name, name_ar')
            .eq('id', challenge.department_id)
            .maybeSingle();
        })
      );
    }

    if (queries.length === 0) return {};

    try {
      const results = await Promise.all(queries);
      const hierarchy: any = {};
      const keys = ['sector', 'deputy', 'department'];

      results.forEach((result, index) => {
        if (result.data) {
          const key = keys[index];
          if (key) hierarchy[key] = result.data;
        }
      });

      return hierarchy;
    } catch (error) {
      logger.error('Failed to fetch organizational hierarchy', { challengeId }, error as Error);
      return {};
    }
  };

  const fetchAllData = useCallback(
    async (force = false) => {
      if (!challengeId) return;

      // Skip duplicate fetch for same id unless forced (prevents StrictMode double calls)
      if (!force && hasFetchedRef.current === challengeId) {
        logger.debug('useChallengeDetails: skipping duplicate fetch', { challengeId });
        return;
      }
      hasFetchedRef.current = challengeId;

      try {
        const result = await timeAsync(async () => {
          // Execute queries in parallel and de-dup through QueryBatcher
          const [challengeResult, questionsResult, expertsResult] = await Promise.all([
            queryBatcher.batch(`challenge:${challengeId}`, async () => {
              return await supabase
                .from('challenges')
                .select(
                  [
                    'id',
                    'title_ar',
                    'title_en',
                    'description_ar',
                    'description_en',
                    'status',
                    'challenge_type',
                    'start_date',
                    'end_date',
                    'sensitivity_level',
                    'image_url',
                    'sector_id',
                    'deputy_id',
                    'department_id',
                    'domain_id',
                    'sub_domain_id',
                    'service_id',
                    'created_at',
                    'updated_at'
                  ].join(',')
                )
                .eq('id', challengeId)
                .maybeSingle();
            }),
            queryBatcher.batch(`focus_questions:${challengeId}`, async () => {
              return await supabase
                .from('focus_questions')
                .select('*')
                .eq('challenge_id', challengeId)
                .order('order_sequence');
            }),
            queryBatcher.batch(`challenge_experts:${challengeId}`, async () => {
              return await supabase
                .from('challenge_experts')
                .select(
                  `*,
                   expert:experts(
                     user_id,
                     expertise_areas,
                     expert_level,
                     availability_status
                   )`
                )
                .eq('challenge_id', challengeId)
                .eq('status', 'active');
            })
          ]);

          return { challengeResult, questionsResult, expertsResult };
        }, 'challenge-detail-fetch', { challengeId });

        const { challengeResult, questionsResult, expertsResult } = result;

        if (challengeResult.error) {
          throw challengeResult.error;
        }

        const challenge: any = (challengeResult as any).data;
        if (!challenge) {
          throw new Error('Challenge not found');
        }

        // Fetch organizational hierarchy only if needed
        let orgHierarchy: any = {};
        if (challenge?.sector_id || challenge?.deputy_id || challenge?.department_id) {
          orgHierarchy = await fetchOrganizationalHierarchy(challenge);
        }

        setData({
          challenge,
          focusQuestions: questionsResult.data || [],
          assignedExperts:
            expertsResult.data?.map((item: any) => ({
              ...item,
              expert: item.expert
                ? {
                    ...item.expert,
                    profiles: { name: 'Expert Name', email: 'expert@example.com' }
                  }
                : undefined
            })) || [],
          orgHierarchy,
          loading: false,
          error: null
        });
      } catch (error) {
        logger.error('Failed to fetch challenge details', { challengeId }, error as Error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load challenge details'
        }));
      }
    },
    [challengeId]
  );

  useEffect(() => {
    setData(prev => ({ ...prev, loading: true, error: null }));
    fetchAllData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAllData]);

  return {
    ...data,
    refetch: () => fetchAllData(true)
  };
};
