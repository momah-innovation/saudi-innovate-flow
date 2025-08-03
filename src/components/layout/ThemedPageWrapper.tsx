import React, { ReactNode, useEffect } from 'react';
import { useThemeSystem } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemedPageWrapperProps {
  children: ReactNode;
  pageType: 'dashboard' | 'challenges' | 'ideas' | 'experts' | 'partners' | 'team-workspace' | 'admin';
  className?: string;
}

export function ThemedPageWrapper({ children, pageType, className }: ThemedPageWrapperProps) {
  const { currentTheme, setTheme, availableThemes } = useThemeSystem();

  // Map page types to preferred themes
  const getPreferredTheme = (page: string) => {
    const themeMap = {
      'dashboard': 'dashboards',
      'challenges': 'challenges', 
      'ideas': 'innovation',
      'experts': 'expert',
      'partners': 'partner',
      'team-workspace': 'collaboration',
      'admin': 'stakeholder'
    };
    return themeMap[page as keyof typeof themeMap] || 'default';
  };

  // Auto-apply theme when entering this page section
  useEffect(() => {
    const preferredThemeId = getPreferredTheme(pageType);
    const preferredTheme = availableThemes.find(t => t.id === preferredThemeId);
    
    if (preferredTheme && currentTheme.id !== preferredThemeId) {
      setTheme(preferredThemeId);
    }
  }, [pageType, setTheme, availableThemes, currentTheme.id]);

  // Apply page-specific CSS classes based on current theme
  const getPageThemeClasses = () => {
    const baseClasses = `themed-page themed-page-${pageType}`;
    const themeClasses = `theme-${currentTheme.id}`;
    return `${baseClasses} ${themeClasses}`;
  };

  return (
    <div className={cn(getPageThemeClasses(), className)}>
      {children}
    </div>
  );
}