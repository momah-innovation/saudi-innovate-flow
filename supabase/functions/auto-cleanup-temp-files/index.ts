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

    console.log('Starting auto-cleanup process...')

    // Call the database cleanup function
    const { data: expiredCount, error: dbError } = await supabaseClient.rpc('cleanup_expired_temp_files')

    if (dbError) {
      console.error('Database cleanup error:', dbError)
      throw dbError
    }

    console.log(`Database cleanup completed: ${expiredCount || 0} records processed`)

    // Also clean up orphaned storage files in temp bucket
    const tempBucket = 'temp-uploads-private'
    let storageCleanupCount = 0
    let orphanedSessions = []

    try {
      // List all temp directories
      const { data: tempDirs, error: listError } = await supabaseClient.storage
        .from(tempBucket)
        .list('temp', { limit: 1000 })

      if (listError) {
        console.warn('Failed to list temp directories:', listError)
      } else if (tempDirs && tempDirs.length > 0) {
        console.log(`Found ${tempDirs.length} temp directories to check`)

        for (const dir of tempDirs) {
          try {
            // List files in each temp session directory
            const { data: sessionFiles, error: sessionError } = await supabaseClient.storage
              .from(tempBucket)
              .list(`temp/${dir.name}`, { limit: 1000 })

            if (sessionError) {
              console.warn(`Failed to list files in temp/${dir.name}:`, sessionError)
              continue
            }

            if (sessionFiles && sessionFiles.length > 0) {
              // Check if files are older than 7 days
              const oldFiles = sessionFiles.filter(file => {
                const fileAge = Date.now() - new Date(file.created_at).getTime()
                return fileAge > (7 * 24 * 60 * 60 * 1000) // 7 days
              })

              if (oldFiles.length > 0) {
                const pathsToDelete = oldFiles.map(f => `temp/${dir.name}/${f.name}`)
                
                const { error: deleteError } = await supabaseClient.storage
                  .from(tempBucket)
                  .remove(pathsToDelete)

                if (deleteError) {
                  console.warn(`Failed to delete old files from temp/${dir.name}:`, deleteError)
                } else {
                  storageCleanupCount += oldFiles.length
                  orphanedSessions.push(dir.name)
                  console.log(`Cleaned ${oldFiles.length} old files from temp/${dir.name}`)
                }
              }
            }
          } catch (sessionError) {
            console.warn(`Error processing temp session ${dir.name}:`, sessionError)
          }
        }
      }
    } catch (storageError) {
      console.warn('Storage cleanup error:', storageError)
    }

    // Log cleanup operation
    try {
      await supabaseClient
        .from('cleanup_logs')
        .insert({
          cleanup_type: 'auto_scheduled',
          files_processed: (expiredCount || 0) + storageCleanupCount,
          files_deleted: storageCleanupCount,
          execution_time_ms: Date.now() - performance.now(),
          details: {
            db_records_expired: expiredCount || 0,
            storage_files_removed: storageCleanupCount,
            orphaned_sessions: orphanedSessions,
            temp_bucket: tempBucket
          }
        })
    } catch (logError) {
      console.warn('Failed to log cleanup operation:', logError)
    }

    const result = {
      success: true,
      message: `Auto-cleanup completed`,
      dbRecordsExpired: expiredCount || 0,
      storageFilesRemoved: storageCleanupCount,
      orphanedSessions: orphanedSessions.length,
      timestamp: new Date().toISOString()
    }

    console.log('Auto-cleanup result:', result)

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Auto-cleanup error:', error)
    
    // Log failed cleanup
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      await supabaseClient
        .from('cleanup_logs')
        .insert({
          cleanup_type: 'auto_scheduled',
          files_processed: 0,
          files_deleted: 0,
          errors_encountered: 1,
          details: {
            error: error.message,
            timestamp: new Date().toISOString()
          }
        })
    } catch (logError) {
      console.warn('Failed to log cleanup error:', logError)
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Auto-cleanup failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})