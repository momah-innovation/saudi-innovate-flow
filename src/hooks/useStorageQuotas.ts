import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { logger } from '@/utils/logger'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export interface StorageQuota {
  bucket_name: string
  quota_bytes: number
  current_usage_bytes: number
  usage_percentage: number
  file_count: number
  created_at: string
  updated_at: string
}

export interface BucketInfo {
  bucket_id: string
  bucket_name: string
  public: boolean
  created_at: string
  file_count?: number
  total_size?: number
}

export const useStorageQuotas = () => {
  const [quotas, setQuotas] = useState<StorageQuota[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useCurrentUser()

  const fetchQuotas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check authentication first
      if (!user) {
        throw new Error('Authentication required. Please log in.')
      }
      
      const { data, error: quotaError } = await supabase.rpc('get_all_storage_quotas')
      
      if (quotaError) {
        logger.error('Storage quotas fetch failed', { operation: 'fetchQuotas' }, quotaError);
        if (quotaError.message?.includes('Admin access required')) {
          throw new Error('Admin access required for storage quota management')
        }
        throw quotaError
      }
      
      setQuotas(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quotas'
      logger.error('Storage quotas fetch error', { operation: 'fetchQuotas' }, err as Error);
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const setQuota = async (bucketName: string, quotaBytes: number) => {
    try {
      logger.info('Setting storage quota', { bucketName, quotaBytes });
      const { data, error } = await supabase.rpc('manage_storage_quotas', {
        p_bucket_name: bucketName,
        p_quota_bytes: quotaBytes
      })
      
      if (error) {
        logger.error('Storage quota setting failed', { bucketName, quotaBytes }, error);
        if (error.message?.includes('Admin access required')) {
          throw new Error('Admin access required for storage quota management')
        }
        throw error
      }
      
      logger.info('Storage quota set successfully', { bucketName, quotaBytes });
      await fetchQuotas()
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set quota'
      logger.error('Storage quota setting error', { bucketName, quotaBytes }, err as Error);
      return {
        success: false, 
        error: errorMessage
      }
    }
  }

  const removeQuota = async (bucketName: string) => {
    try {
      const { data, error } = await supabase.rpc('manage_storage_quotas', {
        p_bucket_name: bucketName,
        p_quota_bytes: null
      })
      
      if (error) {
        if (error.message?.includes('Admin access required')) {
          throw new Error('Admin access required for storage quota management')
        }
        throw error
      }
      
      await fetchQuotas()
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove quota'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const checkQuota = async (bucketName: string) => {
    try {
      const { data, error } = await supabase.rpc('manage_storage_quotas', {
        bucket_name: bucketName,
        action: 'check'
      })
      
      if (error) {
        throw error
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check quota'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const autoSetupQuotas = async () => {
    try {
      logger.info('Auto setting up storage quotas');
      const { data, error } = await supabase.rpc('auto_setup_storage_quotas')
      
      if (error) {
        logger.error('Auto setup RPC failed', { operation: 'autoSetupQuotas' }, error);
        if (error.message?.includes('Admin access required')) {
          throw new Error('Admin access required for auto setup')
        }
        throw error
      }
      
      logger.info('Auto setup completed successfully', { operation: 'autoSetupQuotas' });
      await fetchQuotas()
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to auto setup quotas'
      logger.error('Auto setup error', { operation: 'autoSetupQuotas' }, err as Error);
      return {
        success: false, 
        error: errorMessage
      }
    }
  }

  const refreshQuotas = () => {
    fetchQuotas()
  }

  useEffect(() => {
    fetchQuotas()
  }, [])

  return {
    quotas,
    loading,
    error,
    fetchQuotas,
    setQuota,
    removeQuota,
    checkQuota,
    autoSetupQuotas,
    refreshQuotas
  }
}