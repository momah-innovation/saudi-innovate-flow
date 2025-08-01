import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Archive, FileX, Download, TrendingUp, Settings, Loader2 } from 'lucide-react'
import { useStorageAnalytics } from '@/hooks/useStorageAnalytics'
import { useToast } from '@/hooks/use-toast'

interface AdvancedAnalytics {
  total_storage: number
  bucket_count: number
  total_files: number
  bucket_stats: Array<{
    bucket_id: string
    bucket_name: string
    is_public: boolean
    file_count: number
    total_size: number
    oldest_file: string | null
    newest_file: string | null
    avg_file_size: number
  }>
  growth_trend: {
    recent_files: number
    recent_size: number
    previous_files: number
    previous_size: number
    growth_rate_files: number
    growth_rate_size: number
  }
  generated_at: string
}

export const AdvancedStorageManagement = () => {
  const { toast } = useToast()
  const { 
    getAdvancedAnalytics, 
    archiveOldFiles, 
    bulkCleanupFiles, 
    getAllBucketAnalytics 
  } = useStorageAnalytics()

  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [buckets, setBuckets] = useState<string[]>([])

  // Archive settings
  const [archiveSettings, setArchiveSettings] = useState({
    sourceBucket: '',
    daysOld: 365,
    archiveBucket: 'archived-files-private'
  })

  // Cleanup settings
  const [cleanupSettings, setCleanupSettings] = useState({
    bucketName: '',
    filePattern: '%temp%',
    olderThanDays: 7,
    dryRun: true
  })

  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadAnalytics()
    loadBuckets()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getAdvancedAnalytics()
      if (data) {
        setAnalytics(data as unknown as AdvancedAnalytics)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBuckets = async () => {
    try {
      const bucketAnalytics = await getAllBucketAnalytics()
      const bucketNames = bucketAnalytics.map(b => b.bucketName)
      setBuckets(bucketNames)
    } catch (error) {
      console.error('Failed to load buckets:', error)
    }
  }

  const handleArchive = async () => {
    if (!archiveSettings.sourceBucket) {
      toast({
        title: 'Missing Information',
        description: 'Please select a source bucket',
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)
    try {
      await archiveOldFiles(
        archiveSettings.sourceBucket,
        archiveSettings.daysOld,
        archiveSettings.archiveBucket
      )
      await loadAnalytics()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkCleanup = async () => {
    if (!cleanupSettings.bucketName) {
      toast({
        title: 'Missing Information',
        description: 'Please select a bucket',
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)
    try {
      await bulkCleanupFiles(
        cleanupSettings.bucketName,
        cleanupSettings.filePattern,
        cleanupSettings.olderThanDays,
        cleanupSettings.dryRun
      )
      if (!cleanupSettings.dryRun) {
        await loadAnalytics()
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Advanced Analytics
            </CardTitle>
            <CardDescription>
              Detailed storage analytics with growth trends
            </CardDescription>
          </div>
          <Button 
            onClick={loadAnalytics} 
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Refresh'
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {analytics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Total Storage</p>
                <p className="text-2xl font-bold">{formatBytes(analytics.total_storage)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Total Files</p>
                <p className="text-2xl font-bold">{analytics.total_files.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Buckets</p>
                <p className="text-2xl font-bold">{analytics.bucket_count}</p>
              </div>
              
              {analytics.growth_trend && (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">File Growth (30d)</p>
                    <p className={`text-2xl font-bold ${analytics.growth_trend.growth_rate_files >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analytics.growth_trend.growth_rate_files.toFixed(1)}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Size Growth (30d)</p>
                    <p className={`text-2xl font-bold ${analytics.growth_trend.growth_rate_size >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analytics.growth_trend.growth_rate_size.toFixed(1)}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recent Files</p>
                    <p className="text-2xl font-bold">{analytics.growth_trend.recent_files}</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Click refresh to load analytics</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Archiving */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archive Old Files
          </CardTitle>
          <CardDescription>
            Move old files to an archive bucket to free up space
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceBucket">Source Bucket</Label>
              <Select 
                value={archiveSettings.sourceBucket} 
                onValueChange={(value) => setArchiveSettings(prev => ({ ...prev, sourceBucket: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bucket" />
                </SelectTrigger>
                <SelectContent>
                  {buckets.map(bucket => (
                    <SelectItem key={bucket} value={bucket}>{bucket}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="daysOld">Files Older Than (days)</Label>
              <Input
                id="daysOld"
                type="number"
                value={archiveSettings.daysOld}
                onChange={(e) => setArchiveSettings(prev => ({ ...prev, daysOld: parseInt(e.target.value) || 365 }))}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="archiveBucket">Archive Bucket</Label>
              <Input
                id="archiveBucket"
                value={archiveSettings.archiveBucket}
                onChange={(e) => setArchiveSettings(prev => ({ ...prev, archiveBucket: e.target.value }))}
                placeholder="archived-files-private"
              />
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isProcessing || !archiveSettings.sourceBucket}>
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Archive className="h-4 w-4 mr-2" />
                )}
                Archive Files
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive Old Files</AlertDialogTitle>
                <AlertDialogDescription>
                  This will move files older than {archiveSettings.daysOld} days from "{archiveSettings.sourceBucket}" 
                  to "{archiveSettings.archiveBucket}". This action cannot be undone easily.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleArchive}>
                  Archive Files
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Bulk Cleanup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileX className="h-5 w-5" />
            Bulk File Cleanup
          </CardTitle>
          <CardDescription>
            Clean up files matching specific patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cleanupBucket">Bucket</Label>
              <Select 
                value={cleanupSettings.bucketName} 
                onValueChange={(value) => setCleanupSettings(prev => ({ ...prev, bucketName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bucket" />
                </SelectTrigger>
                <SelectContent>
                  {buckets.map(bucket => (
                    <SelectItem key={bucket} value={bucket}>{bucket}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filePattern">File Pattern</Label>
              <Input
                id="filePattern"
                value={cleanupSettings.filePattern}
                onChange={(e) => setCleanupSettings(prev => ({ ...prev, filePattern: e.target.value }))}
                placeholder="%temp%"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cleanupDays">Older Than (days)</Label>
              <Input
                id="cleanupDays"
                type="number"
                value={cleanupSettings.olderThanDays}
                onChange={(e) => setCleanupSettings(prev => ({ ...prev, olderThanDays: parseInt(e.target.value) || 7 }))}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dryRun">Dry Run</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="dryRun"
                  checked={cleanupSettings.dryRun}
                  onCheckedChange={(checked) => setCleanupSettings(prev => ({ ...prev, dryRun: checked }))}
                />
                <Label htmlFor="dryRun" className="text-sm">
                  {cleanupSettings.dryRun ? 'Simulation only' : 'Actually delete'}
                </Label>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleBulkCleanup} 
            disabled={isProcessing || !cleanupSettings.bucketName}
            variant={cleanupSettings.dryRun ? "outline" : "destructive"}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FileX className="h-4 w-4 mr-2" />
            )}
            {cleanupSettings.dryRun ? 'Simulate Cleanup' : 'Execute Cleanup'}
          </Button>
        </CardContent>
      </Card>

      {/* Bucket Details */}
      {analytics?.bucket_stats && analytics.bucket_stats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bucket Details</CardTitle>
            <CardDescription>
              Detailed statistics for each storage bucket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Bucket</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-right p-2">Files</th>
                    <th className="text-right p-2">Size</th>
                    <th className="text-right p-2">Avg File Size</th>
                    <th className="text-left p-2">Oldest File</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.bucket_stats.map((bucket) => (
                    <tr key={bucket.bucket_id} className="border-b">
                      <td className="p-2 font-medium">{bucket.bucket_name}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          bucket.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bucket.is_public ? 'Public' : 'Private'}
                        </span>
                      </td>
                      <td className="p-2 text-right">{bucket.file_count.toLocaleString()}</td>
                      <td className="p-2 text-right">{formatBytes(bucket.total_size)}</td>
                      <td className="p-2 text-right">{formatBytes(bucket.avg_file_size)}</td>
                      <td className="p-2">
                        {bucket.oldest_file ? new Date(bucket.oldest_file).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}