import React from 'react'
import { EnhancedFileUploader } from '@/components/ui/enhanced-file-uploader'
import { createUploadConfig, useUploaderSettings } from '@/utils/uploadConfigs'
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
  const { getUploadConfig } = useUploaderSettings()
  const baseConfig = getUploadConfig('OPPORTUNITY_IMAGES')
  
  const config = baseConfig ? createUploadConfig(
    baseConfig,
    opportunityId,
    'opportunities',
    'image_url'
  ) : null

  if (!config) {
    return <div className="text-sm text-muted-foreground">Loading uploader configuration...</div>
  }

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