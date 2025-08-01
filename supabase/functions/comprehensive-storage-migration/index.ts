import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Complete migration mapping including database updates
const MIGRATION_MAPPINGS = {
  'challenge-attachments': {
    targetBucket: 'challenges-attachments-private',
    targetPath: 'attachments',
    databaseUpdates: [
      {
        table: 'challenges',
        column: 'image_url',
        searchPattern: 'challenge-attachments',
        replaceWith: 'challenges-attachments-private/attachments'
      },
      {
        table: 'challenge_submissions',
        column: 'attachment_urls',
        searchPattern: 'challenge-attachments',
        replaceWith: 'challenges-attachments-private/attachments',
        isArray: true
      }
    ]
  },
  'event-resources': {
    targetBucket: 'events-resources-public',
    targetPath: 'resources',
    databaseUpdates: [
      {
        table: 'event_resources',
        column: 'file_url',
        searchPattern: 'event-resources',
        replaceWith: 'events-resources-public/resources'
      },
      {
        table: 'events',
        column: 'recording_url',
        searchPattern: 'event-resources',
        replaceWith: 'events-resources-public/resources'
      }
    ]
  },
  'idea-images': {
    targetBucket: 'ideas-images-public',
    targetPath: 'images',
    databaseUpdates: [
      {
        table: 'ideas',
        column: 'image_url',
        searchPattern: 'idea-images',
        replaceWith: 'ideas-images-public/images'
      }
    ]
  },
  'partner-images': {
    targetBucket: 'partners-logos-public',
    targetPath: 'partners/images',
    databaseUpdates: [
      {
        table: 'partners',
        column: 'logo_url',
        searchPattern: 'partner-images',
        replaceWith: 'partners-logos-public/partners/images'
      }
    ]
  },
  'partner-logos': {
    targetBucket: 'partners-logos-public',
    targetPath: 'partners/logos',
    databaseUpdates: [
      {
        table: 'partners',
        column: 'logo_url',
        searchPattern: 'partner-logos',
        replaceWith: 'partners-logos-public/partners/logos'
      }
    ]
  },
  'team-logos': {
    targetBucket: 'partners-logos-public',
    targetPath: 'teams',
    databaseUpdates: [
      {
        table: 'innovation_teams',
        column: 'logo_url',
        searchPattern: 'team-logos',
        replaceWith: 'partners-logos-public/teams'
      }
    ]
  },
  'saved-images': {
    targetBucket: 'ideas-images-public',
    targetPath: 'saved',
    databaseUpdates: [
      {
        table: 'ideas',
        column: 'image_url',
        searchPattern: 'saved-images',
        replaceWith: 'ideas-images-public/saved'
      }
    ]
  },
  'dashboard-images': {
    targetBucket: 'system-assets-public',
    targetPath: 'dashboard',
    databaseUpdates: [
      {
        table: 'innovation_success_stories',
        column: 'featured_image_url',
        searchPattern: 'dashboard-images',
        replaceWith: 'system-assets-public/dashboard'
      }
    ]
  },
  'sector-images': {
    targetBucket: 'sectors-images-public',
    targetPath: 'images',
    databaseUpdates: [
      {
        table: 'sectors',
        column: 'image_url',
        searchPattern: 'sector-images',
        replaceWith: 'sectors-images-public/images'
      }
    ]
  },
  'opportunity-attachments': {
    targetBucket: 'opportunities-attachments-private',
    targetPath: 'attachments',
    databaseUpdates: [
      {
        table: 'opportunity_applications',
        column: 'attachment_urls',
        searchPattern: 'opportunity-attachments',
        replaceWith: 'opportunities-attachments-private/attachments',
        isArray: true
      }
    ]
  }
}

interface MigrationResult {
  bucket: string
  filesMigrated: number
  filesFailed: number
  databaseUpdated: boolean
  errors: string[]
}

interface MigrationSummary {
  totalFiles: number
  totalMigrated: number
  totalFailed: number
  databaseUpdates: number
  results: MigrationResult[]
  legacyBucketsToRemove: string[]
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

    // Check admin role
    const { data: userRoles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true)

    const isAdmin = userRoles?.some(r => r.role === 'admin' || r.role === 'super_admin')
    if (!isAdmin) {
      throw new Error('Admin access required')
    }

    console.log('Starting comprehensive storage migration...')

    const summary: MigrationSummary = {
      totalFiles: 0,
      totalMigrated: 0,
      totalFailed: 0,
      databaseUpdates: 0,
      results: [],
      legacyBucketsToRemove: []
    }

    // Process each legacy bucket
    for (const [legacyBucket, config] of Object.entries(MIGRATION_MAPPINGS)) {
      console.log(`Processing: ${legacyBucket} -> ${config.targetBucket}`)

      const migrationResult: MigrationResult = {
        bucket: legacyBucket,
        filesMigrated: 0,
        filesFailed: 0,
        databaseUpdated: false,
        errors: []
      }

      try {
        // 1. List and migrate files
        const { data: files, error: listError } = await supabaseClient.storage
          .from(legacyBucket)
          .list('', { limit: 1000 })

        if (listError) {
          migrationResult.errors.push(`Failed to list files: ${listError.message}`)
          summary.results.push(migrationResult)
          continue
        }

        if (!files || files.length === 0) {
          console.log(`No files in ${legacyBucket}`)
          // Still try database updates even if no files
        } else {
          console.log(`Found ${files.length} files in ${legacyBucket}`)
          summary.totalFiles += files.length

          // Migrate each file
          for (const file of files) {
            try {
              const fileName = file.name
              console.log(`Migrating: ${fileName}`)

              // Download from legacy bucket
              const { data: fileData, error: downloadError } = await supabaseClient.storage
                .from(legacyBucket)
                .download(fileName)

              if (downloadError) {
                migrationResult.errors.push(`Download failed for ${fileName}: ${downloadError.message}`)
                migrationResult.filesFailed++
                continue
              }

              // Upload to target bucket with organized path
              const targetPath = `${config.targetPath}/${fileName}`
              const { error: uploadError } = await supabaseClient.storage
                .from(config.targetBucket)
                .upload(targetPath, fileData, {
                  cacheControl: '3600',
                  upsert: true
                })

              if (uploadError) {
                migrationResult.errors.push(`Upload failed for ${fileName}: ${uploadError.message}`)
                migrationResult.filesFailed++
                continue
              }

              migrationResult.filesMigrated++
              summary.totalMigrated++
              console.log(`✅ Migrated: ${legacyBucket}/${fileName} -> ${config.targetBucket}/${targetPath}`)

              // Small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 100))

            } catch (fileError) {
              migrationResult.errors.push(`File error for ${file.name}: ${fileError.message}`)
              migrationResult.filesFailed++
              summary.totalFailed++
            }
          }
        }

        // 2. Update database references
        console.log(`Updating database references for ${legacyBucket}`)
        
        for (const dbUpdate of config.databaseUpdates) {
          try {
            let updateQuery
            let updateResult

            if (dbUpdate.isArray) {
              // Handle array columns (like attachment_urls)
              updateQuery = `
                UPDATE ${dbUpdate.table} 
                SET ${dbUpdate.column} = array(
                  SELECT replace(unnest(${dbUpdate.column}), '${dbUpdate.searchPattern}', '${dbUpdate.replaceWith}')
                )
                WHERE ${dbUpdate.column} IS NOT NULL 
                AND array_to_string(${dbUpdate.column}, ',') LIKE '%${dbUpdate.searchPattern}%'
              `
              
              const { error: updateError } = await supabaseClient.rpc('execute_sql', {
                query: updateQuery
              })
              
              if (updateError) {
                migrationResult.errors.push(`DB update failed for ${dbUpdate.table}.${dbUpdate.column}: ${updateError.message}`)
                continue
              }
            } else {
              // Handle regular text columns
              const { data, error: updateError } = await supabaseClient
                .from(dbUpdate.table)
                .update({
                  [dbUpdate.column]: supabaseClient.sql`replace(${dbUpdate.column}, ${dbUpdate.searchPattern}, ${dbUpdate.replaceWith})`
                })
                .like(dbUpdate.column, `%${dbUpdate.searchPattern}%`)

              if (updateError) {
                migrationResult.errors.push(`DB update failed for ${dbUpdate.table}.${dbUpdate.column}: ${updateError.message}`)
                continue
              }
            }

            console.log(`✅ Updated ${dbUpdate.table}.${dbUpdate.column}`)
            summary.databaseUpdates++

          } catch (dbError) {
            migrationResult.errors.push(`Database update error for ${dbUpdate.table}.${dbUpdate.column}: ${dbError.message}`)
          }
        }

        migrationResult.databaseUpdated = true

        // Mark bucket for removal if migration was successful
        if (migrationResult.filesFailed === 0 && migrationResult.errors.length === 0) {
          summary.legacyBucketsToRemove.push(legacyBucket)
        }

      } catch (bucketError) {
        migrationResult.errors.push(`Bucket processing error: ${bucketError.message}`)
      }

      summary.results.push(migrationResult)
    }

    console.log('Migration completed:', summary)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Comprehensive storage migration completed',
        summary,
        nextSteps: {
          removeEmptyLegacyBuckets: summary.legacyBucketsToRemove,
          verification: 'Check database for updated file paths',
          cleanup: 'Remove legacy policies after verification'
        }
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