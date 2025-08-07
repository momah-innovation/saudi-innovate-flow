import { useAuth } from '@/contexts/AuthContext';
import { useSettingsManager } from '@/hooks/useSettingsManager';

export type UserRole = 'super_admin' | 'admin' | 'team_member' | 'expert' | 'innovator' | 'partner' | 'stakeholder';

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
}

export const useRoleAccess = () => {
  const { userProfile, hasRole } = useAuth();
  const { getSettingValue } = useSettingsManager();

  const permissions: RolePermissions = {
    // Admin permissions
    canManageUsers: hasRole('admin') || hasRole('super_admin'),
    canManageSystem: hasRole('super_admin'),
    canManageChallenges: hasRole('admin') || hasRole('super_admin') || hasRole('team_member'),
    canManagePartners: hasRole('admin') || hasRole('super_admin'),
    canViewAnalytics: hasRole('admin') || hasRole('super_admin') || hasRole('team_member'),
    canManageTeams: hasRole('admin') || hasRole('super_admin'),
    
    // Expert permissions
    canEvaluateIdeas: hasRole('expert') || hasRole('admin') || hasRole('super_admin'),
    canAccessExpertTools: hasRole('expert') || hasRole('admin') || hasRole('super_admin'),
    
    // User permissions (available to all authenticated users)
    canSubmitIdeas: true,
    canParticipateInChallenges: true,
    canViewPublicContent: true,
    
    // Partner permissions
    canManageOpportunities: hasRole('partner') || hasRole('admin') || hasRole('super_admin'),
    canViewPartnerDashboard: hasRole('partner') || hasRole('admin') || hasRole('super_admin'),
    
    // Stakeholder permissions
    canViewStakeholderReports: hasRole('stakeholder') || hasRole('admin') || hasRole('super_admin'),
  };

  const getUserRoles = (): UserRole[] => {
    return userProfile?.user_roles?.map(role => role.role as UserRole) || [];
  };

  const getPrimaryRole = (): UserRole => {
    const roles = getUserRoles();
    
    // Priority order for determining primary role
    const rolePriority = getSettingValue('role_priority_order', ['super_admin', 'admin', 'team_member', 'expert', 'partner', 'stakeholder', 'innovator']) as UserRole[];
    
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

  return {
    permissions,
    getUserRoles,
    getPrimaryRole,
    canAccess,
    hasRole,
  };
};