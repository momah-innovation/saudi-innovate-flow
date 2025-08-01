import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Files, Eye, Download, Trash2, FileImage, FileText, Video, Music } from 'lucide-react'

interface StorageFile {
  name: string
  bucket_id: string
  is_public?: boolean
  metadata?: {
    size?: number
    mimetype?: string
  }
  created_at?: string
  updated_at?: string
}

interface StorageFileCardProps {
  file: StorageFile
  onView: (file: StorageFile) => void
  onDownload: (file: StorageFile) => void
  onDelete: (file: StorageFile) => void
}

export function StorageFileCard({ file, onView, onDownload, onDelete }: StorageFileCardProps) {
  const getFileIcon = (mimetype?: string) => {
    if (!mimetype) return Files
    
    if (mimetype.startsWith('image/')) return FileImage
    if (mimetype.startsWith('video/')) return Video
    if (mimetype.startsWith('audio/')) return Music
    if (mimetype.includes('pdf') || mimetype.includes('document')) return FileText
    
    return Files
  }

  const formatSize = (size?: number) => {
    if (!size) return 'غير معروف'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const FileIcon = getFileIcon(file.metadata?.mimetype)

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover-scale">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <FileIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <Badge variant={file.is_public ? "default" : "secondary"}>
            {file.is_public ? 'عام' : 'خاص'}
          </Badge>
        </div>

        <h3 className="font-semibold text-foreground mb-2 line-clamp-2" title={file.name}>
          {file.name}
        </h3>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex justify-between">
            <span>الحاوية</span>
            <span className="truncate ml-2">{file.bucket_id}</span>
          </div>
          <div className="flex justify-between">
            <span>الحجم</span>
            <span>{formatSize(file.metadata?.size)}</span>
          </div>
          {file.metadata?.mimetype && (
            <div className="flex justify-between">
              <span>النوع</span>
              <span className="truncate ml-2">{file.metadata.mimetype}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onView(file)} className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            عرض
          </Button>
          <Button onClick={() => onDownload(file)} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            تحميل
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(file)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}