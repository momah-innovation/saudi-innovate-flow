import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface ExpertAssignmentItem {
  id: string;
  expert_id: string;
  challenge_id?: string;
  idea_id?: string;
  event_id?: string;
  assignment_type: 'evaluation' | 'review' | 'mentoring' | 'consultation';
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  assigned_at: string;
  completed_at?: string;
  notes?: string;
  created_by?: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
}

export const useExpertAssignment = () => {
  const {
    data: assignments = [],
    isLoading: loading,
    error,
    refetch: loadAssignments,
    isError
  } = useQuery({
    queryKey: ['expert-assignments'],
    queryFn: async () => {
      logger.info('Fetching expert assignments', { component: 'useExpertAssignment' });
      
      const { data, error } = await supabase
        .from('challenge_experts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch expert assignments', { component: 'useExpertAssignment' }, error);
        throw error;
      }
      
      logger.info('Expert assignments fetched successfully', { 
        component: 'useExpertAssignment',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createAssignment = useCallback(async (assignmentData: any): Promise<any> => {
    logger.info('Creating expert assignment', { component: 'useExpertAssignment' });
    
    const { data, error } = await supabase
      .from('challenge_experts')
      .insert([assignmentData])
      .select()
      .maybeSingle();
    
    if (error) {
      logger.error('Failed to create expert assignment', { component: 'useExpertAssignment' }, error);
      throw error;
    }
    
    logger.info('Expert assignment created successfully', { component: 'useExpertAssignment' });
    
    // Refetch the list after creation
    await loadAssignments();
    return data;
  }, [loadAssignments]);

  const updateAssignment = useCallback(async (assignmentId: string, assignmentData: any): Promise<any> => {
    logger.info('Updating expert assignment', { component: 'useExpertAssignment' });
    
    const { data, error } = await supabase
      .from('challenge_experts')
      .update(assignmentData)
      .eq('id', assignmentId)
      .select()
      .maybeSingle();
    
    if (error) {
      logger.error('Failed to update expert assignment', { component: 'useExpertAssignment' }, error);
      throw error;
    }
    
    logger.info('Expert assignment updated successfully', { component: 'useExpertAssignment' });
    
    // Refetch the list after update
    await loadAssignments();
    return data;
  }, [loadAssignments]);

  const deleteAssignment = useCallback(async (assignmentId: string): Promise<void> => {
    logger.info('Deleting expert assignment', { component: 'useExpertAssignment' });
    
    const { error } = await supabase
      .from('challenge_experts')
      .delete()
      .eq('id', assignmentId);
    
    if (error) {
      logger.error('Failed to delete expert assignment', { component: 'useExpertAssignment' }, error);
      throw error;
    }
    
    logger.info('Expert assignment deleted successfully', { component: 'useExpertAssignment' });
    
    // Refetch the list after deletion
    await loadAssignments();
  }, [loadAssignments]);

  return {
    assignments,
    loading,
    error: isError ? error : null,
    loadAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment
  };
};