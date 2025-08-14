import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { debugLog } from '@/utils/debugLogger';

interface EventState {
  isRegistered: boolean;
  participantCount: number;
  loading: boolean;
  userParticipation: any | null;
  interactions: any | null;
}

export const useEventState = (eventId: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<EventState>({
    isRegistered: false,
    participantCount: 0,
    loading: false,
    userParticipation: null,
    interactions: null
  });

  // Centralized refresh function
  const refreshEventState = useCallback(async () => {
    if (!eventId || !user) return;
    
    debugLog.log('🔄 Refreshing event state for', { eventId });
    setState(prev => ({ ...prev, loading: true }));

    try {
      // Get user's participation status
      const { data: userParticipation, error: participationError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (participationError && participationError.code !== 'PGRST116') {
        throw participationError;
      }

      // Get total participant count
      const { count: participantCount, error: countError } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact' })
        .eq('event_id', eventId);

      if (countError) {
        throw countError;
      }

      // Get interactions data (optional, don't fail if it doesn't work)
      let interactions = null;
      try {
        const { data: interactionsData } = await supabase.rpc('get_event_stats', {
          event_uuid: eventId
        });
        interactions = interactionsData;
      } catch (interactionError) {
        debugLog.warn('⚠️ Could not load event interactions', { interactionError });
      }

      setState({
        isRegistered: !!userParticipation,
        participantCount: participantCount || 0,
        loading: false,
        userParticipation,
        interactions
      });

      debugLog.log('✅ Event state refreshed', {
        isRegistered: !!userParticipation,
        participantCount: participantCount || 0,
        eventId
      });

    } catch (error) {
      debugLog.error('❌ Failed to refresh event state', { error });
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [eventId, user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!eventId) return;

    debugLog.log('🚀 Setting up unified real-time for event', { eventId });
    
    // Initial load
    refreshEventState();

    // Real-time subscription for participants
    const channel = supabase
      .channel(`event-state-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_participants',
          filter: `event_id=eq.${eventId}`
        },
        async (payload) => {
          debugLog.log('🔥 UNIFIED REAL-TIME: Event state change detected', {
            eventType: payload.eventType,
            eventId,
            userId: (payload.new as any)?.user_id || (payload.old as any)?.user_id
          });
          
          // Force immediate refresh
          await refreshEventState();
        }
      )
      .subscribe((status) => {
        debugLog.log('📡 Unified real-time subscription status', { status });
        if (status === 'SUBSCRIBED') {
          debugLog.log('✅ Unified real-time connected for event', { eventId });
        } else if (status === 'CHANNEL_ERROR') {
          debugLog.error('❌ Unified real-time connection failed for event', { eventId });
        }
      });

    return () => {
      debugLog.log('🔌 Cleaning up unified real-time for event', { eventId });
      supabase.removeChannel(channel);
    };
  }, [eventId, refreshEventState]);

  // Registration actions
  const registerForEvent = useCallback(async () => {
    if (!user || !eventId) return;

    debugLog.log('🔄 Registering for event via unified state', { eventId });
    setState(prev => ({ ...prev, loading: true }));

    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id,
          attendance_status: 'registered',
          registration_type: 'self_registered'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully registered for the event!",
      });

      // Real-time will trigger refresh automatically
    } catch (error) {
      debugLog.error('❌ Registration failed', { error });
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user, eventId, toast]);

  const cancelRegistration = useCallback(async () => {
    if (!user || !eventId || !state.userParticipation) return;

    debugLog.log('🔄 Cancelling registration via unified state', { eventId });
    setState(prev => ({ ...prev, loading: true }));

    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', state.userParticipation.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Registration cancelled successfully",
      });

      // Real-time will trigger refresh automatically
    } catch (error) {
      debugLog.error('❌ Cancellation failed', { error });
      toast({
        title: "Error",
        description: "Failed to cancel registration",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user, eventId, state.userParticipation, toast]);

  return {
    ...state,
    registerForEvent,
    cancelRegistration,
    refreshEventState
  };
};