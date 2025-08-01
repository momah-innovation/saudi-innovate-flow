import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  File, 
  Image, 
  Video,
  FileText,
  Download,
  Eye,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDirection } from '@/components/ui/direction-provider';

interface StorageFile {
  id: string;
  name: string;
  bucket_id: string;
  owner: string;
  created_at: string;
  updated_at: string;
  last_accessed_at?: string;
  metadata?: {
    size?: number;
    mimetype?: string;
    cacheControl?: string;
  };
}

interface StorageFileCardProps {
  file: StorageFile;
  onView: (file: StorageFile) => void;
  onDownload: (file: StorageFile) => void;
  onDelete: (file: StorageFile) => void;
  viewMode?: 'cards' | 'list' | 'grid';
}

export const StorageFileCard = ({ 
  file, 
  onView, 
  onDownload, 
  onDelete,
  viewMode = 'cards' 
}: StorageFileCardProps) => {
  const { isRTL } = useDirection();

  const getFileIcon = (filename: string, mimetype?: string) => {
    if (mimetype?.startsWith('image/')) return Image;
    if (mimetype?.startsWith('video/')) return Video;
    if (mimetype?.includes('pdf') || mimetype?.includes('document')) return FileText;
    return File;
  };

  const getFileTypeColor = (mimetype?: string) => {
    if (mimetype?.startsWith('image/')) return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
    if (mimetype?.startsWith('video/')) return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
    if (mimetype?.includes('pdf')) return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
    if (mimetype?.includes('document')) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
    return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' }) : 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const FileIcon = getFileIcon(file.name, file.metadata?.mimetype);

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <FileIcon className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-medium truncate text-foreground">{file.name}</h3>
                <Badge className={getFileTypeColor(file.metadata?.mimetype)}>
                  {file.metadata?.mimetype?.split('/')[0] || 'file'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{formatFileSize(file.metadata?.size)}</span>
                <span>{formatDate(file.created_at)}</span>
                <span>{file.bucket_id}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(file)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDownload(file)}>
                <Download className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(file)}>
                    <Eye className="w-4 h-4 mr-2" />
                    {isRTL ? 'عرض' : 'View'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload(file)}>
                    <Download className="w-4 h-4 mr-2" />
                    {isRTL ? 'تحميل' : 'Download'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(file)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isRTL ? 'حذف' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover-scale overflow-hidden">
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <FileIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(file)}>
                <Eye className="w-4 h-4 mr-2" />
                {isRTL ? 'عرض' : 'View'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(file)}>
                <Download className="w-4 h-4 mr-2" />
                {isRTL ? 'تحميل' : 'Download'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(file)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                {isRTL ? 'حذف' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              {file.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge className={getFileTypeColor(file.metadata?.mimetype)}>
                {file.metadata?.mimetype?.split('/')[0] || 'file'}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>{isRTL ? 'الحجم' : 'Size'}</span>
              <span>{formatFileSize(file.metadata?.size)}</span>
            </div>
            <div className="flex justify-between">
              <span>{isRTL ? 'تاريخ الإنشاء' : 'Created'}</span>
              <span>{formatDate(file.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span>{isRTL ? 'الحاوية' : 'Bucket'}</span>
              <span className="truncate max-w-[100px]">{file.bucket_id}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => onView(file)} className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              {isRTL ? 'عرض' : 'View'}
            </Button>
            <Button onClick={() => onDownload(file)} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              {isRTL ? 'تحميل' : 'Download'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};