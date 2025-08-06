import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import modular translation files
import enCommon from './locales/modules/en/ui.json';
import enSettings from './locales/modules/en/settings.json';
import enForms from './locales/modules/en/forms.json';
import enAdmin from './locales/modules/en/admin.json';
import enCampaign from './locales/modules/en/campaign.json';
import enChallenges from './locales/modules/en/challenges.json';
import enEvents from './locales/modules/en/events.json';
import enPartners from './locales/modules/en/partners.json';
import enTags from './locales/modules/en/tags.json';
import enSectors from './locales/modules/en/sectors.json';
import enNavigation from './locales/modules/en/navigation.json';
import enNotifications from './locales/modules/en/notifications.json';
import enErrors from './locales/modules/en/errors.json';
import enSuccess from './locales/modules/en/success.json';
import enGeneral from './locales/modules/en/general.json';

import arCommon from './locales/modules/ar/ui.json';
import arSettings from './locales/modules/ar/settings.json';
import arForms from './locales/modules/ar/forms.json';
import arAdmin from './locales/modules/ar/admin.json';
import arCampaign from './locales/modules/ar/campaign.json';
import arChallenges from './locales/modules/ar/challenges.json';
import arEvents from './locales/modules/ar/events.json';
import arPartners from './locales/modules/ar/partners.json';
import arTags from './locales/modules/ar/tags.json';
import arSectors from './locales/modules/ar/sectors.json';
import arNavigation from './locales/modules/ar/navigation.json';
import arNotifications from './locales/modules/ar/notifications.json';
import arErrors from './locales/modules/ar/errors.json';
import arSuccess from './locales/modules/ar/success.json';
import arGeneral from './locales/modules/ar/general.json';

// Combine all modules into namespaced resources
const resources = {
  en: {
    ui: enCommon,
    settings: enSettings,
    forms: enForms,
    admin: enAdmin,
    campaign: enCampaign,
    challenges: enChallenges,
    events: enEvents,
    partners: enPartners,
    tags: enTags,
    sectors: enSectors,
    navigation: enNavigation,
    notifications: enNotifications,
    errors: enErrors,
    success: enSuccess,
    general: enGeneral,
    // Main translation namespace (flattened for backward compatibility)
    translation: {
      ...enCommon,
      ...enSettings,
      ...enForms,
      ...enAdmin,
      ...enCampaign,
      ...enChallenges,
      ...enEvents,
      ...enPartners,
      ...enTags,
      ...enSectors,
      ...enNavigation,
      ...enNotifications,
      ...enErrors,
      ...enSuccess,
      ...enGeneral
    }
  },
  ar: {
    ui: arCommon,
    settings: arSettings,
    forms: arForms,
    admin: arAdmin,
    campaign: arCampaign,
    challenges: arChallenges,
    events: arEvents,
    partners: arPartners,
    tags: arTags,
    sectors: arSectors,
    navigation: arNavigation,
    notifications: arNotifications,
    errors: arErrors,
    success: arSuccess,
    general: arGeneral,
    // Main translation namespace (flattened for backward compatibility)
    translation: {
      ...arCommon,
      ...arSettings,
      ...arForms,
      ...arAdmin,
      ...arCampaign,
      ...arChallenges,
      ...arEvents,
      ...arPartners,
      ...arTags,
      ...arSectors,
      ...arNavigation,
      ...arNotifications,
      ...arErrors,
      ...arSuccess,
      ...arGeneral
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    lng: 'en',
    supportedLngs: ['en', 'ar'],
    nonExplicitSupportedLngs: true,
    
    // Default namespace
    defaultNS: 'translation',
    
    // Namespace separator
    nsSeparator: ':',
    
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
    }
  });

export default i18n;

// Utility functions for using namespaced translations
export const useNamespacedTranslation = (namespace: string) => {
  return {
    t: (key: string, options?: any) => i18n.t(`${namespace}:${key}`, options),
    language: i18n.language,
    isRTL: i18n.language === 'ar'
  };
};