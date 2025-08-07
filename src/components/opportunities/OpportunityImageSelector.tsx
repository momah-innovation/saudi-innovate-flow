import React from 'react'
import { ImageSourceSelector } from '@/components/ui/image-source-selector'
import { createUploadConfig, useUploaderSettings } from '@/utils/uploadConfigs'
import { UploadedFile } from '@/hooks/useFileUploader'

interface UnsplashImage {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
    profile_image: {
      small: string
    }
  }
  width: number
  height: number
  color: string
  likes: number
  attribution: {
    photographer: string
    photographer_username: string
    source: string
    source_url: string
    photographer_url: string
  }
}

interface OpportunityImageSelectorProps {
  opportunityId?: string
  onFileUpload?: (files: UploadedFile[]) => void
  onUnsplashSelect?: (image: UnsplashImage) => void
  disabled?: boolean
  className?: string
}

export function OpportunityImageSelector({
  opportunityId,
  onFileUpload,
  onUnsplashSelect,
  disabled = false,
  className
}: OpportunityImageSelectorProps) {
  const { getUploadConfig } = useUploaderSettings()
  const baseConfig = getUploadConfig('OPPORTUNITY_IMAGES')
  
  const config = baseConfig ? createUploadConfig(
    baseConfig as any,
    opportunityId,
    'opportunities',
    'image_url'
  ) : null

  if (!config) {
    return <div className="text-sm text-muted-foreground">Loading image selector...</div>
  }

  return (
    <ImageSourceSelector
      config={config}
      onFileUpload={onFileUpload}
      onUnsplashSelect={onUnsplashSelect}
      triggerButtonText="Add Opportunity Image"
      dialogTitle="Select Opportunity Image"
      allowMultiple={false}
      className={className}
    />
  )
}