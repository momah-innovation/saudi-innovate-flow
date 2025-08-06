import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NotificationSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function NotificationSettings({ settings, onSettingChange }: NotificationSettingsProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [newNotificationType, setNewNotificationType] = useState("");
  
  const notificationTypes = settings.notification_types || ["email", "sms", "push", "in_app", "webhook"];

  const addNotificationType = () => {
    if (newNotificationType.trim() && !notificationTypes.includes(newNotificationType)) {
      const updatedTypes = [...notificationTypes, newNotificationType.trim()];
      onSettingChange('notification_types', updatedTypes);
      setNewNotificationType("");
      toast({
        title: t('success'),
        description: "تم إضافة نوع الإشعار بنجاح"
      });
    }
  };

  const removeNotificationType = (typeToRemove: string) => {
    const updatedTypes = notificationTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('notification_types', updatedTypes);
    toast({
      title: t('success'),
      description: "تم حذف نوع الإشعار بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.notificationTypes')}</CardTitle>
          <CardDescription>إدارة أنواع الإشعارات المتاحة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newNotificationType}
              onChange={(e) => setNewNotificationType(e.target.value)}
              placeholder="أضف نوع إشعار جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addNotificationType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {notificationTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`notificationTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeNotificationType(type)}
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
          <CardTitle>إعدادات الإشعارات العامة</CardTitle>
          <CardDescription>تحكم في أنواع الإشعارات الأساسية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">إشعارات البريد الإلكتروني</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني</p>
            </div>
            <Switch
              checked={settings.emailNotifications !== false}
              onCheckedChange={(checked) => onSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">إشعارات النظام</Label>
              <p className="text-sm text-muted-foreground">إشعارات داخل النظام</p>
            </div>
            <Switch
              checked={settings.systemNotifications !== false}
              onCheckedChange={(checked) => onSettingChange('systemNotifications', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">إشعارات الهاتف المحمول</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات push للتطبيق المحمول</p>
            </div>
            <Switch
              checked={settings.mobileNotifications || false}
              onCheckedChange={(checked) => onSettingChange('mobileNotifications', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">إشعارات الرسائل النصية</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات عبر الرسائل النصية</p>
            </div>
            <Switch
              checked={settings.smsNotifications || false}
              onCheckedChange={(checked) => onSettingChange('smsNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>إشعارات التحديات والأفكار</CardTitle>
          <CardDescription>إعدادات الإشعارات الخاصة بالتحديات والأفكار</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">إشعار عند التقديم الجديد</Label>
              <p className="text-sm text-muted-foreground">إشعار عند تقديم أفكار جديدة</p>
            </div>
            <Switch
              checked={settings.notifyOnNewSubmission !== false}
              onCheckedChange={(checked) => onSettingChange('notifyOnNewSubmission', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">إشعار عند تغيير الحالة</Label>
              <p className="text-sm text-muted-foreground">إشعار عند تغيير حالة التحدي</p>
            </div>
            <Switch
              checked={settings.notifyOnStatusChange !== false}
              onCheckedChange={(checked) => onSettingChange('notifyOnStatusChange', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تذكير المواعيد النهائية</Label>
              <p className="text-sm text-muted-foreground">إرسال تذكيرات قبل انتهاء المواعيد</p>
            </div>
            <Switch
              checked={settings.notifyOnDeadline !== false}
              onCheckedChange={(checked) => onSettingChange('notifyOnDeadline', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
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
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>إعدادات التذكيرات</CardTitle>
          <CardDescription>تخصيص توقيت وتكرار التذكيرات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="reminderDaysBefore">تذكير قبل انتهاء الموعد بـ (أيام)</Label>
              <Input
                id="reminderDaysBefore"
                type="number"
                min="1"
                max="30"
                value={settings.reminderDaysBefore || 7}
                onChange={(e) => onSettingChange('reminderDaysBefore', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderFrequency">تكرار التذكيرات</Label>
              <Select 
                value={settings.reminderFrequency || 'daily'} 
                onValueChange={(value) => onSettingChange('reminderFrequency', value)}
              >
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxNotificationsPerDay">الحد الأقصى للإشعارات يومياً</Label>
              <Input
                id="maxNotificationsPerDay"
                type="number"
                min="1"
                max="100"
                value={settings.maxNotificationsPerDay || 20}
                onChange={(e) => onSettingChange('maxNotificationsPerDay', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notificationRetentionDays">الاحتفاظ بالإشعارات (أيام)</Label>
              <Input
                id="notificationRetentionDays"
                type="number"
                min="7"
                max="365"
                value={settings.notificationRetentionDays || 30}
                onChange={(e) => onSettingChange('notificationRetentionDays', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
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
              className={isRTL ? 'text-right' : 'text-left'}
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
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadlineReminderTemplate">قالب تذكير الموعد النهائي</Label>
            <Textarea
              id="deadlineReminderTemplate"
              value={settings.deadlineReminderTemplate || 'تذكير: ينتهي التحدي {challengeTitle} خلال {daysRemaining} أيام'}
              onChange={(e) => onSettingChange('deadlineReminderTemplate', e.target.value)}
              rows={3}
              placeholder="نص التذكير..."
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}