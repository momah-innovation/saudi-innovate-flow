/**
 * Hook to migrate window.location usages to proper navigation patterns
 * Provides safe replacements for common window.location patterns
 */

import { useNavigationHandler } from './useNavigationHandler';
import { useUrlUtils } from './useNavigationHandler';

export const useWindowLocationMigration = () => {
  const { navigateTo, refreshPage } = useNavigationHandler();
  const { getCurrentPath, getBaseUrl } = useUrlUtils();

  // Safe replacements for common window.location patterns
  const windowLocationReplacements = {
    // Replace window.location.href = url
    navigateToUrl: (url: string) => {
      navigateTo(url);
    },

    // Replace window.location.reload()
    reloadPage: () => {
      refreshPage();
    },

    // Replace window.location.pathname
    getCurrentPath: () => {
      return getCurrentPath();
    },

    // Replace window.location.origin
    getOrigin: () => {
      return getBaseUrl();
    },

    // Replace window.location.href for current URL
    getCurrentUrl: () => {
      return `${getBaseUrl()}${getCurrentPath()}`;
    },

    // Safe email link creation
    createEmailLink: (email: string) => {
      return `mailto:${email}`;
    },

    // Safe external link handling
    openExternalLink: (url: string) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return windowLocationReplacements;
};

export default useWindowLocationMigration;