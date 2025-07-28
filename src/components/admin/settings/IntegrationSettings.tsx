import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface IntegrationSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function IntegrationSettings({ settings, onSettingChange }: IntegrationSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات API</CardTitle>
          <CardDescription>إدارة الوصول إلى واجهة برمجة التطبيقات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
                <Label className="text-base">تفعيل وصول API</Label>
                <Badge variant="secondary">متقدم</Badge>
              </div>
              <p className="text-sm text-muted-foreground">السماح للتطبيقات الخارجية بالوصول عبر API</p>
            </div>
            <Switch
              checked={settings.enableApiAccess || false}
              onCheckedChange={(checked) => onSettingChange('enableApiAccess', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiRateLimit">حد معدل الطلبات (طلب/ساعة)</Label>
            <Input
              id="apiRateLimit"
              type="number"
              min="100"
              max="10000"
              value={settings.apiRateLimit || 1000}
              onChange={(e) => onSettingChange('apiRateLimit', parseInt(e.target.value))}
              disabled={!settings.enableApiAccess}
              className="rtl:text-right ltr:text-left"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedDomains">النطاقات المسموحة (مفصولة بفواصل)</Label>
            <Textarea
              id="allowedDomains"
              value={settings.allowedDomains || ''}
              onChange={(e) => onSettingChange('allowedDomains', e.target.value)}
              placeholder="example.com, api.partner.com"
              rows={2}
              disabled={!settings.enableApiAccess}
              className="rtl:text-right ltr:text-left"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات Webhooks</CardTitle>
          <CardDescription>إرسال إشعارات تلقائية للأنظمة الخارجية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تفعيل Webhooks</Label>
              <p className="text-sm text-muted-foreground">إرسال تحديثات للأنظمة الخارجية</p>
            </div>
            <Switch
              checked={settings.enableWebhooks || false}
              onCheckedChange={(checked) => onSettingChange('enableWebhooks', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookUrl">رابط Webhook</Label>
            <Input
              id="webhookUrl"
              type="url"
              value={settings.webhookUrl || ''}
              onChange={(e) => onSettingChange('webhookUrl', e.target.value)}
              placeholder="https://api.example.com/webhooks"
              disabled={!settings.enableWebhooks}
              className="rtl:text-right ltr:text-left"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookSecret">مفتاح التحقق</Label>
            <Input
              id="webhookSecret"
              type="password"
              value={settings.webhookSecret || ''}
              onChange={(e) => onSettingChange('webhookSecret', e.target.value)}
              placeholder="مفتاح سري للتحقق من صحة الطلبات"
              disabled={!settings.enableWebhooks}
              className="rtl:text-right ltr:text-left"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookEvents">أحداث Webhook</Label>
            <Select 
              value={settings.webhookEvents || 'all'} 
              onValueChange={(value) => onSettingChange('webhookEvents', value)}
              disabled={!settings.enableWebhooks}
            >
              <SelectTrigger className="rtl:text-right ltr:text-left">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأحداث</SelectItem>
                <SelectItem value="challenges">أحداث التحديات فقط</SelectItem>
                <SelectItem value="ideas">أحداث الأفكار فقط</SelectItem>
                <SelectItem value="users">أحداث المستخدمين فقط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>التكامل مع الأنظمة الخارجية</CardTitle>
          <CardDescription>ربط النظام مع منصات أخرى</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تكامل Microsoft Teams</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات لقنوات Teams</p>
            </div>
            <Switch
              checked={settings.enableTeamsIntegration || false}
              onCheckedChange={(checked) => onSettingChange('enableTeamsIntegration', checked)}
            />
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تكامل Slack</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات لقنوات Slack</p>
            </div>
            <Switch
              checked={settings.enableSlackIntegration || false}
              onCheckedChange={(checked) => onSettingChange('enableSlackIntegration', checked)}
            />
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تكامل البريد الإلكتروني</Label>
              <p className="text-sm text-muted-foreground">ربط مع خدمات البريد الخارجية</p>
            </div>
            <Switch
              checked={settings.enableEmailIntegration !== false}
              onCheckedChange={(checked) => onSettingChange('enableEmailIntegration', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>النسخ الاحتياطي والاستعادة</CardTitle>
          <CardDescription>إعدادات النسخ الاحتياطي التلقائي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">النسخ الاحتياطي التلقائي</Label>
              <p className="text-sm text-muted-foreground">إنشاء نسخ احتياطية بشكل دوري</p>
            </div>
            <Switch
              checked={settings.autoBackup !== false}
              onCheckedChange={(checked) => onSettingChange('autoBackup', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">تكرار النسخ الاحتياطي</Label>
              <Select 
                value={settings.backupFrequency || 'daily'} 
                onValueChange={(value) => onSettingChange('backupFrequency', value)}
                disabled={!settings.autoBackup}
              >
                <SelectTrigger className="rtl:text-right ltr:text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">كل ساعة</SelectItem>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retentionPeriod">فترة الاحتفاظ (أيام)</Label>
              <Input
                id="retentionPeriod"
                type="number"
                min="7"
                max="365"
                value={settings.retentionPeriod || 30}
                onChange={(e) => onSettingChange('retentionPeriod', parseInt(e.target.value))}
                disabled={!settings.autoBackup}
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backupLocation">موقع النسخ الاحتياطي</Label>
            <Select 
              value={settings.backupLocation || 'cloud'} 
              onValueChange={(value) => onSettingChange('backupLocation', value)}
              disabled={!settings.autoBackup}
            >
              <SelectTrigger className="rtl:text-right ltr:text-left">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cloud">التخزين السحابي</SelectItem>
                <SelectItem value="local">التخزين المحلي</SelectItem>
                <SelectItem value="external">خادم خارجي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}