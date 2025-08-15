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

// Static-first backend with database fallback
const StaticFirstBackend = {
  type: 'backend' as const,
  
  // Minimal cache for database translations only
  dbCache: new Map<string, any>(),
  cacheExpiry: new Map<string, number>(),
  cacheDuration: 30 * 60 * 1000, // 30 minutes for database fallback
  isLoading: new Set<string>(),
  
  init() {
    logger.info('Static-first backend initialized', { component: 'StaticFirstBackend', action: 'init' });
  },

  async loadStaticTranslations(language: string): Promise<any> {
    // Return static translations immediately - no async needed
    const staticTranslations = fallbackResources[language as keyof typeof fallbackResources]?.translation || {};
    return staticTranslations;
  },

  async loadDatabaseFallback(language: string, missingKeys: string[]): Promise<any> {
    if (missingKeys.length === 0) return {};
    
    const cacheKey = `db_fallback_${language}`;
    
    // Check cache validity for database fallback
    const cachedData = this.dbCache.get(cacheKey);
    const expiry = this.cacheExpiry.get(cacheKey);
    if (cachedData && expiry && Date.now() < expiry) {
      return this.filterDbTranslations(cachedData, missingKeys);
    }

    // Prevent duplicate requests
    if (this.isLoading.has(language)) {
      return {};
    }
    
    this.isLoading.add(language);

    try {
      logger.info(`Loading database fallback for ${missingKeys.length} missing keys`, { component: 'StaticFirstBackend' });
      
      // Query only for missing keys to minimize database load
      const { data, error } = await supabase
        .from('system_translations')
        .select('translation_key, text_en, text_ar')
        .in('translation_key', missingKeys)
        .limit(100); // Limit to prevent excessive queries

      if (error) {
        logger.error(`Database fallback error for ${language}`, { component: 'StaticFirstBackend', action: 'loadDatabaseFallback', language }, error as Error);
        return {};
      }

      // Process database translations
      const dbTranslations: any = {};
      data?.forEach((translation: any) => {
        const { translation_key, text_en, text_ar } = translation;
        const text = language === 'en' ? text_en : text_ar;
        
        if (text) {
          // Handle nested keys
          const keyParts = translation_key.split('.');
          let current = dbTranslations;
          
          for (let i = 0; i < keyParts.length - 1; i++) {
            const part = keyParts[i];
            if (!current[part] || typeof current[part] !== 'object') {
              current[part] = {};
            }
            current = current[part];
          }
          
          const finalKey = keyParts[keyParts.length - 1];
          current[finalKey] = text;
        }
      });

      // Cache database translations
      this.dbCache.set(cacheKey, dbTranslations);
      this.cacheExpiry.set(cacheKey, Date.now() + this.cacheDuration);
      
      logger.info(`Loaded ${data?.length || 0} database fallback translations`, { 
        component: 'StaticFirstBackend', 
        action: 'loadDatabaseFallback', 
        language 
      });
      
      return dbTranslations;

    } catch (error) {
      logger.error(`Failed to load database fallback for ${language}`, { component: 'StaticFirstBackend', action: 'loadDatabaseFallback', language }, error as Error);
      return {};
      
    } finally {
      this.isLoading.delete(language);
    }
  },

  filterDbTranslations(dbTranslations: any, missingKeys: string[]): any {
    const filtered: any = {};
    missingKeys.forEach(key => {
      const keyParts = key.split('.');
      let source = dbTranslations;
      let target = filtered;
      
      for (let i = 0; i < keyParts.length - 1; i++) {
        const part = keyParts[i];
        if (source[part] && typeof source[part] === 'object') {
          if (!target[part]) target[part] = {};
          source = source[part];
          target = target[part];
        } else {
          return; // Key not found in database
        }
      }
      
      const finalKey = keyParts[keyParts.length - 1];
      if (source[finalKey]) {
        target[finalKey] = source[finalKey];
      }
    });
    return filtered;
  },

  async waitForLoading(language: string): Promise<any> {
    return new Promise((resolve) => {
      const checkLoading = () => {
        if (!this.isLoading.has(language)) {
          const cached = this.dbCache.get(`db_fallback_${language}`);
          resolve(cached || {});
        } else {
          import('@/utils/timerManager').then(({ default: timerManager }) => {
            timerManager.setTimeout('i18n-check-loading', checkLoading, 100);
          });
        }
      };
      checkLoading();
    });
  },

  async read(language: string, namespace: string, callback: (error: any, data?: any) => void) {
    try {
      // Step 1: Load static translations immediately
      const staticTranslations = await this.loadStaticTranslations(language);
      
      // Step 2: For production optimization, skip database fallback for now
      // Database will only be used for missing keys in admin interfaces
      callback(null, staticTranslations);
      
    } catch (error) {
      logger.error(`Failed to read ${language} translations`, { component: 'StaticFirstBackend', action: 'read', language }, error as Error);
      // Final fallback to static translations
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

  // Method to invalidate database cache
  invalidateCache() {
    this.dbCache.clear();
    this.cacheExpiry.clear();
    logger.info('Database translation cache invalidated', { component: 'StaticFirstBackend', action: 'invalidateCache' });
  }
};

// Initialize i18next with static-first backend
i18n
  .use(StaticFirstBackend)
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
      logger.warn(`Missing translation key: ${key} for language: ${lng[0]}`, { component: 'StaticFirstBackend', action: 'missingKeyHandler', key, language: lng[0] });
    }
  });

// Export cache invalidation function for admin use
export const invalidateTranslationCache = () => {
  (StaticFirstBackend as any).dbCache.clear();
  (StaticFirstBackend as any).cacheExpiry.clear();
  logger.info('Database translation cache invalidated', { component: 'StaticFirstBackend', action: 'invalidateTranslationCache' });
};

// Function to load database translations for missing keys (for admin use)
export const loadDatabaseTranslations = async (language: string, missingKeys: string[]) => {
  return (StaticFirstBackend as any).loadDatabaseFallback(language, missingKeys);
};

export default i18n;