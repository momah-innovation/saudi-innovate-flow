import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SimpleListEditor, RoleEditor } from "@/components/admin/ListEditors";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SystemSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    systemName: "نظام إدارة الابتكار",
    systemDescription: "منصة شاملة لإدارة التحديات والأفكار الابتكارية",
    maintenanceMode: false,
    allowPublicRegistration: true,
    maxFileUploadSize: 10,
    sessionTimeout: 60,
    emailNotifications: true,
    systemLanguage: "ar"
  });

  const [systemLists, setSystemLists] = useState({
    themes: [] as string[],
    sectors: [] as string[],
    challengeTypes: [] as string[],
    ideaCategories: [] as string[],
    evaluationCriteria: [] as string[],
    roles: [] as string[]
  });

  useEffect(() => {
    fetchSettings();
    fetchSystemLists();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const fetchSystemLists = async () => {
    try {
      // Fetch sectors
      const { data: sectorsData } = await supabase
        .from('sectors')
        .select('name_ar')
        .order('name_ar');

      setSystemLists({
        themes: ['التكنولوجيا المالية', 'الصحة', 'التعليم', 'البيئة'],
        sectors: sectorsData?.map(s => s.name_ar) || [],
        challengeTypes: ['تحدي تقني', 'تحدي إبداعي', 'تحدي تشغيلي', 'تحدي استراتيجي'],
        ideaCategories: ['تطوير منتج', 'تحسين عملية', 'حل مشكلة', 'ابتكار تقني'],
        evaluationCriteria: ['الجدوى التقنية', 'الأثر المتوقع', 'التكلفة', 'سهولة التنفيذ', 'الابتكار'],
        roles: ['مبتكر', 'خبير', 'منسق فريق', 'مدير', 'مدير عام']
      });
    } catch (error) {
      console.error('Error fetching system lists:', error);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleListUpdate = (listName: keyof typeof systemLists, newList: string[]) => {
    setSystemLists(prev => ({
      ...prev,
      [listName]: newList
    }));
  };

  const saveSettings = async () => {
    try {
      // Here you would save settings to your backend
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("فشل في حفظ الإعدادات");
    }
  };

  const resetToDefaults = () => {
    setSettings({
      systemName: "نظام إدارة الابتكار",
      systemDescription: "منصة شاملة لإدارة التحديات والأفكار الابتكارية",
      maintenanceMode: false,
      allowPublicRegistration: true,
      maxFileUploadSize: 10,
      sessionTimeout: 60,
      emailNotifications: true,
      systemLanguage: "ar"
    });
    toast.success("تم إعادة تعيين الإعدادات إلى القيم الافتراضية");
  };

  if (loading) {
    return (
      <AppShell>
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">جاري التحميل...</div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">إعدادات النظام</h1>
            <p className="text-muted-foreground">إدارة إعدادات النظام العامة والقوائم</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              إعادة تعيين
            </Button>
            <Button onClick={saveSettings}>
              <Globe className="h-4 w-4 mr-2" />
              حفظ الإعدادات
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>
                إعدادات النظام الأساسية والمعلومات العامة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">اسم النظام</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => handleSettingChange('systemName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemLanguage">لغة النظام</Label>
                  <select
                    id="systemLanguage"
                    value={settings.systemLanguage}
                    onChange={(e) => handleSettingChange('systemLanguage', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="systemDescription">وصف النظام</Label>
                <Textarea
                  id="systemDescription"
                  value={settings.systemDescription}
                  onChange={(e) => handleSettingChange('systemDescription', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security & Access Settings */}
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأمان والوصول</CardTitle>
              <CardDescription>
                إدارة إعدادات الأمان وصلاحيات الوصول
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">وضع الصيانة</Label>
                  <div className="text-sm text-muted-foreground">
                    تفعيل وضع الصيانة يمنع وصول المستخدمين العاديين
                  </div>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(value) => handleSettingChange('maintenanceMode', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">السماح بالتسجيل العام</Label>
                  <div className="text-sm text-muted-foreground">
                    السماح للمستخدمين الجدد بالتسجيل دون دعوة
                  </div>
                </div>
                <Switch
                  checked={settings.allowPublicRegistration}
                  onCheckedChange={(value) => handleSettingChange('allowPublicRegistration', value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileUploadSize">الحد الأقصى لحجم الملف (MB)</Label>
                  <Input
                    id="maxFileUploadSize"
                    type="number"
                    value={settings.maxFileUploadSize}
                    onChange={(e) => handleSettingChange('maxFileUploadSize', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">انتهاء الجلسة (دقيقة)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Lists Management */}
          <Card>
            <CardHeader>
              <CardTitle>إدارة قوائم النظام</CardTitle>
              <CardDescription>
                إدارة القوائم المختلفة المستخدمة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">المواضيع</h4>
                  <p className="text-sm text-muted-foreground">إدارة قائمة المواضيع المتاحة</p>
                  <div className="space-y-2">
                    {systemLists.themes.map((theme, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 p-2 bg-muted rounded">{theme}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">القطاعات</h4>
                  <p className="text-sm text-muted-foreground">إدارة قائمة القطاعات المتاحة</p>
                  <div className="space-y-2">
                    {systemLists.sectors.map((sector, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 p-2 bg-muted rounded">{sector}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">أنواع التحديات</h4>
                  <p className="text-sm text-muted-foreground">إدارة قائمة أنواع التحديات</p>
                  <div className="space-y-2">
                    {systemLists.challengeTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 p-2 bg-muted rounded">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>
                إدارة إعدادات الإشعارات والتنبيهات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">إشعارات البريد الإلكتروني</Label>
                  <div className="text-sm text-muted-foreground">
                    تفعيل إرسال الإشعارات عبر البريد الإلكتروني
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default SystemSettings;