import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useUploaderSettings } from '@/hooks/useUploaderSettings'
import { UPLOAD_CONFIGS } from '@/utils/uploadConfigs'
import { logger } from '@/utils/logger'
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation'

export interface FileUploadConfig {
  uploadType: string
  maxFiles?: number
  maxSizeBytes?: number
  allowedTypes?: string[]
  acceptString?: string
  entityId?: string
  tableName?: string
  columnName?: string
  isTemporary?: boolean
  tempSessionId?: string
}

export interface UploadedFile {
  url: string
  path: string
  name: string
  size: number
}

export interface FileUploadError {
  file: string
  error: string
}

export interface FileUploadResult {
  success: boolean
  files?: UploadedFile[]
  errors?: FileUploadError[]
}

export const useFileUploader = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const { globalSettings, getUploadConfig, loading: settingsLoading } = useUploaderSettings()
  const [isUploading, setIsUploading] = useState(false)
  const { t } = useUnifiedTranslation()

  // Helper function to resolve configuration with database settings
  const resolveUploadConfig = useCallback((config: FileUploadConfig): FileUploadConfig => {
    // Try to get database configuration first - use the uploadType directly
    const dbConfig = getUploadConfig(config.uploadType)
    
    // Fallback to hardcoded config if database config not found
    let fallbackConfig = null
    for (const [key, hardcodedConfig] of Object.entries(UPLOAD_CONFIGS)) {
      if (hardcodedConfig.uploadType === config.uploadType) {
        fallbackConfig = hardcodedConfig
        break
      }
    }

    // Merge database config with provided config, with database taking precedence for upload settings
    const resolvedConfig: FileUploadConfig = {
      ...fallbackConfig, // Start with hardcoded fallback
      ...config, // Apply provided config
      ...(dbConfig && { // Apply database config if available
        maxFiles: dbConfig.maxFiles,
        maxSizeBytes: dbConfig.maxSizeBytes,
        allowedTypes: dbConfig.allowedTypes,
        acceptString: dbConfig.acceptString
      })
    }

    return resolvedConfig
  }, [getUploadConfig])

  // Enhanced file validation using database settings
  const validateFiles = useCallback((files: File[], config: FileUploadConfig): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    const resolvedConfig = resolveUploadConfig(config)

    // Check file count
    if (resolvedConfig.maxFiles && files.length > resolvedConfig.maxFiles) {
      errors.push(`Maximum ${resolvedConfig.maxFiles} files allowed`)
    }

    // Check individual files
    files.forEach((file, index) => {
      // Check file size
      if (resolvedConfig.maxSizeBytes && file.size > resolvedConfig.maxSizeBytes) {
        const maxSizeMB = Math.round(resolvedConfig.maxSizeBytes / (1024 * 1024))
        errors.push(`File "${file.name}" exceeds maximum size of ${maxSizeMB}MB`)
      }

      // Check file type
      if (resolvedConfig.allowedTypes && !resolvedConfig.allowedTypes.includes(file.type)) {
        errors.push(`File "${file.name}" type "${file.type}" is not allowed`)
      }
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }, [resolveUploadConfig])

  const uploadFiles = useCallback(async (
    files: File[],
    config: FileUploadConfig
  ): Promise<FileUploadResult> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to upload files',
        variant: 'destructive'
      })
      return { success: false, errors: [{ file: 'Auth', error: 'User not authenticated' }] }
    }

    if (files.length === 0) {
      return { success: false, errors: [{ file: 'Files', error: 'No files provided' }] }
    }

    // Wait for settings to load if they're still loading
    if (settingsLoading) {
      toast({
        title: 'Loading settings',
        description: 'Please wait while upload settings are loaded...',
        variant: 'default'
      })
      return { success: false, errors: [{ file: 'Settings', error: 'Upload settings are loading' }] }
    }

    // Resolve configuration with database settings
    const resolvedConfig = resolveUploadConfig(config)

    // Validate files with resolved configuration
    const validation = validateFiles(files, resolvedConfig)
    if (!validation.valid) {
      validation.errors.forEach(error => {
        toast({
          title: 'Validation Error',
          description: error,
          variant: 'destructive'
        })
      })
      return { 
        success: false, 
        errors: validation.errors.map(error => ({ file: 'Validation', error }))
      }
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      
      // Add configuration
      formData.append('uploadType', resolvedConfig.uploadType)
      if (resolvedConfig.entityId) formData.append('entityId', resolvedConfig.entityId)
      if (resolvedConfig.tableName) formData.append('tableName', resolvedConfig.tableName)
      if (resolvedConfig.columnName) formData.append('columnName', resolvedConfig.columnName)
      if (resolvedConfig.isTemporary) formData.append('isTemporary', 'true')
      if (resolvedConfig.tempSessionId) formData.append('tempSessionId', resolvedConfig.tempSessionId)
      
      // Add global settings for edge function to use
      formData.append('globalSettings', JSON.stringify(globalSettings))
      
      // Add files
      files.forEach(file => {
        formData.append('files', file)
      })

      const { data, error } = await supabase.functions.invoke('secure-upload', {
        body: formData
      })

      if (error) {
        throw new Error(error.message || 'Upload failed')
      }

      if (!data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      toast({
        title: 'Upload successful',
        description: `${data.files.length} file(s) uploaded successfully`
      })

      return {
        success: true,
        files: data.files
      }

    } catch (error) {
      logger.error('File upload failed', { operation: 'uploadFiles', uploadType: resolvedConfig.uploadType }, error as Error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      toast({
        title: t('upload_failed', 'Upload failed'),
        description: errorMessage,
        variant: 'destructive'
      })

      return {
        success: false,
        errors: [{ file: 'Upload', error: errorMessage }]
      }
    } finally {
      setIsUploading(false)
    }
  }, [user, toast, globalSettings, settingsLoading, resolveUploadConfig, validateFiles])

  const getFileUrl = useCallback(async (relativePath: string, trackAccess = true): Promise<string> => {
    const url = relativePath.startsWith('http') 
      ? relativePath 
      : `https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public${relativePath}`
    
    // Log access if tracking enabled
    if (trackAccess && user) {
      try {
        // Find file record by path
        const pathWithoutBucket = relativePath.replace(/^\/[^\/]+\//, '')
        const { data: fileRecord } = await supabase
          .from('file_records')
          .select('id')
          .eq('file_path', pathWithoutBucket)
          .maybeSingle()
        
        if (fileRecord) {
          // Update last accessed time  
          await supabase
            .from('file_records')
            .update({ 
              last_accessed: new Date().toISOString()
            })
            .eq('id', fileRecord.id)
          
          // Log access event
          await supabase
            .from('file_lifecycle_events')
            .insert({
              file_record_id: fileRecord.id,
              event_type: 'accessed',
              event_details: {
                access_method: 'url_generation',
                user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
                referrer: typeof document !== 'undefined' ? document.referrer : 'unknown',
                access_timestamp: new Date().toISOString()
              },
              performed_by: user.id
            })
        }
      } catch (error) {
        logger.warn('Failed to log file access', { relativePath, trackAccess }, error as Error)
      }
    }
    
    return url
  }, [user, supabase])

  const commitTemporaryFiles = useCallback(async (
    tempFiles: UploadedFile[],
    finalConfig: Omit<FileUploadConfig, 'isTemporary' | 'tempSessionId'>
  ): Promise<FileUploadResult> => {
    if (!user) {
      return { success: false, errors: [{ file: 'Auth', error: 'User not authenticated' }] }
    }

    try {
      setIsUploading(true)
      
      // Resolve final configuration with database settings
      const resolvedFinalConfig = resolveUploadConfig(finalConfig)

      const movedFiles: UploadedFile[] = []
      
      for (const tempFile of tempFiles) {
        // Move files from temp to final location
        const tempPath = tempFile.path.replace(/^\/[^\/]+\//, '')
        const finalPath = `${resolvedFinalConfig.uploadType}/${resolvedFinalConfig.entityId || user.id}-${Date.now()}-${tempFile.name}`
        
        const { data: moveData, error: moveError } = await supabase.storage
          .from(resolvedFinalConfig.uploadType.split('-')[0])
          .move(tempPath, finalPath)

        if (moveError) {
          logger.error('File move operation failed', { operation: 'moveFile', tempPath, finalPath }, moveError)
          continue
        }

        const finalUrl = await getFileUrl(`/${resolvedFinalConfig.uploadType.split('-')[0]}/${finalPath}`, false)
        movedFiles.push({
          ...tempFile,
          url: finalUrl,
          path: `/${resolvedFinalConfig.uploadType.split('-')[0]}/${finalPath}`
        })
      }

      // Update database if specified
      if (resolvedFinalConfig.tableName && resolvedFinalConfig.columnName && resolvedFinalConfig.entityId && movedFiles.length > 0) {
        const updateData: Record<string, string | string[]> = {}
        
        if (resolvedFinalConfig.maxFiles === 1) {
          updateData[resolvedFinalConfig.columnName] = movedFiles[0].path
        } else {
          updateData[resolvedFinalConfig.columnName] = movedFiles.map(f => f.path)
        }

        const { error: updateError } = await supabase
          .from(resolvedFinalConfig.tableName as any)
          .update(updateData)
          .eq('id', resolvedFinalConfig.entityId)

        if (updateError) {
          logger.error('Database update failed during file commit', { 
            tableName: resolvedFinalConfig.tableName, 
            entityId: resolvedFinalConfig.entityId 
          }, updateError);
        }
      }

      return {
        success: true,
        files: movedFiles
      }

    } catch (error) {
      logger.error('File commit operation failed', { operation: 'commitTemporaryFiles' }, error as Error)
      return {
        success: false,
        errors: [{ file: 'Commit', error: error instanceof Error ? error.message : 'Failed to commit files' }]
      }
    } finally {
      setIsUploading(false)
    }
  }, [user, supabase, getFileUrl, resolveUploadConfig])

  const cleanupTemporaryFiles = useCallback(async (tempSessionId: string): Promise<void> => {
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-temp-files', {
        body: { 
          tempSessionId,
          globalSettings // Pass global settings for cleanup rules
        }
      })

      if (error) {
        logger.error('Cleanup edge function failed', { tempSessionId }, error)
        return
      }

      if (data?.success) {
        logger.info('Temporary files cleanup completed', { 
          tempSessionId, 
          cleanedFiles: data.cleanedFiles 
        })
      }
    } catch (error) {
      logger.error('File cleanup failed', { tempSessionId }, error as Error)
    }
  }, [supabase, globalSettings])

  return {
    uploadFiles,
    getFileUrl,
    commitTemporaryFiles,
    cleanupTemporaryFiles,
    isUploading,
    validateFiles,
    resolveUploadConfig
  }
}