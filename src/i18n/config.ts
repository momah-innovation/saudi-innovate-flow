import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: {
    translation: en
  },
  ar: {
    translation: ar
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true, // Enable debug to see what's happening
    
    // Fix language detection to use only 'en' or 'ar'
    lng: 'en', // Default language
    supportedLngs: ['en', 'ar'], // Only these languages are supported
    nonExplicitSupportedLngs: true, // Allow 'en-US' to fallback to 'en'
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng' // Use standard i18next key
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;