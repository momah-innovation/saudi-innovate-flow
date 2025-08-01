import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

export interface FileUploadConfig {
  uploadType: string
  maxFiles?: number
  maxSizeBytes?: number
  allowedTypes?: string[]
  entityId?: string
  tableName?: string
  columnName?: string
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

  return {
    uploadFiles,
    getFileUrl,
    isUploading
  }
}