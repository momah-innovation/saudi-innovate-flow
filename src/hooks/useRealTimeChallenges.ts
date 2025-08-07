import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface ChallengeUpdate {
  id: string;
  challenge_id: string;
  type: 'participation' | 'submission' | 'status_change' | 'comment';
  data: any;
  created_at: string;
}

interface UseRealTimeChallengesProps {
  onChallengeUpdate?: (update: ChallengeUpdate) => void;
  onParticipantUpdate?: (challengeId: string, count: number) => void;
}

export const useRealTimeChallenges = ({
  onChallengeUpdate,
  onParticipantUpdate
}: UseRealTimeChallengesProps = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const { t } = useUnifiedTranslation();

  useEffect(() => {
    if (!user) return;

    // Subscribe to challenge participants changes
    const participantsChannel = supabase
      .channel('challenge-participants-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenge_participants'
        },
        async (payload) => {
          logger.info('Challenge participants change', { 
            eventType: payload.eventType,
            challengeId: (payload.new as any)?.challenge_id 
          });
          
          if (payload.eventType === 'INSERT') {
            // Get updated participant count
            const { count } = await supabase
              .from('challenge_participants')
              .select('*', { count: 'exact' })
              .eq('challenge_id', (payload.new as any).challenge_id);

            onParticipantUpdate?.((payload.new as any).challenge_id, count || 0);

            // Show notification if it's not the current user
            if ((payload.new as any).user_id !== user.id) {
              toast({
                title: t('new_participant', 'New Participant!'),
                description: t('challenge_participant_joined', 'Someone just joined a challenge you\'re interested in.'),
              });
            }
          }
        }
      )
      .subscribe();

    // Subscribe to challenge status changes
    const challengesChannel = supabase
      .channel('challenges-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'challenges'
        },
        (payload) => {
          logger.info('Challenge status change', { 
            challengeId: payload.new?.id,
            oldStatus: payload.old?.status,
            newStatus: payload.new?.status 
          });
          
          if ((payload.old as any).status !== (payload.new as any).status) {
            const update: ChallengeUpdate = {
              id: `${(payload.new as any).id}-${Date.now()}`,
              challenge_id: (payload.new as any).id,
              type: 'status_change',
              data: {
                old_status: (payload.old as any).status,
                new_status: (payload.new as any).status,
                title: (payload.new as any).title_ar
              },
              created_at: new Date().toISOString()
            };

            onChallengeUpdate?.(update);

            toast({
              title: t('challenge_updated', 'Challenge Updated'),
              description: t('challenge_status_changed', 'Challenge status changed to {{status}}', { status: (payload.new as any).status }),
            });
          }
        }
      )
      .subscribe();

    // Subscribe to challenge submissions
    const submissionsChannel = supabase
      .channel('challenge-submissions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'challenge_submissions'
        },
        (payload) => {
          logger.info('New challenge submission', { 
            challengeId: payload.new?.challenge_id,
            submittedBy: payload.new?.submitted_by 
          });
          
          const update: ChallengeUpdate = {
            id: `${(payload.new as any).id}-${Date.now()}`,
            challenge_id: (payload.new as any).challenge_id,
            type: 'submission',
            data: {
              title: (payload.new as any).title_ar,
              submitted_by: (payload.new as any).submitted_by
            },
            created_at: (payload.new as any).created_at
          };

          onChallengeUpdate?.(update);

          if ((payload.new as any).submitted_by !== user.id) {
            toast({
              title: t('new_submission', 'New Submission!'),
              description: t('challenge_new_submission', 'A new project has been submitted to a challenge.'),
            });
          }
        }
      )
      .subscribe();

    // Monitor connection status
    setIsConnected(true);

    return () => {
      participantsChannel.unsubscribe();
      challengesChannel.unsubscribe();
      submissionsChannel.unsubscribe();
      setIsConnected(false);
    };
  }, [user, onChallengeUpdate, onParticipantUpdate, toast]);

  return { isConnected };
};