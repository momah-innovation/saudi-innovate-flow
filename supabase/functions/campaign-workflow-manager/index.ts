import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://supabase.com/dist/v1/deno.js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowRequest {
  campaignId: string;
  action: 'register' | 'submit_feedback' | 'send_notification' | 'add_comment' | 'bulk_register' | 'track_analytics';
  data?: any;
  userId?: string;
  participantIds?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const request: WorkflowRequest = await req.json();

    let result;
    switch (request.action) {
      case 'register':
        result = await handleParticipantRegistration(supabase, request, user.id);
        break;
      case 'submit_feedback':
        result = await handleFeedbackSubmission(supabase, request, user.id);
        break;
      case 'send_notification':
        result = await handleNotificationSending(supabase, request, user.id);
        break;
      case 'add_comment':
        result = await handleCommentCreation(supabase, request, user.id);
        break;
      case 'bulk_register':
        result = await handleBulkRegistration(supabase, request, user.id);
        break;
      case 'track_analytics':
        result = await handleAnalyticsTracking(supabase, request, user.id);
        break;
      default:
        throw new Error(`Unknown action: ${request.action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in campaign workflow:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

async function handleParticipantRegistration(supabase: any, request: WorkflowRequest, userId: string) {
  // Register user for campaign
  const { data: participation, error: regError } = await supabase
    .from('campaign_participants')
    .insert({
      campaign_id: request.campaignId,
      user_id: request.userId || userId,
      participation_type: request.data?.participationType || 'participant',
      status: 'registered',
      notes: request.data?.notes
    })
    .select()
    .single();

  if (regError) throw regError;

  // Update campaign analytics
  await updateCampaignAnalytics(supabase, request.campaignId);

  // Send confirmation notification
  await sendNotification(supabase, {
    campaignId: request.campaignId,
    recipientId: request.userId || userId,
    senderId: userId,
    type: 'registration_confirmation',
    title: 'تم التسجيل في الحملة بنجاح',
    message: 'تم تسجيلك في الحملة بنجاح. ترقب المزيد من التحديثات.',
    metadata: { participationId: participation.id }
  });

  console.log(`User ${userId} registered for campaign ${request.campaignId}`);
  return { success: true, participation };
}

async function handleFeedbackSubmission(supabase: any, request: WorkflowRequest, userId: string) {
  const { data: feedback, error: feedbackError } = await supabase
    .from('campaign_feedback')
    .upsert({
      campaign_id: request.campaignId,
      user_id: userId,
      rating: request.data.rating,
      feedback_text: request.data.feedbackText,
      would_recommend: request.data.wouldRecommend
    })
    .select()
    .single();

  if (feedbackError) throw feedbackError;

  // Update analytics
  await updateCampaignAnalytics(supabase, request.campaignId);

  console.log(`Feedback submitted for campaign ${request.campaignId} by user ${userId}`);
  return { success: true, feedback };
}

async function handleNotificationSending(supabase: any, request: WorkflowRequest, userId: string) {
  const notification = await sendNotification(supabase, {
    campaignId: request.campaignId,
    recipientId: request.data.recipientId,
    senderId: userId,
    type: request.data.type,
    title: request.data.title,
    message: request.data.message,
    actionUrl: request.data.actionUrl,
    metadata: request.data.metadata || {}
  });

  console.log(`Notification sent for campaign ${request.campaignId}`);
  return { success: true, notification };
}

async function handleCommentCreation(supabase: any, request: WorkflowRequest, userId: string) {
  const { data: comment, error: commentError } = await supabase
    .from('campaign_comments')
    .insert({
      campaign_id: request.campaignId,
      user_id: userId,
      content: request.data.content,
      parent_comment_id: request.data.parentCommentId,
      is_expert_comment: request.data.isExpertComment || false
    })
    .select()
    .single();

  if (commentError) throw commentError;

  // Notify campaign participants about new comment
  if (!request.data.parentCommentId) {
    const { data: participants } = await supabase
      .from('campaign_participants')
      .select('user_id')
      .eq('campaign_id', request.campaignId)
      .neq('user_id', userId);

    for (const participant of participants || []) {
      await sendNotification(supabase, {
        campaignId: request.campaignId,
        recipientId: participant.user_id,
        senderId: userId,
        type: 'new_comment',
        title: 'تعليق جديد على الحملة',
        message: 'تم إضافة تعليق جديد على الحملة التي تشارك فيها.',
        metadata: { commentId: comment.id }
      });
    }
  }

  console.log(`Comment added to campaign ${request.campaignId} by user ${userId}`);
  return { success: true, comment };
}

async function handleBulkRegistration(supabase: any, request: WorkflowRequest, userId: string) {
  if (!request.participantIds || request.participantIds.length === 0) {
    throw new Error('No participant IDs provided');
  }

  const registrations = request.participantIds.map(participantId => ({
    campaign_id: request.campaignId,
    user_id: participantId,
    participation_type: request.data?.participationType || 'participant',
    status: 'registered'
  }));

  const { data: participants, error: regError } = await supabase
    .from('campaign_participants')
    .insert(registrations)
    .select();

  if (regError) throw regError;

  // Send notifications to all participants
  for (const participantId of request.participantIds) {
    await sendNotification(supabase, {
      campaignId: request.campaignId,
      recipientId: participantId,
      senderId: userId,
      type: 'bulk_registration',
      title: 'تم تسجيلك في الحملة',
      message: 'تم تسجيلك في الحملة بواسطة إدارة المنصة.',
      metadata: { bulkRegistration: true }
    });
  }

  // Update analytics
  await updateCampaignAnalytics(supabase, request.campaignId);

  console.log(`Bulk registration completed for campaign ${request.campaignId}: ${request.participantIds.length} participants`);
  return { success: true, participants, count: request.participantIds.length };
}

async function handleAnalyticsTracking(supabase: any, request: WorkflowRequest, userId: string) {
  const analyticsData = request.data;
  
  // Track analytics event
  await supabase
    .from('analytics_events')
    .insert({
      user_id: userId,
      event_type: analyticsData.eventType,
      event_category: 'campaign',
      entity_type: 'campaign',
      entity_id: request.campaignId,
      properties: analyticsData.properties || {},
      metadata: analyticsData.metadata || {}
    });

  // Update campaign analytics based on event type
  if (analyticsData.eventType === 'view') {
    await supabase.rpc('increment_campaign_views', { p_campaign_id: request.campaignId });
  } else if (analyticsData.eventType === 'like') {
    await supabase.rpc('increment_campaign_likes', { p_campaign_id: request.campaignId });
  } else if (analyticsData.eventType === 'share') {
    await supabase.rpc('increment_campaign_shares', { p_campaign_id: request.campaignId });
  }

  console.log(`Analytics tracked for campaign ${request.campaignId}: ${analyticsData.eventType}`);
  return { success: true, tracked: true };
}

async function sendNotification(supabase: any, notificationData: any) {
  const { data, error } = await supabase
    .from('campaign_notifications')
    .insert({
      campaign_id: notificationData.campaignId,
      recipient_id: notificationData.recipientId,
      sender_id: notificationData.senderId,
      notification_type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      action_url: notificationData.actionUrl,
      metadata: notificationData.metadata
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateCampaignAnalytics(supabase: any, campaignId: string) {
  // Get current counts
  const [participantResult, feedbackResult] = await Promise.all([
    supabase.from('campaign_participants').select('*', { count: 'exact' }).eq('campaign_id', campaignId),
    supabase.from('campaign_feedback').select('rating', { count: 'exact' }).eq('campaign_id', campaignId)
  ]);

  const participantCount = participantResult.count || 0;
  const feedbackCount = feedbackResult.count || 0;

  // Update analytics
  await supabase
    .from('campaign_analytics')
    .upsert({
      campaign_id: campaignId,
      participant_count: participantCount,
      like_count: 0, // Will be updated by analytics tracking
      view_count: 0, // Will be updated by analytics tracking
      share_count: 0, // Will be updated by analytics tracking
      bookmark_count: 0, // Will be updated by other functions
      engagement_rate: 0, // Will be calculated
      conversion_rate: participantCount > 0 ? (participantCount / Math.max(1, feedbackCount)) * 100 : 0,
      last_updated: new Date().toISOString()
    });
}

serve(handler);