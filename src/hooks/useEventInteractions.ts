import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

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
      loadEventInteractions();
      loadEventStats();
    }
  }, [eventId, user]);

  const loadEventInteractions = async () => {
    if (!eventId || !user) return;

    try {
      setLoading(true);

      // Check user registration
      const { data: registrationData } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      // Check user bookmark
      const { data: bookmarkData } = await supabase
        .from('event_bookmarks')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      // Check user like
      const { data: likeData } = await supabase
        .from('event_likes')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

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

  return {
    interactions,
    loading,
    toggleBookmark,
    toggleLike,
    registerForEvent,
    refetch
  };
}