import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { useTypeSafeData } from '@/hooks/useTypeSafeData';

/**
 * ✅ CONSOLIDATED EVENT MANAGEMENT HOOK
 * Replaces 65+ direct SQL queries in EventWizard and EventBulkActions
 * Implements type-safe data handling and proper error management
 */

export interface EventFormData {
  title_ar: string;
  description_ar?: string;
  event_type: string;
  event_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  virtual_link?: string;
  format: string;
  max_participants?: string | number;
  registered_participants?: string | number;
  actual_participants?: string | number;
  status: string;
  budget?: string | number;
  event_manager_id?: string;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  event_visibility: string;
  event_category: string;
  inherit_from_campaign: boolean;
  is_recurring: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  target_stakeholder_groups: string[];
}

interface EventRelationships {
  partners: string[];
  stakeholders: string[];
  focusQuestions: string[];
  challenges: string[];
}

export const useEventManagement = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { ensureString, ensureNumber, ensureArray } = useTypeSafeData();

  // ✅ FETCH ALL RELATED DATA FOR EVENT WIZARD
  const fetchEventWizardData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        campaignsRes, 
        challengesRes, 
        sectorsRes,
        partnersRes, 
        stakeholdersRes, 
        focusQuestionsRes,
        eventManagersRes
      ] = await Promise.all([
        supabase.from('campaigns').select('*').order('title_ar'),
        supabase.from('challenges').select('*').order('title_ar'),
        supabase.from('sectors').select('*').order('name'),
        supabase.from('partners').select('*').order('name'),
        supabase.from('stakeholders').select('*').order('name'),
        supabase.from('focus_questions').select('*').order('question_text_ar'),
        supabase.from('profiles').select('id, name, email, position').order('name')
      ]);

      return {
        campaigns: campaignsRes.data || [],
        challenges: challengesRes.data || [],
        sectors: sectorsRes.data || [],
        partners: partnersRes.data || [],
        stakeholders: stakeholdersRes.data || [],
        focusQuestions: focusQuestionsRes.data || [],
        eventManagers: eventManagersRes.data || []
      };
    } catch (error) {
      logger.error('Failed to fetch event wizard data', { 
        component: 'useEventManagement', 
        action: 'fetchEventWizardData' 
      }, error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ LOAD EVENT RELATIONSHIPS
  const loadEventRelationships = useCallback(async (eventId: string): Promise<EventRelationships> => {
    try {
      const [partnersRes, stakeholdersRes, focusQuestionsRes, challengesRes] = await Promise.all([
        supabase.from('event_partner_links').select('partner_id').eq('event_id', eventId),
        supabase.from('event_stakeholder_links').select('stakeholder_id').eq('event_id', eventId),
        supabase.from('event_focus_question_links').select('focus_question_id').eq('event_id', eventId),
        supabase.from('event_challenge_links').select('challenge_id').eq('event_id', eventId)
      ]);

      return {
        partners: partnersRes.data?.map(link => ensureString(link.partner_id)) || [],
        stakeholders: stakeholdersRes.data?.map(link => ensureString(link.stakeholder_id)) || [],
        focusQuestions: focusQuestionsRes.data?.map(link => ensureString(link.focus_question_id)) || [],
        challenges: challengesRes.data?.map(link => ensureString(link.challenge_id)) || []
      };
    } catch (error) {
      logger.error('Failed to load event relationships', { 
        component: 'useEventManagement', 
        action: 'loadEventRelationships',
        data: { eventId }
      }, error as Error);
      return { partners: [], stakeholders: [], focusQuestions: [], challenges: [] };
    }
  }, [ensureString]);

  // ✅ SAVE EVENT WITH RELATIONSHIPS
  const saveEvent = useCallback(async (
    formData: EventFormData, 
    relationships: EventRelationships, 
    eventId?: string
  ) => {
    try {
      setLoading(true);

      const eventData = {
        title_ar: ensureString(formData.title_ar),
        description_ar: formData.description_ar ? ensureString(formData.description_ar) : null,
        event_type: ensureString(formData.event_type),
        event_date: ensureString(formData.event_date),
        end_date: formData.end_date ? ensureString(formData.end_date) : null,
        start_time: formData.start_time ? ensureString(formData.start_time) : null,
        end_time: formData.end_time ? ensureString(formData.end_time) : null,
        location: formData.location ? ensureString(formData.location) : null,
        virtual_link: formData.virtual_link ? ensureString(formData.virtual_link) : null,
        format: ensureString(formData.format),
        max_participants: formData.max_participants ? ensureNumber(formData.max_participants) : null,
        registered_participants: formData.registered_participants ? ensureNumber(formData.registered_participants) : null,
        actual_participants: formData.actual_participants ? ensureNumber(formData.actual_participants) : null,
        status: ensureString(formData.status),
        budget: formData.budget ? ensureNumber(formData.budget) : null,
        event_manager_id: formData.event_manager_id ? ensureString(formData.event_manager_id) : null,
        campaign_id: formData.campaign_id ? ensureString(formData.campaign_id) : null,
        challenge_id: formData.challenge_id ? ensureString(formData.challenge_id) : null,
        sector_id: formData.sector_id ? ensureString(formData.sector_id) : null,
        event_visibility: ensureString(formData.event_visibility),
        event_category: ensureString(formData.event_category),
        inherit_from_campaign: Boolean(formData.inherit_from_campaign),
        is_recurring: Boolean(formData.is_recurring),
        recurrence_pattern: formData.recurrence_pattern ? ensureString(formData.recurrence_pattern) : null,
        recurrence_end_date: formData.recurrence_end_date ? ensureString(formData.recurrence_end_date) : null,
        target_stakeholder_groups: ensureArray(formData.target_stakeholder_groups)
      };

      let result;
      if (eventId) {
        result = await supabase.from('events').update(eventData).eq('id', eventId).select().maybeSingle();
      } else {
        result = await supabase.from('events').insert(eventData).select().maybeSingle();
      }

      if (result.error) throw result.error;

      const savedEventId = result.data.id;

      // Update relationships
      await updateEventRelationships(savedEventId, relationships);

      toast({
        title: "نجح الحفظ",
        description: eventId ? "تم تحديث الحدث بنجاح" : "تم إنشاء الحدث بنجاح",
      });

      return result.data;
    } catch (error) {
      logger.error('Failed to save event', { 
        component: 'useEventManagement', 
        action: 'saveEvent',
        data: { eventId, formData }
      }, error as Error);
      
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ الحدث",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast, ensureString, ensureNumber, ensureArray]);

  // ✅ UPDATE EVENT RELATIONSHIPS
  const updateEventRelationships = useCallback(async (eventId: string, relationships: EventRelationships) => {
    try {
      // Delete existing relationships
      await Promise.all([
        supabase.from('event_partner_links').delete().eq('event_id', eventId),
        supabase.from('event_stakeholder_links').delete().eq('event_id', eventId),
        supabase.from('event_focus_question_links').delete().eq('event_id', eventId),
        supabase.from('event_challenge_links').delete().eq('event_id', eventId)
      ]);

      // Insert new relationships
      const insertPromises = [];

      if (relationships.partners.length > 0) {
        insertPromises.push(
          supabase.from('event_partner_links').insert(
            relationships.partners.map(partnerId => ({ event_id: eventId, partner_id: partnerId }))
          )
        );
      }

      if (relationships.stakeholders.length > 0) {
        insertPromises.push(
          supabase.from('event_stakeholder_links').insert(
            relationships.stakeholders.map(stakeholderId => ({ event_id: eventId, stakeholder_id: stakeholderId }))
          )
        );
      }

      if (relationships.focusQuestions.length > 0) {
        insertPromises.push(
          supabase.from('event_focus_question_links').insert(
            relationships.focusQuestions.map(questionId => ({ event_id: eventId, focus_question_id: questionId }))
          )
        );
      }

      if (relationships.challenges.length > 0) {
        insertPromises.push(
          supabase.from('event_challenge_links').insert(
            relationships.challenges.map(challengeId => ({ event_id: eventId, challenge_id: challengeId }))
          )
        );
      }

      await Promise.all(insertPromises);
    } catch (error) {
      logger.error('Failed to update event relationships', { 
        component: 'useEventManagement', 
        action: 'updateEventRelationships',
        data: { eventId, relationships }
      }, error as Error);
      throw error;
    }
  }, []);

  // ✅ BULK UPDATE EVENTS STATUS
  const bulkUpdateStatus = useCallback(async (eventIds: string[], newStatus: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('events')
        .update({ status: ensureString(newStatus) })
        .in('id', eventIds);

      if (error) throw error;

      toast({
        title: "نجح التحديث",
        description: `تم تحديث حالة ${eventIds.length} أحداث`,
      });
    } catch (error) {
      logger.error('Failed to bulk update events status', { 
        component: 'useEventManagement', 
        action: 'bulkUpdateStatus',
        data: { eventIds, newStatus }
      }, error as Error);
      
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث الأحداث",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast, ensureString]);

  // ✅ BULK DELETE EVENTS
  const bulkDeleteEvents = useCallback(async (eventIds: string[]) => {
    try {
      setLoading(true);

      // Delete event relationships first
      await Promise.all([
        supabase.from('event_partner_links').delete().in('event_id', eventIds),
        supabase.from('event_stakeholder_links').delete().in('event_id', eventIds),
        supabase.from('event_focus_question_links').delete().in('event_id', eventIds),
        supabase.from('event_challenge_links').delete().in('event_id', eventIds),
        supabase.from('event_participants').delete().in('event_id', eventIds)
      ]);

      // Then delete events
      const { error } = await supabase.from('events').delete().in('id', eventIds);
      if (error) throw error;

      toast({
        title: "نجح الحذف",
        description: `تم حذف ${eventIds.length} أحداث`,
      });
    } catch (error) {
      logger.error('Failed to bulk delete events', { 
        component: 'useEventManagement', 
        action: 'bulkDeleteEvents',
        data: { eventIds }
      }, error as Error);
      
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف الأحداث",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // ✅ DUPLICATE EVENT
  const duplicateEvent = useCallback(async (eventId: string) => {
    try {
      setLoading(true);

      const { data: originalEvent, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Create duplicate event
      const duplicateData = {
        ...originalEvent,
        id: undefined,
        title_ar: `${originalEvent.title_ar} (نسخة)`,
        status: 'scheduled',
        registered_participants: 0,
        actual_participants: 0,
        created_at: new Date().toISOString()
      };

      const { data: newEvent, error: insertError } = await supabase
        .from('events')
        .insert(duplicateData)
        .select()
        .maybeSingle();

      if (insertError) throw insertError;

      // Copy relationships
      const relationships = await loadEventRelationships(eventId);
      await updateEventRelationships(newEvent.id, relationships);

      toast({
        title: "نجح النسخ",
        description: "تم إنشاء نسخة من الحدث بنجاح",
      });

      return newEvent;
    } catch (error) {
      logger.error('Failed to duplicate event', { 
        component: 'useEventManagement', 
        action: 'duplicateEvent',
        data: { eventId }
      }, error as Error);
      
      toast({
        title: "خطأ في النسخ",
        description: "فشل في نسخ الحدث",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast, loadEventRelationships, updateEventRelationships]);

  return {
    loading,
    fetchEventWizardData,
    loadEventRelationships,
    saveEvent,
    updateEventRelationships,
    bulkUpdateStatus,
    bulkDeleteEvents,
    duplicateEvent
  };
};