import React, { forwardRef } from 'react';
import { WizardFileUploader } from '@/components/ui/wizard-file-uploader';
import { createUploadConfig } from '@/utils/uploadConfigs';
import { useUploaderSettingsContext } from '@/contexts/UploaderSettingsContext';
import type { UploadedFile } from '@/hooks/useFileUploader';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface FileUploaderProps {
  uploadType: string;
  entityId?: string;
  tableName?: string;
  columnName?: string;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onCancel?: () => void;
  className?: string;
  disabled?: boolean;
}

export interface FileUploaderRef {
  commitFiles: () => Promise<UploadedFile[]>;
  cancelUpload: () => void;
  getFiles: () => UploadedFile[];
}

export const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(({
  uploadType,
  entityId,
  tableName,
  columnName,
  onUploadComplete,
  onCancel,
  className,
  disabled = false
}, ref) => {
  const { t } = useUnifiedTranslation();
  const { getUploadConfig } = useUploaderSettingsContext();
  
  // Get the base configuration from the upload settings
  const baseConfig = getUploadConfig(uploadType);
  
  if (!baseConfig) {
    return (
      <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg">
        {t('ui:file_uploader.config_not_found', { uploadType })}
      </div>
    );
  }

  // Create the final upload configuration
  const config = createUploadConfig(baseConfig, entityId, tableName, columnName);

  if (disabled) {
    return (
      <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg opacity-50">
        {t('ui:file_uploader.disabled')}
      </div>
    );
  }

  return (
    <div className={className}>
      <WizardFileUploader
        ref={ref}
        config={config}
        onUploadComplete={onUploadComplete}
        onCancel={onCancel}
      />
    </div>
  );
});

FileUploader.displayName = 'FileUploader';
