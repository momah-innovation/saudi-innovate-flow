import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface SectorItem {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  vision_2030_alignment?: string;
  created_at: string;
}

export const useSectorManagement = () => {
  const {
    data: sectors = [],
    isLoading: loading,
    error,
    refetch: loadSectors,
    isError
  } = useQuery<SectorItem[]>({
    queryKey: ['sectors-list'],
    queryFn: async () => {
      logger.info('Fetching sectors list', { component: 'useSectorManagement' });
      
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch sectors', { component: 'useSectorManagement' }, error);
        throw error;
      }
      
      logger.info('Sectors fetched successfully', { 
        component: 'useSectorManagement',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createSector = useCallback(async (sectorData: any): Promise<any> => {
    logger.info('Creating sector', { component: 'useSectorManagement' });
    
    const { data, error } = await supabase
      .from('sectors')
      .insert([sectorData])
      .select()
      .maybeSingle();
    
    if (error) {
      logger.error('Failed to create sector', { component: 'useSectorManagement' }, error);
      throw error;
    }
    
    logger.info('Sector created successfully', { component: 'useSectorManagement' });
    
    // Refetch the list after creation
    await loadSectors();
    return data;
  }, [loadSectors]);

  const updateSector = useCallback(async (sectorId: string, sectorData: any): Promise<any> => {
    logger.info('Updating sector', { component: 'useSectorManagement' });
    
    const { data, error } = await supabase
      .from('sectors')
      .update(sectorData)
      .eq('id', sectorId)
      .select()
      .maybeSingle();
    
    if (error) {
      logger.error('Failed to update sector', { component: 'useSectorManagement' }, error);
      throw error;
    }
    
    logger.info('Sector updated successfully', { component: 'useSectorManagement' });
    
    // Refetch the list after update
    await loadSectors();
    return data;
  }, [loadSectors]);

  const deleteSector = useCallback(async (sectorId: string): Promise<void> => {
    logger.info('Deleting sector', { component: 'useSectorManagement' });
    
    const { error } = await supabase
      .from('sectors')
      .delete()
      .eq('id', sectorId);
    
    if (error) {
      logger.error('Failed to delete sector', { component: 'useSectorManagement' }, error);
      throw error;
    }
    
    logger.info('Sector deleted successfully', { component: 'useSectorManagement' });
    
    // Refetch the list after deletion
    await loadSectors();
  }, [loadSectors]);

  return {
    sectors,
    loading,
    error: isError ? error : null,
    loadSectors,
    createSector,
    updateSector,
    deleteSector
  };
};