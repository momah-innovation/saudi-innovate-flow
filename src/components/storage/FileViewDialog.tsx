import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Download, ExternalLink, FileIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface FileViewDialogProps {
  file: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FileViewDialog({ file, open, onOpenChange }: FileViewDialogProps) {
  const { toast } = useToast()

  if (!file) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleCopyUrl = async () => {
    if (file.is_public) {
      const { data } = supabase.storage.from(file.bucket_id).getPublicUrl(file.name)
      await navigator.clipboard.writeText(data.publicUrl)
      toast({
        title: "URL Copied",
        description: "File URL copied to clipboard"
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
          title: "Download Started",
          description: `Downloading ${file.name}`
        })
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download file",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{getFileIcon()}</span>
            {file.name}
          </DialogTitle>
          <DialogDescription>
            File details and management options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Preview */}
          <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <FileIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              File preview not available
            </p>
          </div>

          {/* File Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">File Name</label>
                <p className="font-medium">{file.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bucket</label>
                <p className="font-medium">{file.bucket_id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Visibility</label>
                <Badge variant={file.is_public ? "default" : "secondary"}>
                  {file.is_public ? "Public" : "Private"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">File Size</label>
                <p className="font-medium">
                  {file.metadata?.size ? formatFileSize(file.metadata.size) : "Unknown"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                <p className="font-medium">
                  {file.updated_at ? new Date(file.updated_at).toLocaleDateString() : "Unknown"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Content Type</label>
                <p className="font-medium">
                  {file.metadata?.mimetype || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button onClick={handleDownload} className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            {file.is_public && (
              <Button variant="outline" onClick={handleCopyUrl} className="flex-1 sm:flex-none">
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </Button>
            )}

            {file.is_public && (
              <Button variant="outline" onClick={() => {
                const { data } = supabase.storage.from(file.bucket_id).getPublicUrl(file.name)
                window.open(data.publicUrl, '_blank')
              }} className="flex-1 sm:flex-none">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}