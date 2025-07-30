import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EventInteractions {
  isBookmarked: boolean;
  isLiked: boolean;
  isRegistered: boolean;
  stats: {
    likes_count: number;
    bookmarks_count: number;
    participants_count: number;
    feedback_count: number;
    average_rating: number;
  };
}

export const useEventInteractions = (eventId: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [interactions, setInteractions] = useState<EventInteractions>({
    isBookmarked: false,
    isLiked: false,
    isRegistered: false,
    stats: {
      likes_count: 0,
      bookmarks_count: 0,
      participants_count: 0,
      feedback_count: 0,
      average_rating: 0
    }
  });
  
  const [loading, setLoading] = useState(false);

  // Load event interactions and stats
  useEffect(() => {
    if (eventId && user) {
      loadEventInteractions();
      loadEventStats();
    } else if (eventId) {
      // Load only stats for non-authenticated users
      loadEventStats();
    }
  }, [eventId, user]);

  const loadEventInteractions = async () => {
    if (!user || !eventId) return;

    try {
      setLoading(true);

      // Check if user is registered
      const { data: registration } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      // Check if event is bookmarked
      const { data: bookmark } = await supabase
        .from('event_bookmarks')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      // Check if event is liked
      const { data: like } = await supabase
        .from('event_likes')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      setInteractions(prev => ({
        ...prev,
        isRegistered: !!registration,
        isBookmarked: !!bookmark,
        isLiked: !!like
      }));

    } catch (error) {
      console.error('Error loading event interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEventStats = async () => {
    if (!eventId) return;

    try {
      const { data, error } = await supabase.rpc('get_event_stats', {
        event_uuid: eventId
      });

      if (error) throw error;

      // Parse the JSON response and ensure it matches our expected structure
      const statsData = (typeof data === 'object' && data !== null && !Array.isArray(data)) ? data as Record<string, any> : {};
      const parsedStats = {
        likes_count: Number(statsData['likes_count'] || 0),
        bookmarks_count: Number(statsData['bookmarks_count'] || 0),
        participants_count: Number(statsData['participants_count'] || 0),
        feedback_count: Number(statsData['feedback_count'] || 0),
        average_rating: Number(statsData['average_rating'] || 0)
      };

      setInteractions(prev => ({
        ...prev,
        stats: parsedStats
      }));

    } catch (error) {
      console.error('Error loading event stats:', error);
    }
  };

  const toggleBookmark = async () => {
    if (!user || !eventId) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to bookmark events',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (interactions.isBookmarked) {
        await supabase
          .from('event_bookmarks')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);
        
        setInteractions(prev => ({
          ...prev,
          isBookmarked: false,
          stats: {
            ...prev.stats,
            bookmarks_count: Math.max(0, prev.stats.bookmarks_count - 1)
          }
        }));
      } else {
        await supabase
          .from('event_bookmarks')
          .insert({ event_id: eventId, user_id: user.id });
        
        setInteractions(prev => ({
          ...prev,
          isBookmarked: true,
          stats: {
            ...prev.stats,
            bookmarks_count: prev.stats.bookmarks_count + 1
          }
        }));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bookmark',
        variant: 'destructive'
      });
    }
  };

  const toggleLike = async () => {
    if (!user || !eventId) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to like events',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (interactions.isLiked) {
        await supabase
          .from('event_likes')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);
        
        setInteractions(prev => ({
          ...prev,
          isLiked: false,
          stats: {
            ...prev.stats,
            likes_count: Math.max(0, prev.stats.likes_count - 1)
          }
        }));
      } else {
        await supabase
          .from('event_likes')
          .insert({ event_id: eventId, user_id: user.id });
        
        setInteractions(prev => ({
          ...prev,
          isLiked: true,
          stats: {
            ...prev.stats,
            likes_count: prev.stats.likes_count + 1
          }
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive'
      });
    }
  };

  const registerForEvent = async () => {
    if (!user || !eventId) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to register for events',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id,
          registration_type: 'self_registered',
          attendance_status: 'registered'
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already Registered',
            description: 'You are already registered for this event',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
        return;
      }

      setInteractions(prev => ({
        ...prev,
        isRegistered: true,
        stats: {
          ...prev.stats,
          participants_count: prev.stats.participants_count + 1
        }
      }));

      toast({
        title: 'Successfully Registered!',
        description: 'You have been registered for this event'
      });

    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: 'Registration Error',
        description: 'An error occurred while registering for the event',
        variant: 'destructive'
      });
    }
  };

  return {
    interactions,
    loading,
    toggleBookmark,
    toggleLike,
    registerForEvent,
    refetch: () => {
      loadEventInteractions();
      loadEventStats();
    }
  };
};