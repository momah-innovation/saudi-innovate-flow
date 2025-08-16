import { useCallback } from 'react';
import { useNavigationHandler, useUrlUtils } from '@/hooks/useNavigationHandler';
import { debugLog } from '@/utils/debugLogger';

/**
 * ✅ PHASE 4: NAVIGATION OPTIMIZATION
 * Systematic replacement of window.location patterns
 * Improves SPA performance by eliminating page reloads
 */

// ✅ ERROR BOUNDARY NAVIGATION FIXES
export const useErrorBoundaryNavigation = () => {
  const { navigateTo, refreshPage } = useNavigationHandler();

  const handleErrorReload = useCallback(() => {
    debugLog.debug('Error boundary reload triggered');
    refreshPage();
  }, [refreshPage]);

  const handleErrorNavigation = useCallback((path: string = '/') => {
    debugLog.debug('Error boundary navigation to path', { path });
    navigateTo(path);
  }, [navigateTo]);

  return {
    handleErrorReload,
    handleErrorNavigation
  };
};

// ✅ AUTH NAVIGATION FIXES  
export const useAuthNavigation = () => {
  const { navigateTo } = useNavigationHandler();
  const { getBaseUrl } = useUrlUtils();

  const buildAuthRedirectUrl = useCallback((path: string) => {
    return `${getBaseUrl()}/auth${path}`;
  }, [getBaseUrl]);

  const buildVerificationUrl = useCallback(() => {
    return `${getBaseUrl()}/auth/verify-email`;
  }, [getBaseUrl]);

  const buildResetUrl = useCallback(() => {
    return `${getBaseUrl()}/auth/reset-password`;
  }, [getBaseUrl]);

  return {
    buildAuthRedirectUrl,
    buildVerificationUrl,  
    buildResetUrl,
    navigateToAuth: () => navigateTo('/auth'),
    navigateToLogin: () => navigateTo('/auth?mode=login'),
    navigateToSignup: () => navigateTo('/auth?mode=register')
  };
};

// ✅ SHARE URL BUILDERS
export const useShareUrlBuilders = () => {
  const { navigateTo } = useNavigationHandler();
  const { getBaseUrl, copyCurrentUrl } = useUrlUtils();

  const buildChallengeUrl = useCallback((challengeId: string) => {
    return `${getBaseUrl()}/challenges/${challengeId}`;
  }, [getBaseUrl]);

  const buildEventUrl = useCallback((eventId: string) => {
    return `${getBaseUrl()}/events/${eventId}`;
  }, [getBaseUrl]);

  const buildOpportunityUrl = useCallback((challengeId: string) => {
    return `${getBaseUrl()}/opportunities/${challengeId}`;
  }, [getBaseUrl]);

  const buildIdeaUrl = useCallback((ideaId: string) => {
    return `${getBaseUrl()}/ideas/${ideaId}`;
  }, [getBaseUrl]);

  const buildInviteUrl = useCallback((token: string) => {
    return `${getBaseUrl()}/auth?invite=${token}`;
  }, [getBaseUrl]);

  return {
    buildChallengeUrl,
    buildEventUrl,
    buildOpportunityUrl,
    buildIdeaUrl,
    buildInviteUrl,
    copyCurrentUrl,
    getCurrentUrl: () => window.location.href
  };
};