import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const updateProfile = async (userId: string, profileData: Partial<ProfileData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
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
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Trigger profile completion calculation
      await supabase.functions.invoke('calculate-profile-completion', {
        body: { user_id: userId }
      });

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const fileName = `avatars/${userId}/${Date.now()}.${file.name.split('.').pop()}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully'
      });

      return publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (userId: string, settings: Partial<ProfileSettings>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          settings: {
            emailNotifications: settings.emailNotifications,
            smsNotifications: settings.smsNotifications,
            marketingEmails: settings.marketingEmails,
            activityNotifications: settings.activityNotifications,
            challengeUpdates: settings.challengeUpdates,
            eventReminders: settings.eventReminders,
            privacy_level: settings.privacy_level,
            language_preference: settings.language_preference,
            timezone: settings.timezone
          },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Settings updated successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSecuritySettings = async (userId: string, securitySettings: Partial<SecuritySettings>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          security_settings: {
            two_factor_enabled: securitySettings.two_factor_enabled,
            login_notifications: securitySettings.login_notifications,
            session_timeout: securitySettings.session_timeout,
            allowed_login_attempts: securitySettings.allowed_login_attempts
          },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Security settings updated successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update security settings';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result: any = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId);
      
      const profile = result.data?.[0] || null;
      const profileError = result.error;

      if (profileError) {
        throw profileError;
      }

      return profile || null;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadUserSettings = async (userId: string) => {
    setLoading(true);
    
    try {
      const result: any = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId);
      
      const profile = result.data?.[0] || null;
      const error = result.error;

      if (error) throw error;

      return profile || null;
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
      const { error: deleteError } = await supabase
        .from('profiles')
        .update({ 
          status: 'deleted',
          deleted_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      toast({
        title: 'Account Deleted',
        description: 'Your account has been deleted successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Password updated successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
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