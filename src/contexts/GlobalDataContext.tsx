/**
 * Global Data Context - Centralized React Query provider for shared data
 * Eliminates duplicate network requests across the app
 */

import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryBatcher } from '@/utils/queryBatcher';
import { timeAsync } from '@/utils/performanceMonitor';

interface GlobalData {
  systemSettings: any;
  systemLists: any;
  notifications: any[];
  profiles: any[];
  challengeParticipants: any[];
  challengeSubmissions: any[];
  challenges: any[];
  isLoading: boolean;
  error: Error | null;
}

const GlobalDataContext = createContext<GlobalData | undefined>(undefined);

export const useGlobalData = () => {
  const context = useContext(GlobalDataContext);
  if (!context) {
    throw new Error('useGlobalData must be used within GlobalDataProvider');
  }
  return context;
};

interface GlobalDataProviderProps {
  children: React.ReactNode;
}

export const GlobalDataProvider: React.FC<GlobalDataProviderProps> = ({ children }) => {
  // Centralized system settings query
  const { data: systemSettings = {}, isLoading: settingsLoading } = useQuery({
    queryKey: ['global-system-settings'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('global-system-settings', async () => {
          const { data, error } = await supabase
            .from('system_settings')
            .select('setting_key, setting_value')
            .in('setting_key', [
              'challenge_sensitivity_levels',
              'partner_type_options', 
              'partnership_type_options',
              'expert_status_options',
              'assignment_status_options',
              'role_request_status_options',
              'available_user_roles',
              'requestable_user_roles',
              'team_specialization_options',
              'focus_question_types',
              'experience_levels',
              'event_formats',
              'event_categories', 
              'event_visibility_options',
              'supported_languages',
              'stakeholder_influence_levels',
              'stakeholder_interest_levels',
              'idea_maturity_levels',
              'campaign_theme_options',
              'attendance_status_options',
              'evaluator_types',
              'relationship_types',
              'organization_types',
              'sector_types',
              'tag_categories',
              'sensitivity_levels',
              'frequency_options',
              'backup_frequency_options',
              'report_frequency_options',
              'reminder_frequency_options',
              'recurrence_pattern_options',
              'question_type_options',
              'time_range_options',
              'role_request_justifications',
              'ui_language_options',
              'stakeholder_categories',
              'engagement_levels',
              'chart_color_palette',
              'theme_variants',
              'theme_color_schemes',
              'theme_border_radius_options',
              'navigation_menu_visibility_roles',
              'data_export_formats',
              'chart_visualization_colors'
            ]);
          if (error) throw error;
          return data || [];
        });
      }, 'global-system-settings-fetch');
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: false
  });

  // Centralized system lists query
  const { data: systemLists = [], isLoading: listsLoading } = useQuery({
    queryKey: ['global-system-lists'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('global-system-lists', async () => {
          const { data, error } = await supabase
            .from('system_lists')
            .select('list_key, list_values')
            .eq('is_active', true);
          if (error) throw error;
          return data || [];
        });
      }, 'global-system-lists-fetch');
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Centralized profiles query (limited for performance)
  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ['global-profiles-summary'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('global-profiles-summary', async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, created_at')
            .limit(100);
          if (error) throw error;
          return data || [];
        });
      }, 'global-profiles-fetch');
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Centralized challenge participants query
  const { data: challengeParticipants = [], isLoading: participantsLoading } = useQuery({
    queryKey: ['global-challenge-participants'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('global-challenge-participants', async () => {
          const { data, error } = await supabase
            .from('challenge_participants')
            .select('id, created_at')
            .limit(100);
          if (error) throw error;
          return data || [];
        });
      }, 'global-challenge-participants-fetch');
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Centralized challenge submissions query
  const { data: challengeSubmissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['global-challenge-submissions'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('global-challenge-submissions', async () => {
          const { data, error } = await supabase
            .from('challenge_submissions')
            .select('id, status, created_at')
            .limit(100);
          if (error) throw error;
          return data || [];
        });
      }, 'global-challenge-submissions-fetch');
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Centralized challenges query (limited)
  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['global-challenges-summary'],
    queryFn: async () => {
      return await timeAsync(async () => {
        return await queryBatcher.batch('global-challenges-summary', async () => {
          const { data, error } = await supabase
            .from('challenges')
            .select('id, status, created_at')
            .limit(100);
          if (error) throw error;
          return data || [];
        });
      }, 'global-challenges-fetch');
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const isLoading = settingsLoading || listsLoading || profilesLoading || 
                   participantsLoading || submissionsLoading || challengesLoading;

  const value: GlobalData = {
    systemSettings,
    systemLists,
    notifications: [], // Will be handled by specific notification hooks
    profiles,
    challengeParticipants,
    challengeSubmissions,
    challenges,
    isLoading,
    error: null
  };

  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
};