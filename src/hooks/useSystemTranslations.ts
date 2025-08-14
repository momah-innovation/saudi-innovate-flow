import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SystemTranslation } from '@/types/translation';
import { queryKeys } from '@/lib/query/query-keys';
import { useMemo } from 'react';
import { debugLog } from '@/utils/debugLogger';

/**
 * Enhanced System Translations Hook
 * Provides database-driven translations with aggressive caching
 */
export function useSystemTranslations(language: 'en' | 'ar' = 'en') {
  const queryClient = useQueryClient();

  // Fetch essential translations only to prevent crash - with error boundary
  const { data: translations = [], isLoading, error } = useQuery({
    queryKey: queryKeys.system.translations(),
    queryFn: async (): Promise<SystemTranslation[]> => {
      try {
        // Safety guard: return empty array if auth or database issues
        if (typeof window === 'undefined') {
          return [];
        }
        
        // Fetch essential translations first, then load more in background
        const { data, error } = await supabase
          .from('system_translations')
          .select('id, translation_key, text_en, text_ar, category, created_at, updated_at')
          .order('translation_key')
          .limit(200); // Increase to cover more essential UI elements

        if (error) {
          debugLog.warn('🚨 SYSTEM TRANSLATIONS: Database error, using fallback', { error: error.message });
          // Return empty array instead of throwing to prevent React hook errors
          return [];
        }

        return data || [];
      } catch (error) {
        debugLog.warn('🚨 SYSTEM TRANSLATIONS: Network error, using fallback', { error });
        // Return empty array instead of throwing to prevent React hook errors
        return [];
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes  
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Don't always refetch on mount
    retry: 0, // No retries to prevent endless loading
    refetchInterval: false, // Disable background refresh to prevent crashes
    enabled: typeof window !== 'undefined' // Only run in browser
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