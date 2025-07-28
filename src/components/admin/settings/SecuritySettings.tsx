import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface SecuritySettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function SecuritySettings({ settings, onSettingChange }: SecuritySettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات الجلسة والأمان</CardTitle>
          <CardDescription>إدارة إعدادات الجلسات وحماية النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">انتهاء الجلسة (دقيقة)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                max="480"
                value={settings.sessionTimeout || 60}
                onChange={(e) => onSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="rtl:text-right ltr:text-left"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">الحد الأقصى لمحاولات تسجيل الدخول</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min="3"
                max="10"
                value={settings.maxLoginAttempts || 5}
                onChange={(e) => onSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>حماية البيانات</CardTitle>
          <CardDescription>إعدادات تشفير وحماية البيانات الحساسة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
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

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>السياسات الأمنية</CardTitle>
          <CardDescription>إعدادات السياسات والقوانين الأمنية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 rtl:text-right ltr:text-left">
            <Label htmlFor="passwordPolicy">سياسة كلمات المرور</Label>
            <Textarea
              id="passwordPolicy"
              value={settings.passwordPolicy || 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص'}
              onChange={(e) => onSettingChange('passwordPolicy', e.target.value)}
              rows={3}
              placeholder="وصف سياسة كلمات المرور..."
              className="rtl:text-right ltr:text-left"
            />
          </div>

          <div className="space-y-2 rtl:text-right ltr:text-left">
            <Label htmlFor="dataRetentionPolicy">سياسة الاحتفاظ بالبيانات</Label>
            <Textarea
              id="dataRetentionPolicy"
              value={settings.dataRetentionPolicy || 'يتم الاحتفاظ بالبيانات الشخصية لمدة 5 سنوات من آخر نشاط للمستخدم'}
              onChange={(e) => onSettingChange('dataRetentionPolicy', e.target.value)}
              rows={3}
              placeholder="وصف سياسة الاحتفاظ بالبيانات..."
              className="rtl:text-right ltr:text-left"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}