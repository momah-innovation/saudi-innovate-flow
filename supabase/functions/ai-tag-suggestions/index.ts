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
    const { entityId, entityType, content } = await req.json();

    if (!content || !entityId || !entityType) {
      return new Response(
        JSON.stringify({ error: 'Content, entityId, and entityType are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating tags for ${entityType}: ${entityId}`);

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Prepare prompt for tag generation
    const prompt = `Generate 5-8 relevant tags for this Arabic government innovation content. 
    Return tags in both Arabic and English, focusing on:
    - Technology domains (AI, IoT, Blockchain, etc.)
    - Government sectors (Health, Education, Transportation, etc.)
    - Innovation categories (Digital Transformation, Smart Cities, etc.)
    - Saudi Vision 2030 themes

    Content: "${content}"
    
    Return as JSON array with format: [{"tag": "tag_name", "confidence": 0.95}]
    Use English tags only for consistency.`;

    // Call OpenAI for tag suggestions
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant specialized in tagging Arabic government innovation content. Generate relevant, accurate tags in English.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let suggestedTags;

    try {
      const content = data.choices[0].message.content;
      // Extract JSON from the response
      const jsonMatch = content.match(/\[.*\]/s);
      if (jsonMatch) {
        suggestedTags = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback parsing
        suggestedTags = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback tags based on entity type
      suggestedTags = [
        { tag: 'innovation', confidence: 0.8 },
        { tag: 'government', confidence: 0.9 },
        { tag: entityType.toLowerCase(), confidence: 0.95 }
      ];
    }

    // Prepare confidence scores object
    const confidenceScores = {};
    suggestedTags.forEach(item => {
      confidenceScores[item.tag] = item.confidence || 0.8;
    });

    // Store tag suggestions
    const { data: tagSuggestion, error: insertError } = await supabase
      .from('ai_tag_suggestions')
      .insert({
        entity_id: entityId,
        entity_type: entityType,
        suggested_tags: suggestedTags,
        confidence_scores: confidenceScores,
        status: 'pending',
        suggested_by: 'ai'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting tag suggestions:', insertError);
      throw insertError;
    }

    // Track AI usage
    const { error: usageError } = await supabase
      .from('ai_usage_tracking')
      .insert({
        feature_name: 'tag_suggestions',
        usage_type: 'generation',
        input_tokens: Math.ceil(content.length / 4),
        output_tokens: data.usage?.completion_tokens || 100,
        cost_estimate: (data.usage?.total_tokens || 200) * 0.00003, // GPT-4.1 pricing
        success: true,
        metadata: {
          entity_type: entityType,
          tags_generated: suggestedTags.length
        }
      });

    if (usageError) {
      console.error('Error tracking AI usage:', usageError);
    }

    return new Response(
      JSON.stringify({
        suggestions: tagSuggestion,
        tags: suggestedTags,
        confidenceScores: confidenceScores
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in tag suggestions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});