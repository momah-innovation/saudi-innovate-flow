import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from 'npm:resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationEmailRequest {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  metadata?: any;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, title, message, type, metadata }: NotificationEmailRequest = await req.json();

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, name, preferred_language')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    try {
      // Send email notification
      const emailResponse = await resend.emails.send({
        from: 'Saudi Innovation Platform <notifications@resend.dev>',
        to: [profile.email],
        subject: title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; margin-bottom: 20px;">${title}</h2>
            <p style="color: #666; line-height: 1.6;">${message}</p>
            ${metadata?.role_request_id ? `
              <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  This is an automated notification from the Saudi Innovation Platform.
                </p>
              </div>
            ` : ''}
          </div>
        `,
      });

      console.log('Email sent successfully:', emailResponse);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the entire function if email fails - notification is already created
    }

    // NOTE: We don't create the notification here because it's already created 
    // by the database trigger/function that calls this edge function

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Notification and email sent successfully'
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error('Error in send-notification-email function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});