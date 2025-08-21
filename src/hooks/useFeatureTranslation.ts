import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { preloadNamespace, preloadNamespaces } from '@/i18n/enhanced-config-v3';
import { logger } from '@/utils/logger';

/**
 * Enhanced translation hook with automatic namespace loading
 * Combines static translations with dynamic namespace loading
 */
export function useFeatureTranslation(
  namespace: string | string[], 
  options: {
    preload?: boolean;
    fallbackNamespace?: string;
    loadOnMount?: boolean;
  } = {}
) {
  const { 
    preload = true, 
    fallbackNamespace = 'common',
    loadOnMount = true 
  } = options;

  const namespaces = Array.isArray(namespace) ? namespace : [namespace];
  const allNamespaces = [...namespaces, fallbackNamespace];

  const { t, i18n, ready } = useTranslation(allNamespaces, {
    useSuspense: false,
  });

  // Preload namespaces on mount
  useEffect(() => {
    if (loadOnMount && preload) {
      const loadNamespaces = async () => {
        try {
          await preloadNamespaces(namespaces, i18n.language);
          logger.info(`Preloaded namespaces: ${namespaces.join(', ')}`, { component: 'useFeatureTranslation' });
        } catch (error) {
          logger.error(`Failed to preload namespaces: ${namespaces.join(', ')}`, { component: 'useFeatureTranslation' }, error as Error);
        }
      };

      loadNamespaces();
    }
  }, [namespaces, i18n.language, loadOnMount, preload]);

  /**
   * Translation function with automatic namespace prefixing
   */
  const ft = (key: string, options?: any, targetNamespace?: string) => {
    const ns = targetNamespace || namespaces[0];
    const fullKey = key.includes(':') ? key : `${ns}:${key}`;
    return t(fullKey, options);
  };

  /**
   * Get translation from specific namespace
   */
  const nt = (namespace: string, key: string, options?: any) => {
    return t(`${namespace}:${key}`, options);
  };

  /**
   * Common translations (always available)
   */
  const ct = (key: string, options?: any) => {
    return t(`common:${key}`, options);
  };

  /**
   * Navigation translations (always available)
   */
  const nt_nav = (key: string, options?: any) => {
    return t(`navigation:${key}`, options);
  };

  return {
    // Core translation functions
    t: ft,
    nt,
    ct,
    nt_nav,
    
    // Utility functions
    language: i18n.language,
    isRTL: i18n.language === 'ar',
    ready,
    
    // Helper for dynamic loading
    loadNamespace: (ns: string) => preloadNamespace(ns, i18n.language),
    loadNamespaces: (namespaces: string[]) => preloadNamespaces(namespaces, i18n.language),
    
    // Raw i18n instance for advanced use
    i18n
  };
}

/**
 * Convenience hooks for specific features
 */
export const useChallengeTranslation = () => useFeatureTranslation(['challenges', 'challenges-details', 'challenges-form', 'challenges-submissions']);
export const useCampaignTranslation = () => useFeatureTranslation(['campaigns', 'campaigns-form', 'campaigns-analytics']);
export const useDashboardTranslation = () => useFeatureTranslation('dashboard');
export const useAdminTranslation = () => useFeatureTranslation(['admin', 'admin-users', 'admin-settings', 'admin-analytics']);

/**
 * Hook for components that need multiple namespaces
 */
export const useMultiFeatureTranslation = (namespaces: string[]) => {
  return useFeatureTranslation(namespaces, { preload: true });
};