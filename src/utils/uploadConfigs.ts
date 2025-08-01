import { FileUploadConfig } from '@/hooks/useFileUploader'

// Enhanced upload configurations with better organization
export const UPLOAD_CONFIGS = {
  // Opportunity uploads
  OPPORTUNITY_IMAGES: {
    uploadType: 'opportunities-images-public',
    maxFiles: 3,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] as string[],
    acceptString: 'image/jpeg,image/png,image/webp'
  },
  
  OPPORTUNITY_DOCUMENTS: {
    uploadType: 'opportunities-documents-private',
    maxFiles: 10,
    maxSizeBytes: 25 * 1024 * 1024, // 25MB
    allowedTypes: [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ] as string[],
    acceptString: '.pdf,.doc,.docx,.txt'
  },

  OPPORTUNITY_ATTACHMENTS: {
    uploadType: 'opportunities-attachments-private',
    maxFiles: 5,
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'image/jpeg',
      'image/png'
    ] as string[],
    acceptString: '.pdf,.zip,.jpg,.jpeg,.png'
  },

  // Challenge uploads
  CHALLENGE_IMAGES: {
    uploadType: 'challenges-images-public',
    maxFiles: 2,
    maxSizeBytes: 8 * 1024 * 1024, // 8MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] as string[],
    acceptString: 'image/jpeg,image/png,image/webp'
  },
  
  CHALLENGE_DOCUMENTS: {
    uploadType: 'challenges-documents-private',
    maxFiles: 15,
    maxSizeBytes: 30 * 1024 * 1024, // 30MB
    allowedTypes: [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ] as string[],
    acceptString: '.pdf,.doc,.docx,.txt,.ppt,.pptx'
  },

  CHALLENGE_ATTACHMENTS: {
    uploadType: 'challenges-attachments-private',
    maxFiles: 8,
    maxSizeBytes: 100 * 1024 * 1024, // 100MB
    allowedTypes: [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'video/mp4',
      'audio/mpeg'
    ] as string[],
    acceptString: '.pdf,.zip,.mp4,.mp3'
  },

  // Ideas uploads
  IDEAS_IMAGES: {
    uploadType: 'ideas-images-public',
    maxFiles: 5,
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as string[],
    acceptString: 'image/jpeg,image/png,image/webp,image/gif'
  },

  IDEAS_DOCUMENTS: {
    uploadType: 'ideas-documents-private',
    maxFiles: 12,
    maxSizeBytes: 20 * 1024 * 1024, // 20MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ] as string[],
    acceptString: '.pdf,.doc,.docx'
  },

  IDEAS_ATTACHMENTS: {
    uploadType: 'ideas-attachments-private',
    maxFiles: 6,
    maxSizeBytes: 75 * 1024 * 1024, // 75MB
    allowedTypes: [
      'application/pdf',
      'application/zip',
      'video/mp4',
      'image/jpeg',
      'image/png'
    ] as string[],
    acceptString: '.pdf,.zip,.mp4,.jpg,.jpeg,.png'
  },

  // Campaign uploads
  CAMPAIGN_IMAGES: {
    uploadType: 'campaigns-images-public',
    maxFiles: 4,
    maxSizeBytes: 12 * 1024 * 1024, // 12MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] as string[],
    acceptString: 'image/jpeg,image/png,image/webp'
  },

  CAMPAIGN_MATERIALS: {
    uploadType: 'campaigns-materials-public',
    maxFiles: 20,
    maxSizeBytes: 50 * 1024 * 1024, // 50MB per file
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'video/mp4',
      'audio/mpeg',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ] as string[],
    acceptString: '.pdf,.jpg,.jpeg,.png,.mp4,.mp3,.ppt,.pptx'
  },

  // User uploads
  USER_AVATARS: {
    uploadType: 'user-avatars-public',
    maxFiles: 1,
    maxSizeBytes: 3 * 1024 * 1024, // 3MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] as string[],
    acceptString: 'image/jpeg,image/png,image/webp'
  },

  USER_DOCUMENTS: {
    uploadType: 'user-documents-private',
    maxFiles: 10,
    maxSizeBytes: 25 * 1024 * 1024, // 25MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ] as string[],
    acceptString: '.pdf,.doc,.docx'
  },

  // Partner uploads
  PARTNER_LOGOS: {
    uploadType: 'partner-images',
    maxFiles: 1,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'] as string[],
    acceptString: 'image/jpeg,image/png,image/webp,image/svg+xml'
  },

  // Event uploads
  EVENT_RESOURCES: {
    uploadType: 'event-resources',
    maxFiles: 25,
    maxSizeBytes: 100 * 1024 * 1024, // 100MB per file
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'video/mp4',
      'audio/mpeg',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip'
    ] as string[],
    acceptString: '.pdf,.jpg,.jpeg,.png,.mp4,.mp3,.ppt,.pptx,.zip'
  }
} as const

// Helper functions for creating upload configurations
export const createUploadConfig = (
  baseConfig: typeof UPLOAD_CONFIGS[keyof typeof UPLOAD_CONFIGS] | any,
  entityId?: string,
  tableName?: string,
  columnName?: string
): FileUploadConfig => ({
  ...baseConfig,
  entityId,
  tableName,
  columnName
})

export const createWizardUploadConfig = (
  baseConfig: typeof UPLOAD_CONFIGS[keyof typeof UPLOAD_CONFIGS],
  tableName?: string,
  columnName?: string
): Omit<FileUploadConfig, 'isTemporary' | 'tempSessionId'> => ({
  ...baseConfig,
  tableName,
  columnName
})

export const createTemporaryUploadConfig = (
  baseConfig: typeof UPLOAD_CONFIGS[keyof typeof UPLOAD_CONFIGS],
  tempSessionId?: string
): FileUploadConfig => ({
  ...baseConfig,
  isTemporary: true,
  tempSessionId
})

// Export the WizardFileUploader component type for convenience
export type { WizardFileUploaderProps, WizardFileUploaderRef } from '../components/ui/wizard-file-uploader'

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type === '*/*') return true
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', '/'))
    }
    return file.type === type
  })
}

export const validateFileSize = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes
}

// Get appropriate upload config based on context
export const getUploadConfig = (
  type: 'opportunity' | 'challenge' | 'idea' | 'campaign' | 'user' | 'partner' | 'event',
  subType: 'images' | 'documents' | 'attachments' | 'avatars' | 'logos' | 'resources' | 'materials'
): typeof UPLOAD_CONFIGS[keyof typeof UPLOAD_CONFIGS] | null => {
  const configKey = `${type.toUpperCase()}_${subType.toUpperCase()}` as keyof typeof UPLOAD_CONFIGS
  return UPLOAD_CONFIGS[configKey] || null
}

// New function to resolve upload configuration dynamically
export function resolveUploadConfig(
  configKey: string,
  uploaderSettings?: any,
  entityId?: string,
  tableName?: string,
  columnName?: string
): FileUploadConfig | null {
  // Try to get database configuration first
  const dbConfig = uploaderSettings?.getUploadConfig?.(configKey)
  
  // Fallback to hardcoded config
  const hardcodedConfig = UPLOAD_CONFIGS[configKey as keyof typeof UPLOAD_CONFIGS]
  
  if (!dbConfig && !hardcodedConfig) {
    return null
  }

  // Merge configurations, database takes precedence for upload settings
  const resolvedConfig: FileUploadConfig = {
    uploadType: dbConfig?.uploadType || hardcodedConfig?.uploadType || configKey,
    maxFiles: dbConfig?.maxFiles || hardcodedConfig?.maxFiles || 1,
    maxSizeBytes: dbConfig?.maxSizeBytes || hardcodedConfig?.maxSizeBytes || 5242880,
    allowedTypes: dbConfig?.allowedTypes || hardcodedConfig?.allowedTypes || [],
    acceptString: dbConfig?.acceptString || hardcodedConfig?.acceptString || '',
    entityId,
    tableName,
    columnName,
    isTemporary: false
  }

  return resolvedConfig
}

// Hook for accessing dynamic uploader settings from database
export { useUploaderSettings } from '@/hooks/useUploaderSettings'