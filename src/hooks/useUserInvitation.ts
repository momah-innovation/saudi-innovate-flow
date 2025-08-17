import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface UserInvitationItem {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  invitation_token: string;
  invited_by: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  inviter?: {
    id: string;
    email: string;
    display_name?: string;
  };
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  expired: number;
}

export const useUserInvitation = () => {
  const [sending, setSending] = useState(false);

  const {
    data: invitations = [],
    isLoading: loading,
    error,
    refetch: loadInvitations,
    isError
  } = useQuery({
    queryKey: ['user-invitations'],
    queryFn: async () => {
      logger.info('Fetching user invitations', { component: 'useUserInvitation' });
      
      const { data, error } = await supabase
        .from('user_invitations')
        .select(`
          *,
          inviter:invited_by(id, email, display_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch user invitations', { component: 'useUserInvitation' }, error);
        throw error;
      }
      
      logger.info('User invitations fetched successfully', { 
        component: 'useUserInvitation',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const getInvitationStats = useCallback((): InvitationStats => {
    const stats: InvitationStats = {
      total: invitations.length,
      pending: 0,
      accepted: 0,
      rejected: 0,
      expired: 0
    };

    invitations.forEach(invitation => {
      switch (invitation.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'accepted':
          stats.accepted++;
          break;
        case 'rejected':
          stats.rejected++;
          break;
        case 'expired':
          stats.expired++;
          break;
      }
    });

    return stats;
  }, [invitations]);

  const sendInvitation = useCallback(async (invitationData: {
    email: string;
    role: string;
    message?: string;
    expires_in_days?: number;
  }): Promise<any> => {
    logger.info('Sending user invitation', { component: 'useUserInvitation', email: invitationData.email });
    setSending(true);
    
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (invitationData.expires_in_days || 7));
      
      const { data, error } = await supabase
        .from('user_invitations')
        .insert([{
          email: invitationData.email,
          role: invitationData.role,
          invitation_token: crypto.randomUUID(),
          expires_at: expiresAt.toISOString(),
          status: 'pending',
          metadata: {
            message: invitationData.message
          }
        }])
        .select()
        .single();
      
      if (error) {
        logger.error('Failed to send user invitation', { component: 'useUserInvitation' }, error);
        throw error;
      }
      
      logger.info('User invitation sent successfully', { component: 'useUserInvitation' });
      
      // Refetch the list after creation
      await loadInvitations();
      return data;
    } finally {
      setSending(false);
    }
  }, [loadInvitations]);

  const resendInvitation = useCallback(async (invitationId: string): Promise<any> => {
    logger.info('Resending user invitation', { component: 'useUserInvitation', invitationId });
    
    const { data, error } = await supabase
      .from('user_invitations')
      .update({
        invitation_token: crypto.randomUUID(),
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', invitationId)
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to resend user invitation', { component: 'useUserInvitation', invitationId }, error);
      throw error;
    }
    
    logger.info('User invitation resent successfully', { component: 'useUserInvitation', invitationId });
    
    await loadInvitations();
    return data;
  }, [loadInvitations]);

  const cancelInvitation = useCallback(async (invitationId: string): Promise<void> => {
    logger.info('Canceling user invitation', { component: 'useUserInvitation', invitationId });
    
    const { error } = await supabase
      .from('user_invitations')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('id', invitationId);
    
    if (error) {
      logger.error('Failed to cancel user invitation', { component: 'useUserInvitation', invitationId }, error);
      throw error;
    }
    
    logger.info('User invitation canceled successfully', { component: 'useUserInvitation', invitationId });
    
    await loadInvitations();
  }, [loadInvitations]);

  const bulkInvite = useCallback(async (invitations: {
    email: string;
    role: string;
    message?: string;
  }[]): Promise<any> => {
    logger.info('Sending bulk user invitations', { 
      component: 'useUserInvitation',
      count: invitations.length 
    });
    setSending(true);
    
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry
      
      const invitationRecords = invitations.map(inv => ({
        email: inv.email,
        role: inv.role,
        invitation_token: crypto.randomUUID(),
        expires_at: expiresAt.toISOString(),
        status: 'pending' as const,
        metadata: {
          message: inv.message
        }
      }));
      
      const { data, error } = await supabase
        .from('user_invitations')
        .insert(invitationRecords);
      
      if (error) {
        logger.error('Failed to send bulk user invitations', { component: 'useUserInvitation' }, error);
        throw error;
      }
      
      logger.info('Bulk user invitations sent successfully', { component: 'useUserInvitation' });
      
      await loadInvitations();
      return data;
    } finally {
      setSending(false);
    }
  }, [loadInvitations]);

  const validateInvitationToken = useCallback(async (token: string): Promise<UserInvitationItem | null> => {
    logger.info('Validating invitation token', { component: 'useUserInvitation' });
    
    const { data, error } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('invitation_token', token)
      .eq('status', 'pending')
      .gte('expires_at', new Date().toISOString())
      .single();
    
    if (error) {
      logger.error('Failed to validate invitation token', { component: 'useUserInvitation' }, error);
      return null;
    }
    
    logger.info('Invitation token validated successfully', { component: 'useUserInvitation' });
    return data;
  }, []);

  return {
    invitations,
    loading,
    sending,
    error: isError ? error : null,
    stats: getInvitationStats(),
    loadInvitations,
    sendInvitation,
    resendInvitation,
    cancelInvitation,
    bulkInvite,
    validateInvitationToken
  };
};