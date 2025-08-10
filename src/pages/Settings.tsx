import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Shield, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RoleRequestWizard } from "@/components/admin/RoleRequestWizard";

import { ThemeCustomizer } from "@/components/ui/theme-customizer";
import { useNavigate } from "react-router-dom";
import { logger } from '@/utils/logger';

interface UserRole {
  id: string;
  role: string;
  is_active: boolean;
  expires_at: string | null;
}

const Settings = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserRoles();
    }
  }, [user]);

  const fetchUserRoles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      logger.error('Error fetching user roles', { userId: userProfile?.id }, error as Error);
    }
  };

  const handleNotificationChange = async (type: 'email' | 'push', value: boolean) => {
    try {
      // This would typically update user preferences in the database
      if (type === 'email') {
        setEmailNotifications(value);
      } else {
        setPushNotifications(value);
      }
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث إعدادات الإشعارات بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث إعدادات الإشعارات",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة إعدادات حسابك وتفضيلاتك</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                إعدادات الملف الشخصي
              </CardTitle>
              <CardDescription>
                إدارة معلومات ملفك الشخصي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">الاسم</Label>
                  <p className="text-sm text-muted-foreground">
                    {userProfile?.name_ar || user?.user_metadata?.name || "غير محدد"}
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/profile')}>
                  تعديل الملف الشخصي
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>
                إدارة تفضيلات الإشعارات الخاصة بك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">إشعارات البريد الإلكتروني</Label>
                  <div className="text-sm text-muted-foreground">
                    تلقي إشعارات عبر البريد الإلكتروني
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(value) => handleNotificationChange('email', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">الإشعارات الفورية</Label>
                  <div className="text-sm text-muted-foreground">
                    تلقي إشعارات فورية في المتصفح
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={(value) => handleNotificationChange('push', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Role Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                إدارة الأدوار
              </CardTitle>
              <CardDescription>
                عرض وطلب أدوار جديدة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base">الأدوار الحالية</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {userRoles.length > 0 ? (
                    userRoles.map((role) => (
                      <span
                        key={role.id}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                      >
                        {role.role}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      لم يتم تعيين أدوار بعد
                    </span>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowRoleDialog(true)}
              >
                طلب دور جديد
              </Button>
            </CardContent>
          </Card>

          {/* Theme Customizer */}
          <Card>
            <CardHeader>
              <CardTitle>تخصيص المظهر</CardTitle>
              <CardDescription>
                تخصيص ألوان ومظهر النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeCustomizer />
            </CardContent>
          </Card>
        </div>

        <RoleRequestWizard 
          open={showRoleDialog}
          onOpenChange={setShowRoleDialog}
          currentRoles={userRoles.map(role => role.role)}
        />
      </div>
  );
};

export default Settings;