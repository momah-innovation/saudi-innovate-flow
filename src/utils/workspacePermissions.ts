import { supabase } from '@/integrations/supabase/client';
import type { WorkspaceType } from '@/types/workspace';

interface PermissionCheck {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  context?: Record<string, any>;
}

interface RolePermissions {
  [key: string]: {
    permissions: string[];
    inherits?: string[];
    restrictions?: string[];
  };
}

// Workspace-specific role permissions
const WORKSPACE_ROLE_PERMISSIONS: Record<WorkspaceType, RolePermissions> = {
  user: {
    owner: {
      permissions: ['*'],
      restrictions: []
    },
    member: {
      permissions: ['read:profile', 'write:profile', 'read:ideas', 'write:ideas', 'read:challenges'],
      restrictions: ['delete:*', 'admin:*']
    },
    guest: {
      permissions: ['read:profile', 'read:ideas', 'read:challenges'],
      restrictions: ['write:*', 'delete:*', 'admin:*']
    }
  },
  expert: {
    admin: {
      permissions: ['*'],
      restrictions: []
    },
    expert: {
      permissions: [
        'read:*', 'write:evaluations', 'write:consultations', 
        'read:submissions', 'write:reviews', 'read:knowledge_base'
      ],
      restrictions: ['delete:workspace', 'admin:members']
    },
    evaluator: {
      permissions: ['read:submissions', 'write:evaluations', 'read:challenges'],
      restrictions: ['delete:*', 'admin:*', 'write:workspace']
    }
  },
  organization: {
    admin: {
      permissions: ['*'],
      restrictions: []
    },
    manager: {
      permissions: [
        'read:*', 'write:teams', 'write:projects', 'write:policies',
        'read:analytics', 'admin:teams'
      ],
      restrictions: ['delete:workspace', 'admin:workspace']
    },
    coordinator: {
      permissions: [
        'read:teams', 'write:events', 'read:projects', 'write:communications'
      ],
      restrictions: ['delete:*', 'admin:*', 'write:policies']
    },
    member: {
      permissions: ['read:teams', 'read:projects', 'read:events'],
      restrictions: ['write:*', 'delete:*', 'admin:*']
    }
  },
  team: {
    lead: {
      permissions: ['*'],
      restrictions: []
    },
    manager: {
      permissions: [
        'read:*', 'write:projects', 'write:tasks', 'admin:members',
        'write:meetings', 'read:analytics'
      ],
      restrictions: ['delete:workspace', 'admin:workspace']
    },
    member: {
      permissions: [
        'read:projects', 'write:tasks', 'read:meetings', 'write:collaboration'
      ],
      restrictions: ['delete:*', 'admin:*', 'write:workspace']
    }
  },
  project: {
    manager: {
      permissions: ['*'],
      restrictions: []
    },
    contributor: {
      permissions: [
        'read:*', 'write:tasks', 'write:files', 'write:collaboration'
      ],
      restrictions: ['delete:project', 'admin:*']
    },
    viewer: {
      permissions: ['read:*'],
      restrictions: ['write:*', 'delete:*', 'admin:*']
    }
  },
  admin: {
    super_admin: {
      permissions: ['*'],
      restrictions: []
    },
    admin: {
      permissions: [
        'read:*', 'write:*', 'admin:users', 'admin:workspaces', 
        'read:system', 'write:settings'
      ],
      restrictions: ['delete:system', 'admin:system']
    },
    moderator: {
      permissions: [
        'read:*', 'write:content', 'admin:content', 'read:reports'
      ],
      restrictions: ['delete:*', 'admin:users', 'admin:system']
    }
  },
  partner: {
    admin: {
      permissions: ['*'],
      restrictions: []
    },
    partner: {
      permissions: [
        'read:partnerships', 'write:collaborations', 'read:shared_resources',
        'write:communications'
      ],
      restrictions: ['delete:*', 'admin:*', 'read:internal']
    },
    collaborator: {
      permissions: [
        'read:shared_projects', 'write:collaboration', 'read:shared_files'
      ],
      restrictions: ['write:*', 'delete:*', 'admin:*']
    }
  },
  stakeholder: {
    primary: {
      permissions: [
        'read:*', 'write:feedback', 'read:reports', 'write:requirements'
      ],
      restrictions: ['delete:*', 'admin:*', 'write:internal']
    },
    observer: {
      permissions: ['read:reports', 'read:progress', 'read:summaries'],
      restrictions: ['write:*', 'delete:*', 'admin:*']
    }
  }
};

export class WorkspacePermissionManager {
  private userId: string;
  private workspaceType: WorkspaceType;
  private workspaceId: string;
  private userRole: string | null = null;
  private permissionsCache = new Map<string, boolean>();
  private cacheExpiry = new Map<string, number>();

  constructor(userId: string, workspaceType: WorkspaceType, workspaceId: string) {
    this.userId = userId;
    this.workspaceType = workspaceType;
    this.workspaceId = workspaceId;
  }

  // Get user's role in the workspace
  async getUserRole(): Promise<string | null> {
    if (this.userRole) return this.userRole;

    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', this.workspaceId)
        .eq('user_id', this.userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      this.userRole = data?.role || null;
      return this.userRole;
    } catch (err) {
      console.error('Failed to get user role:', err);
      return null;
    }
  }

  // Check if user has specific permission
  async hasPermission(check: PermissionCheck): Promise<boolean> {
    const cacheKey = `${check.resource}:${check.action}:${JSON.stringify(check.context)}`;
    
    // Check cache first
    if (this.permissionsCache.has(cacheKey)) {
      const expiry = this.cacheExpiry.get(cacheKey);
      if (expiry && Date.now() < expiry) {
        return this.permissionsCache.get(cacheKey)!;
      }
    }

    const hasPermission = await this.checkPermission(check);
    
    // Cache for 5 minutes
    this.permissionsCache.set(cacheKey, hasPermission);
    this.cacheExpiry.set(cacheKey, Date.now() + 5 * 60 * 1000);
    
    return hasPermission;
  }

  // Internal permission check logic
  private async checkPermission(check: PermissionCheck): Promise<boolean> {
    const userRole = await this.getUserRole();
    if (!userRole) return false;

    const rolePermissions = WORKSPACE_ROLE_PERMISSIONS[this.workspaceType]?.[userRole];
    if (!rolePermissions) return false;

    const { permissions, restrictions = [] } = rolePermissions;
    const permissionString = `${check.action}:${check.resource}`;

    // Check restrictions first
    for (const restriction of restrictions) {
      if (this.matchesPattern(permissionString, restriction)) {
        return false;
      }
    }

    // Check permissions
    for (const permission of permissions) {
      if (permission === '*' || this.matchesPattern(permissionString, permission)) {
        return true;
      }
    }

    // Check database-level permissions for complex cases
    return this.checkDatabasePermission(check);
  }

  // Database-level permission check
  private async checkDatabasePermission(check: PermissionCheck): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_workspace_permission', {
        workspace_uuid: this.workspaceId,
        user_uuid: this.userId,
        required_permission: check.action
      });

      if (error) throw error;
      return data || false;
    } catch (err) {
      console.error('Database permission check failed:', err);
      return false;
    }
  }

  // Pattern matching for permissions
  private matchesPattern(permission: string, pattern: string): boolean {
    if (pattern === '*') return true;
    if (pattern === permission) return true;
    
    // Support wildcards
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(permission);
  }

  // Batch permission check
  async hasPermissions(checks: PermissionCheck[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    await Promise.all(
      checks.map(async (check, index) => {
        const key = `${check.resource}_${check.action}`;
        results[key] = await this.hasPermission(check);
      })
    );
    
    return results;
  }

  // Get all permissions for user's role
  async getAllPermissions(): Promise<string[]> {
    const userRole = await this.getUserRole();
    if (!userRole) return [];

    const rolePermissions = WORKSPACE_ROLE_PERMISSIONS[this.workspaceType]?.[userRole];
    return rolePermissions?.permissions || [];
  }

  // Clear permissions cache
  clearCache(): void {
    this.permissionsCache.clear();
    this.cacheExpiry.clear();
    this.userRole = null;
  }

  // Check if user can perform multiple actions on a resource
  async canPerformActions(resource: string, actions: string[]): Promise<Record<string, boolean>> {
    const checks = actions.map(action => ({
      resource,
      action: action as any
    }));
    
    return this.hasPermissions(checks);
  }

  // Check workspace-level permissions
  async hasWorkspaceAccess(accessLevel: 'view' | 'edit' | 'admin' = 'view'): Promise<boolean> {
    return this.hasPermission({
      resource: 'workspace',
      action: accessLevel === 'view' ? 'read' : accessLevel === 'edit' ? 'write' : 'admin'
    });
  }
}

// Utility functions for easy permission checking
export async function checkWorkspacePermission(
  userId: string,
  workspaceType: WorkspaceType,
  workspaceId: string,
  check: PermissionCheck
): Promise<boolean> {
  const manager = new WorkspacePermissionManager(userId, workspaceType, workspaceId);
  return manager.hasPermission(check);
}

export async function getUserWorkspaceRole(
  userId: string,
  workspaceId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.role || null;
  } catch (err) {
    console.error('Failed to get user workspace role:', err);
    return null;
  }
}

// React hook for permission checking
export function useWorkspacePermissions(
  workspaceType: WorkspaceType,
  workspaceId: string,
  userId?: string
) {
  if (!userId) {
    return {
      hasPermission: async () => false,
      hasPermissions: async () => ({}),
      getUserRole: async () => null,
      checkAccess: async () => false
    };
  }

  const manager = new WorkspacePermissionManager(userId, workspaceType, workspaceId);

  return {
    hasPermission: (check: PermissionCheck) => manager.hasPermission(check),
    hasPermissions: (checks: PermissionCheck[]) => manager.hasPermissions(checks),
    getUserRole: () => manager.getUserRole(),
    checkAccess: (level: 'view' | 'edit' | 'admin' = 'view') => manager.hasWorkspaceAccess(level),
    canPerformActions: (resource: string, actions: string[]) => manager.canPerformActions(resource, actions),
    clearCache: () => manager.clearCache()
  };
}