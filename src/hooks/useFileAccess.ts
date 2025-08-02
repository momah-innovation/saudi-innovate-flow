import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface FileAccessLog {
  id: string
  file_record_id: string
  event_type: string
  event_details: any
  performed_by: string
  created_at: string
  file_path?: string
  original_filename?: string
}

export interface FileAccessStats {
  file_id: string
  file_path: string
  original_filename: string
  total_accesses: number
  unique_users: number
  last_accessed: string
  created_at: string
}

export const useFileAccess = () => {
  const [accessLogs, setAccessLogs] = useState<FileAccessLog[]>([])
  const [accessStats, setAccessStats] = useState<FileAccessStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccessLogs = async (limit = 100) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: logsError } = await supabase
        .from('file_lifecycle_events')
        .select(`
          id,
          file_record_id,
          event_type,
          event_details,
          performed_by,
          created_at,
          file_records!inner (
            file_path,
            original_filename
          )
        `)
        .eq('event_type', 'accessed')
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (logsError) {
        throw logsError
      }
      
      const transformedLogs: FileAccessLog[] = (data || []).map(log => ({
        id: log.id,
        file_record_id: log.file_record_id,
        event_type: log.event_type,
        event_details: log.event_details,
        performed_by: log.performed_by,
        created_at: log.created_at,
        file_path: log.file_records?.file_path,
        original_filename: log.file_records?.original_filename
      }))
      
      setAccessLogs(transformedLogs)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch access logs'
      setError(errorMessage)
      console.error('File access logs fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAccessStats = async (limit = 50) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: statsError } = await supabase
        .from('file_records')
        .select(`
          id,
          file_path,
          original_filename,
          access_count,
          last_accessed,
          created_at,
          file_lifecycle_events!inner (
            performed_by
          )
        `)
        .gt('access_count', 0)
        .order('access_count', { ascending: false })
        .limit(limit)
      
      if (statsError) {
        throw statsError
      }
      
      // Process data to get unique user counts
      const statsWithUniqueUsers: FileAccessStats[] = (data || []).map(file => {
        const uniqueUsers = new Set(
          file.file_lifecycle_events
            .filter(event => event.performed_by)
            .map(event => event.performed_by)
        ).size
        
        return {
          file_id: file.id,
          file_path: file.file_path,
          original_filename: file.original_filename,
          total_accesses: file.access_count || 0,
          unique_users: uniqueUsers,
          last_accessed: file.last_accessed || file.created_at,
          created_at: file.created_at
        }
      })
      
      setAccessStats(statsWithUniqueUsers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch access stats'
      setError(errorMessage)
      console.error('File access stats fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const logFileAccess = async (
    fileRecordId: string, 
    accessDetails: Record<string, any> = {}
  ) => {
    try {
      const { error } = await supabase
        .from('file_lifecycle_events')
        .insert({
          file_record_id: fileRecordId,
          event_type: 'accessed',
          event_details: {
            ...accessDetails,
            access_timestamp: new Date().toISOString()
          }
        })
      
      if (error) {
        throw error
      }
      
      // Use SQL increment for access count
      await supabase.rpc('increment_access_count', { 
        file_record_id: fileRecordId 
      })
        
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log file access'
      console.error('File access logging error:', err)
      return { success: false, error: errorMessage }
    }
  }

  const getFileAccessHistory = async (fileRecordId: string) => {
    try {
      const { data, error } = await supabase
        .from('file_lifecycle_events')
        .select('*')
        .eq('file_record_id', fileRecordId)
        .eq('event_type', 'accessed')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get file access history'
      return { success: false, error: errorMessage }
    }
  }

  const refreshLogs = () => {
    fetchAccessLogs()
  }

  const refreshStats = () => {
    fetchAccessStats()
  }

  useEffect(() => {
    fetchAccessLogs()
    fetchAccessStats()
  }, [])

  return {
    accessLogs,
    accessStats,
    loading,
    error,
    fetchAccessLogs,
    fetchAccessStats,
    logFileAccess,
    getFileAccessHistory,
    refreshLogs,
    refreshStats
  }
}