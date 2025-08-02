import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useStorageAnalytics, StorageAnalytics } from '@/hooks/useStorageAnalytics'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/hooks/useAppTranslation'
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Trash2,
  HardDrive,
  BarChart3
} from 'lucide-react'

interface StorageAnalyticsTabProps {
  className?: string
}

export function StorageAnalyticsTab({ className }: StorageAnalyticsTabProps) {
  const [analytics, setAnalytics] = useState<StorageAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [cleanupLoading, setCleanupLoading] = useState(false)
  const [showCleanupDialog, setShowCleanupDialog] = useState(false)
  
  const { getAllBucketAnalytics, performAdminCleanup } = useStorageAnalytics()
  const { toast } = useToast()
  const { t, isRTL } = useTranslation()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getAllBucketAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminCleanup = async () => {
    setCleanupLoading(true)
    try {
      const success = await performAdminCleanup()
      if (success) {
        await loadAnalytics()
        setShowCleanupDialog(false)
      }
    } finally {
      setCleanupLoading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return `0 ${t('bytes')}`
    const k = 1024
    const sizes = [t('bytes'), t('kb'), t('mb'), t('gb'), t('tb')]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <HardDrive className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`space-y-6 ${isRTL ? 'font-arabic' : 'font-english'} ${className}`}>
      {/* Admin Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              {t('storage_management')}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadAnalytics} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {t('refresh')}
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setShowCleanupDialog(true)}
                disabled={cleanupLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {cleanupLoading ? t('cleaning') : t('admin_cleanup')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {analytics.reduce((sum, item) => sum + item.stats.total_files, 0)}
              </div>
              <div className="text-sm text-muted-foreground">{t('total_files')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatBytes(analytics.reduce((sum, item) => sum + item.stats.total_size, 0))}
              </div>
              <div className="text-sm text-muted-foreground">{t('total_size')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {analytics.length}
              </div>
              <div className="text-sm text-muted-foreground">{t('active_buckets')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {t('healthy_buckets')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {analytics.filter(a => a.healthStatus === 'healthy').length}
            </div>
            <p className="text-sm text-muted-foreground">{t('operating_normally')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              {t('warning_buckets')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {analytics.filter(a => a.healthStatus === 'warning').length}
            </div>
            <p className="text-sm text-muted-foreground">{t('approaching_limits')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {t('critical_buckets')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {analytics.filter(a => a.healthStatus === 'critical').length}
            </div>
            <p className="text-sm text-muted-foreground">{t('need_attention')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Bucket Analytics - Table Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('bucket_details')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">{t('status')}</TableHead>
                  <TableHead>{t('bucket_name')}</TableHead>
                  <TableHead className="text-center">{t('files')}</TableHead>
                  <TableHead className="text-center">{t('size')}</TableHead>
                  <TableHead className="text-center">{t('usage')}</TableHead>
                  <TableHead className="text-center">{t('oldest_file')}</TableHead>
                  <TableHead className="text-center">{t('newest_file')}</TableHead>
                  <TableHead className="text-center">{t('health')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {t('no_bucket_data')}
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics.map((item) => (
                    <TableRow key={item.bucketName} className="hover:bg-muted/50">
                      <TableCell>
                        {getHealthIcon(item.healthStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.bucketName}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-mono text-sm">
                          {item.stats.total_files.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-mono text-sm">
                          {formatBytes(item.stats.total_size)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-sm font-medium">
                            {item.usagePercentage.toFixed(1)}%
                          </div>
                          <Progress 
                            value={Math.min(item.usagePercentage, 100)} 
                            className="h-1.5 w-16"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-xs text-muted-foreground">
                          {item.stats.oldest_file 
                            ? new Date(item.stats.oldest_file).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : t('na')
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-xs text-muted-foreground">
                          {item.stats.newest_file 
                            ? new Date(item.stats.newest_file).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : t('na')
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={
                            item.healthStatus === 'healthy' ? 'default' : 
                            item.healthStatus === 'warning' ? 'secondary' : 
                            'destructive'
                          }
                          className="text-xs"
                        >
                          {t(item.healthStatus as 'healthy' | 'warning' | 'critical')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Admin Cleanup Confirmation Dialog */}
      <AlertDialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
        <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-english'}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              {t('admin_cleanup_confirmation')}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>{t('admin_cleanup_description')}</p>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">{t('cleanup_warning')}</p>
                    <ul className="text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                      <li>• {t('cleanup_warning_text_1')}</li>
                      <li>• {t('cleanup_warning_text_2')}</li>
                      <li>• {t('cleanup_warning_text_3')}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{t('continue_question')}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAdminCleanup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cleanupLoading}
            >
              {cleanupLoading ? t('cleaning') : t('yes_perform_cleanup')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}