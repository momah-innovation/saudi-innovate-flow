// Enhanced Protected Route Component with RBAC
// Centralized route protection with role-based access control

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_ROUTES } from '@/routing/routes';
import { logger } from '@/utils/logger';
import { UserRole } from '@/hooks/useRoleAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requiredRole?: UserRole | UserRole[];
  subscriptionRequired?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireProfile = false,
  requiredRole,
  subscriptionRequired = false,
  redirectTo,
  
}) => {
  const { user, userProfile, hasRole } = useAuth();
  const location = useLocation();

  // Log all auth decisions
  logger.debug('ProtectedRoute auth check', {
    component: 'ProtectedRoute',
    action: 'authCheck',
    data: {
      path: location.pathname,
      requireAuth,
      requireProfile,
      requiredRole,
      hasUser: !!user,
      hasProfile: !!userProfile,
      profileCompletion: userProfile?.profile_completion_percentage,
      userRoles: userProfile?.user_roles?.map(r => r.role)
    }
  });

  // Check authentication
  if (requireAuth && !user) {
    logger.info('ProtectedRoute: Redirecting to auth - no user', { component: 'ProtectedRoute', action: 'redirectToAuth' });
    return <Navigate to={redirectTo || ALL_ROUTES.AUTH} state={{ from: location }} replace />;
  }

  // Check profile completion - redirect if profile is less than 80% complete
  if (requireProfile && user && (!userProfile || userProfile.profile_completion_percentage < 80)) {
    logger.info('ProtectedRoute: Redirecting to profile setup - incomplete profile', {
      component: 'ProtectedRoute',
      action: 'redirectToProfileSetup',
      data: {
        hasProfile: !!userProfile,
        completion: userProfile?.profile_completion_percentage
      }
    });
    return <Navigate to={ALL_ROUTES.PROFILE_SETUP} replace />;
  }

  // Check role requirements - support both single role and array of roles
  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.some(role => hasRole(role))
      : hasRole(requiredRole);
      
    if (!hasRequiredRole) {
      logger.info('ProtectedRoute: Redirecting to dashboard - insufficient role', {
        component: 'ProtectedRoute',
        action: 'redirectToDashboard',
        data: {
          requiredRole,
          hasRequiredRole,
          userRoles: userProfile?.user_roles?.map(r => r.role)
        }
      });
      return <Navigate to={ALL_ROUTES.DASHBOARD} replace />;
    }
  }

  // Check subscription requirements (placeholder for Phase 4)
  if (subscriptionRequired) {
    logger.debug('Subscription check - implement in Phase 4', { component: 'ProtectedRoute', action: 'subscriptionCheck' });
  }

  return <div>{children}</div>;
};