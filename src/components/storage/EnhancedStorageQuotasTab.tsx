import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStorageQuotas, StorageQuota, BucketInfo } from '@/hooks/useStorageQuotas';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertCircle, 
  Plus, 
  Trash2, 
  RefreshCw, 
  HardDrive, 
  Database, 
  Settings,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RTLAware } from '@/components/ui/rtl-aware';

interface EnhancedStorageQuotasTabProps {
  onQuotasChanged?: () => void;
}

export function EnhancedStorageQuotasTab({ onQuotasChanged }: EnhancedStorageQuotasTabProps) {
  const { quotas, loading, error, setQuota, removeQuota, refreshQuotas } = useStorageQuotas();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState('');
  const [quotaSize, setQuotaSize] = useState('');
  const [quotaUnit, setQuotaUnit] = useState('MB');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [allBuckets, setAllBuckets] = useState<BucketInfo[]>([]);
  const [bucketsLoading, setBucketsLoading] = useState(true);

  // Fetch all buckets to show comprehensive overview
  const fetchAllBuckets = async () => {
    try {
      setBucketsLoading(true);
      console.log('Fetching bucket info...');
      const { data, error } = await supabase.rpc('get_basic_storage_info');
      
      if (error) {
        console.error('Error fetching buckets:', error);
        toast({
          title: 'Error',
          description: `Failed to fetch bucket info: ${error.message}`,
          variant: 'destructive'
        });
        return;
      }
      
      console.log('Buckets fetched:', data);
      setAllBuckets(data || []);
    } catch (err) {
      console.error('Error fetching buckets:', err);
      toast({
        title: 'Error', 
        description: 'Failed to fetch bucket information',
        variant: 'destructive'
      });
    } finally {
      setBucketsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBuckets();
  }, []);

  // Get buckets without quotas for the dropdown
  const bucketsWithoutQuotas = allBuckets.filter(bucket => 
    !quotas.find(q => q.bucket_name === bucket.bucket_name)
  );

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getQuotaStatusColor = (quota: StorageQuota) => {
    if (quota.quota_exceeded) return 'destructive';
    if (quota.usage_percentage > 80) return 'secondary';
    if (quota.usage_percentage > 60) return 'outline';
    return 'default';
  };

  const handleSetQuota = async () => {
    if (!selectedBucket || !quotaSize) {
      toast({
        title: 'Validation Error',
        description: 'Please select a bucket and enter quota size',
        variant: 'destructive'
      });
      return;
    }

    setActionLoading('set');
    
    const multiplier = quotaUnit === 'GB' ? 1024 * 1024 * 1024 : 1024 * 1024;
    const quotaBytes = parseInt(quotaSize) * multiplier;

    const result = await setQuota(selectedBucket, quotaBytes);
    
    if (result.success) {
      toast({
        title: 'Quota Set',
        description: `Successfully set ${quotaSize} ${quotaUnit} quota for ${selectedBucket}`
      });
      setIsDialogOpen(false);
      setSelectedBucket('');
      setQuotaSize('');
      onQuotasChanged?.();
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      });
    }
    
    setActionLoading(null);
  };

  const handleRemoveQuota = async (bucketName: string) => {
    setActionLoading(bucketName);
    
    const result = await removeQuota(bucketName);
    
    if (result.success) {
      toast({
        title: 'Quota Removed',
        description: `Successfully removed quota for ${bucketName}`
      });
      onQuotasChanged?.();
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      });
    }
    
    setActionLoading(null);
  };

  const handleBulkSetup = async () => {
    const defaultQuotaGB = 5; // 5GB default quota
    const bucketsToSetup = bucketsWithoutQuotas.slice(0, 5); // Setup first 5

    console.log('Starting bulk setup for buckets:', bucketsToSetup.map(b => b.bucket_name));
    
    if (bucketsToSetup.length === 0) {
      toast({
        title: 'No Action Needed',
        description: 'All buckets already have quotas set up',
        variant: 'default'
      });
      return;
    }

    setActionLoading('bulk');
    
    try {
      for (const bucket of bucketsToSetup) {
        console.log(`Setting quota for bucket: ${bucket.bucket_name}`);
        const result = await setQuota(bucket.bucket_name, defaultQuotaGB * 1024 * 1024 * 1024);
        if (!result.success) {
          console.error(`Failed to set quota for ${bucket.bucket_name}:`, result.error);
          throw new Error(`Failed to set quota for ${bucket.bucket_name}: ${result.error}`);
        }
      }
      
      toast({
        title: 'Bulk Setup Complete',
        description: `Set up ${defaultQuotaGB}GB quotas for ${bucketsToSetup.length} buckets`
      });
    } catch (error) {
      console.error('Bulk setup failed:', error);
      toast({
        title: 'Bulk Setup Failed',
        description: error instanceof Error ? error.message : 'Failed to set up quotas',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
      onQuotasChanged?.();
    }
  };

  const getBucketStatus = (bucketName: string) => {
    const quota = quotas.find(q => q.bucket_name === bucketName);
    if (quota) {
      return {
        hasQuota: true,
        status: quota.quota_exceeded ? 'exceeded' : 'normal',
        usage: quota.usage_percentage
      };
    }
    return { hasQuota: false, status: 'no-quota', usage: 0 };
  };

  if (loading || bucketsLoading) {
    return (
      <RTLAware className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading storage quotas...</span>
        </div>
      </RTLAware>
    );
  }

  return (
    <RTLAware className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Storage Quotas Management</h3>
        <p className="text-muted-foreground">
          Set and manage storage limits for buckets to prevent excessive usage
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buckets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allBuckets.length}</div>
            <p className="text-xs text-muted-foreground">
              Available storage buckets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Quotas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotas.length}</div>
            <p className="text-xs text-muted-foreground">
              Buckets with quota limits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Without Quotas</CardTitle>
            <XCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bucketsWithoutQuotas.length}</div>
            <p className="text-xs text-muted-foreground">
              Need quota setup
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
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
                          <SelectItem key={bucket.bucket_name} value={bucket.bucket_name}>
                            {bucket.bucket_name}
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
                    {actionLoading === 'set' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    Set Quota
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {bucketsWithoutQuotas.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleBulkSetup}
                disabled={actionLoading === 'bulk'}
              >
                {actionLoading === 'bulk' ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Auto Setup (5GB Default)
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={() => {
                refreshQuotas();
                fetchAllBuckets();
              }}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* All Buckets Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            All Storage Buckets
          </CardTitle>
          <CardDescription>
            Complete overview of all storage buckets and their quota status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allBuckets.map((bucket) => {
              const status = getBucketStatus(bucket.bucket_name);
              const quota = quotas.find(q => q.bucket_name === bucket.bucket_name);
              
              return (
                <div key={bucket.bucket_name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{bucket.bucket_name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {bucket.public ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {status.hasQuota ? (
                        <>
                          <Badge variant={getQuotaStatusColor(quota!)}>
                            {status.usage.toFixed(1)}%
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuota(bucket.bucket_name)}
                            disabled={actionLoading === bucket.bucket_name}
                          >
                            {actionLoading === bucket.bucket_name ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      ) : (
                        <Badge variant="secondary">No Quota</Badge>
                      )}
                    </div>
                  </div>
                  
                  {status.hasQuota && quota ? (
                    <div className="space-y-2">
                      <Progress value={Math.min(quota.usage_percentage, 100)} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatBytes(quota.current_usage)} used</span>
                        <span>{formatBytes(quota.quota_bytes)} total</span>
                      </div>
                      {quota.quota_exceeded && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Quota exceeded! Current usage is {formatBytes(quota.current_usage - quota.quota_bytes)} over the limit.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No storage quota configured for this bucket
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </RTLAware>
  );
}