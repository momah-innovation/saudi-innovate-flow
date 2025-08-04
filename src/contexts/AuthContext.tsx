import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: { name: string; name_ar?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: string) => boolean;
  userProfile: any;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      // Use Promise.all to fetch profile and roles simultaneously
      const [profileResponse, rolesResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single(),
        supabase
          .from('user_roles')
          .select('role, is_active, expires_at')
          .eq('user_id', userId)
          .eq('is_active', true)
      ]);

      const { data: profile, error: profileError } = profileResponse;
      const { data: userRoles, error: rolesError } = rolesResponse;

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Don't block user access - set empty profile to allow dashboard access
        setUserProfile({ id: userId, basic_access: true });
        return;
      }

      if (rolesError) {
        console.log('No roles found for user:', rolesError);
      }

      // Combine profile with roles
      const enrichedProfile = {
        ...profile,
        user_roles: userRoles || []
      };

      setUserProfile(enrichedProfile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Provide basic access even if profile fetch fails
      setUserProfile({ id: userId, basic_access: true });
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isSubscribed) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer profile fetching to avoid auth state change deadlock
        if (session?.user) {
          // Use a small delay to ensure auth state is fully set
          setTimeout(() => {
            if (isSubscribed) {
              fetchUserProfile(session.user.id);
            }
          }, 100);
        } else {
          setUserProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isSubscribed) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => {
          if (isSubscribed) {
            fetchUserProfile(session.user.id);
          }
        }, 100);
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: { name: string; name_ar?: string }) => {
    try {
      const redirectUrl = `${window.location.origin}/auth/verify-email`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "تم إنشاء الحساب",
        description: "يرجى فحص بريدك الإلكتروني لتأكيد الحساب",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const hasRole = (role: string): boolean => {
    if (!userProfile?.user_roles) return false;
    
    return userProfile.user_roles.some((userRole: any) => 
      userRole.role === role && 
      userRole.is_active && 
      (!userRole.expires_at || new Date(userRole.expires_at) > new Date())
    );
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    hasRole,
    userProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};