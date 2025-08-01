import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Migration mapping for legacy buckets to new buckets
const BUCKET_MIGRATIONS = {
  'challenge-attachments': 'challenges-attachments-private',
  'event-resources': 'events-resources-public',
  'idea-images': 'ideas-images-public',
  'partner-images': 'partners-logos-public',
  'partner-logos': 'partners-logos-public',
  'team-logos': 'partners-logos-public', // Merge team logos with partner logos
  'saved-images': 'ideas-images-public', // Move saved images to ideas
  'dashboard-images': 'system-assets-public',
  'sector-images': 'sectors-images-public',
  'opportunity-attachments': 'opportunities-attachments-private'
}

interface MigrationResult {
  bucket: string
  migrated: number
  failed: number
  errors: string[]
}

interface MigrationSummary {
  totalFiles: number
  totalMigrated: number
  totalFailed: number
  results: MigrationResult[]
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify admin authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    // Check if user has admin role
    const { data: userRoles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true)

    const isAdmin = userRoles?.some(r => r.role === 'admin' || r.role === 'super_admin')
    if (!isAdmin) {
      throw new Error('Admin access required')
    }

    console.log('Starting storage migration...')

    const summary: MigrationSummary = {
      totalFiles: 0,
      totalMigrated: 0,
      totalFailed: 0,
      results: []
    }

    // Process each legacy bucket
    for (const [legacyBucket, targetBucket] of Object.entries(BUCKET_MIGRATIONS)) {
      console.log(`Processing migration: ${legacyBucket} -> ${targetBucket}`)

      const migrationResult: MigrationResult = {
        bucket: legacyBucket,
        migrated: 0,
        failed: 0,
        errors: []
      }

      try {
        // List all files in the legacy bucket
        const { data: files, error: listError } = await supabaseClient.storage
          .from(legacyBucket)
          .list('', { limit: 1000 })

        if (listError) {
          migrationResult.errors.push(`Failed to list files: ${listError.message}`)
          summary.results.push(migrationResult)
          continue
        }

        if (!files || files.length === 0) {
          console.log(`No files found in ${legacyBucket}`)
          summary.results.push(migrationResult)
          continue
        }

        console.log(`Found ${files.length} files in ${legacyBucket}`)
        summary.totalFiles += files.length

        // Process each file
        for (const file of files) {
          try {
            const fileName = file.name
            console.log(`Migrating file: ${fileName}`)

            // Download file from legacy bucket
            const { data: fileData, error: downloadError } = await supabaseClient.storage
              .from(legacyBucket)
              .download(fileName)

            if (downloadError) {
              migrationResult.errors.push(`Download failed for ${fileName}: ${downloadError.message}`)
              migrationResult.failed++
              continue
            }

            // Determine target path based on bucket type and preserve folder structure
            let targetPath = fileName
            if (legacyBucket === 'team-logos' || legacyBucket === 'partner-logos') {
              // For logos, keep them in a unified partners folder
              targetPath = `partners/${fileName}`
            } else if (legacyBucket === 'saved-images') {
              // For saved images, move to ideas folder
              targetPath = `saved/${fileName}`
            } else if (legacyBucket === 'dashboard-images') {
              // For dashboard images, move to system assets
              targetPath = `dashboard/${fileName}`
            }

            // Upload file to target bucket
            const { error: uploadError } = await supabaseClient.storage
              .from(targetBucket)
              .upload(targetPath, fileData, {
                cacheControl: '3600',
                upsert: true
              })

            if (uploadError) {
              migrationResult.errors.push(`Upload failed for ${fileName}: ${uploadError.message}`)
              migrationResult.failed++
              continue
            }

            // Successfully migrated
            migrationResult.migrated++
            summary.totalMigrated++
            console.log(`✅ Migrated: ${legacyBucket}/${fileName} -> ${targetBucket}/${targetPath}`)

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100))

          } catch (fileError) {
            migrationResult.errors.push(`File processing error for ${file.name}: ${fileError.message}`)
            migrationResult.failed++
            summary.totalFailed++
          }
        }

      } catch (bucketError) {
        migrationResult.errors.push(`Bucket processing error: ${bucketError.message}`)
        summary.totalFailed += migrationResult.failed
      }

      summary.results.push(migrationResult)
    }

    console.log('Migration completed:', summary)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Storage migration completed',
        summary
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Migration error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
