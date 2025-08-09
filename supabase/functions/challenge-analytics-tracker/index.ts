import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsRequest {
  challengeId: string;
  userId?: string;
  eventType: 'view' | 'like' | 'bookmark' | 'share' | 'participate' | 'submit';
  metadata?: Record<string, any>;
  sessionId?: string;
  viewDuration?: number;
  shareMethod?: string;
  sharedTo?: string;
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

    const { 
      challengeId, 
      userId, 
      eventType, 
      metadata = {},
      sessionId,
      viewDuration,
      shareMethod,
      sharedTo
    }: AnalyticsRequest = await req.json();

    console.log('Tracking challenge analytics:', {
      challengeId,
      userId,
      eventType
    });

    // Track specific event
    switch (eventType) {
      case 'view':
        // Record view session
        if (sessionId) {
          await supabaseClient
            .from('challenge_view_sessions')
            .insert({
              challenge_id: challengeId,
              user_id: userId,
              session_id: sessionId,
              view_duration: viewDuration || 0,
              ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
              user_agent: req.headers.get('user-agent'),
              referrer: req.headers.get('referer')
            });
        }
        break;

      case 'like':
        if (userId) {
          await supabaseClient
            .from('challenge_likes')
            .upsert({
              challenge_id: challengeId,
              user_id: userId
            });
        }
        break;

      case 'share':
        if (userId) {
          await supabaseClient
            .from('challenge_shares')
            .insert({
              challenge_id: challengeId,
              user_id: userId,
              share_method: shareMethod || 'link',
              shared_to: sharedTo
            });
        }
        break;

      case 'bookmark':
        if (userId) {
          await supabaseClient
            .from('challenge_bookmarks')
            .upsert({
              challenge_id: challengeId,
              user_id: userId
            });
        }
        break;
    }

    // Update analytics summary
    const [
      { count: viewCount },
      { count: likeCount },
      { count: bookmarkCount },
      { count: participantCount },
      { count: submissionCount },
      { count: shareCount }
    ] = await Promise.all([
      supabaseClient
        .from('challenge_view_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId),
      supabaseClient
        .from('challenge_likes')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId),
      supabaseClient
        .from('challenge_bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId),
      supabaseClient
        .from('challenge_participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId),
      supabaseClient
        .from('challenge_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId),
      supabaseClient
        .from('challenge_shares')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challengeId)
    ]);

    // Calculate engagement and conversion rates
    const engagementRate = viewCount > 0 ? ((likeCount + shareCount + bookmarkCount) / viewCount) * 100 : 0;
    const conversionRate = viewCount > 0 ? (participantCount / viewCount) * 100 : 0;

    // Update or insert analytics record
    await supabaseClient
      .from('challenge_analytics')
      .upsert({
        challenge_id: challengeId,
        view_count: viewCount || 0,
        like_count: likeCount || 0,
        bookmark_count: bookmarkCount || 0,
        participant_count: participantCount || 0,
        submission_count: submissionCount || 0,
        share_count: shareCount || 0,
        engagement_rate: Number(engagementRate.toFixed(2)),
        conversion_rate: Number(conversionRate.toFixed(2)),
        last_updated: new Date().toISOString()
      });

    // Track general analytics event
    await supabaseClient
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: `challenge_${eventType}`,
        event_category: 'challenge_interaction',
        entity_type: 'challenge',
        entity_id: challengeId,
        properties: {
          event_type: eventType,
          ...metadata
        },
        page_url: req.headers.get('referer'),
        user_agent: req.headers.get('user-agent'),
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        analytics: {
          viewCount,
          likeCount,
          bookmarkCount,
          participantCount,
          submissionCount,
          shareCount,
          engagementRate,
          conversionRate
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in challenge-analytics-tracker:', error);
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

serve(handler);