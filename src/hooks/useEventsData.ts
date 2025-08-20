import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { createErrorHandler } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';

interface Event {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  location?: string;
  capacity?: number;
  registration_required: boolean;
  created_at: string;
  updated_at: string;
}

export const useEventsData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const errorHandler = createErrorHandler({ component: 'useEventsData' });

  const refreshEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setEvents((data as unknown as Event[]) || []);
    } catch (error) {
      errorHandler.handleError(error as Error, 'refreshEvents');
      toast({
        title: 'خطأ في جلب الأحداث',
        description: 'حدث خطأ أثناء جلب بيانات الأحداث',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [errorHandler, toast]);

  const createEvent = useCallback(async (eventData: any) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .maybeSingle();

      if (error) throw error;

      setEvents(prev => [data as unknown as Event, ...prev]);
      toast({
        title: 'تم إنشاء الحدث',
        description: 'تم إنشاء الحدث بنجاح',
      });
      return data;
    } catch (error) {
      errorHandler.handleError(error as Error, 'createEvent');
      throw error;
    }
  }, [errorHandler, toast]);

  const updateEvent = useCallback(async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;

      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...data } : event
      ));
      
      toast({
        title: 'تم تحديث الحدث',
        description: 'تم تحديث الحدث بنجاح',
      });
      return data;
    } catch (error) {
      errorHandler.handleError(error as Error, 'updateEvent');
      throw error;
    }
  }, [errorHandler, toast]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      toast({
        title: 'تم حذف الحدث',
        description: 'تم حذف الحدث بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'deleteEvent');
      throw error;
    }
  }, [errorHandler, toast]);

  return {
    events,
    loading,
    refreshEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};