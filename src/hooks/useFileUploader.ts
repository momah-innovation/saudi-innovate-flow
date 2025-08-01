import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

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
  const [isUploading, setIsUploading] = useState(false)

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

    setIsUploading(true)

    try {
      const formData = new FormData()
      
      // Add configuration
      formData.append('uploadType', config.uploadType)
      if (config.entityId) formData.append('entityId', config.entityId)
      if (config.tableName) formData.append('tableName', config.tableName)
      if (config.columnName) formData.append('columnName', config.columnName)
      if (config.isTemporary) formData.append('isTemporary', 'true')
      if (config.tempSessionId) formData.append('tempSessionId', config.tempSessionId)
      
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
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      toast({
        title: 'Upload failed',
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
  }, [user, toast])

  const getFileUrl = useCallback((relativePath: string): string => {
    if (relativePath.startsWith('http')) {
      return relativePath
    }
    return `https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public${relativePath}`
  }, [])

  const commitTemporaryFiles = useCallback(async (
    tempFiles: UploadedFile[],
    finalConfig: Omit<FileUploadConfig, 'isTemporary' | 'tempSessionId'>
  ): Promise<FileUploadResult> => {
    if (!user) {
      return { success: false, errors: [{ file: 'Auth', error: 'User not authenticated' }] }
    }

    try {
      setIsUploading(true)

      const movedFiles: UploadedFile[] = []
      
      for (const tempFile of tempFiles) {
        // Move files from temp to final location
        const tempPath = tempFile.path.replace(/^\/[^\/]+\//, '')
        const finalPath = `${finalConfig.uploadType}/${finalConfig.entityId || user.id}-${Date.now()}-${tempFile.name}`
        
        const { data: moveData, error: moveError } = await supabase.storage
          .from(finalConfig.uploadType.split('-')[0])
          .move(tempPath, finalPath)

        if (moveError) {
          console.error('Move error:', moveError)
          continue
        }

        const finalUrl = getFileUrl(`/${finalConfig.uploadType.split('-')[0]}/${finalPath}`)
        movedFiles.push({
          ...tempFile,
          url: finalUrl,
          path: `/${finalConfig.uploadType.split('-')[0]}/${finalPath}`
        })
      }

      // Update database if specified
      if (finalConfig.tableName && finalConfig.columnName && finalConfig.entityId && movedFiles.length > 0) {
        const updateData: any = {}
        
        if (finalConfig.maxFiles === 1) {
          updateData[finalConfig.columnName] = movedFiles[0].path
        } else {
          updateData[finalConfig.columnName] = movedFiles.map(f => f.path)
        }

        const { error: updateError } = await supabase
          .from(finalConfig.tableName as any)
          .update(updateData)
          .eq('id', finalConfig.entityId)

        if (updateError) {
          console.error('Database update error:', updateError)
        }
      }

      return {
        success: true,
        files: movedFiles
      }

    } catch (error) {
      console.error('Commit error:', error)
      return {
        success: false,
        errors: [{ file: 'Commit', error: error instanceof Error ? error.message : 'Failed to commit files' }]
      }
    } finally {
      setIsUploading(false)
    }
  }, [user, supabase, getFileUrl])

  const cleanupTemporaryFiles = useCallback(async (tempSessionId: string): Promise<void> => {
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-temp-files', {
        body: { tempSessionId }
      })

      if (error) {
        console.error('Cleanup edge function error:', error)
        return
      }

      if (data?.success) {
        console.log(`Cleanup completed: ${data.cleanedFiles} files removed`)
      }
    } catch (error) {
      console.error('Cleanup error:', error)
    }
  }, [supabase])

  return {
    uploadFiles,
    getFileUrl,
    commitTemporaryFiles,
    cleanupTemporaryFiles,
    isUploading
  }
}