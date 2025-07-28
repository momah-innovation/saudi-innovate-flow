import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NotificationSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function NotificationSettings({ settings, onSettingChange }: NotificationSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات الإشعارات العامة</CardTitle>
          <CardDescription>تحكم في أنواع الإشعارات الأساسية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">إشعارات البريد الإلكتروني</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني</p>
            </div>
            <Switch
              checked={settings.emailNotifications !== false}
              onCheckedChange={(checked) => onSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">إشعارات النظام</Label>
              <p className="text-sm text-muted-foreground">إشعارات داخل النظام</p>
            </div>
            <Switch
              checked={settings.systemNotifications !== false}
              onCheckedChange={(checked) => onSettingChange('systemNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">إشعارات الهاتف المحمول</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات push للتطبيق المحمول</p>
            </div>
            <Switch
              checked={settings.mobileNotifications || false}
              onCheckedChange={(checked) => onSettingChange('mobileNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إشعارات التحديات والأفكار</CardTitle>
          <CardDescription>إعدادات الإشعارات الخاصة بالتحديات والأفكار</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">إشعار عند التقديم الجديد</Label>
              <p className="text-sm text-muted-foreground">إشعار عند تقديم أفكار جديدة</p>
            </div>
            <Switch
              checked={settings.notifyOnNewSubmission !== false}
              onCheckedChange={(checked) => onSettingChange('notifyOnNewSubmission', checked)}
            />
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">إشعار عند تغيير الحالة</Label>
              <p className="text-sm text-muted-foreground">إشعار عند تغيير حالة التحدي</p>
            </div>
            <Switch
              checked={settings.notifyOnStatusChange !== false}
              onCheckedChange={(checked) => onSettingChange('notifyOnStatusChange', checked)}
            />
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تذكير المواعيد النهائية</Label>
              <p className="text-sm text-muted-foreground">إرسال تذكيرات قبل انتهاء المواعيد</p>
            </div>
            <Switch
              checked={settings.notifyOnDeadline !== false}
              onCheckedChange={(checked) => onSettingChange('notifyOnDeadline', checked)}
            />
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">إشعار عند التقييم</Label>
              <p className="text-sm text-muted-foreground">إشعار عند تقييم الأفكار من قبل الخبراء</p>
            </div>
            <Switch
              checked={settings.notifyOnEvaluation || false}
              onCheckedChange={(checked) => onSettingChange('notifyOnEvaluation', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات التذكيرات</CardTitle>
          <CardDescription>تخصيص توقيت وتكرار التذكيرات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="reminderDaysBefore">تذكير قبل انتهاء الموعد بـ (أيام)</Label>
              <Input
                id="reminderDaysBefore"
                type="number"
                min="1"
                max="30"
                value={settings.reminderDaysBefore || 7}
                onChange={(e) => onSettingChange('reminderDaysBefore', parseInt(e.target.value))}
                className="rtl:text-right ltr:text-left"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderFrequency">تكرار التذكيرات</Label>
              <Select 
                value={settings.reminderFrequency || 'daily'} 
                onValueChange={(value) => onSettingChange('reminderFrequency', value)}
              >
                <SelectTrigger className="rtl:text-right ltr:text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>قوالب الإشعارات</CardTitle>
          <CardDescription>تخصيص نصوص الإشعارات المرسلة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newSubmissionTemplate">قالب إشعار التقديم الجديد</Label>
            <Textarea
              id="newSubmissionTemplate"
              value={settings.newSubmissionTemplate || 'تم تقديم فكرة جديدة للتحدي: {challengeTitle}'}
              onChange={(e) => onSettingChange('newSubmissionTemplate', e.target.value)}
              rows={3}
              placeholder="نص الإشعار..."
              className="rtl:text-right ltr:text-left"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statusChangeTemplate">قالب إشعار تغيير الحالة</Label>
            <Textarea
              id="statusChangeTemplate"
              value={settings.statusChangeTemplate || 'تم تغيير حالة التحدي {challengeTitle} إلى {newStatus}'}
              onChange={(e) => onSettingChange('statusChangeTemplate', e.target.value)}
              rows={3}
              placeholder="نص الإشعار..."
              className="rtl:text-right ltr:text-left"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}