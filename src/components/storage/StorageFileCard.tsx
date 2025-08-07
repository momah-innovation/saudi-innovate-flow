import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Files, Eye, Download, Trash2, FileImage, FileText, Video, Music, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

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
  const { t, isRTL } = useUnifiedTranslation();
  const getFileIcon = (mimetype?: string) => {
    if (!mimetype) return Files
    
    if (mimetype.startsWith('image/')) return FileImage
    if (mimetype.startsWith('video/')) return Video
    if (mimetype.startsWith('audio/')) return Music
    if (mimetype.includes('pdf') || mimetype.includes('document')) return FileText
    
    return Files
  }

  const formatSize = (size?: number) => {
    if (!size) return t('unknown')
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const FileIcon = getFileIcon(file.metadata?.mimetype)

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-english'}>
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/20 bg-gradient-to-br from-background to-muted/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-sm">
              <FileIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-background shadow-sm flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${file.is_public ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(file)}>
                <Eye className="w-4 h-4 mr-2" />
                {t('view')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(file)}>
                <Download className="w-4 h-4 mr-2" />
                {t('download')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(file)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 mb-3">
          <h3 className="font-semibold text-foreground text-sm line-clamp-2 leading-tight" title={file.name}>
            {file.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <Badge variant={file.is_public ? "default" : "secondary"} className="text-xs px-2 py-0.5">
              {file.is_public ? t('public') : t('private')}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {formatSize(file.metadata?.size)}
            </span>
          </div>
        </div>
        
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('bucket')}</span>
            <span className="truncate ml-2 bg-muted/50 px-2 py-0.5 rounded text-xs font-mono">
              {file.bucket_id}
            </span>
          </div>
          {file.metadata?.mimetype && (
            <div className="flex justify-between items-center">
              <span className="font-medium">{t('type')}</span>
              <span className="truncate ml-2 text-xs">
                {file.metadata.mimetype.split('/')[1]?.toUpperCase() || t('unspecified')}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-1.5 mt-4">
          <Button variant="outline" onClick={() => onView(file)} className="flex-1 h-8 text-xs">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            {t('view')}
          </Button>
          <Button variant="outline" onClick={() => onDownload(file)} className="flex-1 h-8 text-xs">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {t('download')}
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}