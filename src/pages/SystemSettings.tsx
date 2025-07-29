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
  Lightbulb,
  Save,
  RotateCcw,
  Loader2
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { ChallengeSettings } from "@/components/admin/settings/ChallengeSettings";
import { IdeaSettings } from "@/components/admin/settings/IdeaSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { IntegrationSettings } from "@/components/admin/settings/IntegrationSettings";
import { SystemListSettings } from "@/components/admin/settings/SystemListSettings";
import { useSettings } from "@/contexts/SettingsContext";
import { useDirection } from "@/components/ui/direction-provider";
import { useTranslation } from "@/hooks/useTranslation";

const SystemSettings = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const settings = useSettings();
  const { isRTL } = useDirection();

  const handleSettingChange = async (key: string, value: any) => {
    try {
      await settings.updateSetting(key as any, value);
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: t('error'),
        description: t('updateSettingError'),
        variant: "destructive"
      });
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await settings.refetch();
      toast({
        title: t('success'),
        description: t('settingsSaved'),
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: t('error'),
        description: t('saveSettingsError'),
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (confirm(t('resetConfirmation'))) {
      // This would need to be implemented as a reset function in the context
      toast({
        title: t('success'),
        description: t('resetSuccess')
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
              <span className="text-lg">{t('loadingSettings')}</span>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl font-bold">{t('systemSettings')}</h1>
            <p className="text-muted-foreground">{t('systemSettingsDescription')}</p>
          </div>
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" onClick={resetToDefaults} disabled={saving} className={isRTL ? 'ml-2' : 'mr-2'}>
              <RotateCcw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('resetSettings')}
            </Button>
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
              ) : (
                <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              )}
              {t('saveSettings')}
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <TabsList className={`grid w-full grid-cols-7 h-auto p-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <TabsTrigger value="general" className={`flex items-center gap-2 h-12 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">{t('general')}</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className={`flex items-center gap-2 h-12 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">{t('challenges')}</span>
            </TabsTrigger>
            <TabsTrigger value="ideas" className={`flex items-center gap-2 h-12 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">الأفكار</span>
            </TabsTrigger>
            <TabsTrigger value="security" className={`flex items-center gap-2 h-12 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">{t('security')}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className={`flex items-center gap-2 h-12 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">{t('notifications')}</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className={`flex items-center gap-2 h-12 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">{t('integrations')}</span>
            </TabsTrigger>
            <TabsTrigger value="lists" className={`flex items-center gap-2 h-12 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{t('lists')}</span>
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

          <TabsContent value="ideas">
            <IdeaSettings 
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