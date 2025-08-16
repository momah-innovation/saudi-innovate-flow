import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface ChallengeListItem {
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
  actual_budget?: number;
  created_at: string;
  updated_at: string;
  sector_id?: string;
  deputy_id?: string;
  department_id?: string;
  domain_id?: string;
  service_id?: string;
  vision_2030_goal?: string;
  kpi_alignment?: string;
  sensitivity_level: string;
  collaboration_details?: string;
  internal_team_notes?: string;
  challenge_owner_id?: string;
  assigned_expert_id?: string;
  partner_organization_id?: string;
  sub_domain_id?: string;
}

export const useChallengeList = () => {
  const {
    data: challenges = [],
    isLoading: loading,
    error,
    refetch: loadChallenges,
    isError
  } = useQuery<ChallengeListItem[]>({
    queryKey: ['challenges-list'],
    queryFn: async () => {
      logger.info('Fetching challenges list', { component: 'useChallengeList' });
      
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch challenges', { component: 'useChallengeList' }, error);
        throw error;
      }
      
      logger.info('Challenges fetched successfully', { 
        component: 'useChallengeList',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const deleteChallenge = useCallback(async (challengeId: string): Promise<void> => {
    logger.info('Deleting challenge', { component: 'useChallengeList', challengeId });
    
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', challengeId);
    
    if (error) {
      logger.error('Failed to delete challenge', { component: 'useChallengeList', challengeId }, error);
      throw error;
    }
    
    logger.info('Challenge deleted successfully', { component: 'useChallengeList', challengeId });
    
    // Refetch the list after deletion
    await loadChallenges();
  }, [loadChallenges]);

  return {
    challenges,
    loading,
    error: isError ? error : null,
    loadChallenges,
    deleteChallenge
  };
};