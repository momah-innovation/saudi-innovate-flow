import React, { useState, useEffect } from 'react'
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
        title: 'Error',
        description: 'Failed to load uploader settings',
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
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleConfigUpdate = async (configIndex: number, updates: Partial<UploaderConfig>) => {
    const config = configs[configIndex]
    if (!config) return

    try {
      await updateUploadConfig(config.id, updates)
      toast({
        title: 'Configuration Updated',
        description: 'Upload configuration has been saved successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update configuration',
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
        title: 'Settings Saved',
        description: 'Global uploader settings have been updated successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
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
        title: "Configuration Saved",
        description: `Upload configuration for ${config.uploadType} has been saved`
      })

      loadUploaderSettings() // Refresh the settings
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration",
        variant: 'destructive'
      })
    }
  }

  const cleanupOrphanedConfigs = async () => {
    const orphanedConfigs = configs.filter(config => !config.bucketExists)
    
    if (orphanedConfigs.length === 0) {
      toast({
        title: "No Cleanup Needed",
        description: "All configurations have valid storage buckets"
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
        title: "Cleanup Complete",
        description: `Removed ${orphanedConfigs.length} orphaned configuration(s)`
      })
      
      loadUploaderSettings() // Refresh
    } catch (error) {
      toast({
        title: "Cleanup Failed",
        description: "Failed to remove orphaned configurations",
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

  // Get unconfigured buckets
  const unconfiguredBuckets = allBuckets.filter(bucket => 
    !configs.some(config => config.bucket === bucket.id)
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Global Uploader Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="auto-cleanup">Auto Cleanup</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-cleanup"
                  checked={globalSettings.autoCleanupEnabled}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, autoCleanupEnabled: checked }))
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {globalSettings.autoCleanupEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cleanup-days">Default Cleanup Days</Label>
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
              <Label htmlFor="max-uploads">Max Concurrent Uploads</Label>
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
              <Label htmlFor="chunk-size">Chunk Size (MB)</Label>
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
              <Label htmlFor="retry-attempts">Retry Attempts</Label>
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
              <Label htmlFor="compression">Image Compression</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="compression"
                  checked={globalSettings.compressionEnabled}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, compressionEnabled: checked }))
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {globalSettings.compressionEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleSaveSettings} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Global Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Configurations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Configurations
              {configs.filter(c => !c.bucketExists).length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {configs.filter(c => !c.bucketExists).length} orphaned
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              {configs.filter(c => !c.bucketExists).length > 0 && (
                <Button variant="destructive" size="sm" onClick={cleanupOrphanedConfigs}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cleanup Orphaned
                </Button>
              )}
              <Button variant="outline" onClick={() => setNewConfigOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Configuration
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
                        <span className="text-sm font-medium">Missing Storage Bucket</span>
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        The bucket "{config.bucket}" no longer exists in storage. This configuration should be removed.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(config)}
                      <div>
                        <h4 className="font-medium">{config.uploadType}</h4>
                        <p className="text-sm text-muted-foreground">
                          Bucket: {config.bucket} • Path: {config.path}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        !config.bucketExists ? 'destructive' :
                        config.enabled ? 'default' : 'secondary'
                      }>
                        {!config.bucketExists ? 'Missing Bucket' :
                         config.enabled ? 'Active' : 'Disabled'}
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
                      <span className="text-muted-foreground">Max Size:</span>
                      <p className="font-medium">{formatBytes(config.maxSizeBytes)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Files:</span>
                      <p className="font-medium">{config.maxFiles}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">File Types:</span>
                      <p className="font-medium">{config.allowedTypes.length} types</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Auto Cleanup:</span>
                      <p className="font-medium">
                        {config.autoCleanup ? `${config.cleanupDays} days` : 'Disabled'}
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
                      <span className="text-sm">Enable Configuration</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.autoCleanup}
                        onCheckedChange={(checked) => 
                          handleConfigUpdate(index, { autoCleanup: checked })
                        }
                      />
                      <span className="text-sm">Auto Cleanup</span>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Available Buckets ({unconfiguredBuckets.length} unconfigured)
            </CardTitle>
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
                            {bucket.public ? 'Public' : 'Private'} bucket
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
              <h4 className="font-medium">Cleanup Status</h4>
              <p className="text-sm text-muted-foreground">
                {healthData.cleanup.autoCleanupEnabled ? 'Auto-cleanup enabled' : 'Manual cleanup only'}
              </p>
              {healthData.cleanup.lastCleanupRun && (
                <p className="text-xs text-muted-foreground">
                  Last run: {new Date(healthData.cleanup.lastCleanupRun).toLocaleDateString()}
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
    </div>
  )
}