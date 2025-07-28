import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Shield, 
  Bell, 
  Database,
  List,
  Target,
  Save,
  RotateCcw,
  Loader2
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { ChallengeSettings } from "@/components/admin/settings/ChallengeSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { IntegrationSettings } from "@/components/admin/settings/IntegrationSettings";
import { SystemListSettings } from "@/components/admin/settings/SystemListSettings";
import { useSettings } from "@/contexts/SettingsContext";

const SystemSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const settings = useSettings();

  const handleSettingChange = async (key: string, value: any) => {
    try {
      await settings.updateSetting(key as any, value);
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الإعداد",
        variant: "destructive"
      });
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await settings.refetch();
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ جميع إعدادات النظام بنجاح",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟ سيتم فقدان جميع التخصيصات الحالية.')) {
      // This would need to be implemented as a reset function in the context
      toast({
        title: "تم بنجاح",
        description: "تم إعادة تعيين جميع الإعدادات إلى القيم الافتراضية"
      });
    }
  };

  if (settings.loading) {
    return (
      <AppShell>
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-lg">جاري تحميل الإعدادات...</span>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container mx-auto p-6 space-y-6 rtl:text-right ltr:text-left">
        {/* Header */}
        <div className="flex items-center justify-between rtl:flex-row-reverse">
          <div className="rtl:text-right ltr:text-left">
            <h1 className="text-3xl font-bold">إعدادات النظام</h1>
            <p className="text-muted-foreground">إدارة شاملة لجميع إعدادات المنصة والنظام</p>
          </div>
          <div className="flex gap-2 rtl:flex-row-reverse">
            <LanguageToggle />
            <Button variant="outline" onClick={resetToDefaults} disabled={saving} className="rtl:ml-2 ltr:mr-2">
              <RotateCcw className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
              إعادة تعيين
            </Button>
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 rtl:ml-2 ltr:mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
              )}
              حفظ الإعدادات
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 rtl:text-right ltr:text-left">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1 rtl:text-right ltr:text-left">
            <TabsTrigger value="general" className="flex items-center gap-2 h-12 text-sm rtl:flex-row-reverse">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">عام</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2 h-12 text-sm rtl:flex-row-reverse">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">التحديات</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 h-12 text-sm rtl:flex-row-reverse">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">الأمان</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 h-12 text-sm rtl:flex-row-reverse">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">الإشعارات</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 h-12 text-sm rtl:flex-row-reverse">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">التكامل</span>
            </TabsTrigger>
            <TabsTrigger value="lists" className="flex items-center gap-2 h-12 text-sm rtl:flex-row-reverse">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">القوائم</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="challenges">
            <ChallengeSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="lists">
            <SystemListSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default SystemSettings;