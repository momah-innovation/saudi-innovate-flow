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

export const updateEventChallenges = async (eventId: string, challengeIds: string[]) => {
  // First, delete existing relationships
  await supabase
    .from("event_challenge_links")
    .delete()
    .eq("event_id", eventId);

  // Then insert new relationships
  if (challengeIds.length > 0) {
    const links = challengeIds.map(challengeId => ({
      event_id: eventId,
      challenge_id: challengeId
    }));

    const { error } = await supabase
      .from("event_challenge_links")
      .insert(links);

    if (error) throw error;
  }
};

// Tag relationship helpers
export const updateChallengeTagsById = async (challengeId: string, tagIds: string[]) => {
  // First, delete existing tag relationships
  await supabase
    .from("challenge_tags")
    .delete()
    .eq("challenge_id", challengeId);

  // Then insert new tag relationships
  if (tagIds.length > 0) {
    const links = tagIds.map(tagId => ({
      challenge_id: challengeId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from("challenge_tags")
      .insert(links);

    if (error) throw error;
  }
};

export const updateEventTagsById = async (eventId: string, tagIds: string[]) => {
  // First, delete existing tag relationships
  await supabase
    .from("event_tags")
    .delete()
    .eq("event_id", eventId);

  // Then insert new tag relationships
  if (tagIds.length > 0) {
    const links = tagIds.map(tagId => ({
      event_id: eventId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from("event_tags")
      .insert(links);

    if (error) throw error;
  }
};

export const updateCampaignTagsById = async (campaignId: string, tagIds: string[]) => {
  // First, delete existing tag relationships
  await supabase
    .from("campaign_tags")
    .delete()
    .eq("campaign_id", campaignId);

  // Then insert new tag relationships
  if (tagIds.length > 0) {
    const links = tagIds.map(tagId => ({
      campaign_id: campaignId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from("campaign_tags")
      .insert(links);

    if (error) throw error;
  }
};

export const updatePartnerTagsById = async (partnerId: string, tagIds: string[]) => {
  // First, delete existing tag relationships
  await supabase
    .from("partner_tags")
    .delete()
    .eq("partner_id", partnerId);

  // Then insert new tag relationships
  if (tagIds.length > 0) {
    const links = tagIds.map(tagId => ({
      partner_id: partnerId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from("partner_tags")
      .insert(links);

    if (error) throw error;
  }
};

export const updateStakeholderTagsById = async (stakeholderId: string, tagIds: string[]) => {
  // First, delete existing tag relationships
  await supabase
    .from("stakeholder_tags")
    .delete()
    .eq("stakeholder_id", stakeholderId);

  // Then insert new tag relationships
  if (tagIds.length > 0) {
    const links = tagIds.map(tagId => ({
      stakeholder_id: stakeholderId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from("stakeholder_tags")
      .insert(links);

    if (error) throw error;
  }
};

export const updateUserTagsById = async (userId: string, tagIds: string[], tagType: string = 'skill') => {
  // First, delete existing tag relationships of this type
  await supabase
    .from("user_tags")
    .delete()
    .eq("user_id", userId)
    .eq("tag_type", tagType);

  // Then insert new tag relationships
  if (tagIds.length > 0) {
    const links = tagIds.map(tagId => ({
      user_id: userId,
      tag_id: tagId,
      tag_type: tagType
    }));

    const { error } = await supabase
      .from("user_tags")
      .insert(links);

    if (error) throw error;
  }
};

// TODO: Uncomment after TypeScript types are updated for new tables
// Opportunity relationship helpers
// export const updateOpportunityParticipants = async (opportunityId: string, participantIds: string[]) => {
//   // First, delete existing relationships
//   await supabase
//     .from("opportunity_participants")
//     .delete()
//     .eq("opportunity_id", opportunityId);

//   // Then insert new relationships
//   if (participantIds.length > 0) {
//     const links = participantIds.map(participantId => ({
//       opportunity_id: opportunityId,
//       user_id: participantId,
//       participation_type: 'applicant',
//       status: 'applied'
//     }));

//     const { error } = await supabase
//       .from("opportunity_participants")
//       .insert(links);

//     if (error) throw error;
//   }
// };

// export const updateOpportunityExperts = async (opportunityId: string, expertIds: string[]) => {
//   // First, delete existing relationships
//   await supabase
//     .from("opportunity_experts")
//     .delete()
//     .eq("opportunity_id", opportunityId);

//   // Then insert new relationships
//   if (expertIds.length > 0) {
//     const links = expertIds.map(expertId => ({
//       opportunity_id: opportunityId,
//       expert_id: expertId,
//       role_type: 'evaluator',
//       status: 'active'
//     }));

//     const { error } = await supabase
//       .from("opportunity_experts")
//       .insert(links);

//     if (error) throw error;
//   }
// };

// // Campaign relationship helpers
// export const updateCampaignParticipants = async (campaignId: string, participantIds: string[]) => {
//   // First, delete existing relationships
//   await supabase
//     .from("campaign_participants")
//     .delete()
//     .eq("campaign_id", campaignId);

//   // Then insert new relationships
//   if (participantIds.length > 0) {
//     const links = participantIds.map(participantId => ({
//       campaign_id: campaignId,
//       user_id: participantId,
//       participation_type: 'participant',
//       status: 'registered'
//     }));

//     const { error } = await supabase
//       .from("campaign_participants")
//       .insert(links);

//     if (error) throw error;
//   }
// };

// // Expert relationship helpers
// export const updateExpertTagsById = async (expertId: string, tagIds: string[]) => {
//   // First, delete existing tag relationships
//   await supabase
//     .from("expert_tags")
//     .delete()
//     .eq("expert_id", expertId);

//   // Then insert new tag relationships
//   if (tagIds.length > 0) {
//     const links = tagIds.map(tagId => ({
//       expert_id: expertId,
//       tag_id: tagId
//     }));

//     const { error } = await supabase
//       .from("expert_tags")
//       .insert(links);

//     if (error) throw error;
//   }
// };