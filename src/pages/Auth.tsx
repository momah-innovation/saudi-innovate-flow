import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Eye, EyeOff, ArrowLeft, Home } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useTranslation } from '@/hooks/useAppTranslation';

const Auth = () => {
  // Force light mode for auth page
  useEffect(() => {
    const root = document.documentElement;
    const originalClasses = root.className;
    root.classList.remove('dark');
    root.classList.add('light');
    
    return () => {
      root.className = originalClasses;
    };
  }, []);
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { language, isRTL } = useDirection();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMinLength, setPasswordMinLength] = useState(6);
  
  // Load system settings
  useEffect(() => {
    const loadSystemSettings = async () => {
      try {
        const { data } = await supabase
          .from('system_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['password_min_length']);
        
        if (data) {
          data.forEach(setting => {
            if (setting.setting_key === 'password_min_length') {
              setPasswordMinLength(parseInt(String(setting.setting_value)) || 6);
            }
          });
        }
      } catch (error) {
        console.error('Error loading system settings:', error);
      }
    };
    
    loadSystemSettings();
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    name_ar: '',
  });

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await signIn(formData.email, formData.password);
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert(t('passwordsDoNotMatch'));
      return;
    }

    if (formData.password.length < passwordMinLength) {
      alert(t('passwordMinLength', { length: passwordMinLength }));
      return;
    }

    setIsSubmitting(true);
    
    await signUp(formData.email, formData.password, {
      name: formData.name,
      name_ar: formData.name_ar || undefined,
    });
    
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      name_ar: '',
    });
  };

  const getText = (enText: string, arText: string): string => {
    return language === 'ar' ? arText : enText;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 ${isRTL ? 'rtl' : ''}`}>
      {/* Back to Landing Page Button */}
      <div className={`fixed top-4 ${isRTL ? 'right-4' : 'left-4'} z-50`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 text-muted-foreground hover:text-foreground ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <Home className="w-4 h-4" />
          {getText("Back to Home", "العودة للرئيسية")}
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className={`text-center mb-8 ${isRTL ? 'text-right' : ''}`}>
          <div className={`flex items-center justify-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <div className="text-2xl">🏗️</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {getText("Ruwād Innovation", "رواد الابتكار")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {getText("Government Innovation Platform", "منصة الابتكار الحكومي")}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">
              {getText("Sign In", "تسجيل الدخول")}
            </TabsTrigger>
            <TabsTrigger value="signup">
              {getText("Sign Up", "إنشاء حساب")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader className={isRTL ? 'text-right' : ''}>
                <CardTitle>{getText("Welcome Back", "أهلاً بعودتك")}</CardTitle>
                <CardDescription>
                  {getText(
                    "Sign in to access the innovation platform",
                    "سجل الدخول للوصول إلى منصة الابتكار"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className={isRTL ? 'text-right block' : ''}>
                      {getText("Email", "البريد الإلكتروني")}
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className={isRTL ? 'text-right' : ''}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className={isRTL ? 'text-right block' : ''}>
                      {getText("Password", "كلمة المرور")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        className={`${isRTL ? 'text-right pr-10' : 'pr-10'}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-3 py-2 hover:bg-transparent`}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                    {getText("Sign In", "تسجيل الدخول")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader className={isRTL ? 'text-right' : ''}>
                <CardTitle>{getText("Create Account", "إنشاء حساب")}</CardTitle>
                <CardDescription>
                  {getText(
                    "Join the government innovation platform",
                    "انضم إلى منصة الابتكار الحكومي"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className={isRTL ? 'text-right block' : ''}>
                        {getText("Name (English)", "الاسم (إنجليزي)")}
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className={isRTL ? 'text-right' : ''}
                        dir="ltr"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-name-ar" className={isRTL ? 'text-right block' : ''}>
                        {getText("Name (Arabic)", "الاسم (عربي)")}
                      </Label>
                      <Input
                        id="signup-name-ar"
                        type="text"
                        placeholder="الاسم الكامل"
                        value={formData.name_ar}
                        onChange={(e) => handleInputChange('name_ar', e.target.value)}
                        className="text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className={isRTL ? 'text-right block' : ''}>
                      {getText("Email", "البريد الإلكتروني")}
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className={isRTL ? 'text-right' : ''}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className={isRTL ? 'text-right block' : ''}>
                      {getText("Password", "كلمة المرور")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        minLength={passwordMinLength}
                        className={`${isRTL ? 'text-right pr-10' : 'pr-10'}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full px-3 py-2 hover:bg-transparent`}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className={isRTL ? 'text-right block' : ''}>
                      {getText("Confirm Password", "تأكيد كلمة المرور")}
                    </Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                      className={isRTL ? 'text-right' : ''}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                    {getText("Create Account", "إنشاء حساب")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className={`text-center text-sm text-muted-foreground mt-6 ${isRTL ? 'text-right' : ''}`}>
          {getText(
            "By signing in, you agree to our terms of service and privacy policy.",
            "بتسجيل الدخول، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا."
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;