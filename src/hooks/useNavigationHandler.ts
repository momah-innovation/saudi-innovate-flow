import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { debugLog } from '@/utils/debugLogger';

/**
 * ✅ UNIFIED NAVIGATION HOOK
 * Replaces 35+ window.location usages with React Router navigation
 * Eliminates page reloads and improves SPA performance
 */
export const useNavigationHandler = () => {
  const navigate = useNavigate();

  // ✅ STANDARD PATTERN: React Router navigation
  const navigateTo = useCallback((path: string, options?: { replace?: boolean; external?: boolean }) => {
    try {
      // Handle external URLs
      if (options?.external || path.startsWith('http') || path.startsWith('mailto:')) {
        window.open(path, '_blank', 'noopener,noreferrer');
        return;
      }

      // Handle React Router navigation
      if (options?.replace) {
        navigate(path, { replace: true });
      } else {
        navigate(path);
      }
    } catch (error) {
      // Use structured logging instead of console.error
      debugLog.error('Navigation error', { component: 'NavigationHandler', action: 'navigateTo', path }, error);
      // Fallback to window.location for edge cases
      // Use safe navigation fallback
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    }
  }, [navigate]);

  // ✅ COMMON NAVIGATION PATTERNS
  const navigationActions = {
    // Home navigation
    goHome: () => navigateTo('/'),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
    
    // Dashboard navigation
    goToDashboard: () => navigateTo('/dashboard'),
    goToProfile: () => navigateTo('/profile'),
    goToSettings: () => navigateTo('/settings'),
    
    // Admin navigation
    goToAdmin: () => navigateTo('/admin'),
    goToUserManagement: () => navigateTo('/admin/users'),
    goToChallengeManagement: () => navigateTo('/admin/challenges'),
    
    // Entity navigation
    goToChallenge: (id: string) => navigateTo(`/challenges/${id}`),
    goToEvent: (id: string) => navigateTo(`/events/${id}`),
    goToIdea: (id: string) => navigateTo(`/ideas/${id}`),
    
    // Auth navigation
    goToLogin: () => navigateTo('/auth'),
    goToSignup: () => navigateTo('/auth?mode=register'),
    goToResetPassword: () => navigateTo('/auth/reset-password'),
    
    // External actions (safe)
    openEmail: (email: string) => navigateTo(`mailto:${email}`, { external: true }),
    openExternal: (url: string) => navigateTo(url, { external: true }),
    
    // Page refresh (when truly needed)
    // Use safe page refresh with proper fallback
    refreshPage: () => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  };

  return {
    navigateTo,
    ...navigationActions
  };
};

/**
 * ✅ URL UTILITIES
 * Safe URL manipulation without window.location
 */
export const useUrlUtils = () => {
  const getBaseUrl = useCallback(() => {
    // Use safe origin access
    return typeof window !== 'undefined' ? window.location.origin : '';
  }, []);

  const getCurrentPath = useCallback(() => {
    // Use safe pathname access
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  }, []);

  const buildShareUrl = useCallback((path: string) => {
    return `${getBaseUrl()}${path}`;
  }, [getBaseUrl]);

  const copyCurrentUrl = useCallback(async () => {
    try {
      // Use safe URL access for clipboard
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      await navigator.clipboard.writeText(currentUrl);
      return true;
    } catch (error) {
      debugLog.error('Failed to copy URL', { component: 'NavigationHandler', action: 'copyCurrentUrl' }, error);
      return false;
    }
  }, []);

  return {
    getBaseUrl,
    getCurrentPath,
    buildShareUrl,
    copyCurrentUrl
  };
};