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

    // Parse request body for any additional parameters
    const { timeframe = '30d' } = req.method === 'POST' ? await req.json() : {};

    // Fetch data from all metric views
    const [usersMetrics, challengesMetrics, systemMetrics, securityMetrics] = await Promise.all([
      supabase.from('admin_dashboard_metrics_view').select('*').single(),
      supabase.from('challenges_metrics_view').select('*').single(),
      supabase.from('system_metrics_view').select('*').single(),
      supabase.from('security_metrics_view').select('*').single()
    ]);

    // Check for errors in any of the queries
    if (usersMetrics.error || challengesMetrics.error || systemMetrics.error || securityMetrics.error) {
      console.error('Database query errors:', {
        users: usersMetrics.error,
        challenges: challengesMetrics.error,
        system: systemMetrics.error,
        security: securityMetrics.error
      });
      
      return new Response(
        JSON.stringify({ error: 'Error fetching metrics data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate trend indicators based on growth rates
    const calculateTrend = (growthRate: number) => {
      if (growthRate > 5) return 'up';
      if (growthRate < -5) return 'down';
      return 'stable';
    };

    // Format the response according to the interface
    const metricsResponse = {
      users: {
        total: usersMetrics.data?.total_users || 0,
        active: usersMetrics.data?.active_users_30d || 0,
        growthRate: usersMetrics.data?.user_growth_rate_percentage || 0,
        trend: calculateTrend(usersMetrics.data?.user_growth_rate_percentage || 0),
        newUsers7d: usersMetrics.data?.new_users_7d || 0,
        newUsers30d: usersMetrics.data?.new_users_30d || 0,
        breakdown: {
          admins: usersMetrics.data?.admin_count || 0,
          innovators: usersMetrics.data?.innovator_count || 0,
          experts: usersMetrics.data?.expert_count || 0,
          partners: usersMetrics.data?.partner_count || 0,
          evaluators: usersMetrics.data?.evaluator_count || 0,
          domainExperts: usersMetrics.data?.domain_expert_count || 0,
          teamMembers: usersMetrics.data?.team_members_count || 0
        }
      },
      challenges: {
        total: challengesMetrics.data?.total_challenges || 0,
        active: challengesMetrics.data?.active_challenges || 0,
        submissions: challengesMetrics.data?.total_submissions || 0,
        completionRate: challengesMetrics.data?.completion_rate_percentage || 0,
        trend: challengesMetrics.data?.new_challenges_30d > 0 ? 'up' : 'stable',
        recentActivity: {
          newChallenges30d: challengesMetrics.data?.new_challenges_30d || 0,
          newSubmissions30d: challengesMetrics.data?.new_submissions_30d || 0,
          newParticipants30d: challengesMetrics.data?.new_participants_30d || 0
        },
        statusBreakdown: {
          draft: challengesMetrics.data?.draft_challenges || 0,
          published: challengesMetrics.data?.published_challenges || 0,
          active: challengesMetrics.data?.active_challenges || 0,
          evaluation: challengesMetrics.data?.evaluation_challenges || 0,
          completed: challengesMetrics.data?.completed_challenges || 0
        },
        priorityBreakdown: {
          critical: challengesMetrics.data?.critical_priority_count || 0,
          high: challengesMetrics.data?.high_priority_count || 0,
          medium: challengesMetrics.data?.medium_priority_count || 0,
          low: challengesMetrics.data?.low_priority_count || 0
        }
      },
      system: {
        uptime: 99.9, // This would typically come from monitoring service
        performance: Math.min(100, Math.max(0, 100 - (systemMetrics.data?.events_24h || 0) / 100)),
        storageUsed: systemMetrics.data?.total_storage_bytes || 0,
        errors: 0, // This would come from error tracking
        storage: {
          totalFiles: systemMetrics.data?.total_files || 0,
          totalBuckets: systemMetrics.data?.total_buckets || 0,
          totalBytes: systemMetrics.data?.total_storage_bytes || 0,
          newFiles24h: systemMetrics.data?.new_files_24h || 0,
          newFiles7d: systemMetrics.data?.new_files_7d || 0
        },
        activity: {
          events24h: systemMetrics.data?.events_24h || 0,
          events7d: systemMetrics.data?.events_7d || 0,
          activeUsers24h: systemMetrics.data?.active_users_24h || 0
        },
        tables: {
          challenges: systemMetrics.data?.challenges_table_size || 0,
          submissions: systemMetrics.data?.submissions_table_size || 0,
          events: systemMetrics.data?.events_table_size || 0,
          profiles: systemMetrics.data?.profiles_table_size || 0
        }
      },
      security: {
        incidents: securityMetrics.data?.security_events_7d || 0,
        failedLogins: securityMetrics.data?.access_denied_24h || 0,
        riskLevel: (securityMetrics.data?.security_score || 100) > 80 ? 'low' : 
                   (securityMetrics.data?.security_score || 100) > 60 ? 'medium' : 'high',
        securityScore: securityMetrics.data?.security_score || 100,
        metrics: {
          securityEvents24h: securityMetrics.data?.security_events_24h || 0,
          securityEvents7d: securityMetrics.data?.security_events_7d || 0,
          highRiskEvents7d: securityMetrics.data?.high_risk_events_7d || 0,
          criticalRiskEvents7d: securityMetrics.data?.critical_risk_events_7d || 0,
          logins24h: securityMetrics.data?.logins_24h || 0,
          logins7d: securityMetrics.data?.logins_7d || 0,
          suspiciousActivities7d: securityMetrics.data?.suspicious_activities_7d || 0,
          pendingRoleRequests: securityMetrics.data?.pending_role_requests || 0
        }
      },
      lastUpdated: new Date().toISOString(),
      cacheExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes cache
    };

    console.log('Admin metrics successfully fetched for user:', user.id);

    return new Response(
      JSON.stringify(metricsResponse),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // 5 minutes cache
        } 
      }
    );

  } catch (error) {
    console.error('Error in get-admin-metrics function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});