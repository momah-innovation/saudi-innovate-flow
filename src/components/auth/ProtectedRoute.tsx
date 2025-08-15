// Enhanced Protected Route Component with RBAC
// Centralized route protection with role-based access control

import React, { useEffect } from 'react';
// ProtectedRoute component loaded
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_ROUTES } from '@/routing/routes';
import { debugLog } from '@/utils/debugLogger';
import { UserRole } from '@/hooks/useRoleAccess';
import { validateServerAuth, validateRole } from '@/utils/serverAuth';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

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
  // CRITICAL: ALL hooks must be called at the top level and in the same order every time
  const { user, userProfile, hasRole, loading, session } = useAuth();
  const location = useLocation();
  const { t } = useUnifiedTranslation();

  // Server-side validation for enhanced security
  useEffect(() => {
    const validateAccess = async () => {
      if (requireAuth && user && session?.access_token) {
        try {
          await validateServerAuth(session.access_token);

          if (requiredRole) {
            const hasAccess = await validateRole(user.id, requiredRole);
            if (!hasAccess) {
              debugLog.warn('Server-side role validation failed', {
                component: 'ProtectedRoute',
                action: 'serverValidation',
                userId: user.id,
                requiredRole,
              });
            }
          }
        } catch (error) {
          debugLog.error('Server validation error', {
            component: 'ProtectedRoute',
            action: 'serverValidation'
          }, error);
        }
      }
    };

    validateAccess();
  }, [user, session, requiredRole, requireAuth]);

  debugLog.debug('ProtectedRoute auth check', {
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

  // NEVER return early before all hooks are complete - use conditional rendering instead
  // Wait for auth to finish loading before checking permissions
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">{t('common.status.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !user) {
    debugLog.debug('ProtectedRoute: Redirecting to auth - no user', { 
      component: 'ProtectedRoute', 
      action: 'redirectToAuth' 
    });
    return <Navigate to={redirectTo || ALL_ROUTES.AUTH} state={{ from: location }} replace />;
  }

  // Progressive profile requirement - reduced from 80% to 40% for better UX
  if (requireProfile && user && (!userProfile || userProfile.profile_completion_percentage < 40)) {
    debugLog.debug('ProtectedRoute: Redirecting to profile setup - incomplete profile', {
      component: 'ProtectedRoute',
      action: 'redirectToProfileSetup',
      data: {
        hasProfile: !!userProfile,
        completion: userProfile?.profile_completion_percentage,
        newRequirement: 40 // Updated from 80%
      }
    });
    return <Navigate to={ALL_ROUTES.PROFILE_SETUP} replace />;
  }

  // Check role requirements - support both single role and array of roles
  if (requiredRole) {
    // If user profile hasn't loaded yet, wait for it
    if (!userProfile) {
      // Waiting for user profile to load
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      );
    }

    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.some(role => hasRole(role))
      : hasRole(requiredRole);
      
    // Role check logging removed for performance
      
    if (!hasRequiredRole) {
      debugLog.debug('ProtectedRoute: Redirecting to dashboard - insufficient role', {
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
    debugLog.debug('Subscription check - implement in Phase 4', { 
      component: 'ProtectedRoute', 
      action: 'subscriptionCheck' 
    });
  }

  return <div>{children}</div>;
};