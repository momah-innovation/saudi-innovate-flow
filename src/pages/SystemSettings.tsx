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
  ClipboardCheck,
  Megaphone,
  HelpCircle,
  Calendar,
  Users,
  BarChart3,
  TrendingUp,
  FileText,
  PieChart,
  Building2,
  UserCheck,
  Save,
  RotateCcw,
  Loader2,
  Bot,
  Palette,
  Zap
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { ChallengeSettings } from "@/components/admin/settings/ChallengeSettings";
import { IdeaSettings } from "@/components/admin/settings/IdeaSettings";
import { EvaluationSettings } from "@/components/admin/settings/EvaluationSettings";
import { CampaignSettings } from "@/components/admin/settings/CampaignSettings";
import { FocusQuestionSettings } from "@/components/admin/settings/FocusQuestionSettings";
import { EventSettings } from "@/components/admin/settings/EventSettings";
import { StakeholderSettings } from "@/components/admin/settings/StakeholderSettings";
import { TeamSettings } from "@/components/admin/settings/TeamSettings";
import { AnalyticsSettings } from "@/components/admin/settings/AnalyticsSettings";
import { PartnerSettings } from "@/components/admin/settings/PartnerSettings";
import { OrganizationalSettings } from "@/components/admin/settings/OrganizationalSettings";
import { UserManagementSettings } from "@/components/admin/settings/UserManagementSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { IntegrationSettings } from "@/components/admin/settings/IntegrationSettings";
import { SystemListSettings } from "@/components/admin/settings/SystemListSettings";
import { SectorManagementSettings } from "@/components/admin/settings/SectorManagementSettings";
import { OpportunitySettings } from "@/components/admin/settings/OpportunitySettings";
import { WorkflowSettings } from "@/components/admin/settings/WorkflowSettings";
import { GlobalListSettings } from "@/components/admin/settings/GlobalListSettings";
import { AISettings } from "@/components/admin/settings/AISettings";
import { UISettings } from "@/components/admin/settings/UISettings";
import { PerformanceSettings } from "@/components/admin/settings/PerformanceSettings";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { useDirection } from "@/components/ui/direction-provider";
import { useTranslation } from "@/hooks/useAppTranslation";

const SystemSettings = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { isRTL } = useDirection();
  
  // Use the new unified settings manager
  const {
    settings,
    updateSetting,
    bulkUpdate,
    isLoading,
    isUpdating,
    isBulkUpdating
  } = useSettingsManager();

  const handleSettingChange = async (key: string, value: any) => {
    // Determine category and data type from the setting key
    const setting = settings.find(s => s.setting_key === key);
    const category = setting?.setting_category || 'general';
    const dataType = setting?.data_type || 'string';
    
    updateSetting({ key, value, category, dataType });
  };

  const saveAllSettings = async () => {
    try {
      setSaving(true);
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
      toast({
        title: t('success'),
        description: t('resetSuccess')
      });
    }
  };

  if (isLoading) {
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
            <Button onClick={saveAllSettings} disabled={saving || isUpdating || isBulkUpdating}>
              {(saving || isUpdating || isBulkUpdating) ? (
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
          <TabsList className={`grid w-full grid-cols-12 lg:grid-cols-23 h-auto p-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <TabsTrigger value="general" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Settings className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{t('general')}</span>
            </TabsTrigger>
            <TabsTrigger value="sectors" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Building2 className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'القطاعات' : 'Sectors'}</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'التحديات' : 'Challenges'}</span>
            </TabsTrigger>
            <TabsTrigger value="ideas" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Lightbulb className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'الأفكار' : 'Ideas'}</span>
            </TabsTrigger>
            <TabsTrigger value="evaluations" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ClipboardCheck className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'التقييمات' : 'Evaluations'}</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Megaphone className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'الحملات' : 'Campaigns'}</span>
            </TabsTrigger>
            <TabsTrigger value="focus-questions" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <HelpCircle className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'الأسئلة المحورية' : 'Focus Questions'}</span>
            </TabsTrigger>
            <TabsTrigger value="events" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'الفعاليات' : 'Events'}</span>
            </TabsTrigger>
            <TabsTrigger value="stakeholders" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'المعنيين' : 'Stakeholders'}</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <UserCheck className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'فرق الابتكار' : 'Innovation Teams'}</span>
            </TabsTrigger>
            <TabsTrigger value="partners" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Building2 className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'الشركاء' : 'Partners'}</span>
            </TabsTrigger>
            <TabsTrigger value="organizational" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'الهيكل التنظيمي' : 'Organizational'}</span>
            </TabsTrigger>
            <TabsTrigger value="user-management" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'إدارة المستخدمين' : 'User Management'}</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <FileText className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'الفرص' : 'Opportunities'}</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <PieChart className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'سير العمل' : 'Workflows'}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <BarChart3 className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'التحليلات' : 'Analytics'}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Shield className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{t('security')}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Bell className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{t('notifications')}</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Database className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{t('integrations')}</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Bot className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'الذكاء الاصطناعي' : 'AI'}</span>
            </TabsTrigger>
            <TabsTrigger value="ui" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Palette className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'واجهة المستخدم' : 'UI'}</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Zap className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'الأداء' : 'Performance'}</span>
            </TabsTrigger>
            <TabsTrigger value="global-lists" className={`flex items-center gap-1 h-12 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <List className="w-3 h-3" />
              <span className="hidden lg:inline text-xs">{isRTL ? 'القوائم العامة' : 'Global Lists'}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="sectors">
            <SectorManagementSettings 
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

          <TabsContent value="evaluations">
            <EvaluationSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="focus-questions">
            <FocusQuestionSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="events">
            <EventSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="stakeholders">
            <StakeholderSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="teams">
            <TeamSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="partners">
            <PartnerSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="organizational">
            <OrganizationalSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="user-management">
            <UserManagementSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="opportunities">
            <OpportunitySettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowSettings 
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

          <TabsContent value="ai">
            <AISettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="ui">
            <UISettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          </TabsContent>

          <TabsContent value="global-lists">
            <GlobalListSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default SystemSettings;