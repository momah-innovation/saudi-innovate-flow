import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EventPartner {
  id: string;
  name: string;
  name_ar: string;
  partner_type: string;
  logo_url?: string;
  contact_person?: string;
  email?: string;
}

interface EventStakeholder {
  id: string;
  name?: string;
  organization: string;
  position?: string;
  stakeholder_type: string;
  engagement_status: string;
  invitation_status: string;
  attendance_status: string;
}

interface RelatedChallenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  priority_level: string;
}

interface RelatedFocusQuestion {
  id: string;
  question_text_ar: string;
  question_type: string;
  is_sensitive: boolean;
}

interface EventParticipant {
  id: string;
  user_id: string;
  registration_date: string;
  attendance_status: string;
  check_in_time?: string;
  check_out_time?: string;
  registration_type: string;
  notes?: string;
}

interface CampaignInfo {
  id: string;
  title_ar: string;
  description_ar?: string;
  status: string;
}

export const useEventDetails = (eventId: string | null) => {
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
    
    setLoading(true);
    try {
      await Promise.all([
        loadPartners(),
        loadStakeholders(),
        loadRelatedChallenges(),
        loadFocusQuestions(),
        loadParticipants(),
        loadCampaignInfo()
      ]);
    } catch (error) {
      console.error('Error loading event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPartners = async () => {
    if (!eventId) return;

    try {
      const { data, error } = await supabase
        .from('event_partner_links')
        .select(`
          partner_id,
          partners!inner (
            id,
            name,
            name_ar,
            partner_type,
            logo_url,
            contact_person,
            email
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      const partnerData = data?.map(link => link.partners) || [];
      setPartners(partnerData as EventPartner[]);
    } catch (error) {
      console.error('Error loading partners:', error);
    }
  };

  const loadStakeholders = async () => {
    if (!eventId) return;

    try {
      const { data, error } = await supabase
        .from('event_stakeholders')
        .select(`
          invitation_status,
          attendance_status,
          stakeholders!inner (
            id,
            name,
            organization,
            position,
            stakeholder_type,
            engagement_status
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      const stakeholderData = data?.map(link => ({
        ...link.stakeholders,
        invitation_status: link.invitation_status,
        attendance_status: link.attendance_status
      })) || [];
      
      setStakeholders(stakeholderData as EventStakeholder[]);
    } catch (error) {
      console.error('Error loading stakeholders:', error);
    }
  };

  const loadRelatedChallenges = async () => {
    if (!eventId) return;

    try {
      const { data, error } = await supabase
        .from('event_challenge_links')
        .select(`
          challenge_id,
          challenges!inner (
            id,
            title_ar,
            description_ar,
            status,
            priority_level
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      const challengeData = data?.map(link => link.challenges).filter(Boolean) || [];
      setRelatedChallenges(challengeData as RelatedChallenge[]);
    } catch (error) {
      console.error('Error loading related challenges:', error);
    }
  };

  const loadFocusQuestions = async () => {
    if (!eventId) return;

    try {
      const { data, error } = await supabase
        .from('event_focus_question_links')
        .select(`
          focus_question_id,
          focus_questions!inner (
            id,
            question_text_ar,
            question_type,
            is_sensitive
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      const questionsData = data?.map(link => link.focus_questions) || [];
      setFocusQuestions(questionsData as RelatedFocusQuestion[]);
    } catch (error) {
      console.error('Error loading focus questions:', error);
    }
  };

  const loadParticipants = async () => {
    if (!eventId) return;

    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false });

      if (error) throw error;

      setParticipants(data || []);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const loadCampaignInfo = async () => {
    if (!eventId) return;

    try {
      // First get the event to check if it has a campaign_id
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('campaign_id')
        .eq('id', eventId)
        .single();

      if (eventError || !eventData?.campaign_id) return;

      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title_ar, description_ar, status')
        .eq('id', eventData.campaign_id)
        .single();

      if (error) throw error;

      setCampaignInfo(data);
    } catch (error) {
      console.error('Error loading campaign info:', error);
    }
  };

  return {
    partners,
    stakeholders,
    relatedChallenges,
    focusQuestions,
    participants,
    campaignInfo,
    loading,
    refetch: loadEventDetails
  };
};