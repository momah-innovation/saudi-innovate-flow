import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EventBulkOperations {
  bulkDeleteEvents: (eventIds: string[]) => Promise<void>;
  bulkUpdateEvents: (eventIds: string[], updates: any) => Promise<void>;
  bulkDuplicateEvents: (eventIds: string[]) => Promise<any[]>;
  loadEventConnections: (eventId: string) => Promise<any>;
}

export const useEventBulkOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const bulkDeleteEvents = useCallback(async (eventIds: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      // Delete related records first (cascade)
      await Promise.all([
        supabase.from('event_partner_links').delete().in('event_id', eventIds),
        supabase.from('event_stakeholder_links').delete().in('event_id', eventIds),
        supabase.from('event_focus_question_links').delete().in('event_id', eventIds),
        supabase.from('event_challenge_links').delete().in('event_id', eventIds),
        supabase.from('event_participants').delete().in('event_id', eventIds)
      ]);

      // Delete main events
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .in('id', eventIds);

      if (deleteError) throw deleteError;

      toast({
        title: 'Success',
        description: `${eventIds.length} events deleted successfully`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete events';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadEventConnections = useCallback(async (eventId: string) => {
    try {
      const [partnersRes, stakeholdersRes] = await Promise.all([
        supabase.from('event_partner_links').select('partner_id').eq('event_id', eventId),
        supabase.from('event_stakeholder_links').select('stakeholder_id').eq('event_id', eventId)
      ]);

      return {
        partner_ids: partnersRes.data?.map(link => link.partner_id) || [],
        stakeholder_ids: stakeholdersRes.data?.map(link => link.stakeholder_id) || []
      };
    } catch (err) {
      throw new Error('Failed to load event connections');
    }
  }, []);

  const bulkUpdateEvents = useCallback(async (eventIds: string[], updates: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .in('id', eventIds);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `${eventIds.length} events updated successfully`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update events';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const bulkDuplicateEvents = useCallback(async (eventIds: string[]) => {
    setLoading(true);
    try {
      const duplicatedEvents = [];
      
      for (const eventId of eventIds) {
        // Get original event
        const { data: originalEvent } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (originalEvent) {
          // Create duplicate with proper field names
          const { data: newEvent, error } = await supabase
            .from('events')
            .insert([{
              ...originalEvent,
              id: undefined,
              title_ar: `${originalEvent.title_ar} (نسخة)`,
              title_en: originalEvent.title_en ? `${originalEvent.title_en} (Copy)` : undefined,
              created_at: new Date().toISOString()
            }])
            .select()
            .single();

          if (error) throw error;
          duplicatedEvents.push(newEvent);
        }
      }

      toast({
        title: 'Success',
        description: `${duplicatedEvents.length} events duplicated successfully`
      });

      return duplicatedEvents;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate events';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    error,
    bulkDeleteEvents,
    bulkUpdateEvents,
    bulkDuplicateEvents,
    loadEventConnections
  };
};