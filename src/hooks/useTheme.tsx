import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// 🎨 Theme Types
export type GlobalTheme = 'light' | 'dark' | 'high-contrast' | 'print';
export type SpecializedTheme = 
  | 'admin' 
  | 'events' 
  | 'challenges' 
  | 'ideas' 
  | 'evaluation' 
  | 'partners' 
  | 'opportunities' 
  | 'experts'
  | null;

export type ComponentTheme = string | null;

export interface ThemeContextType {
  // Global theme state
  globalTheme: GlobalTheme;
  setGlobalTheme: (theme: GlobalTheme) => void;
  
  // Specialized theme state
  specializedTheme: SpecializedTheme;
  setSpecializedTheme: (theme: SpecializedTheme) => void;
  
  // Component theme state
  componentTheme: ComponentTheme;
  setComponentTheme: (theme: ComponentTheme) => void;
  
  // Theme utilities
  isDark: boolean;
  isHighContrast: boolean;
  currentThemeClasses: string;
  
  // Theme management
  resetToDefaults: () => void;
  applyTheme: (global?: GlobalTheme, specialized?: SpecializedTheme) => void;
  
  // System detection
  systemPrefersDark: boolean;
  respectSystemPreference: boolean;
  setRespectSystemPreference: (respect: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  globalTheme: 'lovable-global-theme',
  specializedTheme: 'lovable-specialized-theme',
  componentTheme: 'lovable-component-theme',
  respectSystemPreference: 'lovable-respect-system-preference',
} as const;

interface ThemeProviderProps {
  children: ReactNode;
  defaultGlobalTheme?: GlobalTheme;
  defaultSpecializedTheme?: SpecializedTheme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultGlobalTheme = 'light',
  defaultSpecializedTheme = null,
  storageKey = 'lovable-theme',
}: ThemeProviderProps) {
  // 🌓 System preference detection
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [respectSystemPreference, setRespectSystemPreference] = useState(true);
  
  // 🎨 Theme state
  const [globalTheme, setGlobalThemeState] = useState<GlobalTheme>(defaultGlobalTheme);
  const [specializedTheme, setSpecializedThemeState] = useState<SpecializedTheme>(defaultSpecializedTheme);
  const [componentTheme, setComponentThemeState] = useState<ComponentTheme>(null);

  // 📱 System preference detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 💾 Load saved preferences
  useEffect(() => {
    try {
      const savedGlobalTheme = localStorage.getItem(STORAGE_KEYS.globalTheme) as GlobalTheme;
      const savedSpecializedTheme = localStorage.getItem(STORAGE_KEYS.specializedTheme) as SpecializedTheme;
      const savedComponentTheme = localStorage.getItem(STORAGE_KEYS.componentTheme);
      const savedRespectSystemPreference = localStorage.getItem(STORAGE_KEYS.respectSystemPreference);

      if (savedGlobalTheme) {
        setGlobalThemeState(savedGlobalTheme);
      }
      if (savedSpecializedTheme) {
        setSpecializedThemeState(savedSpecializedTheme);
      }
      if (savedComponentTheme) {
        setComponentThemeState(savedComponentTheme);
      }
      if (savedRespectSystemPreference !== null) {
        setRespectSystemPreference(savedRespectSystemPreference === 'true');
      }
    } catch (error) {
      console.warn('Failed to load theme preferences:', error);
    }
  }, []);

  // 🔄 Auto-apply system preference
  useEffect(() => {
    if (respectSystemPreference) {
      const newTheme = systemPrefersDark ? 'dark' : 'light';
      if (newTheme !== globalTheme) {
        setGlobalThemeState(newTheme);
      }
    }
  }, [systemPrefersDark, respectSystemPreference, globalTheme]);

  // 💾 Save preferences
  const setGlobalTheme = (theme: GlobalTheme) => {
    setGlobalThemeState(theme);
    localStorage.setItem(STORAGE_KEYS.globalTheme, theme);
    setRespectSystemPreference(false); // Disable auto-switching when manually set
  };

  const setSpecializedTheme = (theme: SpecializedTheme) => {
    setSpecializedThemeState(theme);
    if (theme) {
      localStorage.setItem(STORAGE_KEYS.specializedTheme, theme);
    } else {
      localStorage.removeItem(STORAGE_KEYS.specializedTheme);
    }
  };

  const setComponentTheme = (theme: ComponentTheme) => {
    setComponentThemeState(theme);
    if (theme) {
      localStorage.setItem(STORAGE_KEYS.componentTheme, theme);
    } else {
      localStorage.removeItem(STORAGE_KEYS.componentTheme);
    }
  };

  const setRespectSystemPreferenceAndSave = (respect: boolean) => {
    setRespectSystemPreference(respect);
    localStorage.setItem(STORAGE_KEYS.respectSystemPreference, respect.toString());
  };

  // 🎯 Theme utilities
  const isDark = globalTheme === 'dark';
  const isHighContrast = globalTheme === 'high-contrast';

  // 🏷️ Generate theme classes
  const currentThemeClasses = [
    `theme-${globalTheme}`,
    specializedTheme ? `theme-${specializedTheme}` : '',
    componentTheme ? `theme-component-${componentTheme}` : '',
  ].filter(Boolean).join(' ');

  // 🔄 Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Clear existing theme classes
    root.classList.remove(
      'theme-light', 'theme-dark', 'theme-high-contrast', 'theme-print',
      'theme-admin', 'theme-events', 'theme-challenges', 'theme-ideas',
      'theme-evaluation', 'theme-partners', 'theme-opportunities', 'theme-experts'
    );

    // Apply current theme classes
    root.classList.add(`theme-${globalTheme}`);
    if (specializedTheme) {
      root.classList.add(`theme-${specializedTheme}`);
    }

    // Set data attributes for CSS targeting
    root.setAttribute('data-theme', globalTheme);
    if (specializedTheme) {
      root.setAttribute('data-specialized-theme', specializedTheme);
    } else {
      root.removeAttribute('data-specialized-theme');
    }
  }, [globalTheme, specializedTheme]);

  // 🔧 Theme management functions
  const resetToDefaults = () => {
    setGlobalThemeState(defaultGlobalTheme);
    setSpecializedThemeState(defaultSpecializedTheme);
    setComponentThemeState(null);
    
    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  };

  const applyTheme = (global?: GlobalTheme, specialized?: SpecializedTheme) => {
    if (global) setGlobalTheme(global);
    if (specialized !== undefined) setSpecializedTheme(specialized);
  };

  const value: ThemeContextType = {
    globalTheme,
    setGlobalTheme,
    specializedTheme,
    setSpecializedTheme,
    componentTheme,
    setComponentTheme,
    isDark,
    isHighContrast,
    currentThemeClasses,
    resetToDefaults,
    applyTheme,
    systemPrefersDark,
    respectSystemPreference,
    setRespectSystemPreference: setRespectSystemPreferenceAndSave,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`${currentThemeClasses} theme-transition`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// 🪝 Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 🎨 Theme utility hooks
export function useSpecializedTheme(themeName: SpecializedTheme) {
  const { specializedTheme, setSpecializedTheme } = useTheme();
  
  const isActive = specializedTheme === themeName;
  const activate = () => setSpecializedTheme(themeName);
  const deactivate = () => setSpecializedTheme(null);
  
  return { isActive, activate, deactivate };
}

export function useThemeClasses(baseClasses?: string) {
  const { currentThemeClasses } = useTheme();
  return `${baseClasses || ''} ${currentThemeClasses}`.trim();
}

// 🎯 Component theme helpers
export function getThemeVariant(
  component: string,
  theme: SpecializedTheme,
  variant: string = 'default'
): string {
  if (!theme) return variant;
  return `${component}-theme-${theme}-${variant}`;
}

export function useComponentThemeClass(
  component: string,
  variant: string = 'default'
) {
  const { specializedTheme } = useTheme();
  return getThemeVariant(component, specializedTheme, variant);
}