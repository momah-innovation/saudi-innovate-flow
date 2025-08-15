import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryBatcher } from '@/utils/queryBatcher';

interface EventStats {
  participants_count: number;
  waitlist_count: number;
  capacity: number;
  attendance_rate: number;
}

export const useEventStats = (eventId: string | undefined) => {
  return useQuery<EventStats>({
    queryKey: ['event-stats', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID required');

      const [eventRes, participantsRes, waitlistRes] = await Promise.all([
        queryBatcher.batch(`event-${eventId}`, async () =>
          supabase.from('events').select('max_participants').eq('id', eventId).maybeSingle()
        ),
        queryBatcher.batch(`event-participants-${eventId}`, async () =>
          supabase.from('event_participants').select('*', { count: 'exact', head: true }).eq('event_id', eventId)
        ),
        queryBatcher.batch(`event-waitlist-${eventId}`, async () =>
          supabase.from('event_waitlist').select('*', { count: 'exact', head: true }).eq('event_id', eventId)
        )
      ]);

      const eventData = (eventRes as any)?.data;
      const participantsCount = (participantsRes as any)?.count || 0;
      const waitlistCount = (waitlistRes as any)?.count || 0;
      const capacity = eventData?.max_participants || 0;
      
      return {
        participants_count: participantsCount,
        waitlist_count: waitlistCount,
        capacity,
        attendance_rate: capacity > 0 ? Math.round((participantsCount / capacity) * 100) : 0
      };
    },
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};