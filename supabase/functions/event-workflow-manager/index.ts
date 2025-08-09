import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EventWorkflowRequest {
  action: string;
  eventId: string;
  userId: string;
  data?: any;
  attendanceStatus?: string;
  reason?: string;
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

    const { action, eventId, userId, data, attendanceStatus, reason }: EventWorkflowRequest = await req.json();

    console.log('Event workflow action:', { action, eventId, userId });

    let result: any = {};

    switch (action) {
      case 'register':
        result = await registerForEvent(supabaseClient, eventId, userId, data);
        break;
      
      case 'confirm_registration':
        result = await confirmRegistration(supabaseClient, eventId, userId);
        break;
      
      case 'cancel_registration':
        result = await cancelRegistration(supabaseClient, eventId, userId, reason);
        break;
      
      case 'update_attendance':
        result = await updateAttendanceStatus(supabaseClient, eventId, userId, attendanceStatus!);
        break;
      
      case 'send_confirmation_email':
        result = await sendConfirmationEmail(supabaseClient, eventId, userId);
        break;
      
      case 'bulk_confirm_attendees':
        result = await bulkConfirmAttendees(supabaseClient, eventId, data.userIds);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in event-workflow-manager:', error);
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

async function registerForEvent(supabase: any, eventId: string, userId: string, data?: any) {
  // Check if user is already registered
  const { data: existing, error: checkError } = await supabase
    .from('event_participants')
    .select('id, attendance_status')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existing) {
    throw new Error('User is already registered for this event');
  }

  // Check event capacity
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('max_participants, status')
    .eq('id', eventId)
    .single();

  if (eventError) throw eventError;

  // Count current participants
  const { count: currentParticipants, error: countError } = await supabase
    .from('event_participants')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .neq('attendance_status', 'cancelled');

  if (countError) throw countError;

  if (event.max_participants && currentParticipants >= event.max_participants) {
    throw new Error('Event is full');
  }

  if (event.status !== 'open') {
    throw new Error('Event registration is not open');
  }

  // Register user
  const { data: registration, error: regError } = await supabase
    .from('event_participants')
    .insert({
      event_id: eventId,
      user_id: userId,
      attendance_status: 'registered',
      registration_date: new Date().toISOString(),
      metadata: data || {}
    })
    .select()
    .single();

  if (regError) throw regError;

  // Send registration confirmation
  await sendRegistrationNotification(supabase, eventId, userId, 'registered');

  // Log analytics
  await supabase
    .from('analytics_events')
    .insert({
      user_id: userId,
      event_type: 'event_registration',
      event_category: 'events',
      entity_type: 'event',
      entity_id: eventId,
      properties: { action: 'register' }
    });

  return {
    registrationId: registration.id,
    status: 'registered',
    message: 'Successfully registered for event'
  };
}

async function confirmRegistration(supabase: any, eventId: string, userId: string) {
  // Update attendance status to confirmed
  const { error: updateError } = await supabase
    .from('event_participants')
    .update({ 
      attendance_status: 'confirmed',
      confirmed_at: new Date().toISOString()
    })
    .eq('event_id', eventId)
    .eq('user_id', userId);

  if (updateError) throw updateError;

  // Send confirmation notification
  await sendRegistrationNotification(supabase, eventId, userId, 'confirmed');

  // Log analytics
  await supabase
    .from('analytics_events')
    .insert({
      user_id: userId,
      event_type: 'event_confirmation',
      event_category: 'events',
      entity_type: 'event',
      entity_id: eventId,
      properties: { action: 'confirm' }
    });

  return {
    status: 'confirmed',
    message: 'Registration confirmed successfully'
  };
}

async function cancelRegistration(supabase: any, eventId: string, userId: string, reason?: string) {
  // Update attendance status to cancelled
  const { error: updateError } = await supabase
    .from('event_participants')
    .update({ 
      attendance_status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason
    })
    .eq('event_id', eventId)
    .eq('user_id', userId);

  if (updateError) throw updateError;

  // Send cancellation notification
  await sendRegistrationNotification(supabase, eventId, userId, 'cancelled');

  // Log analytics
  await supabase
    .from('analytics_events')
    .insert({
      user_id: userId,
      event_type: 'event_cancellation',
      event_category: 'events',
      entity_type: 'event',
      entity_id: eventId,
      properties: { action: 'cancel', reason }
    });

  return {
    status: 'cancelled',
    message: 'Registration cancelled successfully'
  };
}

async function updateAttendanceStatus(supabase: any, eventId: string, userId: string, attendanceStatus: string) {
  const { error: updateError } = await supabase
    .from('event_participants')
    .update({ 
      attendance_status: attendanceStatus,
      updated_at: new Date().toISOString()
    })
    .eq('event_id', eventId)
    .eq('user_id', userId);

  if (updateError) throw updateError;

  // Log analytics
  await supabase
    .from('analytics_events')
    .insert({
      user_id: userId,
      event_type: 'attendance_status_update',
      event_category: 'events',
      entity_type: 'event',
      entity_id: eventId,
      properties: { new_status: attendanceStatus }
    });

  return {
    status: attendanceStatus,
    message: 'Attendance status updated successfully'
  };
}

async function sendConfirmationEmail(supabase: any, eventId: string, userId: string) {
  // Get event and user details
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('title_ar, title_en, event_date, location, description_ar')
    .eq('id', eventId)
    .single();

  if (eventError) throw eventError;

  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('email, display_name')
    .eq('user_id', userId)
    .single();

  if (userError) throw userError;

  // Send confirmation email
  await supabase.functions.invoke('send-notification-email', {
    body: {
      to: user.email,
      subject: `تأكيد التسجيل في فعالية: ${event.title_ar}`,
      template: 'event_confirmation',
      data: {
        userName: user.display_name,
        eventTitle: event.title_ar,
        eventDate: new Date(event.event_date).toLocaleDateString('ar-SA'),
        eventLocation: event.location,
        eventDescription: event.description_ar
      }
    }
  });

  return {
    message: 'Confirmation email sent successfully'
  };
}

async function bulkConfirmAttendees(supabase: any, eventId: string, userIds: string[]) {
  const results = [];

  for (const userId of userIds) {
    try {
      const result = await confirmRegistration(supabase, eventId, userId);
      results.push({ userId, success: true, result });
    } catch (error) {
      results.push({ userId, success: false, error: error.message });
    }
  }

  return {
    totalProcessed: userIds.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

async function sendRegistrationNotification(supabase: any, eventId: string, userId: string, status: string) {
  try {
    // Get event details
    const { data: event, error } = await supabase
      .from('events')
      .select('title_ar')
      .eq('id', eventId)
      .single();

    if (error || !event) return;

    const notificationTitles = {
      registered: 'تم التسجيل بنجاح',
      confirmed: 'تم تأكيد التسجيل',
      cancelled: 'تم إلغاء التسجيل'
    };

    const notificationMessages = {
      registered: `تم تسجيلك بنجاح في فعالية "${event.title_ar}"`,
      confirmed: `تم تأكيد تسجيلك في فعالية "${event.title_ar}"`,
      cancelled: `تم إلغاء تسجيلك في فعالية "${event.title_ar}"`
    };

    // Send notification
    await supabase.functions.invoke('send-event-notification', {
      body: {
        eventId,
        recipientId: userId,
        notificationType: `registration_${status}`,
        title: notificationTitles[status] || 'تحديث التسجيل',
        message: notificationMessages[status] || 'تم تحديث حالة تسجيلك',
        metadata: { status }
      }
    });
  } catch (error) {
    console.error('Error sending registration notification:', error);
  }
}

serve(handler);