import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

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

  const fetchQuotas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check authentication first
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Authentication required. Please log in.')
      }
      
      const { data, error: quotaError } = await supabase.rpc('get_all_storage_quotas')
      
      if (quotaError) {
        console.error('fetchQuotas: RPC error:', quotaError);
        if (quotaError.message?.includes('Admin access required')) {
          throw new Error('Admin access required for storage quota management')
        }
        throw quotaError
      }
      
      setQuotas(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quotas'
      console.error('fetchQuotas: Error:', err);
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const setQuota = async (bucketName: string, quotaBytes: number) => {
    try {
      console.log(`Setting quota for ${bucketName}: ${quotaBytes} bytes`);
      const { data, error } = await supabase.rpc('manage_storage_quotas', {
        p_bucket_name: bucketName,
        p_quota_bytes: quotaBytes
      })
      
      if (error) {
        console.error('RPC error setting quota:', error);
        if (error.message?.includes('Admin access required')) {
          throw new Error('Admin access required for storage quota management')
        }
        throw error
      }
      
      console.log('Quota set successfully:', data);
      await fetchQuotas()
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set quota'
      console.error('Error in setQuota:', err);
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
    refreshQuotas
  }
}