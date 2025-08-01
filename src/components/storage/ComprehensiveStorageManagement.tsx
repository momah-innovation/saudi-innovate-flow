import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { 
  Archive, 
  FileX, 
  Download, 
  Upload, 
  Move, 
  RotateCcw, 
  Copy, 
  Settings, 
  TrendingUp, 
  Shield, 
  Loader2,
  Database,
  HardDrive,
  Zap,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useStorageAnalytics } from '@/hooks/useStorageAnalytics'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/hooks/useAppTranslation'

interface DuplicateFile {
  filename: string
  file_size: number
  duplicate_count: number
  potential_savings: number
  files: Array<{
    bucket_id: string
    full_path: string
    created_at: string
    owner: string
  }>
}

interface QuotaInfo {
  bucket_name: string
  current_usage: number
  has_quota: boolean
  quota_bytes: number
  usage_percentage: number
  quota_exceeded: boolean
}

export const ComprehensiveStorageManagement = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  const { 
    getAllBucketAnalytics,
    exportStorageMetadata,
    migrateBetweenBuckets,
    createBucketBackup,
    restoreFromArchive,
    findDuplicateFiles,
    manageStorageQuotas,
    archiveOldFiles,
    bulkCleanupFiles
  } = useStorageAnalytics()

  const [buckets, setBuckets] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('export')

  // Export & Migration state
  const [exportSettings, setExportSettings] = useState({
    bucketFilter: 'all',
    includeUrls: false
  })

  const [migrationSettings, setMigrationSettings] = useState({
    sourceBucket: '',
    targetBucket: '',
    filePattern: '%',
    preservePaths: true,
    dryRun: true
  })

  const [backupSettings, setBackupSettings] = useState({
    sourceBucket: '',
    backupName: '',
    includeMetadata: true
  })

  // Recovery state
  const [restoreSettings, setRestoreSettings] = useState({
    archiveBucket: '',
    targetBucket: '',
    filePattern: '%',
    restoreOriginalPaths: true,
    dryRun: true
  })

  // Optimization state
  const [duplicateResults, setDuplicateResults] = useState<any>(null)
  const [optimizationSettings, setOptimizationSettings] = useState({
    bucketFilter: 'all',
    minFileSize: 1024
  })

  // Quota management state
  const [quotaSettings, setQuotaSettings] = useState({
    bucketName: '',
    quotaBytes: 0,
    action: 'check' as 'check' | 'set' | 'remove'
  })
  const [quotaResults, setQuotaResults] = useState<QuotaInfo[]>([])

  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadBuckets()
  }, [])

  const loadBuckets = async () => {
    try {
      const bucketAnalytics = await getAllBucketAnalytics()
      const bucketNames = bucketAnalytics.map(b => b.bucketName)
      setBuckets(bucketNames)
    } catch (error) {
      console.error('Failed to load buckets:', error)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadExportData = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExport = async () => {
    setIsProcessing(true)
    try {
      const result = await exportStorageMetadata(
        exportSettings.bucketFilter === 'all' ? undefined : exportSettings.bucketFilter,
        exportSettings.includeUrls
      )
      
      if (result) {
        const filename = `storage-export-${exportSettings.bucketFilter === 'all' ? 'all' : exportSettings.bucketFilter}-${new Date().toISOString().split('T')[0]}.json`
        downloadExportData(result, filename)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMigration = async () => {
    if (!migrationSettings.sourceBucket || !migrationSettings.targetBucket) {
      toast({
        title: t('missing_information'),
        description: t('select_source_target'),
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)
    try {
      await migrateBetweenBuckets(
        migrationSettings.sourceBucket,
        migrationSettings.targetBucket,
        migrationSettings.filePattern,
        migrationSettings.preservePaths,
        migrationSettings.dryRun
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBackup = async () => {
    if (!backupSettings.sourceBucket) {
      toast({
        title: t('missing_information'),
        description: t('select_source_bucket_msg'),
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)
    try {
      await createBucketBackup(
        backupSettings.sourceBucket,
        backupSettings.backupName || undefined,
        backupSettings.includeMetadata
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRestore = async () => {
    if (!restoreSettings.archiveBucket) {
      toast({
        title: t('missing_information'),
        description: t('select_archive_bucket_msg'),
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)
    try {
      await restoreFromArchive(
        restoreSettings.archiveBucket,
        restoreSettings.targetBucket || undefined,
        restoreSettings.filePattern,
        restoreSettings.restoreOriginalPaths,
        restoreSettings.dryRun
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDuplicateAnalysis = async () => {
    setIsProcessing(true)
    try {
      const result = await findDuplicateFiles(
        optimizationSettings.bucketFilter === 'all' ? undefined : optimizationSettings.bucketFilter,
        optimizationSettings.minFileSize
      )
      setDuplicateResults(result)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuotaManagement = async () => {
    if (!quotaSettings.bucketName) {
      toast({
        title: t('missing_information'),
        description: t('select_bucket_msg'),
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await manageStorageQuotas(
        quotaSettings.bucketName,
        quotaSettings.action === 'set' ? quotaSettings.quotaBytes : undefined,
        quotaSettings.action
      )
      
      if (result) {
        // Refresh quota results for all buckets
        const allQuotas = []
        for (const bucket of buckets) {
          const quotaInfo = await manageStorageQuotas(bucket, undefined, 'check')
          if (quotaInfo) {
            allQuotas.push(quotaInfo as QuotaInfo)
          }
        }
        setQuotaResults(allQuotas)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('comprehensive_storage_management')}
          </CardTitle>
          <CardDescription>
            {t('complete_storage_operations')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="export">{t('export_migration')}</TabsTrigger>
              <TabsTrigger value="backup">{t('backup_recovery')}</TabsTrigger>
              <TabsTrigger value="optimization">{t('optimization')}</TabsTrigger>
              <TabsTrigger value="quotas">{t('quotas_monitoring')}</TabsTrigger>
              <TabsTrigger value="tools">{t('advanced_tools')}</TabsTrigger>
            </TabsList>

            {/* Export & Migration Tab */}
            <TabsContent value="export" className="space-y-6">
              {/* Storage Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    {t('storage_export')}
                  </CardTitle>
                  <CardDescription>
                    {t('storage_export_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exportBucket">{t('bucket_filter')}</Label>
                      <Select 
                        value={exportSettings.bucketFilter} 
                        onValueChange={(value) => setExportSettings(prev => ({ ...prev, bucketFilter: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('all_buckets')} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">{t('all_buckets')}</SelectItem>
                          {buckets.map(bucket => (
                            <SelectItem key={bucket} value={bucket}>{bucket}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="includeUrls">{t('include_public_urls')}</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="includeUrls"
                          checked={exportSettings.includeUrls}
                          onCheckedChange={(checked) => setExportSettings(prev => ({ ...prev, includeUrls: checked }))}
                        />
                        <Label htmlFor="includeUrls" className="text-sm">
                          {t('export_public_urls')}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleExport} disabled={isProcessing}>
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {t('export_storage_data')}
                  </Button>
                </CardContent>
              </Card>

              {/* Cross-Bucket Migration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Move className="h-5 w-5" />
                    {t('cross_bucket_migration')}
                  </CardTitle>
                  <CardDescription>
                    {t('migration_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sourceBucket">{t('source_bucket')}</Label>
                      <Select 
                        value={migrationSettings.sourceBucket} 
                        onValueChange={(value) => setMigrationSettings(prev => ({ ...prev, sourceBucket: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_source_bucket')} />
                        </SelectTrigger>
                        <SelectContent>
                          {buckets.map(bucket => (
                            <SelectItem key={bucket} value={bucket}>{bucket}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetBucket">{t('target_bucket')}</Label>
                      <Input
                        id="targetBucket"
                        value={migrationSettings.targetBucket}
                        onChange={(e) => setMigrationSettings(prev => ({ ...prev, targetBucket: e.target.value }))}
                        placeholder={t('target_bucket_name')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filePattern">{t('file_pattern')}</Label>
                      <Input
                        id="filePattern"
                        value={migrationSettings.filePattern}
                        onChange={(e) => setMigrationSettings(prev => ({ ...prev, filePattern: e.target.value }))}
                        placeholder="%"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preservePaths">{t('preserve_paths')}</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="preservePaths"
                          checked={migrationSettings.preservePaths}
                          onCheckedChange={(checked) => setMigrationSettings(prev => ({ ...prev, preservePaths: checked }))}
                        />
                        <Label htmlFor="preservePaths" className="text-sm">
                          {t('keep_original_paths')}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="migrationDryRun"
                      checked={migrationSettings.dryRun}
                      onCheckedChange={(checked) => setMigrationSettings(prev => ({ ...prev, dryRun: checked }))}
                    />
                    <Label htmlFor="migrationDryRun" className="text-sm">
                      {migrationSettings.dryRun ? t('simulation_only') : t('actually_migrate')}
                    </Label>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        disabled={isProcessing || !migrationSettings.sourceBucket || !migrationSettings.targetBucket}
                        variant={migrationSettings.dryRun ? "outline" : "default"}
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Move className="h-4 w-4 mr-2" />
                        )}
                        {migrationSettings.dryRun ? t('simulate_migration') : t('execute_migration')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('confirm_migration')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('migration_confirm_text', {
                            dryRun: migrationSettings.dryRun ? t('simulate') : t('actually'),
                            source: migrationSettings.sourceBucket,
                            target: migrationSettings.targetBucket,
                            warning: !migrationSettings.dryRun ? t('migration_warning') : ''
                          })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMigration}>
                          {migrationSettings.dryRun ? t('simulate') : t('migrate')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Backup & Recovery Tab */}
            <TabsContent value="backup" className="space-y-6">
              {/* Backup Creation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="h-5 w-5" />
                    {t('create_backup')}
                  </CardTitle>
                  <CardDescription>
                    {t('backup_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="backupSource">{t('source_bucket')}</Label>
                      <Select 
                        value={backupSettings.sourceBucket} 
                        onValueChange={(value) => setBackupSettings(prev => ({ ...prev, sourceBucket: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_source_bucket')} />
                        </SelectTrigger>
                        <SelectContent>
                          {buckets.map(bucket => (
                            <SelectItem key={bucket} value={bucket}>{bucket}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupName">{t('backup_name')}</Label>
                      <Input
                        id="backupName"
                        value={backupSettings.backupName}
                        onChange={(e) => setBackupSettings(prev => ({ ...prev, backupName: e.target.value }))}
                        placeholder={t('optional_backup_name')}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeMetadata"
                      checked={backupSettings.includeMetadata}
                      onCheckedChange={(checked) => setBackupSettings(prev => ({ ...prev, includeMetadata: checked }))}
                    />
                    <Label htmlFor="includeMetadata" className="text-sm">
                      {t('backup_with_metadata')}
                    </Label>
                  </div>
                  
                  <Button onClick={handleBackup} disabled={isProcessing || !backupSettings.sourceBucket}>
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Archive className="h-4 w-4 mr-2" />
                    )}
                    {t('create_bucket_backup')}
                  </Button>
                </CardContent>
              </Card>

              {/* Restore from Archive */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    {t('restore_from_archive')}
                  </CardTitle>
                  <CardDescription>
                    {t('restore_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="archiveBucket">{t('archive_bucket')}</Label>
                      <Select 
                        value={restoreSettings.archiveBucket} 
                        onValueChange={(value) => setRestoreSettings(prev => ({ ...prev, archiveBucket: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_archive_bucket')} />
                        </SelectTrigger>
                        <SelectContent>
                          {buckets.filter(b => b.includes('archive') || b.includes('backup')).map(bucket => (
                            <SelectItem key={bucket} value={bucket}>{bucket}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restoreTarget">{t('target_bucket')} ({t('optional')})</Label>
                      <Input
                        id="restoreTarget"
                        value={restoreSettings.targetBucket}
                        onChange={(e) => setRestoreSettings(prev => ({ ...prev, targetBucket: e.target.value }))}
                        placeholder={t('auto_detect_metadata')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restorePattern">{t('file_pattern')}</Label>
                      <Input
                        id="restorePattern"
                        value={restoreSettings.filePattern}
                        onChange={(e) => setRestoreSettings(prev => ({ ...prev, filePattern: e.target.value }))}
                        placeholder="%"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restoreOriginalPaths">{t('restore_original_paths')}</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="restoreOriginalPaths"
                          checked={restoreSettings.restoreOriginalPaths}
                          onCheckedChange={(checked) => setRestoreSettings(prev => ({ ...prev, restoreOriginalPaths: checked }))}
                        />
                        <Label htmlFor="restoreOriginalPaths" className="text-sm">
                          {t('restore_to_original')}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="restoreDryRun"
                      checked={restoreSettings.dryRun}
                      onCheckedChange={(checked) => setRestoreSettings(prev => ({ ...prev, dryRun: checked }))}
                    />
                    <Label htmlFor="restoreDryRun" className="text-sm">
                      {restoreSettings.dryRun ? t('simulation_only') : t('actually_restore')}
                    </Label>
                  </div>
                  
                  <Button 
                    onClick={handleRestore} 
                    disabled={isProcessing || !restoreSettings.archiveBucket}
                    variant={restoreSettings.dryRun ? "outline" : "default"}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    )}
                    {restoreSettings.dryRun ? t('simulate_restore') : t('execute_restore')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Optimization Tab */}
            <TabsContent value="optimization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {t('storage_optimization')}
                  </CardTitle>
                  <CardDescription>
                    {t('analyze_optimize_storage_usage')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="optimizationBucket">{t('bucket_filter')}</Label>
                      <Select 
                        value={optimizationSettings.bucketFilter} 
                        onValueChange={(value) => setOptimizationSettings(prev => ({ ...prev, bucketFilter: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('all_buckets')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('all_buckets')}</SelectItem>
                          {buckets.map(bucket => (
                            <SelectItem key={bucket} value={bucket}>{bucket}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minFileSize">{t('minimum_file_size')}</Label>
                      <Input
                        id="minFileSize"
                        type="number"
                        value={optimizationSettings.minFileSize}
                        onChange={(e) => setOptimizationSettings(prev => ({ ...prev, minFileSize: parseInt(e.target.value) || 1024 }))}
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleDuplicateAnalysis} disabled={isProcessing}>
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Analyze Duplicates
                  </Button>

                  {duplicateResults && (
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Duplicate Groups</p>
                          <p className="text-2xl font-bold">{duplicateResults.total_duplicate_groups}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Duplicate Files</p>
                          <p className="text-2xl font-bold">{duplicateResults.total_duplicate_files}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Potential Savings</p>
                          <p className="text-2xl font-bold text-green-600">{formatBytes(duplicateResults.potential_savings_bytes)}</p>
                        </div>
                      </div>

                      {duplicateResults.duplicates && duplicateResults.duplicates.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Top Duplicate Files</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-2">Filename</th>
                                  <th className="text-right p-2">Size</th>
                                  <th className="text-right p-2">Count</th>
                                  <th className="text-right p-2">Savings</th>
                                </tr>
                              </thead>
                              <tbody>
                                {duplicateResults.duplicates.slice(0, 10).map((dup: DuplicateFile, index: number) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2 font-medium">{dup.filename}</td>
                                    <td className="p-2 text-right">{formatBytes(dup.file_size)}</td>
                                    <td className="p-2 text-right">{dup.duplicate_count}</td>
                                    <td className="p-2 text-right text-green-600">{formatBytes(dup.potential_savings)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quotas & Monitoring Tab */}
            <TabsContent value="quotas" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Storage Quotas & Monitoring
                  </CardTitle>
                  <CardDescription>
                    Set and monitor storage quotas for individual buckets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quotaBucket">Bucket</Label>
                      <Select 
                        value={quotaSettings.bucketName} 
                        onValueChange={(value) => setQuotaSettings(prev => ({ ...prev, bucketName: value }))}
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
                      <Label htmlFor="quotaAction">Action</Label>
                      <Select 
                        value={quotaSettings.action} 
                        onValueChange={(value: 'check' | 'set' | 'remove') => setQuotaSettings(prev => ({ ...prev, action: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="check">Check Quota</SelectItem>
                          <SelectItem value="set">Set Quota</SelectItem>
                          <SelectItem value="remove">Remove Quota</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {quotaSettings.action === 'set' && (
                      <div className="space-y-2">
                        <Label htmlFor="quotaBytes">Quota (MB)</Label>
                        <Input
                          id="quotaBytes"
                          type="number"
                          value={Math.round(quotaSettings.quotaBytes / (1024 * 1024))}
                          onChange={(e) => setQuotaSettings(prev => ({ 
                            ...prev, 
                            quotaBytes: (parseInt(e.target.value) || 0) * 1024 * 1024 
                          }))}
                          min="1"
                          placeholder="Size in MB"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button onClick={handleQuotaManagement} disabled={isProcessing || !quotaSettings.bucketName}>
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Settings className="h-4 w-4 mr-2" />
                    )}
                    {quotaSettings.action === 'check' ? 'Check Quota' : 
                     quotaSettings.action === 'set' ? 'Set Quota' : 'Remove Quota'}
                  </Button>

                  {quotaResults.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h4 className="font-medium">Quota Status Overview</h4>
                      <div className="space-y-3">
                        {quotaResults.map((quota) => (
                          <div key={quota.bucket_name} className="border rounded p-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{quota.bucket_name}</span>
                              <div className="flex items-center gap-2">
                                {quota.quota_exceeded ? (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ) : quota.usage_percentage > 80 ? (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                <span className="text-sm">
                                  {quota.has_quota ? `${quota.usage_percentage.toFixed(1)}%` : 'No quota'}
                                </span>
                              </div>
                            </div>
                            {quota.has_quota && (
                              <div className="space-y-1">
                                <Progress value={Math.min(quota.usage_percentage, 100)} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{formatBytes(quota.current_usage)}</span>
                                  <span>{formatBytes(quota.quota_bytes)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Tools Tab */}
            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Archive className="h-5 w-5" />
                      Archive Management
                    </CardTitle>
                    <CardDescription>
                      Archive old files to free up space
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Source Bucket</Label>
                          <Select>
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
                          <Label>Days Old</Label>
                          <Input type="number" defaultValue="365" min="1" />
                        </div>
                      </div>
                      <Button className="w-full" disabled={isProcessing}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileX className="h-5 w-5" />
                      Bulk Cleanup
                    </CardTitle>
                    <CardDescription>
                      Clean up files by pattern
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Bucket</Label>
                          <Select>
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
                          <Label>Pattern</Label>
                          <Input defaultValue="%temp%" placeholder="File pattern" />
                        </div>
                        <div className="space-y-2">
                          <Label>Older than (days)</Label>
                          <Input type="number" defaultValue="7" min="1" />
                        </div>
                      </div>
                      <Button className="w-full" variant="destructive" disabled={isProcessing}>
                        <FileX className="h-4 w-4 mr-2" />
                        Cleanup Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}