import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface CampaignListItem {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  start_date: string;
  end_date: string;
  target_participants?: number;
  target_ideas?: number;
  budget?: number;
  registered_participants?: number;
  created_at: string;
  updated_at: string;
  theme?: string;
  campaign_manager_id?: string;
  sector_id?: string;
  deputy_id?: string;
  department_id?: string;
  challenge_id?: string;
  registration_deadline?: string;
  success_metrics?: string;
}

export const useCampaignList = () => {
  const {
    data: campaigns = [],
    isLoading: loading,
    error,
    refetch: loadCampaigns,
    isError
  } = useQuery({
    queryKey: ['campaigns-list'],
    queryFn: async () => {
      logger.info('Fetching campaigns list', { component: 'useCampaignList' });
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch campaigns', { component: 'useCampaignList' }, error);
        throw error;
      }
      
      logger.info('Campaigns fetched successfully', { 
        component: 'useCampaignList',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const deleteCampaign = async (campaignId: string): Promise<void> => {
    logger.info('Deleting campaign', { component: 'useCampaignList' });
    
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);
    
    if (error) {
      logger.error('Failed to delete campaign', { component: 'useCampaignList' }, error);
      throw error;
    }
    
    logger.info('Campaign deleted successfully', { component: 'useCampaignList' });
    
    // Refetch the list after deletion
    await loadCampaigns();
  };

  return {
    campaigns,
    loading,
    error: isError ? error : null,
    loadCampaigns,
    deleteCampaign
  };
};