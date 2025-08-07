import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, Mail, Phone, MapPin, Globe, Calendar, Shield, 
  Bell, Lock, Camera, Save, Edit2, CheckCircle
} from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface ProfileSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  activityNotifications: boolean;
  challengeUpdates: boolean;
  eventReminders: boolean;
}

export const ProfileManager: React.FC = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { t, language } = useUnifiedTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    bio: '',
    phone: '',
    department: '',
    position: ''
  });

  const [settings, setSettings] = useState<ProfileSettings>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    activityNotifications: true,
    challengeUpdates: true,
    eventReminders: true
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        name_ar: userProfile.name_ar || '',
        bio: userProfile.bio || '',
        phone: userProfile.phone || '',
        department: userProfile.department || '',
        position: userProfile.position || ''
      });
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updateData = formData;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userProfile?.id);

      if (error) throw error;

      // Refresh user profile data
      setIsEditing(false);
      
      toast({
        title: t('profile_saved'),
        description: t('profile_updated_successfully'),
      });
    } catch (error: any) {
      toast({
        title: t('profile_save_error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userProfile?.id) return;

    setAvatarUploading(true);
    try {
      // Upload to avatars bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${userProfile.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars-public')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars-public')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: urlData.publicUrl })
        .eq('id', userProfile.id);

      if (updateError) throw updateError;

      // Refresh user profile data

      toast({
        title: t('avatar_updated'),
        description: t('avatar_uploaded_successfully'),
      });
    } catch (error: any) {
      toast({
        title: t('avatar_upload_error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSettingsUpdate = async (key: keyof ProfileSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // In a real app, you'd save these to a user_preferences table
    toast({
      title: t('settings_updated'),
      description: t('preferences_saved'),
    });
  };

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2" />
            <p>{t('profile_not_found')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('profile_management')}
              </CardTitle>
              <CardDescription>
                {t('profile_management_description')}
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              {isEditing ? t('save') : t('edit')}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {t('personal_information')}
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {t('professional_information')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            {t('notifications')}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            {t('security')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile_picture')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile.profile_image_url} />
                  <AvatarFallback className="text-lg">
                    {userProfile.name_ar?.charAt(0) || userProfile.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" disabled={avatarUploading}>
                      <Camera className="h-4 w-4 mr-2" />
                      {avatarUploading ? t('uploading') : t('change_picture')}
                    </Button>
                  </Label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={avatarUploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('max_file_size')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('basic_information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ar">{t('name_arabic')}</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    disabled={!isEditing}
                    placeholder={t('your_name_arabic')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name_english')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    placeholder={t('your_name_english')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone_number')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="+966 50 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{t('department')}</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    disabled={!isEditing}
                    placeholder={t('it_department')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t('bio')}</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  disabled={!isEditing}
                  placeholder={t('write_bio')}
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('professional_information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">{t('current_position')}</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    disabled={!isEditing}
                    placeholder={t('it_manager')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{t('department_administration')}</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    disabled={!isEditing}
                    placeholder={t('it_department')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('notification_preferences')}</CardTitle>
              <CardDescription>
                {t('notification_preferences_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'emailNotifications', labelKey: 'email_notifications', descriptionKey: 'email_notifications_description' },
                { key: 'activityNotifications', labelKey: 'activity_notifications', descriptionKey: 'activity_notifications_description' },
                { key: 'challengeUpdates', labelKey: 'challenge_updates', descriptionKey: 'challenge_updates_description' },
                { key: 'eventReminders', labelKey: 'event_reminders', descriptionKey: 'event_reminders_description' },
                { key: 'marketingEmails', labelKey: 'marketing_emails', descriptionKey: 'marketing_emails_description' },
                { key: 'smsNotifications', labelKey: 'sms_notifications', descriptionKey: 'sms_notifications_description' }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">{t(setting.labelKey)}</label>
                    <p className="text-sm text-muted-foreground">{t(setting.descriptionKey)}</p>
                  </div>
                  <Switch
                    checked={settings[setting.key as keyof ProfileSettings]}
                    onCheckedChange={(checked) => handleSettingsUpdate(setting.key as keyof ProfileSettings, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('security_settings')}</CardTitle>
              <CardDescription>
                {t('security_settings_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{t('password')}</h4>
                    <p className="text-sm text-muted-foreground">{t('last_changed_3_months')}</p>
                  </div>
                  <Button variant="outline">{t('change_password')}</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{t('two_factor_auth')}</h4>
                    <p className="text-sm text-muted-foreground">{t('two_factor_description')}</p>
                  </div>
                  <Badge variant="outline">{t('coming_soon')}</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{t('active_sessions')}</h4>
                    <p className="text-sm text-muted-foreground">{t('active_sessions_description')}</p>
                  </div>
                  <Button variant="outline">{t('view_sessions')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isEditing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form data
                  if (userProfile) {
                    setFormData({
                      name: userProfile.name || '',
                      name_ar: userProfile.name_ar || '',
                      bio: userProfile.bio || '',
                      phone: userProfile.phone || '',
                      department: userProfile.department || '',
                      position: userProfile.position || ''
                    });
                  }
                }}
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {loading ? t('loading') : t('save')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};