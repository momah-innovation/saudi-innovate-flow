import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Download, ExternalLink, FileIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useTranslation } from '@/hooks/useAppTranslation'

interface FileViewDialogProps {
  file: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FileViewDialog({ file, open, onOpenChange }: FileViewDialogProps) {
  const { t, isRTL } = useTranslation()
  const { toast } = useToast()

  if (!file) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return `0 ${t('bytes')}`
    const k = 1024
    const sizes = [t('bytes'), t('kb'), t('mb'), t('gb')]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleCopyUrl = async () => {
    if (file.is_public) {
      const { data } = supabase.storage.from(file.bucket_id).getPublicUrl(file.name)
      await navigator.clipboard.writeText(data.publicUrl)
      toast({
        title: t('url_copied'),
        description: t('file_url_copied')
      })
    }
  }

  const handleDownload = async () => {
    try {
      const { data } = await supabase.storage.from(file.bucket_id).download(file.name)
      if (data) {
        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
        
        toast({
          title: t('download_started'),
          description: t('downloading_file', { filename: file.name })
        })
      }
    } catch (error) {
      toast({
        title: t('download_failed'),
        description: t('failed_to_download'),
        variant: 'destructive'
      })
    }
  }

  const getFileIcon = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return '🖼️'
    } else if (['pdf'].includes(extension)) {
      return '📄'
    } else if (['mp4', 'avi', 'mov'].includes(extension)) {
      return '🎥'
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return '🎵'
    }
    return '📁'
  }

  const getFileUrl = () => {
    if (file.is_public) {
      const { data } = supabase.storage.from(file.bucket_id).getPublicUrl(file.name)
      return data.publicUrl
    }
    return null
  }

  const isImage = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')
  }

  const isPdf = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    return extension === 'pdf'
  }

  const isVideo = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    return ['mp4', 'avi', 'mov', 'webm'].includes(extension || '')
  }

  const isAudio = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    return ['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')
  }

  const renderFilePreview = () => {
    const fileUrl = getFileUrl()
    
    if (!fileUrl) {
      return (
        <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <FileIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            {t('preview_not_available_private')}
          </p>
        </div>
      )
    }

    if (isImage()) {
      return (
        <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
          <img 
            src={fileUrl} 
            alt={file.name}
            className="max-w-full max-h-96 mx-auto rounded-lg object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="hidden">
            <FileIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">{t('failed_to_load_image')}</p>
          </div>
        </div>
      )
    }

    if (isPdf()) {
      return (
        <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
          <iframe
            src={fileUrl}
            className="w-full h-96 rounded border-0"
            title={`PDF Preview: ${file.name}`}
          />
        </div>
      )
    }

    if (isVideo()) {
      return (
        <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
          <video 
            controls 
            className="max-w-full max-h-96 mx-auto rounded-lg"
            preload="metadata"
          >
            <source src={fileUrl} type={file.metadata?.mimetype || ''} />
            {t('video_not_supported')}
          </video>
        </div>
      )
    }

    if (isAudio()) {
      return (
        <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <audio controls className="w-full max-w-md mx-auto">
            <source src={fileUrl} type={file.metadata?.mimetype || ''} />
            {t('audio_not_supported')}
          </audio>
        </div>
      )
    }

    return (
      <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <FileIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          {t('preview_not_available_type')}
        </p>
        <Button variant="outline" size="sm" onClick={() => {
          window.open(fileUrl, '_blank')
        }}>
          <ExternalLink className="w-4 h-4 mr-2" />
          {t('open_in_new_tab')}
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={isRTL ? 'font-arabic' : 'font-english'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{getFileIcon()}</span>
            {file.name}
          </DialogTitle>
          <DialogDescription>
            {t('file_details_management')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Preview */}
          {renderFilePreview()}

          {/* File Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('file_name')}</label>
                <p className="font-medium">{file.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('bucket')}</label>
                <p className="font-medium">{file.bucket_id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('visibility')}</label>
                <Badge variant={file.is_public ? "default" : "secondary"}>
                  {file.is_public ? t('public') : t('private')}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('file_size')}</label>
                <p className="font-medium">
                  {file.metadata?.size ? formatFileSize(file.metadata.size) : t('unknown')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('last_modified')}</label>
                <p className="font-medium">
                  {file.updated_at ? new Date(file.updated_at).toLocaleDateString() : t('unknown')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('content_type')}</label>
                <p className="font-medium">
                  {file.metadata?.mimetype || t('unknown')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button onClick={handleDownload} className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" />
              {t('download')}
            </Button>
            
            {file.is_public && (
              <Button variant="outline" onClick={handleCopyUrl} className="flex-1 sm:flex-none">
                <Copy className="w-4 h-4 mr-2" />
                {t('copy_url')}
              </Button>
            )}

            {file.is_public && (
              <Button variant="outline" onClick={() => {
                const { data } = supabase.storage.from(file.bucket_id).getPublicUrl(file.name)
                window.open(data.publicUrl, '_blank')
              }} className="flex-1 sm:flex-none">
                <ExternalLink className="w-4 h-4 mr-2" />
                {t('open')}
              </Button>
            )}
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}