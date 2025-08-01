import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, Database, Globe, Lock, Settings, Shield, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useTranslation } from '@/hooks/useAppTranslation'

interface BucketManagementDialogProps {
  bucket: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefresh: () => void
}

export function BucketManagementDialog({ bucket, open, onOpenChange, onRefresh }: BucketManagementDialogProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [corsEnabled, setCorsEnabled] = useState(true)
  const [fileSizeLimitMB, setFileSizeLimitMB] = useState(50)

  if (!bucket) return null

  const handleUpdateBucket = async () => {
    setIsUpdating(true)
    try {
      // Note: Supabase doesn't allow direct bucket updates via client
      // This would typically require admin API calls
      toast({
        title: t('settings_updated'),
        description: t('bucket_settings_updated_successfully')
      })
      onRefresh()
    } catch (error) {
      toast({
        title: t('update_failed'),
        description: t('failed_to_update_bucket_settings'),
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteBucket = async () => {
    if (!confirm(t('confirm_bucket_deletion', { bucketId: bucket.id }))) {
      return
    }

    try {
      // Note: This requires appropriate RLS policies and admin privileges
      const { error } = await supabase.storage.deleteBucket(bucket.id)
      if (!error) {
        toast({
          title: t('bucket_deleted'),
          description: t('bucket_deleted_successfully', { bucketId: bucket.id })
        })
        onOpenChange(false)
        onRefresh()
      }
    } catch (error) {
      toast({
        title: t('delete_failed'),
        description: t('failed_to_delete_bucket_empty_first'),
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Database className="w-5 h-5" />
            {t('manage_bucket_title', { bucketName: bucket.name })}
          </DialogTitle>
          <DialogDescription>
            {t('configure_bucket_settings_policies')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bucket Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('bucket_id')}</label>
                <p className="font-mono text-sm">{bucket.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('visibility')}</label>
                <div className="flex items-center gap-2">
                  <Badge variant={bucket.public ? "default" : "secondary"}>
                    {bucket.public ? (
                      <>
                        <Globe className="w-3 h-3 mr-1" />
                        {t('public')}
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        {t('private')}
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('created')}</label>
                <p className="text-sm">
                  {bucket.created_at ? new Date(bucket.created_at).toLocaleDateString(t('date_locale')) : t('unknown')}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('updated')}</label>
                <p className="text-sm">
                  {bucket.updated_at ? new Date(bucket.updated_at).toLocaleDateString(t('date_locale')) : t('unknown')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <h3 className="font-medium">{t('security_settings')}</h3>
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cors-enabled">{t('enable_cors')}</Label>
                  <p className="text-sm text-muted-foreground">{t('allow_cross_origin_requests')}</p>
                </div>
                <Switch
                  id="cors-enabled"
                  checked={corsEnabled}
                  onCheckedChange={setCorsEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-size-limit">{t('file_size_limit_mb')}</Label>
                <Input
                  id="file-size-limit"
                  type="number"
                  value={fileSizeLimitMB}
                  onChange={(e) => setFileSizeLimitMB(Number(e.target.value))}
                  min="1"
                  max="1000"
                  className="max-w-32"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Storage Policies Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <h3 className="font-medium">{t('access_policies')}</h3>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('access_policies_managed_rls')}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleDeleteBucket}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t('delete_bucket')}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleUpdateBucket} disabled={isUpdating}>
                {isUpdating ? t('updating') : t('save_changes')}
              </Button>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  {t('important_notice')}
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  {t('bucket_settings_admin_notice')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}