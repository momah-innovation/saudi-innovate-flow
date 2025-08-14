import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { debugLog } from '@/utils/debugLogger';

export interface EventInteractions {
  isBookmarked: boolean;
  isLiked: boolean;
  isRegistered: boolean;
  likes_count: number;
  bookmarks_count: number;
  participants_count: number;
  feedback_count: number;
  average_rating: number;
}

export function useEventInteractions(eventId: string | null) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [interactions, setInteractions] = useState<EventInteractions | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId && user) {
      debugLog.log('🚀 Setting up real-time subscriptions for event', { eventId });
      loadEventInteractions();
      loadEventStats();
      
      // Set up direct real-time subscription for this specific event
      const eventChannel = supabase
        .channel(`event_interactions_${eventId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'event_participants',
            filter: `event_id=eq.${eventId}`
          },
          async (payload) => {
            debugLog.log('🔥 REAL-TIME: Participant change detected in useEventInteractions', {
              eventType: payload.eventType,
              eventId: eventId,
              payload: payload
            });
            
            // Force reload both interactions and stats
            await Promise.all([
              loadEventInteractions(),
              loadEventStats()
            ]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'event_likes',
            filter: `event_id=eq.${eventId}`
          },
          (payload) => {
            debugLog.log('Real-time likes change', { payload });
            loadEventInteractions();
            loadEventStats();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'event_bookmarks',
            filter: `event_id=eq.${eventId}`
          },
          (payload) => {
            debugLog.log('Real-time bookmarks change', { payload });
            loadEventInteractions();
          }
        )
        .subscribe((status, err) => {
          debugLog.log('📡 Real-time subscription status for event interactions', { status, error: err });
          if (status === 'SUBSCRIBED') {
            debugLog.log('✅ Successfully subscribed to real-time updates for event', { eventId });
          } else if (status === 'CHANNEL_ERROR') {
            debugLog.error('❌ Real-time subscription error for event', { eventId, error: err });
            // Try to fallback to polling or show user notification
            debugLog.log('🔄 Falling back to manual refresh for real-time updates');
          } else if (status === 'TIMED_OUT') {
            debugLog.warn('⏰ Real-time subscription timed out for event', { eventId });
          } else if (status === 'CLOSED') {
            debugLog.warn('🔒 Real-time subscription closed for event', { eventId });
          }
        });

      return () => {
        debugLog.log('🔌 Unsubscribing from real-time for event', { eventId });
        supabase.removeChannel(eventChannel);
      };
    } else {
      debugLog.log('⏸️ No real-time setup - missing eventId or user', { eventId, userId: user?.id });
    }
  }, [eventId, user]);

  const loadEventInteractions = async () => {
    if (!eventId || !user) return;

    try {
      setLoading(true);

      // Check user registration
      const { data: registrationData, error: regError } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (regError && regError.code !== 'PGRST116') {
        throw regError;
      }

      // Check user bookmark
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('event_bookmarks')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (bookmarkError && bookmarkError.code !== 'PGRST116') {
        throw bookmarkError;
      }

      // Check user like
      const { data: likeData, error: likeError } = await supabase
        .from('event_likes')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (likeError && likeError.code !== 'PGRST116') {
        throw likeError;
      }

      setInteractions(prev => ({
        ...prev,
        isRegistered: !!registrationData,
        isBookmarked: !!bookmarkData,
        isLiked: !!likeData,
        likes_count: prev?.likes_count || 0,
        bookmarks_count: prev?.bookmarks_count || 0,
        participants_count: prev?.participants_count || 0,
        feedback_count: prev?.feedback_count || 0,
        average_rating: prev?.average_rating || 0
      }));
    } catch (error) {
      logger.error('Error loading event interactions', { component: 'useEventInteractions', action: 'loadEventInteractions', eventId }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadEventStats = async () => {
    if (!eventId) return;

    try {
      // Use the RPC function to get event stats
      const { data: stats, error } = await supabase
        .rpc('get_event_stats', { event_uuid: eventId });

      if (error) throw error;

      if (stats && typeof stats === 'object') {
        const eventStats: any = stats;
        setInteractions(prev => ({
          ...prev,
          likes_count: eventStats.likes_count || 0,
          bookmarks_count: eventStats.bookmarks_count || 0,
          participants_count: eventStats.participants_count || 0,
          feedback_count: eventStats.feedback_count || 0,
          average_rating: eventStats.average_rating || 0,
          isRegistered: prev?.isRegistered || false,
          isBookmarked: prev?.isBookmarked || false,
          isLiked: prev?.isLiked || false
        }));
      }
    } catch (error) {
      logger.error('Error loading event stats', { component: 'useEventInteractions', action: 'loadEventStats', eventId }, error as Error);
    }
  };

  const toggleBookmark = async () => {
    if (!eventId || !user || loading) return;

    try {
      setLoading(true);

      if (interactions?.isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('event_bookmarks')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);

        if (error) throw error;

        setInteractions(prev => prev ? {
          ...prev,
          isBookmarked: false,
          bookmarks_count: Math.max(0, prev.bookmarks_count - 1)
        } : null);

        toast({
          title: 'تم إلغاء الحفظ',
          description: 'تم إزالة الفعالية من المحفوظات'
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('event_bookmarks')
          .insert({
            event_id: eventId,
            user_id: user.id
          });

        if (error) throw error;

        setInteractions(prev => prev ? {
          ...prev,
          isBookmarked: true,
          bookmarks_count: prev.bookmarks_count + 1
        } : null);

        toast({
          title: 'تم الحفظ',
          description: 'تم حفظ الفعالية في المحفوظات'
        });
      }
    } catch (error) {
      logger.error('Error toggling bookmark', { component: 'useEventInteractions', action: 'toggleBookmark', eventId }, error as Error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ الفعالية',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!eventId || !user || loading) return;

    try {
      setLoading(true);

      if (interactions?.isLiked) {
        // Remove like
        const { error } = await supabase
          .from('event_likes')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);

        if (error) throw error;

        setInteractions(prev => prev ? {
          ...prev,
          isLiked: false,
          likes_count: Math.max(0, prev.likes_count - 1)
        } : null);
      } else {
        // Add like
        const { error } = await supabase
          .from('event_likes')
          .insert({
            event_id: eventId,
            user_id: user.id
          });

        if (error) throw error;

        setInteractions(prev => prev ? {
          ...prev,
          isLiked: true,
          likes_count: prev.likes_count + 1
        } : null);
      }
    } catch (error) {
      logger.error('Error toggling like', { component: 'useEventInteractions', action: 'toggleLike', eventId }, error as Error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الإعجاب بالفعالية',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async () => {
    if (!eventId || !user || loading) return;

    try {
      setLoading(true);

      // Add date validation - prevent registration for past events
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('event_date')
        .eq('id', eventId)
        .maybeSingle();

      if (eventError) throw eventError;
      if (!eventData) {
        toast({
          title: 'خطأ',
          description: 'الفعالية غير موجودة',
          variant: 'destructive'
        });
        return;
      }

      const eventDate = new Date(eventData.event_date);
      const now = new Date();
      if (eventDate < now) {
        toast({
          title: 'لا يمكن التسجيل',
          description: 'لا يمكن التسجيل في فعالية انتهت',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id,
          attendance_status: 'registered',
          registration_type: 'self_registered'
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: 'مسجل مسبقاً',
            description: 'أنت مسجل في هذه الفعالية بالفعل',
            variant: 'destructive'
          });
          return;
        }
        throw error;
      }

      setInteractions(prev => prev ? {
        ...prev,
        isRegistered: true,
        participants_count: prev.participants_count + 1
      } : null);

      toast({
        title: 'تم التسجيل بنجاح',
        description: 'تم تسجيلك في الفعالية بنجاح'
      });
    } catch (error) {
      logger.error('Error registering for event', { component: 'useEventInteractions', action: 'registerForEvent', eventId }, error as Error);
      toast({
        title: 'خطأ في التسجيل',
        description: 'حدث خطأ أثناء التسجيل في الفعالية',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadEventInteractions();
    loadEventStats();
  };

  // Add a function to refresh after external registration changes
  const refreshAfterRegistrationChange = () => {
    loadEventInteractions();
    loadEventStats();
  };

  return {
    interactions,
    loading,
    toggleBookmark,
    toggleLike,
    registerForEvent,
    refetch,
    refreshAfterRegistrationChange
  };
}