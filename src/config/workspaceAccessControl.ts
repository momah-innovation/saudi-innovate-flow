/**
 * Workspace Access Control Configuration
 * Defines role-based access control for different workspace types
 */

export interface WorkspacePermissions {
  canView: boolean;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canManageTeam: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageSettings: boolean;
  canAccessCollaboration: boolean;
  canInviteUsers: boolean;
  canAssignTasks: boolean;
  canViewReports: boolean;
}

export interface WorkspaceAccessConfig {
  allowedRoles: string[];
  permissions: WorkspacePermissions;
  contextAccess: {
    canAccessOwnData: boolean;
    canAccessTeamData: boolean;
    canAccessOrgData: boolean;
    canAccessGlobalData: boolean;
  };
}

/**
 * Access control matrix for different workspace types
 */
export const WORKSPACE_ACCESS_CONTROL: Record<string, WorkspaceAccessConfig> = {
  user: {
    allowedRoles: ['innovator', 'user', 'team_member'],
    permissions: {
      canView: true,
      canEdit: true,
      canCreate: true,
      canDelete: true, // Own data only
      canManageTeam: false,
      canViewAnalytics: false,
      canExportData: true, // Own data only
      canManageSettings: false,
      canAccessCollaboration: true,
      canInviteUsers: false,
      canAssignTasks: false,
      canViewReports: false
    },
    contextAccess: {
      canAccessOwnData: true,
      canAccessTeamData: false,
      canAccessOrgData: false,
      canAccessGlobalData: false
    }
  },

  expert: {
    allowedRoles: ['domain_expert', 'evaluator', 'expert'],
    permissions: {
      canView: true,
      canEdit: true,
      canCreate: true,
      canDelete: false,
      canManageTeam: false,
      canViewAnalytics: true,
      canExportData: true,
      canManageSettings: false,
      canAccessCollaboration: true,
      canInviteUsers: false,
      canAssignTasks: false,
      canViewReports: true
    },
    contextAccess: {
      canAccessOwnData: true,
      canAccessTeamData: true,
      canAccessOrgData: false,
      canAccessGlobalData: false
    }
  },

  team: {
    allowedRoles: ['team_member', 'team_leader', 'project_manager'],
    permissions: {
      canView: true,
      canEdit: true,
      canCreate: true,
      canDelete: true,
      canManageTeam: true,
      canViewAnalytics: true,
      canExportData: true,
      canManageSettings: true,
      canAccessCollaboration: true,
      canInviteUsers: true,
      canAssignTasks: true,
      canViewReports: true
    },
    contextAccess: {
      canAccessOwnData: true,
      canAccessTeamData: true,
      canAccessOrgData: false,
      canAccessGlobalData: false
    }
  },

  organization: {
    allowedRoles: ['admin', 'org_admin', 'manager'],
    permissions: {
      canView: true,
      canEdit: true,
      canCreate: true,
      canDelete: true,
      canManageTeam: true,
      canViewAnalytics: true,
      canExportData: true,
      canManageSettings: true,
      canAccessCollaboration: true,
      canInviteUsers: true,
      canAssignTasks: true,
      canViewReports: true
    },
    contextAccess: {
      canAccessOwnData: true,
      canAccessTeamData: true,
      canAccessOrgData: true,
      canAccessGlobalData: false
    }
  },

  partner: {
    allowedRoles: ['partner', 'collaborator', 'external_partner'],
    permissions: {
      canView: true,
      canEdit: false,
      canCreate: true,
      canDelete: false,
      canManageTeam: false,
      canViewAnalytics: false,
      canExportData: false,
      canManageSettings: false,
      canAccessCollaboration: true,
      canInviteUsers: false,
      canAssignTasks: false,
      canViewReports: false
    },
    contextAccess: {
      canAccessOwnData: true,
      canAccessTeamData: false,
      canAccessOrgData: false,
      canAccessGlobalData: false
    }
  },

  admin: {
    allowedRoles: ['super_admin', 'admin', 'system_admin'],
    permissions: {
      canView: true,
      canEdit: true,
      canCreate: true,
      canDelete: true,
      canManageTeam: true,
      canViewAnalytics: true,
      canExportData: true,
      canManageSettings: true,
      canAccessCollaboration: true,
      canInviteUsers: true,
      canAssignTasks: true,
      canViewReports: true
    },
    contextAccess: {
      canAccessOwnData: true,
      canAccessTeamData: true,
      canAccessOrgData: true,
      canAccessGlobalData: true
    }
  }
};

/**
 * Special access rules for cross-workspace interactions
 */
export const CROSS_WORKSPACE_ACCESS = {
  // Admin can access all workspaces
  adminAccess: ['super_admin', 'admin'],
  
  // Team leaders can access user workspaces of their team members
  teamLeaderAccess: {
    roles: ['team_leader', 'project_manager'],
    canAccess: ['user', 'team']
  },
  
  // Experts can access specific user workspaces when evaluating
  expertAccess: {
    roles: ['domain_expert', 'evaluator'],
    canAccess: ['user'], // Limited to evaluation context
    conditions: ['evaluation_assignment', 'expert_consultation']
  },
  
  // Partners can access organization workspace for partnerships
  partnerAccess: {
    roles: ['partner', 'external_partner'],
    canAccess: ['organization'],
    conditions: ['active_partnership', 'partnership_proposal']
  }
};

/**
 * Data visibility rules based on privacy levels
 */
export const DATA_VISIBILITY_RULES = {
  public: {
    visibleTo: 'all',
    workspaces: ['user', 'expert', 'team', 'organization', 'partner', 'admin']
  },
  
  organization: {
    visibleTo: 'organization_members',
    workspaces: ['team', 'organization', 'admin']
  },
  
  team: {
    visibleTo: 'team_members',
    workspaces: ['team', 'admin']
  },
  
  private: {
    visibleTo: 'owner_only',
    workspaces: ['user', 'admin'] // Admin for support/debugging
  },
  
  confidential: {
    visibleTo: 'authorized_personnel',
    workspaces: ['admin'],
    requiresElevation: true
  }
};

/**
 * Get workspace permissions for a user role
 */
export function getWorkspacePermissions(
  workspaceType: string, 
  userRoles: string[]
): WorkspacePermissions | null {
  const config = WORKSPACE_ACCESS_CONTROL[workspaceType];
  if (!config) return null;
  
  // Check if user has any of the allowed roles
  const hasAccess = userRoles.some(role => config.allowedRoles.includes(role));
  if (!hasAccess) return null;
  
  return config.permissions;
}

/**
 * Check if user can access a specific workspace type
 */
export function canAccessWorkspace(
  workspaceType: string, 
  userRoles: string[], 
  userId?: string, 
  workspaceOwnerId?: string
): boolean {
  const config = WORKSPACE_ACCESS_CONTROL[workspaceType];
  if (!config) return false;
  
  // Check direct role access
  const hasDirectAccess = userRoles.some(role => config.allowedRoles.includes(role));
  if (hasDirectAccess) return true;
  
  // Check admin access
  if (userRoles.some(role => CROSS_WORKSPACE_ACCESS.adminAccess.includes(role))) {
    return true;
  }
  
  // Check if accessing own workspace
  if (userId === workspaceOwnerId) return true;
  
  // Check cross-workspace access rules
  for (const access of Object.values(CROSS_WORKSPACE_ACCESS)) {
    if (typeof access === 'object' && 'roles' in access && 'canAccess' in access) {
      const hasRole = userRoles.some(role => access.roles.includes(role));
      const canAccessType = access.canAccess.includes(workspaceType);
      
      if (hasRole && canAccessType) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get context-specific access level
 */
export function getContextAccess(
  workspaceType: string, 
  userRoles: string[]
): typeof WORKSPACE_ACCESS_CONTROL[string]['contextAccess'] | null {
  const config = WORKSPACE_ACCESS_CONTROL[workspaceType];
  if (!config) return null;
  
  const hasAccess = userRoles.some(role => config.allowedRoles.includes(role));
  if (!hasAccess) return null;
  
  return config.contextAccess;
}