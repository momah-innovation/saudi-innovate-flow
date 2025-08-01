import React, { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Upload, 
  X, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface UploadedFile {
  url: string
  path: string
  name: string
  size: number
}

interface FileUploadError {
  file: string
  error: string
}

interface FileUploaderProps {
  config: FileUploadConfig
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (errors: FileUploadError[]) => void
  className?: string
  disabled?: boolean
  showPreview?: boolean
  multiple?: boolean
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return Image
  if (fileType.startsWith('video/')) return Video
  if (fileType.startsWith('audio/')) return Music
  if (fileType.includes('pdf') || fileType.includes('document')) return FileText
  return File
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  config,
  onUploadComplete,
  onUploadError,
  className,
  disabled = false,
  showPreview = true,
  multiple = false
}) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploadErrors, setUploadErrors] = useState<FileUploadError[]>([])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (!multiple && files.length > 1) {
      toast({
        title: 'Multiple files not allowed',
        description: 'Please select only one file',
        variant: 'destructive'
      })
      return
    }

    if (config.maxFiles && files.length > config.maxFiles) {
      toast({
        title: 'Too many files',
        description: `Maximum ${config.maxFiles} files allowed`,
        variant: 'destructive'
      })
      return
    }

    // Validate files
    const validFiles: File[] = []
    const errors: FileUploadError[] = []

    files.forEach(file => {
      // Check file size
      if (config.maxSizeBytes && file.size > config.maxSizeBytes) {
        errors.push({
          file: file.name,
          error: `File size exceeds ${formatFileSize(config.maxSizeBytes)} limit`
        })
        return
      }

      // Check file type
      if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
        errors.push({
          file: file.name,
          error: `File type ${file.type} not allowed`
        })
        return
      }

      validFiles.push(file)
    })

    if (errors.length > 0) {
      setUploadErrors(errors)
      onUploadError?.(errors)
      toast({
        title: 'File validation failed',
        description: `${errors.length} file(s) failed validation`,
        variant: 'destructive'
      })
    }

    setSelectedFiles(validFiles)
    setUploadErrors([])
  }, [config, multiple, onUploadError, toast])

  const handleUpload = useCallback(async () => {
    if (!user || selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

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
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const { data, error } = await supabase.functions.invoke('secure-upload', {
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (error) {
        throw new Error(error.message || 'Upload failed')
      }

      if (!data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadedFiles(data.files)
      onUploadComplete?.(data.files)
      
      toast({
        title: 'Upload successful',
        description: `${data.files.length} file(s) uploaded successfully`
      })

      // Reset form
      setSelectedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive'
      })

      setUploadErrors([{ file: 'Upload', error: errorMessage }])
      onUploadError?.([{ file: 'Upload', error: errorMessage }])
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [user, selectedFiles, config, onUploadComplete, onUploadError, toast])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    
    if (fileInputRef.current) {
      const input = fileInputRef.current
      const dataTransfer = new DataTransfer()
      files.forEach(file => dataTransfer.items.add(file))
      input.files = dataTransfer.files
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card 
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          disabled ? 'border-muted bg-muted/50 cursor-not-allowed' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className="w-10 h-10 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">
            {selectedFiles.length > 0 ? 'Add more files' : 'Upload files'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drop files here or click to browse
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            {config.maxFiles && (
              <p>Maximum {config.maxFiles} file(s)</p>
            )}
            {config.maxSizeBytes && (
              <p>Maximum size: {formatFileSize(config.maxSizeBytes)} per file</p>
            )}
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={config.acceptString}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Selected Files</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => {
                const FileIcon = getFileIcon(file.type)
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
            
            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleUpload}
                disabled={isUploading || disabled || selectedFiles.length === 0}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {selectedFiles.length} file(s)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h4 className="font-semibold text-destructive">Upload Errors</h4>
            </div>
            <div className="space-y-2">
              {uploadErrors.map((error, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{error.file}:</span>{' '}
                  <span className="text-destructive">{error.error}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Successfully Uploaded</h4>
            </div>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Uploaded
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}