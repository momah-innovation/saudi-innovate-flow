import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { GeneralSettingsProps } from "@/types/admin-settings";

export function GeneralSettings({ settings, onSettingChange }: GeneralSettingsProps) {
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  
  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{isRTL ? 'معلومات النظام الأساسية' : 'Basic System Information'}</CardTitle>
          <CardDescription>{isRTL ? 'الإعدادات الأساسية للمنصة' : 'Basic platform settings'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="system_name">{t('admin.settings.system_name')}</Label>
              <Input
                id="system_name"
                value={settings.system_name || ''}
                onChange={(e) => onSettingChange('system_name', e.target.value)}
                placeholder={t('system.name')}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="system_language">{isRTL ? 'لغة النظام الافتراضية' : 'Default System Language'}</Label>
              <Select 
                value={settings.system_language || 'ar'} 
                onValueChange={(value) => onSettingChange('system_language', value)}
              >
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="system_description">{t('admin.settings.system_description')}</Label>
            <Textarea
              id="system_description"
              value={settings.system_description || ''}
              onChange={(e) => onSettingChange('system_description', e.target.value)}
              placeholder={t('system.description')}
              rows={3}
              className="rtl:text-right ltr:text-left"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات عامة</CardTitle>
          <CardDescription>إعدادات تؤثر على سلوك النظام العام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">{t('admin.settings.maintenance_mode')}</Label>
              <p className="text-sm text-muted-foreground">{isRTL ? 'منع وصول المستخدمين العاديين للنظام' : 'Prevent normal user access to system'}</p>
            </div>
            <Switch
              checked={settings.maintenance_mode || false}
              onCheckedChange={(checked) => onSettingChange('maintenance_mode', checked)}
            />
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">{isRTL ? 'السماح بالتسجيل العام' : 'Allow Public Registration'}</Label>
              <p className="text-sm text-muted-foreground">{isRTL ? 'السماح للمستخدمين الجدد بالتسجيل بدون دعوة' : 'Allow new users to register without invitation'}</p>
            </div>
            <Switch
              checked={settings.allow_public_registration !== false}
              onCheckedChange={(checked) => onSettingChange('allow_public_registration', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="max_file_upload_size">{isRTL ? 'الحد الأقصى لحجم الملف (MB)' : 'Max File Upload Size (MB)'}</Label>
              <Input
                id="max_file_upload_size"
                type="number"
                min="1"
                max="100"
                value={settings.max_file_upload_size || 10}
                onChange={(e) => onSettingChange('max_file_upload_size', parseInt(e.target.value))}
                className="rtl:text-right ltr:text-left"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auto_archive_after_days">{isRTL ? 'الأرشفة التلقائية بعد (أيام)' : 'Auto Archive After (days)'}</Label>
              <Input
                id="auto_archive_after_days"
                type="number"
                min="30"
                max="3650"
                value={settings.auto_archive_after_days || 365}
                onChange={(e) => onSettingChange('auto_archive_after_days', parseInt(e.target.value))}
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}