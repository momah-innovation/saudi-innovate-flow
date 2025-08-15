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

  // Use static translation cache to prevent multiple queries
  const { data: translations = [], isLoading, error } = useQuery({
    queryKey: queryKeys.system.translations(),
    queryFn: async (): Promise<SystemTranslation[]> => {
      try {
        // Check if we already have cached translations in localStorage
        const cacheKey = 'system_translations_cache';
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            const cacheAge = Date.now() - cachedData.timestamp;
            // Use cache if less than 1 hour old
            if (cacheAge < 60 * 60 * 1000) {
              debugLog.log('📦 Using cached translations', { count: cachedData.data.length });
              return cachedData.data;
            }
          } catch (e) {
            // Invalid cache, will fetch fresh
          }
        }
        
        // Safety guard: return empty array if auth or database issues
        if (typeof window === 'undefined') {
          return [];
        }
        
        // Fetch only essential translations to prevent navigation freeze
        const { data, error } = await supabase
          .from('system_translations')
          .select('id, translation_key, text_en, text_ar, category')
          .in('category', ['ui', 'navigation', 'general', 'forms', 'errors']) // Only essential categories
          .order('translation_key')
          .limit(100); // Dramatically reduce to prevent freeze

        if (error) {
          debugLog.warn('🚨 SYSTEM TRANSLATIONS: Database error, using fallback', { error: error.message });
          return [];
        }

        // Cache the result
        if (data && data.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
          }));
        }

        return data || [];
      } catch (error) {
        debugLog.warn('🚨 SYSTEM TRANSLATIONS: Network error, using fallback', { error });
        return [];
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour - much longer cache
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1, // Only 1 retry
    refetchInterval: false,
    enabled: typeof window !== 'undefined',
    networkMode: 'offlineFirst' // Prefer cache over network
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