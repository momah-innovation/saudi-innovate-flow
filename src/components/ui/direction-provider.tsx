import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

type Direction = 'ltr' | 'rtl';
type Language = 'en' | 'ar';

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
  direction: 'ltr',
  language: 'en',
  autoDetect: true
};

const RTL_LANGUAGES: Language[] = ['ar'];

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export function DirectionProvider({ children }: { children: ReactNode }) {
  const [direction, setDirectionState] = useState<Direction>(defaultConfig.direction);
  const [language, setLanguageState] = useState<Language>(defaultConfig.language);

  const setDirection = (newDirection: Direction) => {
    setDirectionState(newDirection);
    document.documentElement.dir = newDirection;
    document.documentElement.classList.toggle('rtl', newDirection === 'rtl');
    localStorage.setItem('ui-direction', newDirection);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    const newDirection = RTL_LANGUAGES.includes(newLanguage) ? 'rtl' : 'ltr';
    setDirection(newDirection);
    document.documentElement.lang = newLanguage;
    localStorage.setItem('ui-language', newLanguage);
  };

  const toggleDirection = () => {
    setDirection(direction === 'ltr' ? 'rtl' : 'ltr');
  };

  useEffect(() => {
    const savedDirection = localStorage.getItem('ui-direction') as Direction;
    const savedLanguage = localStorage.getItem('ui-language') as Language;
    
    if (savedDirection) {
      setDirection(savedDirection);
    }
    
    if (savedLanguage) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
    } else if (defaultConfig.autoDetect) {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (RTL_LANGUAGES.includes(browserLang)) {
        setLanguage(browserLang);
      }
    }
  }, []);

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