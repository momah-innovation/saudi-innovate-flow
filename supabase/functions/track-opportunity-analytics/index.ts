import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrackRequest {
  opportunityId: string
  action: 'view' | 'like' | 'share' | 'apply' | 'timeSpent' | 'journey' | 'behavior'
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
    // Get JWT token from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const jwt = authHeader.replace('Bearer ', '')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Rate limiting: Check if user has made too many requests recently
    const rateLimitCheck = await supabase.rpc('check_rate_limit', {
      p_user_id: user.id,
      p_action: 'analytics_tracking',
      p_window_minutes: 1,
      p_max_requests: 100
    })

    if (rateLimitCheck.data && rateLimitCheck.data > 100) {
      // Log security event for rate limit exceeded
      await supabase.rpc('log_security_event', {
        action_type: 'RATE_LIMIT_EXCEEDED',
        resource_type: 'analytics_tracking',
        details: {
          user_id: user.id,
          request_count: rateLimitCheck.data,
          ip_address: req.headers.get('x-forwarded-for') || 'unknown'
        },
        risk_level: 'medium'
      })

      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

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
        await handleViewTracking(supabase, opportunityId, sessionId, userId, metadata, req)
        break

      case 'timeSpent':
        await handleTimeSpentTracking(supabase, sessionId!, metadata)
        break

      case 'journey':
        await handleJourneyTracking(supabase, opportunityId, sessionId!, metadata)
        break

      case 'behavior':
        await handleBehaviorTracking(supabase, opportunityId, sessionId!, metadata)
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

async function handleViewTracking(supabase: any, opportunityId: string, sessionId: string | undefined, userId: string | undefined, metadata: any, req: Request) {
  const sessionIdToUse = sessionId || crypto.randomUUID()
  const userAgent = req.headers.get('user-agent') || ''
  const referrer = req.headers.get('referer') || ''
  
  // Get geographic info from metadata (in production use IP geolocation service)
  const countryCode = metadata?.countryCode || 'SA'
  const countryName = metadata?.countryName || 'Saudi Arabia'
  const city = metadata?.city || 'Riyadh'

  // Insert or update view session
  const { error: sessionError } = await supabase
    .from('opportunity_view_sessions')
    .upsert({
      opportunity_id: opportunityId,
      session_id: sessionIdToUse,
      user_id: userId,
      user_agent: userAgent,
      country_code: countryCode,
      country_name: countryName,
      city: city,
      referrer: referrer,
      utm_source: metadata?.utmSource,
      utm_medium: metadata?.utmMedium,
      utm_campaign: metadata?.utmCampaign,
      start_time: new Date().toISOString()
    }, {
      onConflict: 'session_id'
    })

  if (sessionError) {
    console.error('Session tracking error:', sessionError)
  }

  // Update geographic analytics
  const { error: geoError } = await supabase.rpc('update_geographic_analytics', {
    p_opportunity_id: opportunityId,
    p_country_code: countryCode,
    p_country_name: countryName,
    p_city: city
  })

  if (geoError) {
    console.error('Geographic tracking error:', geoError)
  }

  // Increment view count in main analytics
  await supabase.rpc('increment_opportunity_views', {
    p_opportunity_id: opportunityId
  })
}

async function handleTimeSpentTracking(supabase: any, sessionId: string, metadata: any) {
  const { error } = await supabase.rpc('end_view_session', {
    p_session_id: sessionId,
    p_duration_seconds: metadata.durationSeconds,
    p_page_views: metadata.pageViews || 1,
    p_bounce: metadata.bounce || false
  })

  if (error) {
    console.error('Time spent tracking error:', error)
  }
}

async function handleJourneyTracking(supabase: any, opportunityId: string, sessionId: string, metadata: any) {
  const { error } = await supabase.rpc('track_user_journey_step', {
    p_opportunity_id: opportunityId,
    p_session_id: sessionId,
    p_step_name: metadata.stepName,
    p_time_spent_seconds: metadata.timeSpentSeconds,
    p_metadata: metadata.stepMetadata || {}
  })

  if (error) {
    console.error('Journey tracking error:', error)
  }
}

async function handleBehaviorTracking(supabase: any, opportunityId: string, sessionId: string, metadata: any) {
  const { error } = await supabase.rpc('track_behavior_pattern', {
    p_opportunity_id: opportunityId,
    p_session_id: sessionId,
    p_action_type: metadata.actionType,
    p_action_target: metadata.actionTarget,
    p_duration_ms: metadata.durationMs,
    p_metadata: metadata.behaviorMetadata || {}
  })

  if (error) {
    console.error('Behavior tracking error:', error)
  }
}