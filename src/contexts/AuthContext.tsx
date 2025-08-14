import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { debugLog } from '@/utils/debugLogger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: { name: string; name_ar?: string }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasRole: (role: string) => boolean;
  userProfile: UserProfile | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (profileData: ProfileUpdateData) => Promise<{ error: Error | null }>;
}

interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  name_ar?: string;
  name_en?: string;
  phone?: string;
  department?: string;
  position?: string;
  job_title?: string;
  bio?: string;
  bio_ar?: string;
  bio_en?: string;
  preferred_language?: string;
  status?: string;
  profile_completion_percentage: number;
  user_roles?: Array<{ role: string; is_active: boolean; expires_at?: string }>;
  basic_access?: boolean;
  
  // Profile image and avatar fields
  profile_image_url?: string;
  avatar_url?: string;
  
  // Additional fields used in various components
  organization?: string;
  location?: string;
  website?: string;
  experience_level?: string;
  specializations?: string[];
  languages?: string[];
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // UI display fields
  display_name?: string;
  sector?: string;
  linkedin_url?: string;
  twitter_url?: string;
  roles?: string[];
  
  // New organizational hierarchy fields
  sector_id?: string;
  entity_id?: string;
  deputy_id?: string;
  department_id?: string;
  domain_id?: string;
  sub_domain_id?: string;
  service_id?: string;
}

interface ProfileUpdateData {
  fullName: string;
  fullNameAr?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  bio?: string;
  languages?: string[];
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      // Remove the edge function call from critical auth path - move to background
      // This was causing delays in auth initialization
      
      // Trigger profile completion calculation in background (non-blocking)
      setTimeout(async () => {
        try {
          await supabase.functions.invoke('calculate-profile-completion', {
            body: { user_id: userId }
          });
        } catch (error) {
          debugLog.warn('Background profile completion calculation failed', { userId, error });
        }
      }, 1000); // Delay to not block auth flow

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
        logger.error('Error fetching profile', { component: 'AuthContext', action: 'fetchUserProfile', userId }, profileError);
        // Don't block user access - set empty profile to allow dashboard access
        setUserProfile({ id: userId, basic_access: true, profile_completion_percentage: 0 });
        return;
      }

      if (rolesError) {
        logger.info('No roles found for user', { component: 'AuthContext', action: 'fetchUserProfile', userId });
      }

      // Combine profile with roles
      const enrichedProfile = {
        ...profile,
        user_roles: userRoles || []
      };

      setUserProfile(enrichedProfile);
      logger.info('AuthContext: Profile loaded successfully', {
        component: 'AuthContext',
        action: 'fetchUserProfile',
        data: {
          userId,
          profileId: enrichedProfile.id,
          completion: enrichedProfile.profile_completion_percentage,
          roles: enrichedProfile.user_roles?.map(r => r.role)
        }
      });
    } catch (error) {
      logger.error('Error in fetchUserProfile', { component: 'AuthContext', action: 'fetchUserProfile', userId }, error as Error);
      // Provide basic access even if profile fetch fails
      setUserProfile({ id: userId, basic_access: true, profile_completion_percentage: 0 });
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const updateProfile = async (profileData: ProfileUpdateData) => {
    if (!user) {
      return { error: { message: 'No user found' } };
    }

    try {
      // Calculate completion percentage based on filled fields
      const fields = {
        name: profileData.fullName,
        phone: profileData.phone,
        department: profileData.department,
        position: profileData.jobTitle,
        bio: profileData.bio,
        preferred_language: profileData.languages?.[0]
      };
      
      const filledFields = Object.values(fields).filter(value => value && value.trim() !== '').length;
      const completionPercentage = Math.round((filledFields / Object.keys(fields).length) * 100);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          name: profileData.fullName,
          name_ar: profileData.fullNameAr || '',
          phone: profileData.phone || '',
          department: profileData.department || '',
          position: profileData.jobTitle || '',
          bio: profileData.bio || '',
          preferred_language: profileData.languages?.[0] || 'العربية',
          status: 'active',
          profile_completion_percentage: completionPercentage,
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast({
          title: "Profile Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Refresh the profile data
      await refreshProfile();
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Profile Update Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    let profileFetched = false; // Prevent duplicate profile fetching

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isSubscribed) return;
        
        // Auth state logging removed for performance
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Only fetch profile if not already fetched and user exists
        if (session?.user && !profileFetched) {
          profileFetched = true;
          // Use a small delay to ensure auth state is fully set
          setTimeout(() => {
            if (isSubscribed) {
              fetchUserProfile(session.user.id);
            }
          }, 100);
        } else if (!session?.user) {
          profileFetched = false;
          setUserProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isSubscribed) return;
      
      // Initial session logging removed for performance
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Only fetch profile if not already fetched and user exists
      if (session?.user && !profileFetched) {
        profileFetched = true;
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
    
    return userProfile.user_roles.some((userRole: { role: string; is_active: boolean; expires_at?: string }) => 
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
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};