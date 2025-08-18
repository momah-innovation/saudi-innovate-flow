import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  workspaceId: string
  type: 'member_added' | 'activity_update' | 'file_shared' | 'mention' | 'deadline_reminder'
  recipientIds?: string[]
  title: string
  message: string
  metadata?: Record<string, any>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { workspaceId, type, recipientIds, title, message, metadata }: NotificationRequest = await req.json()

    console.log('Processing workspace notification:', { workspaceId, type, title })

    // Get workspace members if no specific recipients
    let targetRecipients = recipientIds
    if (!targetRecipients) {
      const { data: members } = await supabaseClient
        .from('workspace_members')
        .select('user_id')
        .eq('workspace_id', workspaceId)
        .eq('status', 'active')

      targetRecipients = members?.map(m => m.user_id) || []
    }

    // Create notification records
    const notifications = targetRecipients.map(userId => ({
      recipient_id: userId,
      title,
      message,
      notification_type: type,
      metadata: {
        workspace_id: workspaceId,
        ...metadata
      }
    }))

    const { data, error } = await supabaseClient
      .from('challenge_notifications')
      .insert(notifications)

    if (error) {
      console.error('Notification insertion error:', error)
      throw error
    }

    // Send real-time notifications
    const channel = supabaseClient.channel(`workspace:${workspaceId}`)
    await channel.send({
      type: 'broadcast',
      event: 'notification',
      payload: {
        type,
        title,
        message,
        recipients: targetRecipients,
        metadata
      }
    })

    console.log('Notifications sent successfully:', notifications.length)

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationsSent: notifications.length,
        recipients: targetRecipients
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Workspace notification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})