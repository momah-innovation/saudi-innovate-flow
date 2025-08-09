import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  expertise?: string[];
}

export const useUserDiscovery = () => {
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // Search users by name, email, or expertise
  const searchUsers = useCallback(async (query: string): Promise<UserProfile[]> => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    setLoading(true);
    try {
      // First search in profiles table for basic user info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          email,
          avatar_url,
          bio,
          user_id
        `)
        .or(`display_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(20);

      if (profileError) {
        console.error('Profile search error:', profileError);
      }

      // Also search in innovation team members for additional context
      const { data: teamData, error: teamError } = await supabase
        .from('innovation_team_members')
        .select(`
          user_id,
          specialization,
          department_id,
          role
        `)
        .eq('status', 'active');

      if (teamError) {
        console.error('Team member search error:', teamError);
      }

      // Combine results
      const users: UserProfile[] = (profileData || []).map(profile => {
        const teamInfo = teamData?.find(tm => tm.user_id === profile.user_id);
        return {
          id: profile.user_id,
          display_name: profile.display_name || profile.email || 'مستخدم',
          email: profile.email,
          avatar_url: profile.avatar_url,
          role: teamInfo?.role || 'user',
          department: teamInfo?.department,
          expertise: teamInfo?.specialization ? [teamInfo.specialization] : []
        };
      });

      // Filter by expertise if query matches
      const filteredUsers = users.filter(user => {
        const matchesName = user.display_name?.toLowerCase().includes(query.toLowerCase());
        const matchesEmail = user.email?.toLowerCase().includes(query.toLowerCase());
        const matchesExpertise = user.expertise?.some(exp => 
          exp.toLowerCase().includes(query.toLowerCase())
        );
        return matchesName || matchesEmail || matchesExpertise;
      });

      setSearchResults(filteredUsers);
      return filteredUsers;
    } catch (error) {
      console.error('User search failed:', error);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get online users (from collaboration context)
  const getOnlineUsers = useCallback(async (): Promise<UserProfile[]> => {
    try {
      // This would typically come from the collaboration presence system
      // For now, return active team members as a fallback
      const { data, error } = await supabase
        .from('innovation_team_members')
        .select(`
          user_id,
          expertise,
          department,
          role,
          profiles (
            display_name,
            email,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .limit(50);

      if (error) throw error;

      return (data || []).map(member => ({
        id: member.user_id,
        display_name: member.profiles?.display_name || member.profiles?.email || 'مستخدم',
        email: member.profiles?.email || '',
        avatar_url: member.profiles?.avatar_url,
        role: member.role || 'user',
        department: member.department,
        expertise: member.expertise || []
      }));
    } catch (error) {
      console.error('Failed to get online users:', error);
      return [];
    }
  }, []);

  // Get user suggestions based on current context
  const getUserSuggestions = useCallback(async (
    contextType: string,
    contextId?: string
  ): Promise<UserProfile[]> => {
    try {
      // Get users relevant to the current context
      let query = supabase
        .from('innovation_team_members')
        .select(`
          user_id,
          expertise,
          department,
          role,
          profiles (
            display_name,
            email,
            avatar_url
          )
        `)
        .eq('status', 'active');

      // Add context-specific filters
      if (contextType === 'team' && contextId) {
        // Filter by team members
        query = query.eq('team_id', contextId);
      } else if (contextType === 'project' && contextId) {
        // This would require a project members table
        // For now, return all active members
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      return (data || []).map(member => ({
        id: member.user_id,
        display_name: member.profiles?.display_name || member.profiles?.email || 'مستخدم',
        email: member.profiles?.email || '',
        avatar_url: member.profiles?.avatar_url,
        role: member.role || 'user',
        department: member.department,
        expertise: member.expertise || []
      }));
    } catch (error) {
      console.error('Failed to get user suggestions:', error);
      return [];
    }
  }, []);

  return {
    searchResults,
    loading,
    searchUsers,
    getOnlineUsers,
    getUserSuggestions
  };
};