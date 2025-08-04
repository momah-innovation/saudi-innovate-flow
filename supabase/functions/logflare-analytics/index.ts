import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[LOGFLARE-ANALYTICS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const logflareApiKey = Deno.env.get("LOGFLARE_API_KEY");
    if (!logflareApiKey) {
      throw new Error("LOGFLARE_API_KEY is not set");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { action, data } = await req.json();
    logStep("Request received", { action });

    switch (action) {
      case 'send_logs':
        return await sendLogsToLogflare(data, logflareApiKey);
      
      case 'get_analytics':
        return await getAnalyticsFromLogflare(data, logflareApiKey);
      
      case 'create_source':
        return await createLogflareSource(data, logflareApiKey);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function sendLogsToLogflare(data: any, apiKey: string) {
  logStep("Sending logs to Logflare", { logsCount: data.logs?.length });

  const response = await fetch("https://api.logflare.app/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({
      source_name: data.source_name || "innovation-platform",
      logs: data.logs || [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Logflare API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  logStep("Logs sent successfully", { result });

  return new Response(JSON.stringify({ 
    success: true, 
    message: "Logs sent to Logflare successfully",
    logflare_response: result 
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function getAnalyticsFromLogflare(data: any, apiKey: string) {
  logStep("Getting analytics from Logflare", { source: data.source_name });

  const queryParams = new URLSearchParams({
    sql: data.query || "SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100",
    source_name: data.source_name || "innovation-platform",
  });

  const response = await fetch(`https://api.logflare.app/query?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Logflare API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  logStep("Analytics retrieved successfully", { rowCount: result.rows?.length });

  return new Response(JSON.stringify({ 
    success: true, 
    data: result,
    query: data.query 
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function createLogflareSource(data: any, apiKey: string) {
  logStep("Creating Logflare source", { sourceName: data.source_name });

  const response = await fetch("https://api.logflare.app/sources", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({
      source: {
        name: data.source_name,
        description: data.description || "Innovation platform logs",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Logflare API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  logStep("Source created successfully", { sourceId: result.source?.id });

  return new Response(JSON.stringify({ 
    success: true, 
    message: "Logflare source created successfully",
    source: result.source 
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}