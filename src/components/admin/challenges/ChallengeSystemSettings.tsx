import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Settings, 
  Shield, 
  Bell, 
  Clock, 
  Users, 
  FileText, 
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  Save
} from "lucide-react";

export function ChallengeSystemSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    defaultStatus: 'draft',
    defaultPriority: 'medium',
    defaultSensitivity: 'normal',
    maxChallengesPerUser: 10,
    autoArchiveAfterDays: 365,
    
    // UI Settings
    defaultViewMode: 'cards',
    itemsPerPage: 12,
    enableAdvancedFilters: true,
    showPreviewOnHover: true,
    
    // Notification Settings
    emailNotifications: true,
    systemNotifications: true,
    notifyOnNewSubmission: true,
    notifyOnStatusChange: true,
    notifyOnDeadline: true,
    
    // Workflow Settings
    requireApprovalForPublish: true,
    allowAnonymousSubmissions: false,
    enableCollaboration: true,
    enableComments: true,
    enableRatings: true,
    
    // Security Settings
    enableDataEncryption: true,
    enableAccessLogs: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    
    // Integration Settings
    enableApiAccess: false,
    enableWebhooks: false,
    webhookUrl: '',
    apiRateLimit: 1000,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    backupLocation: 'cloud'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .like('setting_key', 'challenge_%');

      if (error) throw error;

      // Process settings data
      const processedSettings = data?.reduce((acc, setting) => {
        const key = setting.setting_key.replace('challenge_', '');
        acc[key] = setting.setting_value;
        return acc;
      }, {}) || {};

      setSettings(prev => ({ ...prev, ...processedSettings }));
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الإعدادات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      
      const settingsToUpdate = Object.entries(settings).map(([key, value]) => ({
        setting_key: `challenge_${key}`,
        setting_value: value,
        setting_category: 'challenges',
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('system_settings')
        .upsert(settingsToUpdate, { onConflict: 'setting_key' });

      if (error) throw error;

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات النظام بنجاح",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = async () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
      setSettings({
        defaultStatus: 'draft',
        defaultPriority: 'medium',
        defaultSensitivity: 'normal',
        maxChallengesPerUser: 10,
        autoArchiveAfterDays: 365,
        defaultViewMode: 'cards',
        itemsPerPage: 12,
        enableAdvancedFilters: true,
        showPreviewOnHover: true,
        emailNotifications: true,
        systemNotifications: true,
        notifyOnNewSubmission: true,
        notifyOnStatusChange: true,
        notifyOnDeadline: true,
        requireApprovalForPublish: true,
        allowAnonymousSubmissions: false,
        enableCollaboration: true,
        enableComments: true,
        enableRatings: true,
        enableDataEncryption: true,
        enableAccessLogs: true,
        sessionTimeout: 60,
        maxLoginAttempts: 5,
        enableApiAccess: false,
        enableWebhooks: false,
        webhookUrl: '',
        apiRateLimit: 1000,
        autoBackup: true,
        backupFrequency: 'daily',
        retentionPeriod: 30,
        backupLocation: 'cloud'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إعدادات النظام</h2>
          <p className="text-muted-foreground">إدارة إعدادات منصة التحديات الابتكارية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            إعادة تعيين
          </Button>
          <Button onClick={saveSettings} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            عام
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            سير العمل
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            الأمان
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            التكامل
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            النسخ الاحتياطي
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات الافتراضية</CardTitle>
                <CardDescription>القيم الافتراضية للتحديات الجديدة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultStatus">الحالة الافتراضية</Label>
                  <Select value={settings.defaultStatus} onValueChange={(value) => updateSetting('defaultStatus', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultPriority">الأولوية الافتراضية</Label>
                  <Select value={settings.defaultPriority} onValueChange={(value) => updateSetting('defaultPriority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفض</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">عالي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultSensitivity">مستوى الحساسية الافتراضي</Label>
                  <Select value={settings.defaultSensitivity} onValueChange={(value) => updateSetting('defaultSensitivity', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="sensitive">حساس</SelectItem>
                      <SelectItem value="confidential">سري</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>حدود النظام</CardTitle>
                <CardDescription>القيود والحدود العامة للنظام</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxChallengesPerUser">الحد الأقصى للتحديات لكل مستخدم</Label>
                  <Input
                    id="maxChallengesPerUser"
                    type="number"
                    value={settings.maxChallengesPerUser}
                    onChange={(e) => updateSetting('maxChallengesPerUser', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autoArchiveAfterDays">الأرشفة التلقائية بعد (أيام)</Label>
                  <Input
                    id="autoArchiveAfterDays"
                    type="number"
                    value={settings.autoArchiveAfterDays}
                    onChange={(e) => updateSetting('autoArchiveAfterDays', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemsPerPage">عدد العناصر في الصفحة</Label>
                  <Select value={settings.itemsPerPage.toString()} onValueChange={(value) => updateSetting('itemsPerPage', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات واجهة المستخدم</CardTitle>
                <CardDescription>تخصيص تجربة المستخدم</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultViewMode">وضع العرض الافتراضي</Label>
                  <Select value={settings.defaultViewMode} onValueChange={(value) => updateSetting('defaultViewMode', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cards">بطاقات</SelectItem>
                      <SelectItem value="list">قائمة</SelectItem>
                      <SelectItem value="grid">شبكة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAdvancedFilters">تفعيل المرشحات المتقدمة</Label>
                    <p className="text-sm text-muted-foreground">عرض خيارات تصفية إضافية</p>
                  </div>
                  <Switch
                    id="enableAdvancedFilters"
                    checked={settings.enableAdvancedFilters}
                    onCheckedChange={(checked) => updateSetting('enableAdvancedFilters', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showPreviewOnHover">معاينة عند التمرير</Label>
                    <p className="text-sm text-muted-foreground">عرض معاينة سريعة عند التمرير فوق البطاقات</p>
                  </div>
                  <Switch
                    id="showPreviewOnHover"
                    checked={settings.showPreviewOnHover}
                    onCheckedChange={(checked) => updateSetting('showPreviewOnHover', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الإشعارات</CardTitle>
                <CardDescription>تحكم في أنواع الإشعارات المختلفة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">إشعارات البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemNotifications">إشعارات النظام</Label>
                    <p className="text-sm text-muted-foreground">إشعارات داخل النظام</p>
                  </div>
                  <Switch
                    id="systemNotifications"
                    checked={settings.systemNotifications}
                    onCheckedChange={(checked) => updateSetting('systemNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnNewSubmission">إشعار عند التقديم الجديد</Label>
                    <p className="text-sm text-muted-foreground">إشعار عند تقديم أفكار جديدة</p>
                  </div>
                  <Switch
                    id="notifyOnNewSubmission"
                    checked={settings.notifyOnNewSubmission}
                    onCheckedChange={(checked) => updateSetting('notifyOnNewSubmission', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnStatusChange">إشعار عند تغيير الحالة</Label>
                    <p className="text-sm text-muted-foreground">إشعار عند تغيير حالة التحدي</p>
                  </div>
                  <Switch
                    id="notifyOnStatusChange"
                    checked={settings.notifyOnStatusChange}
                    onCheckedChange={(checked) => updateSetting('notifyOnStatusChange', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnDeadline">تذكير المواعيد النهائية</Label>
                    <p className="text-sm text-muted-foreground">إرسال تذكيرات قبل انتهاء المواعيد</p>
                  </div>
                  <Switch
                    id="notifyOnDeadline"
                    checked={settings.notifyOnDeadline}
                    onCheckedChange={(checked) => updateSetting('notifyOnDeadline', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات سير العمل</CardTitle>
                <CardDescription>تخصيص عمليات النظام وسير العمل</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireApprovalForPublish">اشتراط الموافقة للنشر</Label>
                    <p className="text-sm text-muted-foreground">يتطلب موافقة قبل نشر التحديات</p>
                  </div>
                  <Switch
                    id="requireApprovalForPublish"
                    checked={settings.requireApprovalForPublish}
                    onCheckedChange={(checked) => updateSetting('requireApprovalForPublish', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowAnonymousSubmissions">السماح بالتقديم المجهول</Label>
                    <p className="text-sm text-muted-foreground">السماح للمستخدمين بتقديم أفكار دون تسجيل</p>
                  </div>
                  <Switch
                    id="allowAnonymousSubmissions"
                    checked={settings.allowAnonymousSubmissions}
                    onCheckedChange={(checked) => updateSetting('allowAnonymousSubmissions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableCollaboration">تفعيل التعاون</Label>
                    <p className="text-sm text-muted-foreground">السماح بالتعاون بين المستخدمين</p>
                  </div>
                  <Switch
                    id="enableCollaboration"
                    checked={settings.enableCollaboration}
                    onCheckedChange={(checked) => updateSetting('enableCollaboration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableComments">تفعيل التعليقات</Label>
                    <p className="text-sm text-muted-foreground">السماح بالتعليق على الأفكار والتحديات</p>
                  </div>
                  <Switch
                    id="enableComments"
                    checked={settings.enableComments}
                    onCheckedChange={(checked) => updateSetting('enableComments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableRatings">تفعيل التقييمات</Label>
                    <p className="text-sm text-muted-foreground">السماح بتقييم الأفكار والتحديات</p>
                  </div>
                  <Switch
                    id="enableRatings"
                    checked={settings.enableRatings}
                    onCheckedChange={(checked) => updateSetting('enableRatings', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الأمان</CardTitle>
                <CardDescription>تعزيز أمان النظام والبيانات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableDataEncryption">تشفير البيانات</Label>
                    <p className="text-sm text-muted-foreground">تشفير البيانات الحساسة</p>
                  </div>
                  <Switch
                    id="enableDataEncryption"
                    checked={settings.enableDataEncryption}
                    onCheckedChange={(checked) => updateSetting('enableDataEncryption', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAccessLogs">سجلات الوصول</Label>
                    <p className="text-sm text-muted-foreground">تسجيل جميع عمليات الوصول</p>
                  </div>
                  <Switch
                    id="enableAccessLogs"
                    checked={settings.enableAccessLogs}
                    onCheckedChange={(checked) => updateSetting('enableAccessLogs', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">انتهاء الجلسة (دقيقة)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">الحد الأقصى لمحاولات تسجيل الدخول</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات التكامل</CardTitle>
                <CardDescription>تكامل مع الأنظمة الخارجية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableApiAccess">تفعيل الوصول للAPI</Label>
                    <p className="text-sm text-muted-foreground">السماح بالوصول عبر واجهة برمجة التطبيقات</p>
                  </div>
                  <Switch
                    id="enableApiAccess"
                    checked={settings.enableApiAccess}
                    onCheckedChange={(checked) => updateSetting('enableApiAccess', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableWebhooks">تفعيل Webhooks</Label>
                    <p className="text-sm text-muted-foreground">إرسال إشعارات للأنظمة الخارجية</p>
                  </div>
                  <Switch
                    id="enableWebhooks"
                    checked={settings.enableWebhooks}
                    onCheckedChange={(checked) => updateSetting('enableWebhooks', checked)}
                  />
                </div>

                {settings.enableWebhooks && (
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">رابط Webhook</Label>
                    <Input
                      id="webhookUrl"
                      type="url"
                      value={settings.webhookUrl}
                      onChange={(e) => updateSetting('webhookUrl', e.target.value)}
                      placeholder="https://example.com/webhook"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">حد معدل API (طلبات/ساعة)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) => updateSetting('apiRateLimit', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات النسخ الاحتياطي</CardTitle>
                <CardDescription>إعداد استراتيجية النسخ الاحتياطي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup">النسخ الاحتياطي التلقائي</Label>
                    <p className="text-sm text-muted-foreground">تفعيل النسخ الاحتياطي التلقائي</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">تكرار النسخ الاحتياطي</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => updateSetting('backupFrequency', value)}>
                    <SelectTrigger>
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
                    value={settings.retentionPeriod}
                    onChange={(e) => updateSetting('retentionPeriod', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupLocation">موقع النسخ الاحتياطي</Label>
                  <Select value={settings.backupLocation} onValueChange={(value) => updateSetting('backupLocation', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">محلي</SelectItem>
                      <SelectItem value="cloud">السحابة</SelectItem>
                      <SelectItem value="both">كلاهما</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>حالة النسخ الاحتياطي</CardTitle>
                <CardDescription>معلومات آخر نسخة احتياطية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">آخر نسخة احتياطية: اليوم 3:00 ص</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">حجم النسخة: 2.5 جيجابايت</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">النسخ المتاحة: 30 نسخة</span>
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  إنشاء نسخة احتياطية الآن
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}