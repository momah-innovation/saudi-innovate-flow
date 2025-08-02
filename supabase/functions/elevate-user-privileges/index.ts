import { createClient } from 'jsr:@supabase/supabase-js@^2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate request (add your own authentication logic)
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ 
      error: 'Unauthorized',
      message: 'Authentication required to elevate privileges'
    }), { 
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Create Supabase client with service role key
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const userId = '8066cfaf-4a91-4985-922b-74f6a286c441'

  try {
    console.log(`Attempting to elevate privileges for user: ${userId}`)

    // Attempt to update user metadata
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        app_metadata: { 
          is_super_admin: true,
          role: 'super_admin',
          super_admin: true,
          admin_level: 999,
          privileged_at: new Date().toISOString()
        } 
      }
    )

    if (error) {
      console.error('Error updating user metadata:', error)
      throw error
    }

    console.log('User metadata updated successfully:', data)

    // Verify the update
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)

    if (userError) {
      console.error('Error verifying user update:', userError)
      throw userError
    }

    console.log('User verification successful:', userData.user?.app_metadata)

    return new Response(JSON.stringify({
      success: true,
      message: 'User privileges elevated successfully',
      metadata: userData.user?.app_metadata
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: error
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})