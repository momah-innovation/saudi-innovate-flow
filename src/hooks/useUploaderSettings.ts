import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { UPLOAD_CONFIGS } from '@/utils/uploadConfigs'

interface GlobalSettings {
  autoCleanupEnabled: boolean
  defaultCleanupDays: number
  maxConcurrentUploads: number
  chunkSizeMB: number
  retryAttempts: number
  compressionEnabled: boolean
  thumbnailGeneration: boolean
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
}

export function useUploaderSettings() {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    autoCleanupEnabled: true,
    defaultCleanupDays: 7,
    maxConcurrentUploads: 3,
    chunkSizeMB: 1,
    retryAttempts: 3,
    compressionEnabled: true,
    thumbnailGeneration: true
  })
  
  const [uploadConfigs, setUploadConfigs] = useState<Record<string, UploadConfig>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load global settings
      const { data: globalData, error: globalError } = await supabase
        .from('uploader_settings')
        .select('*')
        .eq('setting_type', 'global')
        .eq('is_active', true)

      if (globalError) throw globalError

      // Load upload configurations
      const { data: configData, error: configError } = await supabase
        .from('uploader_settings')
        .select('*')
        .eq('setting_type', 'upload_config')
        .eq('is_active', true)

      if (configError) throw configError

      // Process global settings
      const processedGlobal: Partial<GlobalSettings> = {}
      globalData?.forEach(item => {
        const value = item.setting_value?.value
        switch (item.setting_key) {
          case 'auto_cleanup_enabled':
            processedGlobal.autoCleanupEnabled = value
            break
          case 'default_cleanup_days':
            processedGlobal.defaultCleanupDays = value
            break
          case 'max_concurrent_uploads':
            processedGlobal.maxConcurrentUploads = value
            break
          case 'chunk_size_mb':
            processedGlobal.chunkSizeMB = value
            break
          case 'retry_attempts':
            processedGlobal.retryAttempts = value
            break
          case 'compression_enabled':
            processedGlobal.compressionEnabled = value
            break
          case 'thumbnail_generation':
            processedGlobal.thumbnailGeneration = value
            break
        }
      })
      setGlobalSettings(prev => ({ ...prev, ...processedGlobal }))

      // Process upload configurations
      const processedConfigs: Record<string, UploadConfig> = {}
      configData?.forEach(item => {
        const config = item.setting_value
        if (config) {
          // Generate accept string from allowed types
          const acceptString = config.allowedTypes?.map((type: string) => {
            if (type.startsWith('image/')) {
              return type.replace('image/', '.')
            } else if (type.startsWith('application/')) {
              switch (type) {
                case 'application/pdf': return '.pdf'
                case 'application/msword': return '.doc'
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return '.docx'
                case 'application/vnd.ms-powerpoint': return '.ppt'
                case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': return '.pptx'
                case 'application/zip': return '.zip'
                case 'application/x-zip-compressed': return '.zip'
                default: return type
              }
            } else if (type.startsWith('video/')) {
              return type.replace('video/', '.')
            } else if (type.startsWith('audio/')) {
              return type.replace('audio/', '.')
            } else if (type.startsWith('text/')) {
              return '.txt'
            }
            return type
          }).join(',') || ''

          processedConfigs[item.setting_key] = {
            uploadType: config.uploadType || config.bucket || item.setting_key,
            bucket: config.bucket || '',
            path: config.path || '',
            maxSizeBytes: config.maxSizeBytes || 5242880,
            allowedTypes: config.allowedTypes || [],
            maxFiles: config.maxFiles || 1,
            enabled: config.enabled !== false,
            autoCleanup: config.autoCleanup || false,
            cleanupDays: config.cleanupDays || 0,
            acceptString
          }
        }
      })

      // Merge with fallback configs for any missing ones
      const mergedConfigs = { ...UPLOAD_CONFIGS }
      Object.keys(mergedConfigs).forEach(key => {
        if (processedConfigs[key]) {
          mergedConfigs[key] = { ...mergedConfigs[key], ...processedConfigs[key] }
        }
      })

      setUploadConfigs(mergedConfigs)

    } catch (err) {
      console.error('Error loading uploader settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load settings')
      
      // Fallback to hardcoded configs
      setUploadConfigs(UPLOAD_CONFIGS)
    } finally {
      setLoading(false)
    }
  }

  const getUploadConfig = (configKey: string): UploadConfig | null => {
    return uploadConfigs[configKey] || null
  }

  const refreshSettings = () => {
    loadSettings()
  }

  return {
    globalSettings,
    uploadConfigs,
    loading,
    error,
    getUploadConfig,
    refreshSettings
  }
}