import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RateLimit {
  id: string;
  user_id: string | null;
  action: string;
  request_count: number;
  window_start: string;
  created_at: string;
  profiles?: {
    display_name: string;
    email: string;
  };
}

interface UseRateLimitsOptions {
  timeRange?: '1h' | '24h' | '7d';
  threshold?: number;
  action?: string;
  autoRefresh?: boolean;
  limit?: number;
}

export const useRateLimits = (options: UseRateLimitsOptions = {}) => {
  const { toast } = useToast();
  const {
    timeRange = '24h',
    threshold = 100, // Default threshold for rate limit violations
    action,
    autoRefresh = true,
    limit = 100
  } = options;

  const getTimeFilter = () => {
    const intervals = {
      '1h': '1 hour',
      '24h': '24 hours',
      '7d': '7 days'
    };
    return intervals[timeRange];
  };

  return useQuery({
    queryKey: ['rate-limits', timeRange, threshold, action, limit],
    queryFn: async (): Promise<RateLimit[]> => {
      try {
        let query = supabase
          .from('rate_limits')
          .select(`
            id,
            user_id,
            action,
            request_count,
            window_start,
            created_at
          `)
          .gte('created_at', `now() - interval '${getTimeFilter()}'`)
          .gte('request_count', threshold) // Only show violations above threshold
          .order('request_count', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(limit);

        // Apply action filter
        if (action) {
          query = query.eq('action', action);
        }

        const { data, error } = await query;

        if (error) {
          toast({
            title: "خطأ في تحميل حدود المعدل",
            description: "فشل في تحميل بيانات حدود المعدل. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching rate limits:', error);
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 30000 : false, // 30 seconds
    staleTime: 5000, // 5 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook for rate limit analytics
export const useRateLimitAnalytics = (timeRange: '1h' | '24h' | '7d' = '24h') => {
  return useQuery({
    queryKey: ['rate-limit-analytics', timeRange],
    queryFn: async () => {
      try {
        const interval = {
          '1h': '1 hour',
          '24h': '24 hours',
          '7d': '7 days'
        }[timeRange];

        // Get all rate limit data
        const { data, error } = await supabase
          .from('rate_limits')
          .select('action, request_count, created_at, user_id')
          .gte('created_at', `now() - interval '${interval}'`);

        if (error) throw error;

        // Calculate analytics
        const totalRequests = data?.reduce((sum, item) => sum + item.request_count, 0) || 0;
        const violationsThreshold = 100;
        const violations = data?.filter(item => item.request_count >= violationsThreshold) || [];
        const totalViolations = violations.length;
        
        // Top violating actions
        const actionCounts = data?.reduce((acc: any, item) => {
          if (item.request_count >= violationsThreshold) {
            acc[item.action] = (acc[item.action] || 0) + 1;
          }
          return acc;
        }, {});

        const topActions = Object.entries(actionCounts || {})
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([action, count]) => ({ action, count }));

        // Top violating users
        const userCounts = violations.reduce((acc: any, item) => {
          if (item.user_id) {
            acc[item.user_id] = (acc[item.user_id] || 0) + item.request_count;
          }
          return acc;
        }, {});

        const topUsers = Object.entries(userCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([userId, totalRequests]) => ({ userId, totalRequests }));

        // Hourly distribution (for trending)
        const hourlyData = data?.reduce((acc: any, item) => {
          const hour = new Date(item.created_at).getHours();
          acc[hour] = (acc[hour] || 0) + item.request_count;
          return acc;
        }, {});

        const hourlyTrends = Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          requests: hourlyData?.[i] || 0
        }));

        return {
          totalRequests,
          totalViolations,
          violationsThreshold,
          topActions,
          topUsers,
          hourlyTrends,
          averageRequestsPerViolation: totalViolations > 0 ? Math.round(totalRequests / totalViolations) : 0
        };
      } catch (error) {
        console.error('Error fetching rate limit analytics:', error);
        throw error;
      }
    },
    refetchInterval: 60000, // 1 minute
    staleTime: 30000 // 30 seconds
  });
};