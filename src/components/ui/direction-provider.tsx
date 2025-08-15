import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Direction = 'ltr' | 'rtl';
type Language = 'ar' | 'en';  // Arabic first

interface DirectionConfig {
  direction: Direction;
  language: Language;
  autoDetect: boolean;
}

interface DirectionContextType {
  direction: Direction;
  language: Language;
  isRTL: boolean;
  setDirection: (direction: Direction) => void;
  setLanguage: (language: Language) => void;
  toggleDirection: () => void;
}

const defaultConfig: DirectionConfig = {
  direction: 'rtl',  // Arabic as default
  language: 'ar',    // Arabic as default
  autoDetect: true
};

import { useSettingsManager } from '@/hooks/useSettingsManager';

const RTL_LANGUAGES: Language[] = ['ar'];

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export function DirectionProvider({ children }: { children: ReactNode }) {
  // Use direct i18next hook to avoid the circular dependency issue
  const { i18n } = useTranslation();
  const [direction, setDirectionState] = useState<Direction>(defaultConfig.direction);
  const [language, setLanguageState] = useState<Language>(defaultConfig.language);

  const setDirection = (newDirection: Direction) => {
    setDirectionState(newDirection);
    document.documentElement.dir = newDirection;
    document.documentElement.className = document.documentElement.className.replace(/\b(ltr|rtl)\b/g, '');
    document.documentElement.classList.add(newDirection);
    localStorage.setItem('ui-direction', newDirection);
  };

  const setLanguage = (newLanguage: Language) => {
    // Setting language preference
    setLanguageState(newLanguage);
    const newDirection = RTL_LANGUAGES.includes(newLanguage) ? 'rtl' : 'ltr';
    setDirection(newDirection);
    document.documentElement.lang = newLanguage;
    
    // Save to both localStorage keys for full compatibility
    localStorage.setItem('ui-language', newLanguage);
    localStorage.setItem('i18nextLng', newLanguage);
    
    // CRITICAL: Sync with react-i18next using the exact language code
    i18n.changeLanguage(newLanguage).then(() => {
      // Language changed successfully
    });
  };

  const toggleDirection = () => {
    setDirection(direction === 'ltr' ? 'rtl' : 'ltr');
  };

  useEffect(() => {
    // Initialize from localStorage, prioritizing i18next key
    const i18nextLng = localStorage.getItem('i18nextLng') as Language;
    const savedLanguage = localStorage.getItem('ui-language') as Language;
    const savedDirection = localStorage.getItem('ui-direction') as Direction;
    
    // Determine initial language - only support Arabic and English
    const initialLanguage = i18nextLng || savedLanguage;
    
    if (savedDirection) {
      setDirection(savedDirection);
    }
    
    if (initialLanguage && (initialLanguage === 'ar' || initialLanguage === 'en')) {
      setLanguageState(initialLanguage);
      document.documentElement.lang = initialLanguage;
      // Auto-detect direction based on language
      const autoDirection = initialLanguage === 'ar' ? 'rtl' : 'ltr';
      setDirection(autoDirection);
      // Ensure both localStorage keys are in sync
      localStorage.setItem('ui-language', initialLanguage);
      localStorage.setItem('i18nextLng', initialLanguage);
    } else if (defaultConfig.autoDetect) {
      // Auto-detect from browser, but only support Arabic/English
      const browserLang = navigator.language.split('-')[0] as Language;
      const supportedLang = browserLang === 'en' ? 'en' : 'ar'; // Default to Arabic for unsupported languages
      setLanguage(supportedLang);
    }
    
    // Apply global direction classes
    document.documentElement.dir = direction;
    document.documentElement.classList.remove('ltr', 'rtl');
    document.documentElement.classList.add(direction);
    
    // Apply language classes for font handling
    document.documentElement.classList.remove('lang-ar', 'lang-en');
    document.documentElement.classList.add(`lang-${language}`);
    
    // Save direction to localStorage for persistence
    localStorage.setItem('ui-direction', direction);
  }, [direction, language]); // Added dependencies!

  return (
    <DirectionContext.Provider 
      value={{ 
        direction, 
        language, 
        isRTL: direction === 'rtl',
        setDirection, 
        setLanguage, 
        toggleDirection 
      }}
    >
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
}

// Direction-aware utility functions
export const directionUtils = {
  // Margin utilities
  ml: (isRTL: boolean) => isRTL ? 'mr' : 'ml',
  mr: (isRTL: boolean) => isRTL ? 'ml' : 'mr',
  
  // Padding utilities  
  pl: (isRTL: boolean) => isRTL ? 'pr' : 'pl',
  pr: (isRTL: boolean) => isRTL ? 'pl' : 'pr',
  
  // Position utilities
  left: (isRTL: boolean) => isRTL ? 'right' : 'left',
  right: (isRTL: boolean) => isRTL ? 'left' : 'right',
  
  // Text alignment
  textLeft: (isRTL: boolean) => isRTL ? 'text-right' : 'text-left',
  textRight: (isRTL: boolean) => isRTL ? 'text-left' : 'text-right',
  
  // Flex direction
  flexRow: (isRTL: boolean) => isRTL ? 'flex-row-reverse' : 'flex-row',
  
  // Border radius
  roundedL: (isRTL: boolean) => isRTL ? 'rounded-r' : 'rounded-l',
  roundedR: (isRTL: boolean) => isRTL ? 'rounded-l' : 'rounded-r',
};