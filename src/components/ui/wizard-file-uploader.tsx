import React, { forwardRef, useImperativeHandle, useState, useId } from 'react'
import { FileUploadConfig, useFileUploader, UploadedFile } from '@/hooks/useFileUploader'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Upload, X, FileText, Image, FileIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logger } from '@/utils/logger'

export interface WizardFileUploaderProps {
  config: Omit<FileUploadConfig, 'isTemporary' | 'tempSessionId'>
  onUploadComplete?: (files: UploadedFile[]) => void
  onCancel?: () => void
  className?: string
  disabled?: boolean
  title?: string
  description?: string
}

export interface WizardFileUploaderRef {
  commitFiles: () => Promise<UploadedFile[]>
  cancelUpload: () => void
  getFiles: () => UploadedFile[]
}

export const WizardFileUploader = forwardRef<WizardFileUploaderRef, WizardFileUploaderProps>(({
  config,
  onUploadComplete,
  onCancel,
  className,
  disabled = false,
  title = "File Upload Wizard",
  description = "Upload your files in a guided process"
}, ref) => {
  const sessionId = useId()
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'complete'>('upload')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isCommitting, setIsCommitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  
  const { uploadFiles, commitTemporaryFiles, cleanupTemporaryFiles } = useFileUploader()
  const { toast } = useToast()

  const tempConfig: FileUploadConfig = {
    ...config,
    isTemporary: true,
    tempSessionId: sessionId
  }

  useImperativeHandle(ref, () => ({
    commitFiles: handleCommit,
    cancelUpload: handleCancel,
    getFiles: () => uploadedFiles
  }))

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      handleFilesUpload(files)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    if (files.length > 0) {
      handleFilesUpload(files)
    }
  }

  const handleFilesUpload = async (files: File[]) => {
    if (disabled || isUploading) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const result = await uploadFiles(files, tempConfig)
      
      if (result.success && result.files) {
        setUploadedFiles(result.files)
        setCurrentStep('review')
        
        toast({
          title: "Files uploaded successfully",
          description: `${result.files.length} file(s) uploaded to temporary storage`
        })
      } else {
        throw new Error(result.errors?.[0]?.error || 'Upload failed')
      }
    } catch (error) {
      logger.error('File upload error', { component: 'WizardFileUploader', action: 'uploadFiles' }, error as Error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(100)
    }
  }

  const handleCommit = async (): Promise<UploadedFile[]> => {
    if (uploadedFiles.length === 0) return []

    setIsCommitting(true)

    try {
      const result = await commitTemporaryFiles(uploadedFiles, config)
      
      if (result.success && result.files) {
        setCurrentStep('complete')
        onUploadComplete?.(result.files)
        
        toast({
          title: "Files committed successfully",
          description: `${result.files.length} file(s) moved to permanent storage`
        })
        
        return result.files
      } else {
        throw new Error(result.errors?.[0]?.error || 'Commit failed')
      }
    } catch (error) {
      logger.error('File commit error', { component: 'WizardFileUploader', action: 'commitFiles' }, error as Error)
      toast({
        title: "Commit failed",
        description: error instanceof Error ? error.message : "Failed to commit files",
        variant: "destructive"
      })
      return []
    } finally {
      setIsCommitting(false)
    }
  }

  const handleCancel = async () => {
    if (uploadedFiles.length > 0) {
      await cleanupTemporaryFiles(sessionId)
    }
    setUploadedFiles([])
    setCurrentStep('upload')
    onCancel?.()
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="w-4 h-4" />
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) {
      return <FileText className="w-4 h-4" />
    }
    return <FileIcon className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs",
            currentStep === 'upload' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            1. Upload
          </div>
          <div className="h-px bg-border flex-1" />
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs",
            currentStep === 'review' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            2. Review
          </div>
          <div className="h-px bg-border flex-1" />
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs",
            currentStep === 'complete' ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
          )}>
            3. Complete
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 'upload' && (
          <div className="space-y-4">
            <div
              className={cn(
                "border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors",
                dragOver && "border-primary bg-primary/5",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onDragOver={(e) => {
                e.preventDefault()
                if (!disabled) setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Drag and drop files here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
                <div className="text-xs text-muted-foreground">
                  Max {config.maxFiles} files, {formatFileSize(config.maxSizeBytes || 0)} each
                </div>
              </div>
              <input
                type="file"
                multiple
                accept={config.acceptString}
                onChange={handleFileSelect}
                disabled={disabled || isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {currentStep === 'review' && uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Review uploaded files</h3>
              <Badge variant="outline">
                {uploadedFiles.length} file(s)
              </Badge>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isCommitting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel} disabled={isCommitting}>
                Cancel
              </Button>
              <Button 
                onClick={handleCommit} 
                disabled={isCommitting || uploadedFiles.length === 0}
                className="flex-1"
              >
                {isCommitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Committing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Commit Files
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Upload Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your files have been successfully uploaded and saved.
              </p>
            </div>
            <Button variant="outline" onClick={() => setCurrentStep('upload')}>
              Upload More Files
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

WizardFileUploader.displayName = 'WizardFileUploader'