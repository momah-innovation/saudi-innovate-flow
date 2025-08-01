import { useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface BucketStats {
  total_files: number
  total_size: number
  avg_file_size: number
  oldest_file: string | null
  newest_file: string | null
}

export interface StorageAnalytics {
  bucketName: string
  stats: BucketStats
  healthStatus: 'healthy' | 'warning' | 'critical'
  usagePercentage: number
}

export const useStorageAnalytics = () => {
  const { toast } = useToast()

  const getBucketStats = useCallback(async (bucketName: string): Promise<BucketStats | null> => {
    try {
      const { data, error } = await supabase.rpc('get_bucket_stats', {
        bucket_name: bucketName
      })

      if (error) {
        console.error('Error getting bucket stats:', error)
        return null
      }

      return Array.isArray(data) && data.length > 0 ? data[0] as BucketStats : null
    } catch (error) {
      console.error('Bucket stats error:', error)
      return null
    }
  }, [])

  const getAllBucketAnalytics = useCallback(async (): Promise<StorageAnalytics[]> => {
    try {
      console.log('Loading bucket analytics...');
      
      // Try database function first, fallback to storage API
      let buckets: any[] = [];
      
      try {
        const { data: dbBuckets, error: dbError } = await supabase
          .rpc('get_basic_storage_info');
        console.log('Analytics database response:', { dbBuckets, dbError });
        
        if (dbError) {
          console.log('Database function failed for analytics, trying storage API...');
          const { data: storageB, error: storageE } = await supabase.storage.listBuckets();
          buckets = storageB || [];
          console.log('Analytics storage API response:', { buckets: storageB, error: storageE });
        } else {
          // Convert database response to storage API format
          buckets = dbBuckets?.map(bucket => ({
            id: bucket.bucket_id,
            name: bucket.bucket_name,
            public: bucket.public,
            created_at: bucket.created_at
          })) || [];
          console.log('Analytics using database buckets:', buckets);
        }
      } catch (error) {
        console.error('Both methods failed for analytics:', error);
        const { data: storageB, error: storageE } = await supabase.storage.listBuckets();
        buckets = storageB || [];
        console.log('Analytics final fallback:', { buckets, error: storageE });
      }
      
      if (!buckets || buckets.length === 0) {
        console.log('No buckets found for analytics');
        return []
      }

      const analytics: StorageAnalytics[] = []

      for (const bucket of buckets) {
        // Always add the bucket to analytics, even if stats fail
        let stats = null;
        try {
          stats = await getBucketStats(bucket.id);
          console.log(`Stats for bucket ${bucket.id}:`, stats);
        } catch (error) {
          console.error(`Failed to get stats for bucket ${bucket.id}:`, error);
        }
        
        // If stats failed, create default empty stats
        if (!stats) {
          stats = {
            total_files: 0,
            total_size: 0,
            avg_file_size: 0,
            oldest_file: null,
            newest_file: null
          };
        }
        
        // Use realistic storage limits - 1GB per bucket for public, 5GB for private
        const bucketLimit = bucket.public ? (1024 * 1024 * 1024) : (5 * 1024 * 1024 * 1024)
        const usagePercentage = stats.total_size > 0 ? (stats.total_size / bucketLimit) * 100 : 0
        const healthStatus = 
          usagePercentage > 90 ? 'critical' :
          usagePercentage > 70 ? 'warning' : 'healthy'

        console.log(`Bucket ${bucket.id} analytics:`, {
          totalSize: stats.total_size,
          bucketLimit,
          usagePercentage,
          healthStatus
        });

        analytics.push({
          bucketName: bucket.id,
          stats,
          healthStatus,
          usagePercentage: Math.min(usagePercentage, 100) // Cap at 100%
        })
      }

      return analytics
    } catch (error) {
      console.error('Analytics error:', error)
      toast({
        title: 'Analytics Error',
        description: 'Failed to load storage analytics',
        variant: 'destructive'
      })
      return []
    }
  }, [getBucketStats, toast])

  const performAdminCleanup = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('admin_cleanup_temp_files')

      if (error) {
        console.error('Admin cleanup error:', error)
        toast({
          title: 'Cleanup Failed',
          description: 'Failed to perform admin cleanup',
          variant: 'destructive'
        })
        return false
      }

      toast({
        title: 'Cleanup Successful',
        description: 'System-wide temporary file cleanup completed'
      })
      return true
    } catch (error) {
      console.error('Admin cleanup error:', error)
      toast({
        title: 'Cleanup Failed',
        description: 'An error occurred during cleanup',
        variant: 'destructive'
      })
      return false
    }
  }, [toast])

  const cleanupOldTempFiles = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('cleanup_old_temp_files')

      if (error) {
        console.error('Temp files cleanup error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Temp files cleanup error:', error)
      return false
    }
  }, [])

  const getAdvancedAnalytics = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_storage_analytics_with_trends')

      if (error) {
        console.error('Advanced analytics error:', error)
        toast({
          title: 'Analytics Error',
          description: 'Failed to load advanced analytics',
          variant: 'destructive'
        })
        return null
      }

      return data
    } catch (error) {
      console.error('Advanced analytics error:', error)
      return null
    }
  }, [toast])

  const archiveOldFiles = useCallback(async (
    sourceBucket: string, 
    daysOld: number = 365, 
    archiveBucket: string = 'archived-files-private'
  ) => {
    try {
      const { data, error } = await supabase.rpc('archive_old_files', {
        source_bucket: sourceBucket,
        days_old: daysOld,
        archive_bucket: archiveBucket
      })

      if (error) {
        console.error('Archive error:', error)
        toast({
          title: 'Archive Failed',
          description: 'Failed to archive files',
          variant: 'destructive'
        })
        return null
      }

      const result = data as any
      toast({
        title: 'Archive Successful',
        description: `Archived ${result.archived_count} files from ${sourceBucket}`
      })
      return result
    } catch (error) {
      console.error('Archive error:', error)
      toast({
        title: 'Archive Failed',
        description: 'An error occurred during archiving',
        variant: 'destructive'
      })
      return null
    }
  }, [toast])

  const bulkCleanupFiles = useCallback(async (
    bucketName: string,
    filePattern: string = '%temp%',
    olderThanDays: number = 7,
    dryRun: boolean = true
  ) => {
    try {
      const { data, error } = await supabase.rpc('bulk_cleanup_files', {
        bucket_name: bucketName,
        file_pattern: filePattern,
        older_than_days: olderThanDays,
        dry_run: dryRun
      })

      if (error) {
        console.error('Bulk cleanup error:', error)
        toast({
          title: 'Cleanup Failed',
          description: 'Failed to perform bulk cleanup',
          variant: 'destructive'
        })
        return null
      }

      const result = data as any
      toast({
        title: dryRun ? 'Cleanup Simulation Complete' : 'Cleanup Successful',
        description: result.message
      })
      return result
    } catch (error) {
      console.error('Bulk cleanup error:', error)
      toast({
        title: 'Cleanup Failed',
        description: 'An error occurred during cleanup',
        variant: 'destructive'
      })
      return null
    }
  }, [toast])

  const exportStorageMetadata = useCallback(async (
    bucketFilter?: string,
    includeFileUrls: boolean = false
  ) => {
    try {
      const { data, error } = await supabase.rpc('export_storage_metadata', {
        bucket_filter: bucketFilter,
        include_file_urls: includeFileUrls
      })

      if (error) {
        console.error('Export error:', error)
        toast({
          title: 'Export Failed',
          description: 'Failed to export storage metadata',
          variant: 'destructive'
        })
        return null
      }

      const result = data as any
      toast({
        title: 'Export Successful',
        description: `Exported ${result.total_files} files from ${result.buckets?.length || 0} buckets`
      })
      return result
    } catch (error) {
      console.error('Export error:', error)
      return null
    }
  }, [toast])

  const migrateBetweenBuckets = useCallback(async (
    sourceBucket: string,
    targetBucket: string,
    filePattern: string = '%',
    preservePaths: boolean = true,
    dryRun: boolean = true
  ) => {
    try {
      const { data, error } = await supabase.rpc('migrate_files_between_buckets', {
        source_bucket: sourceBucket,
        target_bucket: targetBucket,
        file_pattern: filePattern,
        preserve_paths: preservePaths,
        dry_run: dryRun
      })

      if (error) {
        console.error('Migration error:', error)
        toast({
          title: 'Migration Failed',
          description: 'Failed to migrate files between buckets',
          variant: 'destructive'
        })
        return null
      }

      const result = data as any
      toast({
        title: dryRun ? 'Migration Simulation Complete' : 'Migration Successful',
        description: result.message
      })
      return result
    } catch (error) {
      console.error('Migration error:', error)
      return null
    }
  }, [toast])

  const createBucketBackup = useCallback(async (
    sourceBucket: string,
    backupName?: string,
    includeMetadata: boolean = true
  ) => {
    try {
      const { data, error } = await supabase.rpc('create_bucket_backup', {
        source_bucket: sourceBucket,
        backup_name: backupName,
        include_metadata: includeMetadata
      })

      if (error) {
        console.error('Backup error:', error)
        toast({
          title: 'Backup Failed',
          description: 'Failed to create bucket backup',
          variant: 'destructive'
        })
        return null
      }

      const result = data as any
      toast({
        title: 'Backup Successful',
        description: `Created backup "${result.backup_bucket}" with ${result.file_count} files`
      })
      return result
    } catch (error) {
      console.error('Backup error:', error)
      return null
    }
  }, [toast])

  const restoreFromArchive = useCallback(async (
    archiveBucket: string,
    targetBucket?: string,
    filePattern: string = '%',
    restoreOriginalPaths: boolean = true,
    dryRun: boolean = true
  ) => {
    try {
      const { data, error } = await supabase.rpc('restore_from_archive', {
        archive_bucket: archiveBucket,
        target_bucket: targetBucket,
        file_pattern: filePattern,
        restore_original_paths: restoreOriginalPaths,
        dry_run: dryRun
      })

      if (error) {
        console.error('Restore error:', error)
        toast({
          title: 'Restore Failed',
          description: 'Failed to restore files from archive',
          variant: 'destructive'
        })
        return null
      }

      const result = data as any
      toast({
        title: dryRun ? 'Restore Simulation Complete' : 'Restore Successful',
        description: result.message
      })
      return result
    } catch (error) {
      console.error('Restore error:', error)
      return null
    }
  }, [toast])

  const findDuplicateFiles = useCallback(async (
    bucketFilter?: string,
    minFileSize: number = 1024
  ) => {
    try {
      const { data, error } = await supabase.rpc('find_duplicate_files', {
        bucket_filter: bucketFilter,
        min_file_size: minFileSize
      })

      if (error) {
        console.error('Duplicate analysis error:', error)
        toast({
          title: 'Analysis Failed',
          description: 'Failed to analyze duplicate files',
          variant: 'destructive'
        })
        return null
      }

      const result = data as any
      toast({
        title: 'Analysis Complete',
        description: `Found ${result.total_duplicate_groups} groups of duplicate files`
      })
      return result
    } catch (error) {
      console.error('Duplicate analysis error:', error)
      return null
    }
  }, [toast])

  const manageStorageQuotas = useCallback(async (
    bucketName: string,
    quotaBytes?: number,
    action: 'check' | 'set' | 'remove' = 'check'
  ) => {
    try {
      const { data, error } = await supabase.rpc('manage_storage_quotas', {
        bucket_name: bucketName,
        quota_bytes: quotaBytes,
        action: action
      })

      if (error) {
        console.error('Quota management error:', error)
        toast({
          title: 'Quota Management Failed',
          description: 'Failed to manage storage quota',
          variant: 'destructive'
        })
        return null
      }

      const result = data as any
      if (action !== 'check') {
        toast({
          title: 'Quota Management Successful',
          description: `Quota ${action === 'set' ? 'set' : 'removed'} for ${bucketName}`
        })
      }
      return result
    } catch (error) {
      console.error('Quota management error:', error)
      return null
    }
  }, [toast])

  return {
    getBucketStats,
    getAllBucketAnalytics,
    performAdminCleanup,
    cleanupOldTempFiles,
    getAdvancedAnalytics,
    archiveOldFiles,
    bulkCleanupFiles,
    exportStorageMetadata,
    migrateBetweenBuckets,
    createBucketBackup,
    restoreFromArchive,
    findDuplicateFiles,
    manageStorageQuotas
  }
}