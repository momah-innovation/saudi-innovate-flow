import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { dbTranslationLoader } from './database-loader';

// Import fallback static translations
import en from './locales/en.json';
import ar from './locales/ar.json';

const fallbackResources = {
  en: { translation: en },
  ar: { translation: ar }
};

// Custom backend that loads from database
const DatabaseBackend = {
  type: 'backend' as const,
  
  init() {
    // Initialize and preload translations
    dbTranslationLoader.preloadTranslations();
  },

  async read(language: string, namespace: string, callback: (error: any, data?: any) => void) {
    try {
      const translations = await dbTranslationLoader.loadTranslations(language);
      const languageData = translations[language] || {};
      callback(null, languageData);
    } catch (error) {
      console.error(`Failed to load ${language} translations:`, error);
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
  }
};

i18n
  .use(DatabaseBackend)
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
    }
  });

export default i18n;