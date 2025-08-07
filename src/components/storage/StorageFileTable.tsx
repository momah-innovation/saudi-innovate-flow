import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Download, Trash2, FileImage, FileText, Video, Music, Files } from 'lucide-react'
import { format } from 'date-fns'
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

interface StorageFileTableProps {
  files: StorageFile[]
  onView: (file: StorageFile) => void
  onDownload: (file: StorageFile) => void
  onDelete: (file: StorageFile) => void
}

export function StorageFileTable({ files, onView, onDownload, onDelete }: StorageFileTableProps) {
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

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`border rounded-lg ${isRTL ? 'font-arabic' : 'font-english'}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>{t('file_name')}</TableHead>
            <TableHead>{t('bucket')}</TableHead>
            <TableHead>{t('size')}</TableHead>
            <TableHead>{t('type')}</TableHead>
            <TableHead>{t('visibility')}</TableHead>
            <TableHead>{t('created_date')}</TableHead>
            <TableHead className={isRTL ? "text-left" : "text-right"}>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file.metadata?.mimetype)
            return (
              <TableRow key={`${file.bucket_id}-${file.name}-${index}`}>
                <TableCell>
                  <FileIcon className="w-4 h-4 text-muted-foreground" />
                </TableCell>
                <TableCell className="font-medium max-w-xs truncate" title={file.name}>
                  {file.name}
                </TableCell>
                <TableCell>{file.bucket_id}</TableCell>
                <TableCell>{formatSize(file.metadata?.size)}</TableCell>
                <TableCell className="max-w-xs truncate" title={file.metadata?.mimetype}>
                  {file.metadata?.mimetype || t('unspecified')}
                </TableCell>
                <TableCell>
                  <Badge variant={file.is_public ? "default" : "secondary"}>
                    {file.is_public ? t('public') : t('private')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {file.created_at ? format(new Date(file.created_at), 'yyyy-MM-dd') : t('unspecified')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onView(file)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDownload(file)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(file)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}