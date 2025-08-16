import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface StakeholderItem {
  id: string;
  name: string;
  organization: string;
  position: string;
  email: string;
  phone: string;
  stakeholder_type: string;
  influence_level: string;
  interest_level: string;
  engagement_status: string;
  notes: string;
  projects_count: number;
  last_interaction: string;
  created_at: string;
  updated_at: string;
}

export const useStakeholderManagement = () => {
  const {
    data: stakeholders = [],
    isLoading: loading,
    error,
    refetch: loadStakeholders,
    isError
  } = useQuery<StakeholderItem[]>({
    queryKey: ['stakeholders-list'],
    queryFn: async () => {
      logger.info('Fetching stakeholders list', { component: 'useStakeholderManagement' });
      
      const { data, error } = await supabase
        .from('stakeholders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch stakeholders', { component: 'useStakeholderManagement' }, error);
        throw error;
      }
      
      logger.info('Stakeholders fetched successfully', { 
        component: 'useStakeholderManagement',
        count: data?.length || 0
      });
      
      // Transform data to match interface
      const transformedStakeholders = (data || []).map(item => ({
        id: item.id,
        name: item.name || 'غير محدد',
        organization: item.organization || 'غير محدد',
        position: item.position || 'غير محدد',
        email: item.email || '',
        phone: item.phone || '',
        stakeholder_type: item.stakeholder_type || 'غير محدد',
        influence_level: item.influence_level || 'متوسط',
        interest_level: item.interest_level || 'متوسط',
        engagement_status: item.engagement_status || 'pending',
        notes: item.notes || '',
        projects_count: 0,
        last_interaction: item.updated_at || item.created_at,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      return transformedStakeholders;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createStakeholder = useCallback(async (stakeholderData: any): Promise<any> => {
    logger.info('Creating stakeholder', { component: 'useStakeholderManagement' });
    
    const { data, error } = await supabase
      .from('stakeholders')
      .insert([stakeholderData])
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to create stakeholder', { component: 'useStakeholderManagement' }, error);
      throw error;
    }
    
    logger.info('Stakeholder created successfully', { component: 'useStakeholderManagement' });
    
    // Refetch the list after creation
    await loadStakeholders();
    return data;
  }, [loadStakeholders]);

  const updateStakeholder = useCallback(async (stakeholderId: string, stakeholderData: any): Promise<any> => {
    logger.info('Updating stakeholder', { component: 'useStakeholderManagement' });
    
    const { data, error } = await supabase
      .from('stakeholders')
      .update(stakeholderData)
      .eq('id', stakeholderId)
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to update stakeholder', { component: 'useStakeholderManagement' }, error);
      throw error;
    }
    
    logger.info('Stakeholder updated successfully', { component: 'useStakeholderManagement' });
    
    // Refetch the list after update
    await loadStakeholders();
    return data;
  }, [loadStakeholders]);

  const deleteStakeholder = useCallback(async (stakeholderId: string): Promise<void> => {
    logger.info('Deleting stakeholder', { component: 'useStakeholderManagement' });
    
    const { error } = await supabase
      .from('stakeholders')
      .delete()
      .eq('id', stakeholderId);
    
    if (error) {
      logger.error('Failed to delete stakeholder', { component: 'useStakeholderManagement' }, error);
      throw error;
    }
    
    logger.info('Stakeholder deleted successfully', { component: 'useStakeholderManagement' });
    
    // Refetch the list after deletion
    await loadStakeholders();
  }, [loadStakeholders]);

  return {
    stakeholders,
    loading,
    error: isError ? error : null,
    loadStakeholders,
    createStakeholder,
    updateStakeholder,
    deleteStakeholder
  };
};