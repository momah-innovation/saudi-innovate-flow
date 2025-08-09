import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserAnalyticsRequest {
  userId: string;
  sessionId?: string;
  eventType: string;
  eventCategory?: string;
  entityType?: string;
  entityId?: string;
  properties?: Record<string, any>;
  userAgent?: string;
  referrer?: string;
  pageUrl?: string;
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

    const analyticsData: UserAnalyticsRequest = await req.json();

    console.log('Tracking user analytics:', {
      userId: analyticsData.userId,
      eventType: analyticsData.eventType,
      entityType: analyticsData.entityType
    });

    // Insert analytics event
    const { data: event, error: eventError } = await supabaseClient
      .from('analytics_events')
      .insert({
        user_id: analyticsData.userId,
        session_id: analyticsData.sessionId,
        event_type: analyticsData.eventType,
        event_category: analyticsData.eventCategory || 'user_interaction',
        entity_type: analyticsData.entityType,
        entity_id: analyticsData.entityId,
        properties: analyticsData.properties || {},
        user_agent: analyticsData.userAgent,
        referrer: analyticsData.referrer,
        page_url: analyticsData.pageUrl,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (eventError) {
      console.error('Error inserting analytics event:', eventError);
      throw eventError;
    }

    // Update specific entity analytics based on event type
    if (analyticsData.entityType && analyticsData.entityId) {
      await updateEntityAnalytics(
        supabaseClient,
        analyticsData.entityType,
        analyticsData.entityId,
        analyticsData.eventType
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        eventId: event.id,
        message: 'Analytics tracked successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in user-analytics-tracker:', error);
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

async function updateEntityAnalytics(
  supabase: any,
  entityType: string,
  entityId: string,
  eventType: string
) {
  try {
    const tableName = `${entityType}_analytics`;
    
    // Check if analytics record exists
    const { data: existingRecord } = await supabase
      .from(tableName)
      .select('*')
      .eq(`${entityType}_id`, entityId)
      .single();

    if (existingRecord) {
      // Update existing record
      const updates: Record<string, any> = {
        last_updated: new Date().toISOString()
      };

      if (eventType === 'view') {
        updates.view_count = (existingRecord.view_count || 0) + 1;
      } else if (eventType === 'like') {
        updates.like_count = (existingRecord.like_count || 0) + 1;
      } else if (eventType === 'share') {
        updates.share_count = (existingRecord.share_count || 0) + 1;
      }

      await supabase
        .from(tableName)
        .update(updates)
        .eq(`${entityType}_id`, entityId);
    } else {
      // Create new analytics record
      const newRecord: Record<string, any> = {
        [`${entityType}_id`]: entityId,
        view_count: eventType === 'view' ? 1 : 0,
        like_count: eventType === 'like' ? 1 : 0,
        share_count: eventType === 'share' ? 1 : 0,
        last_updated: new Date().toISOString()
      };

      await supabase
        .from(tableName)
        .insert(newRecord);
    }
  } catch (error) {
    console.error('Error updating entity analytics:', error);
  }
}

serve(handler);