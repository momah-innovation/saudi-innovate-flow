// @ts-nocheck
// Optimized Workspace Data Hook with Performance Monitoring
// Uses query batching, parallel execution, and performance tracking

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { timeAsync, performanceMonitor } from '@/utils/performanceMonitor';
import { queryBatcher } from '@/utils/queryBatcher';
import { debugLog } from '@/utils/debugLogger';

interface WorkspaceStats {
  totalChallenges: number;
  activeChallenges: number;
  totalIdeas: number;
  activeIdeas: number;
  totalEvents: number;
  upcomingEvents: number;
  totalOpportunities: number;
  activeOpportunities: number;
  totalPartners: number;
  activePartners: number;
  totalCampaigns: number;
  activeCampaigns: number;
}

interface WorkspaceData {
  stats: WorkspaceStats;
  recentActivity: any[];
  upcomingDeadlines: any[];
  notifications: any[];
  isLoading: boolean;
  error: string | null;
}

// Optimized parallel data fetching with query batching
const fetchWorkspaceStats = async (): Promise<WorkspaceStats> => {
  return await timeAsync(async () => {
    // Execute all stat queries in parallel
    const [challengesCount, ideasCount, eventsCount, opportunitiesCount, partnersCount, campaignsCount] = await Promise.all([
      queryBatcher.batch('challenges-count', async () => {
        const { count, error } = await supabase.from('challenges').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
      }),
      queryBatcher.batch('ideas-count', async () => {
        const { count, error } = await supabase.from('ideas').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
      }),
      queryBatcher.batch('events-count', async () => {
        const { count, error } = await supabase.from('events').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
      }),
      queryBatcher.batch('opportunities-count', async () => {
        const { count, error } = await supabase.from('opportunities').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
      }),
      queryBatcher.batch('partners-count', async () => {
        const { count, error } = await supabase.from('partners').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
      }),
      queryBatcher.batch('campaigns-count', async () => {
        const { count, error } = await supabase.from('campaigns').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
      })
    ]);
    
    return {
      totalChallenges: challengesCount,
      activeChallenges: challengesCount, // Would need separate query for active
      totalIdeas: ideasCount,
      activeIdeas: ideasCount,
      totalEvents: eventsCount,
      upcomingEvents: eventsCount,
      totalOpportunities: opportunitiesCount,
      activeOpportunities: opportunitiesCount,
      totalPartners: partnersCount,
      activePartners: partnersCount,
      totalCampaigns: campaignsCount,
      activeCampaigns: campaignsCount,
    };
  }, 'workspace-stats-fetch');
};

// Optimized recent activity fetching with performance monitoring
const fetchRecentActivity = async (): Promise<any[]> => {
  return await timeAsync(async () => {
    return await queryBatcher.batch('recent-activity', async () => {
      const { data, error } = await supabase
        .from('activity_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    });
  }, 'recent-activity-fetch');
};

// Optimized deadlines fetching
const fetchUpcomingDeadlines = async (): Promise<any[]> => {
  return await timeAsync(async () => {
    return await queryBatcher.batch('upcoming-deadlines', async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title_ar, title_en, submission_deadline, end_date')
        .gte('submission_deadline', new Date().toISOString())
        .order('submission_deadline')
        .limit(10);
      
      if (error) throw error;
      return data || [];
    });
  }, 'upcoming-deadlines-fetch');
};

export const useOptimizedWorkspaceData = () => {
  return useQuery<WorkspaceData, Error>({
    queryKey: ['workspace-data'],
    queryFn: async (): Promise<WorkspaceData> => {
      const fetchTimer = performanceMonitor.startTimer('workspace-data-fetch-all');
      
      try {
        // Execute all data fetches in parallel
        const [stats, recentActivity, upcomingDeadlines] = await Promise.all([
          fetchWorkspaceStats(),
          fetchRecentActivity(),
          fetchUpcomingDeadlines()
        ]);

        return {
          stats,
          recentActivity,
          upcomingDeadlines,
          notifications: [], // Would fetch from notifications table
          isLoading: false,
          error: null
        };
      } catch (error) {
        debugLog.error('Failed to fetch workspace data', {}, error as Error);
        throw error;
      } finally {
        fetchTimer();
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });
};

// Enhanced challenges data with performance optimization
export const useOptimizedChallenges = (filters?: any) => {
  return useQuery<any[], Error>({
    queryKey: ['challenges', filters],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch(`challenges:${JSON.stringify(filters)}`, async () => {
          let query = supabase
            .from('challenges')
            .select(`
              id,
              title_ar,
              title_en,
              description_ar,
              description_en,
              status,
              challenge_type,
              start_date,
              end_date,
              submission_deadline,
              image_url,
              sector_id,
              deputy_id,
              department_id
            `)
            .order('created_at', { ascending: false });

          if (filters?.status) {
            query = query.eq('status', filters.status);
          }
          if (filters?.sector_id) {
            query = query.eq('sector_id', filters.sector_id);
          }

          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        });
      }, 'challenges-fetch', { filters });
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

// Enhanced ideas data with performance optimization
export const useOptimizedIdeas = (filters?: any) => {
  return useQuery<any[], Error>({
    queryKey: ['ideas', filters],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch(`ideas:${JSON.stringify(filters)}`, async () => {
          const base = supabase
            .from('ideas')
            .select(`
              id,
              title,
              description,
              status,
              category,
              created_at,
              updated_at,
              submitted_by
            `)
            .order('created_at', { ascending: false });

          let q: any = base as any;
          if (filters?.status) {
            q = q.eq('status', filters.status);
          }
          if (filters?.category) {
            q = q.eq('category', filters.category);
          }

          const { data, error } = await (q as any);
          if (error) throw error;
          return data || [];
        });
      }, 'ideas-fetch', { filters });
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

// Enhanced events data with performance optimization
export const useOptimizedEvents = (filters?: any) => {
  return useQuery<any[], Error>({
    queryKey: ['events', filters],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch(`events:${JSON.stringify(filters)}`, async () => {
          let query = supabase
            .from('events')
            .select(`
              id,
              title,
              description,
              start_date,
              end_date,
              location,
              event_type,
              status,
              max_participants,
              registration_deadline
            `)
            .order('start_date', { ascending: true });

          if (filters?.status) {
            query = query.eq('status', filters.status);
          }
          if (filters?.event_type) {
            query = query.eq('event_type', filters.event_type);
          }

          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        });
      }, 'events-fetch', { filters });
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

// Performance monitoring utilities for workspace
export const getWorkspacePerformanceStats = () => {
  return {
    workspaceDataStats: performanceMonitor.getStats('workspace-data-fetch-all'),
    challengesStats: performanceMonitor.getStats('challenges-fetch'),
    ideasStats: performanceMonitor.getStats('ideas-fetch'),
    eventsStats: performanceMonitor.getStats('events-fetch'),
    slowOperations: performanceMonitor.getSlowOperations(500), // 500ms threshold
    cacheStatus: queryBatcher.getCacheStatus()
  };
};