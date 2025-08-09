import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowRequest {
  challengeId: string;
  action: 'submit' | 'approve' | 'reject' | 'publish' | 'close' | 'extend';
  userId: string;
  reason?: string;
  data?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      challengeId, 
      action, 
      userId, 
      reason,
      data = {}
    }: WorkflowRequest = await req.json();

    console.log('Processing challenge workflow:', {
      challengeId,
      action,
      userId
    });

    // Get current challenge
    const { data: challenge, error: challengeError } = await supabaseClient
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (challengeError || !challenge) {
      throw new Error('Challenge not found');
    }

    let newStatus = challenge.status;
    let notifications: any[] = [];

    // Process workflow action
    switch (action) {
      case 'submit':
        if (challenge.status === 'draft') {
          newStatus = 'submitted';
          
          // Notify assigned experts and admins
          const { data: experts } = await supabaseClient
            .from('challenge_experts')
            .select('expert_id')
            .eq('challenge_id', challengeId)
            .eq('status', 'active');

          for (const expert of experts || []) {
            notifications.push({
              recipientId: expert.expert_id,
              type: 'new_challenge_submission',
              title: 'تحدي جديد يحتاج مراجعة',
              message: `تم تقديم تحدي جديد "${challenge.title_ar}" ويحتاج لمراجعتك`,
              actionUrl: `/challenges/${challengeId}`
            });
          }
        }
        break;

      case 'approve':
        if (challenge.status === 'submitted') {
          newStatus = 'approved';
          
          // Notify challenge creator
          if (challenge.created_by) {
            notifications.push({
              recipientId: challenge.created_by,
              type: 'challenge_approved',
              title: 'تم قبول التحدي',
              message: `تم قبول تحديك "${challenge.title_ar}" ويمكن نشره الآن`,
              actionUrl: `/challenges/${challengeId}`
            });
          }
        }
        break;

      case 'reject':
        if (challenge.status === 'submitted') {
          newStatus = 'rejected';
          
          // Notify challenge creator
          if (challenge.created_by) {
            notifications.push({
              recipientId: challenge.created_by,
              type: 'challenge_rejected',
              title: 'تم رفض التحدي',
              message: `تم رفض تحديك "${challenge.title_ar}". السبب: ${reason || 'غير محدد'}`,
              actionUrl: `/challenges/${challengeId}`
            });
          }
        }
        break;

      case 'publish':
        if (challenge.status === 'approved') {
          newStatus = 'active';
          
          // Notify all participants and interested users
          const { data: participants } = await supabaseClient
            .from('challenge_participants')
            .select('user_id')
            .eq('challenge_id', challengeId);

          for (const participant of participants || []) {
            notifications.push({
              recipientId: participant.user_id,
              type: 'challenge_published',
              title: 'تم نشر التحدي',
              message: `تم نشر التحدي "${challenge.title_ar}" ويمكنك الآن المشاركة فيه`,
              actionUrl: `/challenges/${challengeId}`
            });
          }
        }
        break;

      case 'close':
        if (['active', 'paused'].includes(challenge.status)) {
          newStatus = 'closed';
          
          // Notify all participants
          const { data: participants } = await supabaseClient
            .from('challenge_participants')
            .select('user_id')
            .eq('challenge_id', challengeId);

          for (const participant of participants || []) {
            notifications.push({
              recipientId: participant.user_id,
              type: 'challenge_closed',
              title: 'تم إغلاق التحدي',
              message: `تم إغلاق التحدي "${challenge.title_ar}". شكراً لمشاركتك`,
              actionUrl: `/challenges/${challengeId}`
            });
          }
        }
        break;

      case 'extend':
        if (challenge.status === 'active' && data.newEndDate) {
          // Update end date
          await supabaseClient
            .from('challenges')
            .update({ end_date: data.newEndDate })
            .eq('id', challengeId);

          // Notify participants
          const { data: participants } = await supabaseClient
            .from('challenge_participants')
            .select('user_id')
            .eq('challenge_id', challengeId);

          for (const participant of participants || []) {
            notifications.push({
              recipientId: participant.user_id,
              type: 'challenge_extended',
              title: 'تم تمديد التحدي',
              message: `تم تمديد التحدي "${challenge.title_ar}" حتى ${data.newEndDate}`,
              actionUrl: `/challenges/${challengeId}`
            });
          }
        }
        break;
    }

    // Update challenge status
    if (newStatus !== challenge.status) {
      const { error: updateError } = await supabaseClient
        .from('challenges')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', challengeId);

      if (updateError) {
        throw updateError;
      }

      // Log workflow change
      await supabaseClient
        .from('analytics_events')
        .insert({
          user_id: userId,
          event_type: 'challenge_workflow_change',
          event_category: 'workflow',
          entity_type: 'challenge',
          entity_id: challengeId,
          properties: {
            action,
            from_status: challenge.status,
            to_status: newStatus,
            reason,
            ...data
          }
        });
    }

    // Send notifications
    for (const notification of notifications) {
      try {
        await supabaseClient.functions.invoke('send-challenge-notification', {
          body: {
            challengeId,
            recipientId: notification.recipientId,
            notificationType: notification.type,
            title: notification.title,
            message: notification.message,
            actionUrl: notification.actionUrl,
            metadata: { action, reason, ...data }
          }
        });
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        previousStatus: challenge.status,
        newStatus,
        notificationsSent: notifications.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in challenge-workflow-manager:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);