/**
 * Navigation Fix Hook - Replaces window.location patterns
 * Prevents full page reloads by using proper SPA navigation
 */

import { useNavigationHandler } from './useNavigationHandler';
import { useWindowLocationMigration } from './useWindowLocationMigration';

export const useNavigationFix = () => {
  const { navigateTo, refreshPage } = useNavigationHandler();
  const windowLocationReplacements = useWindowLocationMigration();

  // Safe navigation patterns to replace window.location usages
  const navigationFixes = {
    // Replace window.location.href = url
    navigateToUrl: (url: string) => {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // External URL - open in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // Internal URL - use SPA navigation
        navigateTo(url);
      }
    },

    // Replace window.location.reload()
    reloadPage: () => {
      refreshPage();
    },

    // Replace window.location.assign()
    assignLocation: (url: string) => {
      navigateTo(url);
    },

    // Replace window.location.replace()
    replaceLocation: (url: string) => {
      navigateTo(url, { replace: true });
    },

    // Safe redirect patterns
    redirectTo: (path: string) => {
      navigateTo(path);
    },

    // Get current URL safely
    getCurrentUrl: windowLocationReplacements.getCurrentUrl,
    getCurrentPath: windowLocationReplacements.getCurrentPath,
    getOrigin: windowLocationReplacements.getOrigin,

    // External link handling
    openExternalLink: windowLocationReplacements.openExternalLink,
    createEmailLink: windowLocationReplacements.createEmailLink
  };

  return navigationFixes;
};