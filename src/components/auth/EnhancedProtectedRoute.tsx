// Enhanced Protected Route Component - Phase 1 Final Implementation
// Provides comprehensive route protection with theming support

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_ROUTES } from './routes';

interface EnhancedProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requiredRole?: string;
  subscriptionRequired?: boolean;
  redirectTo?: string;
  theme?: 'default' | 'admin' | 'expert' | 'workspace';
}

export const EnhancedProtectedRoute: React.FC<EnhancedProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireProfile = false,
  requiredRole,
  subscriptionRequired = false,
  redirectTo,
  theme = 'default',
}) => {
  const { user, userProfile, hasRole } = useAuth();
  const location = useLocation();

  // Apply theme classes to body
  React.useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-default', 'theme-admin', 'theme-expert', 'theme-workspace');
    body.classList.add(`theme-${theme}`);
    
    return () => {
      body.classList.remove(`theme-${theme}`);
    };
  }, [theme]);

  // Check authentication
  if (requireAuth && !user) {
    return <Navigate to={redirectTo || ALL_ROUTES.AUTH} state={{ from: location }} replace />;
  }

  // Check profile completion
  if (requireProfile && user && !userProfile) {
    return <Navigate to={ALL_ROUTES.PROFILE_SETUP} replace />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to={ALL_ROUTES.DASHBOARD} replace />;
  }

  // Check subscription requirements (placeholder for Phase 4)
  if (subscriptionRequired) {
    console.log('Subscription check - implement in Phase 4');
  }

  return <div className={`route-theme-${theme}`}>{children}</div>;
};

// Legacy ProtectedRoute wrapper for backward compatibility
export const ProtectedRoute = EnhancedProtectedRoute;