# Translation Services Documentation

## 🎯 Overview

Comprehensive documentation for internationalization (i18n), localization, and translation management services in the Enterprise Management System, supporting Arabic and English languages.

## 🏗️ Translation Architecture

### Multi-Layer Internationalization System
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                     │
├─────────────────────────────────────────────────────────────┤
│                 React i18n Layer                           │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │   useTranslation│  │   Language    │  │   Namespace      │ │
│  │   Hook        │  │   Context     │  │   Management     │ │
│  └───────────────┘  └───────────────┘  └──────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                 i18next Core                               │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │   Resource    │  │   Interpolation│  │   Pluralization │ │
│  │   Loading     │  │   & Formatting │  │   Rules          │ │
│  └───────────────┘  └───────────────┘  └──────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                Language Resources                          │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │   Arabic      │  │   English     │  │   Dynamic        │ │
│  │   (ar)        │  │   (en)        │  │   Loading        │ │
│  └───────────────┘  └───────────────┘  └──────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                 RTL/LTR Support                            │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │   CSS         │  │   Layout      │  │   Text Direction │ │
│  │   Direction   │  │   Mirroring   │  │   Detection      │ │
│  └───────────────┘  └───────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🌐 Core Translation Service

### i18n Configuration
**Location**: `src/i18n/config.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';
import enAuth from './locales/en/auth.json';
import arAuth from './locales/ar/auth.json';
import enDashboard from './locales/en/dashboard.json';
import arDashboard from './locales/ar/dashboard.json';
import enChallenges from './locales/en/challenges.json';
import arChallenges from './locales/ar/challenges.json';
import enErrors from './locales/en/errors.json';
import arErrors from './locales/ar/errors.json';

// Resource configuration
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    challenges: enChallenges,
    errors: enErrors
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    dashboard: arDashboard,
    challenges: arChallenges,
    errors: arErrors
  }
};

// i18n configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    
    // Default language
    lng: 'ar',
    fallbackLng: 'ar',
    
    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard', 'challenges', 'errors'],
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
      checkWhitelist: true
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
      formatSeparator: ',',
      format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: lng === 'ar' ? 'SAR' : 'USD'
          }).format(value);
        }
        if (format === 'date') {
          return new Intl.DateTimeFormat(lng, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(new Date(value));
        }
        return value;
      }
    },
    
    // Pluralization rules
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Development options
    debug: process.env.NODE_ENV === 'development',
    
    // React options
    react: {
      useSuspense: false,
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p']
    },
    
    // Arabic-specific options
    postProcess: ['interval'],
    keySeparator: '.',
    nsSeparator: ':',
    
    // Load missing translations
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`Missing translation: ${lng}.${ns}.${key}`);
    }
  });

export default i18n;
```

### Advanced Translation Hook
**Location**: `src/hooks/useAdvancedTranslation.ts`

```typescript
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { TOptions } from 'i18next';

interface TranslationOptions extends TOptions {
  formatters?: Record<string, (value: any) => string>;
  context?: string;
  gender?: 'male' | 'female';
  returnObjects?: boolean;
}

interface AdvancedTranslationHook {
  t: (key: string, options?: TranslationOptions) => string;
  tArray: (key: string, options?: TranslationOptions) => string[];
  tObject: (key: string, options?: TranslationOptions) => Record<string, string>;
  language: string;
  isRTL: boolean;
  changeLanguage: (lng: string) => Promise<void>;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string, format?: 'short' | 'long' | 'relative') => string;
  formatNumber: (number: number) => string;
  pluralize: (key: string, count: number, options?: TranslationOptions) => string;
  hasTranslation: (key: string, ns?: string) => boolean;
  getNamespaceKeys: (ns: string) => string[];
}

export const useAdvancedTranslation = (namespace?: string): AdvancedTranslationHook => {
  const { t: i18nT, i18n, ready } = useTranslation(namespace);

  const language = i18n.language;
  const isRTL = language === 'ar';

  // Enhanced translation function
  const t = useCallback((key: string, options: TranslationOptions = {}): string => {
    if (!ready) return key;

    const { formatters, ...i18nOptions } = options;
    
    let translation = i18nT(key, i18nOptions);
    
    // Apply custom formatters
    if (formatters && typeof translation === 'string') {
      Object.entries(formatters).forEach(([placeholder, formatter]) => {
        const regex = new RegExp(`{{${placeholder}}}`, 'g');
        translation = translation.replace(regex, formatter(options[placeholder]));
      });
    }
    
    return translation;
  }, [i18nT, ready]);

  // Get translation as array
  const tArray = useCallback((key: string, options: TranslationOptions = {}): string[] => {
    const result = i18nT(key, { ...options, returnObjects: true });
    return Array.isArray(result) ? result : [result as string];
  }, [i18nT]);

  // Get translation as object
  const tObject = useCallback((key: string, options: TranslationOptions = {}): Record<string, string> => {
    const result = i18nT(key, { ...options, returnObjects: true });
    return typeof result === 'object' && !Array.isArray(result) ? result : {};
  }, [i18nT]);

  // Change language with RTL support
  const changeLanguage = useCallback(async (lng: string) => {
    await i18n.changeLanguage(lng);
    
    // Update document direction
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    
    // Update HTML classes for styling
    document.documentElement.classList.toggle('rtl', lng === 'ar');
    document.documentElement.classList.toggle('ltr', lng !== 'ar');
  }, [i18n]);

  // Format currency based on language
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: isRTL ? 'SAR' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }, [language, isRTL]);

  // Format date based on language and locale
  const formatDate = useCallback((
    date: Date | string, 
    format: 'short' | 'long' | 'relative' = 'short'
  ): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (format === 'relative') {
      const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
      const diffTime = dateObj.getTime() - Date.now();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (Math.abs(diffDays) < 1) {
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        return rtf.format(diffHours, 'hour');
      }
      
      return rtf.format(diffDays, 'day');
    }
    
    const formatOptions: Intl.DateTimeFormatOptions = format === 'long' 
      ? { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      : { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        };
    
    return new Intl.DateTimeFormat(language, formatOptions).format(dateObj);
  }, [language]);

  // Format numbers based on locale
  const formatNumber = useCallback((number: number): string => {
    return new Intl.NumberFormat(language).format(number);
  }, [language]);

  // Pluralization with count
  const pluralize = useCallback((
    key: string, 
    count: number, 
    options: TranslationOptions = {}
  ): string => {
    return t(key, { ...options, count });
  }, [t]);

  // Check if translation exists
  const hasTranslation = useCallback((key: string, ns?: string): boolean => {
    return i18n.exists(key, { ns });
  }, [i18n]);

  // Get all keys in a namespace
  const getNamespaceKeys = useCallback((ns: string): string[] => {
    const store = i18n.getResourceBundle(language, ns);
    return store ? Object.keys(store) : [];
  }, [i18n, language]);

  return {
    t,
    tArray,
    tObject,
    language,
    isRTL,
    changeLanguage,
    formatCurrency,
    formatDate,
    formatNumber,
    pluralize,
    hasTranslation,
    getNamespaceKeys
  };
};
```

## 🔄 Dynamic Translation Loading

### Translation Manager Hook
**Location**: `src/hooks/useTranslationManager.ts`

```typescript
interface TranslationResource {
  [key: string]: string | TranslationResource;
}

interface NamespaceInfo {
  name: string;
  loaded: boolean;
  loading: boolean;
  lastUpdated: Date | null;
  keys: number;
}

export const useTranslationManager = () => {
  const { i18n } = useTranslation();
  const [namespaces, setNamespaces] = useState<NamespaceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load translation namespace dynamically
  const loadNamespace = useCallback(async (
    namespace: string,
    language?: string
  ): Promise<void> => {
    const lng = language || i18n.language;
    
    setIsLoading(true);
    setNamespaces(prev => prev.map(ns => 
      ns.name === namespace ? { ...ns, loading: true } : ns
    ));

    try {
      // Dynamic import based on namespace and language
      const module = await import(`../i18n/locales/${lng}/${namespace}.json`);
      const resources = module.default;

      // Add resources to i18n
      i18n.addResourceBundle(lng, namespace, resources, true, true);

      // Update namespace info
      setNamespaces(prev => {
        const existing = prev.find(ns => ns.name === namespace);
        const updated: NamespaceInfo = {
          name: namespace,
          loaded: true,
          loading: false,
          lastUpdated: new Date(),
          keys: countKeys(resources)
        };

        return existing 
          ? prev.map(ns => ns.name === namespace ? updated : ns)
          : [...prev, updated];
      });

    } catch (error) {
      console.error(`Failed to load namespace ${namespace}:`, error);
      
      setNamespaces(prev => prev.map(ns => 
        ns.name === namespace ? { ...ns, loading: false } : ns
      ));
    } finally {
      setIsLoading(false);
    }
  }, [i18n]);

  // Preload multiple namespaces
  const preloadNamespaces = useCallback(async (
    namespaceList: string[],
    language?: string
  ): Promise<void> => {
    const loadPromises = namespaceList.map(ns => loadNamespace(ns, language));
    await Promise.allSettled(loadPromises);
  }, [loadNamespace]);

  // Update existing translation
  const updateTranslation = useCallback((
    namespace: string,
    key: string,
    value: string,
    language?: string
  ) => {
    const lng = language || i18n.language;
    
    // Get current resources
    const resources = i18n.getResourceBundle(lng, namespace) || {};
    
    // Update the specific key
    const updatedResources = setNestedKey(resources, key, value);
    
    // Add updated resources back to i18n
    i18n.addResourceBundle(lng, namespace, updatedResources, true, true);
    
    // Update namespace info
    setNamespaces(prev => prev.map(ns => 
      ns.name === namespace 
        ? { ...ns, lastUpdated: new Date(), keys: countKeys(updatedResources) }
        : ns
    ));
  }, [i18n]);

  // Batch update translations
  const batchUpdateTranslations = useCallback((
    updates: { namespace: string; key: string; value: string; language?: string }[]
  ) => {
    const groupedUpdates = updates.reduce((acc, update) => {
      const lng = update.language || i18n.language;
      const key = `${lng}-${update.namespace}`;
      
      if (!acc[key]) {
        acc[key] = { language: lng, namespace: update.namespace, updates: [] };
      }
      
      acc[key].updates.push({ key: update.key, value: update.value });
      return acc;
    }, {} as Record<string, { language: string; namespace: string; updates: { key: string; value: string }[] }>);

    Object.values(groupedUpdates).forEach(({ language, namespace, updates: nsUpdates }) => {
      const resources = i18n.getResourceBundle(language, namespace) || {};
      
      let updatedResources = { ...resources };
      nsUpdates.forEach(({ key, value }) => {
        updatedResources = setNestedKey(updatedResources, key, value);
      });
      
      i18n.addResourceBundle(language, namespace, updatedResources, true, true);
      
      setNamespaces(prev => prev.map(ns => 
        ns.name === namespace 
          ? { ...ns, lastUpdated: new Date(), keys: countKeys(updatedResources) }
          : ns
      ));
    });
  }, [i18n]);

  // Export translations for backup/sharing
  const exportTranslations = useCallback((
    namespace?: string,
    language?: string
  ): Record<string, any> => {
    const lng = language || i18n.language;
    
    if (namespace) {
      return i18n.getResourceBundle(lng, namespace) || {};
    }
    
    // Export all namespaces
    const allResources: Record<string, any> = {};
    namespaces.forEach(ns => {
      const resources = i18n.getResourceBundle(lng, ns.name);
      if (resources) {
        allResources[ns.name] = resources;
      }
    });
    
    return allResources;
  }, [i18n, namespaces]);

  // Import translations from external source
  const importTranslations = useCallback(async (
    data: Record<string, Record<string, any>>,
    language?: string
  ) => {
    const lng = language || i18n.language;
    
    for (const [namespace, resources] of Object.entries(data)) {
      i18n.addResourceBundle(lng, namespace, resources, true, true);
      
      setNamespaces(prev => {
        const existing = prev.find(ns => ns.name === namespace);
        const updated: NamespaceInfo = {
          name: namespace,
          loaded: true,
          loading: false,
          lastUpdated: new Date(),
          keys: countKeys(resources)
        };

        return existing 
          ? prev.map(ns => ns.name === namespace ? updated : ns)
          : [...prev, updated];
      });
    }
  }, [i18n]);

  // Helper function to count keys recursively
  const countKeys = (obj: any, count = 0): number => {
    if (typeof obj === 'string') return count + 1;
    
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).reduce((acc, val) => countKeys(val, acc), count);
    }
    
    return count;
  };

  // Helper function to set nested key
  const setNestedKey = (obj: any, path: string, value: string): any => {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  };

  return {
    namespaces,
    isLoading,
    loadNamespace,
    preloadNamespaces,
    updateTranslation,
    batchUpdateTranslations,
    exportTranslations,
    importTranslations
  };
};
```

## 🎨 RTL/LTR Layout Support

### Direction Management Hook
**Location**: `src/hooks/useDirection.ts`

```typescript
interface DirectionConfig {
  autoDetect?: boolean;
  persistDirection?: boolean;
  className?: string;
}

interface DirectionUtils {
  direction: 'rtl' | 'ltr';
  isRTL: boolean;
  isLTR: boolean;
  toggleDirection: () => void;
  setDirection: (dir: 'rtl' | 'ltr') => void;
  getOppositeDirection: () => 'rtl' | 'ltr';
  mirrorClass: (baseClass: string) => string;
  alignClass: (alignment: 'left' | 'right' | 'start' | 'end') => string;
  marginClass: (side: 'left' | 'right' | 'start' | 'end', size: string) => string;
  paddingClass: (side: 'left' | 'right' | 'start' | 'end', size: string) => string;
}

export const useDirection = (config: DirectionConfig = {}): DirectionUtils => {
  const { language } = useAdvancedTranslation();
  const [direction, setDirectionState] = useState<'rtl' | 'ltr'>(() => {
    if (config.autoDetect) {
      return language === 'ar' ? 'rtl' : 'ltr';
    }
    
    if (config.persistDirection) {
      const saved = localStorage.getItem('text-direction') as 'rtl' | 'ltr';
      return saved || (language === 'ar' ? 'rtl' : 'ltr');
    }
    
    return language === 'ar' ? 'rtl' : 'ltr';
  });

  // Update direction when language changes
  useEffect(() => {
    if (config.autoDetect) {
      const newDirection = language === 'ar' ? 'rtl' : 'ltr';
      setDirectionState(newDirection);
    }
  }, [language, config.autoDetect]);

  // Apply direction to document
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.setAttribute('data-direction', direction);
    
    if (config.className) {
      document.documentElement.classList.remove(`${config.className}-rtl`, `${config.className}-ltr`);
      document.documentElement.classList.add(`${config.className}-${direction}`);
    }
    
    if (config.persistDirection) {
      localStorage.setItem('text-direction', direction);
    }
  }, [direction, config.className, config.persistDirection]);

  const isRTL = direction === 'rtl';
  const isLTR = direction === 'ltr';

  const toggleDirection = useCallback(() => {
    setDirectionState(prev => prev === 'rtl' ? 'ltr' : 'rtl');
  }, []);

  const setDirection = useCallback((dir: 'rtl' | 'ltr') => {
    setDirectionState(dir);
  }, []);

  const getOppositeDirection = useCallback(() => {
    return direction === 'rtl' ? 'ltr' : 'rtl';
  }, [direction]);

  // Generate mirrored class names for RTL support
  const mirrorClass = useCallback((baseClass: string): string => {
    if (!isRTL) return baseClass;
    
    // Common class transformations for RTL
    const rtlTransforms: Record<string, string> = {
      'text-left': 'text-right',
      'text-right': 'text-left',
      'ml-': 'mr-',
      'mr-': 'ml-',
      'pl-': 'pr-',
      'pr-': 'pl-',
      'left-': 'right-',
      'right-': 'left-',
      'rounded-l': 'rounded-r',
      'rounded-r': 'rounded-l',
      'border-l': 'border-r',
      'border-r': 'border-l'
    };

    let transformedClass = baseClass;
    
    Object.entries(rtlTransforms).forEach(([ltr, rtl]) => {
      if (baseClass.includes(ltr)) {
        transformedClass = baseClass.replace(ltr, rtl);
      }
    });

    return transformedClass;
  }, [isRTL]);

  // Generate alignment classes
  const alignClass = useCallback((alignment: 'left' | 'right' | 'start' | 'end'): string => {
    if (alignment === 'start') {
      return isRTL ? 'text-right' : 'text-left';
    }
    if (alignment === 'end') {
      return isRTL ? 'text-left' : 'text-right';
    }
    return `text-${alignment}`;
  }, [isRTL]);

  // Generate margin classes with RTL support
  const marginClass = useCallback((side: 'left' | 'right' | 'start' | 'end', size: string): string => {
    if (side === 'start') {
      return isRTL ? `mr-${size}` : `ml-${size}`;
    }
    if (side === 'end') {
      return isRTL ? `ml-${size}` : `mr-${size}`;
    }
    return `m${side.charAt(0)}-${size}`;
  }, [isRTL]);

  // Generate padding classes with RTL support
  const paddingClass = useCallback((side: 'left' | 'right' | 'start' | 'end', size: string): string => {
    if (side === 'start') {
      return isRTL ? `pr-${size}` : `pl-${size}`;
    }
    if (side === 'end') {
      return isRTL ? `pl-${size}` : `pr-${size}`;
    }
    return `p${side.charAt(0)}-${size}`;
  }, [isRTL]);

  return {
    direction,
    isRTL,
    isLTR,
    toggleDirection,
    setDirection,
    getOppositeDirection,
    mirrorClass,
    alignClass,
    marginClass,
    paddingClass
  };
};
```

## 📝 Translation Components

### Translation Provider Component
**Location**: `src/components/translation/TranslationProvider.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdvancedTranslation } from '@/hooks/useAdvancedTranslation';
import { useDirection } from '@/hooks/useDirection';

interface TranslationContextValue {
  language: string;
  setLanguage: (lang: string) => void;
  direction: 'rtl' | 'ltr';
  isRTL: boolean;
  t: (key: string, options?: any) => string;
  formatDate: (date: Date, format?: string) => string;
  formatCurrency: (amount: number) => string;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

interface TranslationProviderProps {
  children: React.ReactNode;
  defaultLanguage?: string;
  persistLanguage?: boolean;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  defaultLanguage = 'ar',
  persistLanguage = true
}) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    if (persistLanguage && typeof window !== 'undefined') {
      return localStorage.getItem('language') || defaultLanguage;
    }
    return defaultLanguage;
  });

  const { 
    t, 
    language, 
    changeLanguage, 
    formatDate, 
    formatCurrency 
  } = useAdvancedTranslation();

  const { direction, isRTL } = useDirection({ 
    autoDetect: true, 
    persistDirection: true 
  });

  // Update language
  const setLanguage = async (lang: string) => {
    await changeLanguage(lang);
    setCurrentLanguage(lang);
    
    if (persistLanguage) {
      localStorage.setItem('language', lang);
    }
  };

  // Initialize language on mount
  useEffect(() => {
    if (currentLanguage !== language) {
      changeLanguage(currentLanguage);
    }
  }, [currentLanguage, language, changeLanguage]);

  const contextValue: TranslationContextValue = {
    language: currentLanguage,
    setLanguage,
    direction,
    isRTL,
    t,
    formatDate,
    formatCurrency
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};
```

### Language Switcher Component
```typescript
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useTranslationContext } from './TranslationProvider';

interface LanguageSwitcherProps {
  showLabel?: boolean;
  variant?: 'default' | 'minimal' | 'flag';
  size?: 'sm' | 'md' | 'lg';
}

const languages = [
  { code: 'ar', name: 'العربية', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' }
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  showLabel = true,
  variant = 'default',
  size = 'md'
}) => {
  const { language, setLanguage, t, isRTL } = useTranslationContext();

  const currentLanguage = languages.find(lang => lang.code === language);
  
  const handleLanguageChange = async (langCode: string) => {
    await setLanguage(langCode);
  };

  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={() => handleLanguageChange(language === 'ar' ? 'en' : 'ar')}
        className="flex items-center gap-2"
      >
        <Globe className="h-4 w-4" />
        {showLabel && (
          <span>{language === 'ar' ? 'EN' : 'ع'}</span>
        )}
      </Button>
    );
  }

  if (variant === 'flag') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={size} className="flex items-center gap-2">
            <span className="text-lg">{currentLanguage?.flag}</span>
            {showLabel && <span>{currentLanguage?.nativeName}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center gap-3"
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.nativeName}</span>
              {language === lang.code && <Check className="h-4 w-4 mr-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={size} className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {showLabel && <span>{currentLanguage?.nativeName}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between"
          >
            <span>{lang.nativeName}</span>
            {language === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

## 📱 Translation Utilities

### Text Processing Utilities
**Location**: `src/utils/translationUtils.ts`

```typescript
interface TextProcessingOptions {
  language?: string;
  preserveHtml?: boolean;
  trimWhitespace?: boolean;
  normalizeSpaces?: boolean;
}

export const translationUtils = {
  // Sanitize translation key
  sanitizeKey: (key: string): string => {
    return key
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  },

  // Generate translation key from text
  generateKey: (text: string, namespace?: string): string => {
    const sanitized = translationUtils.sanitizeKey(text);
    return namespace ? `${namespace}.${sanitized}` : sanitized;
  },

  // Extract translatable text from HTML
  extractTranslatableText: (html: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const textNodes: string[] = [];

    const walker = document.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const text = node.textContent?.trim();
          return text && text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent?.trim();
      if (text) {
        textNodes.push(text);
      }
    }

    return textNodes;
  },

  // Process text for translation
  processText: (text: string, options: TextProcessingOptions = {}): string => {
    let processed = text;

    if (options.trimWhitespace) {
      processed = processed.trim();
    }

    if (options.normalizeSpaces) {
      processed = processed.replace(/\s+/g, ' ');
    }

    if (options.language === 'ar') {
      // Arabic-specific processing
      processed = translationUtils.normalizeArabicText(processed);
    }

    return processed;
  },

  // Normalize Arabic text
  normalizeArabicText: (text: string): string => {
    return text
      // Normalize Arabic numbers
      .replace(/[٠-٩]/g, (match) => {
        const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
        return (arabicNumerals.indexOf(match)).toString();
      })
      // Normalize spaces around Arabic punctuation
      .replace(/\s*([،؛؟!])\s*/g, '$1 ')
      // Remove unnecessary diacritics for UI text
      .replace(/[ًٌٍَُِّْ]/g, '');
  },

  // Detect text direction
  detectTextDirection: (text: string): 'rtl' | 'ltr' => {
    const rtlChars = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/;
    const ltrChars = /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8]/;

    const rtlCount = (text.match(rtlChars) || []).length;
    const ltrCount = (text.match(ltrChars) || []).length;

    return rtlCount > ltrCount ? 'rtl' : 'ltr';
  },

  // Create interpolation object from array
  createInterpolationObject: (
    keys: string[], 
    values: any[]
  ): Record<string, any> => {
    return keys.reduce((obj, key, index) => {
      obj[key] = values[index];
      return obj;
    }, {} as Record<string, any>);
  },

  // Validate translation completeness
  validateTranslationCompleteness: (
    sourceTranslations: Record<string, any>,
    targetTranslations: Record<string, any>
  ): { missing: string[]; extra: string[] } => {
    const sourceKeys = translationUtils.flattenKeys(sourceTranslations);
    const targetKeys = translationUtils.flattenKeys(targetTranslations);

    const missing = sourceKeys.filter(key => !targetKeys.includes(key));
    const extra = targetKeys.filter(key => !sourceKeys.includes(key));

    return { missing, extra };
  },

  // Flatten nested translation keys
  flattenKeys: (obj: any, prefix = ''): string[] => {
    let keys: string[] = [];

    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(translationUtils.flattenKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    });

    return keys;
  },

  // Get translation statistics
  getTranslationStats: (translations: Record<string, any>) => {
    const keys = translationUtils.flattenKeys(translations);
    const totalKeys = keys.length;
    
    let translatedKeys = 0;
    let emptyKeys = 0;
    let longTranslations = 0;

    keys.forEach(key => {
      const value = translationUtils.getNestedValue(translations, key);
      
      if (typeof value === 'string') {
        if (value.trim()) {
          translatedKeys++;
          if (value.length > 100) {
            longTranslations++;
          }
        } else {
          emptyKeys++;
        }
      }
    });

    return {
      totalKeys,
      translatedKeys,
      emptyKeys,
      completionRate: totalKeys > 0 ? (translatedKeys / totalKeys) * 100 : 0,
      longTranslations
    };
  },

  // Get nested value from object
  getNestedValue: (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
};
```

## 📋 Translation Service Checklist

### Core Features
- ✅ Bi-directional language support (Arabic/English)
- ✅ Dynamic namespace loading
- ✅ RTL/LTR layout management
- ✅ Context-aware translations
- ✅ Pluralization rules
- ✅ Number and date formatting

### Advanced Features
- ✅ Translation management system
- ✅ Batch translation updates
- ✅ Translation completeness validation
- ✅ Direction utilities for styling
- ✅ Text processing utilities
- ✅ Export/import functionality

### UI Components
- ✅ Language switcher component
- ✅ Translation provider context
- ✅ Direction-aware styling
- ✅ Responsive design support

---

*Translation Services: Bi-directional | Dynamic loading | RTL/LTR support | Status: ✅ Production Ready*