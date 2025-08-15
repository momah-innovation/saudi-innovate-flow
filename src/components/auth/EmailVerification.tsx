import React, { useState, useEffect } from 'react';
import { useTimerManager } from '@/utils/timerManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { supabase } from '@/integrations/supabase/client';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const EmailVerification = () => {
  const { setTimeout: scheduleTimeout } = useTimerManager();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
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
      const cleanup = scheduleTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return cleanup;
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
          title: t('auth.verification_error'),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsVerified(true);
      toast({
        title: t('auth.verification_success'),
        description: t('auth.email_verified_success'),
      });

      // Redirect to dashboard after successful verification
      scheduleTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: unknown) {
      toast({
        title: t('auth.verification_error'),
        description: (error as Error).message || t('auth.unexpected_error'),
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
          title: t('auth.sending_error'),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t('auth.email_sent'),
        description: t('auth.verification_resent'),
      });

      setCanResend(false);
      setResendTimer(60);
    } catch (error: unknown) {
      toast({
        title: t('auth.sending_error'),
        description: (error as Error).message || t('auth.unexpected_error'),
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
            <CardTitle className="text-2xl">{t('auth.verification_success')}</CardTitle>
            <CardDescription>
              {t('auth.redirecting_dashboard')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full gradient-primary hover:opacity-90 text-primary-foreground"
            >
              {t('auth.go_to_dashboard')}
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
          <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mx-auto">
            {isVerifying ? (
              <RefreshCw className="h-8 w-8 text-primary-foreground animate-spin" />
            ) : (
              <Mail className="h-8 w-8 text-primary-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isVerifying ? t('auth.verifying') : t('auth.verify_email_title')}
          </CardTitle>
          <CardDescription>
            {isVerifying 
              ? t('auth.verifying_email')
              : t('auth.verification_sent')
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!isVerifying && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t('auth.check_email_instruction')}
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
                    t('auth.resend_verification')
                  ) : (
                    t('auth.resend_in_seconds', { seconds: resendTimer })
                  )}
                </Button>

                <Button 
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  className="w-full"
                >
                  {t('auth.back_to_login')}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};