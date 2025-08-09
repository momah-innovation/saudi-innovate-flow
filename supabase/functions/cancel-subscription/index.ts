import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscriptionRequest {
  userId: string;
  subscriptionId?: string;
  reason?: string;
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
      userId, 
      subscriptionId, 
      reason = 'User requested cancellation' 
    }: SubscriptionRequest = await req.json();

    console.log('Cancelling subscription:', { userId, subscriptionId });

    // Get user's current subscription
    const { data: subscription, error: fetchError } = await supabaseClient
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (fetchError || !subscription) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No active subscription found' 
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Cancel with Paddle if external subscription ID exists
    const paddleVendorId = Deno.env.get('PADDLE_VENDOR_ID');
    const paddleApiKey = Deno.env.get('PADDLE_API_KEY');

    if (subscription.external_subscription_id && paddleVendorId && paddleApiKey) {
      try {
        const paddleResponse = await fetch('https://vendors.paddle.com/api/2.0/subscription/users_cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vendor_id: paddleVendorId,
            vendor_auth_code: paddleApiKey,
            subscription_id: subscription.external_subscription_id
          }),
        });

        const paddleResult = await paddleResponse.json();
        
        if (!paddleResult.success) {
          console.error('Paddle cancellation failed:', paddleResult);
        }
      } catch (paddleError) {
        console.error('Error cancelling with Paddle:', paddleError);
      }
    }

    // Update subscription status in database
    const { error: updateError } = await supabaseClient
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    if (updateError) {
      throw updateError;
    }

    // Log the cancellation
    await supabaseClient
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: 'subscription_cancelled',
        event_category: 'billing',
        properties: {
          subscription_id: subscription.id,
          plan: subscription.plan_name,
          reason,
          cancelled_at: new Date().toISOString()
        }
      });

    // Send notification to user
    try {
      await supabaseClient.functions.invoke('send-notification-email', {
        body: {
          to: subscription.user_email || 'user@example.com',
          subject: 'تم إلغاء اشتراكك - Subscription Cancelled',
          template: 'subscription_cancelled',
          data: {
            planName: subscription.plan_name,
            cancelledAt: new Date().toLocaleDateString('ar-SA'),
            reason
          }
        }
      });
    } catch (notificationError) {
      console.error('Error sending cancellation notification:', notificationError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Subscription cancelled successfully',
        subscriptionId: subscription.id,
        cancelledAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in cancel-subscription:', error);
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