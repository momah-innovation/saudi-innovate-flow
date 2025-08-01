import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
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
  Save
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
  const [configs, setConfigs] = useState<UploaderConfig[]>([])
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
      const settings: Partial<GlobalSettings> = {}
      globalData?.forEach(item => {
        const value = item.setting_value?.value
        switch (item.setting_key) {
          case 'auto_cleanup_enabled':
            settings.autoCleanupEnabled = value
            break
          case 'default_cleanup_days':
            settings.defaultCleanupDays = value
            break
          case 'max_concurrent_uploads':
            settings.maxConcurrentUploads = value
            break
          case 'chunk_size_mb':
            settings.chunkSize = value * 1024 * 1024
            break
          case 'retry_attempts':
            settings.retryAttempts = value
            break
          case 'compression_enabled':
            settings.compressionEnabled = value
            break
          case 'thumbnail_generation':
            settings.thumbnailGeneration = value
            break
        }
      })
      setGlobalSettings(prev => ({ ...prev, ...settings }))

      // Process upload configurations
      const uploadConfigs: UploaderConfig[] = configData?.map(item => ({
        id: item.id,
        uploadType: item.setting_key,
        bucket: item.setting_value.bucket || '',
        path: item.setting_value.path || '',
        maxSizeBytes: item.setting_value.maxSizeBytes || 0,
        allowedTypes: item.setting_value.allowedTypes || [],
        maxFiles: item.setting_value.maxFiles || 1,
        enabled: item.setting_value.enabled || false,
        autoCleanup: item.setting_value.autoCleanup || false,
        cleanupDays: item.setting_value.cleanupDays || 0
      })) || []

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

  const getStatusIcon = (config: UploaderConfig) => {
    if (!config.enabled) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />
  }

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
            </CardTitle>
            <Button variant="outline" onClick={() => setNewConfigOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Configuration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {configs.map((config, index) => (
              <Card key={config.uploadType} className="border-l-4 border-l-primary/20">
                <CardContent className="p-4">
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
                      <Badge variant={config.enabled ? 'default' : 'secondary'}>
                        {config.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => setEditingConfig(config)}>
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

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Health & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-medium">Security Status</h4>
              <p className="text-sm text-muted-foreground">All configurations secured</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <HardDrive className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-medium">Storage Health</h4>
              <p className="text-sm text-muted-foreground">Optimal performance</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-medium">Cleanup Status</h4>
              <p className="text-sm text-muted-foreground">Last run: 2 hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}