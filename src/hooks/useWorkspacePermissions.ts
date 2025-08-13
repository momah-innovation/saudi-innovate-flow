import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { 
  getWorkspacePermissions, 
  canAccessWorkspace, 
  getContextAccess,
  WorkspacePermissions,
} from '@/config/workspaceAccessControl';

/**
 * Enhanced workspace permissions with RBAC support
 */
export interface EnhancedWorkspacePermissions extends WorkspacePermissions {
  canAccessUserWorkspace: boolean;
  canAccessExpertWorkspace: boolean;
  canAccessOrganizationWorkspace: boolean;
  canAccessPartnerWorkspace: boolean;
  canAccessAdminWorkspace: boolean;
  canAccessTeamWorkspace: boolean;
  canCreateOpportunities: boolean;
  canManageUsers: boolean;
  canViewSystemAnalytics: boolean;
  
  // Additional permissions for compatibility
  canViewOwnIdeas: boolean;
  canEvaluateIdeas: boolean;
  canManageChallenges: boolean;
  canViewOpportunities: boolean;
  canManageSystem: boolean;
  canViewTeamMetrics: boolean;
  
  contextAccess: {
    canAccessOwnData: boolean;
    canAccessTeamData: boolean;
    canAccessOrgData: boolean;
    canAccessGlobalData: boolean;
  };
}

export const useWorkspacePermissions = (): EnhancedWorkspacePermissions => {
  const { user, userProfile } = useAuth();
  const { hasAnyRole } = useRoleAccess();
  
  return useMemo(() => {
    if (!user) {
      return {
        canView: false,
        canEdit: false,
        canCreate: false,
        canDelete: false,
        canManageTeam: false,
        canViewAnalytics: false,
        canExportData: false,
        canManageSettings: false,
        canAccessCollaboration: false,
        canInviteUsers: false,
        canAssignTasks: false,
        canViewReports: false,
        canAccessUserWorkspace: false,
        canAccessExpertWorkspace: false,
        canAccessOrganizationWorkspace: false,
        canAccessPartnerWorkspace: false,
        canAccessAdminWorkspace: false,
        canAccessTeamWorkspace: false,
        canCreateOpportunities: false,
        canManageUsers: false,
        canViewSystemAnalytics: false,
        canViewOwnIdeas: false,
        canEvaluateIdeas: false,
        canManageChallenges: false,
        canViewOpportunities: false,
        canManageSystem: false,
        canViewTeamMetrics: false,
        contextAccess: {
          canAccessOwnData: false,
          canAccessTeamData: false,
          canAccessOrgData: false,
          canAccessGlobalData: false
        }
      };
    }
    
    const userRoles = userProfile?.roles || [];
    
    return {
      canView: true,
      canEdit: hasAnyRole(['admin', 'super_admin', 'team_member']),
      canCreate: hasAnyRole(['innovator', 'team_member', 'admin', 'super_admin']),
      canDelete: hasAnyRole(['admin', 'super_admin']),
      canManageTeam: hasAnyRole(['admin', 'super_admin', 'team_lead']),
      canViewAnalytics: hasAnyRole(['admin', 'super_admin', 'domain_expert']),
      canExportData: hasAnyRole(['admin', 'super_admin']),
      canManageSettings: hasAnyRole(['admin', 'super_admin']),
      canAccessCollaboration: true,
      canInviteUsers: hasAnyRole(['admin', 'super_admin', 'team_lead']),
      canAssignTasks: hasAnyRole(['admin', 'super_admin', 'team_lead', 'project_manager']),
      canViewReports: hasAnyRole(['admin', 'super_admin', 'domain_expert']),
      
      canAccessUserWorkspace: canAccessWorkspace('user', userRoles),
      canAccessExpertWorkspace: canAccessWorkspace('expert', userRoles),
      canAccessOrganizationWorkspace: canAccessWorkspace('organization', userRoles),
      canAccessPartnerWorkspace: canAccessWorkspace('partner', userRoles),
      canAccessAdminWorkspace: canAccessWorkspace('admin', userRoles),
      canAccessTeamWorkspace: canAccessWorkspace('team', userRoles),
      
      canCreateOpportunities: hasAnyRole(['admin', 'super_admin', 'partner']),
      canManageUsers: hasAnyRole(['admin', 'super_admin']),
      canViewSystemAnalytics: hasAnyRole(['admin', 'super_admin']),
      
      // Additional compatibility permissions
      canViewOwnIdeas: true,
      canEvaluateIdeas: hasAnyRole(['domain_expert', 'evaluator', 'admin', 'super_admin']),
      canManageChallenges: hasAnyRole(['admin', 'super_admin']),
      canViewOpportunities: hasAnyRole(['partner', 'admin', 'super_admin']),
      canManageSystem: hasAnyRole(['super_admin']),
      canViewTeamMetrics: hasAnyRole(['team_member', 'team_lead', 'admin', 'super_admin']),
      
      contextAccess: getContextAccess('user', userRoles) || {
        canAccessOwnData: true,
        canAccessTeamData: hasAnyRole(['team_member', 'team_lead', 'admin', 'super_admin']),
        canAccessOrgData: hasAnyRole(['admin', 'super_admin']),
        canAccessGlobalData: hasAnyRole(['super_admin'])
      }
    };
  }, [user, userProfile, hasAnyRole]);
};