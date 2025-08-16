/**
 * Hook to consolidate remaining scattered SQL queries
 * Migrates StatisticsPage, ChallengeWizardV2, and OpportunityAnalytics patterns
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';
import { queryKeys } from '@/lib/query/query-keys';

interface StatisticsData {
  ideas: { total: number; byStatus: Record<string, number> };
  challenges: { total: number; byStatus: Record<string, number> };
  events: { total: number; upcoming: number };
  experts: { total: number };
  partners: { total: number };
  innovators: { total: number };
  participants: { total: number };
  departments: { total: number };
  sectors: { total: number };
}

interface OpportunityAnalyticsData {
  opportunity: any;
  applications: any[];
  analytics: any;
  likes: any[];
  shares: any[];
  bookmarks: any[];
  comments: any[];
  userJourneys: any[];
  viewsHistory: any[];
  summary: any;
}

export const useStatisticsConsolidation = () => {
  const [filters, setFilters] = useState({
    dateRange: null as Date | null,
    departments: [] as string[],
    sectors: [] as string[]
  });

  // Consolidated statistics fetching
  const {
    data: statisticsData,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['statistics', 'all', filters],
    queryFn: async (): Promise<StatisticsData> => {
      try {
        debugLog.log('Fetching consolidated statistics', { filters });

        // Build queries with filters
        let ideasQuery = supabase.from('ideas').select('id, created_at, status', { count: 'exact' });
        let challengesQuery = supabase.from('challenges').select('id, created_at, status', { count: 'exact' });
        let eventsQuery = supabase.from('events').select('id, event_date, status', { count: 'exact' });

        // Apply date filters
        if (filters.dateRange) {
          const dateFilter = filters.dateRange.toISOString();
          ideasQuery = ideasQuery.gte('created_at', dateFilter);
          challengesQuery = challengesQuery.gte('created_at', dateFilter);
          eventsQuery = eventsQuery.gte('event_date', dateFilter.split('T')[0]);
        }

        // Apply department/sector filters
        if (filters.departments.length > 0) {
          challengesQuery = challengesQuery.in('department_id', filters.departments);
        }

        if (filters.sectors.length > 0) {
          challengesQuery = challengesQuery.in('sector_id', filters.sectors);
          eventsQuery = eventsQuery.in('sector_id', filters.sectors);
        }

        // Execute all queries in parallel
        const [
          ideasResponse,
          challengesResponse,
          eventsResponse,
          expertsResponse,
          partnersResponse,
          innovatorsResponse,
          participantsResponse,
          departmentsResponse,
          sectorsResponse
        ] = await Promise.all([
          ideasQuery,
          challengesQuery,
          eventsQuery,
          supabase.from('experts').select('id', { count: 'exact', head: true }),
          supabase.from('partners').select('id', { count: 'exact', head: true }),
          supabase.from('innovators').select('id', { count: 'exact', head: true }),
          supabase.from('event_participants').select('user_id', { count: 'exact', head: true }),
          supabase.from('departments').select('id', { count: 'exact', head: true }),
          supabase.from('sectors').select('id', { count: 'exact', head: true })
        ]);

        // Process and categorize data
        const ideas = ideasResponse.data || [];
        const challenges = challengesResponse.data || [];
        const events = eventsResponse.data || [];

        const ideasByStatus = ideas.reduce((acc: Record<string, number>, idea: any) => {
          acc[idea.status] = (acc[idea.status] || 0) + 1;
          return acc;
        }, {});

        const challengesByStatus = challenges.reduce((acc: Record<string, number>, challenge: any) => {
          acc[challenge.status] = (acc[challenge.status] || 0) + 1;
          return acc;
        }, {});

        const upcomingEvents = events.filter((event: any) => 
          new Date(event.event_date) > new Date()
        ).length;

        return {
          ideas: {
            total: ideasResponse.count || 0,
            byStatus: ideasByStatus
          },
          challenges: {
            total: challengesResponse.count || 0,
            byStatus: challengesByStatus
          },
          events: {
            total: eventsResponse.count || 0,
            upcoming: upcomingEvents
          },
          experts: { total: expertsResponse.count || 0 },
          partners: { total: partnersResponse.count || 0 },
          innovators: { total: innovatorsResponse.count || 0 },
          participants: { total: participantsResponse.count || 0 },
          departments: { total: departmentsResponse.count || 0 },
          sectors: { total: sectorsResponse.count || 0 }
        };
      } catch (error) {
        debugLog.error('Error fetching statistics', { error, filters });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  // Opportunity analytics fetching
  const fetchOpportunityAnalytics = useCallback(async (
    opportunityId: string,
    dateRange: { start: Date; end: Date }
  ): Promise<OpportunityAnalyticsData> => {
    try {
      debugLog.log('Fetching opportunity analytics', { opportunityId, dateRange });

      const [
        opportunityData,
        applicationsData,
        analyticsData,
        likesData,
        sharesData,
        bookmarksData,
        commentsData,
        journeyData,
        viewsHistoryData
      ] = await Promise.all([
        supabase.from('opportunities').select('*').eq('id', opportunityId).maybeSingle(),
        supabase.from('opportunity_applications').select('created_at, status, application_source').eq('opportunity_id', opportunityId),
        supabase.from('opportunity_analytics').select('*').eq('opportunity_id', opportunityId).maybeSingle(),
        supabase.from('opportunity_likes').select('created_at').eq('opportunity_id', opportunityId),
        supabase.from('opportunity_shares').select('created_at, platform').eq('opportunity_id', opportunityId),
        supabase.from('opportunity_bookmarks').select('created_at').eq('opportunity_id', opportunityId),
        supabase.from('opportunity_comments').select('created_at').eq('opportunity_id', opportunityId).eq('is_public', true),
        supabase.from('opportunity_user_journeys').select('step_timestamp, time_from_previous_ms, step_data').eq('opportunity_id', opportunityId).gte('step_timestamp', dateRange.start.toISOString()).lte('step_timestamp', dateRange.end.toISOString()),
        supabase.from('opportunity_analytics').select('view_count, last_updated').eq('opportunity_id', opportunityId).order('last_updated', { ascending: false }).limit(30)
      ]);

      const { data: summaryData } = await supabase.rpc('get_opportunity_analytics_summary', {
        p_opportunity_id: opportunityId
      });

      return {
        opportunity: opportunityData.data,
        applications: applicationsData.data || [],
        analytics: analyticsData.data,
        likes: likesData.data || [],
        shares: sharesData.data || [],
        bookmarks: bookmarksData.data || [],
        comments: commentsData.data || [],
        userJourneys: journeyData.data || [],
        viewsHistory: viewsHistoryData.data || [],
        summary: summaryData
      };
    } catch (error) {
      debugLog.error('Error fetching opportunity analytics', { error, opportunityId });
      throw error;
    }
  }, []);

  // Filter data fetching for dropdowns
  const {
    data: filterOptions,
    isLoading: isLoadingFilters
  } = useQuery({
    queryKey: ['system-lists', 'filter-options'],
    queryFn: async () => {
      const [departmentsData, sectorsData] = await Promise.all([
        supabase.from('departments').select('id, name, name_ar'),
        supabase.from('sectors').select('id, name, name_ar')
      ]);

      return {
        departments: departmentsData.data || [],
        sectors: sectorsData.data || []
      };
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    // Statistics data
    statisticsData,
    isLoadingStats,
    statsError,
    refetchStats,
    
    // Opportunity analytics
    fetchOpportunityAnalytics,
    
    // Filter management
    filters,
    updateFilters,
    filterOptions,
    isLoadingFilters
  };
};

export default useStatisticsConsolidation;