import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debugLog } from '@/utils/debugLogger';

// Simple types to match database returns
interface RoleApprovalRequest {
  id: string;
  requester_id: string;
  target_user_id: string;
  requested_role: string;
  justification: string;
  status: string;
  expires_at?: string;
  approver_id?: string;
  reviewer_notes?: string;
  created_at: string;
  reviewed_at?: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  expires_at?: string;
  granted_at: string;
}

interface UseRoleApprovalRequestsOptions {
  status?: string;
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
          .select('*')
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
        debugLog.error('Error fetching role approval requests', { error });
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 30000 : false,
    staleTime: 5000,
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
            title: "خطأ في تحميل أدوار المستخدمين",
            description: "فشل في تحميل بيانات أدوار المستخدمين. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        debugLog.error('Error fetching user roles', { error });
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 30000 : false,
    staleTime: 5000,
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
        target_role: role as any,
        justification: justification || null,
        expires_at: expiresAt || null
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['role-approval-requests'] });
      
      toast({
        title: "تم تعيين الدور بنجاح",
        description: data?.requires_approval 
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
        target_role: role as any,
        reason: reason || null
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
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