import { useAuth } from '@/contexts/AuthContext';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import type { Database } from '@/integrations/supabase/types';

// Use database enum for stronger type safety
export type UserRole = Database['public']['Enums']['app_role'];

export interface RolePermissions {
  // Admin permissions
  canManageUsers: boolean;
  canManageSystem: boolean;
  canManageChallenges: boolean;
  canManagePartners: boolean;
  canViewAnalytics: boolean;
  canManageTeams: boolean;
  
  // Expert permissions
  canEvaluateIdeas: boolean;
  canAccessExpertTools: boolean;
  
  // User permissions
  canSubmitIdeas: boolean;
  canParticipateInChallenges: boolean;
  canViewPublicContent: boolean;
  
  // Partner permissions
  canManageOpportunities: boolean;
  canViewPartnerDashboard: boolean;
  
  // Stakeholder permissions
  canViewStakeholderReports: boolean;
  
  // Manager permissions (new)
  canManageProjects: boolean;
  canManageDepartment: boolean;
  canManageSector: boolean;
  
  // Coordinator permissions (new)
  canCoordinateExperts: boolean;
  canManageEvents: boolean;
  canManageCampaigns: boolean;
  canManageStakeholders: boolean;
  
  // Analyst permissions (new)
  canAccessAnalytics: boolean;
  canViewSystemData: boolean;
  canGenerateReports: boolean;
  
  // Content permissions (new)
  canManageContent: boolean;
  canResearch: boolean;
  
  // Organization permissions (new)
  canManageOrganization: boolean;
  canManageEntities: boolean;
  canViewOrgAnalytics: boolean;
}

export const useRoleAccess = () => {
  const { userProfile, hasRole } = useAuth();
  const { getSettingValue } = useSettingsManager();

  const permissions: RolePermissions = {
    // Admin permissions
    canManageUsers: hasRole('admin') || hasRole('super_admin') || hasRole('user_manager'),
    canManageSystem: hasRole('super_admin') || hasRole('system_auditor'),
    canManageChallenges: hasRole('admin') || hasRole('super_admin') || hasRole('challenge_manager') || hasRole('team_member'),
    canManagePartners: hasRole('admin') || hasRole('super_admin') || hasRole('partnership_manager'),
    canViewAnalytics: hasRole('admin') || hasRole('super_admin') || hasRole('data_analyst') || hasRole('team_member'),
    canManageTeams: hasRole('admin') || hasRole('super_admin') || hasRole('team_lead') || hasRole('project_manager'),
    
    // Expert permissions
    canEvaluateIdeas: hasRole('expert') || hasRole('domain_expert') || hasRole('external_expert') || hasRole('evaluator') || hasRole('judge') || hasRole('admin') || hasRole('super_admin'),
    canAccessExpertTools: hasRole('expert') || hasRole('domain_expert') || hasRole('external_expert') || hasRole('admin') || hasRole('super_admin'),
    
    // User permissions (available to all authenticated users)
    canSubmitIdeas: true,
    canParticipateInChallenges: true,
    canViewPublicContent: true,
    
    // Partner permissions
    canManageOpportunities: hasRole('partner') || hasRole('partnership_manager') || hasRole('admin') || hasRole('super_admin'),
    canViewPartnerDashboard: hasRole('partner') || hasRole('partnership_manager') || hasRole('admin') || hasRole('super_admin'),
    
    // Stakeholder permissions
    canViewStakeholderReports: hasRole('stakeholder') || hasRole('stakeholder_manager') || hasRole('admin') || hasRole('super_admin'),
    
    // Manager permissions
    canManageProjects: hasRole('project_manager') || hasRole('team_lead') || hasRole('innovation_manager') || hasRole('admin') || hasRole('super_admin'),
    canManageDepartment: hasRole('department_head') || hasRole('admin') || hasRole('super_admin'),
    canManageSector: hasRole('sector_lead') || hasRole('admin') || hasRole('super_admin'),
    
    // Coordinator permissions
    canCoordinateExperts: hasRole('expert_coordinator') || hasRole('admin') || hasRole('super_admin'),
    canManageEvents: hasRole('event_manager') || hasRole('admin') || hasRole('super_admin'),
    canManageCampaigns: hasRole('campaign_manager') || hasRole('admin') || hasRole('super_admin'),
    canManageStakeholders: hasRole('stakeholder_manager') || hasRole('admin') || hasRole('super_admin'),
    
    // Analyst permissions
    canAccessAnalytics: hasRole('data_analyst') || hasRole('system_auditor') || hasRole('admin') || hasRole('super_admin'),
    canViewSystemData: hasRole('system_auditor') || hasRole('data_analyst') || hasRole('super_admin'),
    canGenerateReports: hasRole('data_analyst') || hasRole('admin') || hasRole('super_admin'),
    
    // Content permissions
    canManageContent: hasRole('content_manager') || hasRole('admin') || hasRole('super_admin'),
    canResearch: hasRole('research_lead') || hasRole('admin') || hasRole('super_admin'),
    
    // Organization permissions
    canManageOrganization: hasRole('organization_admin') || hasRole('admin') || hasRole('super_admin'),
    canManageEntities: hasRole('entity_manager') || hasRole('deputy_manager') || hasRole('organization_admin') || hasRole('admin') || hasRole('super_admin'),
    canViewOrgAnalytics: hasRole('organization_admin') || hasRole('entity_manager') || hasRole('admin') || hasRole('super_admin'),
  };

  const getUserRoles = (): UserRole[] => {
    return userProfile?.user_roles?.map(role => role.role as UserRole) || [];
  };

  const getPrimaryRole = (): UserRole => {
    const roles = getUserRoles();
    
    // Enhanced priority order for determining primary role - handles multiple roles
    const rolePriority = getSettingValue('role_priority_order', [
      'super_admin', 'admin', 
      // Leadership roles
      'organization_admin', 'department_head', 'sector_lead', 'innovation_manager',
      // Management roles  
      'entity_manager', 'deputy_manager', 'team_lead', 'project_manager',
      // Coordination roles
      'expert_coordinator', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager',
      // Specialist roles
      'content_manager', 'challenge_manager', 'research_lead', 'user_manager', 'role_manager',
      // Analysis roles
      'system_auditor', 'data_analyst',
      // Expert roles
      'expert', 'domain_expert', 'external_expert', 'evaluator', 'judge', 'mentor', 'facilitator',
      // Operational roles
      'team_member', 'partner', 'stakeholder',
      // Default roles
      'innovator', 'viewer'
    ]) as UserRole[];
    
    for (const role of rolePriority) {
      if (roles.includes(role)) {
        return role;
      }
    }
    
    return 'innovator'; // Default role
  };

  const canAccess = (feature: keyof RolePermissions): boolean => {
    return permissions[feature];
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    const userRoles = getUserRoles();
    return roles.some(role => userRoles.includes(role));
  };

  const getAllRoles = (): UserRole[] => {
    return getUserRoles();
  };

  const getRoleHierarchyLevel = (role: UserRole): number => {
    // Return hierarchy level (1 = highest, 5 = lowest)
    const hierarchyMap: Record<string, number> = {
      'super_admin': 1,
      'admin': 1,
      'organization_admin': 2,
      'department_head': 2,
      'sector_lead': 2,
      'innovation_manager': 2,
      'entity_manager': 3,
      'deputy_manager': 3,
      'team_lead': 3,
      'project_manager': 3,
      'expert_coordinator': 3,
      'content_manager': 3,
      'challenge_manager': 3,
      'research_lead': 3,
      'system_auditor': 3,
      'data_analyst': 3,
      'campaign_manager': 4,
      'event_manager': 4,
      'stakeholder_manager': 4,
      'partnership_manager': 4,
      'user_manager': 4,
      'role_manager': 4,
      'expert': 4,
      'domain_expert': 4,
      'external_expert': 4,
      'partner': 4,
      'team_member': 5,
      'stakeholder': 5,
      'innovator': 5,
      'viewer': 5
    };
    return hierarchyMap[role] || 5;
  };

  return {
    permissions,
    getUserRoles,
    getPrimaryRole,
    canAccess,
    hasRole,
    hasAnyRole,
    getAllRoles,
    getRoleHierarchyLevel,
  };
};