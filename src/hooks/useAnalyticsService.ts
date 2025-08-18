/**
 * Analytics Service Hook - Centralized Analytics Operations
 * Replaces direct supabase calls in AnalyticsService.ts (6 queries)
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { debugLog } from '@/utils/debugLogger';
import type { 
  CoreMetrics, 
  SecurityMetrics, 
  RoleBasedMetrics, 
  AnalyticsFilters,
  AnalyticsEvent,
  SecurityEvent
} from '@/types/common';

export interface AnalyticsServiceOperations {
  getCoreMetrics: (filters?: AnalyticsFilters) => Promise<CoreMetrics>;
  getSecurityMetrics: () => Promise<SecurityMetrics>;
  getRoleBasedMetrics: (userRole: string, filters?: AnalyticsFilters) => Promise<RoleBasedMetrics>;
  trackEvent: (eventType: string, properties?: Record<string, any>) => Promise<void>;
  getAnalyticsEvents: (filters?: { limit?: number; eventType?: string }) => Promise<AnalyticsEvent[]>;
  checkAccess: (accessType: 'basic' | 'security' | 'admin') => Promise<boolean>;
}

export function useAnalyticsService(): {
  operations: AnalyticsServiceOperations;
  isLoading: boolean;
  error: Error | null;
} {
  const { user } = useCurrentUser();

  // Core metrics query with enhanced error handling
  const coreMetricsQuery = useQuery({
    queryKey: ['analytics', 'core-metrics', user?.id],
    queryFn: async (): Promise<CoreMetrics> => {
      if (!user?.id) throw new Error('User not authenticated');

      try {
        // Check if user has analytics access first
        const { data: hasAccess } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'team_member'
        });

        if (!hasAccess) {
          debugLog.warn('Analytics core metrics fallback used', {
            component: 'useAnalyticsService',
            error: 'Access denied: insufficient privileges for analytics data'
          });
          return getDefaultCoreMetrics();
        }

        const { data, error } = await supabase.rpc('get_analytics_data', {
          p_user_id: user.id,
          p_user_role: 'innovator',
          p_filters: { timeframe: '30d' }
        });

        if (error) {
          debugLog.warn('Analytics core metrics fallback used', {
            component: 'useAnalyticsService',
            error: error.message
          });
          return getDefaultCoreMetrics();
        }

        return data as unknown as CoreMetrics;
      } catch (err) {
        debugLog.error('Analytics core metrics error', {
          component: 'useAnalyticsService',
          error: err instanceof Error ? err.message : 'Unknown error'
        });
        return getDefaultCoreMetrics();
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });

  // Security metrics query (admin only)
  const securityMetricsQuery = useQuery({
    queryKey: ['analytics', 'security-metrics', user?.id],
    queryFn: async (): Promise<SecurityMetrics> => {
      if (!user?.id) throw new Error('User not authenticated');

      try {
        const { data, error } = await supabase.rpc('get_security_analytics', {
          p_user_id: user.id
        });

        if (error) {
          debugLog.warn('Security metrics fallback used', {
            component: 'useAnalyticsService',
            error: error.message
          });
          return getDefaultSecurityMetrics();
        }

        return data as unknown as SecurityMetrics;
      } catch (err) {
        debugLog.error('Security metrics error', {
          component: 'useAnalyticsService',
          error: err instanceof Error ? err.message : 'Unknown error'
        });
        return getDefaultSecurityMetrics();
      }
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes for security data
    retry: 1
  });

  // Role-based metrics query
  const roleBasedMetricsQuery = useQuery({
    queryKey: ['analytics', 'role-based-metrics', user?.id],
    queryFn: async (): Promise<RoleBasedMetrics> => {
      if (!user?.id) throw new Error('User not authenticated');

      try {
        // Check if user has analytics access first
        const { data: hasRoleAccess } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (!hasRoleAccess) {
          debugLog.warn('Role-based metrics fallback used', {
            component: 'useAnalyticsService',
            error: 'Access denied: insufficient privileges for role-specific analytics'
          });
          return getDefaultRoleMetrics();
        }

        const { data, error } = await supabase.rpc('get_role_specific_analytics', {
          p_user_id: user.id,
          p_user_role: 'innovator',
          p_filters: {}
        });

        if (error) {
          debugLog.warn('Role-based metrics fallback used', {
            component: 'useAnalyticsService',
            error: error.message
          });
          return getDefaultRoleMetrics();
        }

        return data as unknown as RoleBasedMetrics;
      } catch (err) {
        debugLog.error('Role-based metrics error', {
          component: 'useAnalyticsService',
          error: err instanceof Error ? err.message : 'Unknown error'
        });
        return getDefaultRoleMetrics();
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  // Analytics events tracking mutation
  const trackEventMutation = useMutation({
    mutationFn: async ({ eventType, properties }: { eventType: string; properties?: Record<string, any> }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('analytics_events')
        .insert({
          user_id: user.id,
          event_type: eventType,
          event_category: 'system_usage',
          properties: properties || {}
        });

      if (error) throw error;
    },
    onError: (error) => {
      debugLog.error('Event tracking failed', {
        component: 'useAnalyticsService',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Access check mutation
  const accessCheckMutation = useMutation({
    mutationFn: async ({ accessType }: { accessType: 'basic' | 'security' | 'admin' }) => {
      if (!user?.id) return false;

      if (accessType === 'basic') return true;

      if (accessType === 'security' || accessType === 'admin') {
        const { data } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        return Boolean(data);
      }

      // Check team member access
      const { data } = await supabase
        .from('innovation_team_members')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      return Boolean(data);
    }
  });

  const operations: AnalyticsServiceOperations = {
    getCoreMetrics: async (filters?: AnalyticsFilters): Promise<CoreMetrics> => {
      return coreMetricsQuery.data || getDefaultCoreMetrics();
    },

    getSecurityMetrics: async (): Promise<SecurityMetrics> => {
      return securityMetricsQuery.data || getDefaultSecurityMetrics();
    },

    getRoleBasedMetrics: async (userRole: string, filters?: AnalyticsFilters): Promise<RoleBasedMetrics> => {
      return roleBasedMetricsQuery.data || getDefaultRoleMetrics();
    },

    trackEvent: async (eventType: string, properties?: Record<string, any>): Promise<void> => {
      await trackEventMutation.mutateAsync({ eventType, properties });
    },

    getAnalyticsEvents: async (filters?: { limit?: number; eventType?: string }): Promise<AnalyticsEvent[]> => {
      if (!user?.id) return [];

      const query = supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filters?.eventType) {
        query.eq('event_type', filters.eventType);
      }

      if (filters?.limit) {
        query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        debugLog.error('Analytics events fetch failed', {
          component: 'useAnalyticsService',
          error: error.message
        });
        return [];
      }

      return data as unknown as AnalyticsEvent[];
    },

    checkAccess: async (accessType: 'basic' | 'security' | 'admin'): Promise<boolean> => {
      const result = await accessCheckMutation.mutateAsync({ accessType });
      return result;
    }
  };

  return {
    operations,
    isLoading: coreMetricsQuery.isLoading || securityMetricsQuery.isLoading || roleBasedMetricsQuery.isLoading,
    error: coreMetricsQuery.error || securityMetricsQuery.error || roleBasedMetricsQuery.error
  };
}

// Default metrics functions
function getDefaultCoreMetrics(): CoreMetrics {
  return {
    users: { total: 0, active: 0, new: 0, growthRate: 0 },
    challenges: { total: 0, active: 0, completed: 0, submissions: 0, completionRate: 0 },
    engagement: { avgSessionDuration: 0, pageViews: 0, interactions: 0, returnRate: 0 },
    business: { implementedIdeas: 0, budgetUtilized: 0, partnershipValue: 0, roi: 0 }
  };
}

function getDefaultSecurityMetrics(): SecurityMetrics {
  return {
    riskLevel: 'low',
    threatCount: 0,
    suspiciousActivities: 0,
    rateLimitViolations: 0,
    failedLogins: 0
  };
}

function getDefaultRoleMetrics(): RoleBasedMetrics {
  return {
    userSpecific: {},
    roleSpecific: {},
    departmentSpecific: {}
  };
}