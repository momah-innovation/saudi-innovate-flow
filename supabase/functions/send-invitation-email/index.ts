import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationEmailRequest {
  to: string;
  invitationToken: string;
  organizerName: string;
  role: string;
  organizationName?: string;
  customMessage?: string;
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

    const {
      to,
      invitationToken,
      organizerName,
      role,
      organizationName = 'منصة رواد الابتكار',
      customMessage
    }: InvitationEmailRequest = await req.json();

    console.log('Sending invitation email:', { to, role, organizerName });

    // Get the invitation URL
    const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '') || 'https://your-app.com';
    const invitationUrl = `${baseUrl}/auth/invitation?token=${invitationToken}&email=${encodeURIComponent(to)}`;

    // Create email content in Arabic and English
    const emailSubject = `دعوة للانضمام إلى ${organizationName} - Invitation to Join ${organizationName}`;
    
    const emailBody = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>دعوة للانضمام</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
          .title { font-size: 20px; color: #1f2937; margin-bottom: 20px; }
          .content { line-height: 1.6; color: #4b5563; margin-bottom: 30px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #1d4ed8; }
          .info-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #6b7280; }
          .en-section { direction: ltr; text-align: left; border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Arabic Section -->
          <div class="header">
            <div class="logo">🚀 ${organizationName}</div>
            <h1 class="title">مرحباً بك في منصة رواد الابتكار!</h1>
          </div>
          
          <div class="content">
            <p>تم دعوتك للانضمام إلى منصة رواد الابتكار بصفة <strong>${getRoleNameArabic(role)}</strong>.</p>
            
            <p>منصة رواد الابتكار هي المنصة الرائدة لتعزيز الابتكار وريادة الأعمال في المملكة العربية السعودية، حيث يمكنك:</p>
            
            <ul>
              <li>المشاركة في التحديات الابتكارية</li>
              <li>تقديم الأفكار الإبداعية</li>
              <li>التواصل مع المبتكرين والخبراء</li>
              <li>الوصول إلى الفرص والمسابقات</li>
              <li>تطوير مهاراتك الابتكارية</li>
            </ul>

            ${customMessage ? `<div class="info-box"><strong>رسالة خاصة:</strong><br>${customMessage}</div>` : ''}
            
            <p><strong>لقبول الدعوة، يرجى النقر على الرابط أدناه:</strong></p>
            
            <div style="text-align: center;">
              <a href="${invitationUrl}" class="button">قبول الدعوة والانضمام</a>
            </div>
            
            <div class="info-box">
              <strong>معلومات مهمة:</strong><br>
              • هذا الرابط صالح لمدة 7 أيام فقط<br>
              • سيتم إنشاء حساب جديد باستخدام البريد الإلكتروني: ${to}<br>
              • بعد قبول الدعوة، يمكنك تسجيل الدخول واستكمال ملفك الشخصي
            </div>
          </div>

          <!-- English Section -->
          <div class="en-section">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to Ruwād Innovation Platform!</h2>
            
            <div class="content">
              <p>You have been invited to join the Ruwād Innovation Platform as a <strong>${getRoleNameEnglish(role)}</strong>.</p>
              
              <p>Ruwād Innovation Platform is the leading platform for fostering innovation and entrepreneurship in Saudi Arabia, where you can:</p>
              
              <ul>
                <li>Participate in innovation challenges</li>
                <li>Submit creative ideas</li>
                <li>Connect with innovators and experts</li>
                <li>Access opportunities and competitions</li>
                <li>Develop your innovation skills</li>
              </ul>

              <p><strong>To accept this invitation, please click the link below:</strong></p>
              
              <div style="text-align: center;">
                <a href="${invitationUrl}" class="button">Accept Invitation</a>
              </div>
              
              <div class="info-box">
                <strong>Important Information:</strong><br>
                • This link is valid for 7 days only<br>
                • A new account will be created using email: ${to}<br>
                • After accepting, you can log in and complete your profile
              </div>
            </div>
          </div>

          <div class="footer">
            <p>إذا كان لديك أي استفسارات، يرجى التواصل معنا على: support@ruwad.sa</p>
            <p>If you have any questions, please contact us at: support@ruwad.sa</p>
            <p>© 2024 منصة رواد الابتكار - Ruwād Innovation Platform</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: 'منصة رواد الابتكار <invitations@ruwad.sa>',
      to: [to],
      subject: emailSubject,
      html: emailBody,
    });

    // Log the invitation email
    await supabaseClient
      .from('analytics_events')
      .insert({
        user_id: null,
        event_type: 'invitation_email_sent',
        event_category: 'authentication',
        properties: {
          recipient_email: to,
          role: role,
          organizer: organizerName,
          invitation_token: invitationToken
        }
      });

    console.log('Invitation email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id,
        invitationUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-invitation-email:', error);
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

function getRoleNameArabic(role: string): string {
  const roleNames: Record<string, string> = {
    admin: 'مدير',
    super_admin: 'مدير عام',
    team_member: 'عضو فريق',
    expert: 'خبير',
    partner: 'شريك',
    innovator: 'مبتكر',
    participant: 'مشارك'
  };
  return roleNames[role] || 'مستخدم';
}

function getRoleNameEnglish(role: string): string {
  const roleNames: Record<string, string> = {
    admin: 'Admin',
    super_admin: 'Super Admin',
    team_member: 'Team Member',
    expert: 'Expert',
    partner: 'Partner',
    innovator: 'Innovator',
    participant: 'Participant'
  };
  return roleNames[role] || 'User';
}

serve(handler);