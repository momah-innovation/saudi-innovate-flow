import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
}

interface AnalyticsQuery {
  source_name?: string;
  query?: string;
}

export const useLogflareAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendLogs = async (logs: LogEntry[], sourceName = 'innovation-platform') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('logflare-analytics', {
        body: {
          action: 'send_logs',
          data: {
            source_name: sourceName,
            logs: logs.map(log => ({
              ...log,
              timestamp: new Date(log.timestamp).toISOString(),
            })),
          },
        },
      });

      if (error) throw error;

      toast.success('Logs sent to Logflare successfully');
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send logs';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAnalytics = async ({ source_name, query }: AnalyticsQuery) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('logflare-analytics', {
        body: {
          action: 'get_analytics',
          data: {
            source_name: source_name || 'innovation-platform',
            query: query || 'SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100',
          },
        },
      });

      if (error) throw error;

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get analytics';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createSource = async (sourceName: string, description?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('logflare-analytics', {
        body: {
          action: 'create_source',
          data: {
            source_name: sourceName,
            description: description || `${sourceName} logs`,
          },
        },
      });

      if (error) throw error;

      toast.success('Logflare source created successfully');
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create source';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to log application events
  const logEvent = async (level: LogEntry['level'], message: string, metadata?: Record<string, any>) => {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata: {
        ...metadata,
        user_agent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
      },
    };

    try {
      await sendLogs([logEntry]);
    } catch (error) {
      logger.error('Failed to log analytics event', { component: 'useLogflareAnalytics', action: 'logEvent' }, error as Error);
    }
  };

  return {
    sendLogs,
    getAnalytics,
    createSource,
    logEvent,
    isLoading,
  };
};