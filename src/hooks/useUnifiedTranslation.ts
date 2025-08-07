import { useQuery } from '@tanstack/react-query';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/query/query-keys';
import { useMemo } from 'react';

interface SystemTranslation {
  id: string;
  translation_key: string;
  text_en: string;
  text_ar: string;
  category: string;
}

/**
 * Unified Translation Hook
 * Combines i18next with database translations for optimal performance and fallbacks
 */
export function useUnifiedTranslation() {
  const { t: i18nextT, i18n } = useI18nextTranslation();
  
  // Normalize language code (en-US -> en, ar-SA -> ar)
  const language = i18n.language.split('-')[0] as 'en' | 'ar';
  const isRTL = language === 'ar';

  // Fetch database translations with React Query
  const { data: dbTranslations = [], isLoading, error } = useQuery({
    queryKey: queryKeys.system.translation(language),
    queryFn: async () => {
      console.log('Fetching unified translations from database');
      const { data, error } = await supabase
        .from('system_translations')
        .select('*');

      if (error) {
        console.error('Database translation fetch error:', error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} database translations`);
      return data as SystemTranslation[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Create optimized translation map
  const translationMap = useMemo(() => {
    const map = new Map<string, { en: string; ar: string }>();
    dbTranslations.forEach(translation => {
      map.set(translation.translation_key, {
        en: translation.text_en,
        ar: translation.text_ar
      });
    });
    return map;
  }, [dbTranslations]);

  /**
   * Primary translation function - STANDARDIZED PATTERN ONLY
   * t(key, fallback, options) - fallback and options are optional
   */
  const t = (key: string, fallback?: string, options?: Record<string, any>): string => {
    try {
      // Strategy 1: Database translation (highest priority)
      const dbTranslation = translationMap.get(key);
      if (dbTranslation) {
        const text = dbTranslation[language];
        if (text && text.trim() !== '') {
          return interpolateText(text, options);
        }
      }

      // Strategy 2: Provided fallback
      if (fallback && fallback.trim() !== '') {
        return interpolateText(fallback, options);
      }

      // Strategy 3: Return key as last resort
      return key;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return fallback || key;
    }
  };

  /**
   * Simple interpolation function for database translations
   */
  const interpolateText = (text: string, options?: Record<string, any>): string => {
    if (!options || typeof options !== 'object') return text;
    
    let result = text;
    
    // Handle {{key}} interpolation patterns only
    Object.keys(options).forEach(key => {
      if (options[key] !== undefined) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(options[key]));
      }
    });
    
    return result;
  };

  /**
   * Get translation with explicit language override
   */
  const getTranslation = (key: string, targetLanguage?: 'en' | 'ar', fallback?: string): string => {
    const targetLang = targetLanguage || language;
    
    try {
      const dbTranslation = translationMap.get(key);
      if (dbTranslation) {
        const text = dbTranslation[targetLang];
        if (text && text.trim() !== '') {
          return text;
        }
      }

      // Fallback to i18next for the target language
      const currentLang = i18n.language;
      if (targetLang !== language) {
        i18n.changeLanguage(targetLang);
        const result = i18nextT(key);
        i18n.changeLanguage(currentLang); // Restore original language
        if (result && result !== key) {
          return result;
        }
      } else {
        const result = i18nextT(key);
        if (result && result !== key) {
          return result;
        }
      }

      return fallback || key;
    } catch (error) {
      console.warn(`Translation error for key "${key}" (${targetLang}):`, error);
      return fallback || key;
    }
  };

  /**
   * Get bilingual text for dynamic content
   */
  const getDynamicText = (textAr: string, textEn?: string | null): string => {
    if (language === 'en' && textEn) {
      return textEn;
    }
    return textAr;
  };

  /**
   * Format numbers according to current locale
   */
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US').format(num);
  };

  /**
   * Format relative time with proper translations
   */
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return t('just_now', 'Just now');
    } else if (diffInMinutes < 60) {
      return t(diffInMinutes === 1 ? 'minutes_ago' : 'minutes_ago_plural', `${diffInMinutes} minutes ago`);
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return t(hours === 1 ? 'hours_ago' : 'hours_ago_plural', `${hours} hours ago`);
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return t(days === 1 ? 'days_ago' : 'days_ago_plural', `${days} days ago`);
    }
  };

  /**
   * Check if translation exists in database
   */
  const hasTranslation = (key: string): boolean => {
    return translationMap.has(key);
  };

  /**
   * Get all translations for a category
   */
  const getCategoryTranslations = (category: string): SystemTranslation[] => {
    return dbTranslations.filter(translation => translation.category === category);
  };

  /**
   * Get translation with loading state for UI components
   */
  const getTranslationWithLoading = (key: string, fallback?: string): { text: string; isLoading: boolean } => {
    return {
      text: t(key, fallback),
      isLoading
    };
  };

  return {
    // Core translation functions
    t,
    getTranslation,
    
    // Utility functions
    getDynamicText,
    formatNumber,
    formatRelativeTime,
    hasTranslation,
    getCategoryTranslations,
    getTranslationWithLoading,
    
    // State information
    language,
    isRTL,
    isLoading,
    error,
    
    // Statistics
    translationCount: dbTranslations.length,
    isReady: !isLoading && dbTranslations.length > 0,
    
    // Raw data access (for advanced use cases)
    dbTranslations,
    translationMap,
    
    // i18next integration
    i18n,
    changeLanguage: i18n.changeLanguage,
  };
}