import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SuspiciousActivity {
  id: string;
  user_id: string | null;
  activity_type: string;
  description: string;
  severity: string;
  request_details: any;
  created_at: string;
  profiles?: {
    display_name: string;
    email: string;
  };
}

interface UseSuspiciousActivitiesOptions {
  timeRange?: '1h' | '24h' | '7d' | '30d';
  severity?: 'all' | 'critical' | 'high' | 'medium' | 'low';
  activityType?: string;
  autoRefresh?: boolean;
  limit?: number;
}

export const useSuspiciousActivities = (options: UseSuspiciousActivitiesOptions = {}) => {
  const { toast } = useToast();
  const {
    timeRange = '7d',
    severity = 'all',
    activityType,
    autoRefresh = true,
    limit = 50
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
    queryKey: ['suspicious-activities', timeRange, severity, activityType, limit],
    queryFn: async (): Promise<SuspiciousActivity[]> => {
      try {
        let query = supabase
          .from('suspicious_activities')
          .select(`
            id,
            user_id,
            activity_type,
            description,
            severity,
            request_details,
            created_at
          `)
          .gte('created_at', `now() - interval '${getTimeFilter()}'`)
          .order('severity', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(limit);

        // Apply severity filter
        if (severity !== 'all') {
          query = query.eq('severity', severity);
        }

        // Apply activity type filter
        if (activityType) {
          query = query.eq('activity_type', activityType);
        }

        const { data, error } = await query;

        if (error) {
          toast({
            title: "خطأ في تحميل الأنشطة المشبوهة",
            description: "فشل في تحميل بيانات الأنشطة المشبوهة. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching suspicious activities:', error);
        throw error;
      }
    },
    refetchInterval: autoRefresh ? 60000 : false, // 1 minute
    staleTime: 10000, // 10 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook for suspicious activity trends
export const useSuspiciousActivityTrends = (timeRange: '7d' | '30d' = '7d') => {
  return useQuery({
    queryKey: ['suspicious-activity-trends', timeRange],
    queryFn: async () => {
      try {
        const interval = timeRange === '7d' ? '7 days' : '30 days';
        const groupBy = timeRange === '7d' ? 'hour' : 'day';

        const { data, error } = await supabase
          .from('suspicious_activities')
          .select('created_at, severity, activity_type')
          .gte('created_at', `now() - interval '${interval}'`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group data by time periods
        const trends = data?.reduce((acc: any, activity: any) => {
          const date = new Date(activity.created_at);
          const key = groupBy === 'hour' 
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`
            : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

          if (!acc[key]) {
            acc[key] = {
              timestamp: key,
              total: 0,
              critical: 0,
              high: 0,
              medium: 0,
              low: 0,
              activityTypes: {}
            };
          }

          acc[key].total++;
          acc[key][activity.severity]++;
          
          if (!acc[key].activityTypes[activity.activity_type]) {
            acc[key].activityTypes[activity.activity_type] = 0;
          }
          acc[key].activityTypes[activity.activity_type]++;

          return acc;
        }, {});

        return Object.values(trends || {}).sort((a: any, b: any) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      } catch (error) {
        console.error('Error fetching suspicious activity trends:', error);
        throw error;
      }
    },
    refetchInterval: 120000, // 2 minutes
    staleTime: 60000 // 1 minute
  });
};