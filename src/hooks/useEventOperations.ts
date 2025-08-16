import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface EventListItem {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  event_type: 'online' | 'offline' | 'hybrid';
  start_date: string;
  end_date: string;
  max_participants?: number;
  registration_deadline?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  category?: string;
  tags?: string[];
  requirements?: string;
  agenda?: string;
  materials?: string;
  feedback_survey_url?: string;
  recording_url?: string;
  presentation_url?: string;
}

export const useEventOperations = () => {
  const {
    data: events = [],
    isLoading: loading,
    error,
    refetch: loadEvents,
    isError
  } = useQuery({
    queryKey: ['events-list'],
    queryFn: async () => {
      logger.info('Fetching events list', { component: 'useEventOperations' });
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch events', { component: 'useEventOperations' }, error);
        throw error;
      }
      
      logger.info('Events fetched successfully', { 
        component: 'useEventOperations',
        count: data?.length || 0
      });
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createEvent = useCallback(async (eventData: any): Promise<any> => {
    logger.info('Creating event', { component: 'useEventOperations' });
    
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to create event', { component: 'useEventOperations' }, error);
      throw error;
    }
    
    logger.info('Event created successfully', { component: 'useEventOperations' });
    
    // Refetch the list after creation
    await loadEvents();
    return data;
  }, [loadEvents]);

  const updateEvent = useCallback(async (eventId: string, eventData: any): Promise<any> => {
    logger.info('Updating event', { component: 'useEventOperations' });
    
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single();
    
    if (error) {
      logger.error('Failed to update event', { component: 'useEventOperations' }, error);
      throw error;
    }
    
    logger.info('Event updated successfully', { component: 'useEventOperations' });
    
    // Refetch the list after update
    await loadEvents();
    return data;
  }, [loadEvents]);

  const deleteEvent = useCallback(async (eventId: string): Promise<void> => {
    logger.info('Deleting event', { component: 'useEventOperations' });
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    if (error) {
      logger.error('Failed to delete event', { component: 'useEventOperations' }, error);
      throw error;
    }
    
    logger.info('Event deleted successfully', { component: 'useEventOperations' });
    
    // Refetch the list after deletion
    await loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error: isError ? error : null,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};