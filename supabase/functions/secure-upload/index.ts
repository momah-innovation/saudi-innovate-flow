import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UploadConfig {
  bucket: string
  path: string
  maxSizeBytes: number
  allowedTypes: string[]
  maxFiles?: number
}

const UPLOAD_CONFIGS: Record<string, UploadConfig> = {
  'opportunity-images': {
    bucket: 'opportunity-images',
    path: 'opportunity-images',
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxFiles: 1
  },
  'opportunity-documents': {
    bucket: 'opportunity-attachments',
    path: 'documents',
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxFiles: 5
  },
  'challenge-images': {
    bucket: 'challenge-attachments',
    path: 'images',
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxFiles: 1
  },
  'challenge-documents': {
    bucket: 'challenge-attachments',
    path: 'documents',
    maxSizeBytes: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    maxFiles: 10
  },
  'event-resources': {
    bucket: 'event-resources',
    path: 'resources',
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg'],
    maxFiles: 20
  },
  'user-avatars': {
    bucket: 'avatars',
    path: 'profiles',
    maxSizeBytes: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 1
  },
  'partner-logos': {
    bucket: 'partner-logos',
    path: 'logos',
    maxSizeBytes: 3 * 1024 * 1024, // 3MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    maxFiles: 1
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
    
    if (!uploadType || !UPLOAD_CONFIGS[uploadType]) {
      throw new Error('Invalid upload type')
    }

    const config = UPLOAD_CONFIGS[uploadType]
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      throw new Error('No files provided')
    }

    if (config.maxFiles && files.length > config.maxFiles) {
      throw new Error(`Maximum ${config.maxFiles} files allowed`)
    }

    const uploadedFiles: { url: string; path: string; name: string; size: number }[] = []

    for (const file of files) {
      // Validate file type
      if (!config.allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed for ${uploadType}`)
      }

      // Validate file size
      if (file.size > config.maxSizeBytes) {
        throw new Error(`File size exceeds limit of ${config.maxSizeBytes / 1024 / 1024}MB`)
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

      console.log(`Uploading file: ${fileName} to bucket: ${config.bucket}`)

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from(config.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
      }

      // Get public URL if bucket is public, otherwise get signed URL
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
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`
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