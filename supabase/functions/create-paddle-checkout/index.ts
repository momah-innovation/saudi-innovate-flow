import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateCheckoutRequest {
  planId: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PADDLE-CHECKOUT] ${step}${detailsStr}`);
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

    const { planId }: CreateCheckoutRequest = await req.json();
    if (!planId) throw new Error("Plan ID is required");
    logStep("Plan ID received", { planId });

    // Get plan details from database
    const { data: plan, error: planError } = await supabaseClient
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .eq("is_active", true)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found or inactive");
    }
    logStep("Plan found", { planName: plan.name, price: plan.price_monthly });

    // Create Paddle checkout session
    const paddleResponse = await fetch("https://api.paddle.com/transactions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paddleApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            price_id: plan.paddle_price_id,
            quantity: 1,
          },
        ],
        customer_email: user.email,
        return_url: `${req.headers.get("origin")}/subscription/success`,
        discount_id: null,
        custom_data: {
          user_id: user.id,
          plan_id: planId,
        },
      }),
    });

    if (!paddleResponse.ok) {
      const errorText = await paddleResponse.text();
      logStep("Paddle API error", { status: paddleResponse.status, error: errorText });
      throw new Error(`Paddle API error: ${paddleResponse.status} - ${errorText}`);
    }

    const checkoutData = await paddleResponse.json();
    logStep("Paddle checkout created", { transactionId: checkoutData.data.id });

    // Store the pending transaction in our database
    const { error: insertError } = await supabaseClient
      .from("user_subscriptions")
      .upsert({
        user_id: user.id,
        subscription_plan_id: planId,
        paddle_subscription_id: checkoutData.data.id,
        status: "pending",
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (insertError) {
      logStep("Database insert error", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    return new Response(JSON.stringify({ 
      checkout_url: checkoutData.data.checkout.url,
      transaction_id: checkoutData.data.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-paddle-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});