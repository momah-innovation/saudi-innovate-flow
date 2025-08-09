import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://supabase.com/dist/v1/deno.js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowRequest {
  opportunityId: string;
  action: 'register' | 'assign_expert' | 'submit_feedback' | 'send_notification' | 'add_comment' | 'bulk_register';
  data?: any;
  userId?: string;
  expertId?: string;
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
      case 'assign_expert':
        result = await handleExpertAssignment(supabase, request, user.id);
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
      default:
        throw new Error(`Unknown action: ${request.action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in opportunity workflow:', error);
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
  // Register user for opportunity
  const { data: participation, error: regError } = await supabase
    .from('opportunity_participants')
    .insert({
      opportunity_id: request.opportunityId,
      user_id: request.userId || userId,
      participation_type: request.data?.participationType || 'applicant',
      status: 'applied',
      notes: request.data?.notes
    })
    .select()
    .single();

  if (regError) throw regError;

  // Update opportunity analytics
  await updateOpportunityAnalytics(supabase, request.opportunityId);

  // Send confirmation notification
  await sendNotification(supabase, {
    opportunityId: request.opportunityId,
    recipientId: request.userId || userId,
    senderId: userId,
    type: 'registration_confirmation',
    title: 'تم التسجيل في الفرصة بنجاح',
    message: 'تم تسجيلك في الفرصة بنجاح. سيتم التواصل معك قريباً.',
    metadata: { participationId: participation.id }
  });

  console.log(`User ${userId} registered for opportunity ${request.opportunityId}`);
  return { success: true, participation };
}

async function handleExpertAssignment(supabase: any, request: WorkflowRequest, userId: string) {
  const { data: assignment, error: assignError } = await supabase
    .from('opportunity_experts')
    .insert({
      opportunity_id: request.opportunityId,
      expert_id: request.expertId,
      role_type: request.data?.roleType || 'evaluator',
      status: 'active',
      notes: request.data?.notes
    })
    .select()
    .single();

  if (assignError) throw assignError;

  // Notify the expert
  await sendNotification(supabase, {
    opportunityId: request.opportunityId,
    recipientId: request.expertId!,
    senderId: userId,
    type: 'expert_assignment',
    title: 'تم تعيينك كخبير للفرصة',
    message: 'تم تعيينك كخبير لتقييم هذه الفرصة. يرجى مراجعة التفاصيل.',
    metadata: { assignmentId: assignment.id, roleType: request.data?.roleType }
  });

  console.log(`Expert ${request.expertId} assigned to opportunity ${request.opportunityId}`);
  return { success: true, assignment };
}

async function handleFeedbackSubmission(supabase: any, request: WorkflowRequest, userId: string) {
  const { data: feedback, error: feedbackError } = await supabase
    .from('opportunity_feedback')
    .upsert({
      opportunity_id: request.opportunityId,
      user_id: userId,
      rating: request.data.rating,
      feedback_text: request.data.feedbackText,
      would_recommend: request.data.wouldRecommend
    })
    .select()
    .single();

  if (feedbackError) throw feedbackError;

  // Update analytics
  await updateOpportunityAnalytics(supabase, request.opportunityId);

  console.log(`Feedback submitted for opportunity ${request.opportunityId} by user ${userId}`);
  return { success: true, feedback };
}

async function handleNotificationSending(supabase: any, request: WorkflowRequest, userId: string) {
  const notification = await sendNotification(supabase, {
    opportunityId: request.opportunityId,
    recipientId: request.data.recipientId,
    senderId: userId,
    type: request.data.type,
    title: request.data.title,
    message: request.data.message,
    actionUrl: request.data.actionUrl,
    metadata: request.data.metadata || {}
  });

  console.log(`Notification sent for opportunity ${request.opportunityId}`);
  return { success: true, notification };
}

async function handleCommentCreation(supabase: any, request: WorkflowRequest, userId: string) {
  const { data: comment, error: commentError } = await supabase
    .from('opportunity_comments')
    .insert({
      opportunity_id: request.opportunityId,
      user_id: userId,
      content: request.data.content,
      parent_comment_id: request.data.parentCommentId,
      is_expert_comment: request.data.isExpertComment || false
    })
    .select()
    .single();

  if (commentError) throw commentError;

  // Notify opportunity participants about new comment
  if (!request.data.parentCommentId) {
    const { data: participants } = await supabase
      .from('opportunity_participants')
      .select('user_id')
      .eq('opportunity_id', request.opportunityId)
      .neq('user_id', userId);

    for (const participant of participants || []) {
      await sendNotification(supabase, {
        opportunityId: request.opportunityId,
        recipientId: participant.user_id,
        senderId: userId,
        type: 'new_comment',
        title: 'تعليق جديد على الفرصة',
        message: 'تم إضافة تعليق جديد على الفرصة التي تشارك فيها.',
        metadata: { commentId: comment.id }
      });
    }
  }

  console.log(`Comment added to opportunity ${request.opportunityId} by user ${userId}`);
  return { success: true, comment };
}

async function handleBulkRegistration(supabase: any, request: WorkflowRequest, userId: string) {
  if (!request.participantIds || request.participantIds.length === 0) {
    throw new Error('No participant IDs provided');
  }

  const registrations = request.participantIds.map(participantId => ({
    opportunity_id: request.opportunityId,
    user_id: participantId,
    participation_type: request.data?.participationType || 'applicant',
    status: 'applied'
  }));

  const { data: participants, error: regError } = await supabase
    .from('opportunity_participants')
    .insert(registrations)
    .select();

  if (regError) throw regError;

  // Send notifications to all participants
  for (const participantId of request.participantIds) {
    await sendNotification(supabase, {
      opportunityId: request.opportunityId,
      recipientId: participantId,
      senderId: userId,
      type: 'bulk_registration',
      title: 'تم تسجيلك في الفرصة',
      message: 'تم تسجيلك في الفرصة بواسطة إدارة المنصة.',
      metadata: { bulkRegistration: true }
    });
  }

  // Update analytics
  await updateOpportunityAnalytics(supabase, request.opportunityId);

  console.log(`Bulk registration completed for opportunity ${request.opportunityId}: ${request.participantIds.length} participants`);
  return { success: true, participants, count: request.participantIds.length };
}

async function sendNotification(supabase: any, notificationData: any) {
  const { data, error } = await supabase
    .from('opportunity_notifications')
    .insert({
      opportunity_id: notificationData.opportunityId,
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

async function updateOpportunityAnalytics(supabase: any, opportunityId: string) {
  // Get current counts
  const [participantResult, feedbackResult] = await Promise.all([
    supabase.from('opportunity_participants').select('*', { count: 'exact' }).eq('opportunity_id', opportunityId),
    supabase.from('opportunity_feedback').select('rating', { count: 'exact' }).eq('opportunity_id', opportunityId)
  ]);

  const participantCount = participantResult.count || 0;
  const feedbackCount = feedbackResult.count || 0;
  const avgRating = feedbackResult.data?.length > 0 
    ? feedbackResult.data.reduce((sum: number, item: any) => sum + (item.rating || 0), 0) / feedbackResult.data.length 
    : 0;

  // Update analytics
  await supabase
    .from('opportunity_analytics')
    .upsert({
      opportunity_id: opportunityId,
      application_count: participantCount,
      like_count: 0, // Will be updated by other functions
      view_count: 0, // Will be updated by tracking
      share_count: 0, // Will be updated by sharing
      last_updated: new Date().toISOString()
    });
}

serve(handler);