import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
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
  id: string
  bucket_id: string
  name: string
  roles: string[]
  cmd: string
  definition: string
  check: string | null
  with_check: boolean
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
  const [buckets, setBuckets] = useState<BucketInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdminStatus = async () => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .in('role', ['admin', 'super_admin'])
        .single()
      
      setIsAdmin(!!data)
    } catch (error) {
      setIsAdmin(false)
    }
  }

  const loadStoragePolicies = async () => {
    try {
      setLoading(true)
      
      // Get buckets
      const { data: bucketsData } = await supabase.storage.listBuckets()
      
      if (!bucketsData) {
        setBuckets([])
        return
      }

      // Get storage policies from information_schema (if accessible)
      const { data: policiesData } = await supabase
        .from('information_schema.tables')
        .select('*')
        .eq('table_schema', 'storage')
        .eq('table_name', 'objects')

      // For now, create a basic structure since we can't directly query storage policies
      const bucketInfo: BucketInfo[] = bucketsData.map(bucket => ({
        id: bucket.id,
        name: bucket.name,
        public: bucket.public,
        policies: []
      }))

      setBuckets(bucketInfo)
    } catch (error) {
      console.error('Error loading storage policies:', error)
      toast({
        title: 'Error loading policies',
        description: 'Failed to fetch storage policy information',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const renderPolicyStatus = (bucket: BucketInfo) => {
    if (bucket.public) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Unlock className="w-3 h-3 mr-1" />
          Public Access
        </Badge>
      )
    }

    if (bucket.policies.length === 0) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="w-3 h-3 mr-1" />
          No Policies
        </Badge>
      )
    }

    return (
      <Badge variant="secondary">
        <Lock className="w-3 h-3 mr-1" />
        {bucket.policies.length} Policies
      </Badge>
    )
  }

  const getBucketSecurityLevel = (bucket: BucketInfo) => {
    if (bucket.public) return 'public'
    if (bucket.policies.length === 0) return 'restricted'
    return 'protected'
  }

  useEffect(() => {
    if (user) {
      checkAdminStatus()
      loadStoragePolicies()
    }
  }, [user])

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please sign in to access storage policies.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Storage Policies</h1>
          <p className="text-muted-foreground">Monitor and manage storage bucket access policies</p>
        </div>
        <Button onClick={loadStoragePolicies} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {!isAdmin && (
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            You have limited access to storage policy information. Contact an administrator for full policy management.
          </AlertDescription>
        </Alert>
      )}

      {/* Policy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Unlock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Public Buckets</p>
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
                <p className="text-sm text-muted-foreground">Protected Buckets</p>
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
                <p className="text-sm text-muted-foreground">Unprotected</p>
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
            Bucket Access Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading policy information...</p>
            </div>
          ) : buckets.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Storage Buckets</h3>
              <p className="text-muted-foreground">No storage buckets found in your project.</p>
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
                          This bucket is publicly accessible. All files can be viewed and downloaded by anyone with the URL.
                        </AlertDescription>
                      </Alert>
                    ) : bucket.policies.length === 0 ? (
                      <Alert variant="destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          This bucket has no access policies defined. Files may not be accessible to users.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Access Policies:</p>
                        {bucket.policies.map((policy) => {
                          const command = POLICY_COMMANDS[policy.cmd as keyof typeof POLICY_COMMANDS]
                          const Icon = command?.icon || Shield
                          return (
                            <div key={policy.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                              <Icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{policy.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {command?.label || policy.cmd}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                for {policy.roles.join(', ')}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Bucket Type</p>
                        <p className="font-medium capitalize">{securityLevel}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Access Level</p>
                        <p className="font-medium">
                          {bucket.public ? 'Public' : 'Restricted'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Policies</p>
                        <p className="font-medium">{bucket.policies.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <div className="flex items-center gap-1">
                          {securityLevel === 'public' && (
                            <>
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="font-medium text-green-700">Accessible</span>
                            </>
                          )}
                          {securityLevel === 'protected' && (
                            <>
                              <CheckCircle className="w-3 h-3 text-blue-500" />
                              <span className="font-medium text-blue-700">Protected</span>
                            </>
                          )}
                          {securityLevel === 'restricted' && (
                            <>
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              <span className="font-medium text-red-700">Restricted</span>
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
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {buckets.filter(b => !b.public && b.policies.length === 0).length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Action Required:</strong> {buckets.filter(b => !b.public && b.policies.length === 0).length} bucket(s) 
                  have no access policies. Users may not be able to access files in these buckets.
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <Shield className="w-4 h-4" />
              <AlertDescription>
                <strong>Best Practices:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Use public buckets only for assets that should be universally accessible</li>
                  <li>Implement row-level security policies for user-specific content</li>
                  <li>Regularly review and audit storage access policies</li>
                  <li>Use temporary upload buckets for sensitive operations</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}