import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, entityTypes = [], limit = 20 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Performing semantic search for: "${query}"`);

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate embedding for search query
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
        encoding_format: 'float'
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error(`OpenAI Embedding API error: ${embeddingResponse.statusText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Search different entity types
    const searchResults = [];

    // Search Ideas
    if (entityTypes.length === 0 || entityTypes.includes('idea')) {
      const { data: ideas } = await supabase
        .from('ideas')
        .select('id, title_ar, description_ar, status, created_at')
        .eq('status', 'approved')
        .limit(limit);

      if (ideas) {
        ideas.forEach(idea => {
          const relevanceScore = calculateRelevanceScore(query, idea.title_ar + ' ' + idea.description_ar);
          searchResults.push({
            id: idea.id,
            type: 'idea',
            title: idea.title_ar,
            description: idea.description_ar,
            relevanceScore,
            createdAt: idea.created_at,
            status: idea.status
          });
        });
      }
    }

    // Search Challenges
    if (entityTypes.length === 0 || entityTypes.includes('challenge')) {
      const { data: challenges } = await supabase
        .from('challenges')
        .select('id, title_ar, description_ar, status, created_at')
        .eq('status', 'active')
        .limit(limit);

      if (challenges) {
        challenges.forEach(challenge => {
          const relevanceScore = calculateRelevanceScore(query, challenge.title_ar + ' ' + challenge.description_ar);
          searchResults.push({
            id: challenge.id,
            type: 'challenge',
            title: challenge.title_ar,
            description: challenge.description_ar,
            relevanceScore,
            createdAt: challenge.created_at,
            status: challenge.status
          });
        });
      }
    }

    // Search Opportunities
    if (entityTypes.length === 0 || entityTypes.includes('opportunity')) {
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('id, title_ar, description_ar, status, created_at')
        .eq('status', 'open')
        .limit(limit);

      if (opportunities) {
        opportunities.forEach(opportunity => {
          const relevanceScore = calculateRelevanceScore(query, opportunity.title_ar + ' ' + opportunity.description_ar);
          searchResults.push({
            id: opportunity.id,
            type: 'opportunity',
            title: opportunity.title_ar,
            description: opportunity.description_ar,
            relevanceScore,
            createdAt: opportunity.created_at,
            status: opportunity.status
          });
        });
      }
    }

    // Search Events
    if (entityTypes.length === 0 || entityTypes.includes('event')) {
      const { data: events } = await supabase
        .from('events')
        .select('id, title_ar, description_ar, status, created_at')
        .eq('status', 'published')
        .limit(limit);

      if (events) {
        events.forEach(event => {
          const relevanceScore = calculateRelevanceScore(query, event.title_ar + ' ' + event.description_ar);
          searchResults.push({
            id: event.id,
            type: 'event',
            title: event.title_ar,
            description: event.description_ar,
            relevanceScore,
            createdAt: event.created_at,
            status: event.status
          });
        });
      }
    }

    // Sort by relevance score and limit results
    const sortedResults = searchResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    // Track AI usage
    const { error: usageError } = await supabase
      .from('ai_usage_tracking')
      .insert({
        feature_name: 'semantic_search',
        usage_type: 'search',
        input_tokens: Math.ceil(query.length / 4),
        output_tokens: 0,
        cost_estimate: embeddingData.usage?.total_tokens * 0.00002, // text-embedding-3-small pricing
        success: true,
        metadata: {
          query: query,
          entity_types: entityTypes,
          results_count: sortedResults.length
        }
      });

    if (usageError) {
      console.error('Error tracking AI usage:', usageError);
    }

    return new Response(
      JSON.stringify({
        results: sortedResults,
        query: query,
        totalResults: sortedResults.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in semantic search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Simple text similarity calculation (could be enhanced with actual embeddings)
function calculateRelevanceScore(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(' ');
  const textWords = text.toLowerCase().split(' ');
  
  let matches = 0;
  queryWords.forEach(word => {
    if (textWords.some(textWord => textWord.includes(word) || word.includes(textWord))) {
      matches++;
    }
  });
  
  return Math.min(matches / queryWords.length + 0.1, 1.0);
}