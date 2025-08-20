
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/utils/unified-api-client';
import { logger } from '@/utils/logger';

interface DashboardMetrics {
  totalChallenges: number;
  activeChallenges: number;
  totalSubmissions: number;
  totalUsers: number;
  recentActivity: number;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalChallenges: 0,
    activeChallenges: 0,
    totalSubmissions: 0,
    totalUsers: 0,
    recentActivity: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch challenges count
        const { data: challengesData } = await apiClient.get(
          'challenges',
          { component: 'Dashboard', operation: 'fetch_challenges' },
          { status: 'active' }
        );

        // Fetch submissions count  
        const { data: submissionsData } = await apiClient.get(
          'challenge_submissions',
          { component: 'Dashboard', operation: 'fetch_submissions' }
        );

        // Fetch users count (for admins)
        const { data: usersData } = await apiClient.get(
          'profiles',
          { component: 'Dashboard', operation: 'fetch_users' }
        );

        // Fetch recent activity
        const { data: activityData } = await apiClient.get(
          'activity_events',
          { component: 'Dashboard', operation: 'fetch_recent_activity' },
          {},
          { limit: 10 }
        );

        setMetrics({
          totalChallenges: challengesData?.length || 0,
          activeChallenges: challengesData?.filter((c: any) => c.status === 'active').length || 0,
          totalSubmissions: submissionsData?.length || 0,
          totalUsers: usersData?.length || 0,
          recentActivity: activityData?.length || 0
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
        setError(errorMessage);
        logger.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return {
    metrics,
    isLoading,
    error,
    refetch: () => {
      if (user) {
        setIsLoading(true);
        setError(null);
      }
    }
  };
}
