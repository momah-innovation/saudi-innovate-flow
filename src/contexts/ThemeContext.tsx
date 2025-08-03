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
    
    // Apply CSS variables from theme config
    Object.entries(theme.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Apply additional theme-specific variables for comprehensive coverage
    root.style.setProperty('--primary', theme.cssVariables['--primary'] || theme.colors.primary.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--secondary', theme.cssVariables['--secondary'] || theme.colors.secondary.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--accent', theme.cssVariables['--accent'] || theme.colors.accent.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--muted', theme.cssVariables['--muted'] || theme.colors.muted.replace('hsl(', '').replace(')', ''));
    
    // Apply semantic color variables
    root.style.setProperty('--success', theme.colors.success.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--warning', theme.colors.warning.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--destructive', theme.colors.destructive.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--innovation', theme.colors.innovation.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--expert', theme.colors.expert.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--partner', theme.colors.partner.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--innovator', theme.colors.innovator.replace('hsl(', '').replace(')', ''));
    
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