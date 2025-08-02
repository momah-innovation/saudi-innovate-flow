import React, { useState, useEffect } from 'react'
import { ConfigurationTester } from '@/components/admin/ConfigurationTester'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ConfigurationDialog } from './ConfigurationDialog'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/hooks/useAppTranslation'
import { useSystemHealth } from '@/hooks/useSystemHealth'
import { supabase } from '@/integrations/supabase/client'
import { 
  Settings, 
  Upload, 
  FileType,
  HardDrive,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react'

interface UploaderConfig {
  id: string
  uploadType: string
  bucket: string
  path: string
  maxSizeBytes: number
  allowedTypes: string[]
  maxFiles: number
  enabled: boolean
  autoCleanup: boolean
  cleanupDays: number
  bucketExists?: boolean // Add validation flag
}

interface GlobalSettings {
  autoCleanupEnabled: boolean
  defaultCleanupDays: number
  maxConcurrentUploads: number
  chunkSize: number
  retryAttempts: number
  compressionEnabled: boolean
  thumbnailGeneration: boolean
}

interface UploaderSettingsTabProps {
  className?: string
}

export function UploaderSettingsTab({ className }: UploaderSettingsTabProps) {
  const { toast } = useToast()
  const { t, isRTL } = useTranslation()
  const { teamMembers, departments, loading: orgLoading } = useOrganizationalData()
  const healthData = useSystemHealth()
  const [configs, setConfigs] = useState<UploaderConfig[]>([])
  const [allBuckets, setAllBuckets] = useState<any[]>([])
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    autoCleanupEnabled: true,
    defaultCleanupDays: 7,
    maxConcurrentUploads: 3,
    chunkSize: 1024 * 1024,
    retryAttempts: 3,
    compressionEnabled: true,
    thumbnailGeneration: true
  })
  const [loading, setLoading] = useState(true)
  const [newConfigOpen, setNewConfigOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<UploaderConfig | null>(null)

  useEffect(() => {
    loadUploaderSettings()
  }, [])

  const loadUploaderSettings = async () => {
    try {
      setLoading(true)
      console.log('Loading uploader settings...');
      
      // Load all available buckets first
      let buckets: any[] = [];
      try {
        const { data: dbBuckets, error: dbError } = await supabase
          .rpc('get_basic_storage_info');
        console.log('Uploader settings database response:', { dbBuckets, dbError });
        
        if (dbError) {
          console.log('Database function failed for uploader settings, trying storage API...');
          const { data: storageB, error: storageE } = await supabase.storage.listBuckets();
          buckets = storageB || [];
          console.log('Uploader storage API response:', { buckets: storageB, error: storageE });
        } else {
          // Convert database response to storage API format
          buckets = dbBuckets?.map(bucket => ({
            id: bucket.bucket_id,
            name: bucket.bucket_name,
            public: bucket.public,
            created_at: bucket.created_at
          })) || [];
          console.log('Uploader using database buckets:', buckets);
        }
      } catch (error) {
        console.error('Both methods failed for uploader settings:', error);
        const { data: storageB, error: storageE } = await supabase.storage.listBuckets();
        buckets = storageB || [];
        console.log('Uploader final fallback:', { buckets, error: storageE });
      }
      
      setAllBuckets(buckets);
      
      // Load global settings
      const { data: globalData, error: globalError } = await supabase
        .from('uploader_settings')
        .select('*')
        .eq('setting_type', 'global')
        .eq('is_active', true)

      console.log('Global settings response:', { globalData, globalError });
      if (globalError) throw globalError

      // Load upload configurations
      const { data: configData, error: configError } = await supabase
        .from('uploader_settings')
        .select('*')
        .eq('setting_type', 'upload_config')
        .eq('is_active', true)

      console.log('Config settings response:', { configData, configError });

      if (configError) throw configError

      // Process global settings
      const settings: Partial<GlobalSettings> = {}
      globalData?.forEach(item => {
        const value = typeof item.setting_value === 'object' && item.setting_value && 'value' in item.setting_value 
          ? item.setting_value.value 
          : item.setting_value
        switch (item.setting_key) {
          case 'auto_cleanup_enabled':
            settings.autoCleanupEnabled = Boolean(value)
            break
          case 'default_cleanup_days':
            settings.defaultCleanupDays = Number(value)
            break
          case 'max_concurrent_uploads':
            settings.maxConcurrentUploads = Number(value)
            break
          case 'chunk_size_mb':
            settings.chunkSize = Number(value) * 1024 * 1024
            break
          case 'retry_attempts':
            settings.retryAttempts = Number(value)
            break
          case 'compression_enabled':
            settings.compressionEnabled = Boolean(value)
            break
          case 'thumbnail_generation':
            settings.thumbnailGeneration = Boolean(value)
            break
        }
      })
      setGlobalSettings(prev => ({ ...prev, ...settings }))

      // Process upload configurations and validate bucket existence
      const bucketIds = buckets.map(b => b.id)
      const uploadConfigs: UploaderConfig[] = configData?.map(item => {
        const config = typeof item.setting_value === 'object' && item.setting_value ? item.setting_value as any : {}
        const bucketExists = bucketIds.includes(config.bucket)
        
        // Log orphaned configurations
        if (!bucketExists) {
          console.warn(`Configuration for missing bucket detected:`, {
            uploadType: item.setting_key,
            bucket: config.bucket,
            configId: item.id
          })
        }
        
        return {
          id: item.id,
          uploadType: item.setting_key,
          bucket: config.bucket || '',
          path: config.path || '',
          maxSizeBytes: Number(config.maxSizeBytes) || 0,
          allowedTypes: Array.isArray(config.allowedTypes) ? config.allowedTypes : [],
          maxFiles: Number(config.maxFiles) || 1,
          enabled: Boolean(config.enabled),
          autoCleanup: Boolean(config.autoCleanup),
          cleanupDays: Number(config.cleanupDays) || 0,
          bucketExists // Add validation flag
        }
      }) || []

      setConfigs(uploadConfigs)
    } catch (error) {
      console.error('Error loading uploader settings:', error)
      toast({
        title: t('error'),
        description: t('failed_to_load'),
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateGlobalSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('uploader_settings')
        .update({ 
          setting_value: { value, description: `Updated ${key}` },
          updated_at: new Date().toISOString()
        })
        .eq('setting_type', 'global')
        .eq('setting_key', key)

      if (error) throw error
    } catch (error) {
      console.error('Error updating global setting:', error)
      throw error
    }
  }

  const updateUploadConfig = async (configId: string, updates: Partial<UploaderConfig>) => {
    try {
      const config = configs.find(c => c.id === configId)
      if (!config) return

      const updatedValue = {
        ...config,
        ...updates,
        uploadType: config.uploadType,
        bucket: updates.bucket || config.bucket,
        path: updates.path || config.path
      }

      const { error } = await supabase
        .from('uploader_settings')
        .update({ 
          setting_value: updatedValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', configId)

      if (error) throw error

      setConfigs(prev => prev.map(c => 
        c.id === configId ? { ...c, ...updates } : c
      ))
    } catch (error) {
      console.error('Error updating upload config:', error)
      throw error
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return `0 ${t('bytes')}`
    const k = 1024
    const sizes = [t('bytes'), t('kb'), t('mb'), t('gb')]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleConfigUpdate = async (configIndex: number, updates: Partial<UploaderConfig>) => {
    const config = configs[configIndex]
    if (!config) return

    try {
      await updateUploadConfig(config.id, updates)
      toast({
        title: t('configuration_updated'),
        description: t('upload_configuration_updated')
      })
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_to_save_configuration'),
        variant: 'destructive'
      })
    }
  }

  const handleSaveSettings = async () => {
    try {
      await Promise.all([
        updateGlobalSetting('auto_cleanup_enabled', globalSettings.autoCleanupEnabled),
        updateGlobalSetting('default_cleanup_days', globalSettings.defaultCleanupDays),
        updateGlobalSetting('max_concurrent_uploads', globalSettings.maxConcurrentUploads),
        updateGlobalSetting('chunk_size_mb', globalSettings.chunkSize / (1024 * 1024)),
        updateGlobalSetting('retry_attempts', globalSettings.retryAttempts),
        updateGlobalSetting('compression_enabled', globalSettings.compressionEnabled),
        updateGlobalSetting('thumbnail_generation', globalSettings.thumbnailGeneration)
      ])

      toast({
        title: t('settings_saved'),
        description: t('global_uploader_settings_updated')
      })
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_to_save'),
        variant: 'destructive'
      })
    }
  }

  const handleSaveConfig = async (config: UploaderConfig) => {
    try {
      const settingValue = {
        uploadType: config.uploadType,
        bucket: config.bucket,
        path: config.path,
        maxSizeBytes: config.maxSizeBytes,
        allowedTypes: config.allowedTypes,
        maxFiles: config.maxFiles,
        enabled: config.enabled,
        autoCleanup: config.autoCleanup,
        cleanupDays: config.cleanupDays
      }

      if (editingConfig) {
        // Update existing configuration
        const { error } = await supabase
          .from('uploader_settings')
          .update({
            setting_value: settingValue,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', config.uploadType)
          .eq('setting_type', 'upload_config')
      } else {
        // Create new configuration
        const { error } = await supabase
          .from('uploader_settings')
          .insert({
            setting_type: 'upload_config',
            setting_key: config.uploadType,
            setting_value: settingValue,
            is_active: config.enabled
          })
      }

      toast({
        title: t('configuration_saved'),
        description: t('upload_configuration_saved', { type: config.uploadType })
      })

      loadUploaderSettings() // Refresh the settings
    } catch (error) {
      toast({
        title: t('save_failed'),
        description: t('failed_to_save_configuration'),
        variant: 'destructive'
      })
    }
  }

  const cleanupOrphanedConfigs = async () => {
    const orphanedConfigs = configs.filter(config => !config.bucketExists)
    
    if (orphanedConfigs.length === 0) {
      toast({
        title: t('no_cleanup_needed'),
        description: t('all_configurations_valid')
      })
      return
    }

    try {
      for (const config of orphanedConfigs) {
        await supabase
          .from('uploader_settings')
          .delete()
          .eq('id', config.id)
      }

      toast({
        title: t('cleanup_complete'),
        description: t('removed_orphaned_configurations', { count: orphanedConfigs.length })
      })
      
      loadUploaderSettings() // Refresh
    } catch (error) {
      toast({
        title: t('cleanup_failed'),
        description: t('failed_to_remove_orphaned_configurations'),
        variant: 'destructive'
      })
    }
  }

  const getStatusIcon = (config: UploaderConfig) => {
    if (!config.bucketExists) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
    if (!config.enabled) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />
  }

  const createConfigForBucket = (bucketName: string) => {
    setEditingConfig({
      id: '',
      uploadType: bucketName.replace(/-/g, '_'),
      bucket: bucketName,
      path: '/',
      maxSizeBytes: 5242880, // 5MB default
      allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      maxFiles: 5,
      enabled: true,
      autoCleanup: false,
      cleanupDays: 7,
      bucketExists: true
    })
  }

  const autoConfigureBucket = async (bucket: any) => {
    try {
      // Smart defaults based on bucket name patterns
      const bucketName = bucket.id.toLowerCase()
      let allowedTypes: string[] = []
      let maxSizeBytes = 5242880 // 5MB default
      let maxFiles = 5
      let path = ''

      // Determine file types and settings based on bucket name
      if (bucketName.includes('image') || bucketName.includes('avatar') || bucketName.includes('logo')) {
        allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        maxSizeBytes = 3145728 // 3MB for images
        maxFiles = bucketName.includes('avatar') ? 1 : 10
        path = bucketName.includes('avatar') ? 'profiles' : 'images'
      } else if (bucketName.includes('document') || bucketName.includes('contract')) {
        allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        maxSizeBytes = 20971520 // 20MB for documents
        maxFiles = 10
        path = 'documents'
      } else if (bucketName.includes('video') || bucketName.includes('recording')) {
        allowedTypes = ['video/mp4', 'video/webm']
        maxSizeBytes = 104857600 // 100MB for videos
        maxFiles = 5
        path = 'videos'
      } else if (bucketName.includes('audio')) {
        allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg']
        maxSizeBytes = 52428800 // 50MB for audio
        maxFiles = 10
        path = 'audio'
      } else if (bucketName.includes('attachment') || bucketName.includes('resource')) {
        allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        maxSizeBytes = 20971520 // 20MB for mixed content
        maxFiles = 20
        path = 'files'
      } else {
        // Generic defaults
        allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
        path = 'uploads'
      }

      const settingValue = {
        uploadType: bucketName.replace(/-/g, '_'),
        bucket: bucket.id,
        path: path,
        maxSizeBytes: maxSizeBytes,
        allowedTypes: allowedTypes,
        maxFiles: maxFiles,
        enabled: true,
        autoCleanup: !bucket.public, // Enable auto-cleanup for private buckets
        cleanupDays: 30
      }

      await supabase
        .from('uploader_settings')
        .insert({
          setting_type: 'upload_config',
          setting_key: bucketName.replace(/-/g, '_'),
          setting_value: settingValue,
          is_active: true
        })

      console.log(`Auto-configured bucket: ${bucket.id}`, settingValue)
    } catch (error) {
      console.error(`Failed to auto-configure bucket ${bucket.id}:`, error)
      throw error
    }
  }

  // Get unconfigured buckets
  const unconfiguredBuckets = allBuckets.filter(bucket => 
    !configs.some(config => config.bucket === bucket.id)
  )

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`space-y-6 ${isRTL ? 'font-arabic' : 'font-english'} ${className}`}>
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('global_uploader_settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="auto-cleanup">{t('auto_cleanup')}</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-cleanup"
                  checked={globalSettings.autoCleanupEnabled}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, autoCleanupEnabled: checked }))
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {globalSettings.autoCleanupEnabled ? t('enabled') : t('disabled')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cleanup-days">{t('default_cleanup_days')}</Label>
              <Input
                id="cleanup-days"
                type="number"
                value={globalSettings.defaultCleanupDays}
                onChange={(e) => 
                  setGlobalSettings(prev => ({ ...prev, defaultCleanupDays: parseInt(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-uploads">{t('max_concurrent_uploads')}</Label>
              <Input
                id="max-uploads"
                type="number"
                value={globalSettings.maxConcurrentUploads}
                onChange={(e) => 
                  setGlobalSettings(prev => ({ ...prev, maxConcurrentUploads: parseInt(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chunk-size">{t('chunk_size_mb')}</Label>
              <Input
                id="chunk-size"
                type="number"
                value={globalSettings.chunkSize / (1024 * 1024)}
                onChange={(e) => 
                  setGlobalSettings(prev => ({ ...prev, chunkSize: parseInt(e.target.value) * 1024 * 1024 }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retry-attempts">{t('retry_attempts')}</Label>
              <Input
                id="retry-attempts"
                type="number"
                value={globalSettings.retryAttempts}
                onChange={(e) => 
                  setGlobalSettings(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="compression">{t('image_compression')}</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="compression"
                  checked={globalSettings.compressionEnabled}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, compressionEnabled: checked }))
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {globalSettings.compressionEnabled ? t('enabled') : t('disabled')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleSaveSettings} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {t('save_global_settings')}
            </Button>
              </div>

              {/* Default Assignment Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">{t('default_assignment_settings')}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultAssignee">{t('default_assignee')}</Label>
                    <DynamicSelect
                      options={transformTeamMembers(teamMembers, isRTL)}
                      value={globalSettings.defaultAssignee}
                      onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, defaultAssignee: value }))}
                      placeholder={t('select_default_assignee')}
                      loading={orgLoading}
                      showAllOption={true}
                      allOptionLabel={t('no_default_assignee')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="defaultDepartment">{t('default_department')}</Label>
                    <DynamicSelect
                      options={transformDepartments(departments, isRTL)}
                      value={globalSettings.defaultDepartment}
                      onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, defaultDepartment: value }))}
                      placeholder={t('select_default_department')}
                      loading={orgLoading}
                      showAllOption={true}
                      allOptionLabel={t('no_default_department')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
      </Card>

      {/* Upload Configurations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {t('upload_configurations')}
              {configs.filter(c => !c.bucketExists).length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {configs.filter(c => !c.bucketExists).length} {t('orphaned')}
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              {configs.filter(c => !c.bucketExists).length > 0 && (
                <Button variant="destructive" size="sm" onClick={cleanupOrphanedConfigs}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('cleanup_orphaned')}
                </Button>
              )}
              <Button variant="outline" onClick={() => setNewConfigOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('add_configuration')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {configs.map((config, index) => (
              <Card key={config.uploadType} className={`border-l-4 ${
                !config.bucketExists 
                  ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20' 
                  : 'border-l-primary/20'
              }`}>
                <CardContent className="p-4">
                  {!config.bucketExists && (
                    <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('missing_storage_bucket')}</span>
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {t('bucket_no_longer_exists', { bucket: config.bucket })}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(config)}
                      <div>
                        <h4 className="font-medium">{config.uploadType}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('bucket_label')}: {config.bucket} • {t('path_label')}: {config.path}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        !config.bucketExists ? 'destructive' :
                        config.enabled ? 'default' : 'secondary'
                      }>
                         {!config.bucketExists ? t('missing_bucket') :
                          config.enabled ? t('active') : t('disabled')}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditingConfig(config)}
                        disabled={!config.bucketExists}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('max_size')}:</span>
                      <p className="font-medium">{formatBytes(config.maxSizeBytes)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('max_files')}:</span>
                      <p className="font-medium">{config.maxFiles}</p>
                    </div>
                    <div>
                       <span className="text-muted-foreground">{t('file_types')}:</span>
                       <p className="font-medium">{config.allowedTypes.length} {t('types')}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('auto_cleanup')}:</span>
                      <p className="font-medium">
                        {config.autoCleanup ? `${config.cleanupDays} ${t('days')}` : t('disabled')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(checked) => 
                          handleConfigUpdate(index, { enabled: checked })
                        }
                      />
                      <span className="text-sm">{t('enable_configuration')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.autoCleanup}
                        onCheckedChange={(checked) => 
                          handleConfigUpdate(index, { autoCleanup: checked })
                        }
                      />
                      <span className="text-sm">{t('auto_cleanup')}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-1">
                      {config.allowedTypes.map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type.split('/')[1]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unconfigured Buckets */}
      {unconfiguredBuckets.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                New Storage Buckets ({unconfiguredBuckets.length} unconfigured)
                <Badge variant="secondary" className="ml-2">
                  Action Required
                </Badge>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  // Auto-configure all unconfigured buckets with smart defaults
                  for (const bucket of unconfiguredBuckets) {
                    await autoConfigureBucket(bucket)
                  }
                  loadUploaderSettings()
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Auto-Configure All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              These storage buckets are available but don't have upload configurations yet. 
              Click "Configure" to set up file upload rules for each bucket.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unconfiguredBuckets.map((bucket) => (
                <Card key={bucket.id} className="border-l-4 border-l-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <div>
                          <h4 className="font-medium text-sm">{bucket.id}</h4>
                          <p className="text-xs text-muted-foreground">
                            {bucket.public ? t('public') : t('private')} {t('bucket_label')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        No Config
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-3">
                      Created: {new Date(bucket.created_at).toLocaleDateString()}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => createConfigForBucket(bucket.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Health & Security
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={healthData.refreshHealth}
              disabled={healthData.isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${healthData.isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {healthData.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{healthData.error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Security Status */}
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                healthData.security.highRiskEvents > 5 ? 'bg-red-100' :
                healthData.security.highRiskEvents > 2 ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                {healthData.security.highRiskEvents > 5 ? (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                ) : healthData.security.highRiskEvents > 2 ? (
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                )}
              </div>
              <h4 className="font-medium">Security Status</h4>
              <p className="text-sm text-muted-foreground">
                {healthData.security.totalSecurityEvents} events (7 days)
              </p>
              <p className="text-xs text-muted-foreground">
                {healthData.security.highRiskEvents} high-risk events
              </p>
              {healthData.security.suspiciousActivities > 0 && (
                <p className="text-xs text-red-600">
                  {healthData.security.suspiciousActivities} suspicious activities
                </p>
              )}
            </div>

            {/* Storage Health */}
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                healthData.storage.healthStatus === 'critical' ? 'bg-red-100' :
                healthData.storage.healthStatus === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <HardDrive className={`w-8 h-8 ${
                  healthData.storage.healthStatus === 'critical' ? 'text-red-600' :
                  healthData.storage.healthStatus === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              <h4 className="font-medium">Storage Health</h4>
              <p className="text-sm text-muted-foreground">
                {healthData.storage.totalBuckets} buckets, {healthData.storage.totalFiles.toLocaleString()} files
              </p>
              <p className="text-xs text-muted-foreground">
                {healthData.formatBytes(healthData.storage.totalSize)} total size
              </p>
              <Badge variant={
                healthData.storage.healthStatus === 'critical' ? 'destructive' :
                healthData.storage.healthStatus === 'warning' ? 'secondary' : 'default'
              } className="mt-1">
                {healthData.storage.healthStatus}
              </Badge>
            </div>

            {/* Cleanup Status */}
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                healthData.cleanup.autoCleanupEnabled ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <Clock className={`w-8 h-8 ${
                  healthData.cleanup.autoCleanupEnabled ? 'text-purple-600' : 'text-gray-600'
                }`} />
              </div>
              <h4 className="font-medium">{t('cleanup_status')}</h4>
              <p className="text-sm text-muted-foreground">
                {healthData.cleanup.autoCleanupEnabled ? t('auto_cleanup_enabled') : t('manual_cleanup_only')}
              </p>
              {healthData.cleanup.lastCleanupRun && (
                <p className="text-xs text-muted-foreground">
                  {t('last_run')}: {new Date(healthData.cleanup.lastCleanupRun).toLocaleDateString()}
                </p>
              )}
              {healthData.cleanup.nextScheduledCleanup && (
                <p className="text-xs text-green-600">
                  Next: {new Date(healthData.cleanup.nextScheduledCleanup).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <ConfigurationDialog
        config={editingConfig}
        open={newConfigOpen || Boolean(editingConfig)}
        onOpenChange={(open) => {
          if (!open) {
            setNewConfigOpen(false)
            setEditingConfig(null)
          }
        }}
        onSave={handleSaveConfig}
       />

      {/* Configuration Testing Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Configuration Testing</h2>
          <ConfigurationTester />
        </div>
      </div>
    </div>
  )
}