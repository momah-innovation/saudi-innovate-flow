import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Simple types to match database returns
interface UserPermission {
  user_id: string;
  role: string;
  is_active: boolean;
  expires_at?: string;
  granted_at: string;
}

interface RoleHierarchy {
  role: string;
  level: number;
  can_assign: string[];
  requires_approval_for: string[];
  description: string;
}

interface UseUserPermissionsOptions {
  userId?: string;
  role?: string;
  activeOnly?: boolean;
  autoRefresh?: boolean;
  limit?: number;
}

interface UseRoleHierarchyOptions {
  autoRefresh?: boolean;
}

// Hook for user permissions
export const useUserPermissions = (options: UseUserPermissionsOptions = {}) => {
  const { toast } = useToast();
  const {
    userId,
    role,
    activeOnly = true,
    autoRefresh = true,
    limit = 100
  } = options;

  return useQuery({
    queryKey: ['user-permissions', userId, role, activeOnly, limit],
    queryFn: async (): Promise<UserPermission[]> => {
      try {
        let query = supabase
          .from('user_roles')
          .select('*')
          .order('granted_at', { ascending: false })
          .limit(limit);

        // Apply user filter
        if (userId) {
          query = query.eq('user_id', userId);
        }

        // Apply role filter
        if (role) {
          query = query.eq('role', role as any);
        }

        // Apply active filter
        if (activeOnly) {
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

        return (data || []) as unknown as UserPermission[];
      } catch (error) {
        console.error('Error fetching user permissions:', error);
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 30000 : false,
    staleTime: 5000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook for role hierarchy
export const useRoleHierarchy = (options: UseRoleHierarchyOptions = {}) => {
  const { toast } = useToast();
  const { autoRefresh = true } = options;

  return useQuery({
    queryKey: ['role-hierarchy'],
    queryFn: async (): Promise<RoleHierarchy[]> => {
      try {
        // Since role_hierarchy table doesn't exist or has different structure,
        // return a mock hierarchy for now
        const mockHierarchy: RoleHierarchy[] = [
          {
            role: 'super_admin',
            level: 1,
            can_assign: ['admin', 'user'],
            requires_approval_for: [],
            description: 'Super Administrator'
          },
          {
            role: 'admin',
            level: 2,
            can_assign: ['user'],
            requires_approval_for: ['admin'],
            description: 'Administrator'
          },
          {
            role: 'user',
            level: 3,
            can_assign: [],
            requires_approval_for: ['user', 'admin'],
            description: 'Regular User'
          }
        ];

        return mockHierarchy;
      } catch (error) {
        console.error('Error fetching role hierarchy:', error);
        toast({
          title: "خطأ في تحميل هيكل الأدوار",
          description: "فشل في تحميل بيانات هيكل الأدوار. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 60000 : false, // 1 minute
    staleTime: 30000, // 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook to check if user has specific permission
export const useHasPermission = (permission: string) => {
  const { data: permissions } = useUserPermissions({
    userId: undefined, // Will be determined by auth context
    activeOnly: true,
    autoRefresh: false
  });

  return {
    hasPermission: permissions?.some(p => p.role === permission) || false,
    permissions: permissions || []
  };
};

// Hook to get user's effective permissions
export const useEffectivePermissions = (userId?: string) => {
  const { data: permissions, isLoading, error } = useUserPermissions({
    userId,
    activeOnly: true
  });

  const { data: hierarchy } = useRoleHierarchy();

  const effectivePermissions = React.useMemo(() => {
    if (!permissions || !hierarchy) return [];

    // Get all roles the user has
    const userRoles = permissions.map(p => p.role);

    // Calculate effective permissions based on hierarchy
    const effective = new Set<string>();
    
    userRoles.forEach(role => {
      const roleData = hierarchy.find(h => h.role === role);
      if (roleData) {
        effective.add(role);
        roleData.can_assign.forEach(assignable => effective.add(assignable));
      }
    });

    return Array.from(effective);
  }, [permissions, hierarchy]);

  return {
    effectivePermissions,
    isLoading,
    error,
    userRoles: permissions?.map(p => p.role) || []
  };
};