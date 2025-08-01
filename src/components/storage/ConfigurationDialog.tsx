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
  const { toast } = useToast()
  const isEditing = Boolean(config)
  const [availableBuckets, setAvailableBuckets] = useState<string[]>([])
  
  const [formData, setFormData] = useState<UploaderConfig>(() => ({
    id: config?.id || '',
    uploadType: config?.uploadType || '',
    bucket: config?.bucket || '',
    path: config?.path || '',
    maxSizeBytes: config?.maxSizeBytes || 5242880, // 5MB default
    allowedTypes: config?.allowedTypes || [],
    maxFiles: config?.maxFiles || 1,
    enabled: config?.enabled !== false,
    autoCleanup: config?.autoCleanup || false,
    cleanupDays: config?.cleanupDays || 7
  }))

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
        
        if (buckets) {
          const bucketNames = buckets.map(bucket => bucket.id).sort()
          console.log('Available buckets for config:', bucketNames);
          setAvailableBuckets(bucketNames)
        }
      } catch (error) {
        console.error('Failed to load buckets:', error)
      }
    }
    
    if (open) {
      loadBuckets()
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.uploadType || !formData.bucket) {
      toast({
        title: "Validation Error",
        description: "Upload type and bucket are required",
        variant: 'destructive'
      })
      return
    }

    if (formData.allowedTypes.length === 0) {
      toast({
        title: "Validation Error", 
        description: "At least one file type must be allowed",
        variant: 'destructive'
      })
      return
    }

    onSave(formData)
    onOpenChange(false)
    
    toast({
      title: isEditing ? "Configuration Updated" : "Configuration Created",
      description: `Upload configuration for ${formData.uploadType} has been ${isEditing ? 'updated' : 'created'}`
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
            {isEditing ? 'Edit Upload Configuration' : 'Create Upload Configuration'}
          </DialogTitle>
          <DialogDescription>
            Configure file upload settings for a specific upload type
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uploadType">Upload Type *</Label>
              <Input
                id="uploadType"
                value={formData.uploadType}
                onChange={(e) => setFormData(prev => ({ ...prev, uploadType: e.target.value }))}
                placeholder="e.g., opportunity-images, user-avatars"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bucket">Storage Bucket *</Label>
              <Select 
                value={formData.bucket} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, bucket: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bucket" />
                </SelectTrigger>
                <SelectContent>
                  {availableBuckets.map((bucket) => (
                    <SelectItem key={bucket} value={bucket}>
                      {bucket}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="path">Storage Path</Label>
            <Input
              id="path"
              value={formData.path}
              onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
              placeholder="Optional subfolder path"
            />
          </div>

          <Separator />

          {/* File Restrictions */}
          <div className="space-y-4">
            <h3 className="font-medium">File Restrictions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxSizeBytes">Max File Size</Label>
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
                  <span className="text-sm text-muted-foreground mt-2">MB</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current: {formatBytes(formData.maxSizeBytes)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFiles">Max Files</Label>
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
            <Label>Allowed File Types *</Label>
            
            <div className="space-y-3">
              <Select onValueChange={addFileType}>
                <SelectTrigger>
                  <SelectValue placeholder="Add file type" />
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
            <h3 className="font-medium">Cleanup Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoCleanup">Auto Cleanup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically delete old temporary files
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
                <Label htmlFor="cleanupDays">Cleanup After (Days)</Label>
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
              <Label htmlFor="enabled">Configuration Status</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this upload configuration
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
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Configuration' : 'Create Configuration'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}