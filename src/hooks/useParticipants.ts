import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  attendance_status: string;
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  registration_type: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
    position?: string;
    department?: string;
  };
}

export function useParticipants(eventId?: string) {
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchParticipants = async (id?: string) => {
    if (!id && !eventId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_participants')
        .select(`
          *,
          profiles!inner(name, email, position, department)
        `)
        .eq('event_id', id || eventId)
        .order('registration_date', { ascending: false });

      if (error) throw error;
      setParticipants((data as any) || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast({
        title: "Error",
        description: "Failed to load participants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateParticipantStatus = async (participantId: string, newStatus: string) => {
    try {
      const updateData: any = {
        attendance_status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'attended') {
        updateData.check_in_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('event_participants')
        .update(updateData)
        .eq('id', participantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Participant status updated",
      });
      
      await fetchParticipants();
    } catch (error) {
      console.error('Error updating participant status:', error);
      toast({
        title: "Error",
        description: "Failed to update participant status",
        variant: "destructive",
      });
    }
  };

  const registerParticipant = async (userId: string, targetEventId: string) => {
    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: targetEventId,
          user_id: userId,
          attendance_status: 'registered',
          registration_type: 'self_registered'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully registered for the event!",
      });

      await fetchParticipants(targetEventId);
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
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

      toast({
        title: "Success",
        description: "Registration cancelled successfully",
      });

      await fetchParticipants(targetEventId);
    } catch (error) {
      console.error('Error cancelling registration:', error);
      toast({
        title: "Error",
        description: "Failed to cancel registration",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchParticipants();
    }
  }, [eventId]);

  return {
    participants,
    loading,
    fetchParticipants,
    updateParticipantStatus,
    registerParticipant,
    cancelRegistration
  };
}