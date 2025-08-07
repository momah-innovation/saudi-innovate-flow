// User Profile Setup - Phase 2
// Comprehensive profile completion flow

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Users, 
  Target, 
  Award,
  Camera,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { TestProfileCalculation } from '@/components/admin/TestProfileCalculation';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { logger } from '@/utils/logger';

interface UserRole {
  role: string;
  is_active: boolean;
}

interface ProfileData {
  // Basic Information
  fullName: string;
  jobTitle: string;
  department: string;
  organization: string;
  
  // Contact & Location
  phone: string;
  location: string;
  website: string;
  
  // Professional Info
  experienceLevel: 'junior' | 'mid' | 'senior' | 'expert';
  specializations: string[];
  bio: string;
  
  // Preferences
  languages: string[];
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // Avatar
  avatarUrl?: string;
}

export const ProfileSetup = () => {
  const { t, isRTL } = useUnifiedTranslation();
  const { getSettingValue } = useSettingsManager();
  const { toast } = useToast();
  const { user, userProfile, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  // Get specializations and experience levels from settings
  const specializationsData = getSettingValue('specializations', []) as string[];
  const experienceLevelsData = getSettingValue('experience_levels', []) as string[];
  const EXPERIENCE_LEVELS = experienceLevelsData.map((level, index) => {
    const values = ['junior', 'mid', 'senior', 'expert'];
    return { value: values[index] || 'junior', label: level };
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    jobTitle: '',
    department: '',
    organization: '',
    phone: '',
    location: '',
    website: '',
    experienceLevel: 'mid',
    specializations: [],
    bio: '',
    languages: ['العربية'],
    notificationPreferences: {
      email: true,
      sms: false,
      push: true
    }
  });

  useEffect(() => {
    logger.info('ProfileSetup useEffect triggered', { 
      component: 'ProfileSetup',
      action: 'useEffect',
      data: {
        hasUser: !!user,
        userProfile: !!userProfile,
        profileCompletion: userProfile?.profile_completion_percentage,
        userRoles: userProfile?.user_roles?.map(r => r.role)
      }
    });

    if (!user) {
      logger.info('ProfileSetup: No user, redirecting to auth', { component: 'ProfileSetup', action: 'redirectToAuth' });
      navigate('/auth');
      return;
    }
    
    // Load existing profile data if it exists
    if (userProfile && userProfile.id && userProfile.profile_completion_percentage >= 80) {
      logger.info('ProfileSetup: Profile complete, redirecting to dashboard', { component: 'ProfileSetup', action: 'redirectToDashboard' });
      navigate('/dashboard');
      return;
    }

    // If userProfile exists, load the data into form (whether complete or incomplete)
    if (userProfile && userProfile.id) {
      setProfileData(prev => ({
        ...prev,
        fullName: userProfile.name || user.user_metadata?.full_name || user.user_metadata?.name || '',
        jobTitle: userProfile.position || '',
        department: userProfile.department || '',
        organization: userProfile.organization || user.user_metadata?.organization || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        website: userProfile.website || '',
        experienceLevel: (userProfile.experience_level as 'junior' | 'mid' | 'senior' | 'expert') || 'mid',
        specializations: userProfile.specializations || [],
        bio: userProfile.bio || '',
        languages: userProfile.languages || ['العربية'],
        notificationPreferences: userProfile.notification_preferences || {
          email: true,
          sms: false,
          push: true
        }
      }));
    } else if (user) {
      // New user, just load basic info from auth metadata
      setProfileData(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
        organization: user.user_metadata?.organization || ''
      }));
    }
  }, [user, userProfile, navigate]);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof ProfileData, value: string | ProfileData['experienceLevel']) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setProfileData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleNotificationChange = (type: keyof ProfileData['notificationPreferences'], value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!profileData.fullName || !profileData.jobTitle || !profileData.organization) {
          toast({
            title: "معلومات ناقصة",
            description: "يرجى ملء جميع الحقول المطلوبة",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3:
        if (profileData.specializations.length === 0) {
          toast({
            title: "تخصص مطلوب",
            description: "يرجى اختيار تخصص واحد على الأقل",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    try {
      const { error } = await updateProfile(profileData);
      
      if (error) {
        toast({
          title: "خطأ في حفظ البيانات",
          description: error.message || "حدث خطأ غير متوقع",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "تم إكمال الملف الشخصي",
        description: "مرحباً بك في منصة رواد للابتكار",
      });

      navigate('/dashboard');
    } catch (error: unknown) {
      const err = error as Error;
      logger.error('Error saving profile data', { 
        component: 'ProfileSetup', 
        action: 'saveProfile' 
      }, err);
      toast({
        title: "خطأ في حفظ البيانات",
        description: err.message || "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={profileData.avatarUrl} />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'UN'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                تحديث الصورة
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">المسمى الوظيفي *</Label>
                  <Input
                    id="jobTitle"
                    value={profileData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="مثال: مطور تطبيقات"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">القسم</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="مثال: تقنية المعلومات"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">الجهة *</Label>
                  <Input
                    id="organization"
                    value={profileData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    placeholder="مثال: وزارة التقنية"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+966 50 123 4567"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">الموقع</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="الرياض، المملكة العربية السعودية"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">الموقع الإلكتروني</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">نبذة مختصرة</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="أخبرنا عن خبرتك وأهدافك في الابتكار..."
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>مستوى الخبرة *</Label>
              <Select
                value={profileData.experienceLevel}
                onValueChange={(value) => handleInputChange('experienceLevel', value as ProfileData['experienceLevel'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستوى خبرتك" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>التخصصات *</Label>
              <p className="text-sm text-muted-foreground">اختر واحد أو أكثر من مجالات خبرتك</p>
              <div className="grid grid-cols-2 gap-2">
                {specializationsData.map(spec => (
                  <div key={spec} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={spec}
                      checked={profileData.specializations.includes(spec)}
                      onCheckedChange={() => handleSpecializationToggle(spec)}
                    />
                    <Label htmlFor={spec} className="text-sm cursor-pointer">
                      {spec}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>تفضيلات الإشعارات</Label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <Label htmlFor="email-notifications">إشعارات البريد الإلكتروني</Label>
                  </div>
                  <Checkbox
                    id="email-notifications"
                    checked={profileData.notificationPreferences.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', !!checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Phone className="h-4 w-4 text-primary" />
                    <Label htmlFor="sms-notifications">الرسائل النصية</Label>
                  </div>
                  <Checkbox
                    id="sms-notifications"
                    checked={profileData.notificationPreferences.sms}
                    onCheckedChange={(checked) => handleNotificationChange('sms', !!checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Users className="h-4 w-4 text-primary" />
                    <Label htmlFor="push-notifications">إشعارات التطبيق</Label>
                  </div>
                  <Checkbox
                    id="push-notifications"
                    checked={profileData.notificationPreferences.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', !!checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-accent/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">ملخص الملف الشخصي</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium">الاسم:</span> {profileData.fullName}</p>
                <p><span className="font-medium">المسمى الوظيفي:</span> {profileData.jobTitle}</p>
                <p><span className="font-medium">الجهة:</span> {profileData.organization}</p>
                <p><span className="font-medium">مستوى الخبرة:</span> {EXPERIENCE_LEVELS.find(l => l.value === profileData.experienceLevel)?.label}</p>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-medium">التخصصات:</span>
                  {profileData.specializations.slice(0, 3).map(spec => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {profileData.specializations.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{profileData.specializations.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    'المعلومات الأساسية',
    'معلومات الاتصال',
    'الخبرة والتخصص',
    'التفضيلات'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">إكمال الملف الشخصي</h1>
          <p className="text-muted-foreground">
            أكمل ملفك الشخصي للاستفادة الكاملة من منصة رواد
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">الخطوة {currentStep} من {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">{stepTitles[currentStep - 1]}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "ابدأ بإدخال معلوماتك الأساسية"}
              {currentStep === 2 && "أضف معلومات الاتصال والنبذة الشخصية"}
              {currentStep === 3 && "حدد مستوى خبرتك ومجالات تخصصك"}
              {currentStep === 4 && "اختر تفضيلاتك واراجع المعلومات"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {renderStepContent()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                السابق
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="flex items-center gap-2">
                  التالي
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? "جارٍ الحفظ..." : "إكمال التسجيل"}
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* SIMPLE TEST - THIS SHOULD ALWAYS SHOW */}
        <div className="mt-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg">
          <h2 className="text-xl font-bold text-red-700">🚨 TEST: Can you see this red box?</h2>
          <p>If you can see this, the page is updating correctly.</p>
          <p>User logged in: {user ? 'YES' : 'NO'}</p>
          <p>Current time: {new Date().toLocaleTimeString()}</p>
        </div>
        
        {/* Always show debug info for troubleshooting */}
        <Card className="mt-4 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">🐛 Debug: Role Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>UserProfile exists:</strong> {userProfile ? 'Yes' : 'No'}</p>
              <p><strong>UserProfile.user_roles exists:</strong> {userProfile?.user_roles ? 'Yes' : 'No'}</p>
              {userProfile?.user_roles && (
                <div>
                  <p><strong>Roles found:</strong></p>
                  <ul className="list-disc list-inside">
                    {(userProfile.user_roles as UserRole[]).map((role: UserRole, index: number) => (
                      <li key={index}>
                        {role.role} (active: {role.is_active ? 'Yes' : 'No'})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p><strong>Has admin role:</strong> {(userProfile?.user_roles as UserRole[])?.some((r: UserRole) => r.role === 'admin' && r.is_active) ? 'Yes' : 'No'}</p>
              <p><strong>Has super_admin role:</strong> {(userProfile?.user_roles as UserRole[])?.some((r: UserRole) => r.role === 'super_admin' && r.is_active) ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Test Component - Show for any user for now */}
        <div className="mt-6">
          <TestProfileCalculation />
        </div>
      </div>
    </div>
  );
};