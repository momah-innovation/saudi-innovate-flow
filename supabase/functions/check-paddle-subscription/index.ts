import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-PADDLE-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const paddleApiKey = Deno.env.get("PADDLE_API_KEY");
    if (!paddleApiKey) throw new Error("PADDLE_API_KEY is not set");
    logStep("Paddle API key verified");

    // Create Supabase client with service role for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user's current subscription from database
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from("user_subscriptions")
      .select(`
        *,
        subscription_plan:subscription_plans(*)
      `)
      .eq("user_id", user.id)
      .single();

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      logStep("Database error", subscriptionError);
      throw new Error(`Database error: ${subscriptionError.message}`);
    }

    if (!subscription) {
      logStep("No subscription found for user");
      return new Response(JSON.stringify({
        has_subscription: false,
        subscription_status: null,
        plan_name: null,
        expires_at: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // If we have a paddle subscription ID, verify with Paddle API
    if (subscription.paddle_subscription_id) {
      logStep("Checking subscription with Paddle", { subscriptionId: subscription.paddle_subscription_id });
      
      const paddleResponse = await fetch(`https://api.paddle.com/subscriptions/${subscription.paddle_subscription_id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${paddleApiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (paddleResponse.ok) {
        const paddleData = await paddleResponse.json();
        const paddleSubscription = paddleData.data;
        
        logStep("Paddle subscription data received", { 
          status: paddleSubscription.status,
          currentPeriodEnd: paddleSubscription.current_billing_period?.ends_at 
        });

        // Update our database with the latest info from Paddle
        const isActive = paddleSubscription.status === 'active';
        const { error: updateError } = await supabaseClient
          .from("user_subscriptions")
          .update({
            status: isActive ? 'active' : paddleSubscription.status,
            current_period_end: paddleSubscription.current_billing_period?.ends_at,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (updateError) {
          logStep("Database update error", updateError);
        }

        return new Response(JSON.stringify({
          has_subscription: isActive,
          subscription_status: paddleSubscription.status,
          plan_name: subscription.subscription_plan?.name,
          expires_at: paddleSubscription.current_billing_period?.ends_at,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else {
        logStep("Paddle API error", { status: paddleResponse.status });
        // If Paddle API fails, return database info
      }
    }

    // Return subscription info from database
    const isActive = subscription.status === 'active' && 
                    (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date());

    logStep("Returning database subscription info", { 
      hasSubscription: isActive,
      status: subscription.status 
    });

    return new Response(JSON.stringify({
      has_subscription: isActive,
      subscription_status: subscription.status,
      plan_name: subscription.subscription_plan?.name,
      expires_at: subscription.current_period_end,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-paddle-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ 
      error: errorMessage,
      has_subscription: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});