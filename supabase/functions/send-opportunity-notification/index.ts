import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  opportunityId?: string
  notificationType?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { to, subject, html, opportunityId, notificationType }: EmailRequest = await req.json()

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Log email send attempt
    console.log(`Sending opportunity notification email to: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Opportunity ID: ${opportunityId || 'N/A'}`)
    console.log(`Notification Type: ${notificationType || 'general'}`)

    // For demo purposes, we'll simulate email sending
    // In production, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - Amazon SES
    // - Mailgun

    const emailLog = {
      recipient_email: to,
      subject: subject,
      content: html,
      opportunity_id: opportunityId,
      notification_type: notificationType || 'general',
      status: 'sent',
      sent_at: new Date().toISOString(),
      provider: 'simulated'
    }

    // Store email log in database
    const { data, error } = await supabase
      .from('opportunity_email_logs')
      .insert(emailLog)

    if (error) {
      console.error('Error logging email:', error)
      // Don't fail the request if logging fails
    }

    // Simulate successful email delivery
    const response = {
      success: true,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recipient: to,
      subject: subject,
      opportunityId: opportunityId,
      sentAt: new Date().toISOString(),
      provider: 'simulated',
      note: 'This is a simulated email for development. In production, integrate with a real email service.'
    }

    console.log('Email simulation completed successfully:', response.messageId)

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in send-opportunity-notification:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})