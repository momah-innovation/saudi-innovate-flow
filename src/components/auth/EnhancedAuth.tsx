// Enhanced Authentication System - Phase 2
// Modern, secure authentication with profile management

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Shield, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  organization?: string;
  role?: string;
}

export const EnhancedAuth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    organization: '',
    role: 'innovator'
  });

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return false;
    }

    if (activeTab === 'signup') {
      if (!formData.fullName) {
        toast({
          title: "خطأ في التحقق",
          description: "يرجى إدخال الاسم الكامل",
          variant: "destructive",
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "خطأ في التحقق", 
          description: "كلمات المرور غير متطابقة",
          variant: "destructive",
        });
        return false;
      }

      if (formData.password.length < 8) {
        toast({
          title: "خطأ في التحقق",
          description: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        await signIn(formData.email, formData.password);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في منصة رواد",
        });
        navigate('/dashboard');
      } else {
        await signUp(formData.email, formData.password, {
          name: formData.fullName
        });
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ في العملية",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'microsoft') => {
    setIsLoading(true);
    try {
      // TODO: Implement social auth in Phase 2
      toast({
        title: "قريباً",
        description: `تسجيل الدخول عبر ${provider === 'google' ? 'Google' : 'Microsoft'} متاح قريباً`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const SecurityBadges = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      <Badge variant="secondary" className="flex items-center gap-1">
        <Shield className="h-3 w-3" />
        حماية متقدمة
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        تشفير شامل
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <Building2 className="h-3 w-3" />
        معتمد حكومياً
      </Badge>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/logo.png" alt="Ruwād Logo" />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                رواد
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            منصة رواد للابتكار
          </h1>
          <p className="text-muted-foreground mt-2">
            بوابة الابتكار الحكومي في المملكة العربية السعودية
          </p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <div className="text-center">
                  <CardTitle className="text-2xl">أهلاً بعودتك</CardTitle>
                  <CardDescription>ادخل إلى حسابك للمتابعة</CardDescription>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="text-center">
                  <CardTitle className="text-2xl">انضم إلى رواد</CardTitle>
                  <CardDescription>ابدأ رحلتك في الابتكار الحكومي</CardDescription>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      className="pl-10"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={activeTab === 'signup' ? "8 أحرف على الأقل" : "أدخل كلمة المرور"}
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {activeTab === 'signup' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="أعد إدخال كلمة المرور"
                        className="pl-10 pr-10"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">الجهة (اختياري)</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="organization"
                        type="text"
                        placeholder="اسم الوزارة أو الجهة الحكومية"
                        className="pl-10"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? "جارٍ التحميل..." : activeTab === 'login' ? "تسجيل الدخول" : "إنشاء الحساب"}
              </Button>

              {activeTab === 'login' && (
                <div className="text-center">
                  <Button variant="link" className="text-sm text-muted-foreground">
                    نسيت كلمة المرور؟
                  </Button>
                </div>
              )}
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">أو</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialAuth('google')}
                disabled={isLoading}
                className="h-11"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialAuth('microsoft')}
                disabled={isLoading}
                className="h-11"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                </svg>
                Microsoft
              </Button>
            </div>

            <SecurityBadges />
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <p>
              بالمتابعة، أنت توافق على{" "}
              <Button variant="link" className="p-0 h-auto font-normal text-primary">
                شروط الاستخدام
              </Button>{" "}
              و{" "}
              <Button variant="link" className="p-0 h-auto font-normal text-primary">
                سياسة الخصوصية
              </Button>
            </p>
            
            <div className="flex items-center justify-center gap-1 text-xs">
              <AlertCircle className="h-3 w-3" />
              <span>هذه المنصة محمية ومخصصة للاستخدام الحكومي</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};