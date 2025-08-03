import { useThemeSystem } from '@/contexts/ThemeContext';
import { useMemo } from 'react';

export type ComponentType = 
  | 'header' | 'sidebar' | 'card' | 'button' | 'form' 
  | 'table' | 'modal' | 'dashboard-widget' | 'navigation'
  | 'challenge-card' | 'idea-card' | 'expert-profile' | 'partner-card';

export function useComponentTheme(componentType: ComponentType) {
  const { currentTheme } = useThemeSystem();

  const componentTheme = useMemo(() => {
    // Get theme-specific styling for components
    const getComponentVariant = () => {
      switch (currentTheme.id) {
        case 'expert':
          return {
            buttonVariant: componentType === 'button' ? 'outline' : undefined,
            cardVariant: 'elevated',
            headerStyle: 'professional'
          };
        case 'innovation':
          return {
            buttonVariant: componentType === 'button' ? 'default' : undefined,
            cardVariant: 'gradient',
            headerStyle: 'vibrant'
          };
        case 'partner':
          return {
            buttonVariant: componentType === 'button' ? 'secondary' : undefined,
            cardVariant: 'clean',
            headerStyle: 'minimal'
          };
        case 'dashboards':
          return {
            buttonVariant: componentType === 'button' ? 'outline' : undefined,
            cardVariant: 'analytics',
            headerStyle: 'data-focused'
          };
        default:
          return {
            buttonVariant: 'default',
            cardVariant: 'default',
            headerStyle: 'default'
          };
      }
    };

    const variant = getComponentVariant();

    return {
      // CSS classes specific to current theme + component
      className: `themed-${componentType} theme-${currentTheme.id}`,
      
      // Component-specific variants
      ...variant,

      // Theme colors for inline styles if needed
      colors: currentTheme.colors,
      
      // Helper function to get theme-appropriate props
      getThemedProps: (baseProps: any) => ({
        ...baseProps,
        className: `${baseProps.className || ''} themed-${componentType} theme-${currentTheme.id}`.trim(),
      })
    };
  }, [currentTheme, componentType]);

  return componentTheme;
}