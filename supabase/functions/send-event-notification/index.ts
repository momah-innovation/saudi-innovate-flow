import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EventNotificationRequest {
  eventId: string;
  recipientId: string;
  notificationType: string;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
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
      eventId, 
      recipientId, 
      notificationType, 
      title, 
      message, 
      actionUrl, 
      metadata = {} 
    }: EventNotificationRequest = await req.json();

    console.log('Sending event notification:', {
      eventId,
      recipientId,
      notificationType,
      title
    });

    // Check if user should receive this notification type
    const shouldSend = await supabaseClient
      .rpc('should_send_notification', {
        p_user_id: recipientId,
        p_notification_type: notificationType,
        p_channel: 'in_app'
      });

    if (!shouldSend.data) {
      console.log('Notification blocked by user preferences');
      return new Response(
        JSON.stringify({ success: false, reason: 'blocked_by_preferences' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create notification record
    const { data: notification, error: notificationError } = await supabaseClient
      .from('event_notifications')
      .insert({
        event_id: eventId,
        recipient_id: recipientId,
        notification_type: notificationType,
        title,
        message,
        action_url: actionUrl,
        metadata
      })
      .select()
      .single();

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      throw notificationError;
    }

    // Send email notification if enabled
    const { data: preferences } = await supabaseClient
      .rpc('get_user_notification_preferences', { user_id: recipientId });

    if (preferences?.email_enabled && notificationType !== 'reminder') {
      try {
        const { data: userProfile } = await supabaseClient
          .from('profiles')
          .select('email')
          .eq('user_id', recipientId)
          .single();

        if (userProfile?.email) {
          await supabaseClient.functions.invoke('send-notification-email', {
            body: {
              to: userProfile.email,
              subject: title,
              template: 'event_notification',
              data: {
                title,
                message,
                actionUrl,
                eventId,
                notificationType
              }
            }
          });
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }
    }

    // Send real-time notification
    try {
      await supabaseClient
        .channel(`notifications:${recipientId}`)
        .send({
          type: 'broadcast',
          event: 'new_notification',
          payload: {
            id: notification.id,
            type: notificationType,
            title,
            message,
            eventId,
            actionUrl,
            metadata,
            createdAt: new Date().toISOString()
          }
        });
    } catch (realtimeError) {
      console.error('Error sending real-time notification:', realtimeError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationId: notification.id,
        message: 'Event notification sent successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-event-notification:', error);
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