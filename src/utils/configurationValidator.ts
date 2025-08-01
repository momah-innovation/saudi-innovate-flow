interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

interface UploadConfig {
  uploadType: string
  bucket: string
  path: string
  maxSizeBytes: number
  allowedTypes: string[]
  maxFiles: number
  enabled: boolean
  autoCleanup: boolean
  cleanupDays: number
  acceptString: string
  bucketExists?: boolean
}

interface GlobalSettings {
  autoCleanupEnabled: boolean
  defaultCleanupDays: number
  maxConcurrentUploads: number
  chunkSizeMB: number
  retryAttempts: number
  compressionEnabled: boolean
  thumbnailGeneration: boolean
}

export function validateUploadConfig(config: UploadConfig): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields validation
  if (!config.uploadType?.trim()) {
    errors.push('Upload type is required')
  }

  if (!config.bucket?.trim()) {
    errors.push('Bucket name is required')
  }

  // Size validation
  if (config.maxSizeBytes <= 0) {
    errors.push('Max size must be greater than 0')
  }

  if (config.maxSizeBytes > 500 * 1024 * 1024) { // 500MB limit
    warnings.push('File size limit is very large (>500MB)')
  }

  // File count validation
  if (config.maxFiles <= 0) {
    errors.push('Max files must be greater than 0')
  }

  if (config.maxFiles > 50) {
    warnings.push('Max files count is very high (>50)')
  }

  // File types validation
  if (!config.allowedTypes || config.allowedTypes.length === 0) {
    errors.push('At least one allowed file type is required')
  }

  // Bucket existence check
  if (config.bucketExists === false) {
    errors.push(`Bucket '${config.bucket}' does not exist`)
  }

  // Cleanup validation
  if (config.autoCleanup && config.cleanupDays <= 0) {
    errors.push('Cleanup days must be greater than 0 when auto cleanup is enabled')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateGlobalSettings(settings: GlobalSettings): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Cleanup days validation
  if (settings.defaultCleanupDays <= 0) {
    errors.push('Default cleanup days must be greater than 0')
  }

  if (settings.defaultCleanupDays > 365) {
    warnings.push('Default cleanup days is very long (>365 days)')
  }

  // Concurrent uploads validation
  if (settings.maxConcurrentUploads <= 0) {
    errors.push('Max concurrent uploads must be greater than 0')
  }

  if (settings.maxConcurrentUploads > 10) {
    warnings.push('Max concurrent uploads is very high (>10)')
  }

  // Chunk size validation
  if (settings.chunkSizeMB <= 0) {
    errors.push('Chunk size must be greater than 0')
  }

  if (settings.chunkSizeMB > 100) {
    warnings.push('Chunk size is very large (>100MB)')
  }

  // Retry attempts validation
  if (settings.retryAttempts < 0) {
    errors.push('Retry attempts cannot be negative')
  }

  if (settings.retryAttempts > 10) {
    warnings.push('Retry attempts is very high (>10)')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateConfigurationHealth(
  uploadConfigs: Record<string, UploadConfig>,
  globalSettings: GlobalSettings
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate global settings
  const globalValidation = validateGlobalSettings(globalSettings)
  errors.push(...globalValidation.errors)
  warnings.push(...globalValidation.warnings)

  // Validate each upload configuration
  Object.entries(uploadConfigs).forEach(([key, config]) => {
    const configValidation = validateUploadConfig(config)
    
    // Prefix errors/warnings with config key for clarity
    errors.push(...configValidation.errors.map(error => `${key}: ${error}`))
    warnings.push(...configValidation.warnings.map(warning => `${key}: ${warning}`))
  })

  // Check for duplicate bucket usage
  const bucketUsage = new Map<string, string[]>()
  Object.entries(uploadConfigs).forEach(([key, config]) => {
    if (config.bucket) {
      if (!bucketUsage.has(config.bucket)) {
        bucketUsage.set(config.bucket, [])
      }
      bucketUsage.get(config.bucket)!.push(key)
    }
  })

  bucketUsage.forEach((configs, bucket) => {
    if (configs.length > 1) {
      warnings.push(`Bucket '${bucket}' is used by multiple configurations: ${configs.join(', ')}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}