import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Get Resend API key from Supabase secrets
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationEmailRequest {
  to: string;
  invitationToken: string;
  organizerName: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, invitationToken, organizerName, role }: InvitationEmailRequest = await req.json();

    console.log('📧 Processing invitation email for:', { to, role, organizerName });

    const invitationUrl = `${req.headers.get('origin') || 'https://jxpbiljkoibvqxzdkgod.supabase.co'}/auth?invite=${invitationToken}`;

    // Create Arabic RTL email template
    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>دعوة للانضمام إلى ${organizerName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            direction: rtl;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #3B82F6, #1E40AF);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .content {
            padding: 30px;
          }
          .invitation-button {
            display: inline-block;
            background-color: #3B82F6;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            transition: background-color 0.3s;
          }
          .invitation-button:hover {
            background-color: #2563EB;
          }
          .role-badge {
            display: inline-block;
            background-color: #F3F4F6;
            color: #374151;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin: 10px 0;
          }
          .footer {
            background-color: #F9FAFB;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6B7280;
          }
          .warning {
            background-color: #FEF3C7;
            border: 1px solid #F59E0B;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>مرحباً بك في ${organizerName}</h1>
            <p>منصة رواد الابتكار</p>
          </div>
          
          <div class="content">
            <h2>تم دعوتك للانضمام إلى المنصة</h2>
            <p>نحن سعداء لدعوتك للانضمام إلى منصة رواد الابتكار كـ:</p>
            <div class="role-badge">${role}</div>
            
            <p>للمتابعة وتفعيل حسابك، يرجى الضغط على الرابط أدناه:</p>
            
            <div style="text-align: center;">
              <a href="${invitationUrl}" class="invitation-button">
                قبول الدعوة وتفعيل الحساب
              </a>
            </div>
            
            <div class="warning">
              <strong>هام:</strong> هذا الرابط صالح لمدة 24 ساعة فقط. إذا لم تتمكن من استخدامه خلال هذه المدة، يرجى طلب دعوة جديدة.
            </div>
            
            <p>إذا لم تتمكن من الضغط على الرابط، يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
            <p style="word-break: break-all; background-color: #F3F4F6; padding: 10px; border-radius: 4px; font-family: monospace;">
              ${invitationUrl}
            </p>
          </div>
          
          <div class="footer">
            <p>تم إرسال هذا البريد الإلكتروني تلقائياً من منصة رواد الابتكار</p>
            <p>إذا لم تطلب هذه الدعوة، يمكنك تجاهل هذا البريد بأمان</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: `${organizerName} <noreply@resend.dev>`,
      to: [to],
      subject: `دعوة للانضمام إلى ${organizerName} - ${role}`,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error('❌ Resend API Error:', emailResponse.error);
      throw new Error(`Email sending failed: ${emailResponse.error.message}`);
    }

    console.log('✅ Email sent successfully:', emailResponse.data);

    return new Response(JSON.stringify({
      success: true,
      message: 'Invitation email sent successfully',
      emailId: emailResponse.data?.id,
      invitationUrl: invitationUrl
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('❌ Error in send-invitation-email function:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to send invitation email',
      details: error.message,
      fallback: 'Please share the invitation link manually'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

serve(handler);