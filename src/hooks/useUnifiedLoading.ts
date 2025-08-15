import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface LoadingConfig {
  component: string;
  showToast?: boolean;
  logErrors?: boolean;
  timeout?: number;
}

interface LoadingState {
  [key: string]: boolean;
}

export const useUnifiedLoading = (config: LoadingConfig) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});
  const { toast } = useToast();

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  const withLoading = useCallback(async <T>(
    key: string,
    operation: () => Promise<T>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      logContext?: Record<string, any>;
    }
  ): Promise<T | null> => {
    setLoading(key, true);
    
    let timeoutId: NodeJS.Timeout | undefined;
    if (config.timeout) {
      timeoutId = setTimeout(() => {
        setLoading(key, false);
        if (config.showToast) {
          toast({
            title: 'Operation Timeout',
            description: 'The operation took too long to complete',
            variant: 'destructive'
          });
        }
      }, config.timeout);
    }

    try {
      const result = await operation();
      
      if (timeoutId) clearTimeout(timeoutId);
      
      if (options?.successMessage && config.showToast) {
        toast({
          title: 'Success',
          description: options.successMessage
        });
      }
      
      return result;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      
      if (config.logErrors) {
        logger.error(`Operation failed in ${config.component}`, {
          component: config.component,
          operation: key,
          ...options?.logContext
        }, error as Error);
      }
      
      if (config.showToast) {
        toast({
          title: 'Error',
          description: options?.errorMessage || 'Operation failed. Please try again.',
          variant: 'destructive'
        });
      }
      
      return null;
    } finally {
      setLoading(key, false);
    }
  }, [config, setLoading, toast]);

  const resetLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    isLoading,
    setLoading,
    withLoading,
    resetLoading,
    hasAnyLoading: isLoading()
  };
};