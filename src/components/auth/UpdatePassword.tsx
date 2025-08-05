import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRTLAware } from '@/hooks/useRTLAware';

export const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ps, pe } = useRTLAware();

  useEffect(() => {
    // Check if we have access token from email link
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      // Set the session with the tokens from URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    if (!password || !confirmPassword) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "خطأ في التحقق",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 8) {
      toast({
        title: "خطأ في التحقق",
        description: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast({
          title: "خطأ في تحديث كلمة المرور",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsUpdated(true);
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث كلمة المرور بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في النظام",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUpdated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">تم التحديث بنجاح</CardTitle>
            <CardDescription>
              تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-primary hover:opacity-90 text-white"
            >
              تسجيل الدخول الآن
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">تحديث كلمة المرور</CardTitle>
          <CardDescription>
            أدخل كلمة المرور الجديدة أدناه
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="8 أحرف على الأقل"
                   className={`${ps('10')} ${pe('10')}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="أعد إدخال كلمة المرور"
                  className={`${ps('10')} ${pe('10')}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-primary hover:opacity-90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};