import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface PartnerItem {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  partner_type?: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  capabilities?: string[];
  funding_capacity?: number;
  collaboration_history?: string;
  status: string;
  created_at: string;
}

export const usePartnerManagement = () => {
  const {
    data: partners = [],
    isLoading: loading,
    error,
    refetch: loadPartners,
    isError
  } = useQuery<PartnerItem[]>({
    queryKey: ['partners-list'],
    queryFn: async () => {
      logger.info('Fetching partners list', { component: 'usePartnerManagement' });
      
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch partners', { component: 'usePartnerManagement' }, error);
        throw error;
      }
      
      logger.info('Partners fetched successfully', { 
        component: 'usePartnerManagement',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createPartner = useCallback(async (partnerData: any): Promise<any> => {
    logger.info('Creating partner', { component: 'usePartnerManagement' });
    
    const { data, error } = await supabase
      .from('partners')
      .insert([partnerData])
      .select()
      .maybeSingle();
    
    if (error) {
      logger.error('Failed to create partner', { component: 'usePartnerManagement' }, error);
      throw error;
    }
    
    logger.info('Partner created successfully', { component: 'usePartnerManagement' });
    
    // Refetch the list after creation
    await loadPartners();
    return data;
  }, [loadPartners]);

  const updatePartner = useCallback(async (partnerId: string, partnerData: any): Promise<any> => {
    logger.info('Updating partner', { component: 'usePartnerManagement' });
    
    const { data, error } = await supabase
      .from('partners')
      .update(partnerData)
      .eq('id', partnerId)
      .select()
      .maybeSingle();
    
    if (error) {
      logger.error('Failed to update partner', { component: 'usePartnerManagement' }, error);
      throw error;
    }
    
    logger.info('Partner updated successfully', { component: 'usePartnerManagement' });
    
    // Refetch the list after update
    await loadPartners();
    return data;
  }, [loadPartners]);

  const deletePartner = useCallback(async (partnerId: string): Promise<void> => {
    logger.info('Deleting partner', { component: 'usePartnerManagement' });
    
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', partnerId);
    
    if (error) {
      logger.error('Failed to delete partner', { component: 'usePartnerManagement' }, error);
      throw error;
    }
    
    logger.info('Partner deleted successfully', { component: 'usePartnerManagement' });
    
    // Refetch the list after deletion
    await loadPartners();
  }, [loadPartners]);

  return {
    partners,
    loading,
    error: isError ? error : null,
    loadPartners,
    createPartner,
    updatePartner,
    deletePartner
  };
};