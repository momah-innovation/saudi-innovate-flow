import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, Eye, Settings, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

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
  const formatSize = (size?: number) => {
    if (!size) return '0 B'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover-scale">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {bucket.name}
          </CardTitle>
          <Badge variant={bucket.public ? "default" : "secondary"}>
            {bucket.public ? 'عام' : 'خاص'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-muted-foreground mb-4">
          <div className="flex justify-between">
            <span>المعرف</span>
            <span className="font-mono text-xs truncate ml-2">{bucket.id}</span>
          </div>
          <div className="flex justify-between">
            <span>عدد الملفات</span>
            <span>{bucket.file_count?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex justify-between">
            <span>الحجم الإجمالي</span>
            <span>{formatSize(bucket.total_size)}</span>
          </div>
          <div className="flex justify-between">
            <span>تاريخ الإنشاء</span>
            <span>{format(new Date(bucket.created_at), 'yyyy-MM-dd')}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onView(bucket)} className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            عرض
          </Button>
          <Button variant="outline" onClick={() => onSettings(bucket)} className="flex-1">
            <Settings className="w-4 h-4 mr-2" />
            إعدادات
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(bucket)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}