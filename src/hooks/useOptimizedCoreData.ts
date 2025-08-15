/**
 * Optimized Core Data Hook - Centralizes common entity fetching
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryBatcher } from '@/utils/queryBatcher';
import { timeAsync } from '@/utils/performanceMonitor';

// Optimized hook for departments, sectors, deputies data
export const useOptimizedDepartments = () => {
  return useQuery({
    queryKey: ['core-departments'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('core-departments', async () => {
          const { data, error } = await supabase
            .from('departments')
            .select('*')
            .order('name_ar');
          if (error) throw error;
          return data || [];
        });
      }, 'departments-fetch');
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

export const useOptimizedSectors = () => {
  return useQuery({
    queryKey: ['core-sectors'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('core-sectors', async () => {
          const { data, error } = await supabase
            .from('sectors')
            .select('*')
            .order('name_ar');
          if (error) throw error;
          return data || [];
        });
      }, 'sectors-fetch');
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

export const useOptimizedDeputies = () => {
  return useQuery({
    queryKey: ['core-deputies'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('core-deputies', async () => {
          const { data, error } = await supabase
            .from('deputies')
            .select('*')
            .order('name_ar');
          if (error) throw error;
          return data || [];
        });
      }, 'deputies-fetch');
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

export const useOptimizedPartners = () => {
  return useQuery({
    queryKey: ['core-partners'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('core-partners', async () => {
          const { data, error } = await supabase
            .from('partners')
            .select('*')
            .order('name_ar');
          if (error) throw error;
          return data || [];
        });
      }, 'partners-fetch');
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

export const useOptimizedStakeholders = () => {
  return useQuery({
    queryKey: ['core-stakeholders'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('core-stakeholders', async () => {
          const { data, error } = await supabase
            .from('stakeholders')
            .select('*')
            .order('name_ar');
          if (error) throw error;
          return data || [];
        });
      }, 'stakeholders-fetch');
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

export const useOptimizedActiveProfiles = () => {
  return useQuery({
    queryKey: ['core-active-profiles'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('core-active-profiles', async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, name, name_ar, email, position')
            .eq('status', 'active')
            .order('name_ar');
          if (error) throw error;
          return data || [];
        });
      }, 'active-profiles-fetch');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

// Centralized analytics data hook
export const useOptimizedAnalyticsData = () => {
  return useQuery({
    queryKey: ['analytics-core-data'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('analytics-core-data', async () => {
          const [users, challenges, partners, campaigns, participants, submissions] = await Promise.all([
            supabase.from('profiles').select('id').limit(1000),
            supabase.from('challenges').select('id, status').limit(1000),
            supabase.from('partners').select('id').limit(1000),
            supabase.from('campaigns').select('id').limit(1000),
            supabase.from('challenge_participants').select('id').limit(1000),
            supabase.from('challenge_submissions').select('id, status').limit(1000)
          ]);

          return {
            users: users.data || [],
            challenges: challenges.data || [],
            partners: partners.data || [],
            campaigns: campaigns.data || [],
            participants: participants.data || [],
            submissions: submissions.data || []
          };
        });
      }, 'analytics-data-fetch');
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};