import React, { forwardRef, useImperativeHandle, useState, useId, useCallback } from 'react'
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { useTimerManager } from '@/utils/timerManager';
import { FileUploadConfig } from '@/hooks/useFileUploader'
import { UploadedFile, useFileUploader } from '@/hooks/useFileUploader'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Upload, X, Eye, Download, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation'
import { logger } from '@/utils/logger'

export interface EnhancedFileUploaderProps {
  config: FileUploadConfig
  onValueChange?: (files: UploadedFile[]) => void
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadProgress?: (progress: number) => void
  className?: string
  disabled?: boolean
  label?: string
  description?: string
  required?: boolean
  value?: UploadedFile[]
  error?: string
  showPreview?: boolean
  showMetadata?: boolean
  allowReorder?: boolean
  customValidation?: (file: File) => { valid: boolean; error?: string }
  onFileValidationError?: (file: File, error: string) => void
}

export interface EnhancedFileUploaderRef {
  commitFiles: (finalConfig: Omit<FileUploadConfig, 'isTemporary' | 'tempSessionId'>) => Promise<UploadedFile[]>
  clearFiles: () => void
  getFiles: () => UploadedFile[]
  uploadFiles: (files: File[]) => Promise<void>
  removeFile: (fileIndex: number) => void
  validateFiles: (files: File[]) => { valid: boolean; errors: string[] }
}

export const EnhancedFileUploader = forwardRef<EnhancedFileUploaderRef, EnhancedFileUploaderProps>(({
  config,
  onValueChange,
  onUploadComplete,
  onUploadProgress,
  className,
  disabled = false,
  label,
  description,
  required = false,
  value = [],
  error,
  showPreview = true,
  showMetadata = false,
  allowReorder = false,
  customValidation,
  onFileValidationError
}, ref) => {
  const sessionId = useId()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(value)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const { uploadFiles: uploadFilesHook, commitTemporaryFiles, cleanupTemporaryFiles, getFileUrl } = useFileUploader()
  const { toast } = useToast()
  const { t } = useUnifiedTranslation()

  // Use temporary upload config
  const tempConfig: FileUploadConfig = {
    ...config,
    isTemporary: true,
    tempSessionId: sessionId,
    // Don't update database during temp upload
    tableName: undefined,
    columnName: undefined,
    entityId: undefined
  }

  const validateFiles = useCallback((files: File[]) => {
    const errors: string[] = []
    
    // Check total file count
    if (config.maxFiles && uploadedFiles.length + files.length > config.maxFiles) {
      errors.push(`Maximum ${config.maxFiles} files allowed. You can upload ${config.maxFiles - uploadedFiles.length} more files.`)
    }

    files.forEach((file, index) => {
      // Validate file size
      if (config.maxSizeBytes && file.size > config.maxSizeBytes) {
        errors.push(`File "${file.name}": Size exceeds ${Math.round(config.maxSizeBytes / 1024 / 1024)}MB limit`)
        onFileValidationError?.(file, 'File size exceeds limit')
      }

      // Validate file type
      if (config.allowedTypes && config.allowedTypes.length > 0) {
        const isAllowed = config.allowedTypes.some(type => {
          if (type === '*/*') return true
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', '/'))
          }
          return file.type === type
        })
        
        if (!isAllowed) {
          errors.push(`File "${file.name}": Type ${file.type} not allowed`)
          onFileValidationError?.(file, 'File type not allowed')
        }
      }

      // Custom validation
      if (customValidation) {
        const customResult = customValidation(file)
        if (!customResult.valid) {
          errors.push(`File "${file.name}": ${customResult.error}`)
          onFileValidationError?.(file, customResult.error || 'Custom validation failed')
        }
      }
    })

    return { valid: errors.length === 0, errors }
  }, [config, uploadedFiles.length, customValidation, onFileValidationError])

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (disabled || isUploading) return

    const validation = validateFiles(files)
    if (!validation.valid) {
      toast({
        title: t('ui.file_upload.validation_failed'),
        description: validation.errors.join('\n'),
        variant: 'destructive'
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress updates with managed timer
      const { setInterval: scheduleInterval } = useTimerManager();
      const clearProgressTimer = scheduleInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.random() * 20
          return next > 90 ? 90 : next
        })
      }, 200)

      const result = await uploadFilesHook(files, tempConfig)
      
      clearProgressTimer();
      setUploadProgress(100)

      if (result.success && result.files) {
        const newFiles = [...uploadedFiles, ...result.files]
        setUploadedFiles(newFiles)
        onValueChange?.(newFiles)
        onUploadComplete?.(result.files)
        
        toast({
          title: t('ui.file_upload.upload_successful'),
          description: t('ui.file_upload.files_uploaded_successfully', { count: result.files.length })
        })
      } else {
        throw new Error(result.errors?.[0]?.error || 'Upload failed')
      }
    } catch (error) {
      logger.error('Upload error', { component: 'EnhancedFileUploader', action: 'upload' }, error as Error);
      toast({
        title: t('ui.file_upload.upload_failed'),
        description: error instanceof Error ? error.message : t('ui.file_upload.upload_error_occurred'),
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      onUploadProgress?.(0)
    }
  }, [disabled, isUploading, validateFiles, uploadFilesHook, tempConfig, uploadedFiles, onValueChange, onUploadComplete, onUploadProgress, toast])

  const removeFile = useCallback((index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onValueChange?.(newFiles)
  }, [uploadedFiles, onValueChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFilesSelected(files)
  }, [handleFilesSelected])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const { getSettingValue } = useSettingsManager();
    const sizes = getSettingValue('file_size_units_standard', ['Bytes', 'KB', 'MB', 'GB']) as string[];
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeIcon = (file: UploadedFile) => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return '🖼️'
    } else if (['pdf'].includes(extension || '')) {
      return '📄'
    } else if (['doc', 'docx'].includes(extension || '')) {
      return '📝'
    } else if (['mp4', 'avi', 'mov'].includes(extension || '')) {
      return '🎥'
    } else if (['mp3', 'wav', 'aac'].includes(extension || '')) {
      return '🎵'
    }
    return '📎'
  }

  useImperativeHandle(ref, () => ({
    commitFiles: async (finalConfig) => {
      if (uploadedFiles.length === 0) return []
      
      const result = await commitTemporaryFiles(uploadedFiles, finalConfig)
      if (result.success && result.files) {
        setUploadedFiles(result.files)
        onValueChange?.(result.files)
        return result.files
      }
      return []
    },
    clearFiles: () => {
      setUploadedFiles([])
      onValueChange?.([])
      cleanupTemporaryFiles(sessionId)
    },
    getFiles: () => uploadedFiles,
    uploadFiles: handleFilesSelected,
    removeFile,
    validateFiles
  }), [uploadedFiles, commitTemporaryFiles, cleanupTemporaryFiles, sessionId, onValueChange, handleFilesSelected, removeFile, validateFiles])

  return (
    <FormItem className={className}>
      {label && (
        <FormLabel className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
          {label}
        </FormLabel>
      )}
      
      <FormControl>
        <div className="space-y-4">
          {/* Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary",
              error && "border-destructive"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              if (!disabled) {
                const input = document.createElement('input')
                input.type = 'file'
                input.multiple = config.maxFiles !== 1
                input.accept = config.acceptString || ''
                input.onchange = (e) => {
                  const files = Array.from((e.target as HTMLInputElement).files || [])
                  handleFilesSelected(files)
                }
                input.click()
              }
            }}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {dragOver ? t('common.actions.drop_files_here', 'Drop files here') : t('common.actions.click_to_upload', 'Click to upload or drag and drop')}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              {config.acceptString || 'All file types'} • Max {formatFileSize(config.maxSizeBytes || 0)}
            </p>
            {config.maxFiles && (
              <p className="text-xs text-muted-foreground">
                {uploadedFiles.length}/{config.maxFiles} files uploaded
              </p>
            )}
            
            {isUploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t('ui.file_uploader.uploaded_files')}</h4>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-lg">{getFileTypeIcon(file)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      {showMetadata && (
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {showPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const a = document.createElement('a')
                        a.href = file.url
                        a.download = file.name
                        a.click()
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    {!disabled && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormControl>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <FormMessage className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </FormMessage>
      )}
    </FormItem>
  )
})

EnhancedFileUploader.displayName = 'EnhancedFileUploader'