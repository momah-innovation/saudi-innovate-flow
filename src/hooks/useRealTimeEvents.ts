import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface EventUpdate {
  id: string;
  event_id: string;
  type: 'registration' | 'status_change' | 'update' | 'cancellation';
  data: any;
  created_at: string;
}

interface UseRealTimeEventsProps {
  onEventUpdate?: (update: EventUpdate) => void;
  onParticipantUpdate?: (eventId: string, count: number) => void;
  onPresenceUpdate?: (presences: any[]) => void;
}

export const useRealTimeEvents = ({
  onEventUpdate,
  onParticipantUpdate,
  onPresenceUpdate
}: UseRealTimeEventsProps = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const { t } = useUnifiedTranslation();

  useEffect(() => {
    if (!user) return;

    // Subscribe to event participants changes
    const participantsChannel = supabase
      .channel('event-participants-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_participants'
        },
        async (payload) => {
          const eventId = (payload.new as any)?.event_id || (payload.old as any)?.event_id;
          console.log('🔥 REAL-TIME: Participants list change detected:', {
            eventType: payload.eventType,
            eventId,
            userId: (payload.new as any)?.user_id || (payload.old as any)?.user_id,
            payload
          });
          
          if (eventId) {
            // Get updated participant count for any change (INSERT, UPDATE, DELETE)
            const { count } = await supabase
              .from('event_participants')
              .select('*', { count: 'exact' })
              .eq('event_id', eventId);

            console.log('🔄 Updated participant count for event:', eventId, 'count:', count);
            onParticipantUpdate?.(eventId, count || 0);

            // Show notification based on event type
            if (payload.eventType === 'INSERT' && (payload.new as any).user_id !== user.id) {
              toast({
                title: t('new_registration', 'New Registration!'),
                description: t('event_registration_notification', 'Someone just registered for an event you\'re interested in.'),
              });
            } else if (payload.eventType === 'DELETE' && (payload.old as any).user_id !== user.id) {
              toast({
                title: t('registration_cancelled', 'Registration Cancelled'),
                description: t('event_cancellation_notification', 'Someone cancelled their registration for an event.'),
              });
            }
          }
        }
      )
      .subscribe();

    // Subscribe to event status changes
    const eventsChannel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          logger.info('Event status change', { 
            eventId: (payload.new as any)?.id,
            oldStatus: (payload.old as any)?.status,
            newStatus: (payload.new as any)?.status 
          });
          
          if ((payload.old as any).status !== (payload.new as any).status) {
            const update: EventUpdate = {
              id: `${(payload.new as any).id}-${Date.now()}`,
              event_id: (payload.new as any).id,
              type: 'status_change',
              data: {
                old_status: (payload.old as any).status,
                new_status: (payload.new as any).status,
                title: (payload.new as any).title_ar
              },
              created_at: new Date().toISOString()
            };

            onEventUpdate?.(update);

            toast({
              title: t('event_updated', 'Event Updated'),
              description: t('event_status_changed', 'Event status changed to {{status}}', { status: (payload.new as any).status }),
            });
          }
        }
      )
      .subscribe();

    // Real-time presence tracking for events
    const presenceChannel = supabase
      .channel('events-presence')
      .on('presence', { event: 'sync' }, () => {
        const presences = presenceChannel.presenceState();
        const users = Object.values(presences).flat();
        setOnlineUsers(users);
        onPresenceUpdate?.(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        logger.debug('User joined event presence', { presenceCount: newPresences.length });
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        logger.debug('User left event presence', { presenceCount: leftPresences.length });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
            page: 'events'
          });
        }
      });

    // Monitor connection status
    setIsConnected(true);

    return () => {
      participantsChannel.unsubscribe();
      eventsChannel.unsubscribe();
      presenceChannel.unsubscribe();
      setIsConnected(false);
    };
  }, [user, onEventUpdate, onParticipantUpdate, onPresenceUpdate, toast]);

  return { isConnected, onlineUsers };
};