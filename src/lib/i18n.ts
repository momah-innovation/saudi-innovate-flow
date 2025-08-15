import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Ultra-minimal config to prevent navigation freeze
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: {} },
      ar: { translation: {} }
    },
    fallbackLng: 'en',
    lng: 'ar',
    debug: false,
    
    // CRITICAL: Prevent all object access errors
    returnObjects: false,
    returnEmptyString: false,
    returnNull: false,
    
    // Disable all problematic features
    saveMissing: false,
    missingKeyHandler: false,
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
      bindI18n: false,
      bindI18nStore: false,
      transEmptyNodeValue: '',
    }
  });

export default i18n;