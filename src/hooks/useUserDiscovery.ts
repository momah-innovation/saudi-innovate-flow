import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

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
        debugLog.error('Profile search error', { component: 'useUserDiscovery', action: 'searchUsers' }, error as Error);
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
      debugLog.error('User search failed', { component: 'useUserDiscovery', action: 'searchUsers' }, error as Error);
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
      debugLog.error('Failed to get online users', { component: 'useUserDiscovery', action: 'getOnlineUsers' }, error as Error);
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