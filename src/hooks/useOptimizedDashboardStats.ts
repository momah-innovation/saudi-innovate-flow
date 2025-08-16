/**
 * OPTIMIZED Dashboard Stats Hook - Uses new database function
 * Replaces multiple queries with single optimized call
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { timeAsync } from '@/utils/performanceMonitor';
import { debugLog } from '@/utils/debugLogger';

interface OptimizedDashboardStats {
  total_users: number;
  new_users_7d: number;
  new_users_30d: number;
  total_challenges: number;
  active_challenges: number;
  completed_challenges: number;
  total_ideas: number;
  submitted_ideas: number;
  implemented_ideas: number;
  total_participants: number;
  new_participants_30d: number;
  ideas_per_challenge: number;
  implementation_rate: number;
  generated_at: string;
}

export const useOptimizedDashboardStats = () => {
  return useQuery({
    queryKey: ['optimized-dashboard-stats'],
    queryFn: async (): Promise<OptimizedDashboardStats> => {
      return await timeAsync(async () => {
        debugLog.log('Fetching optimized dashboard stats...');
        
        // PRIORITY 1 FIX: Use single optimized database function
        const { data, error } = await supabase.rpc('get_dashboard_stats');
        
        if (error) {
          debugLog.error('Dashboard stats RPC failed:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('No dashboard stats data returned');
        }
        
        debugLog.log('Dashboard stats fetched successfully');
        return data as unknown as OptimizedDashboardStats;
        
      }, 'optimized-dashboard-stats-fetch');
    },
    // EMERGENCY PERFORMANCE CONFIG
    staleTime: 10 * 60 * 1000, // 10 minutes - aggressive caching
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false, // DISABLE
    refetchOnMount: false, // DISABLE
    refetchOnReconnect: false, // DISABLE
    retry: 1 // Reduce retries
  });
};

// Hook to get user activity summary from optimized table
export const useUserActivitySummary = (userId?: string) => {
  return useQuery({
    queryKey: ['user-activity-summary', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      return await timeAsync(async () => {
        const { data, error } = await supabase
          .from('user_activity_summary')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') { // Ignore "not found" errors
          throw error;
        }
        
        return data;
      }, 'user-activity-summary-fetch', { userId });
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes for user-specific data
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1
  });
};

// Hook to get navigation cache for instant sidebar restoration
export const useNavigationCache = (userId?: string) => {
  return useQuery({
    queryKey: ['navigation-cache', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_navigation_cache')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!userId,
    staleTime: 15 * 60 * 1000, // 15 minutes for navigation state
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1
  });
};