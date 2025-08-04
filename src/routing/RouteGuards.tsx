// Route Guards and Protection Components
// Enhanced route protection with subscription awareness

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_ROUTES } from './routes';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requiredRole?: string;
  subscriptionRequired?: boolean;
  redirectTo?: string;
}

// Enhanced Protected Route with subscription awareness
export const EnhancedProtectedRoute: React.FC<RouteGuardProps> = ({
  children,
  requireAuth = true,
  requireProfile = false,
  requiredRole,
  subscriptionRequired = false,
  redirectTo,
}) => {
  const { user, userProfile, hasRole } = useAuth();
  const location = useLocation();

  // Check authentication
  if (requireAuth && !user) {
    return <Navigate to={redirectTo || ALL_ROUTES.AUTH} state={{ from: location }} replace />;
  }

  // Check profile completion (simplified for now)
  if (requireProfile && user && !userProfile) {
    return <Navigate to={ALL_ROUTES.PROFILE_SETUP} replace />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to={ALL_ROUTES.DASHBOARD} replace />;
  }

  // Check subscription requirements (TODO: implement after subscription system)
  if (subscriptionRequired) {
    // For now, allow access - will implement after Phase 4
    console.log('Subscription check placeholder - implement in Phase 4');
  }

  return <>{children}</>;
};

// Public Route Guard (redirects authenticated users)
export const PublicRoute: React.FC<{ children: React.ReactNode; redirectTo?: string }> = ({
  children,
  redirectTo = ALL_ROUTES.DASHBOARD,
}) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

// Subscription Guard (checks subscription status)
export const SubscriptionGuard: React.FC<{
  children: React.ReactNode;
  requiredTier?: string;
  fallback?: React.ReactNode;
}> = ({
  children,
  requiredTier,
  fallback,
}) => {
  const { user } = useAuth(); // TODO: Add subscription after Phase 4
  
  // TODO: Implement subscription checking in Phase 4
  const hasRequiredSubscription = true; // Placeholder - allow all access for now
  
  if (!hasRequiredSubscription) {
    return fallback || <Navigate to={ALL_ROUTES.PRICING} replace />;
  }
  
  return <>{children}</>;
};

// Organization Access Guard
export const OrgAccessGuard: React.FC<{
  children: React.ReactNode;
  orgId: string;
}> = ({ children, orgId }) => {
  const { user } = useAuth(); // TODO: Add hasOrgAccess after org system
  
  if (!user) { // TODO: Add org access check after org system
    return <Navigate to={ALL_ROUTES.DASHBOARD} replace />;
  }
  
  return <>{children}</>;
};

// Workspace Route Guard - determines workspace type and access
export const WorkspaceGuard: React.FC<{
  children: React.ReactNode;
  workspaceType: 'user' | 'expert' | 'org' | 'admin';
  workspaceId?: string;
}> = ({ children, workspaceType, workspaceId }) => {
  const { user, hasRole } = useAuth(); // TODO: Add hasOrgAccess after org system
  
  // Check workspace access based on type
  switch (workspaceType) {
    case 'user':
      if (!user || (workspaceId && workspaceId !== user.id)) {
        return <Navigate to={ALL_ROUTES.DASHBOARD} replace />;
      }
      break;
      
    case 'expert':
      if (!hasRole('expert')) {
        return <Navigate to={ALL_ROUTES.DASHBOARD} replace />;
      }
      break;
      
    case 'org':
      if (!workspaceId) { // TODO: Add org access check after org system
        return <Navigate to={ALL_ROUTES.DASHBOARD} replace />;
      }
      break;
      
    case 'admin':
      if (!hasRole('admin') && !hasRole('super_admin')) {
        return <Navigate to={ALL_ROUTES.DASHBOARD} replace />;
      }
      break;
      
    default:
      return <Navigate to={ALL_ROUTES.DASHBOARD} replace />;
  }
  
  return <>{children}</>;
};