import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, invitationToken, organizerName, role } = await req.json()

    // For now, we'll just log the invitation details
    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun  
    // - Amazon SES
    // - Postmark
    
    console.log('📧 Invitation Email Request:', {
      to,
      organizerName,
      role,
      tokenLength: invitationToken?.length || 0
    })

    // Simulate email sending
    const emailContent = {
      to,
      subject: `دعوة للانضمام إلى ${organizerName}`,
      html: `
        <div style="direction: rtl; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>مرحباً بك في ${organizerName}</h2>
          <p>تم دعوتك للانضمام إلى منصة رواد الابتكار بصفة: <strong>${role}</strong></p>
          <p>للمتابعة، يرجى الضغط على الرابط أدناه:</p>
          <a href="${req.headers.get('origin') || 'https://example.com'}/auth?invite=${invitationToken}" 
             style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            قبول الدعوة
          </a>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            إذا لم تتمكن من الضغط على الرابط، يمكنك نسخ الرابط التالي ولصقه في متصفحك:
            <br/>
            ${req.headers.get('origin') || 'https://example.com'}/auth?invite=${invitationToken}
          </p>
        </div>
      `
    }

    // TODO: Replace with actual email service integration
    // Example with SendGrid:
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     from: { email: 'noreply@ruwad.com', name: organizerName },
    //     personalizations: [{ to: [{ email: to }] }],
    //     subject: emailContent.subject,
    //     content: [{ type: 'text/html', value: emailContent.html }]
    //   })
    // })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation email queued for sending',
        preview: emailContent // Return preview for development
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error sending invitation email:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send invitation email',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})