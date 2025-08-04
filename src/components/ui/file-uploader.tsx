import React, { forwardRef } from 'react';
import { WizardFileUploader } from '@/components/ui/wizard-file-uploader';
import { createUploadConfig } from '@/utils/uploadConfigs';
import { useUploaderSettingsContext } from '@/contexts/UploaderSettingsContext';
import type { UploadedFile } from '@/hooks/useFileUploader';

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
  const { getUploadConfig } = useUploaderSettingsContext();
  
  // Get the base configuration from the upload settings
  const baseConfig = getUploadConfig(uploadType);
  
  if (!baseConfig) {
    return (
      <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg">
        Upload configuration '{uploadType}' not found. Please check your upload settings.
      </div>
    );
  }

  // Create the final upload configuration
  const config = createUploadConfig(baseConfig, entityId, tableName, columnName);

  if (disabled) {
    return (
      <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg opacity-50">
        File upload is currently disabled.
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