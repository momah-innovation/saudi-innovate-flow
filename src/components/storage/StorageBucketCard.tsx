import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, Eye, Settings, Trash2, MoreVertical, FolderOpen } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { useUnifiedTranslation } from '@/hooks/useAppTranslation';

interface StorageBucket {
  id: string
  name: string
  public: boolean
  created_at: string
  file_count?: number
  total_size?: number
}

interface StorageBucketCardProps {
  bucket: StorageBucket
  onView: (bucket: StorageBucket) => void
  onSettings: (bucket: StorageBucket) => void
  onDelete: (bucket: StorageBucket) => void
}

export function StorageBucketCard({ bucket, onView, onSettings, onDelete }: StorageBucketCardProps) {
  const { t, isRTL } = useUnifiedTranslation();
  const formatSize = (size?: number) => {
    if (!size) return '0 B'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-english'}>
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/20 bg-gradient-to-br from-background to-muted/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-sm">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-background shadow-sm flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${bucket.public ? 'bg-success' : 'bg-warning'}`} />
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(bucket)}>
                <Eye className="w-4 h-4 mr-2" />
                {t('view')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSettings(bucket)}>
                <Settings className="w-4 h-4 mr-2" />
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(bucket)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 mb-3">
          <h3 className="font-semibold text-foreground text-sm line-clamp-1" title={bucket.name}>
            {bucket.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <Badge variant={bucket.public ? "default" : "secondary"} className="text-xs px-2 py-0.5">
              {bucket.public ? t('public') : t('private')}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {bucket.file_count?.toLocaleString() || '0'} {t('files')}
            </span>
          </div>
        </div>
        
        <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('id')}</span>
            <span className="truncate ml-2 bg-muted/50 px-2 py-0.5 rounded text-xs font-mono">
              {bucket.id}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('size')}</span>
            <span className="font-medium text-foreground">
              {formatSize(bucket.total_size)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('created_date')}</span>
            <span>
              {format(new Date(bucket.created_at), 'yyyy-MM-dd')}
            </span>
          </div>
        </div>

        <div className="flex gap-1.5">
          <Button variant="outline" onClick={() => onView(bucket)} className="flex-1 h-8 text-xs">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            {t('view')}
          </Button>
          <Button variant="outline" onClick={() => onSettings(bucket)} className="flex-1 h-8 text-xs">
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            {t('settings')}
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}