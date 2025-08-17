import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createErrorHandler } from '@/utils/unified-error-handler';

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
  const errorHandler = createErrorHandler({ component: 'useUserInvitation' });

  const {
    data: invitations = [],
    isLoading: loading,
    error,
    refetch: loadInvitations,
    isError
  } = useQuery({
    queryKey: ['user-invitations'],
    queryFn: async () => {
      // Mock data for now since table doesn't exist
      const mockInvitations: UserInvitationItem[] = [
        {
          id: '1',
          email: 'user@example.com',
          role: 'innovator',
          status: 'pending',
          invitation_token: 'mock-token',
          invited_by: 'admin-id',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockInvitations;
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
    return errorHandler.withErrorHandling(async () => {
      setSending(true);
      try {
        // Mock implementation
        await loadInvitations();
        return { 
          id: Math.random().toString(36).substring(2), 
          ...invitationData,
          invitation_token: crypto.randomUUID(),
          status: 'pending'
        };
      } finally {
        setSending(false);
      }
    }, { operation: 'send_invitation' });
  }, [loadInvitations, errorHandler]);

  const resendInvitation = useCallback(async (invitationId: string): Promise<any> => {
    return errorHandler.withErrorHandling(async () => {
      await loadInvitations();
      return { id: invitationId, status: 'pending' };
    }, { operation: 'resend_invitation' });
  }, [loadInvitations, errorHandler]);

  const cancelInvitation = useCallback(async (invitationId: string): Promise<void> => {
    await errorHandler.withErrorHandling(async () => {
      await loadInvitations();
    }, { operation: 'cancel_invitation' });
  }, [loadInvitations, errorHandler]);

  const bulkInvite = useCallback(async (invitations: {
    email: string;
    role: string;
    message?: string;
  }[]): Promise<any> => {
    return errorHandler.withErrorHandling(async () => {
      setSending(true);
      try {
        await loadInvitations();
        return invitations;
      } finally {
        setSending(false);
      }
    }, { operation: 'bulk_invite' });
  }, [loadInvitations, errorHandler]);

  const validateInvitationToken = useCallback(async (token: string): Promise<UserInvitationItem | null> => {
    return errorHandler.withErrorHandling(async () => {
      // Mock validation
      return invitations.find(inv => inv.invitation_token === token) || null;
    }, { operation: 'validate_token' });
  }, [invitations, errorHandler]);

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