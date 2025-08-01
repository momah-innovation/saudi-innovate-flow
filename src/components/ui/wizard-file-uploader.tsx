import React, { useRef, useEffect } from 'react'
import { FileUploadField, FileUploadFieldRef } from '@/components/ui/file-upload-field'
import { FileUploadConfig } from '@/components/ui/file-uploader'
import { UploadedFile } from '@/hooks/useFileUploader'

export interface WizardFileUploaderProps {
  config: Omit<FileUploadConfig, 'isTemporary' | 'tempSessionId'>
  onFilesChange?: (files: UploadedFile[]) => void
  className?: string
  disabled?: boolean
  label?: string
  description?: string
  required?: boolean
}

export interface WizardFileUploaderRef {
  commitFiles: (entityId: string) => Promise<UploadedFile[]>
  clearFiles: () => void
  getFiles: () => UploadedFile[]
}

export const WizardFileUploader = React.forwardRef<WizardFileUploaderRef, WizardFileUploaderProps>(({
  config,
  onFilesChange,
  className,
  disabled = false,
  label,
  description,
  required = false
}, ref) => {
  const fileUploadRef = useRef<FileUploadFieldRef>(null)

  React.useImperativeHandle(ref, () => ({
    commitFiles: async (entityId: string) => {
      if (!fileUploadRef.current) return []
      
      const finalConfig = {
        ...config,
        entityId
      }
      
      return await fileUploadRef.current.commitFiles(finalConfig)
    },
    clearFiles: () => {
      fileUploadRef.current?.clearFiles()
    },
    getFiles: () => {
      return fileUploadRef.current?.getFiles() || []
    }
  }), [config])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      fileUploadRef.current?.clearFiles()
    }
  }, [])

  return (
    <FileUploadField
      ref={fileUploadRef}
      config={config}
      onValueChange={onFilesChange}
      className={className}
      disabled={disabled}
      label={label}
      description={description}
      required={required}
    />
  )
})

WizardFileUploader.displayName = 'WizardFileUploader'