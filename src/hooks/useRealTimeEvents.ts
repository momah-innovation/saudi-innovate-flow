import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
          console.log('Event participants change:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Get updated participant count
            const { count } = await supabase
              .from('event_participants')
              .select('*', { count: 'exact' })
              .eq('event_id', payload.new.event_id);

            onParticipantUpdate?.(payload.new.event_id, count || 0);

            // Show notification if it's not the current user
            if (payload.new.user_id !== user.id) {
              toast({
                title: 'New Registration!',
                description: 'Someone just registered for an event you\'re interested in.',
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
          console.log('Event change:', payload);
          
          if (payload.old.status !== payload.new.status) {
            const update: EventUpdate = {
              id: `${payload.new.id}-${Date.now()}`,
              event_id: payload.new.id,
              type: 'status_change',
              data: {
                old_status: payload.old.status,
                new_status: payload.new.status,
                title: payload.new.title_ar
              },
              created_at: new Date().toISOString()
            };

            onEventUpdate?.(update);

            toast({
              title: 'Event Updated',
              description: `Event status changed to ${payload.new.status}`,
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
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
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