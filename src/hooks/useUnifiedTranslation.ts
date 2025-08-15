
import { useTranslation as useI18nextTranslation } from 'react-i18next';


import { useMemo, useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';

import { debugLog } from '@/utils/debugLogger';

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
  
  // Disable system translations hook for performance - use static files only
  const systemTranslations = {
    translationMap: new Map(),
    getTranslation: () => '',
    hasTranslation: () => false,
    refreshTranslations: async () => {},
    isLoading: false,
    error: null,
    count: 0,
    isReady: true
  };

  // Minimal logging for static translations
  useEffect(() => {
    try {
      const sessionKey = `static_translations_logged_${language}`;
      if (!sessionStorage.getItem(sessionKey)) {
        debugLog.log('🎯 Static translations loaded', { language });
        sessionStorage.setItem(sessionKey, 'true');
      }
    } catch (error) {
      // Silently handle errors
    }
  }, [language]);

  /**
   * Primary translation function - Enhanced with better fallback logic
   */
  const t = useCallback((key: string, fallbackOrOptions?: string | Record<string, any>, options?: Record<string, any>): string => {
    // Debug logging for troubleshooting
    if (key.startsWith('landing.')) {
      console.log('🔍 Translation debug:', { key, language, i18nLanguage: i18n.language, hasResources: i18n.hasResourceBundle(language, 'landing') });
    }
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

      // Strategy 1: i18next translation (static files) - Primary source
      try {
        let i18nextResult: string;
        
        // Handle namespaced keys (e.g., "landing.hero.title" -> namespace: "landing", key: "hero.title")
        if (key.includes('.')) {
          const parts = key.split('.');
          const potentialNamespace = parts[0];
          
          // Check if the first part is a known namespace
          if (['landing', 'common', 'navigation', 'dashboard', 'auth', 'errors', 'challenges', 'campaigns', 'admin', 'users', 'settings'].includes(potentialNamespace)) {
            const actualKey = parts.slice(1).join('.');
            i18nextResult = i18nextT(actualKey, { 
              ...interpolationOptions, 
              ns: potentialNamespace 
            }) as string;
            
            if (key.startsWith('landing.')) {
              console.log('🔍 Namespaced translation:', { 
                originalKey: key, 
                namespace: potentialNamespace, 
                actualKey, 
                result: i18nextResult,
                resultType: typeof i18nextResult 
              });
            }
          } else {
            // No namespace detected, use key as-is
            i18nextResult = i18nextT(key, interpolationOptions) as string;
          }
        } else {
          // No namespace, use key as-is
          i18nextResult = i18nextT(key, interpolationOptions) as string;
        }
        
        // Check if we got a valid translation (not the key itself)
        if (i18nextResult && i18nextResult !== key && typeof i18nextResult === 'string' && !i18nextResult.includes('.')) {
          return i18nextResult;
        }
        
        // Also try with defaultValue if fallback is provided
        if (fallback) {
          const i18nextWithFallback = i18nextT(key, { ...interpolationOptions, defaultValue: fallback });
          if (i18nextWithFallback && i18nextWithFallback !== key && typeof i18nextWithFallback === 'string') {
            return i18nextWithFallback;
          }
        }
      } catch (e) {
        console.log('🔍 i18next error:', e);
      }

      // Strategy 2: Provided fallback
      if (fallback && fallback.trim() !== '') {
        return interpolateText(fallback, interpolationOptions);
      }

      // Strategy 3: Return key as last resort
      return key;
    } catch (error) {
      logger.warn('Translation error occurred', { key, language }, error as Error);
      return (typeof fallbackOrOptions === 'string' ? fallbackOrOptions : undefined) || key;
    }
  }, [i18nextT, language, i18n]);
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
  const getTranslation = useCallback((key: string, targetLanguage?: 'en' | 'ar', fallback?: string): string => {
    const targetLang = targetLanguage || language;
    try {
      const result = i18nextT(key, { lng: targetLang }) as string;
      if (result && result !== key) {
        return result;
      }
      return fallback || key;
    } catch (error) {
      logger.warn('Translation error with language override', { key, targetLanguage, language }, error as Error);
      return fallback || key;
    }
  }, [i18nextT, language]);

  /**
   * Get bilingual text for dynamic content
   */
  const getDynamicText = useCallback((textAr: string, textEn?: string | null): string => {
    if (language === 'en' && textEn) {
      return textEn;
    }
    return textAr;
  }, [language]);

  /**
   * Format numbers according to current locale
   */
  const formatNumber = useCallback((num: number): string => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US').format(num);
  }, [language]);

  /**
   * Format relative time with proper translations
   */
  const formatRelativeTime = useCallback((date: Date): string => {
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
  }, [t]);

  /**
   * Get translation with loading state for UI components
   */
  const getTranslationWithLoading = useCallback((key: string, fallback?: string): { text: string; isLoading: boolean } => {
    return {
      text: t(key, fallback),
      isLoading: systemTranslations.isLoading
    };
  }, [t, systemTranslations.isLoading]);

  const value = useMemo(() => ({
    // Core translation functions
    t,
    getTranslation,
    
    // Utility functions
    getDynamicText,
    formatNumber,
    formatRelativeTime,
    hasTranslation: systemTranslations.hasTranslation,
    getTranslationWithLoading,
    refreshTranslations: systemTranslations.refreshTranslations,
    
    // State information
    language,
    isRTL,
    isLoading: systemTranslations.isLoading,
    error: systemTranslations.error,
    
    // Statistics
    translationCount: systemTranslations.count,
    isReady: systemTranslations.isReady,
    
    // Raw data access (for advanced use cases)
    translationMap: systemTranslations.translationMap,
    
    // i18next integration
    i18n,
    changeLanguage: i18n.changeLanguage,
  }), [
    t,
    getTranslation,
    getDynamicText,
    formatNumber,
    formatRelativeTime,
    systemTranslations.hasTranslation,
    systemTranslations.refreshTranslations,
    systemTranslations.isLoading,
    systemTranslations.error,
    systemTranslations.count,
    systemTranslations.isReady,
    systemTranslations.translationMap,
    language,
    isRTL,
    i18n
  ]);

  return value;