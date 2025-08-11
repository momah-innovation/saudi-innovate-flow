import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Import fallback static translations
import en from './locales/en.json';
import ar from './locales/ar.json';
const fallbackResources = {
  en: { 
    translation: { 
      ...en
    } 
  },
  ar: { 
    translation: { 
      ...ar
    } 
  }
};

// Enhanced database backend with better error handling and caching
const EnhancedDatabaseBackend = {
  type: 'backend' as const,
  
  // Cache for translations
  cache: new Map<string, any>(),
  cacheExpiry: new Map<string, number>(),
  cacheDuration: 10 * 60 * 1000, // 10 minutes
  isLoading: new Set<string>(),
  
  init() {
    logger.info('Enhanced database backend initialized', { component: 'EnhancedDatabaseBackend', action: 'init' });
    this.preloadTranslations();
  },

  async preloadTranslations() {
    try {
      await this.loadFromDatabase('en');
      await this.loadFromDatabase('ar');
    } catch (error) {
      logger.warn('Failed to preload translations', { component: 'EnhancedDatabaseBackend', action: 'preloadTranslations' }, error as Error);
    }
  },

  async loadFromDatabase(language: string): Promise<any> {
    const cacheKey = `translations_${language}`;
    
    // Check cache validity
    const cachedData = this.cache.get(cacheKey);
    const expiry = this.cacheExpiry.get(cacheKey);
    if (cachedData && expiry && Date.now() < expiry) {
      return cachedData;
    }

    // Prevent duplicate requests
    if (this.isLoading.has(language)) {
      return this.waitForLoading(language);
    }
    
    this.isLoading.add(language);

    try {
      logger.info(`Loading ${language} translations from database`, { component: 'EnhancedDatabaseBackend', action: 'loadFromDatabase', language });
      
      // Fetch ALL translations with pagination to handle large datasets
      let allTranslations: any[] = [];
      let hasMore = true;
      let start = 0;
      const batchSize = 1000;
      
      while (hasMore) {
        const { data, error } = await supabase
          .from('system_translations')
          .select('translation_key, text_en, text_ar')
          .range(start, start + batchSize - 1);

        if (error) {
          logger.error(`Database error for ${language}`, { component: 'EnhancedDatabaseBackend', action: 'loadFromDatabase', language }, error as Error);
          throw error;
        }
        
        if (data) {
          allTranslations.push(...data);
          start += batchSize;
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }
      
      const translations = allTranslations;

      // Process translations into nested structure
      const processedTranslations: any = {};
      
      translations?.forEach((translation: any) => {
        const { translation_key, text_en, text_ar } = translation;
        const text = language === 'en' ? text_en : text_ar;
        
        if (!text) return; // Skip empty translations
        
        // Handle nested keys (e.g., "settings.ui.theme")
        const keyParts = translation_key.split('.');
        let current = processedTranslations;
        
        for (let i = 0; i < keyParts.length - 1; i++) {
          const part = keyParts[i];
          if (!current[part] || typeof current[part] !== 'object') {
            current[part] = {};
          }
          current = current[part];
        }
        
        const finalKey = keyParts[keyParts.length - 1];
        current[finalKey] = text;
      });

      // Merge with static translations (database takes precedence)
      const staticTranslations = fallbackResources[language as keyof typeof fallbackResources]?.translation || {};
      const mergedTranslations = { ...staticTranslations, ...processedTranslations };

      // Cache the result
      this.cache.set(cacheKey, mergedTranslations);
      this.cacheExpiry.set(cacheKey, Date.now() + this.cacheDuration);
      
      logger.info(`Loaded ${translations?.length || 0} ${language} translations from database`, { component: 'EnhancedDatabaseBackend', action: 'loadFromDatabase', language });
      return mergedTranslations;

    } catch (error) {
      logger.error(`Failed to load ${language} translations from database`, { component: 'EnhancedDatabaseBackend', action: 'loadFromDatabase', language }, error as Error);
      
      // Return static fallback
      const fallback = fallbackResources[language as keyof typeof fallbackResources];
      return fallback?.translation || {};
      
    } finally {
      this.isLoading.delete(language);
    }
  },

  async waitForLoading(language: string): Promise<any> {
    return new Promise((resolve) => {
      const checkLoading = () => {
        if (!this.isLoading.has(language)) {
          const cached = this.cache.get(`translations_${language}`);
          resolve(cached || {});
        } else {
          setTimeout(checkLoading, 100);
        }
      };
      checkLoading();
    });
  },

  async read(language: string, namespace: string, callback: (error: any, data?: any) => void) {
    try {
      const translations = await this.loadFromDatabase(language);
      callback(null, translations);
    } catch (error) {
      logger.error(`Failed to read ${language} translations`, { component: 'EnhancedDatabaseBackend', action: 'read', language }, error as Error);
      // Fallback to static translations
      const fallback = fallbackResources[language as keyof typeof fallbackResources];
      callback(null, fallback?.translation || {});
    }
  },

  save() {
    // Not implemented - translations are managed through admin UI
  },

  create() {
    // Not implemented - translations are managed through admin UI  
  },

  // Method to invalidate cache
  invalidateCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
    logger.info('Translation cache invalidated', { component: 'EnhancedDatabaseBackend', action: 'invalidateCache' });
  }
};

// Initialize i18next with enhanced backend
i18n
  .use(EnhancedDatabaseBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    lng: 'en',
    supportedLngs: ['en', 'ar'],
    nonExplicitSupportedLngs: true,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    
    react: {
      useSuspense: false
    },

    // Fallback resources in case database loading fails
    resources: fallbackResources,

    // Backend options
    backend: {
      loadPath: '/translations/{{lng}}/{{ns}}.json', // Not used but required
    },

    // Additional configuration for reliability
    saveMissing: false,
    missingKeyHandler: (lng: string[], ns: string, key: string) => {
      logger.warn(`Missing translation key: ${key} for language: ${lng[0]}`, { component: 'EnhancedDatabaseBackend', action: 'missingKeyHandler', key, language: lng[0] });
    }
  });

// Export cache invalidation function for admin use
export const invalidateTranslationCache = () => {
  (EnhancedDatabaseBackend as any).invalidateCache();
};

export default i18n;