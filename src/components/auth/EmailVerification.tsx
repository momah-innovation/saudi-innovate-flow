import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const EmailVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    // Handle email confirmation from URL
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'signup') {
      verifyEmail(token);
    }
  }, [searchParams]);

  useEffect(() => {
    // Start resend timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const verifyEmail = async (token: string) => {
    setIsVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) {
        toast({
          title: "خطأ في التحقق",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsVerified(true);
      toast({
        title: "تم التحقق بنجاح",
        description: "تم تأكيد بريدك الإلكتروني بنجاح",
      });

      // Redirect to dashboard after successful verification
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      toast({
        title: "خطأ في التحقق",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return;

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      });

      if (error) {
        toast({
          title: "خطأ في الإرسال",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم الإرسال",
        description: "تم إرسال رسالة التحقق مرة أخرى",
      });

      setCanResend(false);
      setResendTimer(60);
    } catch (error: any) {
      toast({
        title: "خطأ في الإرسال",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">تم التحقق بنجاح</CardTitle>
            <CardDescription>
              تم تأكيد بريدك الإلكتروني بنجاح. جاري تحويلك إلى لوحة التحكم...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              الانتقال إلى لوحة التحكم
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto">
            {isVerifying ? (
              <RefreshCw className="h-8 w-8 text-primary-foreground animate-spin" />
            ) : (
              <Mail className="h-8 w-8 text-primary-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isVerifying ? "جاري التحقق..." : "تحقق من بريدك الإلكتروني"}
          </CardTitle>
          <CardDescription>
            {isVerifying 
              ? "جاري التحقق من بريدك الإلكتروني..."
              : "لقد أرسلنا رسالة تحقق إلى بريدك الإلكتروني"
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!isVerifying && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  يرجى فحص بريدك الإلكتروني والضغط على رابط التحقق لتأكيد حسابك. قد تحتاج لفحص مجلد الرسائل غير المرغوب فيها.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Button 
                  onClick={resendVerificationEmail}
                  disabled={!canResend}
                  variant="outline"
                  className="w-full"
                >
                  {canResend ? (
                    "إرسال رسالة التحقق مرة أخرى"
                  ) : (
                    `إعادة الإرسال خلال ${resendTimer} ثانية`
                  )}
                </Button>

                <Button 
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  className="w-full"
                >
                  العودة لتسجيل الدخول
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};