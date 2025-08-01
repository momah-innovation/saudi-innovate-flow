import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/ui/page-header'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Database, 
  HardDrive, 
  FolderOpen, 
  Trash2, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Users,
  Lock,
  Unlock
} from 'lucide-react'

interface BucketStats {
  name: string
  isPublic: boolean
  fileCount: number
  totalSize: number
  avgSize: number
  oldestFile: string
  newestFile: string
}

interface StorageUsage {
  totalFiles: number
  totalSize: number
  bucketCount: number
  publicBuckets: number
  privateBuckets: number
}

export const StorageManagementPage: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [buckets, setBuckets] = useState<BucketStats[]>([])
  const [usage, setUsage] = useState<StorageUsage | null>(null)
  const [loading, setLoading] = useState(true)
  const [cleanupProgress, setCleanupProgress] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

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

  const loadBucketStats = async () => {
    try {
      setLoading(true)
      const { data: bucketsData } = await supabase.storage.listBuckets()
      
      if (bucketsData) {
        const bucketStats: BucketStats[] = []
        let totalFiles = 0
        let totalSize = 0
        
        for (const bucket of bucketsData) {
          try {
            // Simple file listing approach since get_bucket_stats might not be available yet
            const { data: files } = await supabase.storage.from(bucket.name).list()
            
            const bucketStat: BucketStats = {
              name: bucket.name,
              isPublic: bucket.public,
              fileCount: files?.length || 0,
              totalSize: 0, // Would need individual file calls to get sizes
              avgSize: 0,
              oldestFile: 'N/A',
              newestFile: 'N/A'
            }
            bucketStats.push(bucketStat)
            totalFiles += bucketStat.fileCount
          } catch (error) {
            console.error(`Error getting stats for bucket ${bucket.name}:`, error)
          }
        }
        
        setBuckets(bucketStats)
        setUsage({
          totalFiles,
          totalSize,
          bucketCount: bucketsData.length,
          publicBuckets: bucketsData.filter(b => b.public).length,
          privateBuckets: bucketsData.filter(b => !b.public).length
        })
      }
    } catch (error) {
      console.error('Error loading bucket stats:', error)
      toast({
        title: 'Error loading storage stats',
        description: 'Failed to fetch storage information',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const cleanupTempFiles = async () => {
    if (!isAdmin) {
      toast({
        title: 'Access denied',
        description: 'Only administrators can perform cleanup operations',
        variant: 'destructive'
      })
      return
    }

    try {
      setCleanupProgress(0)
      const progressInterval = setInterval(() => {
        setCleanupProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const { data, error } = await supabase.functions.invoke('cleanup-temp-files', {
        body: { 
          buckets: ['temp-uploads-private', 'opportunity-images', 'ideas-images-public'] 
        }
      })

      clearInterval(progressInterval)
      setCleanupProgress(100)

      if (error) throw error

      toast({
        title: 'Cleanup completed',
        description: `Cleaned ${data?.cleanedFiles || 0} temporary files`,
        variant: 'default'
      })

      // Reload stats
      await loadBucketStats()
    } catch (error) {
      console.error('Cleanup error:', error)
      toast({
        title: 'Cleanup failed',
        description: 'Failed to cleanup temporary files',
        variant: 'destructive'
      })
    } finally {
      setCleanupProgress(0)
    }
  }

  useEffect(() => {
    if (user) {
      checkAdminStatus()
      loadBucketStats()
    }
  }, [user])

  if (!user) {
    return (
      <PageContainer>
        <Card>
          <CardContent className="p-6 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please sign in to access storage management.</p>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Storage Management"
        description="Manage and monitor storage buckets and files"
        actionButton={
          isAdmin ? {
            label: "Cleanup Temp Files",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: cleanupTempFiles
          } : undefined
        }
      >
        <Button onClick={loadBucketStats} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </PageHeader>

      {cleanupProgress > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Cleaning up temporary files...</span>
            </div>
            <Progress value={cleanupProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Storage Overview */}
      {usage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Storage</p>
                  <p className="text-2xl font-bold">{formatBytes(usage.totalSize)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">{usage.totalFiles.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Buckets</p>
                  <p className="text-2xl font-bold">{usage.bucketCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Public/Private</p>
                  <p className="text-2xl font-bold">{usage.publicBuckets}/{usage.privateBuckets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bucket Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Storage Buckets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading bucket information...</p>
            </div>
          ) : buckets.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Storage Buckets</h3>
              <p className="text-muted-foreground">No storage buckets found in your project.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {buckets.map((bucket) => (
                <div key={bucket.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold">{bucket.name}</h3>
                      <Badge variant={bucket.isPublic ? "default" : "secondary"}>
                        {bucket.isPublic ? (
                          <>
                            <Unlock className="w-3 h-3 mr-1" />
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
                    <div className="flex items-center gap-2">
                      {bucket.fileCount > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Files</p>
                      <p className="font-medium">{bucket.fileCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Size</p>
                      <p className="font-medium">{formatBytes(bucket.totalSize)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Size</p>
                      <p className="font-medium">{formatBytes(bucket.avgSize)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Modified</p>
                      <p className="font-medium">
                        {bucket.newestFile !== 'N/A' 
                          ? new Date(bucket.newestFile).toLocaleDateString()
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Tools */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Administrator Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Cleanup Operations</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Remove temporary files older than 7 days to free up storage space.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={cleanupTempFiles}
                    disabled={cleanupProgress > 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Run Cleanup
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}