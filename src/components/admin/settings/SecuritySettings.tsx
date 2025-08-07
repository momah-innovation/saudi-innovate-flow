import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { SecuritySettingsProps } from "@/types/admin-settings";

export function SecuritySettings({ settings, onSettingChange }: SecuritySettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newSecurityRole, setNewSecurityRole] = useState("");
  
  const securityRoles = Array.isArray(settings.security_roles) 
    ? settings.security_roles 
    : ["admin", "security_officer", "auditor", "compliance_manager"];

  const addSecurityRole = () => {
    if (newSecurityRole.trim() && !securityRoles.includes(newSecurityRole)) {
      const updatedRoles = [...securityRoles, newSecurityRole.trim()];
      onSettingChange('security_roles', updatedRoles);
      setNewSecurityRole("");
      toast({
        title: t('success'),
        description: "تم إضافة دور الأمان بنجاح"
      });
    }
  };

  const removeSecurityRole = (roleToRemove: string) => {
    const updatedRoles = securityRoles.filter((role: string) => role !== roleToRemove);
    onSettingChange('security_roles', updatedRoles);
    toast({
      title: t('success'),
      description: "تم حذف دور الأمان بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.securityRoles')}</CardTitle>
          <CardDescription>إدارة أدوار الأمان والحماية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newSecurityRole}
              onChange={(e) => setNewSecurityRole(e.target.value)}
              placeholder="أضف دور أمان جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addSecurityRole} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {securityRoles.map((role: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`securityRoles.${role}`) || role}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeSecurityRole(role)}
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
          <CardTitle>إعدادات الجلسة والأمان</CardTitle>
          <CardDescription>إدارة إعدادات الجلسات وحماية النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="session_timeout">{t('settings.session_timeout.label')}</Label>
              <Input
                id="session_timeout"
                type="number"
                min="5"
                max="480"
                value={typeof settings.session_timeout === 'number' ? settings.session_timeout : 60}
                onChange={(e) => onSettingChange('session_timeout', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_login_attempts">{isRTL ? 'الحد الأقصى لمحاولات تسجيل الدخول' : 'Max Login Attempts'}</Label>
              <Input
                id="max_login_attempts"
                type="number"
                min="3"
                max="10"
                value={typeof settings.max_login_attempts === 'number' ? settings.max_login_attempts : 5}
                onChange={(e) => onSettingChange('max_login_attempts', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordExpiryDays">انتهاء صلاحية كلمة المرور (أيام)</Label>
              <Input
                id="passwordExpiryDays"
                type="number"
                min="30"
                max="365"
                value={typeof settings.passwordExpiryDays === 'number' ? settings.passwordExpiryDays : 90}
                onChange={(e) => onSettingChange('passwordExpiryDays', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountLockoutDuration">مدة قفل الحساب (دقيقة)</Label>
              <Input
                id="accountLockoutDuration"
                type="number"
                min="5"
                max="1440"
                value={typeof settings.accountLockoutDuration === 'number' ? settings.accountLockoutDuration : 30}
                onChange={(e) => onSettingChange('accountLockoutDuration', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>حماية البيانات</CardTitle>
          <CardDescription>إعدادات تشفير وحماية البيانات الحساسة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label className="text-base">تفعيل تشفير البيانات</Label>
                <Badge variant="secondary">موصى به</Badge>
              </div>
              <p className="text-sm text-muted-foreground">تشفير البيانات الحساسة في قاعدة البيانات</p>
            </div>
            <Switch
              checked={settings.enableDataEncryption !== false}
              onCheckedChange={(checked) => onSettingChange('enableDataEncryption', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label className="text-base">تفعيل سجلات الوصول</Label>
                <Badge variant="outline">أمان</Badge>
              </div>
              <p className="text-sm text-muted-foreground">تسجيل جميع محاولات الوصول للنظام</p>
            </div>
            <Switch
              checked={settings.enableAccessLogs !== false}
              onCheckedChange={(checked) => onSettingChange('enableAccessLogs', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تفعيل المصادقة الثنائية</Label>
              <p className="text-sm text-muted-foreground">إجبار المصادقة الثنائية لجميع المستخدمين</p>
            </div>
            <Switch
              checked={Boolean(settings.enforceWebauthn)}
              onCheckedChange={(checked) => onSettingChange('enforceWebauthn', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">حماية من CSRF</Label>
              <p className="text-sm text-muted-foreground">تفعيل حماية من هجمات Cross-Site Request Forgery</p>
            </div>
            <Switch
              checked={settings.enableCsrfProtection !== false}
              onCheckedChange={(checked) => onSettingChange('enableCsrfProtection', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>السياسات الأمنية</CardTitle>
          <CardDescription>إعدادات السياسات والقوانين الأمنية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Label htmlFor="passwordPolicy">سياسة كلمات المرور</Label>
            <Textarea
              id="passwordPolicy"
              value={typeof settings.passwordPolicy === 'string' ? settings.passwordPolicy : 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص'}
              onChange={(e) => onSettingChange('passwordPolicy', e.target.value)}
              rows={3}
              placeholder="وصف سياسة كلمات المرور..."
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>

          <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Label htmlFor="dataRetentionPolicy">سياسة الاحتفاظ بالبيانات</Label>
            <Textarea
              id="dataRetentionPolicy"
              value={typeof settings.dataRetentionPolicy === 'string' ? settings.dataRetentionPolicy : 'يتم الاحتفاظ بالبيانات الشخصية لمدة 5 سنوات من آخر نشاط للمستخدم'}
              onChange={(e) => onSettingChange('dataRetentionPolicy', e.target.value)}
              rows={3}
              placeholder="وصف سياسة الاحتفاظ بالبيانات..."
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>

          <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Label htmlFor="accessControlPolicy">سياسة التحكم في الوصول</Label>
            <Textarea
              id="accessControlPolicy"
              value={typeof settings.accessControlPolicy === 'string' ? settings.accessControlPolicy : 'الوصول للنظام محدود حسب الصلاحيات المعطاة لكل مستخدم'}
              onChange={(e) => onSettingChange('accessControlPolicy', e.target.value)}
              rows={3}
              placeholder="وصف سياسة التحكم في الوصول..."
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}