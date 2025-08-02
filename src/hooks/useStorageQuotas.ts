import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface StorageQuota {
  bucket_name: string
  quota_bytes: number
  current_usage: number
  usage_percentage: number
  quota_exceeded: boolean
}

export const useStorageQuotas = () => {
  const [quotas, setQuotas] = useState<StorageQuota[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuotas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: quotaError } = await supabase.rpc('get_all_storage_quotas')
      
      if (quotaError) {
        throw quotaError
      }
      
      setQuotas(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quotas'
      setError(errorMessage)
      console.error('Storage quotas fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const setQuota = async (bucketName: string, quotaBytes: number) => {
    try {
      const { data, error } = await supabase.rpc('manage_storage_quotas', {
        bucket_name: bucketName,
        quota_bytes: quotaBytes,
        action: 'set'
      })
      
      if (error) {
        throw error
      }
      
      await fetchQuotas()
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set quota'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const removeQuota = async (bucketName: string) => {
    try {
      const { data, error } = await supabase.rpc('manage_storage_quotas', {
        bucket_name: bucketName,
        action: 'remove'
      })
      
      if (error) {
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