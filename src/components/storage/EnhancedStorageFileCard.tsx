import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileActionsDropdown } from './FileActionsDropdown';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import {
  FileIcon,
  FileImage,
  FileText,
  FileVideo,
  Music,
  Calendar,
  HardDrive
} from 'lucide-react';
import { getPublicStorageUrl } from '@/utils/storageUtils';

interface EnhancedStorageFileCardProps {
  file: any;
  onView: (file: any) => void;
  onDownload: (file: any) => void;
  onDelete: (file: any) => void;
  onMove?: (file: any) => void;
  onRename?: (file: any) => void;
  onShare?: (file: any) => void;
  onShowInfo?: (file: any) => void;
  isSelected?: boolean;
  onSelectionChange?: (file: any, selected: boolean) => void;
  showSelection?: boolean;
}

export function EnhancedStorageFileCard({
  file,
  onView,
  onDownload,
  onDelete,
  onMove,
  onRename,
  onShare,
  onShowInfo,
  isSelected = false,
  onSelectionChange,
  showSelection = false
}: EnhancedStorageFileCardProps) {
  const { t, isRTL } = useUnifiedTranslation();
  const [imageError, setImageError] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return `0 ${t('bytes')}`;
    const k = 1024;
    const sizes = [t('bytes'), t('kb'), t('mb'), t('gb')];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      t('date_locale'), 
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    );
  };

  const getFileIcon = () => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return FileImage;
    } else if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
      return FileText;
    } else if (['mp4', 'avi', 'mov', 'webm', 'mkv'].includes(extension || '')) {
      return FileVideo;
    } else if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension || '')) {
      return Music;
    }
    return FileIcon;
  };

  const isImage = () => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  };

  const getImageUrl = () => {
    if (file.is_public && isImage()) {
      // Construct the public URL for images
      return getPublicStorageUrl(file.bucket_id, file.name);
    }
    return null;
  };

  const handleSelectionChange = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(file, checked);
    }
  };

  const Icon = getFileIcon();
  const imageUrl = getImageUrl();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-english'}>
    <Card className={`group hover:shadow-md transition-all duration-200 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        {showSelection && (
          <div className="flex items-start justify-between mb-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleSelectionChange}
              className="mt-1"
            />
            <FileActionsDropdown
              file={file}
              onView={onView}
              onDownload={onDownload}
              onDelete={onDelete}
              onMove={onMove}
              onRename={onRename}
              onShare={onShare}
              onShowInfo={onShowInfo}
            />
          </div>
        )}

        {/* File Preview */}
        <div className="mb-4">
          {imageUrl && !imageError ? (
            <div 
              className="w-full h-32 bg-muted rounded-lg overflow-hidden cursor-pointer"
              onClick={() => onView(file)}
            >
              <img
                src={imageUrl}
                alt={file.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div 
              className="w-full h-32 bg-muted rounded-lg flex items-center justify-center cursor-pointer group-hover:bg-muted/80 transition-colors"
              onClick={() => onView(file)}
            >
              <Icon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="space-y-2">
          <div>
            <h3 
              className="font-medium text-sm leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors"
              onClick={() => onView(file)}
              title={file.name}
            >
              {file.name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant={file.is_public ? "default" : "secondary"} className="text-xs">
              {file.is_public ? t('public') : t('private')}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {file.bucket_id}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {file.metadata?.size ? formatFileSize(file.metadata.size) : t('unknown')}
            </div>
            {file.updated_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(file.updated_at)}
              </div>
            )}
          </div>
        </div>

        {/* Actions (only show if selection is disabled) */}
        {!showSelection && (
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex justify-end">
              <FileActionsDropdown
                file={file}
                onView={onView}
                onDownload={onDownload}
                onDelete={onDelete}
                onMove={onMove}
                onRename={onRename}
                onShare={onShare}
                onShowInfo={onShowInfo}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
}