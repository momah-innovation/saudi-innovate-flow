import { useDirection } from '@/components/ui/direction-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AdminNotificationSettings } from './AdminNotificationSettings';

interface NotificationSettingsProps {
  settings: Record<string, unknown>;
  onSettingChange: (key: string, value: unknown) => void;
}

export function NotificationSettings({ settings, onSettingChange }: NotificationSettingsProps) {
  const { direction, isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  // Type-safe getters with defaults
  const getSetting = (key: string, defaultValue: unknown = null) => settings[key] ?? defaultValue;
  const getBooleanSetting = (key: string, defaultValue = false) => Boolean(getSetting(key, defaultValue));
  const getStringSetting = (key: string, defaultValue = '') => String(getSetting(key, defaultValue));
  const getArraySetting = (key: string, defaultValue: string[] = []) => {
    const value = getSetting(key, defaultValue);
    return Array.isArray(value) ? value : defaultValue;
  };

  const notificationTypes = getArraySetting('notification_types', []);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(notificationTypes);

  const handleTypeToggle = (value: string, checked: boolean) => {
    if (checked) {
      const newTypes = [...selectedTypes, value];
      setSelectedTypes(newTypes);
      onSettingChange('notification_types', newTypes);
    } else {
      const newTypes = selectedTypes.filter(type => type !== value);
      setSelectedTypes(newTypes);
      onSettingChange('notification_types', newTypes);
    }
  };

  const availableNotificationTypes = [
    'email', 'sms', 'push', 'in_app', 'slack', 'teams'
  ];

  return (
    <div className={cn("space-y-6", direction)}>
      {/* Admin Notification Management */}
      <AdminNotificationSettings 
        settings={settings}
        onSettingChange={onSettingChange}
      />
      
      {/* Legacy Notification Settings - keeping for backward compatibility */}
      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'أنواع الإشعارات' : 'Notification Types'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableNotificationTypes.map((type) => (
              <div key={type} className="flex items-center justify-between">
                <Label htmlFor={`notification-${type}`} className="capitalize">
                  {type.replace('_', ' ')}
                </Label>
                <Switch
                  id={`notification-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={(checked) => handleTypeToggle(type, checked)}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              {isRTL ? 'الأنواع المفعلة:' : 'Enabled Types:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'الإعدادات العامة' : 'General Settings'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">
              {isRTL ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}
            </Label>
            <Switch
              id="email-notifications"
              checked={getBooleanSetting('enableEmailNotifications')}
              onCheckedChange={(checked) => onSettingChange('enableEmailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">
              {isRTL ? 'إشعارات الرسائل النصية' : 'SMS Notifications'}
            </Label>
            <Switch
              id="sms-notifications"
              checked={getBooleanSetting('enableSmsNotifications')}
              onCheckedChange={(checked) => onSettingChange('enableSmsNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">
              {isRTL ? 'الإشعارات الفورية' : 'Push Notifications'}
            </Label>
            <Switch
              id="push-notifications"
              checked={getBooleanSetting('enablePushNotifications')}
              onCheckedChange={(checked) => onSettingChange('enablePushNotifications', checked)}
            />
          </div>

          <div>
            <Label htmlFor="digest-frequency">
              {isRTL ? 'تكرار ملخص الإشعارات' : 'Digest Frequency'}
            </Label>
            <Select
              value={getStringSetting('digestFrequency', 'daily')}
              onValueChange={(value) => onSettingChange('digestFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'اختر التكرار' : 'Select frequency'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{isRTL ? 'يومياً' : 'Daily'}</SelectItem>
                <SelectItem value="weekly">{isRTL ? 'أسبوعياً' : 'Weekly'}</SelectItem>
                <SelectItem value="monthly">{isRTL ? 'شهرياً' : 'Monthly'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Event-based Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'الإشعارات حسب الأحداث' : 'Event-based Notifications'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-new-idea">
              {isRTL ? 'إشعار عند فكرة جديدة' : 'Notify on New Idea'}
            </Label>
            <Switch
              id="notify-new-idea"
              checked={getBooleanSetting('notifyOnNewIdea')}
              onCheckedChange={(checked) => onSettingChange('notifyOnNewIdea', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notify-new-challenge">
              {isRTL ? 'إشعار عند تحدي جديد' : 'Notify on New Challenge'}
            </Label>
            <Switch
              id="notify-new-challenge"
              checked={getBooleanSetting('notifyOnNewChallenge')}
              onCheckedChange={(checked) => onSettingChange('notifyOnNewChallenge', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notify-event-update">
              {isRTL ? 'إشعار عند تحديث الأحداث' : 'Notify on Event Update'}
            </Label>
            <Switch
              id="notify-event-update"
              checked={getBooleanSetting('notifyOnEventUpdate')}
              onCheckedChange={(checked) => onSettingChange('notifyOnEventUpdate', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}