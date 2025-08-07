import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { logger } from '@/utils/logger'

export interface StorageAnalytics {
  totalStorage: number
  totalFiles: number
  bucketBreakdown: BucketStats[]
  uploadTrends: UploadTrend[]
  topUploaders: TopUploader[]
  fileTypes: FileTypeStats[]
  accessPatterns: AccessPattern[]
  recentActivity: RecentActivity[]
}

export interface BucketStats {
  bucket_name: string
  file_count: number
  total_size: number
  public: boolean
  created_at: string
  usage_percentage?: number
  quota_bytes?: number
}

export interface UploadTrend {
  date: string
  uploads: number
  total_size: number
}

export interface TopUploader {
  user_id: string
  upload_count: number
  total_size: number
  last_upload: string
}

export interface FileTypeStats {
  mime_type: string
  file_count: number
  total_size: number
  percentage: number
}

export interface AccessPattern {
  hour: number
  access_count: number
}

export interface RecentActivity {
  id: string
  event_type: string
  file_path: string
  user_id: string
  created_at: string
  details: any
}

export const useStorageAnalytics = () => {
  const [analytics, setAnalytics] = useState<StorageAnalytics>({
    totalStorage: 0,
    totalFiles: 0,
    bucketBreakdown: [],
    uploadTrends: [],
    topUploaders: [],
    fileTypes: [],
    accessPatterns: [],
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBucketStats = async (): Promise<BucketStats[]> => {
    try {
      const { data, error } = await supabase.rpc('get_storage_buckets_info')
      if (error) throw error
      return data || []
    } catch (err) {
      logger.error('Failed to fetch bucket statistics', { component: 'useStorageAnalytics', action: 'fetchBucketStats' }, err as Error)
      return []
    }
  }

  const fetchUploadTrends = async (days = 30): Promise<UploadTrend[]> => {
    try {
      const { data, error } = await supabase
        .from('file_records')
        .select('created_at, file_size')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group by date
      const trendMap = new Map<string, { uploads: number; total_size: number }>()
      
      data?.forEach(record => {
        const date = new Date(record.created_at).toISOString().split('T')[0]
        const current = trendMap.get(date) || { uploads: 0, total_size: 0 }
        trendMap.set(date, {
          uploads: current.uploads + 1,
          total_size: current.total_size + (record.file_size || 0)
        })
      })

      return Array.from(trendMap.entries()).map(([date, stats]) => ({
        date,
        uploads: stats.uploads,
        total_size: stats.total_size
      }))
    } catch (err) {
      logger.error('Failed to fetch upload trends', { component: 'useStorageAnalytics', action: 'fetchUploadTrends' }, err as Error)
      return []
    }
  }

  const fetchTopUploaders = async (limit = 10): Promise<TopUploader[]> => {
    try {
      const { data, error } = await supabase
        .from('file_records')
        .select('uploader_id, file_size, created_at')
        .not('uploader_id', 'is', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group by uploader
      const uploaderMap = new Map<string, { upload_count: number; total_size: number; last_upload: string }>()
      
      data?.forEach(record => {
        const userId = record.uploader_id!
        const current = uploaderMap.get(userId) || { upload_count: 0, total_size: 0, last_upload: record.created_at }
        uploaderMap.set(userId, {
          upload_count: current.upload_count + 1,
          total_size: current.total_size + (record.file_size || 0),
          last_upload: record.created_at > current.last_upload ? record.created_at : current.last_upload
        })
      })

      return Array.from(uploaderMap.entries())
        .map(([user_id, stats]) => ({
          user_id,
          upload_count: stats.upload_count,
          total_size: stats.total_size,
          last_upload: stats.last_upload
        }))
        .sort((a, b) => b.upload_count - a.upload_count)
        .slice(0, limit)
    } catch (err) {
      logger.error('Failed to fetch top uploaders', { component: 'useStorageAnalytics', action: 'fetchTopUploaders' }, err as Error)
      return []
    }
  }

  const fetchFileTypes = async (): Promise<FileTypeStats[]> => {
    try {
      const { data, error } = await supabase
        .from('file_records')
        .select('mime_type, file_size')

      if (error) throw error

      // Group by mime type
      const typeMap = new Map<string, { file_count: number; total_size: number }>()
      let totalFiles = 0

      data?.forEach(record => {
        const mimeType = record.mime_type || 'unknown'
        const current = typeMap.get(mimeType) || { file_count: 0, total_size: 0 }
        typeMap.set(mimeType, {
          file_count: current.file_count + 1,
          total_size: current.total_size + (record.file_size || 0)
        })
        totalFiles++
      })

      return Array.from(typeMap.entries())
        .map(([mime_type, stats]) => ({
          mime_type,
          file_count: stats.file_count,
          total_size: stats.total_size,
          percentage: totalFiles > 0 ? (stats.file_count / totalFiles) * 100 : 0
        }))
        .sort((a, b) => b.file_count - a.file_count)
    } catch (err) {
      logger.error('Failed to fetch file types distribution', { component: 'useStorageAnalytics', action: 'fetchFileTypes' }, err as Error)
      return []
    }
  }

  const fetchAccessPatterns = async (): Promise<AccessPattern[]> => {
    try {
      const { data, error } = await supabase
        .from('file_lifecycle_events')
        .select('created_at')
        .eq('event_type', 'accessed')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days

      if (error) throw error

      // Group by hour
      const hourMap = new Map<number, number>()
      for (let i = 0; i < 24; i++) {
        hourMap.set(i, 0)
      }

      data?.forEach(record => {
        const hour = new Date(record.created_at).getHours()
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1)
      })

      return Array.from(hourMap.entries()).map(([hour, access_count]) => ({
        hour,
        access_count
      }))
    } catch (err) {
      logger.error('Failed to fetch access patterns', { component: 'useStorageAnalytics', action: 'fetchAccessPatterns' }, err as Error)
      return Array.from({ length: 24 }, (_, i) => ({ hour: i, access_count: 0 }))
    }
  }

  const fetchRecentActivity = async (limit = 20): Promise<RecentActivity[]> => {
    try {
      const { data, error } = await supabase
        .from('file_lifecycle_events')
        .select(`
          id,
          event_type,
          event_details,
          performed_by,
          created_at,
          file_records!inner (
            file_path
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(activity => ({
        id: activity.id,
        event_type: activity.event_type,
        file_path: activity.file_records?.file_path || 'unknown',
        user_id: activity.performed_by || 'system',
        created_at: activity.created_at,
        details: activity.event_details
      }))
    } catch (err) {
      logger.error('Failed to fetch recent activity', { component: 'useStorageAnalytics', action: 'fetchRecentActivity' }, err as Error)
      return []
    }
  }

  const fetchAnalytics = async (period = '30_days') => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all analytics data in parallel
      const [
        bucketStats,
        uploadTrends,
        topUploaders,
        fileTypes,
        accessPatterns,
        recentActivity
      ] = await Promise.all([
        fetchBucketStats(),
        fetchUploadTrends(30),
        fetchTopUploaders(10),
        fetchFileTypes(),
        fetchAccessPatterns(),
        fetchRecentActivity(20)
      ])

      // Calculate totals
      const totalStorage = bucketStats.reduce((sum, bucket) => sum + bucket.total_size, 0)
      const totalFiles = bucketStats.reduce((sum, bucket) => sum + bucket.file_count, 0)

      setAnalytics({
        totalStorage,
        totalFiles,
        bucketBreakdown: bucketStats,
        uploadTrends,
        topUploaders,
        fileTypes,
        accessPatterns,
        recentActivity
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics'
      setError(errorMessage)
      logger.error('Storage analytics fetch error', { component: 'useStorageAnalytics', action: 'fetchAllAnalytics' }, err as Error)
    } finally {
      setLoading(false)
    }
  }

  const refreshAnalytics = () => {
    fetchAnalytics()
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    refreshAnalytics
  }
}