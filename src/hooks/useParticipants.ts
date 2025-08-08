import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  attendance_status: string;
  registration_type: string;
  notes?: string;
  check_in_time?: string;
  check_out_time?: string;
  user?: {
    id: string;
    email?: string;
    profile_image_url?: string;
    full_name?: string;
  };
}

export function useParticipants(eventId: string | null) {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchParticipants();
      
      // Set up real-time subscription for participants
      const participantsChannel = supabase
        .channel(`event_participants_${eventId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'event_participants',
            filter: `event_id=eq.${eventId}`
          },
          (payload) => {
            console.log('Participants change detected:', payload);
            fetchParticipants(); // Refresh participants list
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(participantsChannel);
      };
    }
  }, [eventId]);

  const fetchParticipants = async (id?: string) => {
    const targetEventId = id || eventId;
    if (!targetEventId) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('event_participants')
        .select(`
          id,
          event_id,
          user_id,
          registration_date,
          attendance_status,
          registration_type,
          notes,
          check_in_time,
          check_out_time
        `)
        .eq('event_id', targetEventId)
        .order('registration_date', { ascending: false });

      if (error) throw error;

      setParticipants(data || []);
    } catch (error) {
      logger.error('Failed to fetch participants', { component: 'useParticipants', action: 'fetchParticipants', eventId }, error as Error);
      toast({
        title: 'خطأ في تحميل المشاركين',
        description: 'حدث خطأ أثناء تحميل قائمة المشاركين',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateParticipantStatus = async (participantId: string, newStatus: string) => {
    try {
      const updates: Record<string, unknown> = { attendance_status: newStatus };
      
      // Add timestamps based on status
      if (newStatus === 'checked_in') {
        updates.check_in_time = new Date().toISOString();
      } else if (newStatus === 'checked_out') {
        updates.check_out_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('event_participants')
        .update(updates)
        .eq('id', participantId);

      if (error) throw error;

      // Update local state
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, ...updates }
            : p
        )
      );

      toast({
        title: 'تم تحديث الحالة',
        description: 'تم تحديث حالة المشارك بنجاح'
      });
    } catch (error) {
      logger.error('Failed to update participant status', { component: 'useParticipants', action: 'updateParticipantStatus', participantId, newStatus }, error as Error);
      toast({
        title: 'خطأ في التحديث',
        description: 'حدث خطأ أثناء تحديث حالة المشارك',
        variant: 'destructive'
      });
    }
  };

  const registerParticipant = async (userId: string, targetEventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .insert({
          event_id: targetEventId,
          user_id: userId,
          attendance_status: 'registered',
          registration_type: 'admin_registered'
        })
        .select()
        .single();

      if (error) throw error;

      setParticipants(prev => [data, ...prev]);

      toast({
        title: 'تم التسجيل بنجاح',
        description: 'تم تسجيل المشارك في الفعالية'
      });
    } catch (error) {
      logger.error('Failed to register participant', { component: 'useParticipants', action: 'registerParticipant', eventId }, error as Error);
      toast({
        title: 'خطأ في التسجيل',
        description: 'حدث خطأ أثناء تسجيل المشارك',
        variant: 'destructive'
      });
    }
  };

  const cancelRegistration = async (participantId: string, targetEventId: string) => {
    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', participantId);

      if (error) throw error;

      setParticipants(prev => prev.filter(p => p.id !== participantId));

      toast({
        title: 'تم إلغاء التسجيل',
        description: 'تم إلغاء تسجيل المشارك من الفعالية'
      });
    } catch (error) {
      logger.error('Failed to cancel registration', { component: 'useParticipants', action: 'cancelRegistration', eventId }, error as Error);
      toast({
        title: 'خطأ في الإلغاء',
        description: 'حدث خطأ أثناء إلغاء التسجيل',
        variant: 'destructive'
      });
    }
  };

  return {
    participants,
    loading,
    fetchParticipants,
    updateParticipantStatus,
    registerParticipant,
    cancelRegistration
  };
}