
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
    try {
      let fallback: string | undefined;
      let interpolationOptions: Record<string, any> | undefined;

      // lightweight alias map for known legacy keys (team workspace, etc.)
      const aliasMap: Record<string, string> = {
        teamWorkspace: 'workspace.team.title',
        collaborativeWorkspaceForTeams: 'workspace.team.description',
        joinTeam: 'workspace.team.actions.invite_member',
        searchWorkspace: 'common.placeholders.search',
        export: 'common.actions.export',
        allProjects: 'workspace.projects.active_projects',
        activeProjects: 'workspace.projects.active_projects',
        completedProjects: 'workspace.project_status.completed',
      };

      // Apply alias if present
      const resolvedKey = aliasMap[key] || key;

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
        let i18nextResult: string = '';
        const tried: string[] = [];
        const isValid = (val: any) => typeof val === 'string' && val.trim() !== '' && !tried.includes(val) && !val.includes('.');

        // Special-case mapping: workspace namespace keys
        const workspaceLikePrefixes = ['workspace_selection', 'workspace_types', 'workspace.'];
        if (workspaceLikePrefixes.some((p) => resolvedKey.startsWith(p))) {
          // 1) Try full key inside workspace namespace
          tried.push(resolvedKey);
          const r1 = i18nextT(resolvedKey, { ...interpolationOptions, ns: 'workspace' }) as string;
          if (isValid(r1)) return r1;

          // 2) Strip leading "workspace." and try inside workspace namespace
          const stripped = resolvedKey.replace(/^workspace\./, '');
          tried.push(stripped);
          const r2 = i18nextT(stripped, { ...interpolationOptions, ns: 'workspace' }) as string;
          if (isValid(r2)) return r2;

          // 3) Map org -> organization and try again
          const orgFixed = resolvedKey.replace(/^workspace\.org\./, 'workspace.organization.');
          if (orgFixed !== resolvedKey) {
            tried.push(orgFixed);
            const r3 = i18nextT(orgFixed, { ...interpolationOptions, ns: 'workspace' }) as string;
            if (isValid(r3)) return r3;
          }

        } else if (key.includes('.')) {
          // Handle namespaced keys (e.g., "landing.hero.title" -> namespace: "landing", key: "hero.title")
          const parts = key.split('.');
          const potentialNamespace = parts[0];

          // Check if the first part is a known namespace
          if (
            [
              'landing',
              'common',
              'navigation',
              'dashboard',
              'workspace',
              'auth',
              'errors',
              'challenges',
              'campaigns',
              'admin',
              'users',
              'settings',
            ].includes(potentialNamespace)
          ) {
            const actualKey = parts.slice(1).join('.');
            // First try standard lookup within namespace
            tried.push(actualKey);
            const rNs = i18nextT(actualKey, { ...interpolationOptions, ns: potentialNamespace }) as string;
            if (isValid(rNs)) return rNs;

            // Workspace namespace requires nested prefix in our JSON (workspace.*)
            if (potentialNamespace === 'workspace') {
              // Try with nested prefix
              const nestedKey = `workspace.${actualKey}`;
              tried.push(nestedKey);
              const rNested = i18nextT(nestedKey, { ...interpolationOptions, ns: 'workspace' }) as string;
              if (isValid(rNested)) return rNested;

              // Also handle shorthand org -> organization
              const orgFixedNested = nestedKey.replace(/^workspace\.org\./, 'workspace.organization.');
              if (orgFixedNested !== nestedKey) {
                tried.push(orgFixedNested);
                const rOrgNested = i18nextT(orgFixedNested, { ...interpolationOptions, ns: 'workspace' }) as string;
                if (isValid(rOrgNested)) return rOrgNested;
              }
            }
          } else {
            // No recognized namespace, use key as-is
            tried.push(key);
            const rPlain = i18nextT(key, interpolationOptions) as string;
            if (isValid(rPlain)) return rPlain;
          }
        } else {
          // No namespace, use key as-is
          tried.push(key);
          const rPlain = i18nextT(key, interpolationOptions) as string;
          if (isValid(rPlain)) return rPlain;
        }

        // If nothing returned a valid translation, let fallback strategy handle it
      } catch (e) {
        debugLog.warn('i18next error', { error: e });
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
}