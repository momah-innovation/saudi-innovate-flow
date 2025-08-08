import { useState } from 'react';
import { FixedStorageUploadTabProps, StorageFile } from '@/types/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { VersionedFileUploader } from '@/components/ui/versioned-file-uploader';
import { useFileUploader } from '@/hooks/useFileUploader';
import { useUploaderSettingsContext } from '@/contexts/UploaderSettingsContext';
import { RTLAware } from '@/components/ui/rtl-aware';
import { Upload, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

export function FixedStorageUploadTab({ onFilesUploaded }: FixedStorageUploadTabProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<StorageFile[]>([]);
  
  const { 
    uploadConfigs = {}, 
    globalSettings = {
      autoCleanupEnabled: false,
      defaultCleanupDays: 7,
      maxConcurrentUploads: 3,
      chunkSizeMB: 5,
      retryAttempts: 3,
      compressionEnabled: false,
      thumbnailGeneration: false
    }, 
    loading: settingsLoading 
  } = useUploaderSettingsContext();

  const { uploadFiles, isUploading } = useFileUploader();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, config: any) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const uploadConfig = {
      uploadType: config.uploadType || 'temp-uploads-private',
      maxFiles: config.maxFiles,
      maxSizeBytes: config.maxSizeBytes,
      allowedTypes: config.allowedTypes,
      isTemporary: false
    };

    const result = await uploadFiles(files, uploadConfig);
    
    if (result.success) {
      // Files uploaded successfully
      setUploadedFiles(prev => [...prev, ...(result.files as unknown as StorageFile[] || [])]);
      onFilesUploaded(); // Refresh parent data
      toast({
        title: t('storage.upload_successful'),
        description: t('storage.files_uploaded_successfully', { count: result.files?.length || 0 })
      });
    } else {
      logger.error('Upload errors occurred', { component: 'FixedStorageUploadTab', action: 'handleFileUpload' });
      result.errors?.forEach(error => {
        toast({
          title: t('storage.upload_failed'),
          description: error.error,
          variant: 'destructive'
        });
      });
    }

    // Reset the input
    event.target.value = '';
  };

  if (settingsLoading) {
    return (
      <RTLAware className="space-y-6">
        <div className="text-center">
          <p>{t('storage.loading_settings')}...</p>
        </div>
      </RTLAware>
    );
  }

  return (
    <RTLAware className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('storage.advanced_file_upload')}</h3>
        <p className="text-muted-foreground">{t('storage.upload_description')}</p>
      </div>
      
      {/* Global Upload Settings Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('storage.global_settings')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{t('storage.auto_cleanup')}:</span> {globalSettings.autoCleanupEnabled ? t('common.yes') : t('common.no')}
            </div>
            <div>
              <span className="font-medium">{t('storage.cleanup_days')}:</span> {globalSettings.defaultCleanupDays} {t('common.days')}
            </div>
            <div>
              <span className="font-medium">{t('storage.concurrent_uploads')}:</span> {globalSettings.maxConcurrentUploads}
            </div>
            <div>
              <span className="font-medium">{t('storage.chunk_size')}:</span> {globalSettings.chunkSizeMB}MB
            </div>
            <div>
              <span className="font-medium">{t('storage.retry_attempts')}:</span> {globalSettings.retryAttempts}
            </div>
            <div>
              <span className="font-medium">{t('storage.compression')}:</span> {globalSettings.compressionEnabled ? t('common.enabled') : t('common.disabled')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced File Uploaders for Each Configuration */}
      <div className="grid gap-6">
        {Object.entries(uploadConfigs).length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {t('storage.general_uploader')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e, {
                    uploadType: 'temp-uploads-private',
                    maxFiles: 5,
                    maxSizeBytes: 10 * 1024 * 1024,
                    allowedTypes: ['image/*', 'application/pdf', '.doc', '.docx', '.txt']
                  })}
                  className="hidden"
                  id="file-upload-general"
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload-general"
                  className={`cursor-pointer flex flex-col items-center gap-4 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">
                      {isUploading ? 'Uploading...' : 'Click to upload files'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Or drag and drop files here
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        ) : (
          Object.entries(uploadConfigs).map(([key, config]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  {config.uploadType || key} {t('storage.uploader')}
                </CardTitle>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">{t('storage.max_size')}:</span> {(config.maxSizeBytes / 1024 / 1024).toFixed(1)}MB
                  </div>
                  <div>
                    <span className="font-medium">{t('storage.max_files')}:</span> {config.maxFiles}
                  </div>
                  <div>
                    <span className="font-medium">{t('storage.bucket')}:</span> {config.bucket}
                  </div>
                  <div>
                    <span className="font-medium">{t('storage.auto_cleanup')}:</span> {config.autoCleanup ? t('common.yes') : t('common.no')}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-sm">{t('storage.allowed_types')}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {config.allowedTypes.slice(0, 5).map((type: string) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                    {config.allowedTypes.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{config.allowedTypes.length - 5} {t('common.more')}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e, config)}
                    className="hidden"
                    id={`file-upload-${key}`}
                  />
                  <label
                    htmlFor={`file-upload-${key}`}
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium">Click to upload files</p>
                      <p className="text-sm text-muted-foreground">
                        Or drag and drop files here
                      </p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recently Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('storage.recent_uploads')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('storage.recent_uploads_count')}: {uploadedFiles.length}
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {uploadedFiles.slice(-10).map((file, index) => (
                  <div key={index} className="text-sm p-2 bg-muted rounded flex items-center justify-between">
                    <span className="truncate">{file.name}</span>
                    <Badge variant="secondary">{file.size ? (file.size / 1024 / 1024).toFixed(2) : 'Unknown'} MB</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </RTLAware>
  );
}