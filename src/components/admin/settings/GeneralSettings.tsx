import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneralSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function GeneralSettings({ settings, onSettingChange }: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>معلومات النظام الأساسية</CardTitle>
          <CardDescription>الإعدادات الأساسية للمنصة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systemName">اسم النظام</Label>
              <Input
                id="systemName"
                value={settings.systemName || ''}
                onChange={(e) => onSettingChange('systemName', e.target.value)}
                placeholder="نظام إدارة الابتكار"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemLanguage">لغة النظام الافتراضية</Label>
              <Select 
                value={settings.systemLanguage || 'ar'} 
                onValueChange={(value) => onSettingChange('systemLanguage', value)}
              >
                <SelectTrigger>
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
            <Label htmlFor="systemDescription">وصف النظام</Label>
            <Textarea
              id="systemDescription"
              value={settings.systemDescription || ''}
              onChange={(e) => onSettingChange('systemDescription', e.target.value)}
              placeholder="منصة شاملة لإدارة التحديات والأفكار الابتكارية"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات عامة</CardTitle>
          <CardDescription>إعدادات تؤثر على سلوك النظام العام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">وضع الصيانة</Label>
              <p className="text-sm text-muted-foreground">منع وصول المستخدمين العاديين للنظام</p>
            </div>
            <Switch
              checked={settings.maintenanceMode || false}
              onCheckedChange={(checked) => onSettingChange('maintenanceMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">السماح بالتسجيل العام</Label>
              <p className="text-sm text-muted-foreground">السماح للمستخدمين الجدد بالتسجيل بدون دعوة</p>
            </div>
            <Switch
              checked={settings.allowPublicRegistration !== false}
              onCheckedChange={(checked) => onSettingChange('allowPublicRegistration', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileUploadSize">الحد الأقصى لحجم الملف (MB)</Label>
              <Input
                id="maxFileUploadSize"
                type="number"
                min="1"
                max="100"
                value={settings.maxFileUploadSize || 10}
                onChange={(e) => onSettingChange('maxFileUploadSize', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="autoArchiveAfterDays">الأرشفة التلقائية بعد (أيام)</Label>
              <Input
                id="autoArchiveAfterDays"
                type="number"
                min="30"
                max="3650"
                value={settings.autoArchiveAfterDays || 365}
                onChange={(e) => onSettingChange('autoArchiveAfterDays', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}