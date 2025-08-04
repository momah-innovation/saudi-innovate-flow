import { useEffect } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useThemeSystem } from '@/contexts/ThemeContext';

export const useGlobalRoleTheme = () => {
  const { getPrimaryRole } = useRoleAccess();
  const { setTheme } = useThemeSystem();

  useEffect(() => {
    const primaryRole = getPrimaryRole();
    
    // Apply role-based theme
    switch (primaryRole) {
      case 'super_admin':
      case 'admin':
        setTheme('dark');
        document.documentElement.style.setProperty('--primary', '0 0% 98%'); // Almost white for dark theme
        document.documentElement.style.setProperty('--primary-foreground', '240 10% 3.9%'); // Dark text
        document.documentElement.style.setProperty('--accent', '217 91% 60%'); // Blue accent
        break;
      case 'expert':
        setTheme('light');
        document.documentElement.style.setProperty('--primary', '221 83% 53%'); // Blue
        document.documentElement.style.setProperty('--primary-foreground', '0 0% 98%'); // White text
        document.documentElement.style.setProperty('--accent', '147 64% 61%'); // Green accent
        break;
      case 'partner':
        setTheme('light');
        document.documentElement.style.setProperty('--primary', '262 90% 58%'); // Purple
        document.documentElement.style.setProperty('--primary-foreground', '0 0% 98%'); // White text
        document.documentElement.style.setProperty('--accent', '340 75% 68%'); // Pink accent
        break;
      case 'stakeholder':
        setTheme('light');
        document.documentElement.style.setProperty('--primary', '25 95% 53%'); // Orange
        document.documentElement.style.setProperty('--primary-foreground', '0 0% 98%'); // White text
        document.documentElement.style.setProperty('--accent', '142 71% 45%'); // Green accent
        break;
      case 'team_member':
        setTheme('light');
        document.documentElement.style.setProperty('--primary', '173 58% 39%'); // Teal
        document.documentElement.style.setProperty('--primary-foreground', '0 0% 98%'); // White text
        document.documentElement.style.setProperty('--accent', '198 93% 60%'); // Light blue accent
        break;
      default: // innovator and others
        setTheme('light');
        document.documentElement.style.setProperty('--primary', '142 71% 45%'); // Green - default
        document.documentElement.style.setProperty('--primary-foreground', '0 0% 98%'); // White text
        document.documentElement.style.setProperty('--accent', '221 83% 53%'); // Blue accent
        break;
    }
  }, [getPrimaryRole, setTheme]);

  return { primaryRole: getPrimaryRole() };
};