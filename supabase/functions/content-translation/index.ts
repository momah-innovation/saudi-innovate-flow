import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  entityType?: string;
  entityId?: string;
  fieldName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      text,
      fromLanguage,
      toLanguage,
      entityType,
      entityId,
      fieldName
    }: TranslationRequest = await req.json();

    console.log('Translating content:', {
      fromLanguage,
      toLanguage,
      textLength: text.length,
      entityType,
      entityId
    });

    // Check if translation already exists in cache
    const { data: cachedTranslation } = await supabaseClient
      .from('content_translations')
      .select('translated_text')
      .eq('original_text_hash', await hashText(text))
      .eq('from_language', fromLanguage)
      .eq('to_language', toLanguage)
      .single();

    if (cachedTranslation) {
      console.log('Using cached translation');
      return new Response(
        JSON.stringify({
          success: true,
          translatedText: cachedTranslation.translated_text,
          fromCache: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create translation prompt
    const prompt = `Translate the following text from ${fromLanguage} to ${toLanguage}. 
    Maintain the original meaning, tone, and context. If it's technical or formal content, keep it professional.
    If it contains cultural references, adapt them appropriately for the target language.
    
    Text to translate:
    ${text}
    
    Translated text:`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator with expertise in Arabic and English. Provide accurate, culturally appropriate translations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.min(4000, text.length * 2),
        temperature: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const openaiResult = await openaiResponse.json();
    const translatedText = openaiResult.choices[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new Error('No translation received from OpenAI');
    }

    // Cache the translation
    const textHash = await hashText(text);
    await supabaseClient
      .from('content_translations')
      .insert({
        original_text_hash: textHash,
        original_text: text.substring(0, 1000), // Store first 1000 chars for reference
        translated_text: translatedText,
        from_language: fromLanguage,
        to_language: toLanguage,
        entity_type: entityType,
        entity_id: entityId,
        field_name: fieldName,
        translation_engine: 'openai-gpt4',
        quality_score: 0.9, // Default high quality for GPT-4
        created_by: null // System translation
      });

    // Track AI usage
    await supabaseClient
      .from('ai_usage_tracking')
      .insert({
        user_id: null,
        feature_name: 'content_translation',
        usage_type: 'translation',
        input_tokens: openaiResult.usage?.prompt_tokens || 0,
        output_tokens: openaiResult.usage?.completion_tokens || 0,
        cost_estimate: calculateCost(openaiResult.usage?.total_tokens || 0),
        success: true,
        metadata: {
          from_language: fromLanguage,
          to_language: toLanguage,
          text_length: text.length,
          entity_type: entityType,
          entity_id: entityId
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        translatedText,
        fromCache: false,
        tokensUsed: openaiResult.usage?.total_tokens || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in content-translation:', error);
    
    // Track failed usage
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabaseClient
      .from('ai_usage_tracking')
      .insert({
        user_id: null,
        feature_name: 'content_translation',
        usage_type: 'translation',
        success: false,
        error_message: error.message,
        metadata: { error: error.message }
      });

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

async function hashText(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function calculateCost(totalTokens: number): number {
  // GPT-4 pricing: $0.03/1K prompt tokens, $0.06/1K completion tokens
  // Simplified calculation - assume 50/50 split
  return (totalTokens / 1000) * 0.045;
}

serve(handler);