import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useAppTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserManagementSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function UserManagementSettings({ settings, onSettingChange }: UserManagementSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newUserRole, setNewUserRole] = useState("");
  
  const userRoles = settings.user_roles || ["innovator", "evaluator", "admin", "team_member", "viewer"];

  const addUserRole = () => {
    if (newUserRole.trim() && !userRoles.includes(newUserRole)) {
      const updatedRoles = [...userRoles, newUserRole.trim()];
      onSettingChange('user_roles', updatedRoles);
      setNewUserRole("");
      toast({
        title: t('success'),
        description: "تم إضافة دور المستخدم بنجاح"
      });
    }
  };

  const removeUserRole = (roleToRemove: string) => {
    const updatedRoles = userRoles.filter((role: string) => role !== roleToRemove);
    onSettingChange('user_roles', updatedRoles);
    toast({
      title: t('success'),
      description: "تم حذف دور المستخدم بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.userRoles')}</CardTitle>
          <CardDescription>إدارة أدوار المستخدمين المتاحة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              placeholder="أضف دور مستخدم جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addUserRole} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {userRoles.map((role: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`userRoles.${role}`) || role}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeUserRole(role)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>إعدادات إدارة المستخدمين</CardTitle>
          <CardDescription>التحكم في إدارة المستخدمين والصلاحيات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxUsers">الحد الأقصى للمستخدمين</Label>
              <Input
                id="maxUsers"
                type="number"
                value={settings.maxUsers || 1000}
                onChange={(e) => onSettingChange('maxUsers', parseInt(e.target.value))}
                min="1"
                max="100000"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userInactivityDays">أيام عدم النشاط قبل التعطيل</Label>
              <Input
                id="userInactivityDays"
                type="number"
                value={settings.userInactivityDays || 90}
                onChange={(e) => onSettingChange('userInactivityDays', parseInt(e.target.value))}
                min="7"
                max="365"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordValidityDays">صلاحية كلمة المرور (بالأيام)</Label>
              <Input
                id="passwordValidityDays"
                type="number"
                value={settings.passwordValidityDays || 90}
                onChange={(e) => onSettingChange('passwordValidityDays', parseInt(e.target.value))}
                min="30"
                max="365"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxConcurrentSessions">الحد الأقصى للجلسات المتزامنة</Label>
              <Input
                id="maxConcurrentSessions"
                type="number"
                value={settings.maxConcurrentSessions || 3}
                onChange={(e) => onSettingChange('maxConcurrentSessions', parseInt(e.target.value))}
                min="1"
                max="10"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التسجيل المفتوح</Label>
              <p className="text-sm text-muted-foreground">السماح للمستخدمين الجدد بالتسجيل بدون دعوة</p>
            </div>
            <Switch 
              checked={settings.allowPublicRegistration || false}
              onCheckedChange={(checked) => onSettingChange('allowPublicRegistration', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التحقق من البريد الإلكتروني</Label>
              <p className="text-sm text-muted-foreground">مطالبة تأكيد البريد الإلكتروني عند التسجيل</p>
            </div>
            <Switch 
              checked={settings.requireEmailVerification !== false}
              onCheckedChange={(checked) => onSettingChange('requireEmailVerification', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">المصادقة الثنائية</Label>
              <p className="text-sm text-muted-foreground">تفعيل المصادقة الثنائية للمستخدمين</p>
            </div>
            <Switch 
              checked={settings.enableTwoFactorAuth || false}
              onCheckedChange={(checked) => onSettingChange('enableTwoFactorAuth', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تتبع نشاط المستخدمين</Label>
              <p className="text-sm text-muted-foreground">تسجيل وتتبع نشاط المستخدمين</p>
            </div>
            <Switch 
              checked={settings.enableUserActivityTracking !== false}
              onCheckedChange={(checked) => onSettingChange('enableUserActivityTracking', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}