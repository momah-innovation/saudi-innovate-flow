import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createErrorHandler } from '@/utils/errorHandler';

interface SecurityEvent {
  id: string;
  event_type: 'login_attempt' | 'permission_change' | 'data_access' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address: string;
  user_agent: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  type: 'access_control' | 'data_protection' | 'audit' | 'compliance';
  enabled: boolean;
  rules: Array<{
    condition: string;
    action: string;
    priority: number;
  }>;
  created_at: string;
  updated_at: string;
}

interface SecurityMetrics {
  threatsDetected: number;
  eventsProcessed: number;
  policiesActive: number;
  riskScore: number;
  complianceScore: number;
}

export const useSecurityData = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const errorHandler = createErrorHandler({ component: 'useSecurityData' });

  // Mock data for security events
  const mockEvents: SecurityEvent[] = [
    {
      id: '1',
      event_type: 'login_attempt',
      severity: 'medium',
      user_id: 'user123',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      description: 'Failed login attempt - invalid password',
      metadata: { attempts: 3, locked: false },
      created_at: new Date().toISOString(),
      resolved: false
    },
    {
      id: '2',
      event_type: 'system_alert',
      severity: 'high',
      ip_address: '10.0.0.50',
      user_agent: 'Security Scanner',
      description: 'Unusual API access pattern detected',
      metadata: { endpoint: '/api/admin/users', requests: 50 },
      created_at: new Date(Date.now() - 3600000).toISOString(),
      resolved: true,
      resolved_by: 'admin456',
      resolved_at: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  const mockPolicies: SecurityPolicy[] = [
    {
      id: '1',
      name: 'Password Policy',
      description: 'Enforce strong password requirements',
      type: 'access_control',
      enabled: true,
      rules: [
        { condition: 'password_length >= 8', action: 'allow', priority: 1 },
        { condition: 'has_special_chars = true', action: 'allow', priority: 2 }
      ],
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Data Access Audit',
      description: 'Log all data access attempts',
      type: 'audit',
      enabled: true,
      rules: [
        { condition: 'data_access = true', action: 'log', priority: 1 }
      ],
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockMetrics: SecurityMetrics = {
    threatsDetected: 12,
    eventsProcessed: 1247,
    policiesActive: 8,
    riskScore: 25,
    complianceScore: 98
  };

  const refreshSecurityData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock implementation - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 500));
      setEvents(mockEvents);
      setPolicies(mockPolicies);
      setMetrics(mockMetrics);
    } catch (error) {
      errorHandler.handleError(error as Error, 'refreshSecurityData');
      toast({
        title: 'خطأ في جلب البيانات الأمنية',
        description: 'حدث خطأ أثناء جلب بيانات الأمان',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [errorHandler, toast]);

  const resolveEvent = useCallback(async (id: string) => {
    try {
      setEvents(prev => prev.map(event => 
        event.id === id ? { 
          ...event, 
          resolved: true, 
          resolved_by: 'current_user',
          resolved_at: new Date().toISOString()
        } : event
      ));
      toast({
        title: 'تم حل الحدث الأمني',
        description: 'تم وضع علامة على الحدث كمحلول',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'resolveEvent');
      throw error;
    }
  }, [errorHandler, toast]);

  const updatePolicy = useCallback(async (id: string, updates: Partial<SecurityPolicy>) => {
    try {
      setPolicies(prev => prev.map(policy => 
        policy.id === id ? { ...policy, ...updates, updated_at: new Date().toISOString() } : policy
      ));
      toast({
        title: 'تم تحديث السياسة الأمنية',
        description: 'تم تحديث السياسة الأمنية بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'updatePolicy');
      throw error;
    }
  }, [errorHandler, toast]);

  const togglePolicy = useCallback(async (id: string) => {
    try {
      const policy = policies.find(p => p.id === id);
      if (policy) {
        await updatePolicy(id, { enabled: !policy.enabled });
      }
    } catch (error) {
      errorHandler.handleError(error as Error, 'togglePolicy');
      throw error;
    }
  }, [policies, updatePolicy, errorHandler, toast]);

  return {
    events,
    policies,
    metrics,
    loading,
    refreshSecurityData,
    resolveEvent,
    updatePolicy,
    togglePolicy,
  };
};