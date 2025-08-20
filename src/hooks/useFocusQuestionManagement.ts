import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface FocusQuestionItem {
  id: string;
  question_ar: string;
  question_en?: string;
  category: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  tags?: string[];
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  challenge_id?: string;
  domain_id?: string;
  sub_domain_id?: string;
  service_id?: string;
}

export const useFocusQuestionManagement = () => {
  const {
    data: focusQuestions = [],
    isLoading: loading,
    error,
    refetch: loadFocusQuestions,
    isError
  } = useQuery({
    queryKey: ['focus-questions-list'],
    queryFn: async () => {
      logger.info('Fetching focus questions list', { component: 'useFocusQuestionManagement' });
      
      const { data, error } = await supabase
        .from('focus_questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch focus questions', { component: 'useFocusQuestionManagement' }, error);
        throw error;
      }
      
      logger.info('Focus questions fetched successfully', { 
        component: 'useFocusQuestionManagement',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createFocusQuestion = useCallback(async (questionData: any): Promise<any> => {
    logger.info('Creating focus question', { component: 'useFocusQuestionManagement' });
    
    const { data, error } = await supabase
      .from('focus_questions')
      .insert([questionData])
      .select()
      .maybeSingle();
    
    if (error) {
      logger.error('Failed to create focus question', { component: 'useFocusQuestionManagement' }, error);
      throw error;
    }
    
    logger.info('Focus question created successfully', { component: 'useFocusQuestionManagement' });
    
    // Refetch the list after creation
    await loadFocusQuestions();
    return data;
  }, [loadFocusQuestions]);

  const updateFocusQuestion = useCallback(async (questionId: string, questionData: any): Promise<any> => {
    logger.info('Updating focus question', { component: 'useFocusQuestionManagement' });
    
    const { data, error } = await supabase
      .from('focus_questions')
      .update(questionData)
      .eq('id', questionId)
      .select()
      .maybeSingle();
    
    if (error) {
      logger.error('Failed to update focus question', { component: 'useFocusQuestionManagement' }, error);
      throw error;
    }
    
    logger.info('Focus question updated successfully', { component: 'useFocusQuestionManagement' });
    
    // Refetch the list after update
    await loadFocusQuestions();
    return data;
  }, [loadFocusQuestions]);

  const deleteFocusQuestion = useCallback(async (questionId: string): Promise<void> => {
    logger.info('Deleting focus question', { component: 'useFocusQuestionManagement' });
    
    const { error } = await supabase
      .from('focus_questions')
      .delete()
      .eq('id', questionId);
    
    if (error) {
      logger.error('Failed to delete focus question', { component: 'useFocusQuestionManagement' }, error);
      throw error;
    }
    
    logger.info('Focus question deleted successfully', { component: 'useFocusQuestionManagement' });
    
    // Refetch the list after deletion
    await loadFocusQuestions();
  }, [loadFocusQuestions]);

  return {
    focusQuestions,
    loading,
    error: isError ? error : null,
    loadFocusQuestions,
    createFocusQuestion,
    updateFocusQuestion,
    deleteFocusQuestion
  };
};