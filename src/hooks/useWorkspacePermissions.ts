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
  contextAccess: {
    canAccessOwnData: boolean;
    canAccessTeamData: boolean;
    canAccessOrgData: boolean;
    canAccessGlobalData: boolean;
  };
}

export const useWorkspacePermissions = (): EnhancedWorkspacePermissions => {
  const { user, userProfile } = useAuth();
  const { hasAnyRole, hasPermission } = useRoleAccess();
  
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
      canCreate: hasAnyRole(['innovator', 'user', 'team_member', 'admin', 'super_admin']),
      canDelete: hasAnyRole(['admin', 'super_admin']),
      canManageTeam: hasAnyRole(['admin', 'super_admin', 'team_leader']),
      canViewAnalytics: hasAnyRole(['admin', 'super_admin', 'manager', 'domain_expert']),
      canExportData: hasAnyRole(['admin', 'super_admin', 'manager']),
      canManageSettings: hasAnyRole(['admin', 'super_admin']),
      canAccessCollaboration: true,
      canInviteUsers: hasAnyRole(['admin', 'super_admin', 'team_leader']),
      canAssignTasks: hasAnyRole(['admin', 'super_admin', 'team_leader', 'project_manager']),
      canViewReports: hasAnyRole(['admin', 'super_admin', 'manager', 'domain_expert']),
      
      canAccessUserWorkspace: canAccessWorkspace('user', userRoles),
      canAccessExpertWorkspace: canAccessWorkspace('expert', userRoles),
      canAccessOrganizationWorkspace: canAccessWorkspace('organization', userRoles),
      canAccessPartnerWorkspace: canAccessWorkspace('partner', userRoles),
      canAccessAdminWorkspace: canAccessWorkspace('admin', userRoles),
      canAccessTeamWorkspace: canAccessWorkspace('team', userRoles),
      
      canCreateOpportunities: hasAnyRole(['admin', 'super_admin', 'partner']) && hasPermission('create_opportunities'),
      canManageUsers: hasAnyRole(['admin', 'super_admin']),
      canViewSystemAnalytics: hasAnyRole(['admin', 'super_admin']),
      
      contextAccess: getContextAccess('user', userRoles) || {
        canAccessOwnData: true,
        canAccessTeamData: hasAnyRole(['team_member', 'team_leader', 'admin', 'super_admin']),
        canAccessOrgData: hasAnyRole(['admin', 'super_admin', 'manager']),
        canAccessGlobalData: hasAnyRole(['super_admin'])
      }
    };
  }, [user, userProfile, hasAnyRole, hasPermission]);
};
import { useMemo } from 'react';

export interface WorkspacePermissions {
  // User Workspace
  canCreateIdeas: boolean;
  canViewOwnIdeas: boolean;
  canEditOwnIdeas: boolean;
  canDeleteOwnIdeas: boolean;
  canJoinChallenges: boolean;
  canBookmarkContent: boolean;
  canViewPublicContent: boolean;

  // Expert Workspace
  canEvaluateIdeas: boolean;
  canViewAllIdeas: boolean;
  canAccessEvaluationQueue: boolean;
  canManageEvaluations: boolean;
  canViewEvaluationMetrics: boolean;

  // Organization Workspace
  canCreateChallenges: boolean;
  canManageChallenges: boolean;
  canViewAllSubmissions: boolean;
  canManageTeam: boolean;
  canViewOrganizationMetrics: boolean;
  canManageBudgets: boolean;

  // Partner Workspace
  canViewOpportunities: boolean;
  canCreateOpportunities: boolean;
  canManagePartnerships: boolean;
  canViewPartnershipMetrics: boolean;
  canAccessMarketplace: boolean;

  // Admin Workspace
  canManageUsers: boolean;
  canManageSystem: boolean;
  canViewAllData: boolean;
  canManageRoles: boolean;
  canAccessAuditLogs: boolean;
  canManageContent: boolean;

  // Team Workspace
  canManageProjects: boolean;
  canAssignTasks: boolean;
  canViewTeamMetrics: boolean;
  canManageResources: boolean;
  canAccessTeamChat: boolean;
}

export function useWorkspacePermissions(): WorkspacePermissions {
  const { user, userProfile } = useAuth();
  const { hasRole, canAccess, getUserRoles } = useRoleAccess();

  return useMemo(() => {
    const isAuthenticated = !!user;
    const userRoles = getUserRoles();
    const isAdmin = hasRole('admin') || hasRole('super_admin');
    const isExpert = hasRole('expert');
    const isPartner = hasRole('partner');
    const isTeamMember = hasRole('team_member') || hasRole('team_lead') || hasRole('project_manager') || isAdmin;

    return {
      // User Workspace - Available to all authenticated users
      canCreateIdeas: isAuthenticated,
      canViewOwnIdeas: isAuthenticated,
      canEditOwnIdeas: isAuthenticated,
      canDeleteOwnIdeas: isAuthenticated,
      canJoinChallenges: isAuthenticated,
      canBookmarkContent: isAuthenticated,
      canViewPublicContent: true, // Public content is viewable by everyone

      // Expert Workspace - Expert role required
      canEvaluateIdeas: isExpert || isAdmin,
      canViewAllIdeas: isExpert || isAdmin || isTeamMember,
      canAccessEvaluationQueue: isExpert || isAdmin,
      canManageEvaluations: isExpert || isAdmin,
      canViewEvaluationMetrics: isExpert || isAdmin,

      // Organization Workspace - Admin or team management role
      canCreateChallenges: isAdmin || isTeamMember,
      canManageChallenges: isAdmin || isTeamMember,
      canViewAllSubmissions: isAdmin || isTeamMember,
      canManageTeam: isAdmin,
      canViewOrganizationMetrics: isAdmin || isTeamMember,
      canManageBudgets: isAdmin,

      // Partner Workspace - Partner role or admin
      canViewOpportunities: isPartner || isAdmin || isAuthenticated,
      canCreateOpportunities: isPartner || isAdmin,
      canManagePartnerships: isPartner || isAdmin,
      canViewPartnershipMetrics: isPartner || isAdmin,
      canAccessMarketplace: isPartner || isAdmin || isAuthenticated,

      // Admin Workspace - Admin roles only
      canManageUsers: isAdmin,
      canManageSystem: isAdmin,
      canViewAllData: isAdmin,
      canManageRoles: hasRole('super_admin'),
      canAccessAuditLogs: isAdmin,
      canManageContent: isAdmin || isTeamMember,

      // Team Workspace - Team members and admins
      canManageProjects: isTeamMember || isAdmin,
      canAssignTasks: isTeamMember || isAdmin,
      canViewTeamMetrics: isTeamMember || isAdmin,
      canManageResources: isTeamMember || isAdmin,
      canAccessTeamChat: isTeamMember || isAdmin || isAuthenticated,
    };
  }, [user, userProfile, hasRole, canAccess, getUserRoles]);
}