// Route Access Control Utilities
// Centralized utilities for checking route permissions and access control

import { UNIFIED_ROUTES, UnifiedRouteConfig } from './UnifiedRouter';
import { useRoleAccess, UserRole } from '@/hooks/useRoleAccess';
import { useAuth } from '@/contexts/AuthContext';

export const useUnifiedRouteAccess = () => {
  const { hasRole, getUserRoles, getPrimaryRole, canAccess } = useRoleAccess();
  const { user, userProfile } = useAuth();

  // Check if user can access a specific route
  const canAccessRoute = (path: string): boolean => {
    const route = UNIFIED_ROUTES.find(r => r.path === path);
    if (!route) return false;

    // Public routes are always accessible
    if (route.public) return true;

    // Check authentication requirement
    if (route.requireAuth && !user) return false;

    // Check profile completion requirement
    if (route.requireProfile && (!userProfile || userProfile.profile_completion_percentage < 80)) {
      return false;
    }

    // Check role requirements
    if (route.requiredRole) {
      if (Array.isArray(route.requiredRole)) {
        return route.requiredRole.some(role => hasRole(role));
      } else {
        return hasRole(route.requiredRole);
      }
    }

    return true;
  };

  // Get all accessible routes for current user
  const getAccessibleRoutes = (): UnifiedRouteConfig[] => {
    return UNIFIED_ROUTES.filter(route => canAccessRoute(route.path));
  };

  // Get routes by role
  const getRoutesByRole = (role: UserRole): UnifiedRouteConfig[] => {
    return UNIFIED_ROUTES.filter(route => {
      if (route.public) return true;
      if (!route.requiredRole) return true;
      
      if (Array.isArray(route.requiredRole)) {
        return route.requiredRole.includes(role);
      } else {
        return route.requiredRole === role;
      }
    });
  };

  // Get navigation menu items based on access
  const getNavigationItems = () => {
    const accessibleRoutes = getAccessibleRoutes();
    const userRoles = getUserRoles();
    
    // Filter routes that should appear in navigation
    const navigationRoutes = accessibleRoutes.filter(route => 
      !route.public && // Exclude public routes from authenticated navigation
      route.path !== '/profile/setup' && // Exclude setup pages
      !route.path.includes(':') // Exclude parameterized routes
    );

    return navigationRoutes.map(route => ({
      path: route.path,
      label: getRouteLabel(route.path),
      roles: route.requiredRole ? (Array.isArray(route.requiredRole) ? route.requiredRole : [route.requiredRole]) : [],
      accessible: true
    }));
  };

  return {
    canAccessRoute,
    getAccessibleRoutes,
    getRoutesByRole,
    getNavigationItems,
    hasRole,
    getUserRoles,
    getPrimaryRole,
    canAccess,
  };
};

// Helper function to get human-readable route labels
const getRouteLabel = (path: string): string => {
  const labels: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/ideas': 'Ideas',
    '/challenges': 'Challenges',
    '/opportunities': 'Opportunities',
    '/settings': 'Settings',
    '/admin/dashboard': 'Admin Dashboard',
    '/admin/evaluations': 'Evaluations',
    '/admin/analytics': 'Analytics',
    '/admin/relationships': 'Relationships',
    '/dashboard/access-control': 'Access Control',
    '/design-system': 'Design System',
  };
  
  return labels[path] || path.split('/').pop()?.replace('-', ' ') || 'Unknown';
};