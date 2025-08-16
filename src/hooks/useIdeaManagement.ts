import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface IdeaItem {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  category: string;
  tags?: string[];
  submitter_id: string;
  challenge_id?: string;
  expected_impact: string;
  implementation_plan?: string;
  technical_details?: any;
  business_model?: string;
  attachment_urls?: string[];
  score?: number;
  review_notes?: string;
  created_at: string;
  updated_at: string;
  submission_date?: string;
  is_public: boolean;
}

export const useIdeaManagement = () => {
  const {
    data: ideas = [],
    isLoading: loading,
    error,
    refetch: loadIdeas,
    isError
  } = useQuery({
    queryKey: ['ideas-list'],
    queryFn: async () => {
      logger.info('Fetching ideas list', { component: 'useIdeaManagement' });
      
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch ideas', { component: 'useIdeaManagement' }, error);
        throw error;
      }
      
      logger.info('Ideas fetched successfully', { 
        component: 'useIdeaManagement',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createIdea = useCallback(async (ideaData: any): Promise<any> => {
    logger.info('Creating idea', { component: 'useIdeaManagement' });
    
    const { data, error } = await supabase
      .from('ideas')
      .insert([ideaData])
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to create idea', { component: 'useIdeaManagement' }, error);
      throw error;
    }
    
    logger.info('Idea created successfully', { component: 'useIdeaManagement' });
    
    // Refetch the list after creation
    await loadIdeas();
    return data;
  }, [loadIdeas]);

  const updateIdea = useCallback(async (ideaId: string, ideaData: any): Promise<any> => {
    logger.info('Updating idea', { component: 'useIdeaManagement' });
    
    const { data, error } = await supabase
      .from('ideas')
      .update(ideaData)
      .eq('id', ideaId)
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to update idea', { component: 'useIdeaManagement' }, error);
      throw error;
    }
    
    logger.info('Idea updated successfully', { component: 'useIdeaManagement' });
    
    // Refetch the list after update
    await loadIdeas();
    return data;
  }, [loadIdeas]);

  const deleteIdea = useCallback(async (ideaId: string): Promise<void> => {
    logger.info('Deleting idea', { component: 'useIdeaManagement' });
    
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', ideaId);
    
    if (error) {
      logger.error('Failed to delete idea', { component: 'useIdeaManagement' }, error);
      throw error;
    }
    
    logger.info('Idea deleted successfully', { component: 'useIdeaManagement' });
    
    // Refetch the list after deletion
    await loadIdeas();
  }, [loadIdeas]);

  return {
    ideas,
    loading,
    error: isError ? error : null,
    loadIdeas,
    createIdea,
    updateIdea,
    deleteIdea
  };
};