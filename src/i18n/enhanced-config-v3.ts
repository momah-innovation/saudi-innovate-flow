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

// Admin translations
import enAdmin from './locales/en/admin.json';
import arAdmin from './locales/ar/admin.json';

// Auth translations
import enAuth from './locales/en/auth.json';
import arAuth from './locales/ar/auth.json';

// Error translations
import enErrors from './locales/en/errors.json';
import arErrors from './locales/ar/errors.json';

// Workspace translations
import enWorkspace from './locales/en/workspace.json';
import arWorkspace from './locales/ar/workspace.json';

// Challenges translations
import enChallenges from './locales/en/challenges.json';
import arChallenges from './locales/ar/challenges.json';

// Expert translations
import enExpert from './locales/en/expert.json';
import arExpert from './locales/ar/expert.json';

// Events translations
import enEvents from './locales/en/events.json';
import arEvents from './locales/ar/events.json';

// Statistics translations
import enStatistics from './locales/en/statistics.json';
import arStatistics from './locales/ar/statistics.json';

// Subscription translations
import enSubscription from './locales/en/subscription.json';
import arSubscription from './locales/ar/subscription.json';

// Trends translations
import enTrends from './locales/en/trends.json';
import arTrends from './locales/ar/trends.json';

// Stakeholder translations
import enStakeholder from './locales/en/stakeholder.json';
import arStakeholder from './locales/ar/stakeholder.json';

// Pages translations  
import enPages from './locales/en/pages.json';
import arPages from './locales/ar/pages.json';

// Dialogs translations
import enDialogs from './locales/en/dialogs.json';
import arDialogs from './locales/ar/dialogs.json';

// Tabs translations
import enTabs from './locales/en/tabs.json';
import arTabs from './locales/ar/tabs.json';

// Breadcrumbs translations
import enBreadcrumbs from './locales/en/breadcrumbs.json';
import arBreadcrumbs from './locales/ar/breadcrumbs.json';

// Routes translations
import enRoutes from './locales/en/routes.json';
import arRoutes from './locales/ar/routes.json';

// Advanced Search translations
import enAdvancedSearch from './locales/en/advanced-search.json';
import arAdvancedSearch from './locales/ar/advanced-search.json';

// Challenge Form translations
import enChallengeForm from './locales/en/challenge-form.json';
import arChallengeForm from './locales/ar/challenge-form.json';

// Error Boundary translations
import enErrorBoundary from './locales/en/error-boundary.json';
import arErrorBoundary from './locales/ar/error-boundary.json';

// Base static resources - these are loaded immediately
const staticResources = {
  en: { 
    landing: enLanding,
    common: enCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    admin: enAdmin,
    auth: enAuth,
    errors: enErrors,
    workspace: enWorkspace,
    challenges: enChallenges,
    expert: enExpert,
    events: enEvents,
    statistics: enStatistics,
    subscription: enSubscription,
    trends: enTrends,
    stakeholder: enStakeholder,
    pages: enPages,
    dialogs: enDialogs,
    tabs: enTabs,
    breadcrumbs: enBreadcrumbs,
    routes: enRoutes,
    'advanced-search': enAdvancedSearch,
    'challenge-form': enChallengeForm,
    'error-boundary': enErrorBoundary
  },
  ar: { 
    landing: arLanding,
    common: arCommon,
    navigation: arNavigation,
    dashboard: arDashboard,
    admin: arAdmin,
    auth: arAuth,
    errors: arErrors,
    workspace: arWorkspace,
    challenges: arChallenges,
    expert: arExpert,
    events: arEvents,
    statistics: arStatistics,
    subscription: arSubscription,
    trends: arTrends,
    stakeholder: arStakeholder,
    pages: arPages,
    dialogs: arDialogs,
    tabs: arTabs,
    breadcrumbs: arBreadcrumbs,
    routes: arRoutes,
    'advanced-search': arAdvancedSearch,
    'challenge-form': arChallengeForm,
    'error-boundary': arErrorBoundary
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
          ? await import('./locales/en/admin.json')
          : await import('./locales/ar/admin.json');
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
          ? await import('./locales/en/ideas-wizard.json')
          : await import('./locales/ar/ideas-wizard.json');
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
        
      case 'activity':
        translations = language === 'en'
          ? await import('./locales/en/activity.json')
          : await import('./locales/ar/activity.json');
        break;
        
      case 'challenge-settings':
        translations = language === 'en'
          ? await import('./locales/en/challenge_settings.json')
          : await import('./locales/ar/challenge_settings.json');
        break;
        
      case 'workspace':
        translations = language === 'en'
          ? await import('./locales/en/workspace.json')
          : await import('./locales/ar/workspace.json');
        break;
        
      case 'team':
        translations = language === 'en'
          ? await import('./locales/en/team.json')
          : await import('./locales/ar/team.json');
        break;
        
      case 'trends':
        translations = language === 'en'
          ? await import('./locales/en/trends.json')
          : await import('./locales/ar/trends.json');
        break;
        
      case 'stakeholder':
        translations = language === 'en'
          ? await import('./locales/en/stakeholder.json')
          : await import('./locales/ar/stakeholder.json');
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

// Key normalization function to handle both namespace:key and namespace.key patterns
const normalizeTranslationKey = (key: string): { namespace: string | null; normalizedKey: string } => {
  // Handle namespace:key pattern (correct format)
  if (key.includes(':')) {
    const [namespace, ...keyParts] = key.split(':');
    return { namespace, normalizedKey: keyParts.join(':') };
  }
  
  // Handle namespace.key pattern (legacy format - convert to namespace:key)
  if (key.includes('.')) {
    const parts = key.split('.');
    const potentialNamespace = parts[0];
    
    // Check if first part is a known namespace
    const knownNamespaces = [
      'common', 'landing', 'navigation', 'dashboard', 'workspace', 'admin', 'auth', 
      'errors', 'challenges', 'campaigns', 'events', 'expert', 'statistics', 
      'subscription', 'trends', 'stakeholder', 'validation', 'system-lists',
      'challenges-details', 'challenges-form', 'challenges-submissions',
      'campaigns-form', 'campaigns-analytics', 'admin-settings', 'admin-users', 
      'admin-analytics', 'partners', 'opportunities', 'ideas-wizard', 
      'collaboration', 'profile', 'challenge-settings', 'error-boundary', 'team',
      'pages', 'dialogs', 'tabs', 'breadcrumbs', 'routes', 'advanced-search', 
      'challenge-form', 'activity'
    ];
    
    if (knownNamespaces.includes(potentialNamespace)) {
      const normalizedKey = parts.slice(1).join('.');
      return { namespace: potentialNamespace, normalizedKey };
    }
  }
  
  // No namespace found, return as-is
  return { namespace: null, normalizedKey: key };
};

// Optimized backend for static-first loading
const FeatureBasedBackend = {
  type: 'backend' as const,
  
  init() {
    logger.info('Feature-based backend initialized with dual pattern support');
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
    debug: false,
    
    lng: 'ar', // Changed from 'en' to 'ar' - Arabic as default
    supportedLngs: ['en', 'ar'],
    nonExplicitSupportedLngs: true,
    
    // Default namespaces that should be loaded immediately - using dot notation
    defaultNS: 'common',
    ns: ['common', 'landing', 'navigation', 'dashboard', 'workspace', 'admin', 'auth', 'errors', 'challenges', 'expert', 'events', 'statistics', 'subscription', 'trends', 'stakeholder', 'pages', 'dialogs', 'tabs', 'breadcrumbs', 'routes', 'advanced-search', 'challenge-form', 'activity', 'error-boundary', 'ideas-wizard'],
    
    // Namespace/key separators
    nsSeparator: ':', // use ':' to separate namespace from key (avoids conflict with nested dot keys)
    keySeparator: '.',
    
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
        // Use structured logging for missing translation keys
        if (typeof window !== 'undefined' && (window as any).debugLog) {
          (window as any).debugLog.warn('Missing translation key', { 
            component: 'i18n-enhanced', 
            data: { languages: lngs, namespace: ns, key }, 
            error: e 
          });
        }
      }
    },
    
    // Production performance settings
    returnEmptyString: false,
    returnNull: false,
    returnObjects: false
  });

// Monkey-patch i18n.t to support both namespace:key and namespace.key patterns globally
const __originalT = i18n.t.bind(i18n);
(i18n as any).t = ((key: any, options?: any) => {
  try {
    if (typeof key === 'string') {
      const { namespace, normalizedKey } = normalizeTranslationKey(key);
      if (namespace) {
        return __originalT(`${namespace}:${normalizedKey}`, options);
      }
      return __originalT(key, options);
    }
    if (Array.isArray(key)) {
      const processed = key.map((k) => {
        if (typeof k === 'string') {
          const { namespace, normalizedKey } = normalizeTranslationKey(k);
          return namespace ? `${namespace}:${normalizedKey}` : k;
        }
        return k;
      });
      return __originalT(processed as any, options);
    }
    return __originalT(key, options);
  } catch (e) {
    return __originalT(key, options);
  }
}) as any;

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

// Enhanced translation function that normalizes keys
export const normalizedT = (key: string, options?: any) => {
  const { namespace, normalizedKey } = normalizeTranslationKey(key);
  
  if (namespace) {
    // Use namespace:key format for i18next
    return i18n.t(`${namespace}:${normalizedKey}`, options);
  }
  
  // Use key as-is if no namespace detected
  return i18n.t(key, options);
};

export { loadNamespace, normalizeTranslationKey };
export default i18n;