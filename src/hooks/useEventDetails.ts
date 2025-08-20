import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface EventPartner {
  id: string;
  name: string;
  name_ar?: string;
  logo_url?: string;
  partner_type: string;
  contact_email?: string;
  contact_phone?: string;
  partnership_status: string;
}

export interface EventStakeholder {
  id: string;
  organization: string;
  position: string;
  contact_person: string;
  contact_email?: string;
  stakeholder_type: string;
  involvement_level: string;
  status: string;
  engagement_status: string;
  invitation_status: string;
  attendance_status: string;
}

export interface RelatedChallenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  priority_level: string;
  start_date?: string;
  end_date?: string;
}

export interface RelatedFocusQuestion {
  id: string;
  question_ar: string;
  question_text_ar: string;
  question_type: string;
  priority: string;
  status: string;
  is_sensitive: boolean;
}

export interface EventParticipant {
  id: string;
  user_id: string;
  event_id: string;
  registration_date: string;
  attendance_status: string;
  registration_type: string;
  notes?: string;
  user?: {
    id: string;
    email?: string;
    profile_image_url?: string;
    full_name?: string;
  };
}

export interface CampaignInfo {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  start_date: string;
  end_date: string;
  budget?: number;
}

export function useEventDetails(eventId: string | null) {
  const [partners, setPartners] = useState<EventPartner[]>([]);
  const [stakeholders, setStakeholders] = useState<EventStakeholder[]>([]);
  const [relatedChallenges, setRelatedChallenges] = useState<RelatedChallenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<RelatedFocusQuestion[]>([]);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [campaignInfo, setCampaignInfo] = useState<CampaignInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEventDetails();
    }
  }, [eventId]);

  const loadEventDetails = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      await Promise.all([
        loadPartners(),
        loadStakeholders(),
        loadRelatedChallenges(),
        loadFocusQuestions(),
        loadParticipants(),
        loadCampaignInfo()
      ]);
    } catch (error) {
      logger.error('Error loading event details', { component: 'useEventDetails', action: 'loadEventDetails', eventId }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('event_partner_links')
        .select(`
          partner_id,
          partners (
            id,
            name,
            logo_url,
            partner_type
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      const partnersData = data?.map(link => ({
        id: link.partners?.id || '',
        name: link.partners?.name || '',
        name_ar: link.partners?.name || '',
        logo_url: link.partners?.logo_url,
        partner_type: link.partners?.partner_type || '',
        contact_email: '',
        contact_phone: '',
        partnership_status: 'active'
      })) || [];

      setPartners(partnersData);
    } catch (error) {
      logger.error('Error loading partners', { component: 'useEventDetails', action: 'loadPartners', eventId }, error as Error);
      setPartners([]);
    }
  };

  const loadStakeholders = async () => {
    try {
      const { data, error } = await supabase
        .from('event_stakeholder_links')
        .select(`
          stakeholder_id,
          stakeholders (
            id,
            organization,
            stakeholder_type
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      const stakeholdersData = data?.map(link => ({
        id: link.stakeholders?.id || '',
        organization: link.stakeholders?.organization || '',
        position: '',
        contact_person: '',
        contact_email: '',
        stakeholder_type: link.stakeholders?.stakeholder_type || '',
        involvement_level: '',
        status: 'active',
        engagement_status: 'engaged',
        invitation_status: 'invited',
        attendance_status: 'confirmed'
      })) || [];

      setStakeholders(stakeholdersData);
    } catch (error) {
      logger.error('Error loading stakeholders', { component: 'useEventDetails', action: 'loadStakeholders', eventId }, error as Error);
      setStakeholders([]);
    }
  };

  const loadRelatedChallenges = async () => {
    try {
      // Simplified - just return empty for now since tables may not be linked
      setRelatedChallenges([]);
    } catch (error) {
      logger.error('Error loading related challenges', { component: 'useEventDetails', action: 'loadRelatedChallenges', eventId }, error as Error);
      setRelatedChallenges([]);
    }
  };

  const loadFocusQuestions = async () => {
    try {
      // Simplified - just return empty for now since tables may not be linked  
      setFocusQuestions([]);
    } catch (error) {
      logger.error('Error loading focus questions', { component: 'useEventDetails', action: 'loadFocusQuestions', eventId }, error as Error);
      setFocusQuestions([]);
    }
  };

  const loadParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select(`
          id,
          user_id,
          event_id,
          registration_date,
          attendance_status,
          registration_type,
          notes
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      setParticipants(data || []);
    } catch (error) {
      logger.error('Error loading participants', { component: 'useEventDetails', action: 'loadParticipants', eventId }, error as Error);
      setParticipants([]);
    }
  };

  const loadCampaignInfo = async () => {
    try {
      // First get the event's campaign_id
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('campaign_id')
        .eq('id', eventId)
        .maybeSingle();

      if (eventError || !eventData?.campaign_id) {
        setCampaignInfo(null);
        return;
      }

      // Then get the campaign details
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('id, title_ar, description_ar, status, start_date, end_date, budget')
        .eq('id', eventData.campaign_id)
        .maybeSingle();

      if (campaignError) throw campaignError;

      setCampaignInfo(campaignData);
    } catch (error) {
      logger.error('Error loading campaign info', { component: 'useEventDetails', action: 'loadCampaignInfo', eventId }, error as Error);
      setCampaignInfo(null);
    }
  };

  const refetch = () => {
    loadEventDetails();
  };

  return {
    partners,
    stakeholders,
    relatedChallenges,
    focusQuestions,
    participants,
    campaignInfo,
    loading,
    refetch
  };
}