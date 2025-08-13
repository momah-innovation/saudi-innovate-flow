import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get JWT from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is authenticated and has admin access
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true);

    const hasAdminAccess = userRoles?.some(role => 
      ['admin', 'super_admin'].includes(role.role)
    );

    if (!hasAdminAccess) {
      return new Response(
        JSON.stringify({ error: 'Insufficient privileges' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get real-time statistics with more frequent updates
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Parallel queries for real-time stats
    const [
      activeUsersResult,
      recentActivitiesResult,
      onlinePresenceResult,
      systemHealthResult,
      recentEventsResult
    ] = await Promise.all([
      // Active users in last hour
      supabase
        .from('analytics_events')
        .select('user_id')
        .gt('timestamp', oneHourAgo.toISOString())
        .not('user_id', 'is', null),

      // Recent activities
      supabase
        .from('activity_events')
        .select('event_type, created_at, user_id, entity_type')
        .gt('created_at', oneHourAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(50),

      // Online presence from challenge live presence
      supabase
        .from('challenge_live_presence')
        .select('user_id, status, last_seen')
        .gt('last_seen', new Date(now.getTime() - 5 * 60 * 1000).toISOString()), // Last 5 minutes

      // System health indicators
      supabase
        .from('security_audit_log')
        .select('risk_level, created_at')
        .gt('created_at', oneDayAgo.toISOString()),

      // Recent significant events
      supabase
        .from('analytics_events')
        .select('event_type, timestamp, properties')
        .gt('timestamp', oneHourAgo.toISOString())
        .order('timestamp', { ascending: false })
        .limit(20)
    ]);

    // Process active users (unique count)
    const activeUsers = new Set(
      activeUsersResult.data?.map(event => event.user_id) || []
    ).size;

    // Process recent activities by type
    const activityTypes = activeUsersResult.data?.reduce((acc: Record<string, number>, activity) => {
      acc[activity.event_type] = (acc[activity.event_type] || 0) + 1;
      return acc;
    }, {}) || {};

    // Process online presence
    const onlineUsers = onlinePresenceResult.data?.length || 0;

    // Process system health
    const securityEvents = systemHealthResult.data || [];
    const criticalEvents = securityEvents.filter(event => event.risk_level === 'critical').length;
    const highRiskEvents = securityEvents.filter(event => event.risk_level === 'high').length;

    // Calculate system health score
    const healthScore = Math.max(0, 100 - (criticalEvents * 20) - (highRiskEvents * 5));

    // Process recent events
    const recentEvents = recentEventsResult.data?.map(event => ({
      type: event.event_type,
      timestamp: event.timestamp,
      metadata: event.properties || {}
    })) || [];

    // Calculate trends (simplified - would need historical data for real trends)
    const calculateSimpleTrend = (current: number, threshold: number = 10) => {
      if (current > threshold) return 'up';
      if (current < threshold / 2) return 'down';
      return 'stable';
    };

    const realTimeStats = {
      activeUsers: {
        current: activeUsers,
        online: onlineUsers,
        trend: calculateSimpleTrend(activeUsers, 5)
      },
      systemHealth: {
        score: healthScore,
        status: healthScore > 90 ? 'excellent' : healthScore > 75 ? 'good' : healthScore > 50 ? 'warning' : 'critical',
        uptime: 99.9, // Would come from monitoring service
        responseTime: Math.floor(Math.random() * 50) + 50, // Simulated - would come from monitoring
        trend: healthScore > 90 ? 'stable' : 'down'
      },
      recentActivity: {
        eventsLastHour: activeUsersResult.data?.length || 0,
        activitiesLastHour: recentActivitiesResult.data?.length || 0,
        topActivityTypes: Object.entries(activityTypes)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([type, count]) => ({ type, count }))
      },
      security: {
        incidentsLast24h: securityEvents.length,
        criticalEvents,
        highRiskEvents,
        riskLevel: criticalEvents > 0 ? 'high' : highRiskEvents > 2 ? 'medium' : 'low'
      },
      recentEvents: recentEvents.slice(0, 10),
      lastUpdated: now.toISOString(),
      refreshInterval: 30000 // 30 seconds
    };

    console.log('Real-time stats successfully fetched for user:', user.id);

    return new Response(
      JSON.stringify(realTimeStats),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate' // No caching for real-time data
        } 
      }
    );

  } catch (error) {
    console.error('Error in get-real-time-stats function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});