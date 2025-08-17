import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { useRoleApprovalRequests, useUserRoles, useRoleManagement as useRoleOps } from '@/hooks/admin/useRoleManagement';

export interface RoleRequestItem {
  id: string;
  requester_id: string;
  target_user_id: string;
  requested_role: string;
  justification?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewer_id?: string;
  review_notes?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  requester?: {
    id: string;
    email: string;
    display_name?: string;
  };
  target_user?: {
    id: string;
    email: string;
    display_name?: string;
  };
}

export interface UserRoleItem {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  granted_at: string;
  expires_at?: string;
  granted_by?: string;
  // Joined data
  user?: {
    id: string;
    email: string;
    display_name?: string;
  };
}

export const useRoleManagement = () => {
  const errorHandler = createErrorHandler({ component: 'useRoleManagement' });
  
  // Use existing hooks from admin folder
  const { data: roleRequests = [], isLoading: requestsLoading, error: requestsError, refetch: loadRoleRequests, isError: requestsIsError } = useRoleApprovalRequests();
  const { data: userRoles = [], isLoading: rolesLoading, error: rolesError, refetch: loadUserRoles, isError: rolesIsError } = useUserRoles();
  const { assignRole: performAssignRole, revokeRole: performRevokeRole, approveRoleRequest: performApproveRequest } = useRoleOps();

  const createRoleRequest = useCallback(async (requestData: any): Promise<any> => {
    return errorHandler.withErrorHandling(async () => {
      // Mock implementation - in reality this would use the proper admin hooks
      await loadRoleRequests();
      return { id: Math.random().toString(36).substring(2), ...requestData };
    }, { operation: 'create_role_request' });
  }, [loadRoleRequests, errorHandler]);

  const updateRoleRequest = useCallback(async (requestId: string, requestData: any): Promise<any> => {
    return errorHandler.withErrorHandling(async () => {
      // Mock implementation - in reality this would use the proper admin hooks
      await loadRoleRequests();
      return { id: requestId, ...requestData };
    }, { operation: 'update_role_request' });
  }, [loadRoleRequests, errorHandler]);

  const approveRoleRequest = useCallback(async (requestId: string, reviewNotes?: string): Promise<any> => {
    return errorHandler.withErrorHandling(async () => {
      await performApproveRequest.mutateAsync({ requestId, approve: true, reviewerNotes: reviewNotes });
      await loadRoleRequests();
      return { id: requestId, status: 'approved' };
    }, { operation: 'approve_role_request' });
  }, [loadRoleRequests, errorHandler, performApproveRequest]);

  const rejectRoleRequest = useCallback(async (requestId: string, reviewNotes?: string): Promise<any> => {
    return errorHandler.withErrorHandling(async () => {
      await performApproveRequest.mutateAsync({ requestId, approve: false, reviewerNotes: reviewNotes });
      await loadRoleRequests();
      return { id: requestId, status: 'rejected' };
    }, { operation: 'reject_role_request' });
  }, [loadRoleRequests, errorHandler, performApproveRequest]);

  const assignRole = useCallback(async (userId: string, role: string, expiresAt?: string): Promise<any> => {
    return errorHandler.withErrorHandling(async () => {
      await performAssignRole.mutateAsync({ targetUserId: userId, role, expiresAt });
      await loadUserRoles();
      return { user_id: userId, role, expires_at: expiresAt };
    }, { operation: 'assign_role' });
  }, [loadUserRoles, errorHandler, performAssignRole]);

  const revokeRole = useCallback(async (roleId: string): Promise<void> => {
    await errorHandler.withErrorHandling(async () => {
      await performRevokeRole.mutateAsync({ targetUserId: roleId, role: 'innovator' }); // Mock implementation
      await loadUserRoles();
    }, { operation: 'revoke_role' });
  }, [loadUserRoles, errorHandler, performRevokeRole]);

  return {
    roleRequests,
    userRoles,
    loading: requestsLoading || rolesLoading,
    error: requestsIsError ? requestsError : rolesIsError ? rolesError : null,
    loadRoleRequests,
    loadUserRoles,
    createRoleRequest,
    updateRoleRequest,
    approveRoleRequest,
    rejectRoleRequest,
    assignRole,
    revokeRole
  };
};