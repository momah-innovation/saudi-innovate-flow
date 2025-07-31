import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrackRequest {
  opportunityId: string
  action: 'view' | 'like' | 'share' | 'apply'
  userId?: string
  sessionId?: string
  timeSpent?: number
  metadata?: Record<string, any>
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

    const { opportunityId, action, userId, sessionId, timeSpent, metadata }: TrackRequest = await req.json()

    // Validate required fields
    if (!opportunityId || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: opportunityId, action' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Tracking ${action} for opportunity: ${opportunityId}`)

    // Update analytics based on action
    switch (action) {
      case 'view':
        // Enhanced session-based view tracking
        const sessionIdToUse = sessionId || crypto.randomUUID()
        const userAgent = req.headers.get('user-agent') || ''
        const referrer = req.headers.get('referer') || ''
        
        // Upsert view session
        await supabase
          .from('opportunity_view_sessions')
          .upsert({
            opportunity_id: opportunityId,
            user_id: userId,
            session_id: sessionIdToUse,
            user_agent: userAgent,
            referrer: referrer,
            last_view_at: new Date().toISOString(),
            time_spent_seconds: timeSpent || 0,
            source: metadata?.source || 'unknown',
            view_count: 1
          }, {
            onConflict: 'opportunity_id,session_id',
            ignoreDuplicates: false
          })
        
        // Update main analytics
        await supabase.rpc('increment_opportunity_views', { 
          p_opportunity_id: opportunityId 
        })
        break

      case 'like':
        // Check if user already liked this opportunity
        if (userId) {
          const { data: existingLike } = await supabase
            .from('opportunity_likes')
            .select('id')
            .eq('opportunity_id', opportunityId)
            .eq('user_id', userId)
            .single()

          if (!existingLike) {
            await supabase
              .from('opportunity_likes')
              .insert({
                opportunity_id: opportunityId,
                user_id: userId
              })
          }
        }
        break

      case 'share':
        // Log share activity
        await supabase
          .from('opportunity_shares')
          .insert({
            opportunity_id: opportunityId,
            user_id: userId,
            platform: metadata?.platform || 'unknown',
            shared_at: new Date().toISOString()
          })
        break

      case 'apply':
        // This is handled by the application creation process
        console.log('Application tracking handled elsewhere')
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action type' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }

    // Update the analytics summary
    const { error: analyticsError } = await supabase.rpc('refresh_opportunity_analytics', {
      p_opportunity_id: opportunityId
    })

    if (analyticsError) {
      console.error('Error updating analytics:', analyticsError)
    }

    const response = {
      success: true,
      opportunityId,
      action,
      trackedAt: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in track-opportunity-analytics:', error)
    
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