import React, { createContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debugLog } from '@/utils/debugLogger';
import type { AuthContextType, UserProfile, ProfileUpdateData } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string, signal?: AbortSignal) => {
    try {
      if (signal?.aborted) return;

      // First, trigger profile completion calculation
      debugLog.debug('Triggering profile completion calculation', { 
        component: 'AuthContext', 
        action: 'fetchUserProfile',
        userId 
      });
      
      const { error: calcError } = await supabase.functions.invoke('calculate-profile-completion', {
        body: { user_id: userId }
      });

      if (calcError) {
        debugLog.warn('Failed to calculate profile completion', { 
          component: 'AuthContext', 
          action: 'fetchUserProfile' 
        });
        // Continue with profile fetch even if calculation fails
      }

      // Use Promise.all to fetch profile and roles simultaneously
      const [profileResponse, rolesResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('user_roles')
          .select('role, is_active, expires_at')
          .eq('user_id', userId)
          .eq('is_active', true)
      ]);

      if (signal?.aborted) return;

      const { data: profile, error: profileError } = profileResponse;
      const { data: userRoles, error: rolesError } = rolesResponse;

      if (profileError) {
        debugLog.error('Error fetching profile', { component: 'AuthContext', action: 'fetchUserProfile', userId }, profileError);
        // Don't block user access - set empty profile to allow dashboard access
        setUserProfile({ id: userId, basic_access: true, profile_completion_percentage: 0 });
        return;
      }

      if (rolesError) {
        debugLog.debug('No roles found for user', { component: 'AuthContext', action: 'fetchUserProfile', userId });
      }

      // Combine profile with roles
      const enrichedProfile = {
        ...profile,
        user_roles: userRoles || [],
        basic_access: true
      };

      if (!signal?.aborted) {
        setUserProfile(enrichedProfile);
      }

      debugLog.debug('Profile fetched successfully', { 
        component: 'AuthContext', 
        action: 'fetchUserProfile',
        profileCompletionPercentage: enrichedProfile.profile_completion_percentage 
      });
    } catch (error) {
      if (!signal?.aborted) {
        debugLog.error('Failed to fetch user profile', { component: 'AuthContext', action: 'fetchUserProfile' }, error as Error);
        // Provide fallback profile for basic access
        setUserProfile({ id: userId, basic_access: true, profile_completion_percentage: 0 });
      }
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const hasRole = (role: string): boolean => {
    if (!userProfile?.user_roles) return false;
    return userProfile.user_roles.some(userRole => 
      userRole.role === role && 
      userRole.is_active && 
      (!userRole.expires_at || new Date(userRole.expires_at) > new Date())
    );
  };

  const signUp = async (email: string, password: string, userData?: { name: string; name_ar?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        debugLog.error('Signup error', { component: 'AuthContext', action: 'signUp' }, error);
        return { error };
      }
      
      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a verification link.",
        });
      }
      
      return { error: null };
    } catch (error) {
      debugLog.error('Signup exception', { component: 'AuthContext', action: 'signUp' }, error as Error);
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        debugLog.error('Signin error', { component: 'AuthContext', action: 'signIn' }, error);
        return { error };
      }
      return { error: null };
    } catch (error) {
      debugLog.error('Signin exception', { component: 'AuthContext', action: 'signIn' }, error as Error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        debugLog.error('Signout error', { component: 'AuthContext', action: 'signOut' }, error);
      }
      setUserProfile(null);
    } catch (error) {
      debugLog.error('Signout exception', { component: 'AuthContext', action: 'signOut' }, error as Error);
    }
  };

  const updateProfile = async (profileData: ProfileUpdateData) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        debugLog.error('Profile update error', { component: 'AuthContext', action: 'updateProfile' }, error);
        return { error };
      }

      // Refresh profile data
      await fetchUserProfile(user.id);
      return { error: null };
    } catch (error) {
      debugLog.error('Profile update exception', { component: 'AuthContext', action: 'updateProfile' }, error as Error);
      return { error: error as Error };
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    let abortController = new AbortController();

    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isSubscribed) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id, abortController.signal);
        }

        setLoading(false);
      } catch (error) {
        if (!abortController.signal.aborted) {
          debugLog.error(
            "Auth initialization error",
            { component: "AuthContext" },
            error as Error
          );
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isSubscribed) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Cancel previous profile fetch
        abortController.abort();
        abortController = new AbortController();
        await fetchUserProfile(session.user.id, abortController.signal);
      } else {
        setUserProfile(null);
      }
    });

    initializeAuth();

    return () => {
      isSubscribed = false;
      abortController.abort();
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    hasRole,
    userProfile,
    refreshProfile,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};