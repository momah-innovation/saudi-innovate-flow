import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PresenceRequest {
  challengeId: string;
  userId: string;
  action: 'join' | 'leave' | 'update';
  status?: string;
  metadata?: Record<string, any>;
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
      action, 
      status = 'viewing',
      metadata = {}
    }: PresenceRequest = await req.json();

    console.log('Managing real-time presence:', {
      challengeId,
      userId,
      action,
      status
    });

    switch (action) {
      case 'join':
      case 'update':
        // Update or insert presence record
        await supabaseClient
          .from('challenge_live_presence')
          .upsert({
            challenge_id: challengeId,
            user_id: userId,
            status,
            last_seen: new Date().toISOString(),
            metadata
          });
        break;

      case 'leave':
        // Remove presence record
        await supabaseClient
          .from('challenge_live_presence')
          .delete()
          .eq('challenge_id', challengeId)
          .eq('user_id', userId);
        break;
    }

    // Get current active users
    const { data: activeUsers, error: presenceError } = await supabaseClient
      .from('challenge_live_presence')
      .select(`
        user_id,
        status,
        last_seen,
        metadata,
        profiles!inner(display_name, display_name_ar, profile_image_url)
      `)
      .eq('challenge_id', challengeId)
      .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Active in last 5 minutes

    if (presenceError) {
      console.error('Error fetching presence:', presenceError);
    }

    // Broadcast presence update to channel
    const channelName = `challenge:${challengeId}:presence`;
    
    // Send real-time update
    try {
      await supabaseClient
        .channel(channelName)
        .send({
          type: 'broadcast',
          event: 'presence_update',
          payload: {
            action,
            userId,
            status,
            challengeId,
            activeUsers: activeUsers || [],
            timestamp: new Date().toISOString()
          }
        });
    } catch (broadcastError) {
      console.error('Error broadcasting presence update:', broadcastError);
    }

    // Clean up old presence records (older than 1 hour)
    await supabaseClient
      .from('challenge_live_presence')
      .delete()
      .lt('last_seen', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    return new Response(
      JSON.stringify({ 
        success: true,
        activeUsers: activeUsers || [],
        activeCount: activeUsers?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in real-time-presence-manager:', error);
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