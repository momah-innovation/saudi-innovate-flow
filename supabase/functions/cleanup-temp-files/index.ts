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
      'temp-uploads-private',           // Primary temp bucket
      'opportunities-images-public',
      'opportunities-attachments-private',
      'challenges-attachments-private',
      'events-resources-public',
      'user-avatars-public',
      'partners-logos-public'
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

            // Update file records and log lifecycle events
            for (const file of files) {
              try {
                const filePath = `temp/${tempSessionId}/${file.name}`
                
                // Find and update file record
                const { data: fileRecord } = await supabaseClient
                  .from('file_records')
                  .select('id')
                  .eq('file_path', filePath)
                  .eq('bucket_name', bucketName)
                  .maybeSingle()
                
                if (fileRecord) {
                  // Update record status
                  await supabaseClient
                    .from('file_records')
                    .update({ 
                      status: 'deleted',
                      updated_at: new Date().toISOString()
                    })
                    .eq('id', fileRecord.id)
                  
                  // Log lifecycle event
                  await supabaseClient
                    .from('file_lifecycle_events')
                    .insert({
                      file_record_id: fileRecord.id,
                      event_type: 'deleted',
                      event_details: {
                        cleanup_method: 'manual',
                        bucket_name: bucketName,
                        reason: 'temporary_file_cleanup',
                        temp_session_id: tempSessionId
                      }
                    })
                  
                  console.log(`File record updated for: ${filePath}`)
                }
              } catch (recordError) {
                console.warn(`Failed to update file record for ${file.name}:`, recordError)
              }
            }
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
        cleanedFiles: totalCleaned,
        bucketsProcessed: bucketsToClean.length,
        tempSessionId,
        cleanupTimestamp: new Date().toISOString()
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