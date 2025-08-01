import React from 'react'
import { FileUploader } from '@/components/ui/file-uploader'
import { UPLOAD_CONFIGS, createUploadConfig } from '@/utils/fileUploadConfigs'
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
    <FileUploader
      config={config}
      onUploadComplete={onUploadComplete}
      className={className}
      disabled={disabled}
      showPreview={true}
      multiple={false}
    />
  )
}