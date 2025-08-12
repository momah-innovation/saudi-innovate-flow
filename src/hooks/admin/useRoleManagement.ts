import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
interface RoleApprovalRequest {
  id: string;
  requester_id: string;
  target_user_id: string;
  requested_role: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  expires_at?: string;
  approver_id?: string;
  reviewer_notes?: string;
  created_at: string;
  reviewed_at?: string;
  // Joined data
  requester?: {
    display_name: string;
    email: string;
  };
  target_user?: {
    display_name: string;
    email: string;
  };
  approver?: {
    display_name: string;
    email: string;
  };
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  expires_at?: string;
  granted_at: string;
  user?: {
    display_name: string;
    email: string;
  };
}

interface UseRoleApprovalRequestsOptions {
  status?: 'pending' | 'approved' | 'rejected' | 'expired' | 'all';
  requester?: string;
  targetUser?: string;
  autoRefresh?: boolean;
  limit?: number;
}

interface UseUserRolesOptions {
  userId?: string;
  role?: string;
  activeOnly?: boolean;
  autoRefresh?: boolean;
  limit?: number;
}

// Hook for role approval requests
export const useRoleApprovalRequests = (options: UseRoleApprovalRequestsOptions = {}) => {
  const { toast } = useToast();
  const {
    status = 'all',
    requester,
    targetUser,
    autoRefresh = true,
    limit = 50
  } = options;

  return useQuery({
    queryKey: ['role-approval-requests', status, requester, targetUser, limit],
    queryFn: async (): Promise<RoleApprovalRequest[]> => {
      try {
        let query = supabase
          .from('role_approval_requests')
          .select(`
            id,
            requester_id,
            target_user_id,
            requested_role,
            justification,
            status,
            expires_at,
            approver_id,
            reviewer_notes,
            created_at,
            reviewed_at,
            requester:profiles!role_approval_requests_requester_id_fkey(
              display_name,
              email
            ),
            target_user:profiles!role_approval_requests_target_user_id_fkey(
              display_name,
              email
            ),
            approver:profiles!role_approval_requests_approver_id_fkey(
              display_name,
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        // Apply status filter
        if (status !== 'all') {
          query = query.eq('status', status);
        }

        // Apply requester filter
        if (requester) {
          query = query.eq('requester_id', requester);
        }

        // Apply target user filter
        if (targetUser) {
          query = query.eq('target_user_id', targetUser);
        }

        const { data, error } = await query;

        if (error) {
          toast({
            title: "خطأ في تحميل طلبات الأدوار",
            description: "فشل في تحميل بيانات طلبات الأدوار. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching role approval requests:', error);
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 30000 : false, // 30 seconds
    staleTime: 5000, // 5 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook for user roles
export const useUserRoles = (options: UseUserRolesOptions = {}) => {
  const { toast } = useToast();
  const {
    userId,
    role,
    activeOnly = true,
    autoRefresh = true,
    limit = 100
  } = options;

  return useQuery({
    queryKey: ['user-roles', userId, role, activeOnly, limit],
    queryFn: async (): Promise<UserRole[]> => {
      try {
        let query = supabase
          .from('user_roles')
          .select(`
            id,
            user_id,
            role,
            is_active,
            expires_at,
            granted_at,
            user:profiles!user_roles_user_id_fkey(
              display_name,
              email
            )
          `)
          .order('granted_at', { ascending: false })
          .limit(limit);

        // Apply user filter
        if (userId) {
          query = query.eq('user_id', userId);
        }

        // Apply role filter
        if (role) {
          query = query.eq('role', role);
        }

        // Apply active filter
        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) {
          toast({
            title: "خطأ في تحميل أدوار المستخدمين",
            description: "فشل في تحميل بيانات أدوار المستخدمين. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching user roles:', error);
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 30000 : false, // 30 seconds
    staleTime: 5000, // 5 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook for role management mutations
export const useRoleManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Assign role mutation
  const assignRole = useMutation({
    mutationFn: async ({ 
      targetUserId, 
      role, 
      justification, 
      expiresAt 
    }: { 
      targetUserId: string; 
      role: string; 
      justification?: string; 
      expiresAt?: string;
    }) => {
      const { data, error } = await supabase.rpc('assign_role_with_validation', {
        target_user_id: targetUserId,
        target_role: role,
        justification: justification || null,
        expires_at: expiresAt || null
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['role-approval-requests'] });
      
      toast({
        title: "تم تعيين الدور بنجاح",
        description: data.requires_approval 
          ? "تم إرسال طلب الموافقة للمراجعة"
          : "تم تعيين الدور مباشرة",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تعيين الدور",
        description: error.message || "فشل في تعيين الدور. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  });

  // Revoke role mutation
  const revokeRole = useMutation({
    mutationFn: async ({ 
      targetUserId, 
      role, 
      reason 
    }: { 
      targetUserId: string; 
      role: string; 
      reason?: string;
    }) => {
      const { data, error } = await supabase.rpc('revoke_role_with_validation', {
        target_user_id: targetUserId,
        target_role: role,
        reason: reason || null
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      
      toast({
        title: "تم إلغاء الدور بنجاح",
        description: "تم إلغاء الدور من المستخدم",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إلغاء الدور",
        description: error.message || "فشل في إلغاء الدور. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  });

  // Approve role request mutation
  const approveRoleRequest = useMutation({
    mutationFn: async ({ 
      requestId, 
      approve, 
      reviewerNotes 
    }: { 
      requestId: string; 
      approve: boolean; 
      reviewerNotes?: string;
    }) => {
      const { data, error } = await supabase.rpc('approve_role_request', {
        request_id: requestId,
        approve: approve,
        reviewer_notes: reviewerNotes || null
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['role-approval-requests'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      
      toast({
        title: variables.approve ? "تم قبول الطلب" : "تم رفض الطلب",
        description: variables.approve 
          ? "تم قبول طلب تعيين الدور وتفعيله"
          : "تم رفض طلب تعيين الدور",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في معالجة الطلب",
        description: error.message || "فشل في معالجة طلب الدور. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  });

  return {
    assignRole,
    revokeRole,
    approveRoleRequest,
    isAssigning: assignRole.isPending,
    isRevoking: revokeRole.isPending,
    isApproving: approveRoleRequest.isPending
  };
};