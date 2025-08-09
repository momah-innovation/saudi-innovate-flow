import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
  from?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { to, subject, template, data, from = 'Ruwād <notifications@ruwad.sa>' }: EmailRequest = await req.json();

    console.log('Sending email:', { to, subject, template });

    // Get email template
    const { data: templateData, error: templateError } = await supabaseClient
      .from('ai_email_templates')
      .select('*')
      .eq('template_name', template)
      .single();

    if (templateError) {
      console.error('Error fetching template:', templateError);
      throw new Error(`Template ${template} not found`);
    }

    // Replace variables in template
    let emailBody = templateData.body_template;
    let emailSubject = templateData.subject_template;

    // Replace placeholders with actual data
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      emailBody = emailBody.replace(new RegExp(placeholder, 'g'), value || '');
      emailSubject = emailSubject.replace(new RegExp(placeholder, 'g'), value || '');
    });

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from,
      to: [to],
      subject: emailSubject || subject,
      html: emailBody,
    });

    // Update template usage count
    await supabaseClient
      .from('ai_email_templates')
      .update({ 
        usage_count: (templateData.usage_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateData.id);

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id,
        template: template 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-notification-email:', error);
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