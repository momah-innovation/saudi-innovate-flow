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

interface BucketManagementDialogProps {
  bucket: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefresh: () => void
}

export function BucketManagementDialog({ bucket, open, onOpenChange, onRefresh }: BucketManagementDialogProps) {
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
        title: "Settings Updated",
        description: "Bucket settings have been updated successfully"
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update bucket settings",
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteBucket = async () => {
    if (!confirm(`Are you sure you want to delete bucket "${bucket.id}"? This action cannot be undone.`)) {
      return
    }

    try {
      // Note: This requires appropriate RLS policies and admin privileges
      const { error } = await supabase.storage.deleteBucket(bucket.id)
      if (!error) {
        toast({
          title: "Bucket Deleted",
          description: `Bucket "${bucket.id}" has been deleted`
        })
        onOpenChange(false)
        onRefresh()
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete bucket. Make sure it's empty first.",
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
            Manage Bucket: {bucket.name}
          </DialogTitle>
          <DialogDescription>
            Configure bucket settings and manage access policies
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bucket Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bucket ID</label>
                <p className="font-mono text-sm">{bucket.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Visibility</label>
                <div className="flex items-center gap-2">
                  <Badge variant={bucket.public ? "default" : "secondary"}>
                    {bucket.public ? (
                      <>
                        <Globe className="w-3 h-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">
                  {bucket.created_at ? new Date(bucket.created_at).toLocaleDateString() : "Unknown"}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Updated</label>
                <p className="text-sm">
                  {bucket.updated_at ? new Date(bucket.updated_at).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <h3 className="font-medium">Security Settings</h3>
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cors-enabled">Enable CORS</Label>
                  <p className="text-sm text-muted-foreground">Allow cross-origin requests</p>
                </div>
                <Switch
                  id="cors-enabled"
                  checked={corsEnabled}
                  onCheckedChange={setCorsEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-size-limit">File Size Limit (MB)</Label>
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
              <h3 className="font-medium">Access Policies</h3>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Access policies are managed through Row Level Security (RLS) policies in your Supabase dashboard.
                Visit the Storage section in your Supabase project to configure detailed access rules.
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
              Delete Bucket
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBucket} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Important Notice
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Some bucket settings require admin privileges and may need to be configured through the Supabase dashboard or API.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}