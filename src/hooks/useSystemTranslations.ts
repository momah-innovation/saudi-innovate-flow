import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SystemTranslation } from '@/types/translation';
import { queryKeys } from '@/lib/query/query-keys';
import { useMemo } from 'react';
import { debugLog } from '@/utils/debugLogger';

/**
 * Enhanced System Translations Hook - HYBRID APPROACH
 * Provides database-driven translations for truly dynamic content only
 * Static translations are now handled by the i18next system
 */
export function useSystemTranslations(language: 'en' | 'ar' = 'en') {
  const queryClient = useQueryClient();

  // Query for dynamic translations from database (only when needed)
  const { data: dbTranslations = [], isLoading, error } = useQuery({
    queryKey: queryKeys.system.translations(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_translations')
        .select('*')
        .in('category', [
          'dynamic_content',
          'user_generated',
          'partner_organizations', 
          'custom_fields',
          'complex_lists',
          'expert_statuses',
          'stakeholder_types'
        ]); // Only truly dynamic content
      
      if (error) {
        debugLog.error('Error fetching system translations', { component: 'useSystemTranslations' }, error);
        throw error;
      }
      
      return data as SystemTranslation[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - longer cache for dynamic content
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Reduce unnecessary refetches
  });

  // Create optimized translation map for database translations only
  const translationMap = useMemo(() => {
    const map = new Map<string, { en: string; ar: string; category: string }>();
    
    dbTranslations.forEach(translation => {
      if (!translation.translation_key) return;
      
      map.set(translation.translation_key, {
        en: translation.text_en || translation.translation_key,
        ar: translation.text_ar || translation.text_en || translation.translation_key,
        category: translation.category || 'dynamic'
      });
    });
    
    return map;
  }, [dbTranslations]);

  // Get translation function - only for database translations
  const getTranslation = (key: string, fallback?: string): string => {
    const translation = translationMap.get(key);
    if (translation) {
      return translation[language] || translation.en || fallback || key;
    }
    return fallback || key;
  };

  // Get translations by category - only database categories
  const getTranslationsByCategory = (category: string) => {
    return dbTranslations.filter(t => t.category === category);
  };

  // Check if translation exists in database
  const hasTranslation = (key: string): boolean => {
    return translationMap.has(key);
  };

  // Refresh database translations
  const refreshTranslations = async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.system.translations()
    });
  };

  return {
    translations: dbTranslations,
    translationMap,
    getTranslation,
    getTranslationsByCategory,
    hasTranslation,
    refreshTranslations,
    isLoading,
    error,
    count: dbTranslations.length,
    isReady: !isLoading && dbTranslations.length >= 0 // Allow empty database
  };
}

/**
 * Hook to get a specific dynamic translation with reactive updates
 * NOTE: Use this only for database-stored dynamic content
 * For static translations, use the standard useTranslation from i18next
 */
export function useSystemTranslation(key: string, fallback?: string, language: 'en' | 'ar' = 'en') {
  const { getTranslation, isLoading } = useSystemTranslations(language);
  
  return {
    text: getTranslation(key, fallback),
    isLoading
  };
}

/**
 * Hook to get database translations for a specific category
 * Use for: partner organizations, custom fields, complex dynamic lists
 */
export function useSystemCategoryTranslations(category: string, language: 'en' | 'ar' = 'en') {
  const { getTranslationsByCategory, isLoading } = useSystemTranslations(language);
  
  return {
    translations: getTranslationsByCategory(category),
    isLoading
  };
}