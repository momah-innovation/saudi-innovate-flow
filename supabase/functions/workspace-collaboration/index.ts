import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CollaborationRequest {
  workspaceId: string
  action: 'start_session' | 'end_session' | 'update_presence' | 'sync_activity'
  userId?: string
  metadata?: Record<string, any>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { workspaceId, action, userId, metadata }: CollaborationRequest = await req.json()

    console.log('Collaboration request:', { workspaceId, action, userId })

    let result

    switch (action) {
      case 'start_session':
        // Create or update user presence
        const { data: presence } = await supabaseClient
          .from('challenge_live_presence')
          .upsert({
            challenge_id: workspaceId, // Using challenge_id as workspace_id
            user_id: userId,
            status: 'active',
            last_seen: new Date().toISOString(),
            metadata: {
              workspace_type: 'collaboration',
              session_start: new Date().toISOString(),
              ...metadata
            }
          })
          .select()

        result = { presence, session_started: true }
        break

      case 'end_session':
        // Update presence to offline
        await supabaseClient
          .from('challenge_live_presence')
          .update({
            status: 'offline',
            last_seen: new Date().toISOString(),
            metadata: {
              session_end: new Date().toISOString(),
              ...metadata
            }
          })
          .eq('challenge_id', workspaceId)
          .eq('user_id', userId)

        result = { session_ended: true }
        break

      case 'update_presence':
        // Update user activity status
        await supabaseClient
          .from('challenge_live_presence')
          .update({
            status: metadata?.status || 'active',
            last_seen: new Date().toISOString(),
            metadata: {
              activity: metadata?.activity,
              location: metadata?.location,
              updated_at: new Date().toISOString()
            }
          })
          .eq('challenge_id', workspaceId)
          .eq('user_id', userId)

        result = { presence_updated: true }
        break

      case 'sync_activity':
        // Get current workspace activity
        const { data: activities } = await supabaseClient
          .from('workspace_activity_feed')
          .select(`
            *,
            profiles:user_id (
              display_name,
              avatar_url
            )
          `)
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false })
          .limit(50)

        const { data: onlineUsers } = await supabaseClient
          .from('challenge_live_presence')
          .select(`
            *,
            profiles:user_id (
              display_name,
              avatar_url
            )
          `)
          .eq('challenge_id', workspaceId)
          .eq('status', 'active')
          .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes

        result = {
          activities: activities || [],
          online_users: onlineUsers || [],
          sync_timestamp: new Date().toISOString()
        }
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    // Broadcast real-time update
    const channel = supabaseClient.channel(`workspace:${workspaceId}`)
    await channel.send({
      type: 'broadcast',
      event: 'collaboration_update',
      payload: {
        action,
        userId,
        workspaceId,
        timestamp: new Date().toISOString(),
        result
      }
    })

    console.log('Collaboration action processed successfully:', action)

    return new Response(
      JSON.stringify({ 
        success: true,
        action,
        result
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Collaboration error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})