import { supabase } from "@/integrations/supabase/client";

// Helper functions for managing junction table relationships

export const updateCampaignPartners = async (campaignId: string, partnerIds: string[]) => {
  // First, delete existing relationships
  await supabase
    .from("campaign_partner_links")
    .delete()
    .eq("campaign_id", campaignId);

  // Then insert new relationships
  if (partnerIds.length > 0) {
    const links = partnerIds.map(partnerId => ({
      campaign_id: campaignId,
      partner_id: partnerId
    }));

    const { error } = await supabase
      .from("campaign_partner_links")
      .insert(links);

    if (error) throw error;
  }
};

export const updateCampaignStakeholders = async (campaignId: string, stakeholderIds: string[]) => {
  // First, delete existing relationships
  await supabase
    .from("campaign_stakeholder_links")
    .delete()
    .eq("campaign_id", campaignId);

  // Then insert new relationships
  if (stakeholderIds.length > 0) {
    const links = stakeholderIds.map(stakeholderId => ({
      campaign_id: campaignId,
      stakeholder_id: stakeholderId
    }));

    const { error } = await supabase
      .from("campaign_stakeholder_links")
      .insert(links);

    if (error) throw error;
  }
};

export const updateEventPartners = async (eventId: string, partnerIds: string[]) => {
  // First, delete existing relationships
  await supabase
    .from("event_partner_links")
    .delete()
    .eq("event_id", eventId);

  // Then insert new relationships
  if (partnerIds.length > 0) {
    const links = partnerIds.map(partnerId => ({
      event_id: eventId,
      partner_id: partnerId
    }));

    const { error } = await supabase
      .from("event_partner_links")
      .insert(links);

    if (error) throw error;
  }
};

export const updateEventStakeholders = async (eventId: string, stakeholderIds: string[]) => {
  // First, delete existing relationships
  await supabase
    .from("event_stakeholder_links")
    .delete()
    .eq("event_id", eventId);

  // Then insert new relationships
  if (stakeholderIds.length > 0) {
    const links = stakeholderIds.map(stakeholderId => ({
      event_id: eventId,
      stakeholder_id: stakeholderId
    }));

    const { error } = await supabase
      .from("event_stakeholder_links")
      .insert(links);

    if (error) throw error;
  }
};

export const updateEventFocusQuestions = async (eventId: string, focusQuestionIds: string[]) => {
  // First, delete existing relationships
  await supabase
    .from("event_focus_question_links")
    .delete()
    .eq("event_id", eventId);

  // Then insert new relationships
  if (focusQuestionIds.length > 0) {
    const links = focusQuestionIds.map(focusQuestionId => ({
      event_id: eventId,
      focus_question_id: focusQuestionId
    }));

    const { error } = await supabase
      .from("event_focus_question_links")
      .insert(links);

    if (error) throw error;
  }
};