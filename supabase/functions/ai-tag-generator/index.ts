import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TagGenerationRequest {
  entityId: string;
  entityType: 'challenge' | 'idea' | 'event' | 'opportunity' | 'user';
  content: string;
  userId?: string;
  maxTags?: number;
  language?: string;
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
      entityId, 
      entityType, 
      content, 
      userId,
      maxTags = 10,
      language = 'ar'
    }: TagGenerationRequest = await req.json();

    console.log('Generating AI tags:', { entityId, entityType, maxTags });

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build prompt for tag generation
    const prompt = `قم بتحليل النص التالي وإنشاء علامات (tags) مناسبة له:

النص: "${content}"

نوع المحتوى: ${entityType}

متطلبات العلامات:
- أنشئ حتى ${maxTags} علامات
- العلامات يجب أن تكون باللغة العربية
- تركز على الكلمات المفتاحية والمفاهيم الرئيسية
- مناسبة لمنصة الابتكار السعودية
- تساعد في البحث والتصنيف

أرجع النتائج كـ JSON فقط بالتنسيق التالي:
{
  "tags": ["علامة1", "علامة2", "علامة3"],
  "confidence_scores": [0.9, 0.8, 0.7]
}`;

    const startTime = Date.now();

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'أنت نظام ذكي لإنشاء العلامات. ترجع فقط JSON صحيح.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const result = await openaiResponse.json();
    const generatedContent = result.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Parse the JSON response
    let tagData;
    try {
      tagData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedContent);
      throw new Error('Invalid response format from AI');
    }

    const { tags, confidence_scores } = tagData;

    if (!Array.isArray(tags)) {
      throw new Error('Invalid tags format');
    }

    const executionTime = Date.now() - startTime;

    // Save suggestion to database
    const { data: suggestion, error: suggestionError } = await supabaseClient
      .from('ai_tag_suggestions')
      .insert({
        entity_id: entityId,
        entity_type: entityType,
        suggested_tags: tags,
        confidence_scores: confidence_scores || tags.map(() => 0.8),
        status: 'pending'
      })
      .select()
      .single();

    if (suggestionError) {
      console.error('Error saving suggestion:', suggestionError);
    }

    // Track AI usage
    if (userId) {
      await supabaseClient
        .from('ai_usage_tracking')
        .insert({
          user_id: userId,
          feature_name: 'tag_generation',
          usage_type: 'auto_tag',
          input_tokens: result.usage?.prompt_tokens || 0,
          output_tokens: result.usage?.completion_tokens || 0,
          cost_estimate: (result.usage?.total_tokens || 0) * 0.00001,
          execution_time_ms: executionTime,
          success: true,
          metadata: { entityType, maxTags, language }
        });
    }

    // Auto-apply tags if confidence is high
    const highConfidenceTags = tags.filter((_, index) => 
      (confidence_scores?.[index] || 0.8) > 0.7
    );

    if (highConfidenceTags.length > 0) {
      try {
        // Get or create tags
        const { data: existingTags } = await supabaseClient
          .from('tags')
          .select('id, name_ar')
          .in('name_ar', highConfidenceTags);

        const existingTagNames = existingTags?.map(t => t.name_ar) || [];
        const newTagNames = highConfidenceTags.filter(tag => !existingTagNames.includes(tag));

        // Create new tags
        if (newTagNames.length > 0) {
          await supabaseClient
            .from('tags')
            .insert(newTagNames.map(name => ({ 
              name_ar: name, 
              name_en: name, 
              category: 'auto_generated' 
            })));
        }

        // Get all tags again
        const { data: allTags } = await supabaseClient
          .from('tags')
          .select('id, name_ar')
          .in('name_ar', highConfidenceTags);

        // Link tags to entity
        if (allTags && allTags.length > 0) {
          const tagLinks = allTags.map(tag => ({
            [`${entityType}_id`]: entityId,
            tag_id: tag.id,
            added_by: userId
          }));

          await supabaseClient
            .from(`${entityType}_tags`)
            .insert(tagLinks);
        }
      } catch (linkError) {
        console.error('Error auto-applying tags:', linkError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        tags,
        confidence_scores,
        suggestionId: suggestion?.id,
        autoApplied: highConfidenceTags.length,
        executionTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in ai-tag-generator:', error);
    
    // Track failed usage
    if (req.json && userId) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        await supabaseClient
          .from('ai_usage_tracking')
          .insert({
            user_id: userId,
            feature_name: 'tag_generation',
            usage_type: 'auto_tag',
            success: false,
            error_message: error.message,
            execution_time_ms: 0
          });
      } catch (trackingError) {
        console.error('Error tracking failed usage:', trackingError);
      }
    }

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