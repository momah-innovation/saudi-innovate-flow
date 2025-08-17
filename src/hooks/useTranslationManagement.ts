import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface TranslationItem {
  id: string;
  key: string;
  value_ar: string;
  value_en: string;
  namespace: string;
  context?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  last_modified_by?: string;
}

export interface TranslationNamespace {
  id: string;
  name: string;
  description_ar?: string;
  description_en?: string;
  is_active: boolean;
  translation_count: number;
}

export const useTranslationManagement = () => {
  const {
    data: translations = [],
    isLoading: loading,
    error,
    refetch: loadTranslations,
    isError
  } = useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      logger.info('Fetching translations', { component: 'useTranslationManagement' });
      
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('key', { ascending: true });
      
      if (error) {
        logger.error('Failed to fetch translations', { component: 'useTranslationManagement' }, error);
        throw error;
      }
      
      logger.info('Translations fetched successfully', { 
        component: 'useTranslationManagement',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const {
    data: namespaces = [],
    isLoading: namespacesLoading,
    refetch: loadNamespaces
  } = useQuery({
    queryKey: ['translation-namespaces'],
    queryFn: async () => {
      logger.info('Fetching translation namespaces', { component: 'useTranslationManagement' });
      
      const { data, error } = await supabase
        .from('translation_namespaces')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        logger.error('Failed to fetch translation namespaces', { component: 'useTranslationManagement' }, error);
        throw error;
      }
      
      logger.info('Translation namespaces fetched successfully', { 
        component: 'useTranslationManagement',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const createTranslation = useCallback(async (translationData: any): Promise<any> => {
    logger.info('Creating translation', { component: 'useTranslationManagement' });
    
    const { data, error } = await supabase
      .from('translations')
      .insert([translationData])
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to create translation', { component: 'useTranslationManagement' }, error);
      throw error;
    }
    
    logger.info('Translation created successfully', { component: 'useTranslationManagement' });
    
    // Refetch the list after creation
    await loadTranslations();
    return data;
  }, [loadTranslations]);

  const updateTranslation = useCallback(async (translationId: string, translationData: any): Promise<any> => {
    logger.info('Updating translation', { component: 'useTranslationManagement', translationId });
    
    const { data, error } = await supabase
      .from('translations')
      .update(translationData)
      .eq('id', translationId)
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to update translation', { component: 'useTranslationManagement', translationId }, error);
      throw error;
    }
    
    logger.info('Translation updated successfully', { component: 'useTranslationManagement', translationId });
    
    // Refetch the list after update
    await loadTranslations();
    return data;
  }, [loadTranslations]);

  const deleteTranslation = useCallback(async (translationId: string): Promise<void> => {
    logger.info('Deleting translation', { component: 'useTranslationManagement', translationId });
    
    const { error } = await supabase
      .from('translations')
      .delete()
      .eq('id', translationId);
    
    if (error) {
      logger.error('Failed to delete translation', { component: 'useTranslationManagement', translationId }, error);
      throw error;
    }
    
    logger.info('Translation deleted successfully', { component: 'useTranslationManagement', translationId });
    
    // Refetch the list after deletion
    await loadTranslations();
  }, [loadTranslations]);

  const bulkImportTranslations = useCallback(async (translations: Partial<TranslationItem>[]): Promise<any> => {
    logger.info('Bulk importing translations', { 
      component: 'useTranslationManagement',
      count: translations.length 
    });
    
    const { data, error } = await supabase
      .from('translations')
      .insert(translations);
    
    if (error) {
      logger.error('Failed to bulk import translations', { component: 'useTranslationManagement' }, error);
      throw error;
    }
    
    logger.info('Translations bulk imported successfully', { component: 'useTranslationManagement' });
    
    await loadTranslations();
    return data;
  }, [loadTranslations]);

  const exportTranslations = useCallback(async (namespace?: string): Promise<TranslationItem[]> => {
    logger.info('Exporting translations', { component: 'useTranslationManagement', namespace });
    
    let query = supabase
      .from('translations')
      .select('*');
    
    if (namespace) {
      query = query.eq('namespace', namespace);
    }
    
    const { data, error } = await query;
    
    if (error) {
      logger.error('Failed to export translations', { component: 'useTranslationManagement' }, error);
      throw error;
    }
    
    logger.info('Translations exported successfully', { 
      component: 'useTranslationManagement',
      count: data?.length || 0
    });
    
    return data || [];
  }, []);

  const searchTranslations = useCallback(async (searchTerm: string): Promise<TranslationItem[]> => {
    logger.info('Searching translations', { component: 'useTranslationManagement', searchTerm });
    
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .or(`key.ilike.%${searchTerm}%,value_ar.ilike.%${searchTerm}%,value_en.ilike.%${searchTerm}%`);
    
    if (error) {
      logger.error('Failed to search translations', { component: 'useTranslationManagement' }, error);
      throw error;
    }
    
    logger.info('Translation search completed', { 
      component: 'useTranslationManagement',
      results: data?.length || 0
    });
    
    return data || [];
  }, []);

  return {
    translations,
    namespaces,
    loading: loading || namespacesLoading,
    error: isError ? error : null,
    loadTranslations,
    loadNamespaces,
    createTranslation,
    updateTranslation,
    deleteTranslation,
    bulkImportTranslations,
    exportTranslations,
    searchTranslations
  };
};