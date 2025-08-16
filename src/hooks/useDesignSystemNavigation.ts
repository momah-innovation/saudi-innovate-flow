import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debugLog } from '@/utils/debugLogger';

/**
 * Hook for handling design system demo navigation
 * Replaces anchor tags with proper React Router navigation
 */
export const useDesignSystemNavigation = () => {
  const navigate = useNavigate();

  const handleNavigate = useCallback((path: string, external = false) => {
    if (external) {
      window.open(path, '_blank', 'noopener,noreferrer');
      return;
    }

    // Handle internal navigation
    if (path === '#') {
      debugLog.debug('Design System Navigation', { message: 'Demo link clicked - no actual navigation needed' });
      return;
    }

    // Map demo paths to actual routes
    const routeMap: Record<string, string> = {
      'home': '/dashboard',
      'challenges': '/challenges',
      'technology': '/challenges?category=technology',
      'government': '/challenges?category=government',
      'innovation-hub': '/innovation-hub',
      'forums': '/collaboration/forums',
      'events': '/events',
      'teams': '/collaboration/teams',
      'mentorship': '/mentorship',
      'documentation': '/docs',
      'api-reference': '/docs/api',
      'tutorials': '/docs/tutorials',
      'best-practices': '/docs/best-practices',
      'overview': '#overview',
      'participants': '#participants',
      'submissions': '#submissions',
      'results': '#results'
    };

    const targetRoute = routeMap[path.toLowerCase()] || path;
    
    if (targetRoute.startsWith('#')) {
      // Handle anchor links
      const element = document.getElementById(targetRoute.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(targetRoute);
    }
  }, [navigate]);

  const createNavigationProps = useCallback((path: string, external = false) => ({
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      handleNavigate(path, external);
    },
    className: "text-muted-foreground hover:text-foreground cursor-pointer",
    role: "button",
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNavigate(path, external);
      }
    }
  }), [handleNavigate]);

  const createTabNavigationProps = useCallback((tabId: string, isActive = false) => ({
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      handleNavigate(`#${tabId}`);
    },
    className: `${
      isActive 
        ? "border-b-2 border-primary text-primary py-2 px-1 text-sm font-medium" 
        : "text-muted-foreground hover:text-foreground py-2 px-1 text-sm font-medium"
    } cursor-pointer`,
    role: "tab",
    tabIndex: 0,
    'aria-selected': isActive,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNavigate(`#${tabId}`);
      }
    }
  }), [handleNavigate]);

  return {
    handleNavigate,
    createNavigationProps,
    createTabNavigationProps
  };
};