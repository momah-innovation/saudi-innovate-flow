import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabase } from '@/integrations/supabase/client';

// Import fallback static translations
import en from './locales/en.json';
import ar from './locales/ar.json';

const fallbackResources = {
  en: { translation: en },
  ar: { translation: ar }
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
    console.log('Enhanced database backend initialized');
    this.preloadTranslations();
  },

  async preloadTranslations() {
    try {
      await this.loadFromDatabase('en');
      await this.loadFromDatabase('ar');
    } catch (error) {
      console.warn('Failed to preload translations:', error);
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
      console.log(`Loading ${language} translations from database...`);
      
      const { data: translations, error } = await supabase
        .from('system_translations')
        .select('translation_key, text_en, text_ar');

      if (error) {
        console.error(`Database error for ${language}:`, error);
        throw error;
      }

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
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
        
        current[keyParts[keyParts.length - 1]] = text;
      });

      // Merge with static translations (database takes precedence)
      const staticTranslations = fallbackResources[language as keyof typeof fallbackResources]?.translation || {};
      const mergedTranslations = { ...staticTranslations, ...processedTranslations };

      // Cache the result
      this.cache.set(cacheKey, mergedTranslations);
      this.cacheExpiry.set(cacheKey, Date.now() + this.cacheDuration);
      
      console.log(`Loaded ${translations?.length || 0} ${language} translations from database`);
      return mergedTranslations;

    } catch (error) {
      console.error(`Failed to load ${language} translations from database:`, error);
      
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
      console.error(`Failed to read ${language} translations:`, error);
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
    console.log('Translation cache invalidated');
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
      console.warn(`Missing translation key: ${key} for language: ${lng[0]}`);
    }
  });

// Export cache invalidation function for admin use
export const invalidateTranslationCache = () => {
  (EnhancedDatabaseBackend as any).invalidateCache();
};

export default i18n;