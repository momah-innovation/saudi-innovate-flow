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
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { Eye, EyeOff, Mail, Lock, User, Shield, Building2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { navigationHandler } from '@/utils/unified-navigation';

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
  
  // Initialize unified loading and error handling
  const loadingManager = useUnifiedLoading({ 
    component: 'Auth',
    showToast: true,
    logErrors: true 
  });
  const errorHandler = createErrorHandler({ component: 'Auth' });
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);
  const { t } = useUnifiedTranslation();

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      toast({
        title: t('auth.validation_error'),
        description: t('auth.all_fields_required'),
        variant: "destructive",
      });
      return false;
    }

    if (activeTab === 'signup') {
      if (!formData.fullName) {
        toast({
          title: t('auth.validation_error'),
          description: t('auth.full_name_required'),
          variant: "destructive",
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: t('auth.validation_error'), 
          description: t('auth.passwords_dont_match'),
          variant: "destructive",
        });
        return false;
      }

      if (formData.password.length < 8) {
        toast({
          title: t('auth.validation_error'),
          description: t('auth.password_min_length'),
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

    const operation = async () => {
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
    };

    await loadingManager.withLoading(
      'auth_submit',
      operation,
      {
        errorMessage: t('auth.operation_error'),
        logContext: { 
          action: activeTab,
          email: formData.email 
        }
      }
    );
  };

  const SecurityBadges = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      <Badge variant="secondary" className="flex items-center gap-1 badge-success">
        <Shield className="h-3 w-3" />
        {t('auth.advanced_protection')}
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1 badge-info">
        <CheckCircle2 className="h-3 w-3" />
        {t('auth.comprehensive_encryption')}
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1 badge-partner">
        <Building2 className="h-3 w-3" />
        {t('auth.government_certified')}
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
          onClick={() => navigationHandler.navigateTo('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('auth.back_to_home')}
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {t('layout.platformName')}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('auth.platform_name')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('auth.platform_subtitle')}
          </p>
        </div>

        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-1">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <div className="text-center">
                  <CardTitle className="text-2xl">{t('auth.welcome_back')}</CardTitle>
                  <CardDescription>{t('auth.enter_credentials')}</CardDescription>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="text-center">
                  <CardTitle className="text-2xl">{t('auth.join_platform')}</CardTitle>
                  <CardDescription>{t('auth.start_innovation_journey')}</CardDescription>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('auth.full_name')} *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={t('auth.enter_full_name')}
                      className="pl-10"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')} *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.enter_email')}
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')} *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={activeTab === 'signup' ? t('auth.at_least_8_chars') : t('auth.enter_password')}
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
                    <Label htmlFor="confirmPassword">{t('auth.confirm_password')} *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t('auth.confirm_password_again')}
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
                    <Label htmlFor="organization">{t('auth.organization')}</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="organization"
                        type="text"
                        placeholder={t('auth.ministry_or_agency')}
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
                className="w-full h-11 gradient-primary hover:opacity-90 text-primary-foreground"
                disabled={loadingManager.isLoading('auth_submit')}
              >
                {loadingManager.isLoading('auth_submit') ? t('auth.loading') : activeTab === 'login' ? t('auth.login') : t('auth.create_account_button')}
              </Button>

              {activeTab === 'login' && (
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-sm text-muted-foreground hover-primary"
                    onClick={() => navigationHandler.navigateTo('/auth/forgot-password')}
                  >
                    {t('auth.forgot_password')}
                  </Button>
                </div>
              )}
            </form>

            <SecurityBadges />
          </CardContent>

          <div className="px-6 pb-6">
            <div className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
              <p>
                {t('auth.by_continuing')}{" "}
                <Button variant="link" className="p-0 h-auto font-normal text-primary hover-primary">
                  {t('auth.terms_of_service')}
                </Button>{" "}
                {t('auth.and')}{" "}
                <Button variant="link" className="p-0 h-auto font-normal text-primary hover-primary">
                  {t('auth.privacy_policy')}
                </Button>
              </p>
              
              <div className="flex items-center justify-center gap-1 text-xs">
                <AlertCircle className="h-3 w-3" />
                <span>{t('auth.protected_platform')}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};