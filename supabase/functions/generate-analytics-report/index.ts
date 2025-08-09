import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportRequest {
  reportType: 'challenges' | 'ideas' | 'events' | 'opportunities' | 'users' | 'engagement';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  filters?: Record<string, any>;
  format?: 'json' | 'pdf' | 'excel';
  userId?: string;
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
      reportType, 
      dateRange, 
      filters = {},
      format = 'json',
      userId
    }: ReportRequest = await req.json();

    console.log('Generating analytics report:', { reportType, dateRange, format });

    // Check user permissions
    if (userId) {
      const { data: userRole } = await supabaseClient
        .rpc('has_role', { _user_id: userId, _role: 'admin' });

      if (!userRole) {
        throw new Error('Insufficient permissions to generate reports');
      }
    }

    let reportData: any = {};

    switch (reportType) {
      case 'challenges':
        reportData = await generateChallengesReport(supabaseClient, dateRange, filters);
        break;
      case 'ideas':
        reportData = await generateIdeasReport(supabaseClient, dateRange, filters);
        break;
      case 'events':
        reportData = await generateEventsReport(supabaseClient, dateRange, filters);
        break;
      case 'opportunities':
        reportData = await generateOpportunitiesReport(supabaseClient, dateRange, filters);
        break;
      case 'users':
        reportData = await generateUsersReport(supabaseClient, dateRange, filters);
        break;
      case 'engagement':
        reportData = await generateEngagementReport(supabaseClient, dateRange, filters);
        break;
    }

    // Add metadata
    reportData.metadata = {
      generatedAt: new Date().toISOString(),
      reportType,
      dateRange,
      filters,
      generatedBy: userId
    };

    // Log report generation
    await supabaseClient
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: 'report_generated',
        event_category: 'analytics',
        entity_type: 'report',
        properties: {
          reportType,
          dateRange,
          format,
          recordCount: reportData.summary?.totalRecords || 0
        }
      });

    if (format === 'json') {
      return new Response(
        JSON.stringify(reportData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For other formats, you would integrate with PDF/Excel generation libraries
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Format ${format} not yet supported` 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in generate-analytics-report:', error);
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

async function generateChallengesReport(supabase: any, dateRange: any, filters: any) {
  const { data: challenges } = await supabase
    .from('challenges')
    .select(`
      *,
      challenge_analytics(*),
      challenge_participants(count),
      challenge_submissions(count)
    `)
    .gte('created_at', dateRange.startDate)
    .lte('created_at', dateRange.endDate);

  const summary = {
    totalChallenges: challenges?.length || 0,
    activeChallenges: challenges?.filter((c: any) => c.status === 'active').length || 0,
    totalParticipants: challenges?.reduce((sum: number, c: any) => sum + (c.challenge_participants?.length || 0), 0),
    totalSubmissions: challenges?.reduce((sum: number, c: any) => sum + (c.challenge_submissions?.length || 0), 0),
    averageEngagement: challenges?.reduce((sum: number, c: any) => sum + (c.challenge_analytics?.[0]?.engagement_rate || 0), 0) / (challenges?.length || 1)
  };

  return {
    summary,
    challenges: challenges || [],
    chartData: generateChallengesChartData(challenges || [])
  };
}

async function generateIdeasReport(supabase: any, dateRange: any, filters: any) {
  const { data: ideas } = await supabase
    .from('ideas')
    .select('*')
    .gte('created_at', dateRange.startDate)
    .lte('created_at', dateRange.endDate);

  const statusCounts = ideas?.reduce((acc: any, idea: any) => {
    acc[idea.status] = (acc[idea.status] || 0) + 1;
    return acc;
  }, {}) || {};

  return {
    summary: {
      totalIdeas: ideas?.length || 0,
      statusBreakdown: statusCounts
    },
    ideas: ideas || []
  };
}

async function generateEventsReport(supabase: any, dateRange: any, filters: any) {
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      event_participants(count)
    `)
    .gte('created_at', dateRange.startDate)
    .lte('created_at', dateRange.endDate);

  return {
    summary: {
      totalEvents: events?.length || 0,
      totalParticipants: events?.reduce((sum: number, e: any) => sum + (e.event_participants?.length || 0), 0)
    },
    events: events || []
  };
}

async function generateOpportunitiesReport(supabase: any, dateRange: any, filters: any) {
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select(`
      *,
      opportunity_analytics(*),
      opportunity_applications(count)
    `)
    .gte('created_at', dateRange.startDate)
    .lte('created_at', dateRange.endDate);

  return {
    summary: {
      totalOpportunities: opportunities?.length || 0,
      totalApplications: opportunities?.reduce((sum: number, o: any) => sum + (o.opportunity_applications?.length || 0), 0)
    },
    opportunities: opportunities || []
  };
}

async function generateUsersReport(supabase: any, dateRange: any, filters: any) {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .gte('created_at', dateRange.startDate)
    .lte('created_at', dateRange.endDate);

  return {
    summary: {
      totalUsers: profiles?.length || 0,
      verifiedUsers: profiles?.filter((p: any) => p.is_verified).length || 0
    },
    users: profiles || []
  };
}

async function generateEngagementReport(supabase: any, dateRange: any, filters: any) {
  const { data: events } = await supabase
    .from('analytics_events')
    .select('*')
    .gte('timestamp', dateRange.startDate)
    .lte('timestamp', dateRange.endDate);

  const eventTypes = events?.reduce((acc: any, event: any) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {}) || {};

  return {
    summary: {
      totalEvents: events?.length || 0,
      uniqueUsers: new Set(events?.map((e: any) => e.user_id).filter(Boolean)).size,
      eventTypeBreakdown: eventTypes
    },
    events: events || []
  };
}

function generateChallengesChartData(challenges: any[]) {
  // Generate chart data for visualization
  const statusData = challenges.reduce((acc: any, challenge: any) => {
    acc[challenge.status] = (acc[challenge.status] || 0) + 1;
    return acc;
  }, {});

  return {
    statusDistribution: Object.entries(statusData).map(([status, count]) => ({
      name: status,
      value: count
    }))
  };
}

serve(handler);