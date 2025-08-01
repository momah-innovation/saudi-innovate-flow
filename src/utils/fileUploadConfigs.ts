import { FileUploadConfig } from '@/hooks/useFileUploader'

export const UPLOAD_CONFIGS = {
  // Opportunity uploads
  OPPORTUNITY_IMAGES: {
    uploadType: 'opportunity-images',
    maxFiles: 1,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as string[],
    acceptString: 'image/jpeg,image/png,image/webp,image/gif'
  },
  
  OPPORTUNITY_DOCUMENTS: {
    uploadType: 'opportunity-documents',
    maxFiles: 5,
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ] as string[],
    acceptString: '.pdf,.doc,.docx'
  },

  // Challenge uploads
  CHALLENGE_IMAGES: {
    uploadType: 'challenge-images',
    maxFiles: 1,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as string[],
    acceptString: 'image/jpeg,image/png,image/webp,image/gif'
  },
  
  CHALLENGE_DOCUMENTS: {
    uploadType: 'challenge-documents',
    maxFiles: 10,
    maxSizeBytes: 20 * 1024 * 1024, // 20MB
    allowedTypes: [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ] as string[],
    acceptString: '.pdf,.doc,.docx,.txt'
  },

  // Event uploads
  EVENT_RESOURCES: {
    uploadType: 'event-resources',
    maxFiles: 20,
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'video/mp4', 
      'audio/mpeg'
    ] as string[],
    acceptString: '.pdf,.jpg,.jpeg,.png,.mp4,.mp3'
  },

  // User uploads
  USER_AVATARS: {
    uploadType: 'user-avatars',
    maxFiles: 1,
    maxSizeBytes: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] as string[],
    acceptString: 'image/jpeg,image/png,image/webp'
  },

  // Partner uploads
  PARTNER_LOGOS: {
    uploadType: 'partner-logos',
    maxFiles: 1,
    maxSizeBytes: 3 * 1024 * 1024, // 3MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'] as string[],
    acceptString: 'image/jpeg,image/png,image/webp,image/svg+xml'
  }
} as const

export const createUploadConfig = (
  baseConfig: typeof UPLOAD_CONFIGS[keyof typeof UPLOAD_CONFIGS],
  entityId?: string,
  tableName?: string,
  columnName?: string
): FileUploadConfig => ({
  ...baseConfig,
  entityId,
  tableName,
  columnName
})