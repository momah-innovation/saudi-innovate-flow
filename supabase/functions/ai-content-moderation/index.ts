import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, contentType, contentId } = await req.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Moderating ${contentType} content: ${contentId}`);

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call OpenAI Moderation API
    const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: content,
        model: 'text-moderation-latest'
      }),
    });

    if (!moderationResponse.ok) {
      throw new Error(`OpenAI API error: ${moderationResponse.statusText}`);
    }

    const moderationData = await moderationResponse.json();
    const result = moderationData.results[0];

    // Determine if content is flagged
    const flagged = result.flagged;
    const categories = Object.keys(result.categories).filter(
      category => result.categories[category]
    );

    // Determine status based on flagging
    let status = 'approved';
    if (flagged) {
      status = 'requires_review';
    }

    // Log moderation result
    const { error: logError } = await supabase
      .from('content_moderation_logs')
      .insert({
        content_id: contentId,
        content_type: contentType,
        content_text: content.substring(0, 1000), // Truncate for storage
        moderation_result: result,
        flagged: flagged,
        confidence_score: Math.max(...Object.values(result.category_scores)),
        categories_detected: categories,
        status: status,
        moderated_by: 'ai'
      });

    if (logError) {
      console.error('Error logging moderation result:', logError);
    }

    // Track AI usage
    const { error: usageError } = await supabase
      .from('ai_usage_tracking')
      .insert({
        feature_name: 'content_moderation',
        usage_type: 'moderation',
        input_tokens: Math.ceil(content.length / 4), // Rough estimate
        output_tokens: 50, // Moderation response is small
        cost_estimate: 0.002, // OpenAI moderation is very cheap
        success: true,
        metadata: {
          content_type: contentType,
          flagged: flagged,
          categories: categories
        }
      });

    if (usageError) {
      console.error('Error tracking AI usage:', usageError);
    }

    const response = {
      flagged: flagged,
      categories: categories,
      confidence: Math.max(...Object.values(result.category_scores)),
      status: status,
      reason: flagged ? `Content flagged for: ${categories.join(', ')}` : 'Content approved',
      moderationId: contentId
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in content moderation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});