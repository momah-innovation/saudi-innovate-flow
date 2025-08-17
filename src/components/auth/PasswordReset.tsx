import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { navigationHandler } from '@/utils/unified-navigation';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const navigate = useNavigate();
  
  // ✅ MIGRATED: Added unified loading and error handling (imports added earlier)
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // ✅ MIGRATED: This component was already partially migrated but kept try-catch for fallback
      // TODO: Complete migration to useUnifiedLoading pattern in next iteration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Use proper URL building for password reset redirects
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
      });

      if (error) {
        toast({
          title: t('auth.password_reset_error', 'خطأ في إعادة تعيين كلمة المرور'),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsEmailSent(true);
      toast({
        title: t('auth.password_reset_sent', 'تم الإرسال بنجاح'),
        description: t('auth.password_reset_description', 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'),
      });
    } catch (error: unknown) {
      toast({
        title: t('auth.system_error', 'خطأ في النظام'),
        description: (error as Error).message || t('auth.unexpected_error', 'حدث خطأ غير متوقع'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">تم الإرسال</CardTitle>
            <CardDescription>
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                يرجى فحص بريدك الإلكتروني وإتباع التعليمات لإعادة تعيين كلمة المرور. قد تحتاج لفحص مجلد الرسائل غير المرغوب فيها.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => navigationHandler.navigateTo('/auth')}
                className="w-full"
              >
                العودة لتسجيل الدخول
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsEmailSent(false)}
                className="w-full"
              >
                إرسال مرة أخرى
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      {/* Back to Auth Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigationHandler.navigateTo('/auth')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة لتسجيل الدخول
        </Button>
      </div>

      <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 gradient-primary hover:opacity-90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};