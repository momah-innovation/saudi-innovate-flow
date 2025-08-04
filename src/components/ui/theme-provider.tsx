import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type ThemeVariant = 'default' | 'modern' | 'minimal' | 'vibrant';
type ColorScheme = 'light' | 'dark' | 'auto';

interface ThemeConfig {
  variant: ThemeVariant;
  colorScheme: ColorScheme;
  primaryColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animations?: boolean;
  compactMode?: boolean;
}

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  applyTheme: () => void;
}

const defaultTheme: ThemeConfig = {
  variant: 'default',
  colorScheme: 'auto',
  borderRadius: 'md',
  animations: true,
  compactMode: false
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    // Load theme from localStorage on initialization
    try {
      const savedTheme = localStorage.getItem('ui-theme');
      if (savedTheme) {
        return { ...defaultTheme, ...JSON.parse(savedTheme) };
      }
    } catch (error) {
      console.error('Error loading saved theme:', error);
    }
    return defaultTheme;
  });

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    const updatedTheme = { ...theme, ...newTheme };
    setThemeState(updatedTheme);
    localStorage.setItem('ui-theme', JSON.stringify(updatedTheme));
  };

  const applyTheme = () => {
    const root = document.documentElement;
    
    // Apply color scheme (dark/light mode)
    root.classList.remove('light', 'dark');
    if (theme.colorScheme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme.colorScheme);
    }
    
    // Remove any theme variant classes
    
    // Apply border radius
    root.classList.remove('radius-none', 'radius-sm', 'radius-md', 'radius-lg', 'radius-xl');
    root.classList.add(`radius-${theme.borderRadius}`);
    
    // Apply compact mode
    if (theme.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // Apply animations
    if (!theme.animations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }

    // Apply custom primary color if provided
    if (theme.primaryColor) {
      root.style.setProperty('--primary', theme.primaryColor);
    }
  };

  // Apply theme on mount and when theme changes
  React.useEffect(() => {
    applyTheme();
  }, [theme]);

  // Listen for system color scheme changes when in auto mode
  React.useEffect(() => {
    if (theme.colorScheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme.colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme presets
export const themePresets = {
  default: {
    variant: 'default' as ThemeVariant,
    primaryColor: 'hsl(222.2 84% 4.9%)',
    borderRadius: 'md' as const
  },
  modern: {
    variant: 'modern' as ThemeVariant,
    primaryColor: 'hsl(262.1 83.3% 57.8%)',
    borderRadius: 'lg' as const
  },
  minimal: {
    variant: 'minimal' as ThemeVariant,
    primaryColor: 'hsl(0 0% 9%)',
    borderRadius: 'sm' as const
  },
  vibrant: {
    variant: 'vibrant' as ThemeVariant,
    primaryColor: 'hsl(346.8 77.2% 49.8%)',
    borderRadius: 'xl' as const
  }
};