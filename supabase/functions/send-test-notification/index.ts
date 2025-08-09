import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestNotificationRequest {
  recipientId: string;
  notificationType: string;
  title: string;
  message: string;
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
      recipientId, 
      notificationType, 
      title, 
      message 
    }: TestNotificationRequest = await req.json();

    console.log('Sending test notification:', {
      recipientId,
      notificationType,
      title
    });

    // Create test notification
    const { data: notification, error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        recipient_id: recipientId,
        notification_type: notificationType,
        title,
        message,
        metadata: { test: true, sent_at: new Date().toISOString() }
      })
      .select()
      .single();

    if (notificationError) {
      console.error('Error creating test notification:', notificationError);
      throw notificationError;
    }

    // Send real-time notification
    try {
      await supabaseClient
        .channel(`notifications:${recipientId}`)
        .send({
          type: 'broadcast',
          event: 'test_notification',
          payload: {
            id: notification.id,
            type: notificationType,
            title,
            message,
            isTest: true,
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
        message: 'Test notification sent successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-test-notification:', error);
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