import { useMemo } from 'react';
import { useSystemTranslations } from './useSystemTranslations';

/**
 * Optimized translation hook that memoizes translation lookup
 * for better performance when used across multiple components
 */
export const useOptimizedTranslations = () => {
  const { translations, isLoading, getTranslation } = useSystemTranslations();
  
  // Create a memoized translation map for O(1) lookups
  const translationMap = useMemo(() => {
    const map = new Map<string, { en: string; ar: string }>();
    translations.forEach(translation => {
      map.set(translation.translation_key, {
        en: translation.text_en,
        ar: translation.text_ar
      });
    });
    return map;
  }, [translations]);

  // Optimized translation getter with memoized map lookup
  const getOptimizedTranslation = useMemo(() => {
    return (key: string, fallback?: string, language: 'en' | 'ar' = 'en'): string => {
      const translation = translationMap.get(key);
      return translation?.[language] || fallback || key;
    };
  }, [translationMap]);

  return {
    translations,
    isLoading,
    getTranslation: getOptimizedTranslation,
    translationCount: translations.length,
    isReady: !isLoading && translations.length > 0
  };
};