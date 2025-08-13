import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SystemTranslation } from '@/types/translation';
import { queryKeys } from '@/lib/query/query-keys';
import { useMemo } from 'react';

/**
 * Enhanced System Translations Hook
 * Provides database-driven translations with aggressive caching
 */
export function useSystemTranslations(language: 'en' | 'ar' = 'en') {
  const queryClient = useQueryClient();

  // Fetch all translations once with aggressive caching
  const { data: translations = [], isLoading, error } = useQuery({
    queryKey: queryKeys.system.translations(),
    queryFn: async (): Promise<SystemTranslation[]> => {
      try {
        const { data, error } = await supabase
          .from('system_translations')
          .select('id, translation_key, text_en, text_ar, category, created_at, updated_at')
          .order('translation_key');

        if (error) {
          console.error('Failed to fetch translations:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in useSystemTranslations:', error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes  
    refetchOnWindowFocus: false, // Reduce unnecessary fetches
    refetchOnMount: false, // Don't always refetch on mount
    retry: 2,
    refetchInterval: 10 * 60 * 1000 // Refresh every 10 minutes in background
  });

  // Create optimized translation map
  const translationMap = useMemo(() => {
    const map = new Map<string, { en: string; ar: string; category: string }>();
    
    translations.forEach(translation => {
      if (!translation.translation_key) return;
      
      map.set(translation.translation_key, {
        en: translation.text_en || translation.translation_key,
        ar: translation.text_ar || translation.text_en || translation.translation_key,
        category: translation.category || 'general'
      });
    });
    
    return map;
  }, [translations]);

  // Get translation function
  const getTranslation = (key: string, fallback?: string): string => {
    const translation = translationMap.get(key);
    if (translation) {
      return translation[language] || translation.en || fallback || key;
    }
    return fallback || key;
  };

  // Get translations by category
  const getTranslationsByCategory = (category: string) => {
    return translations.filter(t => t.category === category);
  };

  // Check if translation exists
  const hasTranslation = (key: string): boolean => {
    return translationMap.has(key);
  };

  // Refresh translations
  const refreshTranslations = async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.system.translations()
    });
  };

  return {
    translations,
    translationMap,
    getTranslation,
    getTranslationsByCategory,
    hasTranslation,
    refreshTranslations,
    isLoading,
    error,
    count: translations.length,
    isReady: !isLoading && translations.length > 0
  };
}

/**
 * Hook to get a specific translation with reactive updates
 */
export function useTranslation(key: string, fallback?: string, language: 'en' | 'ar' = 'en') {
  const { getTranslation, isLoading } = useSystemTranslations(language);
  
  return {
    text: getTranslation(key, fallback),
    isLoading
  };
}

/**
 * Hook to get translations for a specific category
 */
export function useCategoryTranslations(category: string, language: 'en' | 'ar' = 'en') {
  const { getTranslationsByCategory, isLoading } = useSystemTranslations(language);
  
  return {
    translations: getTranslationsByCategory(category),
    isLoading
  };
}