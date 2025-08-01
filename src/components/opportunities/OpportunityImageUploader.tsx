import React from 'react'
import { EnhancedFileUploader } from '@/components/ui/enhanced-file-uploader'
import { createUploadConfig, UPLOAD_CONFIGS } from '@/utils/uploadConfigs'
import { UploadedFile } from '@/hooks/useFileUploader'

interface OpportunityImageUploaderProps {
  opportunityId: string
  onUploadComplete?: (files: UploadedFile[]) => void
  disabled?: boolean
  className?: string
}

export const OpportunityImageUploader: React.FC<OpportunityImageUploaderProps> = ({
  opportunityId,
  onUploadComplete,
  disabled = false,
  className
}) => {
  const config = createUploadConfig(
    UPLOAD_CONFIGS.OPPORTUNITY_IMAGES,
    opportunityId,
    'opportunities',
    'image_url'
  )

  return (
    <EnhancedFileUploader
      config={config}
      onUploadComplete={onUploadComplete}
      className={className}
      disabled={disabled}
      showPreview={true}
    />
  )
}