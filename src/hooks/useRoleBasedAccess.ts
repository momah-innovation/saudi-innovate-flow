
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import type { Database } from '@/integrations/supabase/types';

export type UserRole = Database['public']['Enums']['app_role'];

/**
 * ✅ ENHANCED ROLE-BASED ACCESS HOOK
 * Provides comprehensive role-based access control with workspace context
 */
export function useRoleBasedAccess() {
  const { user, userProfile } = useAuth();
  const { 
    isAdmin, 
    isSuperAdmin, 
    canManage, 
    canManageUsers, 
    canManageChallenges,
    isTeamMember,
    isExpert,
    isPartner,
    hasPermission 
  } = useRolePermissions();

  // Dashboard access levels
  const dashboardAccess = {
    canViewAnalytics: isAdmin || isSuperAdmin || isTeamMember,
    canViewUserMetrics: isAdmin || isSuperAdmin,
    canViewSystemHealth: isAdmin || isSuperAdmin,
    canViewSecurityMetrics: isSuperAdmin,
    canManageUsers: canManageUsers,
    canManageChallenges: canManageChallenges,
    canCreateCampaigns: canManage,
    canInviteUsers: isAdmin || isSuperAdmin || isTeamMember,
    canViewReports: isAdmin || isSuperAdmin || isTeamMember
  };

  // Activity system permissions
  const activityAccess = {
    canViewAllActivities: isAdmin || isSuperAdmin || isTeamMember,
    canViewPublicActivities: true,
    canLogActivities: user !== null,
    canManageActivitySettings: isAdmin || isSuperAdmin,
    canExportActivities: isAdmin || isSuperAdmin
  };

  // UI visibility controls
  const uiAccess = {
    showAdminPanel: isAdmin || isSuperAdmin,
    showTeamFeatures: isTeamMember || isAdmin || isSuperAdmin,
    showExpertFeatures: isExpert,
    showPartnerFeatures: isPartner,
    showAdvancedMetrics: isAdmin || isSuperAdmin || isTeamMember
  };

  return {
    user,
    userProfile,
    isAdmin,
    isSuperAdmin,
    isTeamMember,
    isExpert,
    isPartner,
    dashboardAccess,
    activityAccess,
    uiAccess,
    hasPermission
  };
}

export default useRoleBasedAccess;
