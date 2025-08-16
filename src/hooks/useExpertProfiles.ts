import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface ExpertProfileItem {
  id: string;
  user_id: string;
  expertise_areas: string[];
  experience_years: number;
  expert_level: 'junior' | 'senior' | 'principal' | 'distinguished';
  availability_status: 'available' | 'busy' | 'unavailable';
  hourly_rate?: number;
  bio?: string;
  certifications?: string[];
  languages?: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
    phone?: string;
    department?: string;
    position?: string;
  };
}

export const useExpertProfiles = () => {
  const {
    data: experts = [],
    isLoading: loading,
    error,
    refetch: loadExperts,
    isError
  } = useQuery({
    queryKey: ['expert-profiles'],
    queryFn: async () => {
      logger.info('Fetching expert profiles', { component: 'useExpertProfiles' });
      
      const { data, error } = await supabase
        .from('experts')
        .select(`
          *,
          profiles!inner(name, email, phone, department, position)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch expert profiles', { component: 'useExpertProfiles' }, error);
        throw error;
      }
      
      logger.info('Expert profiles fetched successfully', { 
        component: 'useExpertProfiles',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createExpert = useCallback(async (expertData: any): Promise<any> => {
    logger.info('Creating expert profile', { component: 'useExpertProfiles' });
    
    const { data, error } = await supabase
      .from('experts')
      .insert([expertData])
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to create expert profile', { component: 'useExpertProfiles' }, error);
      throw error;
    }
    
    logger.info('Expert profile created successfully', { component: 'useExpertProfiles' });
    
    // Refetch the list after creation
    await loadExperts();
    return data;
  }, [loadExperts]);

  const updateExpert = useCallback(async (expertId: string, expertData: any): Promise<any> => {
    logger.info('Updating expert profile', { component: 'useExpertProfiles' });
    
    const { data, error } = await supabase
      .from('experts')
      .update(expertData)
      .eq('id', expertId)
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to update expert profile', { component: 'useExpertProfiles' }, error);
      throw error;
    }
    
    logger.info('Expert profile updated successfully', { component: 'useExpertProfiles' });
    
    // Refetch the list after update
    await loadExperts();
    return data;
  }, [loadExperts]);

  const deleteExpert = useCallback(async (expertId: string): Promise<void> => {
    logger.info('Deleting expert profile', { component: 'useExpertProfiles' });
    
    const { error } = await supabase
      .from('experts')
      .delete()
      .eq('id', expertId);
    
    if (error) {
      logger.error('Failed to delete expert profile', { component: 'useExpertProfiles' }, error);
      throw error;
    }
    
    logger.info('Expert profile deleted successfully', { component: 'useExpertProfiles' });
    
    // Refetch the list after deletion
    await loadExperts();
  }, [loadExperts]);

  return {
    experts,
    loading,
    error: isError ? error : null,
    loadExperts,
    createExpert,
    updateExpert,
    deleteExpert
  };
};