import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface EvaluationItem {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  type: 'challenge' | 'idea' | 'event' | 'opportunity';
  entity_id: string;
  criteria: any[];
  scoring_method: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  deadline?: string;
  evaluator_id?: string;
  score?: number;
  feedback?: string;
}

export const useEvaluationManagement = () => {
  const {
    data: evaluations = [],
    isLoading: loading,
    error,
    refetch: loadEvaluations,
    isError
  } = useQuery({
    queryKey: ['evaluations-list'],
    queryFn: async () => {
      logger.info('Fetching evaluations list', { component: 'useEvaluationManagement' });
      
      const { data, error } = await supabase
        .from('challenge_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch evaluations', { component: 'useEvaluationManagement' }, error);
        throw error;
      }
      
      logger.info('Evaluations fetched successfully', { 
        component: 'useEvaluationManagement',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createEvaluation = useCallback(async (evaluationData: any): Promise<any> => {
    logger.info('Creating evaluation', { component: 'useEvaluationManagement' });
    
    const { data, error } = await supabase
      .from('evaluations')
      .insert([evaluationData])
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to create evaluation', { component: 'useEvaluationManagement' }, error);
      throw error;
    }
    
    logger.info('Evaluation created successfully', { component: 'useEvaluationManagement' });
    
    // Refetch the list after creation
    await loadEvaluations();
    return data;
  }, [loadEvaluations]);

  const updateEvaluation = useCallback(async (evaluationId: string, evaluationData: any): Promise<any> => {
    logger.info('Updating evaluation', { component: 'useEvaluationManagement' });
    
    const { data, error } = await supabase
      .from('evaluations')
      .update(evaluationData)
      .eq('id', evaluationId)
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to update evaluation', { component: 'useEvaluationManagement' }, error);
      throw error;
    }
    
    logger.info('Evaluation updated successfully', { component: 'useEvaluationManagement' });
    
    // Refetch the list after update
    await loadEvaluations();
    return data;
  }, [loadEvaluations]);

  const deleteEvaluation = useCallback(async (evaluationId: string): Promise<void> => {
    logger.info('Deleting evaluation', { component: 'useEvaluationManagement' });
    
    const { error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', evaluationId);
    
    if (error) {
      logger.error('Failed to delete evaluation', { component: 'useEvaluationManagement' }, error);
      throw error;
    }
    
    logger.info('Evaluation deleted successfully', { component: 'useEvaluationManagement' });
    
    // Refetch the list after deletion
    await loadEvaluations();
  }, [loadEvaluations]);

  return {
    evaluations,
    loading,
    error: isError ? error : null,
    loadEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation
  };
};