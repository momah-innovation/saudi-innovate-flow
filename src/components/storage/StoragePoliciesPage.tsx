import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/ui/page-header'
import { StoragePoliciesHero } from './StoragePoliciesHero'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useUnifiedTranslation } from '@/hooks/useAppTranslation';
import { useRTLAwareClasses } from '@/components/ui/rtl-aware'
import { 
  Shield, 
  Users, 
  Lock, 
  Unlock, 
  Eye, 
  Upload, 
  Download, 
  Edit, 
  Trash2,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

interface StoragePolicy {
  name: string
  command: string
  condition: string
  check_expression: string
}

interface BucketInfo {
  id: string
  name: string
  public: boolean
  policies: StoragePolicy[]
}

const POLICY_COMMANDS = {
  SELECT: { icon: Eye, label: 'View', color: 'blue' },
  INSERT: { icon: Upload, label: 'Upload', color: 'green' },
  UPDATE: { icon: Edit, label: 'Update', color: 'yellow' },
  DELETE: { icon: Trash2, label: 'Delete', color: 'red' }
}

export const StoragePoliciesPage: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const { t, isRTL } = useUnifiedTranslation();
  const [buckets, setBuckets] = useState<BucketInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [policiesStats, setPoliciesStats] = useState({
    totalBuckets: 0,
    publicBuckets: 0,
    protectedBuckets: 0,
    unprotectedBuckets: 0,
    totalPolicies: 0,
    securityScore: 85,
    lastReview: 'منذ يومين', // Default Arabic since we can't call t() here
    criticalIssues: 0
  })

  const checkAdminStatus = useCallback(async () => {
    try {
      // Use the has_role function to check admin status
      const { data, error } = await supabase
        .rpc('has_role', { 
          _user_id: user?.id, 
          _role: 'admin' 
        });
      
      if (error) {
        console.error('Admin check error:', error);
        // Try super_admin if admin check fails
        const { data: superAdminData, error: superAdminError } = await supabase
          .rpc('has_role', { 
            _user_id: user?.id, 
            _role: 'super_admin' 
          });
        
        setIsAdmin(!!superAdminData && !superAdminError);
      } else {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error('Admin status check failed:', error);
      setIsAdmin(false);
    }
  }, [user?.id]);

  const loadStoragePolicies = useCallback(async () => {
    try {
      setLoading(true)
      // Loading storage policies
      
      // Try to get buckets using RPC first (more reliable with RLS)
      const { data: bucketsFromRPC, error: rpcError } = await supabase
        .rpc('get_basic_storage_info' as any);
      
      let bucketsData: any[] = [];
      
      if (rpcError || !bucketsFromRPC) {
        // Fallback to direct storage API
        // Fallback to direct storage API
        const { data: directBuckets, error: storageError } = await supabase.storage.listBuckets();
        
        if (storageError || !directBuckets) {
          console.error('Both bucket loading methods failed:', { rpcError, storageError });
          toast({
            title: 'Error Loading Buckets',
            description: 'Failed to load storage buckets. Please check your permissions.',
            variant: 'destructive'
          });
          setBuckets([]);
          return;
        }
        
        bucketsData = directBuckets.map(bucket => ({
          bucket_id: bucket.id,
          bucket_name: bucket.name,
          public: bucket.public
        }));
      } else {
        bucketsData = bucketsFromRPC;
      }
      
      // Buckets loaded successfully

      // Use RPC to get policies
      const { data: policiesData, error: policiesError } = await supabase
        .rpc('get_storage_policies_info' as any);

      if (policiesError) {
        const errorMessage = policiesError.message || 'Failed to load storage policies';
        setError(errorMessage);
        toast({
          title: t('error'),
          description: errorMessage,
          variant: 'destructive'
        });
        return;
      }

      // Policies loaded successfully

      // Group policies by bucket  
      const policiesByBucket: Record<string, StoragePolicy[]> = {};
      
      if (policiesData && Array.isArray(policiesData)) {
        policiesData.forEach((policy: any) => {
          // Processing policy for bucket assignment
          // Extract bucket name from policy condition
          const bucketMatch = policy.condition?.match(/bucket_id = '([^']+)'/) || 
                             policy.condition?.match(/bucket_id = ANY \(ARRAY\[([^\]]+)\]/);
          
          if (bucketMatch) {
            let bucketNames: string[] = [];
            
            if (bucketMatch[1].includes("'")) {
              // Multiple buckets in array format
              bucketNames = bucketMatch[1].match(/'([^']+)'/g)?.map(b => b.replace(/'/g, '')) || [];
            } else {
              // Single bucket
              bucketNames = [bucketMatch[1]];
            }
            
            bucketNames.forEach(bucketName => {
              if (!policiesByBucket[bucketName]) {
                policiesByBucket[bucketName] = [];
              }
              policiesByBucket[bucketName].push({
                name: policy.name,
                command: policy.command,
                condition: policy.condition || '',
                check_expression: policy.check_expression || ''
              });
            });
          }
        });
      }

      // Create bucket info with actual policies
      const bucketInfo: BucketInfo[] = bucketsData.map(bucket => ({
        id: bucket.bucket_id,
        name: bucket.bucket_name,
        public: bucket.public,
        policies: policiesByBucket[bucket.bucket_name] || []
      }));

      // Final bucket policy mapping completed
      setBuckets(bucketInfo);
      
      // Update stats
      const publicCount = bucketInfo.filter(b => b.public).length
      const protectedCount = bucketInfo.filter(b => !b.public && b.policies.length > 0).length
      const unprotectedCount = bucketInfo.filter(b => !b.public && b.policies.length === 0).length
      
      setPoliciesStats({
        totalBuckets: bucketInfo.length,
        publicBuckets: publicCount,
        protectedBuckets: protectedCount,
        unprotectedBuckets: unprotectedCount,
        totalPolicies: bucketInfo.reduce((sum, b) => sum + b.policies.length, 0),
        securityScore: unprotectedCount > 0 ? 65 : 85,
        lastReview: t('storage.days_ago', { days: 2 }),
        criticalIssues: unprotectedCount
      })
    } catch (error) {
      console.error('Error loading storage policies:', error)
      toast({
        title: t('error_loading_policies'),
        description: t('failed_to_fetch_storage_policy'),
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast, t]);

  const renderPolicyStatus = useCallback((bucket: BucketInfo) => {
    if (bucket.public) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Unlock className={`w-3 h-3 ${mr('1')}`} />
          {t('storage.public_access')}
        </Badge>
      )
    }

    if (bucket.policies.length === 0) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className={`w-3 h-3 ${mr('1')}`} />
          {t('no_policies')}
        </Badge>
      )
    }

    return (
      <Badge variant="secondary">
        <Lock className={`w-3 h-3 ${mr('1')}`} />
        {t('storage.policies_count', { count: bucket.policies.length })}
      </Badge>
    )
  }, [t]);

  const getBucketSecurityLevel = useCallback((bucket: BucketInfo) => {
    if (bucket.public) return 'public'
    if (bucket.policies.length === 0) return 'restricted'
    return 'protected'
  }, []);

  const { mr } = useRTLAwareClasses();

  useEffect(() => {
    if (user) {
      checkAdminStatus()
      loadStoragePolicies()
    }
  }, [user])

  if (!user) {
    return (
      <PageLayout>
        <Card>
          <CardContent className="p-6 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please sign in to access storage policies.</p>
          </CardContent>
        </Card>
      </PageLayout>
    )
  }

  if (!isAdmin) {
    return (
      <PageLayout>
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground">Only administrators can view storage policies and sensitive bucket information.</p>
          </CardContent>
        </Card>
      </PageLayout>
    )
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-english'}>
    <PageLayout>
      <PageHeader
        title={t('storage_policies')}
        description={t('monitor_manage_policies')}
      >
        <Button onClick={loadStoragePolicies} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 ${mr('2')} ${loading ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </Button>
      </PageHeader>


      <div className="space-y-6">
        {/* Enhanced Hero Dashboard */}
        <StoragePoliciesHero 
          totalBuckets={policiesStats.totalBuckets}
          publicBuckets={policiesStats.publicBuckets}
          protectedBuckets={policiesStats.protectedBuckets}
          unprotectedBuckets={policiesStats.unprotectedBuckets}
          totalPolicies={policiesStats.totalPolicies}
          securityScore={policiesStats.securityScore}
          lastReview={policiesStats.lastReview}
          criticalIssues={policiesStats.criticalIssues}
        />

        {/* Policy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Unlock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('public_buckets')}</p>
                <p className="text-2xl font-bold">
                  {buckets.filter(b => b.public).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('protected_buckets')}</p>
                <p className="text-2xl font-bold">
                  {buckets.filter(b => !b.public && b.policies.length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('unprotected_buckets')}</p>
                <p className="text-2xl font-bold">
                  {buckets.filter(b => !b.public && b.policies.length === 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bucket Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t('bucket_access_policies')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">{t('loading')}</p>
            </div>
          ) : buckets.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">{t('no_storage_buckets')}</h3>
              <p className="text-muted-foreground">{t('no_storage_buckets_desc')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {buckets.map((bucket) => {
                const securityLevel = getBucketSecurityLevel(bucket)
                return (
                  <div key={bucket.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {securityLevel === 'public' && <Unlock className="w-5 h-5 text-green-500" />}
                          {securityLevel === 'protected' && <Lock className="w-5 h-5 text-blue-500" />}
                          {securityLevel === 'restricted' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                          <h3 className="font-semibold">{bucket.name}</h3>
                        </div>
                        {renderPolicyStatus(bucket)}
                      </div>
                    </div>

                    {bucket.public ? (
                      <Alert>
                        <Unlock className="w-4 h-4" />
                        <AlertDescription>
                          {t('storage.public_access_description')}
                        </AlertDescription>
                      </Alert>
                    ) : bucket.policies.length === 0 ? (
                      <Alert variant="destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          {t('no_access_policies_warning')}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{t('storage.access_policies')}:</p>
                        {bucket.policies.map((policy, index) => {
                          const command = POLICY_COMMANDS[policy.command as keyof typeof POLICY_COMMANDS]
                          const Icon = command?.icon || Shield
                          return (
                            <div key={`${policy.name}-${index}`} className="flex items-center gap-2 p-2 bg-muted rounded">
                              <Icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{policy.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {command?.label || policy.command}
                              </Badge>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('storage.bucket_type')}</p>
                        <p className="font-medium capitalize">{securityLevel}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('storage.access_level')}</p>
                        <p className="font-medium">
                          {bucket.public ? t('public') : t('restricted')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('storage.policies')}</p>
                        <p className="font-medium">{bucket.policies.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('status')}</p>
                        <div className="flex items-center gap-1">
                          {securityLevel === 'public' && (
                            <>
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="font-medium text-green-700">{t('accessible')}</span>
                            </>
                          )}
                          {securityLevel === 'protected' && (
                            <>
                              <CheckCircle className="w-3 h-3 text-blue-500" />
                              <span className="font-medium text-blue-700">{t('protected')}</span>
                            </>
                          )}
                          {securityLevel === 'restricted' && (
                            <>
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              <span className="font-medium text-red-700">{t('restricted')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {t('security_recommendations')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {buckets.filter(b => !b.public && b.policies.length === 0).length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Action Required:</strong> {buckets.filter(b => !b.public && b.policies.length === 0).length} bucket(s) 
                  {t('buckets_no_policies_warning')}
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <Shield className="w-4 h-4" />
              <AlertDescription>
                <strong>{t('storage.best_practices')}:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{t('storage.best_practice_1')}</li>
                  <li>{t('storage.best_practice_2')}</li>
                  <li>{t('storage.best_practice_3')}</li>
                  <li>{t('storage.best_practice_4')}</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      </div>
    </PageLayout>
    </div>
  )
}