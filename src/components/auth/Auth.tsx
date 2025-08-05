import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Shield, Building2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  organization?: string;
}

export const Auth = () => {
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
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          // Let the auth state change handle the redirect
          // This will properly check profile completion
        }
      } else {
        await signUp(formData.email, formData.password, {
          name: formData.fullName!
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

  const SecurityBadges = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      <Badge variant="secondary" className="flex items-center gap-1 badge-success">
        <Shield className="h-3 w-3" />
        حماية متقدمة
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1 badge-info">
        <CheckCircle2 className="h-3 w-3" />
        تشفير شامل
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1 badge-partner">
        <Building2 className="h-3 w-3" />
        معتمد حكومياً
      </Badge>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      {/* Back to Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة للرئيسية
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              رواد
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            منصة رواد للابتكار
          </h1>
          <p className="text-muted-foreground mt-2">
            بوابة الابتكار الحكومي في المملكة العربية السعودية
          </p>
        </div>

        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-card/80">
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
                      className="ps-10"
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
                    className="ps-10"
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
                    className="ps-10 pe-10"
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
                        className="ps-10 pe-10"
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
                        className="ps-10"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-primary hover:opacity-90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? "جارٍ التحميل..." : activeTab === 'login' ? "تسجيل الدخول" : "إنشاء الحساب"}
              </Button>

              {activeTab === 'login' && (
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-sm text-muted-foreground hover-primary"
                    onClick={() => navigate('/auth/forgot-password')}
                  >
                    نسيت كلمة المرور؟
                  </Button>
                </div>
              )}
            </form>

            <SecurityBadges />
          </CardContent>

          <div className="px-6 pb-6">
            <div className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
              <p>
                بالمتابعة، أنت توافق على{" "}
                <Button variant="link" className="p-0 h-auto font-normal text-primary hover-primary">
                  شروط الاستخدام
                </Button>{" "}
                و{" "}
                <Button variant="link" className="p-0 h-auto font-normal text-primary hover-primary">
                  سياسة الخصوصية
                </Button>
              </p>
              
              <div className="flex items-center justify-center gap-1 text-xs">
                <AlertCircle className="h-3 w-3" />
                <span>هذه المنصة محمية ومخصصة للاستخدام الحكومي</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};