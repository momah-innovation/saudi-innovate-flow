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
          .rpc('get_storage_buckets_info');
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
        }
      } catch (error) {
        console.error('Both methods failed for analytics:', error);
        const { data: storageB, error: storageE } = await supabase.storage.listBuckets();
        buckets = storageB || [];
      }
      
      if (!buckets || buckets.length === 0) {
        console.log('No buckets found for analytics');
        return []
      }

      const analytics: StorageAnalytics[] = []

      for (const bucket of buckets) {
        const stats = await getBucketStats(bucket.id)
        console.log(`Stats for bucket ${bucket.id}:`, stats);
        
        if (stats) {
          // Use realistic storage limits - 1GB per bucket for public, 5GB for private
          const bucketLimit = bucket.public ? (1024 * 1024 * 1024) : (5 * 1024 * 1024 * 1024)
          const usagePercentage = (stats.total_size / bucketLimit) * 100
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

  return {
    getBucketStats,
    getAllBucketAnalytics,
    performAdminCleanup,
    cleanupOldTempFiles
  }
}