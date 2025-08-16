import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export type UserRole = Database['public']['Enums']['app_role'];

/**
 * ✅ UNIFIED RBAC PERMISSIONS HOOK
 * Standardizes role-based access control across the application
 * Replaces 54+ inconsistent role check patterns
 */
export const useRolePermissions = (requiredRoles: UserRole[] = []) => {
  const { hasRole, userProfile } = useAuth();

  // ✅ STANDARD PATTERN: Unified role checking
  const hasPermission = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  // ✅ COMMON PERMISSION GROUPS
  const permissions = {
    // Admin permissions
    isAdmin: hasPermission(['admin', 'super_admin']),
    isSuperAdmin: hasRole('super_admin'),
    
    // Management permissions
    canManage: hasPermission(['admin', 'super_admin', 'challenge_manager', 'team_member']),
    canManageUsers: hasPermission(['admin', 'super_admin', 'user_manager']),
    canManageChallenges: hasPermission(['admin', 'super_admin', 'challenge_manager', 'team_member']),
    canManageEvents: hasPermission(['admin', 'super_admin', 'event_manager']),
    canManageCampaigns: hasPermission(['admin', 'super_admin', 'campaign_manager']),
    
    // Access permissions
    canAccess: requiredRoles.length > 0 ? hasPermission(requiredRoles) : true,
    canView: hasPermission(['admin', 'super_admin', 'team_member', 'expert', 'partner']),
    canEdit: hasPermission(['admin', 'super_admin', 'challenge_manager']),
    
    // Team permissions
    isTeamMember: hasPermission(['team_member', 'admin', 'super_admin']),
    isExpert: hasPermission(['expert', 'domain_expert', 'external_expert', 'admin', 'super_admin']),
    isPartner: hasPermission(['partner', 'admin', 'super_admin'])
  };

  return {
    ...permissions,
    hasPermission,
    hasRole,
    userProfile,
    requiredRoles
  };
};

/**
 * ✅ COMPONENT ACCESS GUARD
 * Usage: const { canAccess } = useRolePermissions(['admin', 'super_admin']);
 * if (!canAccess) return <UnauthorizedView />;
 */
export const useRequireRoles = (roles: UserRole[]) => {
  const { canAccess } = useRolePermissions(roles);
  return { canAccess, isAuthorized: canAccess };
};