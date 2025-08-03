import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeConfig, themes, getThemeById } from '@/config/themes';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (themeId: string) => void;
  availableThemes: ThemeConfig[];
  applyTheme: (theme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'default' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(
    getThemeById(defaultTheme) || themes[0]
  );

  const applyTheme = (theme: ThemeConfig) => {
    const root = document.documentElement;
    
    // Apply CSS variables
    Object.entries(theme.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Apply additional theme-specific variables
    root.style.setProperty('--primary', theme.cssVariables['--primary']);
    root.style.setProperty('--secondary', theme.cssVariables['--secondary']);
    root.style.setProperty('--accent', theme.cssVariables['--accent']);
    root.style.setProperty('--muted', theme.cssVariables['--muted']);
    
    // Add theme class to body for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme.id}`);
    
    // Store theme preference
    localStorage.setItem('preferred-theme', theme.id);
  };

  const setTheme = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
      const theme = getThemeById(savedTheme);
      if (theme) {
        setCurrentTheme(theme);
        applyTheme(theme);
        return;
      }
    }
    
    // Apply default theme
    applyTheme(currentTheme);
  }, []);

  // Apply theme when currentTheme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes: themes,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeSystem = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeSystem must be used within a ThemeProvider');
  }
  return context;
};