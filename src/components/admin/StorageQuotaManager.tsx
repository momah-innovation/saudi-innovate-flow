import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useStorageQuotas, StorageQuota } from '@/hooks/useStorageQuotas'
import { useToast } from '@/hooks/use-toast'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Plus, Trash2, RefreshCw, HardDrive } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRTLAware } from '@/hooks/useRTLAware';
import { RTLFlex } from '@/components/ui/rtl-layout';

interface StorageQuotaManagerProps {
  className?: string
}

export const StorageQuotaManager: React.FC<StorageQuotaManagerProps> = ({ className }) => {
  const { quotas, loading, error, setQuota, removeQuota, autoSetupQuotas, refreshQuotas } = useStorageQuotas()
  const { toast } = useToast()
  const { mr, ml, isRTL } = useRTLAware();
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedBucket, setSelectedBucket] = useState('')
  const [quotaSize, setQuotaSize] = useState('')
  const [quotaUnit, setQuotaUnit] = useState('MB')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Get list of buckets without quotas for the dropdown
  const bucketsWithoutQuotas = [
    'opportunities-images-public',
    'opportunities-documents-private', 
    'opportunities-attachments-private',
    'challenges-images-public',
    'challenges-documents-private',
    'challenges-attachments-private',
    'ideas-images-public',
    'ideas-documents-private',
    'ideas-attachments-private',
    'campaigns-images-public',
    'campaigns-materials-public',
    'campaigns-documents-private',
    'events-images-public',
    'events-resources-public',
    'events-recordings-private',
    'user-avatars-public',
    'user-documents-private',
    'partners-logos-public',
    'partners-documents-private',
    'temp-uploads-private'
  ].filter(bucket => !quotas.find(q => q.bucket_name === bucket))

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getQuotaStatusColor = (quota: StorageQuota) => {
    const quotaExceeded = quota.current_usage_bytes > quota.quota_bytes
    if (quotaExceeded) return 'destructive'
    if (quota.usage_percentage > 80) return 'secondary'
    if (quota.usage_percentage > 60) return 'outline'
    return 'default'
  }

  const handleSetQuota = async () => {
    if (!selectedBucket || !quotaSize) {
      toast({
        title: 'Validation Error',
        description: 'Please select a bucket and enter quota size',
        variant: 'destructive'
      })
      return
    }

    setActionLoading('set')
    
    const multiplier = quotaUnit === 'GB' ? 1024 * 1024 * 1024 : 1024 * 1024
    const quotaBytes = parseInt(quotaSize) * multiplier

    const result = await setQuota(selectedBucket, quotaBytes)
    
    if (result.success) {
      toast({
        title: 'Quota Set',
        description: `Successfully set ${quotaSize} ${quotaUnit} quota for ${selectedBucket}`
      })
      setIsDialogOpen(false)
      setSelectedBucket('')
      setQuotaSize('')
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      })
    }
    
    setActionLoading(null)
  }

  const handleRemoveQuota = async (bucketName: string) => {
    setActionLoading(bucketName)
    
    const result = await removeQuota(bucketName)
    
    if (result.success) {
      toast({
        title: 'Quota Removed',
        description: `Successfully removed quota for ${bucketName}`
      })
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      })
    }
    
    setActionLoading(null)
  }

  const handleAutoSetup = async () => {
    setActionLoading('auto-setup')
    
    const result = await autoSetupQuotas()
    
    if (result.success) {
      const data = result.data as any
      toast({
        title: 'Auto Setup Complete',
        description: `Successfully configured 5GB quotas for ${data?.buckets_configured || 0} buckets`
      })
    } else {
      toast({
        title: 'Auto Setup Failed',
        description: result.error,
        variant: 'destructive'
      })
    }
    
    setActionLoading(null)
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Quotas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Quotas
            </CardTitle>
            <CardDescription>
              Manage storage quotas for different buckets
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshQuotas}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className={`h-4 w-4 ${mr("2")}`} />
                  Add Quota
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Storage Quota</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bucket">Bucket</Label>
                    <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bucket" />
                      </SelectTrigger>
                      <SelectContent>
                        {bucketsWithoutQuotas.map((bucket) => (
                          <SelectItem key={bucket} value={bucket}>
                            {bucket}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <Label htmlFor="quota">Quota Size</Label>
                      <Input
                        id="quota"
                        type="number"
                        value={quotaSize}
                        onChange={(e) => setQuotaSize(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={quotaUnit} onValueChange={setQuotaUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MB">MB</SelectItem>
                          <SelectItem value="GB">GB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSetQuota} 
                    disabled={actionLoading === 'set'}
                    className="w-full"
                  >
                    {actionLoading === 'set' && <RefreshCw className={`h-4 w-4 ${mr("2")} animate-spin`} />}
                    Set Quota
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {quotas.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              No storage quotas configured
            </div>
            <Button 
              onClick={handleAutoSetup} 
              disabled={actionLoading === 'auto-setup'}
              variant="outline"
            >
              {actionLoading === 'auto-setup' && <RefreshCw className={`h-4 w-4 ${mr("2")} animate-spin`} />}
              Auto Setup (5GB Default)
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {quotas.map((quota) => (
              <div key={quota.bucket_name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{quota.bucket_name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={getQuotaStatusColor(quota)}>
                      {quota.usage_percentage.toFixed(1)}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuota(quota.bucket_name)}
                      disabled={actionLoading === quota.bucket_name}
                    >
                      {actionLoading === quota.bucket_name ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={Math.min(quota.usage_percentage, 100)} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatBytes(quota.current_usage_bytes)} used</span>
                    <span>{formatBytes(quota.quota_bytes)} total</span>
                  </div>
                  {quota.current_usage_bytes > quota.quota_bytes && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Quota exceeded! Current usage is {formatBytes(quota.current_usage_bytes - quota.quota_bytes)} over the limit.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}