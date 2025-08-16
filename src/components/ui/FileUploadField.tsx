import { useSettingsManager } from '@/hooks/useSettingsManager';
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface FileUploadFieldProps {
  value?: string[];
  onChange: (files: string[]) => void;
  bucketName: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  placeholder?: string;
  className?: string;
}

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

export function FileUploadField({
  value = [],
  onChange,
  bucketName,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  placeholder,
  className
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const { getSettingValue } = useSettingsManager();
    const sizes = getSettingValue('file_size_display_units', ['Bytes', 'KB', 'MB', 'GB']) as string[];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;
    
    // Check file limits
    if (value.length + files.length > maxFiles) {
      toast({
        title: t('ui.file_upload.max_files_exceeded'),
        description: t('ui.file_upload.max_files_description', { maxFiles }),
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast({
            title: t('ui.file_upload.file_too_large'),
            description: t('ui.file_upload.file_size_limit', { maxSize: maxFileSize }),
            variant: 'destructive',
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file);

        if (error) {
          logger.error('Upload error', { component: 'FileUploadField', action: 'uploadFile' }, error as Error);
          toast({
            title: 'خطأ في الرفع',
            description: `فشل في رفع ${file.name}`,
            variant: 'destructive',
          });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);

        uploadedUrls.push(urlData.publicUrl);
      }

      // Update value with new files
      onChange([...value, ...uploadedUrls]);
      
      toast({
        title: 'تم الرفع بنجاح',
        description: `تم رفع ${uploadedUrls.length} ملف`,
      });

    } catch (error) {
      logger.error('Upload error', { component: 'FileUploadField', action: 'handleUpload' }, error as Error);
      toast({
        title: 'خطأ في الرفع',
        description: 'حدث خطأ أثناء رفع الملفات',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    // Use immutable array filtering instead of splice
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed p-4 sm:p-6 text-center transition-colors cursor-pointer touch-manipulation',
          'min-h-[120px] sm:min-h-[140px] flex flex-col justify-center',
          dragActive && 'border-primary bg-primary/5',
          uploading && 'pointer-events-none opacity-50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = acceptedTypes.join(',');
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files) {
              handleFileUpload(target.files);
            }
          };
          input.click();
        }}
      >
        <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
        <p className={cn(
          "text-sm text-muted-foreground mb-2 px-2",
          isRTL ? "text-right" : "text-left"
        )}>{placeholder || t('ui.file_upload.drag_files_here')}</p>
        <p className={cn(
          "text-xs text-muted-foreground px-2",
          isRTL ? "text-right" : "text-left"
        )}>
          {t('ui.file_upload.max_limit_description', { maxFiles, maxSize: maxFileSize })}
        </p>
        {uploading && (
          <div className="mt-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
          </div>
        )}
      </Card>

      {/* Uploaded Files List */}
      {value.length > 0 && (
        <div className="space-y-2">
          <h4 className={cn(
            "text-sm font-medium",
            isRTL ? "text-right" : "text-left"
          )}>{t('ui.file_upload.uploaded_files', { count: value.length })}</h4>
          <div className="grid gap-2">
            {value.map((fileUrl, index) => {
              const filename = fileUrl.split('/').pop() || 'ملف';
              const IconComponent = getFileIcon('');
              
              return (
                <Card key={index} className="p-2 sm:p-3">
                  <div className={cn(
                    "flex items-center justify-between gap-2",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className={cn(
                      "flex items-center gap-2 flex-1 min-w-0",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">{filename}</span>
                      <Badge variant="secondary" className="text-xs">
                        {t('ui.file_upload.uploaded')}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0 touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px]"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}