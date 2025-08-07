import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
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
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface EnhancedStorageQuotasTabProps {
  onQuotasChanged?: () => void;
}

export function EnhancedStorageQuotasTab({ onQuotasChanged }: EnhancedStorageQuotasTabProps) {
  const { quotas, loading, error, setQuota, removeQuota, autoSetupQuotas, refreshQuotas } = useStorageQuotas();
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
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
      
      const { data, error } = await supabase.rpc('get_basic_storage_info');
      
      if (error) {
        logger.error('Error fetching buckets', { 
          component: 'EnhancedStorageQuotasTab', 
          action: 'fetchBuckets' 
        }, error as Error);
        toast({
          title: 'Error',
          description: `Failed to fetch bucket info: ${error.message}`,
          variant: 'destructive'
        });
        return;
      }
      
      
      setAllBuckets(data || []);
    } catch (err) {
      logger.error('Error fetching buckets', { 
        component: 'EnhancedStorageQuotasTab', 
        action: 'fetchBuckets' 
      }, err as Error);
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
    if (bytes === 0) return `0 ${t('storage.bytes')}`;
    const k = 1024;
    const sizes = [t('storage.bytes'), 'KB', 'MB', t('storage.gb'), 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getQuotaStatusColor = (quota: StorageQuota) => {
    const quotaExceeded = quota.current_usage_bytes > quota.quota_bytes;
    if (quotaExceeded) return 'destructive';
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
      logger.error('Failed to set quota', { 
        component: 'EnhancedStorageQuotasTab', 
        action: 'setQuota',
        data: { error: result.error }
      });
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

  const handleAutoSetup = async () => {
    setActionLoading('auto-setup');
    
    const result = await autoSetupQuotas();
    
    if (result.success) {
      const data = result.data as any;
      toast({
        title: 'Auto Setup Complete',
        description: `Successfully configured 5GB quotas for ${data?.buckets_configured || 0} buckets`
      });
      fetchAllBuckets();
      onQuotasChanged?.();
    } else {
      toast({
        title: 'Auto Setup Failed',
        description: result.error,
        variant: 'destructive'
      });
    }
    
    setActionLoading(null);
  };

  const getBucketStatus = (bucketName: string) => {
    const quota = quotas.find(q => q.bucket_name === bucketName);
    if (quota) {
      const quotaExceeded = quota.current_usage_bytes > quota.quota_bytes;
      return {
        hasQuota: true,
        status: quotaExceeded ? 'exceeded' : 'normal',
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
          <span>{t('storage.loading_storage_quotas')}</span>
        </div>
      </RTLAware>
    );
  }


  return (
    <RTLAware className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('storage.storage_quotas_management')}</h3>
        <p className="text-muted-foreground">
          {t('storage.set_manage_storage_limits')}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('storage.total_buckets_title')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allBuckets.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('storage.available_storage_buckets')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('storage.with_quotas')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotas.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('storage.buckets_with_quota_limits')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('storage.without_quotas')}</CardTitle>
            <XCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bucketsWithoutQuotas.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('storage.need_quota_setup')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('storage.quick_actions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('storage.add_quota')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('storage.set_storage_quota')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                      <Label htmlFor="bucket">{t('storage.bucket')}</Label>
                      <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('storage.select_bucket')} />
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
                      <Label htmlFor="quota">{t('storage.quota_size')}</Label>
                      <Input
                        id="quota"
                        type="number"
                        value={quotaSize}
                        onChange={(e) => setQuotaSize(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">{t('storage.unit')}</Label>
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
                    {t('storage.set_quota')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {bucketsWithoutQuotas.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleAutoSetup}
                disabled={actionLoading === 'auto-setup'}
              >
                {actionLoading === 'auto-setup' ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {t('storage.auto_setup_5gb')}
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
              {t('refresh')}
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
            {t('storage.all_storage_buckets')}
          </CardTitle>
          <CardDescription>
            {t('storage.complete_overview_buckets')}
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
                        {bucket.public ? t('storage.public') : t('storage.private')}
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
                        <Badge variant="secondary">{t('storage.no_quota')}</Badge>
                      )}
                    </div>
                  </div>
                  
                  {status.hasQuota && quota ? (
                    <div className="space-y-2">
                      <Progress value={Math.min(quota.usage_percentage, 100)} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatBytes(quota.current_usage_bytes)} {t("storage.used")}</span>
                        <span>{formatBytes(quota.quota_bytes)} {t("storage.total")}</span>
                      </div>
                      {quota.current_usage_bytes > quota.quota_bytes && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {t('storage.quota_exceeded')} {formatBytes(quota.current_usage_bytes - quota.quota_bytes)} {t('storage.over_limit')}.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {t('storage.no_storage_quota_configured')}
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