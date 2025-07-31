import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
          console.log('Participants change:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Get updated participant count
            const { count } = await supabase
              .from('challenge_participants')
              .select('*', { count: 'exact' })
              .eq('challenge_id', payload.new.challenge_id);

            onParticipantUpdate?.(payload.new.challenge_id, count || 0);

            // Show notification if it's not the current user
            if (payload.new.user_id !== user.id) {
              toast({
                title: 'New Participant!',
                description: 'Someone just joined a challenge you\'re interested in.',
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
          console.log('Challenge change:', payload);
          
          if (payload.old.status !== payload.new.status) {
            const update: ChallengeUpdate = {
              id: `${payload.new.id}-${Date.now()}`,
              challenge_id: payload.new.id,
              type: 'status_change',
              data: {
                old_status: payload.old.status,
                new_status: payload.new.status,
                title: payload.new.title_ar
              },
              created_at: new Date().toISOString()
            };

            onChallengeUpdate?.(update);

            toast({
              title: 'Challenge Updated',
              description: `Challenge status changed to ${payload.new.status}`,
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
          console.log('New submission:', payload);
          
          const update: ChallengeUpdate = {
            id: `${payload.new.id}-${Date.now()}`,
            challenge_id: payload.new.challenge_id,
            type: 'submission',
            data: {
              title: payload.new.title_ar,
              submitted_by: payload.new.submitted_by
            },
            created_at: payload.new.created_at
          };

          onChallengeUpdate?.(update);

          if (payload.new.submitted_by !== user.id) {
            toast({
              title: 'New Submission!',
              description: 'A new project has been submitted to a challenge.',
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