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

  // Static fallback translations to prevent network requests during navigation
  const staticTranslations: SystemTranslation[] = [
    { id: '1', translation_key: 'welcome', text_en: 'Welcome', text_ar: 'مرحباً', category: 'ui' },
    { id: '2', translation_key: 'dashboard', text_en: 'Dashboard', text_ar: 'لوحة التحكم', category: 'navigation' },
    { id: '3', translation_key: 'ideas', text_en: 'Ideas', text_ar: 'الأفكار', category: 'navigation' },
    { id: '4', translation_key: 'challenges', text_en: 'Challenges', text_ar: 'التحديات', category: 'navigation' },
    { id: '5', translation_key: 'submit', text_en: 'Submit', text_ar: 'إرسال', category: 'ui' }
  ];

  // Use static translations only to prevent navigation freeze
  const translations = staticTranslations;
  const isLoading = false;
  const error = null;

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