import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { tempSessionId, buckets } = await req.json()

    if (!tempSessionId) {
      throw new Error('tempSessionId is required')
    }

    const bucketsToClean = buckets || [
      'opportunity-images',
      'opportunity-attachments', 
      'challenge-attachments',
      'event-resources',
      'avatars',
      'partner-logos'
    ]

    let totalCleaned = 0

    for (const bucketName of bucketsToClean) {
      try {
        // List files in temp folder for this session
        const { data: files, error: listError } = await supabaseClient.storage
          .from(bucketName)
          .list(`temp/${tempSessionId}`)

        if (listError) {
          console.warn(`Failed to list files in ${bucketName}/temp/${tempSessionId}:`, listError)
          continue
        }

        if (files && files.length > 0) {
          // Delete all files in this temp session
          const filePaths = files.map(f => `temp/${tempSessionId}/${f.name}`)
          
          const { error: deleteError } = await supabaseClient.storage
            .from(bucketName)
            .remove(filePaths)

          if (deleteError) {
            console.warn(`Failed to delete files from ${bucketName}:`, deleteError)
          } else {
            totalCleaned += files.length
            console.log(`Cleaned ${files.length} files from ${bucketName}/temp/${tempSessionId}`)
          }
        }
      } catch (bucketError) {
        console.warn(`Error processing bucket ${bucketName}:`, bucketError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Cleaned ${totalCleaned} temporary files`,
        cleanedFiles: totalCleaned
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Cleanup function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Cleanup failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})