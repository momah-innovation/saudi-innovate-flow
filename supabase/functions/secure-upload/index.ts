import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'

// CORS headers for preflight requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced upload configuration interface
interface UploadConfig {
  uploadType: string
  bucket: string
  path: string
  maxSizeBytes: number
  allowedTypes: string[]
  maxFiles: number
  enabled: boolean
  autoCleanup: boolean
  cleanupDays: number
}

// Global settings interface
interface GlobalSettings {
  autoCleanupEnabled: boolean
  defaultCleanupDays: number
  maxConcurrentUploads: number
  chunkSizeMB: number
  retryAttempts: number
  compressionEnabled: boolean
  thumbnailGeneration: boolean
}

// Fallback upload configurations
const FALLBACK_UPLOAD_CONFIGS: Record<string, UploadConfig> = {
  'opportunity-images': {
    uploadType: 'opportunity-images',
    bucket: 'opportunity-images',
    path: 'opportunity-images',
    maxSizeBytes: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 3,
    enabled: true,
    autoCleanup: false,
    cleanupDays: 0
  },
  'user-avatars': {
    uploadType: 'user-avatars',
    bucket: 'avatars',
    path: 'profiles',
    maxSizeBytes: 2 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 1,
    enabled: true,
    autoCleanup: false,
    cleanupDays: 0
  },
  'challenge-images': {
    uploadType: 'challenge-images',
    bucket: 'challenge-attachments',
    path: 'images',
    maxSizeBytes: 8 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 2,
    enabled: true,
    autoCleanup: false,
    cleanupDays: 0
  },
  'event-resources': {
    uploadType: 'event-resources',
    bucket: 'event-resources',
    path: 'resources',
    maxSizeBytes: 100 * 1024 * 1024,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4'],
    maxFiles: 25,
    enabled: true,
    autoCleanup: false,
    cleanupDays: 0
  }
}

// Helper function to fetch upload configuration from database
async function getUploadConfigFromDB(supabaseClient: any, uploadType: string): Promise<UploadConfig | null> {
  try {
    const { data, error } = await supabaseClient
      .from('uploader_settings')
      .select('*')
      .eq('setting_type', 'upload_config')
      .eq('setting_key', uploadType)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.warn('Database config fetch error:', error)
      return null
    }

    if (!data?.setting_value) {
      return null
    }

    const config = data.setting_value as any
    return {
      uploadType: config.uploadType || uploadType,
      bucket: config.bucket || '',
      path: config.path || '',
      maxSizeBytes: Number(config.maxSizeBytes) || 5242880,
      allowedTypes: Array.isArray(config.allowedTypes) ? config.allowedTypes : [],
      maxFiles: Number(config.maxFiles) || 1,
      enabled: Boolean(config.enabled) !== false,
      autoCleanup: Boolean(config.autoCleanup) || false,
      cleanupDays: Number(config.cleanupDays) || 0
    }
  } catch (error) {
    console.warn('Error fetching upload config from database:', error)
    return null
  }
}

// Helper function to fetch global settings from database
async function getGlobalSettingsFromDB(supabaseClient: any): Promise<GlobalSettings> {
  const defaultSettings: GlobalSettings = {
    autoCleanupEnabled: true,
    defaultCleanupDays: 7,
    maxConcurrentUploads: 3,
    chunkSizeMB: 1,
    retryAttempts: 3,
    compressionEnabled: true,
    thumbnailGeneration: true
  }

  try {
    const { data, error } = await supabaseClient
      .from('uploader_settings')
      .select('*')
      .eq('setting_type', 'global')
      .eq('is_active', true)

    if (error || !data) {
      console.warn('Global settings fetch error, using defaults:', error)
      return defaultSettings
    }

    const processedSettings: Partial<GlobalSettings> = {}
    data.forEach((item: any) => {
      const value = typeof item.setting_value === 'object' && item.setting_value && 'value' in item.setting_value 
        ? item.setting_value.value 
        : item.setting_value

      switch (item.setting_key) {
        case 'auto_cleanup_enabled':
          processedSettings.autoCleanupEnabled = Boolean(value)
          break
        case 'default_cleanup_days':
          processedSettings.defaultCleanupDays = Number(value) || 7
          break
        case 'max_concurrent_uploads':
          processedSettings.maxConcurrentUploads = Number(value) || 3
          break
        case 'chunk_size_mb':
          processedSettings.chunkSizeMB = Number(value) || 1
          break
        case 'retry_attempts':
          processedSettings.retryAttempts = Number(value) || 3
          break
        case 'compression_enabled':
          processedSettings.compressionEnabled = Boolean(value)
          break
        case 'thumbnail_generation':
          processedSettings.thumbnailGeneration = Boolean(value)
          break
      }
    })

    return { ...defaultSettings, ...processedSettings }
  } catch (error) {
    console.warn('Error fetching global settings, using defaults:', error)
    return defaultSettings
  }
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

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid token')
    }

    const formData = await req.formData()
    const uploadType = formData.get('uploadType') as string
    const entityId = formData.get('entityId') as string
    const tableName = formData.get('tableName') as string
    const columnName = formData.get('columnName') as string
    const isTemporary = formData.get('isTemporary') === 'true'
    const tempSessionId = formData.get('tempSessionId') as string
    const globalSettingsJson = formData.get('globalSettings') as string

    // Parse global settings if provided
    let globalSettings: GlobalSettings
    try {
      globalSettings = globalSettingsJson ? JSON.parse(globalSettingsJson) : await getGlobalSettingsFromDB(supabaseClient)
    } catch {
      globalSettings = await getGlobalSettingsFromDB(supabaseClient)
    }

    if (!uploadType) {
      throw new Error('Upload type is required')
    }

    // Fetch configuration from database first, fallback to hardcoded
    let config = await getUploadConfigFromDB(supabaseClient, uploadType)
    if (!config) {
      config = FALLBACK_UPLOAD_CONFIGS[uploadType]
    }

    if (!config) {
      throw new Error(`Invalid upload type: ${uploadType}`)
    }

    if (!config.enabled) {
      throw new Error(`Upload type ${uploadType} is disabled`)
    }

    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      throw new Error('No files provided')
    }

    if (config.maxFiles && files.length > config.maxFiles) {
      throw new Error(`Maximum ${config.maxFiles} files allowed`)
    }

    // Log configuration being used
    console.log(`Using upload config for ${uploadType}:`, {
      bucket: config.bucket,
      maxFiles: config.maxFiles,
      maxSizeBytes: config.maxSizeBytes,
      allowedTypes: config.allowedTypes.length
    })

    const uploadedFiles: { url: string; path: string; name: string; size: number }[] = []

    for (const file of files) {
      // Validate file type
      if (!config.allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed for ${uploadType}`)
      }

      // Validate file size
      if (file.size > config.maxSizeBytes) {
        throw new Error(`File size exceeds limit of ${Math.round(config.maxSizeBytes / 1024 / 1024)}MB`)
      }

      // Generate unique filename
      const fileExtension = file.name.split('.').pop()
      const fileName = `${entityId || user.id}-${Date.now()}.${fileExtension}`
      
      // Use temporary path for temporary uploads
      let filePath: string
      if (isTemporary) {
        filePath = `temp/${tempSessionId || user.id}/${fileName}`
      } else {
        filePath = `${config.path}/${fileName}`
      }

      console.log(`Uploading file: ${fileName} to bucket: ${config.bucket}, path: ${filePath}`)

      // Apply global settings for upload behavior
      const uploadOptions: any = {
        cacheControl: '3600',
        upsert: false
      }

      // Apply compression if enabled
      if (globalSettings.compressionEnabled && file.type.startsWith('image/')) {
        console.log('Image compression enabled via global settings')
        // Note: Actual compression would need additional implementation
      }

      // Upload file to Supabase Storage with retry logic
      let uploadAttempts = 0
      let uploadData: any = null
      let uploadError: any = null

      while (uploadAttempts < globalSettings.retryAttempts) {
        try {
          const result = await supabaseClient.storage
            .from(config.bucket)
            .upload(filePath, file, uploadOptions)

          uploadData = result.data
          uploadError = result.error

          if (!uploadError) {
            console.log(`Upload successful on attempt ${uploadAttempts + 1}`)
            break
          }

          uploadAttempts++
          if (uploadAttempts < globalSettings.retryAttempts) {
            console.log(`Upload attempt ${uploadAttempts} failed, retrying...`)
            await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempts))
          }
        } catch (error) {
          uploadError = error
          uploadAttempts++
          if (uploadAttempts < globalSettings.retryAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempts))
          }
        }
      }

      if (uploadError) {
        console.error('Upload error after all attempts:', uploadError)
        throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabaseClient.storage
        .from(config.bucket)
        .getPublicUrl(filePath)

      const fileUrl = publicUrlData.publicUrl
      const relativePath = `/${config.bucket}/${filePath}`

      uploadedFiles.push({
        url: fileUrl,
        path: relativePath,
        name: file.name,
        size: file.size
      })

      console.log(`File uploaded successfully: ${fileName}`)
    }

    // Update database if table and column are provided (skip for temporary uploads)
    if (tableName && columnName && entityId && uploadedFiles.length > 0 && !isTemporary) {
      try {
        const updateData: any = {}
        
        if (config.maxFiles === 1) {
          // Single file upload - store as string
          updateData[columnName] = uploadedFiles[0].path
        } else {
          // Multiple files - store as array
          updateData[columnName] = uploadedFiles.map(f => f.path)
        }

        const { error: updateError } = await supabaseClient
          .from(tableName)
          .update(updateData)
          .eq('id', entityId)

        if (updateError) {
          console.error('Database update error:', updateError)
          // Don't throw here - file was uploaded successfully
        } else {
          console.log(`Database updated: ${tableName}.${columnName} for entity ${entityId}`)
        }
      } catch (dbError) {
        console.error('Database update failed:', dbError)
        // Don't throw - file upload was successful
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        files: uploadedFiles,
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
        configUsed: {
          fromDatabase: !!await getUploadConfigFromDB(supabaseClient, uploadType),
          uploadType: config.uploadType,
          maxFiles: config.maxFiles
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Upload function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Upload failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})