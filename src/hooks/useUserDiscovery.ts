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

  // Search users by basic info (simplified to avoid schema issues)
  const searchUsers = useCallback(async (query: string): Promise<UserProfile[]> => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    setLoading(true);
    try {
      // Simplified search using only confirmed table columns
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, email, name')
        .ilike('email', `%${query}%`)
        .limit(20);

      if (error) {
        console.error('Profile search error:', error);
        setSearchResults([]);
        return [];
      }

      const users: UserProfile[] = (profileData || []).map(profile => ({
        id: profile.id,
        display_name: profile.name || profile.email?.split('@')[0] || 'مستخدم',
        email: profile.email || '',
        role: 'user',
        expertise: []
      }));

      setSearchResults(users);
      return users;
    } catch (error) {
      console.error('User search failed:', error);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get online users (simplified)
  const getOnlineUsers = useCallback(async (): Promise<UserProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name')
        .limit(10);

      if (error) throw error;

      return (data || []).map(profile => ({
        id: profile.id,
        display_name: profile.name || profile.email?.split('@')[0] || 'مستخدم',
        email: profile.email || '',
        role: 'user',
        expertise: []
      }));
    } catch (error) {
      console.error('Failed to get online users:', error);
      return [];
    }
  }, []);

  // Get user suggestions (simplified)
  const getUserSuggestions = useCallback(async (): Promise<UserProfile[]> => {
    return getOnlineUsers();
  }, [getOnlineUsers]);

  return {
    searchResults,
    loading,
    searchUsers,
    getOnlineUsers,
    getUserSuggestions
  };
};