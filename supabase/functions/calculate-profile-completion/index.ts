import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProfileCompletionRequest {
  user_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id }: ProfileCompletionRequest = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Calculating profile completion for user: ${user_id}`);

    // Fetch the user's profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (fetchError || !profile) {
      console.error('Error fetching profile:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Calculate completion score using the same logic as the trigger
    let completionScore = 2; // Base fields (email and created_at)
    const totalFields = 10;
    
    if (profile.name && profile.name.length > 0) {
      completionScore += 1;
    }
    
    if (profile.name_ar && profile.name_ar.length > 0) {
      completionScore += 1;
    }
    
    if (profile.profile_image_url) {
      completionScore += 1;
    }
    
    if (profile.bio && profile.bio.length > 20) {
      completionScore += 1;
    }
    
    if (profile.phone && profile.phone.length > 0) {
      completionScore += 1;
    }
    
    if (profile.department && profile.department.length > 0) {
      completionScore += 1;
    }
    
    if (profile.position && profile.position.length > 0) {
      completionScore += 1;
    }

    // Calculate percentage
    const completionPercentage = Math.round((completionScore / totalFields) * 100);

    console.log(`Profile completion calculated: ${completionPercentage}% (${completionScore}/${totalFields} fields)`);

    // Update the profile with the calculated percentage
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        profile_completion_percentage: completionPercentage,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    if (updateError) {
      console.error('Error updating profile completion:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update profile completion' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        completion_percentage: completionPercentage,
        user_id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in calculate-profile-completion function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});