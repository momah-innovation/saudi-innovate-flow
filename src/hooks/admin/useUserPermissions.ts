import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
interface UserPermission {
  user_id: string;
  role: string;
  is_active: boolean;
  expires_at?: string;
  granted_at: string;
  user?: {
    display_name: string;
    email: string;
    department?: string;
    position?: string;
  };
}

interface RoleHierarchy {
  role: string;
  level: number;
  can_assign: string[];
  requires_approval_for: string[];
  description: string;
}

interface PermissionMatrix {
  role: string;
  permissions: {
    [resource: string]: {
      read: boolean;
      write: boolean;
      delete: boolean;
      admin: boolean;
    };
  };
}

interface UseUserPermissionsOptions {
  userId?: string;
  includeExpired?: boolean;
  autoRefresh?: boolean;
}

interface UseRoleHierarchyOptions {
  role?: string;
  autoRefresh?: boolean;
}

interface UsePermissionMatrixOptions {
  roles?: string[];
  autoRefresh?: boolean;
}

// Hook for user permissions
export const useUserPermissions = (options: UseUserPermissionsOptions = {}) => {
  const { toast } = useToast();
  const {
    userId,
    includeExpired = false,
    autoRefresh = true
  } = options;

  return useQuery({
    queryKey: ['user-permissions', userId, includeExpired],
    queryFn: async (): Promise<UserPermission[]> => {
      try {
        let query = supabase
          .from('user_roles')
          .select(`
            user_id,
            role,
            is_active,
            expires_at,
            granted_at,
            user:profiles!user_roles_user_id_fkey(
              display_name,
              email,
              department,
              position
            )
          `)
          .order('granted_at', { ascending: false });

        // Apply user filter
        if (userId) {
          query = query.eq('user_id', userId);
        }

        // Apply active filter
        if (!includeExpired) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) {
          toast({
            title: "خطأ في تحميل صلاحيات المستخدمين",
            description: "فشل في تحميل بيانات صلاحيات المستخدمين. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching user permissions:', error);
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 60000 : false, // 1 minute
    staleTime: 30000, // 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook for role hierarchy
export const useRoleHierarchy = (options: UseRoleHierarchyOptions = {}) => {
  const { toast } = useToast();
  const {
    role,
    autoRefresh = true
  } = options;

  return useQuery({
    queryKey: ['role-hierarchy', role],
    queryFn: async (): Promise<RoleHierarchy[]> => {
      try {
        let query = supabase
          .from('role_hierarchy')
          .select(`
            role,
            level,
            can_assign,
            requires_approval_for,
            description
          `)
          .order('level', { ascending: false });

        // Apply role filter
        if (role) {
          query = query.eq('role', role);
        }

        const { data, error } = await query;

        if (error) {
          toast({
            title: "خطأ في تحميل هيكل الأدوار",
            description: "فشل في تحميل بيانات هيكل الأدوار. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching role hierarchy:', error);
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 300000 : false, // 5 minutes
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook for permission matrix
export const usePermissionMatrix = (options: UsePermissionMatrixOptions = {}) => {
  const { toast } = useToast();
  const {
    roles,
    autoRefresh = true
  } = options;

  return useQuery({
    queryKey: ['permission-matrix', roles],
    queryFn: async (): Promise<PermissionMatrix[]> => {
      try {
        // Get current user's role to determine access level
        const { data: currentUser } = await supabase.auth.getUser();
        if (!currentUser.user) throw new Error('Not authenticated');

        // Get user's roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', currentUser.user.id)
          .eq('is_active', true);

        if (rolesError) throw rolesError;

        // Check if user has admin privileges
        const hasAdminRole = userRoles?.some(r => 
          ['super_admin', 'admin'].includes(r.role)
        );

        if (!hasAdminRole) {
          throw new Error('Insufficient privileges to view permission matrix');
        }

        // Build permission matrix based on role hierarchy
        const permissionMatrix: PermissionMatrix[] = [
          {
            role: 'super_admin',
            permissions: {
              security_audit_log: { read: true, write: true, delete: true, admin: true },
              suspicious_activities: { read: true, write: true, delete: true, admin: true },
              rate_limits: { read: true, write: true, delete: true, admin: true },
              user_roles: { read: true, write: true, delete: true, admin: true },
              role_approval_requests: { read: true, write: true, delete: true, admin: true },
              challenges: { read: true, write: true, delete: true, admin: true },
              ideas: { read: true, write: true, delete: true, admin: true },
              events: { read: true, write: true, delete: true, admin: true },
              files: { read: true, write: true, delete: true, admin: true },
              analytics: { read: true, write: true, delete: true, admin: true }
            }
          },
          {
            role: 'admin',
            permissions: {
              security_audit_log: { read: true, write: false, delete: false, admin: true },
              suspicious_activities: { read: true, write: true, delete: false, admin: true },
              rate_limits: { read: true, write: true, delete: false, admin: true },
              user_roles: { read: true, write: true, delete: false, admin: true },
              role_approval_requests: { read: true, write: true, delete: false, admin: true },
              challenges: { read: true, write: true, delete: true, admin: true },
              ideas: { read: true, write: true, delete: true, admin: true },
              events: { read: true, write: true, delete: true, admin: true },
              files: { read: true, write: true, delete: true, admin: true },
              analytics: { read: true, write: false, delete: false, admin: true }
            }
          },
          {
            role: 'challenge_manager',
            permissions: {
              security_audit_log: { read: false, write: false, delete: false, admin: false },
              suspicious_activities: { read: false, write: false, delete: false, admin: false },
              rate_limits: { read: false, write: false, delete: false, admin: false },
              user_roles: { read: false, write: false, delete: false, admin: false },
              role_approval_requests: { read: false, write: false, delete: false, admin: false },
              challenges: { read: true, write: true, delete: true, admin: true },
              ideas: { read: true, write: true, delete: false, admin: false },
              events: { read: true, write: true, delete: false, admin: false },
              files: { read: true, write: true, delete: false, admin: false },
              analytics: { read: true, write: false, delete: false, admin: false }
            }
          },
          {
            role: 'organization_admin',
            permissions: {
              security_audit_log: { read: false, write: false, delete: false, admin: false },
              suspicious_activities: { read: false, write: false, delete: false, admin: false },
              rate_limits: { read: false, write: false, delete: false, admin: false },
              user_roles: { read: true, write: false, delete: false, admin: false },
              role_approval_requests: { read: true, write: false, delete: false, admin: false },
              challenges: { read: true, write: true, delete: false, admin: false },
              ideas: { read: true, write: true, delete: false, admin: false },
              events: { read: true, write: true, delete: false, admin: false },
              files: { read: true, write: true, delete: false, admin: false },
              analytics: { read: true, write: false, delete: false, admin: false }
            }
          },
          {
            role: 'user',
            permissions: {
              security_audit_log: { read: false, write: false, delete: false, admin: false },
              suspicious_activities: { read: false, write: false, delete: false, admin: false },
              rate_limits: { read: false, write: false, delete: false, admin: false },
              user_roles: { read: false, write: false, delete: false, admin: false },
              role_approval_requests: { read: false, write: false, delete: false, admin: false },
              challenges: { read: true, write: false, delete: false, admin: false },
              ideas: { read: true, write: true, delete: false, admin: false },
              events: { read: true, write: false, delete: false, admin: false },
              files: { read: true, write: true, delete: false, admin: false },
              analytics: { read: false, write: false, delete: false, admin: false }
            }
          }
        ];

        // Filter by requested roles if specified
        if (roles && roles.length > 0) {
          return permissionMatrix.filter(matrix => roles.includes(matrix.role));
        }

        return permissionMatrix;
      } catch (error) {
        console.error('Error fetching permission matrix:', error);
        toast({
          title: "خطأ في تحميل مصفوفة الصلاحيات",
          description: "فشل في تحميل بيانات مصفوفة الصلاحيات. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 300000 : false, // 5 minutes
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Helper hook to check current user permissions
export const useCurrentUserPermissions = () => {
  const { data: userPermissions } = useUserPermissions({ 
    userId: undefined, // Will get current user 
    autoRefresh: true 
  });

  const hasRole = (role: string): boolean => {
    return userPermissions?.some(p => p.role === role && p.is_active) || false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const hasPermission = (resource: string, action: 'read' | 'write' | 'delete' | 'admin'): boolean => {
    const { data: permissionMatrix } = usePermissionMatrix();
    
    if (!userPermissions || !permissionMatrix) return false;

    const userRoles = userPermissions
      .filter(p => p.is_active)
      .map(p => p.role);

    return userRoles.some(role => {
      const matrix = permissionMatrix.find(m => m.role === role);
      return matrix?.permissions[resource]?.[action] || false;
    });
  };

  return {
    userPermissions,
    hasRole,
    hasAnyRole,
    hasPermission,
    isAdmin: hasAnyRole(['super_admin', 'admin']),
    isSuperAdmin: hasRole('super_admin')
  };
};