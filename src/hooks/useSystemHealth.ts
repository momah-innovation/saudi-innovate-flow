import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface SecurityMetrics {
  totalSecurityEvents: number
  highRiskEvents: number
  suspiciousActivities: number
  lastSecurityScan: string | null
}

interface StorageMetrics {
  totalBuckets: number
  totalFiles: number
  totalSize: number
  healthStatus: 'optimal' | 'warning' | 'critical'
}

interface CleanupMetrics {
  lastCleanupRun: string | null
  filesCleanedUp: number
  nextScheduledCleanup: string | null
  autoCleanupEnabled: boolean
}

interface SystemHealthData {
  security: SecurityMetrics
  storage: StorageMetrics
  cleanup: CleanupMetrics
  isLoading: boolean
  error: string | null
}

export function useSystemHealth() {
  const [healthData, setHealthData] = useState<SystemHealthData>({
    security: {
      totalSecurityEvents: 0,
      highRiskEvents: 0,
      suspiciousActivities: 0,
      lastSecurityScan: null
    },
    storage: {
      totalBuckets: 0,
      totalFiles: 0,
      totalSize: 0,
      healthStatus: 'optimal'
    },
    cleanup: {
      lastCleanupRun: null,
      filesCleanedUp: 0,
      nextScheduledCleanup: null,
      autoCleanupEnabled: false
    },
    isLoading: true,
    error: null
  })

  useEffect(() => {
    loadSystemHealth()
  }, [])

  const loadSystemHealth = async () => {
    try {
      setHealthData(prev => ({ ...prev, isLoading: true, error: null }))

      // Fetch security metrics
      const [securityEvents, suspiciousActivities, storageInfo] = await Promise.all([
        // Security audit log metrics
        supabase
          .from('security_audit_log')
          .select('risk_level, created_at')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()), // Last 7 days

        // Suspicious activities
        supabase
          .from('suspicious_activities')
          .select('id, created_at')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),

        // Storage buckets info
        supabase.rpc('get_basic_storage_info')
      ])

      // Calculate security metrics
      const securityMetrics: SecurityMetrics = {
        totalSecurityEvents: securityEvents.data?.length || 0,
        highRiskEvents: securityEvents.data?.filter(event => 
          event.risk_level === 'high' || event.risk_level === 'critical'
        ).length || 0,
        suspiciousActivities: suspiciousActivities.data?.length || 0,
        lastSecurityScan: securityEvents.data?.[0]?.created_at || null
      }

      // Calculate storage metrics
      const buckets = storageInfo.data || []
      const storageMetrics: StorageMetrics = {
        totalBuckets: buckets.length,
        totalFiles: 0, // Will be calculated from bucket stats
        totalSize: 0, // Will be calculated from bucket stats
        healthStatus: securityMetrics.highRiskEvents > 5 ? 'critical' : 
                     securityMetrics.highRiskEvents > 2 ? 'warning' : 'optimal'
      }

      // Get detailed storage stats for each bucket
      const bucketStatsPromises = buckets.map(bucket => 
        supabase.rpc('get_bucket_stats', { bucket_name: bucket.bucket_id })
      )
      
      const bucketStatsResults = await Promise.allSettled(bucketStatsPromises)
      
      let totalFiles = 0
      let totalSize = 0
      
      bucketStatsResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value.data?.[0]) {
          const stats = result.value.data[0]
          totalFiles += Number(stats.total_files) || 0
          totalSize += Number(stats.total_size) || 0
        }
      })

      storageMetrics.totalFiles = totalFiles
      storageMetrics.totalSize = totalSize

      // Get cleanup metrics from uploader settings
      const { data: cleanupSettings } = await supabase
        .from('uploader_settings')
        .select('setting_value, updated_at')
        .eq('setting_type', 'global')
        .eq('setting_key', 'auto_cleanup_enabled')
        .single()

      const settingValue = typeof cleanupSettings?.setting_value === 'object' && 
        cleanupSettings?.setting_value && 
        'value' in cleanupSettings.setting_value 
          ? cleanupSettings.setting_value.value 
          : cleanupSettings?.setting_value

      const cleanupMetrics: CleanupMetrics = {
        lastCleanupRun: cleanupSettings?.updated_at || null,
        filesCleanedUp: 0, // This would need to be tracked separately
        nextScheduledCleanup: settingValue === true ? 
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
        autoCleanupEnabled: Boolean(settingValue) || false
      }

      setHealthData({
        security: securityMetrics,
        storage: storageMetrics,
        cleanup: cleanupMetrics,
        isLoading: false,
        error: null
      })

    } catch (error) {
      console.error('Error loading system health:', error)
      setHealthData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load system health data'
      }))
    }
  }

  const refreshHealth = () => {
    loadSystemHealth()
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    ...healthData,
    refreshHealth,
    formatBytes
  }
}