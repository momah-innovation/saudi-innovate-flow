import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from './useRoleAccess';
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
    const isTeamMember = userRoles.includes('team_member') || isAdmin;

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