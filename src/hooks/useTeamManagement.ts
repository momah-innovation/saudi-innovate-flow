import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface TeamItem {
  id: string;
  name: string;
  description: string;
  leader_id: string;
  status: string;
  created_at: string;
  member_count: number;
  active_projects: number;
  leader_name?: string;
}

export interface TeamMemberItem {
  id: string;
  user_id: string;
  status: 'active' | 'inactive' | 'leave' | 'busy';
  cic_role: string;
  specialization: string | string[];
  bio?: string;
  location?: string;
  current_workload?: number;
  capacity?: number;
  created_at: string;
  updated_at: string;
  contact_email?: string;
  department?: string;
  profiles?: {
    id: string;
    name?: string;
    name_ar?: string;
    email?: string;
    profile_image_url?: string;
    department?: string;
    position?: string;
    role?: string;
  };
}

export const useTeamManagement = () => {
  const {
    data: teams = [],
    isLoading: loading,
    error,
    refetch: loadTeams,
    isError
  } = useQuery<TeamItem[]>({
    queryKey: ['teams-list'],
    queryFn: async () => {
      logger.info('Fetching teams list', { component: 'useTeamManagement' });
      
      // For now, return empty array until innovation_teams table is created
      // This will be populated when proper team management is implemented
      logger.info('Teams fetched successfully (mock)', { 
        component: 'useTeamManagement',
        count: 0
      });
      
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const {
    data: teamMembers = [],
    isLoading: membersLoading,
    error: membersError,
    refetch: loadTeamMembers
  } = useQuery<TeamMemberItem[]>({
    queryKey: ['team-members-list'],
    queryFn: async () => {
      logger.info('Fetching team members list', { component: 'useTeamManagement' });
      
      const { data, error } = await supabase
        .from('innovation_team_members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch team members', { component: 'useTeamManagement' }, error);
        throw error;
      }
      
      logger.info('Team members fetched successfully', { 
        component: 'useTeamManagement',
        count: data?.length || 0
      });
      
      // Transform data to match TeamMemberItem interface
      const transformedMembers = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id || '',
        status: item.status as 'active' | 'inactive' | 'leave' | 'busy',
        cic_role: item.cic_role || '',
        specialization: Array.isArray(item.specialization) ? item.specialization : [item.specialization || ''],
        bio: item.notes || '', // Using notes as bio since bio field doesn't exist
        location: '', // Field doesn't exist in DB
        current_workload: item.current_workload || 0,
        capacity: 100, // Field doesn't exist in DB, using default
        created_at: item.created_at || '',
        updated_at: item.created_at || '', // Field doesn't exist in DB, using created_at
        contact_email: item.contact_email || '',
        department: item.department || '',
        profiles: undefined // Will be populated separately if needed
      }));
      
      return transformedMembers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createTeam = useCallback(async (teamData: any): Promise<any> => {
    logger.info('Creating team', { component: 'useTeamManagement' });
    
    // Mock implementation - will be replaced when innovation_teams table is created
    await loadTeams();
    return { id: 'mock-id', ...teamData };
  }, [loadTeams]);

  const updateTeam = useCallback(async (teamId: string, teamData: any): Promise<any> => {
    logger.info('Updating team', { component: 'useTeamManagement' });
    
    // Mock implementation - will be replaced when innovation_teams table is created
    await loadTeams();
    return { id: teamId, ...teamData };
  }, [loadTeams]);

  const deleteTeam = useCallback(async (teamId: string): Promise<void> => {
    logger.info('Deleting team', { component: 'useTeamManagement' });
    
    // Mock implementation - will be replaced when innovation_teams table is created
    await loadTeams();
  }, [loadTeams]);

  const createTeamMember = useCallback(async (memberData: any): Promise<any> => {
    logger.info('Creating team member', { component: 'useTeamManagement' });
    
    const { data, error } = await supabase
      .from('innovation_team_members')
      .insert([memberData])
      .select()
      .maybeSingle();
    
    if (error) {
      logger.error('Failed to create team member', { component: 'useTeamManagement' }, error);
      throw error;
    }
    
    logger.info('Team member created successfully', { component: 'useTeamManagement' });
    
    // Refetch the list after creation
    await loadTeamMembers();
    return data;
  }, [loadTeamMembers]);

  const updateTeamMember = useCallback(async (memberId: string, memberData: any): Promise<any> => {
    logger.info('Updating team member', { component: 'useTeamManagement' });
    
    const { data, error } = await supabase
      .from('innovation_team_members')
      .update(memberData)
      .eq('id', memberId)
      .select()
      .maybeSingle();
    
    if (error) {
      logger.error('Failed to update team member', { component: 'useTeamManagement' }, error);
      throw error;
    }
    
    logger.info('Team member updated successfully', { component: 'useTeamManagement' });
    
    // Refetch the list after update
    await loadTeamMembers();
    return data;
  }, [loadTeamMembers]);

  const deleteTeamMember = useCallback(async (memberId: string): Promise<void> => {
    logger.info('Deleting team member', { component: 'useTeamManagement' });
    
    const { error } = await supabase
      .from('innovation_team_members')
      .update({ status: 'inactive' })
      .eq('id', memberId);
    
    if (error) {
      logger.error('Failed to delete team member', { component: 'useTeamManagement' }, error);
      throw error;
    }
    
    logger.info('Team member deleted successfully', { component: 'useTeamManagement' });
    
    // Refetch the list after deletion
    await loadTeamMembers();
  }, [loadTeamMembers]);

  return {
    teams,
    teamMembers,
    loading: loading || membersLoading,
    error: isError ? error : (membersError ? membersError : null),
    loadTeams,
    loadTeamMembers,
    createTeam,
    updateTeam,
    deleteTeam,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
  };
};