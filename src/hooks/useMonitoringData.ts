import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createErrorHandler } from '@/utils/errorHandler';

interface MonitoringAlert {
  id: string;
  name: string;
  type: 'threshold' | 'anomaly' | 'health_check' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'triggered' | 'resolved' | 'disabled';
  metric: string;
  condition: string;
  threshold_value?: number;
  current_value?: number;
  triggered_at?: string;
  resolved_at?: string;
  notification_channels: string[];
  created_at: string;
  updated_at: string;
}

interface SystemHealth {
  component: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  last_check: string;
  response_time_ms?: number;
  uptime_percentage: number;
  metrics: Record<string, number>;
  error_message?: string;
}

interface MonitoringMetrics {
  totalAlerts: number;
  activeAlerts: number;
  criticalAlerts: number;
  systemUptime: number;
  averageResponseTime: number;
  healthyServices: number;
  totalServices: number;
}

export const useMonitoringData = () => {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [healthChecks, setHealthChecks] = useState<SystemHealth[]>([]);
  const [metrics, setMetrics] = useState<MonitoringMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const errorHandler = createErrorHandler({ component: 'useMonitoringData' });

  // Mock data for monitoring alerts
  const mockAlerts: MonitoringAlert[] = [
    {
      id: '1',
      name: 'High CPU Usage',
      type: 'threshold',
      severity: 'high',
      status: 'triggered',
      metric: 'cpu_usage_percent',
      condition: '> 85%',
      threshold_value: 85,
      current_value: 92,
      triggered_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      notification_channels: ['email', 'slack'],
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Database Connection Pool Full',
      type: 'threshold',
      severity: 'critical',
      status: 'triggered',
      metric: 'db_connections_used',
      condition: '> 95%',
      threshold_value: 95,
      current_value: 98,
      triggered_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      notification_channels: ['email', 'slack', 'sms'],
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'API Response Time',
      type: 'threshold',
      severity: 'medium',
      status: 'resolved',
      metric: 'api_response_time_ms',
      condition: '> 2000ms',
      threshold_value: 2000,
      current_value: 1456,
      triggered_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      notification_channels: ['email'],
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];

  const mockHealthChecks: SystemHealth[] = [
    {
      component: 'API Gateway',
      status: 'healthy',
      last_check: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      response_time_ms: 45,
      uptime_percentage: 99.98,
      metrics: { requests_per_second: 234, error_rate: 0.02 }
    },
    {
      component: 'Database Primary',
      status: 'warning',
      last_check: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      response_time_ms: 120,
      uptime_percentage: 99.85,
      metrics: { connections_used: 78, query_time_avg_ms: 45 }
    },
    {
      component: 'Redis Cache',
      status: 'critical',
      last_check: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      response_time_ms: 2500,
      uptime_percentage: 97.2,
      metrics: { memory_usage_percent: 95, hit_rate: 76 },
      error_message: 'High memory usage detected'
    },
    {
      component: 'File Storage',
      status: 'healthy',
      last_check: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      response_time_ms: 67,
      uptime_percentage: 99.95,
      metrics: { storage_used_percent: 45, throughput_mbps: 156 }
    }
  ];

  const mockMetrics: MonitoringMetrics = {
    totalAlerts: 25,
    activeAlerts: 2,
    criticalAlerts: 1,
    systemUptime: 99.7,
    averageResponseTime: 89,
    healthyServices: 8,
    totalServices: 10
  };

  const refreshMonitoringData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock implementation - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 500));
      setAlerts(mockAlerts);
      setHealthChecks(mockHealthChecks);
      setMetrics(mockMetrics);
    } catch (error) {
      errorHandler.handleError(error as Error, 'refreshMonitoringData');
      toast({
        title: 'خطأ في جلب بيانات المراقبة',
        description: 'حدث خطأ أثناء جلب بيانات المراقبة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [errorHandler, toast]);

  const createAlert = useCallback(async (alertData: Partial<MonitoringAlert>) => {
    try {
      const newAlert: MonitoringAlert = {
        id: Date.now().toString(),
        name: alertData.name || '',
        type: alertData.type || 'threshold',
        severity: alertData.severity || 'medium',
        status: 'active',
        metric: alertData.metric || '',
        condition: alertData.condition || '',
        threshold_value: alertData.threshold_value,
        notification_channels: alertData.notification_channels || ['email'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...alertData
      };

      setAlerts(prev => [newAlert, ...prev]);
      toast({
        title: 'تم إنشاء تنبيه المراقبة',
        description: 'تم إنشاء تنبيه المراقبة الجديد بنجاح',
      });
      return newAlert;
    } catch (error) {
      errorHandler.handleError(error as Error, 'createAlert');
      throw error;
    }
  }, [errorHandler, toast]);

  const resolveAlert = useCallback(async (id: string) => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { 
          ...alert, 
          status: 'resolved' as const,
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } : alert
      ));
      toast({
        title: 'تم حل التنبيه',
        description: 'تم وضع علامة على التنبيه كمحلول',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'resolveAlert');
      throw error;
    }
  }, [errorHandler, toast]);

  const toggleAlert = useCallback(async (id: string) => {
    try {
      const alert = alerts.find(a => a.id === id);
      if (alert) {
        const newStatus = alert.status === 'active' ? 'disabled' : 'active';
        setAlerts(prev => prev.map(a => 
          a.id === id ? { ...a, status: newStatus, updated_at: new Date().toISOString() } : a
        ));
        toast({
          title: 'تم تحديث حالة التنبيه',
          description: `تم ${newStatus === 'active' ? 'تفعيل' : 'إيقاف'} التنبيه`,
        });
      }
    } catch (error) {
      errorHandler.handleError(error as Error, 'toggleAlert');
      throw error;
    }
  }, [alerts, errorHandler, toast]);

  const runHealthCheck = useCallback(async (component: string) => {
    try {
      setHealthChecks(prev => prev.map(check => 
        check.component === component ? { 
          ...check, 
          last_check: new Date().toISOString(),
          response_time_ms: Math.round(Math.random() * 200 + 50)
        } : check
      ));
      toast({
        title: 'تم تشغيل فحص الحالة',
        description: `تم فحص حالة ${component}`,
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'runHealthCheck');
      throw error;
    }
  }, [errorHandler, toast]);

  const generateReport = useCallback(async (type: 'daily' | 'weekly' | 'monthly') => {
    try {
      toast({
        title: 'بدأ إنشاء التقرير',
        description: `جاري إنشاء تقرير المراقبة ${type === 'daily' ? 'اليومي' : type === 'weekly' ? 'الأسبوعي' : 'الشهري'}`,
      });

      // Simulate report generation
      setTimeout(() => {
        toast({
          title: 'اكتمل إنشاء التقرير',
          description: 'تم إنشاء تقرير المراقبة بنجاح',
        });
      }, 3000);
    } catch (error) {
      errorHandler.handleError(error as Error, 'generateReport');
      throw error;
    }
  }, [errorHandler, toast]);

  return {
    alerts,
    healthChecks,
    metrics,
    loading,
    refreshMonitoringData,
    createAlert,
    resolveAlert,
    toggleAlert,
    runHealthCheck,
    generateReport,
  };
};