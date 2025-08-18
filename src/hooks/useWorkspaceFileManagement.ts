import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  id: string
}

interface UseWorkspaceFileManagementReturn {
  uploads: FileUpload[]
  isUploading: boolean
  uploadFile: (workspaceId: string, file: File) => Promise<void>
  processFile: (workspaceId: string, fileName: string, action: string) => Promise<any>
  getFilePreview: (workspaceId: string, fileName: string) => Promise<any>
  clearUploads: () => void
}

export const useWorkspaceFileManagement = (): UseWorkspaceFileManagementReturn => {
  const [uploads, setUploads] = useState<FileUpload[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = useCallback(async (workspaceId: string, file: File) => {
    const uploadId = `upload_${Date.now()}_${Math.random()}`
    const fileName = `${workspaceId}/${uploadId}_${file.name}`

    // Add to upload queue
    const newUpload: FileUpload = {
      file,
      progress: 0,
      status: 'pending',
      id: uploadId
    }

    setUploads(prev => [...prev, newUpload])
    setIsUploading(true)

    try {
      // Update status to uploading
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, status: 'uploading' }
          : upload
      ))

      // Upload to storage
      const { data, error } = await supabase.storage
        .from('workspace-documents')
        .upload(fileName, file)

      if (error) throw error

      // Update status to processing
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, status: 'processing', progress: 100 }
          : upload
      ))

      // Process file via edge function
      const { error: processError } = await supabase.functions.invoke('workspace-file-processing', {
        body: {
          workspaceId,
          action: 'process_upload',
          fileName: file.name,
          filePath: data.path,
          fileSize: file.size,
          mimeType: file.type,
          metadata: {
            upload_id: uploadId,
            original_name: file.name
          }
        }
      })

      if (processError) throw processError

      // Update status to completed
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, status: 'completed' }
          : upload
      ))

      toast.success('تم رفع الملف بنجاح')

    } catch (error) {
      console.error('File upload error:', error)
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, status: 'error' }
          : upload
      ))
      toast.error('فشل في رفع الملف')
    } finally {
      setIsUploading(false)
    }
  }, [])

  const processFile = useCallback(async (workspaceId: string, fileName: string, action: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('workspace-file-processing', {
        body: {
          workspaceId,
          action,
          fileName,
          metadata: { 
            timestamp: new Date().toISOString() 
          }
        }
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('File processing error:', error)
      toast.error('فشل في معالجة الملف')
      throw error
    }
  }, [])

  const getFilePreview = useCallback(async (workspaceId: string, fileName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('workspace-file-processing', {
        body: {
          workspaceId,
          action: 'generate_preview',
          fileName,
          mimeType: 'application/octet-stream' // Will be determined by the function
        }
      })

      if (error) throw error

      return data.result
    } catch (error) {
      console.error('Preview generation error:', error)
      return { preview_available: false }
    }
  }, [])

  const clearUploads = useCallback(() => {
    setUploads([])
  }, [])

  return {
    uploads,
    isUploading,
    uploadFile,
    processFile,
    getFilePreview,
    clearUploads
  }
}