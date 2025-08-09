import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EngagementAnalyticsRequest {
  entityType: string;
  entityId?: string;
  timeRange?: string; // 'day', 'week', 'month', 'year'
  startDate?: string;
  endDate?: string;
  metrics?: string[]; // specific metrics to calculate
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
      entityType,
      entityId,
      timeRange = 'week',
      startDate,
      endDate,
      metrics = ['views', 'likes', 'shares', 'engagement_rate']
    }: EngagementAnalyticsRequest = await req.json();

    console.log('Calculating engagement analytics:', {
      entityType,
      entityId,
      timeRange,
      metrics
    });

    // Calculate date range
    const { start, end } = calculateDateRange(timeRange, startDate, endDate);

    // Get analytics data
    const analyticsData = await getEngagementMetrics(
      supabaseClient,
      entityType,
      entityId,
      start,
      end,
      metrics
    );

    // Calculate engagement rates and trends
    const enrichedData = await calculateEngagementRates(analyticsData);

    return new Response(
      JSON.stringify({ 
        success: true,
        data: enrichedData,
        timeRange: { start, end },
        entityType,
        entityId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in engagement-analytics:', error);
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

function calculateDateRange(timeRange: string, startDate?: string, endDate?: string) {
  const end = endDate ? new Date(endDate) : new Date();
  let start: Date;

  if (startDate) {
    start = new Date(startDate);
  } else {
    switch (timeRange) {
      case 'day':
        start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        start = new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }

  return { start: start.toISOString(), end: end.toISOString() };
}

async function getEngagementMetrics(
  supabase: any,
  entityType: string,
  entityId: string | undefined,
  startDate: string,
  endDate: string,
  metrics: string[]
) {
  const analyticsTable = `${entityType}_analytics`;
  
  try {
    let query = supabase.from(analyticsTable).select('*');
    
    if (entityId) {
      query = query.eq(`${entityType}_id`, entityId);
    }
    
    const { data: analyticsData, error } = await query
      .gte('last_updated', startDate)
      .lte('last_updated', endDate);

    if (error && error.code !== 'PGRST116') { // Table doesn't exist
      throw error;
    }

    // Also get events data for more detailed analytics
    let eventsQuery = supabase
      .from('analytics_events')
      .select('*')
      .eq('entity_type', entityType)
      .gte('timestamp', startDate)
      .lte('timestamp', endDate);

    if (entityId) {
      eventsQuery = eventsQuery.eq('entity_id', entityId);
    }

    const { data: eventsData, error: eventsError } = await eventsQuery;

    if (eventsError) {
      console.error('Error fetching events data:', eventsError);
    }

    return {
      analytics: analyticsData || [],
      events: eventsData || []
    };
  } catch (error) {
    console.error('Error fetching engagement metrics:', error);
    return { analytics: [], events: [] };
  }
}

async function calculateEngagementRates(data: any) {
  const { analytics, events } = data;

  // Aggregate metrics
  const totalViews = analytics.reduce((sum: number, item: any) => sum + (item.view_count || 0), 0);
  const totalLikes = analytics.reduce((sum: number, item: any) => sum + (item.like_count || 0), 0);
  const totalShares = analytics.reduce((sum: number, item: any) => sum + (item.share_count || 0), 0);
  const totalEngagement = totalLikes + totalShares;

  // Calculate engagement rate
  const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;

  // Event-based metrics
  const eventCounts = events.reduce((acc: Record<string, number>, event: any) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {});

  // Time-based analysis
  const dailyMetrics = events.reduce((acc: Record<string, any>, event: any) => {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { views: 0, likes: 0, shares: 0, comments: 0 };
    }
    acc[date][event.event_type] = (acc[date][event.event_type] || 0) + 1;
    return acc;
  }, {});

  return {
    summary: {
      totalViews,
      totalLikes,
      totalShares,
      totalEngagement,
      engagementRate: parseFloat(engagementRate.toFixed(2))
    },
    eventCounts,
    dailyMetrics,
    analytics,
    events
  };
}

serve(handler);