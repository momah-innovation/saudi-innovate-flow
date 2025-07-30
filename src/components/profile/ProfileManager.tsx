import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Briefcase, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  name: string;
  name_ar?: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  profile_image_url?: string;
  preferred_language?: string;
  status?: string;
}

interface ProfileManagerProps {
  userId: string;
  onProfileUpdate?: (profile: Profile) => void;
}

export function ProfileManager({ userId, onProfileUpdate }: ProfileManagerProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data || {
        id: userId,
        email: '',
        name: '',
        preferred_language: 'ar'
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<Profile>) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...profile,
          ...updatedData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      const updatedProfile = { ...profile, ...updatedData } as Profile;
      setProfile(updatedProfile);
      onProfileUpdate?.(updatedProfile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleSave = () => {
    if (profile) {
      updateProfile(profile);
    }
  };

  const handleAvatarUpdate = (url: string) => {
    updateProfile({ profile_image_url: url });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Profile not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Manage your personal information and avatar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <AvatarUpload
            currentAvatarUrl={profile.profile_image_url}
            userId={userId}
            onAvatarUpdate={handleAvatarUpdate}
            size="lg"
          />
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (English)</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={profile.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name_ar">Name (Arabic)</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name_ar"
                value={profile.name_ar || ''}
                onChange={(e) => handleInputChange('name_ar', e.target.value)}
                placeholder="أدخل اسمك"
                className="pl-10"
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={profile.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={profile.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="department"
                value={profile.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Enter your department"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="position"
                value={profile.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Enter your position"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="space-y-2">
          <Label htmlFor="language">Preferred Language</Label>
          <Select 
            value={profile.preferred_language || 'ar'} 
            onValueChange={(value) => handleInputChange('preferred_language', value)}
          >
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <SelectValue placeholder="Select language" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar">العربية (Arabic)</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio || ''}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </CardContent>
    </Card>
  );
}