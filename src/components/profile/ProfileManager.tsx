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
import { useTranslation } from '@/hooks/useAppTranslation';

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
  const { t, language } = useTranslation();
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
        title: "تم حفظ الملف الشخصي",
        description: "تم تحديث معلوماتك بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حفظ الملف الشخصي",
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
        title: "تم تحديث الصورة الشخصية",
        description: "تم رفع صورتك الشخصية بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في رفع الصورة",
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
      title: "تم تحديث الإعدادات",
      description: "تم حفظ تفضيلاتك",
    });
  };

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2" />
            <p>لا يمكن العثور على الملف الشخصي</p>
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
                الملف الشخصي
              </CardTitle>
              <CardDescription>
                إدارة معلوماتك الشخصية وتفضيلاتك
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              {isEditing ? "حفظ" : "تعديل"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            المعلومات الشخصية
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            المعلومات المهنية
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            الأمان
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الصورة الشخصية</CardTitle>
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
                      {avatarUploading ? "جارٍ الرفع..." : "تغيير الصورة"}
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
                    JPG, PNG أو GIF. أقصى حجم 2MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ar">الاسم (عربي)</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    disabled={!isEditing}
                    placeholder="اسمك بالعربية"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم (English)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Your name in English"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="+966 50 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">القسم</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    disabled={!isEditing}
                    placeholder="قسم تقنية المعلومات"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">النبذة التعريفية</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  disabled={!isEditing}
                  placeholder="اكتب نبذة مختصرة عنك..."
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات المهنية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">المنصب الحالي</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    disabled={!isEditing}
                    placeholder="مدير تقنية المعلومات"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">القسم/الإدارة</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    disabled={!isEditing}
                    placeholder="إدارة تقنية المعلومات"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تفضيلات الإشعارات</CardTitle>
              <CardDescription>
                اختر أنواع الإشعارات التي تريد استلامها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'emailNotifications', label: 'إشعارات البريد الإلكتروني', description: 'تلقي الإشعارات عبر البريد الإلكتروني' },
                { key: 'activityNotifications', label: 'إشعارات النشاط', description: 'إشعارات عن نشاطك وتحديثات الحساب' },
                { key: 'challengeUpdates', label: 'تحديثات التحديات', description: 'إشعارات عن التحديات الجديدة والمواعيد النهائية' },
                { key: 'eventReminders', label: 'تذكيرات الفعاليات', description: 'تذكيرات بالفعاليات والمؤتمرات القادمة' },
                { key: 'marketingEmails', label: 'رسائل تسويقية', description: 'رسائل حول المنتجات والخدمات الجديدة' },
                { key: 'smsNotifications', label: 'إشعارات SMS', description: 'تلقي الإشعارات عبر الرسائل النصية' }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">{setting.label}</label>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
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
              <CardTitle>إعدادات الأمان</CardTitle>
              <CardDescription>
                إدارة كلمة المرور وإعدادات الأمان الأخرى
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">كلمة المرور</h4>
                    <p className="text-sm text-muted-foreground">آخر تغيير منذ 3 أشهر</p>
                  </div>
                  <Button variant="outline">تغيير كلمة المرور</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">المصادقة الثنائية</h4>
                    <p className="text-sm text-muted-foreground">أضف طبقة أمان إضافية لحسابك</p>
                  </div>
                  <Badge variant="outline">قريباً</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">جلسات نشطة</h4>
                    <p className="text-sm text-muted-foreground">إدارة الأجهزة المتصلة بحسابك</p>
                  </div>
                  <Button variant="outline">عرض الجلسات</Button>
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
                إلغاء
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
                {loading ? "جارٍ الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};