import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debugLog } from '@/utils/debugLogger';

interface SecurityAuditLogEntry {
  id: string;
  user_id: string | null;
  action_type: string;
  resource_type: string | null;
  resource_id: string | null;
  risk_level: string;
  details: any;
  created_at: string;
  profiles?: {
    display_name: string;
    email: string;
  };
}

interface UseSecurityAuditLogOptions {
  timeRange?: '1h' | '24h' | '7d' | '30d';
  riskLevel?: 'all' | 'critical' | 'high' | 'medium' | 'low';
  actionType?: string;
  autoRefresh?: boolean;
  limit?: number;
}

export const useSecurityAuditLog = (options: UseSecurityAuditLogOptions = {}) => {
  const { toast } = useToast();
  const {
    timeRange = '24h',
    riskLevel = 'all',
    actionType,
    autoRefresh = true,
    limit = 100
  } = options;

  const getTimeFilter = () => {
    const intervals = {
      '1h': '1 hour',
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days'
    };
    return intervals[timeRange];
  };

  return useQuery({
    queryKey: ['security-audit-log', timeRange, riskLevel, actionType, limit],
    queryFn: async (): Promise<SecurityAuditLogEntry[]> => {
      try {
        let query = supabase
          .from('security_audit_log')
          .select(`
            id,
            user_id,
            action_type,
            resource_type,
            resource_id,
            risk_level,
            details,
            created_at
          `)
          .gte('created_at', `now() - interval '${getTimeFilter()}'`)
          .order('created_at', { ascending: false })
          .limit(limit);

        // Apply risk level filter
        if (riskLevel !== 'all') {
          query = query.eq('risk_level', riskLevel);
        }

        // Apply action type filter
        if (actionType) {
          query = query.eq('action_type', actionType);
        }

        const { data, error } = await query;

        if (error) {
          toast({
            title: "خطأ في تحميل سجل الأمان",
            description: "فشل في تحميل بيانات سجل الأمان. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        debugLog.error('Error fetching security audit log', { error });
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 30000 : false, // 30 seconds
    staleTime: 5000, // 5 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook for security metrics summary
export const useSecurityMetrics = (timeRange: '1h' | '24h' | '7d' | '30d' = '24h') => {
  return useQuery({
    queryKey: ['security-metrics', timeRange],
    queryFn: async () => {
      try {
        const interval = {
          '1h': '1 hour',
          '24h': '24 hours', 
          '7d': '7 days',
          '30d': '30 days'
        }[timeRange];

        // Get security audit log metrics
        const { data: auditData, error: auditError } = await supabase
          .from('security_audit_log')
          .select('risk_level, action_type')
          .gte('created_at', `now() - interval '${interval}'`);

        if (auditError) throw auditError;

        // Get suspicious activities
        const { data: suspiciousData, error: suspiciousError } = await supabase
          .from('suspicious_activities')
          .select('severity')
          .gte('created_at', `now() - interval '${interval}'`);

        if (suspiciousError) throw suspiciousError;

        // Get rate limit violations
        const { data: rateLimitData, error: rateLimitError } = await supabase
          .from('rate_limits')
          .select('request_count')
          .gte('created_at', `now() - interval '${interval}'`)
          .gte('request_count', 100); // Assuming 100+ is a violation

        if (rateLimitError) throw rateLimitError;

        // Calculate metrics
        const totalEvents = auditData?.length || 0;
        const criticalEvents = auditData?.filter(item => item.risk_level === 'critical').length || 0;
        const highRiskEvents = auditData?.filter(item => item.risk_level === 'high').length || 0;
        const suspiciousActivities = suspiciousData?.length || 0;
        const rateLimitViolations = rateLimitData?.length || 0;

        return {
          totalEvents,
          criticalEvents,
          highRiskEvents,
          suspiciousActivities,
          rateLimitViolations,
          securityScore: Math.max(0, 100 - (criticalEvents * 10 + highRiskEvents * 5 + suspiciousActivities * 3))
        };
      } catch (error) {
        debugLog.error('Error fetching security metrics', { error });
        throw error;
      }
    },
    refetchInterval: 30000, // 30 seconds
    staleTime: 10000 // 10 seconds
  });
};