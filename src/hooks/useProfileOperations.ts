import { useState } from 'react';
import { toast } from 'sonner';

export interface ProfileData {
  name: string;
  name_ar?: string;
  bio?: string;
  phone?: string;
  department?: string;
  position?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  avatar_url?: string;
  cover_image_url?: string;
}

export interface ProfileSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  activityNotifications: boolean;
  challengeUpdates: boolean;
  eventReminders: boolean;
  privacy_level: string;
  language_preference: string;
  timezone: string;
}

export interface SecuritySettings {
  two_factor_enabled: boolean;
  login_notifications: boolean;
  session_timeout: number;
  allowed_login_attempts: number;
}

export const useProfileOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (userId: string, profileData: Partial<ProfileData>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Import supabase dynamically to avoid type issues
      const { supabase } = await import('@/integrations/supabase/client');
      
      const updateData = {
        name: profileData.name,
        name_ar: profileData.name_ar,
        bio: profileData.bio,
        phone: profileData.phone,
        department: profileData.department,
        position: profileData.position,
        location: profileData.location,
        website: profileData.website,
        linkedin: profileData.linkedin,
        updated_at: new Date().toISOString()
      };

      const result: any = await (supabase as any)
        .from('profiles')
        .update(updateData as any)
        .eq('user_id', userId);

      if (result.error) throw result.error;

      // Trigger profile completion calculation
      await supabase.functions.invoke('calculate-profile-completion', {
        body: { user_id: userId }
      });

      toast.success('Profile updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const fileName = `avatars/${userId}/${Date.now()}.${file.name.split('.').pop()}`;
      
      // Upload file to storage
      const uploadResult = await (supabase as any).storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadResult.error) throw uploadResult.error;

      // Get public URL
      const urlResult = (supabase as any).storage
        .from('avatars')
        .getPublicUrl(fileName);

      const publicUrl = urlResult.data.publicUrl;

      // Update profile with new avatar URL
      const updateResult = await (supabase as any)
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        } as any)
        .eq('user_id', userId);

      if (updateResult.error) throw updateResult.error;

      toast.success('Avatar uploaded successfully');
      return publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (userId: string, settings: Partial<ProfileSettings>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const settingsData = {
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        marketingEmails: settings.marketingEmails,
        activityNotifications: settings.activityNotifications,
        challengeUpdates: settings.challengeUpdates,
        eventReminders: settings.eventReminders,
        privacy_level: settings.privacy_level,
        language_preference: settings.language_preference,
        timezone: settings.timezone
      };

      const result = await (supabase as any)
        .from('profiles')
        .update({
          settings: settingsData,
          updated_at: new Date().toISOString()
        } as any)
        .eq('user_id', userId);

      if (result.error) throw result.error;

      toast.success('Settings updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSecuritySettings = async (userId: string, securitySettings: Partial<SecuritySettings>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const securityData = {
        two_factor_enabled: securitySettings.two_factor_enabled,
        login_notifications: securitySettings.login_notifications,
        session_timeout: securitySettings.session_timeout,
        allowed_login_attempts: securitySettings.allowed_login_attempts
      };

      const result = await (supabase as any)
        .from('profiles')
        .update({
          security_settings: securityData,
          updated_at: new Date().toISOString()
        } as any)
        .eq('user_id', userId);

      if (result.error) throw result.error;

      toast.success('Security settings updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update security settings';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const result = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', userId);
      
      if (result.error) throw result.error;

      const profile = result.data?.[0] || null;
      return profile;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load profile';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadUserSettings = async (userId: string): Promise<any> => {
    setLoading(true);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const result = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', userId);
      
      if (result.error) throw result.error;

      const profile = result.data?.[0] || null;
      return profile;
    } catch (error: any) {
      setError(error?.message || 'Failed to load settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const result = await (supabase as any)
        .from('profiles')
        .update({ 
          status: 'deleted',
          deleted_at: new Date().toISOString()
        } as any)
        .eq('user_id', userId);

      if (result.error) throw result.error;

      toast.success('Account deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const result = await supabase.auth.updateUser({
        password: newPassword
      });

      if (result.error) throw result.error;

      toast.success('Password updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateProfile,
    uploadAvatar,
    updateSettings,
    updateSecuritySettings,
    loadUserProfile,
    loadUserSettings,
    deleteAccount,
    updatePassword
  };
};