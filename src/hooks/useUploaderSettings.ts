import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { logger } from '@/utils/logger'
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
        const value = typeof item.setting_value === 'object' && item.setting_value && 'value' in item.setting_value 
          ? item.setting_value.value 
          : item.setting_value
        switch (item.setting_key) {
          case 'auto_cleanup_enabled':
            processedGlobal.autoCleanupEnabled = Boolean(value)
            break
          case 'default_cleanup_days':
            processedGlobal.defaultCleanupDays = Number(value)
            break
          case 'max_concurrent_uploads':
            processedGlobal.maxConcurrentUploads = Number(value)
            break
          case 'chunk_size_mb':
            processedGlobal.chunkSizeMB = Number(value)
            break
          case 'retry_attempts':
            processedGlobal.retryAttempts = Number(value)
            break
          case 'compression_enabled':
            processedGlobal.compressionEnabled = Boolean(value)
            break
          case 'thumbnail_generation':
            processedGlobal.thumbnailGeneration = Boolean(value)
            break
        }
      })
      setGlobalSettings(prev => ({ ...prev, ...processedGlobal }))

      // Process upload configurations
      const processedConfigs: Record<string, UploadConfig> = {}
      configData?.forEach(item => {
        const config = typeof item.setting_value === 'object' && item.setting_value ? item.setting_value as any : {}
        if (config) {
          // Generate accept string from allowed types
           const acceptString = Array.isArray(config.allowedTypes) ? config.allowedTypes.map((type: string) => {
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
           }).join(',') : ''

          processedConfigs[item.setting_key] = {
            uploadType: config.uploadType || config.bucket || item.setting_key,
            bucket: config.bucket || '',
            path: config.path || '',
            maxSizeBytes: Number(config.maxSizeBytes) || 5242880,
            allowedTypes: Array.isArray(config.allowedTypes) ? config.allowedTypes : [],
            maxFiles: Number(config.maxFiles) || 1,
            enabled: Boolean(config.enabled) !== false,
            autoCleanup: Boolean(config.autoCleanup) || false,
            cleanupDays: Number(config.cleanupDays) || 0,
            acceptString
          }
        }
      })

      // Merge with fallback configs for any missing ones
      const mergedConfigs: Record<string, UploadConfig> = {}
      Object.keys(UPLOAD_CONFIGS).forEach(key => {
        const baseConfig = UPLOAD_CONFIGS[key as keyof typeof UPLOAD_CONFIGS]
        mergedConfigs[key] = {
          uploadType: baseConfig.uploadType,
          bucket: baseConfig.uploadType,
          path: '',
          maxSizeBytes: baseConfig.maxSizeBytes,
          allowedTypes: baseConfig.allowedTypes,
          maxFiles: baseConfig.maxFiles,
          enabled: true,
          autoCleanup: false,
          cleanupDays: 0,
          acceptString: baseConfig.acceptString,
          ...processedConfigs[key]
        }
      })

      setUploadConfigs(mergedConfigs)

    } catch (err) {
      logger.error('Error loading uploader settings', { component: 'useUploaderSettings', action: 'loadUploaderSettings' }, err as Error)
      setError(err instanceof Error ? err.message : 'Failed to load settings')
      
      // Fallback to hardcoded configs
      const fallbackConfigs: Record<string, UploadConfig> = {}
      Object.keys(UPLOAD_CONFIGS).forEach(key => {
        const baseConfig = UPLOAD_CONFIGS[key as keyof typeof UPLOAD_CONFIGS]
        fallbackConfigs[key] = {
          uploadType: baseConfig.uploadType,
          bucket: baseConfig.uploadType,
          path: '',
          maxSizeBytes: baseConfig.maxSizeBytes,
          allowedTypes: baseConfig.allowedTypes,
          maxFiles: baseConfig.maxFiles,
          enabled: true,
          autoCleanup: false,
          cleanupDays: 0,
          acceptString: baseConfig.acceptString
        }
      })
      setUploadConfigs(fallbackConfigs)
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