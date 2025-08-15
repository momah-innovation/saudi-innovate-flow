import { useState, useEffect, useCallback } from 'react';
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

  const fetchAllData = useCallback(async () => {
    if (!challengeId) return;

    try {
      const result = await timeAsync(async () => {
        // Execute queries in parallel
        const [challengeResult, questionsResult, expertsResult] = await Promise.all([
          supabase
            .from('challenges')
            .select('*')
            .eq('id', challengeId)
            .maybeSingle(),
          supabase
            .from('focus_questions')
            .select('*')
            .eq('challenge_id', challengeId)
            .order('order_sequence'),
          supabase
            .from('challenge_experts')
            .select(`
              *,
              expert:experts(
                user_id,
                expertise_areas,
                expert_level,
                availability_status
              )
            `)
            .eq('challenge_id', challengeId)
            .eq('status', 'active')
        ]);

        return { challengeResult, questionsResult, expertsResult };
      }, 'challenge-detail-fetch', { challengeId });

      const { challengeResult, questionsResult, expertsResult } = result;

      if (challengeResult.error) {
        throw challengeResult.error;
      }

      const challenge = challengeResult.data;
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Fetch organizational hierarchy only if needed
      let orgHierarchy = {};
      if (challenge.sector_id || challenge.deputy_id || challenge.department_id) {
        orgHierarchy = await fetchOrganizationalHierarchy(challenge);
      }

      setData({
        challenge,
        focusQuestions: questionsResult.data || [],
        assignedExperts: expertsResult.data?.map((item: any) => ({
          ...item,
          expert: item.expert ? {
            ...item.expert,
            profiles: { name: 'Expert Name', email: 'expert@example.com' }
          } : undefined
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
  }, [challengeId]);

  const fetchOrganizationalHierarchy = async (challenge: any) => {
    // Batch organizational queries in parallel
    const queries = [];
    
    if (challenge.sector_id) {
      queries.push(supabase.from('sectors').select('id, name, name_ar').eq('id', challenge.sector_id).maybeSingle());
    }
    
    if (challenge.deputy_id) {
      queries.push(supabase.from('deputies').select('id, name, name_ar').eq('id', challenge.deputy_id).maybeSingle());
    }
    
    if (challenge.department_id) {
      queries.push(supabase.from('departments').select('id, name, name_ar').eq('id', challenge.department_id).maybeSingle());
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

  useEffect(() => {
    setData(prev => ({ ...prev, loading: true, error: null }));
    fetchAllData();
  }, [fetchAllData]);

  return {
    ...data,
    refetch: fetchAllData
  };
};