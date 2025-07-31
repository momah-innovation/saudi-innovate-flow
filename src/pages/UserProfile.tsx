import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AppShell } from "@/components/layout/AppShell";
import { useNavigate } from "react-router-dom";
import { getInitials, useSystemSettings } from '@/hooks/useSystemSettings';
import { EnhancedProfileHero } from '@/components/profile/EnhancedProfileHero';

interface ProfileForm {
  name: string;
  name_ar: string;
  email: string;
  phone?: string;
  job_title?: string;
  organization?: string;
  bio?: string;
  bio_ar?: string;
  linkedin_url?: string;
  twitter_url?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, userProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    name_ar: '',
    email: '',
    phone: '',
    job_title: '',
    organization: '',
    bio: '',
    bio_ar: '',
    linkedin_url: '',
    twitter_url: ''
  });

  useEffect(() => {
    if (userProfile) {
      setForm({
        name: userProfile.name_en || '',
        name_ar: userProfile.name_ar || '',
        email: user?.email || '',
        phone: userProfile.phone || '',
        job_title: userProfile.job_title || '',
        organization: userProfile.organization || '',
        bio: userProfile.bio_en || '',
        bio_ar: userProfile.bio_ar || '',
        linkedin_url: userProfile.linkedin_url || '',
        twitter_url: userProfile.twitter_url || ''
      });
    }
  }, [userProfile, user]);

  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleSubmit();
    } else {
      setIsEditing(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const updateData = {
        name_en: form.name,
        name_ar: form.name_ar,
        phone: form.phone,
        job_title: form.job_title,
        organization: form.organization,
        bio_en: form.bio,
        bio_ar: form.bio_ar,
        linkedin_url: form.linkedin_url,
        twitter_url: form.twitter_url,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث معلومات ملفك الشخصي",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "خطأ في التحديث",
        description: error.message || "فشل في تحديث الملف الشخصي",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "الملف الشخصي", href: "/profile" }
  ];

  return (
    <AppShell>
      <EnhancedProfileHero
        userProfile={userProfile}
        isEditing={isEditing}
        onToggleEdit={handleToggleEdit}
        onNavigate={navigate}
      />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-6">
          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle>الصورة الشخصية</CardTitle>
              <CardDescription>صورتك الشخصية التي تظهر في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile?.avatar_url} />
                  <AvatarFallback>
                    {userProfile?.name_ar ? getInitials(userProfile.name_ar) : <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" type="button">
                    تغيير الصورة
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG أو GIF. الحد الأقصى 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
              <CardDescription>معلوماتك الشخصية الأساسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ar">الاسم بالعربية *</Label>
                  <Input
                    id="name_ar"
                    value={form.name_ar}
                    onChange={(e) => handleInputChange('name_ar', e.target.value)}
                    placeholder="أدخل اسمك بالعربية"
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم بالإنجليزية</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your name in English"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    لا يمكن تغيير البريد الإلكتروني
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="أدخل رقم هاتفك"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>المعلومات المهنية</CardTitle>
              <CardDescription>معلومات عملك ومنصبك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job_title">المنصب الوظيفي</Label>
                  <Input
                    id="job_title"
                    value={form.job_title}
                    onChange={(e) => handleInputChange('job_title', e.target.value)}
                    placeholder="أدخل منصبك الوظيفي"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">المؤسسة</Label>
                  <Input
                    id="organization"
                    value={form.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    placeholder="أدخل اسم مؤسستك"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio_ar">نبذة شخصية بالعربية</Label>
                <Textarea
                  id="bio_ar"
                  value={form.bio_ar}
                  onChange={(e) => handleInputChange('bio_ar', e.target.value)}
                  placeholder="اكتب نبذة مختصرة عنك بالعربية"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio in English</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Write a brief bio about yourself in English"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>الروابط الاجتماعية</CardTitle>
              <CardDescription>روابط حساباتك على وسائل التواصل الاجتماعي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  value={form.linkedin_url}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_url">Twitter</Label>
                <Input
                  id="twitter_url"
                  value={form.twitter_url}
                  onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppShell>
  );
};

export default UserProfile;