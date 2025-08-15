import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { logger } from '@/utils/logger';

// Import static translations organized by feature
// Landing page translations
import enLanding from './locales/en/landing.json';
import arLanding from './locales/ar/landing.json';

// Common shared translations
import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';

// Navigation translations
import enNavigation from './locales/en/navigation.json';
import arNavigation from './locales/ar/navigation.json';

// Dashboard translations
import enDashboard from './locales/en/dashboard.json';
import arDashboard from './locales/ar/dashboard.json';

// Auth translations
import enAuth from './locales/en/auth.json';
import arAuth from './locales/ar/auth.json';

// Error translations
import enErrors from './locales/en/errors.json';
import arErrors from './locales/ar/errors.json';

// Base static resources - these are loaded immediately
const staticResources = {
  en: { 
    landing: enLanding,
    common: enCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    auth: enAuth,
    errors: enErrors
  },
  ar: { 
    landing: arLanding,
    common: arCommon,
    navigation: arNavigation,
    dashboard: arDashboard,
    auth: arAuth,
    errors: arErrors
  }
};

// Dynamic namespace loader for feature-specific translations
const loadNamespace = async (language: string, namespace: string) => {
  try {
    // Only load if not already loaded
    if (i18n.hasResourceBundle(language, namespace)) {
      return i18n.getResourceBundle(language, namespace);
    }

    // Dynamic imports for feature-specific translations
    let translations;
    
    switch (namespace) {
      case 'challenges-details':
        translations = language === 'en' 
          ? await import('./locales/en/challenges/details.json')
          : await import('./locales/ar/challenges/details.json');
        break;
      
      case 'challenges':
        translations = language === 'en' 
          ? await import('./locales/en/challenges/index.json')
          : await import('./locales/ar/challenges/index.json');
        break;
      
      case 'campaigns':
        translations = language === 'en'
          ? await import('./locales/en/campaigns/index.json') 
          : await import('./locales/ar/campaigns/index.json');
        break;
        
      case 'admin-settings':
        translations = language === 'en'
          ? await import('./locales/en/admin/settings.json')
          : await import('./locales/ar/admin/settings.json');
        break;
        
      case 'admin':
        translations = language === 'en'
          ? await import('./locales/en/admin/index.json')
          : await import('./locales/ar/admin/index.json');
        break;
        
      case 'admin-users':
        translations = language === 'en'
          ? await import('./locales/en/admin/users.json')
          : await import('./locales/ar/admin/users.json');
        break;
        
      case 'admin-analytics':
        translations = language === 'en'
          ? await import('./locales/en/admin/analytics.json')
          : await import('./locales/ar/admin/analytics.json');
        break;
        
      case 'validation':
        translations = language === 'en'
          ? await import('./locales/en/validation.json')
          : await import('./locales/ar/validation.json');
        break;
        
      case 'system-lists':
        translations = language === 'en'
          ? await import('./locales/en/system-lists.json')
          : await import('./locales/ar/system-lists.json');
        break;
        
      case 'challenges-form':
        translations = language === 'en'
          ? await import('./locales/en/challenges/form.json')
          : await import('./locales/ar/challenges/form.json');
        break;
        
      case 'challenges-submissions':
        translations = language === 'en'
          ? await import('./locales/en/challenges/submissions.json')
          : await import('./locales/ar/challenges/submissions.json');
        break;
        
      case 'campaigns-form':
        translations = language === 'en'
          ? await import('./locales/en/campaigns/form.json')
          : await import('./locales/ar/campaigns/form.json');
        break;
        
      case 'campaigns-analytics':
        translations = language === 'en'
          ? await import('./locales/en/campaigns/analytics.json')
          : await import('./locales/ar/campaigns/analytics.json');
        break;
        
      case 'events':
        translations = language === 'en'
          ? await import('./locales/en/events.json')
          : await import('./locales/ar/events.json');
        break;
        
      case 'partners':
        translations = language === 'en'
          ? await import('./locales/en/partners.json')
          : await import('./locales/ar/partners.json');
        break;
        
      case 'opportunities':
        translations = language === 'en'
          ? await import('./locales/en/opportunities.json')
          : await import('./locales/ar/opportunities.json');
        break;
        
      case 'ideas-wizard':
        translations = language === 'en'
          ? await import('./locales/en/ideas/wizard.json')
          : await import('./locales/ar/ideas/wizard.json');
        break;
        
      case 'collaboration':
        translations = language === 'en'
          ? await import('./locales/en/collaboration.json')
          : await import('./locales/ar/collaboration.json');
        break;
        
      case 'profile':
        translations = language === 'en'
          ? await import('./locales/en/profile.json')
          : await import('./locales/ar/profile.json');
        break;
        
      default:
        logger.warn(`Unknown namespace: ${namespace}`, { component: 'FeatureBasedBackend' });
        return {};
    }

    // Add the loaded translations to i18next
    i18n.addResourceBundle(language, namespace, translations.default, true, true);
    
    logger.info(`Loaded namespace: ${namespace} for language: ${language}`, { component: 'FeatureBasedBackend' });
    
    return translations.default;
    
  } catch (error) {
    logger.error(`Failed to load namespace: ${namespace} for language: ${language}`, { component: 'FeatureBasedBackend' }, error as Error);
    return {};
  }
};

// Optimized backend for static-first loading
const FeatureBasedBackend = {
  type: 'backend' as const,
  
  init() {
    logger.info('Feature-based backend initialized');
  },

  async read(language: string, namespace: string, callback: (error: any, data?: any) => void) {
    try {
      // Check if we have static resources for this namespace
      const staticData = staticResources[language as keyof typeof staticResources]?.[namespace as keyof typeof staticResources['en']];
      
      if (staticData) {
        // Return static data immediately
        callback(null, staticData);
        return;
      }

      // For dynamic namespaces, load them asynchronously
      const dynamicData = await loadNamespace(language, namespace);
      callback(null, dynamicData);
      
    } catch (error) {
      logger.error(`Failed to read translations for ${language}/${namespace}`, { component: 'FeatureBasedBackend' }, error as Error);
      
      // Return empty object on error to prevent i18n from breaking
      callback(null, {});
    }
  },

  save() {
    // Not implemented - translations are managed through files and admin UI
  },

  create() {
    // Not implemented - translations are managed through files and admin UI  
  }
};

// Initialize i18next with the new feature-based structure
i18n
  .use(FeatureBasedBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    lng: 'ar', // Changed from 'en' to 'ar' - Arabic as default
    supportedLngs: ['en', 'ar'],
    nonExplicitSupportedLngs: true,
    
    // Default namespaces that should be loaded immediately
    defaultNS: 'common',
    ns: ['common', 'landing', 'navigation', 'dashboard', 'auth', 'errors', 'validation', 'system-lists'],
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
    },

    // Fallback resources for immediate loading
    resources: staticResources,

    // Backend options
    backend: {
      loadPath: '/translations/{{lng}}/{{ns}}.json', // Not used but required
    },

    // Additional configuration for production reliability
    saveMissing: false,
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      try {
        const lang = Array.isArray(lngs) ? lngs[0] : (lngs as unknown as string);
        logger.warn(`Missing translation key`, {
          component: 'i18n',
          language: lang,
          key,
          fallback: String(fallbackValue ?? '')
        });
      } catch (e) {
        console.warn('[i18n] Missing key', lngs, ns, key);
      }
    },
    
    // Production performance settings
    returnEmptyString: false,
    returnNull: false,
    returnObjects: false
  });

// Enhanced helper functions for production optimization
export const preloadNamespace = async (namespace: string, language?: string) => {
  const targetLanguage = language || i18n.language;
  
  // Performance tracking
  const startTime = performance.now();
  
  if (!i18n.hasResourceBundle(targetLanguage, namespace)) {
    await loadNamespace(targetLanguage, namespace);
    
    const loadTime = performance.now() - startTime;
    if (loadTime > 100) {
      logger.warn(`Slow namespace loading detected: ${namespace} (${loadTime.toFixed(1)}ms)`, { 
        component: 'FeatureBasedBackend' 
      });
    }
  }
};

// Optimized batch namespace loader with performance monitoring
export const preloadNamespaces = async (namespaces: string[], language?: string) => {
  const targetLanguage = language || i18n.language;
  const startTime = performance.now();
  
  // Load namespaces in parallel for optimal performance
  await Promise.all(
    namespaces.map(ns => preloadNamespace(ns, targetLanguage))
  );
  
  const totalTime = performance.now() - startTime;
  logger.debug(`Batch loaded ${namespaces.length} namespaces in ${totalTime.toFixed(1)}ms`, {
    component: 'FeatureBasedBackend'
  });
};

export { loadNamespace };
export default i18n;