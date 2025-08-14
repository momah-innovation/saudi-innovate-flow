import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
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

export interface UserProfile {
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
  privacy_settings?: {
    profile_public: boolean;
    contact_info_public: boolean;
  };
}

export interface ProfileUpdateData {
  name?: string;
  name_ar?: string;
  name_en?: string;
  phone?: string;
  bio?: string;
  bio_ar?: string;
  bio_en?: string;
  department?: string;
  position?: string;
  job_title?: string;
  preferred_language?: string;
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
  privacy_settings?: {
    profile_public: boolean;
    contact_info_public: boolean;
  };
}