import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspacePermissions } from './useWorkspacePermissions';

// User Workspace Data
export function useUserWorkspaceData() {
  const { user } = useAuth();
  const permissions = useWorkspacePermissions();

  return useQuery({
    queryKey: ['userWorkspace', user?.id],
    queryFn: async () => {
      if (!user || !permissions.canViewOwnIdeas) return null;

      const [ideasResult, challengesResult, bookmarksResult] = await Promise.all([
        // User's ideas
        supabase
          .from('ideas')
          .select('*')
          .eq('innovator_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        
        // Participated challenges
        supabase
          .from('challenge_participants')
          .select(`
            *,
            challenges (
              id,
              title_ar,
              status,
              start_date,
              end_date
            )
          `)
          .eq('user_id', user.id)
          .order('registration_date', { ascending: false })
          .limit(5),

        // User bookmarks
        supabase
          .from('challenge_bookmarks')
          .select(`
            *,
            challenges (
              id,
              title_ar,
              status
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      return {
        ideas: ideasResult.data || [],
        participatedChallenges: challengesResult.data || [],
        bookmarks: bookmarksResult.data || [],
        stats: {
          totalIdeas: ideasResult.data?.length || 0,
          activeChallenges: challengesResult.data?.filter(p => p.challenges?.status === 'active').length || 0,
          savedItems: bookmarksResult.data?.length || 0
        }
      };
    },
    enabled: !!user && permissions.canViewOwnIdeas,
  });
}

// Expert Workspace Data
export function useExpertWorkspaceData() {
  const { user } = useAuth();
  const permissions = useWorkspacePermissions();

  return useQuery({
    queryKey: ['expertWorkspace', user?.id],
    queryFn: async () => {
      if (!user || !permissions.canEvaluateIdeas) return null;

      const [evaluationsResult, assignedChallengesResult] = await Promise.all([
        // Pending evaluations
        supabase
          .from('idea_evaluations')
          .select(`
            *,
            ideas (
              id,
              title_ar,
              status,
              created_at
            )
          `)
          .eq('evaluator_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),

        // Assigned challenges
        supabase
          .from('challenge_experts')
          .select(`
            *,
            challenges (
              id,
              title_ar,
              status,
              start_date,
              end_date
            )
          `)
          .eq('expert_id', user.id)
          .eq('status', 'active')
          .order('assignment_date', { ascending: false })
      ]);

      return {
        evaluations: evaluationsResult.data || [],
        assignedChallenges: assignedChallengesResult.data || [],
        stats: {
          pendingEvaluations: evaluationsResult.data?.filter(e => !e.overall_score).length || 0,
          completedEvaluations: evaluationsResult.data?.filter(e => e.overall_score).length || 0,
          assignedChallenges: assignedChallengesResult.data?.length || 0
        }
      };
    },
    enabled: !!user && permissions.canEvaluateIdeas,
  });
}

// Organization Workspace Data
export function useOrganizationWorkspaceData() {
  const { user } = useAuth();
  const permissions = useWorkspacePermissions();

  return useQuery({
    queryKey: ['organizationWorkspace', user?.id],
    queryFn: async () => {
      if (!user || !permissions.canManageChallenges) return null;

      const [challengesResult, submissionsResult, teamResult] = await Promise.all([
        // Organization challenges
        supabase
          .from('challenges')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),

        // Recent submissions
        supabase
          .from('challenge_submissions')
          .select(`
            *,
            challenges (
              id,
              title_ar
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10),

        // Team members
        supabase
          .from('innovation_team_members')
          .select('*')
          .eq('status', 'active')
      ]);

      return {
        challenges: challengesResult.data || [],
        submissions: submissionsResult.data || [],
        teamMembers: teamResult.data || [],
        stats: {
          activeChallenges: challengesResult.data?.filter(c => c.status === 'active').length || 0,
          totalSubmissions: submissionsResult.data?.length || 0,
          teamSize: teamResult.data?.length || 0,
          completedChallenges: challengesResult.data?.filter(c => c.status === 'completed').length || 0
        }
      };
    },
    enabled: !!user && permissions.canManageChallenges,
  });
}

// Partner Workspace Data
export function usePartnerWorkspaceData() {
  const { user } = useAuth();
  const permissions = useWorkspacePermissions();

  return useQuery({
    queryKey: ['partnerWorkspace', user?.id],
    queryFn: async () => {
      if (!user || !permissions.canViewOpportunities) return null;

      const [opportunitiesResult, partnershipsResult, applicationsResult] = await Promise.all([
        // Available opportunities
        supabase
          .from('opportunities')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(10),

        // Active partnerships
        supabase
          .from('challenge_partners')
          .select(`
            *,
            challenges (
              id,
              title_ar,
              status
            )
          `)
          .eq('status', 'active')
          .order('partnership_start_date', { ascending: false }),

        // Partner applications
        supabase
          .from('opportunity_applications')
          .select(`
            *,
            opportunities (
              id,
              title_ar,
              status
            )
          `)
          .eq('applicant_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      return {
        opportunities: opportunitiesResult.data || [],
        partnerships: partnershipsResult.data || [],
        applications: applicationsResult.data || [],
        stats: {
          availableOpportunities: opportunitiesResult.data?.length || 0,
          activePartnerships: partnershipsResult.data?.length || 0,
          pendingApplications: applicationsResult.data?.filter(a => a.status === 'pending').length || 0,
          acceptedApplications: applicationsResult.data?.filter(a => a.status === 'accepted').length || 0
        }
      };
    },
    enabled: !!user && permissions.canViewOpportunities,
  });
}

// Admin Workspace Data
export function useAdminWorkspaceData() {
  const { user } = useAuth();
  const permissions = useWorkspacePermissions();

  return useQuery({
    queryKey: ['adminWorkspace', user?.id],
    queryFn: async () => {
      if (!user || !permissions.canManageSystem) return null;

      const [usersResult, challengesResult, ideasResult, systemHealthResult] = await Promise.all([
        // System users
        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),

        // All challenges
        supabase
          .from('challenges')
          .select('*')
          .order('created_at', { ascending: false }),

        // All ideas
        supabase
          .from('ideas')
          .select('*')
          .order('created_at', { ascending: false }),

        // System health metrics (mock data)
        Promise.resolve({
          uptime: '99.9%',
          responseTime: '120ms',
          activeUsers: 1250,
          systemLoad: 'Normal'
        })
      ]);

      return {
        recentUsers: usersResult.data || [],
        challenges: challengesResult.data || [],
        ideas: ideasResult.data || [],
        systemHealth: systemHealthResult,
        stats: {
          totalUsers: usersResult.data?.length || 0,
          totalChallenges: challengesResult.data?.length || 0,
          totalIdeas: ideasResult.data?.length || 0,
          activeChallenges: challengesResult.data?.filter(c => c.status === 'active').length || 0
        }
      };
    },
    enabled: !!user && permissions.canManageSystem,
  });
}

// Team Workspace Data
export function useTeamWorkspaceData() {
  const { user } = useAuth();
  const permissions = useWorkspacePermissions();

  return useQuery({
    queryKey: ['teamWorkspace', user?.id],
    queryFn: async () => {
      if (!user || !permissions.canViewTeamMetrics) return null;

      const [assignmentsResult, activitiesResult, membersResult] = await Promise.all([
        // Team assignments
        supabase
          .from('team_assignments')
          .select(`
            *,
            innovation_team_members (
              id,
              user_id,
              profiles (
                display_name,
                profile_image_url
              )
            )
          `)
          .eq('status', 'active')
          .order('assigned_date', { ascending: false })
          .limit(10),

        // Recent activities
        supabase
          .from('team_activities')
          .select(`
            *,
            innovation_team_members (
              profiles (
                display_name
              )
            )
          `)
          .order('activity_date', { ascending: false })
          .limit(10),

        // Team members
        supabase
          .from('innovation_team_members')
          .select(`
            *,
            profiles (
              display_name,
              profile_image_url,
              expertise_areas
            )
          `)
          .eq('status', 'active')
      ]);

      return {
        assignments: assignmentsResult.data || [],
        activities: activitiesResult.data || [],
        members: membersResult.data || [],
        stats: {
          activeAssignments: assignmentsResult.data?.length || 0,
          teamMembers: membersResult.data?.length || 0,
          completedTasks: activitiesResult.data?.filter(a => a.activity_type === 'completion').length || 0,
          averageWorkload: membersResult.data?.reduce((acc, m) => acc + (m.current_workload || 0), 0) / (membersResult.data?.length || 1) || 0
        }
      };
    },
    enabled: !!user && permissions.canViewTeamMetrics,
  });
}