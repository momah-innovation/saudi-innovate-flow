// Role-Based Routing System
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useRoleAccess, UserRole } from '@/hooks/useRoleAccess';
import { routeConfig, renderRoute, RouteConfigItem } from './RouteConfig';
import NotFound from '@/pages/NotFound';

interface RoleBasedRoutingProps {
  fallbackComponent?: React.ComponentType;
}

export const RoleBasedRouting: React.FC<RoleBasedRoutingProps> = ({ 
  fallbackComponent: FallbackComponent = NotFound 
}) => {
  const { hasRole } = useRoleAccess();

  // Filter routes based on user permissions
  const getAccessibleRoutes = (): RouteConfigItem[] => {
    return routeConfig.filter(route => {
      // Public routes are always accessible
      if (route.public) return true;

      // If no role required, route is accessible to all authenticated users
      if (!route.requiredRole) return true;

      // Check if user has required role(s)
      if (Array.isArray(route.requiredRole)) {
        return route.requiredRole.some(role => hasRole(role));
      } else {
        return hasRole(route.requiredRole);
      }
    });
  };

  const accessibleRoutes = getAccessibleRoutes();

  return (
    <Routes>
      {accessibleRoutes.map((routeConfig) => (
        <Route 
          key={routeConfig.path}
          path={routeConfig.path}
          element={renderRoute(routeConfig)}
        />
      ))}
      {/* Catch-all route */}
      <Route path="*" element={<FallbackComponent />} />
    </Routes>
  );
};

// Hook for checking route access
export const useRouteAccess = () => {
  const { hasRole, getUserRoles, getPrimaryRole, canAccess } = useRoleAccess();

  const canAccessRoute = (path: string): boolean => {
    const route = routeConfig.find(r => r.path === path);
    if (!route) return false;

    // Public routes are always accessible
    if (route.public) return true;

    // If no role required, accessible to all authenticated users
    if (!route.requiredRole) return true;

    // Check role requirements
    if (Array.isArray(route.requiredRole)) {
      return route.requiredRole.some(role => hasRole(role));
    } else {
      return hasRole(route.requiredRole);
    }
  };

  const getAccessibleRoutes = (): RouteConfigItem[] => {
    return routeConfig.filter(route => canAccessRoute(route.path));
  };

  const getRoutesByRole = (role: UserRole): RouteConfigItem[] => {
    return routeConfig.filter(route => {
      if (route.public) return true;
      if (!route.requiredRole) return true;
      
      if (Array.isArray(route.requiredRole)) {
        return route.requiredRole.includes(role);
      } else {
        return route.requiredRole === role;
      }
    });
  };

  return {
    canAccessRoute,
    getAccessibleRoutes,
    getRoutesByRole,
    hasRole,
    getUserRoles,
    getPrimaryRole,
    canAccess,
  };
};

// Component for conditional route rendering
interface ConditionalRouteProps {
  children: React.ReactNode;
  requireRole?: UserRole | UserRole[];
  requirePermission?: string;
  fallback?: React.ReactNode;
}

export const ConditionalRoute: React.FC<ConditionalRouteProps> = ({
  children,
  requireRole,
  requirePermission,
  fallback = null,
}) => {
  const { hasRole, canAccess } = useRoleAccess();

  // Check role requirements
  if (requireRole) {
    const hasRequiredRole = Array.isArray(requireRole) 
      ? requireRole.some(role => hasRole(role))
      : hasRole(requireRole);
    
    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  // Check permission requirements
  if (requirePermission && !canAccess(requirePermission as any)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};