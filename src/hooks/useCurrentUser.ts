// Central Auth Hook - Use This Instead of Direct supabase.auth.getUser() calls
// This prevents multiple network requests and uses cached user data

import { useAuth } from '@/contexts/AuthContext';

/**
 * CRITICAL: Use this hook instead of supabase.auth.getUser()
 * 
 * The useAuth hook provides cached user data from AuthContext
 * and prevents the multiple concurrent /user API calls that
 * were causing performance issues.
 * 
 * Before: supabase.auth.getUser() - causes network request
 * After:  useCurrentUser() - uses cached data
 */
export const useCurrentUser = () => {
  const { user, loading } = useAuth();
  
  return {
    user,
    loading,
    isAuthenticated: !!user
  };
};

/**
 * For components that need user ID immediately
 * Returns null if not authenticated
 */
export const useUserId = () => {
  const { user } = useAuth();
  return user?.id || null;
};

/**
 * For components that need to wait for auth to be resolved
 */
export const useAuthReady = () => {
  const { user, loading } = useAuth();
  return !loading;
};