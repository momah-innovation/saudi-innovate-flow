import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useTranslation } from '@/hooks/useAppTranslation'

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

interface ConfigurationDialogProps {
  config?: UploaderConfig | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (config: UploaderConfig) => void
}

const commonFileTypes = [
  { value: 'image/jpeg', label: 'JPEG Images' },
  { value: 'image/png', label: 'PNG Images' },
  { value: 'image/webp', label: 'WebP Images' },
  { value: 'application/pdf', label: 'PDF Documents' },
  { value: 'application/msword', label: 'Word Documents' },
  { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word (DOCX)' },
  { value: 'video/mp4', label: 'MP4 Videos' },
  { value: 'audio/mp3', label: 'MP3 Audio' },
  { value: 'application/zip', label: 'ZIP Archives' },
  { value: 'text/plain', label: 'Text Files' }
]

export function ConfigurationDialog({ config, open, onOpenChange, onSave }: ConfigurationDialogProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const isEditing = Boolean(config)
  const [availableBuckets, setAvailableBuckets] = useState<string[]>([])
  
  const [formData, setFormData] = useState<UploaderConfig>({
    id: '',
    uploadType: '',
    bucket: '',
    path: '',
    maxSizeBytes: 5242880, // 5MB default
    allowedTypes: [],
    maxFiles: 1,
    enabled: true,
    autoCleanup: false,
    cleanupDays: 7
  })

  // Update form data when config prop changes
  useEffect(() => {
    if (config) {
      setFormData({
        id: config.id || '',
        uploadType: config.uploadType || '',
        bucket: config.bucket || '',
        path: config.path || '',
        maxSizeBytes: config.maxSizeBytes || 5242880,
        allowedTypes: config.allowedTypes || [],
        maxFiles: config.maxFiles || 1,
        enabled: config.enabled !== false,
        autoCleanup: config.autoCleanup || false,
        cleanupDays: config.cleanupDays || 7
      })
    } else {
      // Reset form for new configuration
      setFormData({
        id: '',
        uploadType: '',
        bucket: '',
        path: '',
        maxSizeBytes: 5242880,
        allowedTypes: [],
        maxFiles: 1,
        enabled: true,
        autoCleanup: false,
        cleanupDays: 7
      })
    }
  }, [config])

  // Load available buckets from Supabase
  useEffect(() => {
    const loadBuckets = async () => {
      try {
        console.log('Loading buckets for configuration dialog...');
        
        // Try database function first, fallback to storage API
        let buckets: any[] = [];
        
        try {
          const { data: dbBuckets, error: dbError } = await supabase
            .rpc('get_basic_storage_info');
          console.log('Config dialog database response:', { dbBuckets, dbError });
          
          if (dbError) {
            console.log('Database function failed for config, trying storage API...');
            const { data: storageB, error: storageE } = await supabase.storage.listBuckets();
            buckets = storageB || [];
            console.log('Config storage API response:', { buckets: storageB, error: storageE });
          } else {
            // Convert database response to storage API format
            buckets = dbBuckets?.map(bucket => ({
              id: bucket.bucket_id,
              name: bucket.bucket_name,
              public: bucket.public
            })) || [];
            console.log('Config using database buckets:', buckets);
          }
        } catch (error) {
          console.error('Both methods failed for config:', error);
          const { data: storageB, error: storageE } = await supabase.storage.listBuckets();
          buckets = storageB || [];
          console.log('Config final fallback:', { buckets, error: storageE });
        }
        
        if (buckets && buckets.length > 0) {
          const bucketNames = buckets.map(bucket => bucket.id).sort()
          console.log('Available buckets for config:', bucketNames);
          setAvailableBuckets(bucketNames)
        } else {
          console.warn('No buckets found for configuration dialog');
          setAvailableBuckets([])
        }
      } catch (error) {
        console.error('Failed to load buckets:', error)
        setAvailableBuckets([])
      }
    }
    
    if (open) {
      console.log('Dialog opened, loading buckets...');
      loadBuckets()
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.uploadType || !formData.bucket) {
      toast({
        title: t('validation_error'),
        description: t('upload_type_bucket_required'),
        variant: 'destructive'
      })
      return
    }

    if (formData.allowedTypes.length === 0) {
      toast({
        title: t('validation_error'), 
        description: t('at_least_one_file_type'),
        variant: 'destructive'
      })
      return
    }

    onSave(formData)
    onOpenChange(false)
    
    toast({
      title: isEditing ? t('configuration_updated') : t('configuration_created'),
      description: isEditing ? t('upload_configuration_updated') : t('upload_configuration_created')
    })
  }

  const addFileType = (type: string) => {
    if (!formData.allowedTypes.includes(type)) {
      setFormData(prev => ({
        ...prev,
        allowedTypes: [...prev.allowedTypes, type]
      }))
    }
  }

  const removeFileType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      allowedTypes: prev.allowedTypes.filter(t => t !== type)
    }))
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {isEditing ? t('edit_upload_configuration') : t('create_upload_configuration')}
          </DialogTitle>
          <DialogDescription>
            {t('configure_file_upload_settings')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uploadType">{t('upload_type')} *</Label>
              <Input
                id="uploadType"
                value={formData.uploadType}
                onChange={(e) => setFormData(prev => ({ ...prev, uploadType: e.target.value }))}
                placeholder="e.g., opportunity-images, user-avatars"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bucket">{t('storage_bucket')} *</Label>
              <Select 
                value={formData.bucket} 
                onValueChange={(value) => {
                  console.log('Bucket selected:', value);
                  setFormData(prev => ({ ...prev, bucket: value }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    availableBuckets.length === 0 
                      ? t('loading_buckets')
                      : t('select_bucket')
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableBuckets.length === 0 ? (
                     <SelectItem value="no-buckets" disabled>
                       {t('no_buckets_available')}
                     </SelectItem>
                  ) : (
                    availableBuckets.map((bucket) => (
                      <SelectItem key={bucket} value={bucket}>
                        {bucket}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Available buckets: {availableBuckets.length} | Current: {formData.bucket || 'None'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="path">{t('storage_path')}</Label>
            <Input
              id="path"
              value={formData.path}
              onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
              placeholder={t('optional_subfolder_path')}
            />
          </div>

          <Separator />

          {/* File Restrictions */}
          <div className="space-y-4">
            <h3 className="font-medium">{t('file_restrictions')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxSizeBytes">{t('max_file_size')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="maxSizeBytes"
                    type="number"
                    value={Math.round(formData.maxSizeBytes / 1024 / 1024)}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      maxSizeBytes: Number(e.target.value) * 1024 * 1024 
                    }))}
                    min="1"
                    max="100"
                  />
                  <span className="text-sm text-muted-foreground mt-2">{t('mb')}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('current_size')}: {formatBytes(formData.maxSizeBytes)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFiles">{t('max_files')}</Label>
                <Input
                  id="maxFiles"
                  type="number"
                  value={formData.maxFiles}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxFiles: Number(e.target.value) }))}
                  min="1"
                  max="20"
                />
              </div>
            </div>
          </div>

          {/* Allowed File Types */}
          <div className="space-y-4">
            <Label>{t('allowed_file_types')} *</Label>
            
            <div className="space-y-3">
              <Select onValueChange={addFileType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('add_file_type')} />
                </SelectTrigger>
                <SelectContent>
                  {commonFileTypes.map((type) => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      disabled={formData.allowedTypes.includes(type.value)}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                {formData.allowedTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type.split('/')[1] || type}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeFileType(type)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Cleanup Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">{t('cleanup_settings')}</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoCleanup">{t('auto_cleanup')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('auto_delete_temp_files')}
                </p>
              </div>
              <Switch
                id="autoCleanup"
                checked={formData.autoCleanup}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoCleanup: checked }))}
              />
            </div>

            {formData.autoCleanup && (
              <div className="space-y-2">
                <Label htmlFor="cleanupDays">{t('cleanup_after_days')}</Label>
                <Input
                  id="cleanupDays"
                  type="number"
                  value={formData.cleanupDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, cleanupDays: Number(e.target.value) }))}
                  min="1"
                  max="30"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Status */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enabled">{t('configuration_status')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('enable_disable_configuration')}
              </p>
            </div>
            <Switch
              id="enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit">
              {isEditing ? t('update_configuration') : t('create_configuration')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}