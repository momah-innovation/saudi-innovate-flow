import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createErrorHandler } from '@/utils/errorHandler';

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description?: string;
  is_public: boolean;
  updated_at: string;
  updated_by: string;
}

interface SystemMetrics {
  uptime: string;
  activeUsers: number;
  memoryUsage: string;
  storageUsed: string;
}

export const useSystemData = () => {
  const [configurations, setConfigurations] = useState<SystemConfig[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const errorHandler = createErrorHandler({ component: 'useSystemData' });

  // Mock data for system configurations
  const mockConfigurations: SystemConfig[] = [
    {
      id: '1',
      key: 'app.name',
      value: 'Innovation Center',
      type: 'string',
      category: 'general',
      description: 'Application name',
      is_public: true,
      updated_at: new Date().toISOString(),
      updated_by: 'admin'
    },
    {
      id: '2',
      key: 'auth.session_timeout',
      value: '3600',
      type: 'number',
      category: 'security',
      description: 'Session timeout in seconds',
      is_public: false,
      updated_at: new Date().toISOString(),
      updated_by: 'admin'
    },
    {
      id: '3',
      key: 'email.smtp_host',
      value: 'smtp.example.com',
      type: 'string',
      category: 'email',
      description: 'SMTP server host',
      is_public: false,
      updated_at: new Date().toISOString(),
      updated_by: 'admin'
    }
  ];

  const mockMetrics: SystemMetrics = {
    uptime: '99.9%',
    activeUsers: 142,
    memoryUsage: '45%',
    storageUsed: '2.1GB'
  };

  const refreshConfigurations = useCallback(async () => {
    setLoading(true);
    try {
      // Mock implementation - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 500));
      setConfigurations(mockConfigurations);
      setMetrics(mockMetrics);
    } catch (error) {
      errorHandler.handleError(error as Error, 'refreshConfigurations');
      toast({
        title: 'خطأ في جلب إعدادات النظام',
        description: 'حدث خطأ أثناء جلب بيانات إعدادات النظام',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [errorHandler, toast]);

  const updateConfiguration = useCallback(async (id: string, updates: any) => {
    try {
      setConfigurations(prev => prev.map(config => 
        config.id === id ? { ...config, ...updates, updated_at: new Date().toISOString() } : config
      ));
      toast({
        title: 'تم تحديث الإعداد',
        description: 'تم تحديث إعداد النظام بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'updateConfiguration');
      throw error;
    }
  }, [errorHandler, toast]);

  return {
    configurations,
    metrics,
    loading,
    refreshConfigurations,
    updateConfiguration,
  };
};