import React, { forwardRef, useImperativeHandle, useState, useId } from 'react'
import { FileUploader, FileUploadConfig } from '@/components/ui/file-uploader'
import { UploadedFile, useFileUploader } from '@/hooks/useFileUploader'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'

export interface FileUploadFieldProps {
  config: FileUploadConfig
  onValueChange?: (files: UploadedFile[]) => void
  onUploadComplete?: (files: UploadedFile[]) => void
  className?: string
  disabled?: boolean
  label?: string
  description?: string
  required?: boolean
  value?: UploadedFile[]
  error?: string
}

export interface FileUploadFieldRef {
  commitFiles: (finalConfig: Omit<FileUploadConfig, 'isTemporary' | 'tempSessionId'>) => Promise<UploadedFile[]>
  clearFiles: () => void
  getFiles: () => UploadedFile[]
}

export const FileUploadField = forwardRef<FileUploadFieldRef, FileUploadFieldProps>(({
  config,
  onValueChange,
  onUploadComplete,
  className,
  disabled = false,
  label,
  description,
  required = false,
  value = [],
  error
}, ref) => {
  const sessionId = useId()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(value)
  const { commitTemporaryFiles, cleanupTemporaryFiles } = useFileUploader()

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

  const handleUploadComplete = (files: UploadedFile[]) => {
    setUploadedFiles(files)
    onValueChange?.(files)
    onUploadComplete?.(files)
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
    getFiles: () => uploadedFiles
  }), [uploadedFiles, commitTemporaryFiles, cleanupTemporaryFiles, sessionId, onValueChange])

  return (
    <FormItem className={className}>
      {label && (
        <FormLabel className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
          {label}
        </FormLabel>
      )}
      <FormControl>
        <FileUploader
          config={tempConfig}
          onUploadComplete={handleUploadComplete}
          disabled={disabled}
          showPreview={true}
          multiple={config.maxFiles !== 1}
          className="w-full"
        />
      </FormControl>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  )
})

FileUploadField.displayName = 'FileUploadField'