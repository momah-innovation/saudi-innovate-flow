import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

/**
 * ✅ PHASE 3: EVENT BULK OPERATIONS MIGRATION
 * Consolidates 25+ direct supabase.from() calls from EventBulkActions.tsx
 * Provides centralized event management with proper error handling
 */
export const useEventBulkOperations = () => {
  const { toast } = useToast();

  // ✅ BULK DELETE OPERATIONS
  const bulkDeleteEvents = useCallback(async (selectedEvents: string[]) => {
    try {
      logger.info('Starting bulk delete of events', { count: selectedEvents.length });

      // Delete related data first (foreign key constraints)
      const deletePromises = [
        supabase.from('event_partner_links').delete().in('event_id', selectedEvents),
        supabase.from('event_stakeholder_links').delete().in('event_id', selectedEvents),
        supabase.from('event_focus_question_links').delete().in('event_id', selectedEvents),
        supabase.from('event_challenge_links').delete().in('event_id', selectedEvents),
        supabase.from('event_participants').delete().in('event_id', selectedEvents)
      ];

      await Promise.all(deletePromises);

      // Delete events
      const { error } = await supabase
        .from('events')
        .delete()
        .in('id', selectedEvents);

      if (error) throw error;

      toast({
        title: 'تم الحذف بنجاح',
        description: `تم حذف ${selectedEvents.length} فعالية بنجاح`
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to bulk delete events', { selectedEvents }, error as Error);
      toast({
        title: 'خطأ في الحذف',
        description: 'فشل في حذف الفعاليات. يرجى المحاولة مرة أخرى',
        variant: 'destructive'
      });
      return { success: false, error };
    }
  }, [toast]);

  // ✅ BULK STATUS UPDATE
  const bulkUpdateEventStatus = useCallback(async (selectedEvents: string[], status: string) => {
    try {
      logger.info('Bulk updating event status', { count: selectedEvents.length, status });

      const { error } = await supabase
        .from('events')
        .update({ status, updated_at: new Date().toISOString() })
        .in('id', selectedEvents);

      if (error) throw error;

      toast({
        title: 'تم التحديث بنجاح',
        description: `تم تحديث حالة ${selectedEvents.length} فعالية إلى ${status}`
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to bulk update event status', { selectedEvents, status }, error as Error);
      toast({
        title: 'خطأ في التحديث',
        description: 'فشل في تحديث حالة الفعاليات. يرجى المحاولة مرة أخرى',
        variant: 'destructive'
      });
      return { success: false, error };
    }
  }, [toast]);

  // ✅ BULK CATEGORY ASSIGNMENT
  const bulkAssignCategory = useCallback(async (selectedEvents: string[], category: string) => {
    try {
      logger.info('Bulk assigning category to events', { count: selectedEvents.length, category });

      const { error } = await supabase
        .from('events')
        .update({ event_category: category, updated_at: new Date().toISOString() })
        .in('id', selectedEvents);

      if (error) throw error;

      toast({
        title: 'تم التحديث بنجاح',
        description: `تم تعيين فئة ${category} لـ ${selectedEvents.length} فعالية`
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to bulk assign category', { selectedEvents, category }, error as Error);
      toast({
        title: 'خطأ في التحديث',
        description: 'فشل في تعيين الفئة للفعاليات. يرجى المحاولة مرة أخرى',
        variant: 'destructive'
      });
      return { success: false, error };
    }
  }, [toast]);

  // ✅ GET EVENT RELATIONSHIPS
  const getEventRelationships = useCallback(async (eventId: string) => {
    try {
      const [partnersRes, stakeholdersRes, questionsRes, challengesRes] = await Promise.all([
        supabase.from('event_partner_links').select('partner_id').eq('event_id', eventId),
        supabase.from('event_stakeholder_links').select('stakeholder_id').eq('event_id', eventId),
        supabase.from('event_focus_question_links').select('focus_question_id').eq('event_id', eventId),
        supabase.from('event_challenge_links').select('challenge_id').eq('event_id', eventId)
      ]);

      return {
        partners: partnersRes.data?.map(p => p.partner_id) || [],
        stakeholders: stakeholdersRes.data?.map(s => s.stakeholder_id) || [],
        focusQuestions: questionsRes.data?.map(q => q.focus_question_id) || [],
        challenges: challengesRes.data?.map(c => c.challenge_id) || []
      };
    } catch (error) {
      logger.error('Failed to get event relationships', { eventId }, error as Error);
      throw error;
    }
  }, []);

  // ✅ UPDATE EVENT RELATIONSHIPS
  const updateEventRelationships = useCallback(async (
    eventId: string, 
    relationships: {
      partners?: string[];
      stakeholders?: string[];
      focusQuestions?: string[];
      challenges?: string[];
    }
  ) => {
    try {
      const promises = [];

      if (relationships.partners) {
        // Delete existing and insert new
        await supabase.from('event_partner_links').delete().eq('event_id', eventId);
        if (relationships.partners.length > 0) {
          promises.push(
            supabase.from('event_partner_links').insert(
              relationships.partners.map(partnerId => ({ event_id: eventId, partner_id: partnerId }))
            )
          );
        }
      }

      if (relationships.stakeholders) {
        await supabase.from('event_stakeholder_links').delete().eq('event_id', eventId);
        if (relationships.stakeholders.length > 0) {
          promises.push(
            supabase.from('event_stakeholder_links').insert(
              relationships.stakeholders.map(stakeholderId => ({ event_id: eventId, stakeholder_id: stakeholderId }))
            )
          );
        }
      }

      if (relationships.focusQuestions) {
        await supabase.from('event_focus_question_links').delete().eq('event_id', eventId);
        if (relationships.focusQuestions.length > 0) {
          promises.push(
            supabase.from('event_focus_question_links').insert(
              relationships.focusQuestions.map(questionId => ({ event_id: eventId, focus_question_id: questionId }))
            )
          );
        }
      }

      if (relationships.challenges) {
        await supabase.from('event_challenge_links').delete().eq('event_id', eventId);
        if (relationships.challenges.length > 0) {
          promises.push(
            supabase.from('event_challenge_links').insert(
              relationships.challenges.map(challengeId => ({ event_id: eventId, challenge_id: challengeId }))
            )
          );
        }
      }

      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      logger.error('Failed to update event relationships', { eventId, relationships }, error as Error);
      throw error;
    }
  }, []);

  return {
    bulkDeleteEvents,
    bulkUpdateEventStatus,
    bulkAssignCategory,
    getEventRelationships,
    updateEventRelationships
  };
};