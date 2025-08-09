import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentRequest {
  type: 'challenge_description' | 'idea_enhancement' | 'email_template' | 'focus_question' | 'challenge_title';
  content?: string;
  context?: Record<string, any>;
  language?: string;
  tone?: string;
  userId?: string;
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
      type, 
      content, 
      context = {},
      language = 'ar',
      tone = 'professional',
      userId
    }: ContentRequest = await req.json();

    console.log('Generating AI content:', { type, language, tone });

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Check if user has access to AI features
    if (userId) {
      const { data: aiPrefs } = await supabaseClient
        .from('ai_preferences')
        .select('ai_enabled')
        .eq('user_id', userId)
        .single();

      if (!aiPrefs?.ai_enabled) {
        throw new Error('AI features are disabled for this user');
      }
    }

    // Build prompt based on content type
    let prompt = '';
    let systemMessage = 'أنت مساعد ذكي متخصص في منصة رواد للابتكار. تجيب باللغة العربية وتركز على الابتكار والتحديات.';

    switch (type) {
      case 'challenge_description':
        prompt = `اكتب وصفاً شاملاً ومفصلاً لتحدٍ في مجال الابتكار بعنوان: "${content}"
        
السياق: ${JSON.stringify(context)}

يجب أن يتضمن الوصف:
- الهدف من التحدي
- المشكلة التي يسعى لحلها
- الفوائد المتوقعة
- متطلبات المشاركة
- معايير التقييم

النبرة: ${tone}
طول النص: 300-500 كلمة`;
        break;

      case 'idea_enhancement':
        prompt = `قم بتطوير وتحسين هذه الفكرة: "${content}"

السياق: ${JSON.stringify(context)}

اقترح:
- تحسينات على الفكرة الأساسية
- جوانب إضافية لم يتم التطرق إليها
- طرق تطبيق عملية
- التحديات المحتملة والحلول

النبرة: ${tone}`;
        break;

      case 'email_template':
        prompt = `اكتب قالب بريد إلكتروني لـ: ${context.templateType}

الموضوع: ${content}
السياق: ${JSON.stringify(context)}

يجب أن يتضمن:
- عنوان مناسب
- نص البريد مع متغيرات قابلة للتخصيص
- نبرة ${tone}

استخدم {{variableName}} للمتغيرات`;
        break;

      case 'focus_question':
        prompt = `اقترح 5 أسئلة تركيز متقدمة للتحدي التالي: "${content}"

السياق: ${JSON.stringify(context)}

الأسئلة يجب أن تكون:
- محددة وقابلة للقياس
- تحفز على التفكير الإبداعي
- متدرجة في الصعوبة
- ذات صلة بالتحدي`;
        break;

      case 'challenge_title':
        prompt = `اقترح 10 عناوين جذابة وإبداعية لتحدي الابتكار التالي:

الوصف: ${content}
السياق: ${JSON.stringify(context)}

العناوين يجب أن تكون:
- قصيرة ومؤثرة (أقل من 60 حرف)
- تحفز على المشاركة
- تعكس جوهر التحدي
- مناسبة للثقافة العربية`;
        break;
    }

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
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
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

    const executionTime = Date.now() - startTime;

    // Track AI usage
    if (userId) {
      await supabaseClient
        .from('ai_usage_tracking')
        .insert({
          user_id: userId,
          feature_name: 'content_generation',
          usage_type: type,
          input_tokens: result.usage?.prompt_tokens || 0,
          output_tokens: result.usage?.completion_tokens || 0,
          cost_estimate: (result.usage?.total_tokens || 0) * 0.00001, // Rough estimate
          execution_time_ms: executionTime,
          success: true,
          metadata: { type, language, tone }
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        content: generatedContent,
        usage: result.usage,
        executionTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in ai-content-generator:', error);
    
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
            feature_name: 'content_generation',
            usage_type: type,
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