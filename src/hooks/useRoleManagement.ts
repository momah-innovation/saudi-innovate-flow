import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

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
  const {
    data: roleRequests = [],
    isLoading: requestsLoading,
    error: requestsError,
    refetch: loadRoleRequests,
    isError: requestsIsError
  } = useQuery({
    queryKey: ['role-requests'],
    queryFn: async () => {
      logger.info('Fetching role requests', { component: 'useRoleManagement' });
      
      const { data, error } = await supabase
        .from('role_approval_requests')
        .select(`
          *,
          requester:requester_id(id, email, display_name),
          target_user:target_user_id(id, email, display_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch role requests', { component: 'useRoleManagement' }, error);
        throw error;
      }
      
      logger.info('Role requests fetched successfully', { 
        component: 'useRoleManagement',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const {
    data: userRoles = [],
    isLoading: rolesLoading,
    error: rolesError,
    refetch: loadUserRoles,
    isError: rolesIsError
  } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      logger.info('Fetching user roles', { component: 'useRoleManagement' });
      
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          user:user_id(id, email, display_name)
        `)
        .order('granted_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch user roles', { component: 'useRoleManagement' }, error);
        throw error;
      }
      
      logger.info('User roles fetched successfully', { 
        component: 'useRoleManagement',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const createRoleRequest = useCallback(async (requestData: any): Promise<any> => {
    logger.info('Creating role request', { component: 'useRoleManagement' });
    
    const { data, error } = await supabase
      .from('role_approval_requests')
      .insert([requestData])
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to create role request', { component: 'useRoleManagement' }, error);
      throw error;
    }
    
    logger.info('Role request created successfully', { component: 'useRoleManagement' });
    
    // Refetch the list after creation
    await loadRoleRequests();
    return data;
  }, [loadRoleRequests]);

  const updateRoleRequest = useCallback(async (requestId: string, requestData: any): Promise<any> => {
    logger.info('Updating role request', { component: 'useRoleManagement', requestId });
    
    const { data, error } = await supabase
      .from('role_approval_requests')
      .update(requestData)
      .eq('id', requestId)
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to update role request', { component: 'useRoleManagement', requestId }, error);
      throw error;
    }
    
    logger.info('Role request updated successfully', { component: 'useRoleManagement', requestId });
    
    // Refetch the list after update
    await loadRoleRequests();
    return data;
  }, [loadRoleRequests]);

  const approveRoleRequest = useCallback(async (requestId: string, reviewNotes?: string): Promise<any> => {
    logger.info('Approving role request', { component: 'useRoleManagement', requestId });
    
    const { data, error } = await supabase
      .from('role_approval_requests')
      .update({
        status: 'approved',
        review_notes: reviewNotes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to approve role request', { component: 'useRoleManagement', requestId }, error);
      throw error;
    }
    
    logger.info('Role request approved successfully', { component: 'useRoleManagement', requestId });
    
    await loadRoleRequests();
    return data;
  }, [loadRoleRequests]);

  const rejectRoleRequest = useCallback(async (requestId: string, reviewNotes?: string): Promise<any> => {
    logger.info('Rejecting role request', { component: 'useRoleManagement', requestId });
    
    const { data, error } = await supabase
      .from('role_approval_requests')
      .update({
        status: 'rejected',
        review_notes: reviewNotes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to reject role request', { component: 'useRoleManagement', requestId }, error);
      throw error;
    }
    
    logger.info('Role request rejected successfully', { component: 'useRoleManagement', requestId });
    
    await loadRoleRequests();
    return data;
  }, [loadRoleRequests]);

  const assignRole = useCallback(async (userId: string, role: string, expiresAt?: string): Promise<any> => {
    logger.info('Assigning role', { component: 'useRoleManagement', userId, role });
    
    const { data, error } = await supabase
      .from('user_roles')
      .insert([{
        user_id: userId,
        role: role,
        is_active: true,
        expires_at: expiresAt,
        granted_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to assign role', { component: 'useRoleManagement', userId, role }, error);
      throw error;
    }
    
    logger.info('Role assigned successfully', { component: 'useRoleManagement', userId, role });
    
    await loadUserRoles();
    return data;
  }, [loadUserRoles]);

  const revokeRole = useCallback(async (roleId: string): Promise<void> => {
    logger.info('Revoking role', { component: 'useRoleManagement', roleId });
    
    const { error } = await supabase
      .from('user_roles')
      .update({ is_active: false })
      .eq('id', roleId);
    
    if (error) {
      logger.error('Failed to revoke role', { component: 'useRoleManagement', roleId }, error);
      throw error;
    }
    
    logger.info('Role revoked successfully', { component: 'useRoleManagement', roleId });
    
    await loadUserRoles();
  }, [loadUserRoles]);

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