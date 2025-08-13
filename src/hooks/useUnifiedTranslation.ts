import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/query/query-keys';
import { useMemo, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { useSystemTranslations } from './useSystemTranslations';

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
  const queryClient = useQueryClient();
  
  // Normalize language code (en-US -> en, ar-SA -> ar)
  const language = i18n.language.split('-')[0] as 'en' | 'ar';
  const isRTL = language === 'ar';
  
  // Use the dedicated system translations hook
  const {
    translationMap,
    getTranslation: getSystemTranslation,
    hasTranslation: hasSystemTranslation,
    refreshTranslations,
    isLoading,
    error,
    count: translationCount,
    isReady
  } = useSystemTranslations(language);

  // Optimized logging - only when data significantly changes and with debouncing
  useEffect(() => {
    if (isReady && translationCount > 0) {
      // Only log once per session or when count changes significantly  
      const sessionKey = `translations_logged_${language}_${translationCount}`;
      if (!sessionStorage.getItem(sessionKey)) {
        console.log('🎯 System translations loaded:', { 
          count: translationCount, 
          language,
          sampleKeys: Array.from(translationMap.keys()).slice(0, 3)
        });
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, [isReady, translationCount, language]);

  /**
   * Primary translation function - Enhanced with better fallback logic
   */
  const t = (key: string, fallbackOrOptions?: string | Record<string, any>, options?: Record<string, any>): string => {
    try {
      let fallback: string | undefined;
      let interpolationOptions: Record<string, any> | undefined;
      
      // Handle parameter variations
      if (typeof fallbackOrOptions === 'string') {
        fallback = fallbackOrOptions;
        interpolationOptions = options;
      } else if (typeof fallbackOrOptions === 'object' && fallbackOrOptions !== null) {
        interpolationOptions = fallbackOrOptions;
        fallback = undefined;
      }

      // Strategy 1: Database translation (highest priority)
      if (hasSystemTranslation(key)) {
        const dbText = getSystemTranslation(key, fallback);
        if (dbText && dbText !== key) {
          const result = interpolateText(dbText, interpolationOptions);
          return result;
        }
      }

      // Strategy 2: i18next translation
      const i18nextResult = i18nextT(key, fallback);
      if (i18nextResult && i18nextResult !== key) {
        return interpolateText(i18nextResult, interpolationOptions);
      }

      // Strategy 3: Provided fallback
      if (fallback && fallback.trim() !== '') {
        const result = interpolateText(fallback, interpolationOptions);
        if (!isLoading && translationCount > 0) {
          console.warn('⚠️ MISSING KEY - USING FALLBACK:', { key, fallback: result.slice(0, 50) });
        }
        return result;
      }

      // Strategy 4: Return key as last resort
      if (!isLoading && translationCount > 0) {
        console.error('❌ MISSING TRANSLATION KEY:', { key, language, availableCount: translationCount });
      }
      return key;
    } catch (error) {
      logger.warn('Translation error occurred', { key, language }, error as Error);
      return (typeof fallbackOrOptions === 'string' ? fallbackOrOptions : undefined) || key;
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
      if (hasSystemTranslation(key)) {
        return getSystemTranslation(key, fallback);
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
      logger.warn('Translation error with language override', { key, targetLanguage, language }, error as Error);
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
    hasTranslation: hasSystemTranslation,
    getTranslationWithLoading,
    refreshTranslations,
    
    // State information
    language,
    isRTL,
    isLoading,
    error,
    
    // Statistics
    translationCount,
    isReady,
    
    // Raw data access (for advanced use cases)
    translationMap,
    
    // i18next integration
    i18n,
    changeLanguage: i18n.changeLanguage,
  };
}