import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { ChallengeSettings } from "@/components/admin/settings/ChallengeSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { IntegrationSettings } from "@/components/admin/settings/IntegrationSettings";
import { SystemListSettings } from "@/components/admin/settings/SystemListSettings";

const SystemSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    systemName: "نظام إدارة الابتكار",
    systemDescription: "منصة شاملة لإدارة التحديات والأفكار الابتكارية",
    systemLanguage: "ar",
    maintenanceMode: false,
    allowPublicRegistration: true,
    maxFileUploadSize: 10,
    autoArchiveAfterDays: 365,

    // Challenge Settings
    defaultStatus: 'draft',
    defaultPriority: 'medium',
    defaultSensitivity: 'normal',
    maxChallengesPerUser: 10,
    itemsPerPage: 12,
    defaultViewMode: 'cards',
    enableAdvancedFilters: true,
    showPreviewOnHover: true,
    requireApprovalForPublish: true,
    allowAnonymousSubmissions: false,
    enableCollaboration: true,
    enableComments: true,
    enableRatings: true,

    // Security Settings
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    enableDataEncryption: true,
    enableAccessLogs: true,
    passwordPolicy: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص',
    dataRetentionPolicy: 'يتم الاحتفاظ بالبيانات الشخصية لمدة 5 سنوات من آخر نشاط للمستخدم',

    // Notification Settings
    emailNotifications: true,
    systemNotifications: true,
    mobileNotifications: false,
    notifyOnNewSubmission: true,
    notifyOnStatusChange: true,
    notifyOnDeadline: true,
    notifyOnEvaluation: false,
    reminderDaysBefore: 7,
    reminderFrequency: 'daily',
    newSubmissionTemplate: 'تم تقديم فكرة جديدة للتحدي: {challengeTitle}',
    statusChangeTemplate: 'تم تغيير حالة التحدي {challengeTitle} إلى {newStatus}',

    // Integration Settings
    enableApiAccess: false,
    apiRateLimit: 1000,
    allowedDomains: '',
    enableWebhooks: false,
    webhookUrl: '',
    webhookSecret: '',
    webhookEvents: 'all',
    enableTeamsIntegration: false,
    enableSlackIntegration: false,
    enableEmailIntegration: true,
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    backupLocation: 'cloud',

    // System Lists
    challengeTypes: ['تحدي تقني', 'تحدي إبداعي', 'تحدي تشغيلي', 'تحدي استراتيجي'],
    ideaCategories: ['تطوير منتج', 'تحسين عملية', 'حل مشكلة', 'ابتكار تقني'],
    evaluationCriteria: ['الجدوى التقنية', 'الأثر المتوقع', 'التكلفة', 'سهولة التنفيذ', 'الابتكار'],
    themes: ['التكنولوجيا المالية', 'الصحة', 'التعليم', 'البيئة'],
    roles: ['مبتكر', 'خبير', 'منسق فريق', 'مدير', 'مدير عام'],
    statusOptions: ['مسودة', 'منشور', 'نشط', 'مكتمل', 'ملغي'],
    priorityLevels: ['منخفض', 'متوسط', 'عالي', 'عاجل'],
    sensitivityLevels: ['عادي', 'حساس', 'سري', 'سري للغاية'],
    allowCustomValues: true,
    sortListsAlphabetically: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;

      // Process settings data
      const processedSettings = data?.reduce((acc, setting) => {
        let value = setting.setting_value;
        
        // Handle JSON arrays
        if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // Keep as string if parsing fails
          }
        }
        
        // Convert string booleans
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        
        // Convert string numbers
        if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
          value = Number(value);
        }

        acc[setting.setting_key.replace(/^(challenge_|system_|notification_|security_|integration_)/, '')] = value;
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

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const settingsToUpdate = Object.entries(settings).map(([key, value]) => {
        let category = 'system';
        let prefixedKey = key;
        
        // Categorize settings
        if (['defaultStatus', 'defaultPriority', 'defaultSensitivity', 'maxChallengesPerUser', 'itemsPerPage', 'defaultViewMode', 'enableAdvancedFilters', 'showPreviewOnHover', 'requireApprovalForPublish', 'allowAnonymousSubmissions', 'enableCollaboration', 'enableComments', 'enableRatings'].includes(key)) {
          category = 'challenges';
          prefixedKey = `challenge_${key}`;
        } else if (['emailNotifications', 'systemNotifications', 'mobileNotifications', 'notifyOnNewSubmission', 'notifyOnStatusChange', 'notifyOnDeadline', 'notifyOnEvaluation', 'reminderDaysBefore', 'reminderFrequency', 'newSubmissionTemplate', 'statusChangeTemplate'].includes(key)) {
          category = 'notifications';
          prefixedKey = `notification_${key}`;
        } else if (['sessionTimeout', 'maxLoginAttempts', 'enableDataEncryption', 'enableAccessLogs', 'passwordPolicy', 'dataRetentionPolicy'].includes(key)) {
          category = 'security';
          prefixedKey = `security_${key}`;
        } else if (['enableApiAccess', 'apiRateLimit', 'allowedDomains', 'enableWebhooks', 'webhookUrl', 'webhookSecret', 'webhookEvents', 'enableTeamsIntegration', 'enableSlackIntegration', 'enableEmailIntegration', 'autoBackup', 'backupFrequency', 'retentionPeriod', 'backupLocation'].includes(key)) {
          category = 'integration';
          prefixedKey = `integration_${key}`;
        } else {
          prefixedKey = `system_${key}`;
        }

        return {
          setting_key: prefixedKey,
          setting_value: Array.isArray(value) ? JSON.stringify(value) : value.toString(),
          setting_category: category,
          updated_at: new Date().toISOString()
        };
      });

      const { error } = await supabase
        .from('system_settings')
        .upsert(settingsToUpdate, { onConflict: 'setting_key' });

      if (error) throw error;

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
      setSettings({
        systemName: "نظام إدارة الابتكار",
        systemDescription: "منصة شاملة لإدارة التحديات والأفكار الابتكارية",
        systemLanguage: "ar",
        maintenanceMode: false,
        allowPublicRegistration: true,
        maxFileUploadSize: 10,
        autoArchiveAfterDays: 365,
        defaultStatus: 'draft',
        defaultPriority: 'medium',
        defaultSensitivity: 'normal',
        maxChallengesPerUser: 10,
        itemsPerPage: 12,
        defaultViewMode: 'cards',
        enableAdvancedFilters: true,
        showPreviewOnHover: true,
        requireApprovalForPublish: true,
        allowAnonymousSubmissions: false,
        enableCollaboration: true,
        enableComments: true,
        enableRatings: true,
        sessionTimeout: 60,
        maxLoginAttempts: 5,
        enableDataEncryption: true,
        enableAccessLogs: true,
        passwordPolicy: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص',
        dataRetentionPolicy: 'يتم الاحتفاظ بالبيانات الشخصية لمدة 5 سنوات من آخر نشاط للمستخدم',
        emailNotifications: true,
        systemNotifications: true,
        mobileNotifications: false,
        notifyOnNewSubmission: true,
        notifyOnStatusChange: true,
        notifyOnDeadline: true,
        notifyOnEvaluation: false,
        reminderDaysBefore: 7,
        reminderFrequency: 'daily',
        newSubmissionTemplate: 'تم تقديم فكرة جديدة للتحدي: {challengeTitle}',
        statusChangeTemplate: 'تم تغيير حالة التحدي {challengeTitle} إلى {newStatus}',
        enableApiAccess: false,
        apiRateLimit: 1000,
        allowedDomains: '',
        enableWebhooks: false,
        webhookUrl: '',
        webhookSecret: '',
        webhookEvents: 'all',
        enableTeamsIntegration: false,
        enableSlackIntegration: false,
        enableEmailIntegration: true,
        autoBackup: true,
        backupFrequency: 'daily',
        retentionPeriod: 30,
        backupLocation: 'cloud',
        challengeTypes: ['تحدي تقني', 'تحدي إبداعي', 'تحدي تشغيلي', 'تحدي استراتيجي'],
        ideaCategories: ['تطوير منتج', 'تحسين عملية', 'حل مشكلة', 'ابتكار تقني'],
        evaluationCriteria: ['الجدوى التقنية', 'الأثر المتوقع', 'التكلفة', 'سهولة التنفيذ', 'الابتكار'],
        themes: ['التكنولوجيا المالية', 'الصحة', 'التعليم', 'البيئة'],
        roles: ['مبتكر', 'خبير', 'منسق فريق', 'مدير', 'مدير عام'],
        statusOptions: ['مسودة', 'منشور', 'نشط', 'مكتمل', 'ملغي'],
        priorityLevels: ['منخفض', 'متوسط', 'عالي', 'عاجل'],
        sensitivityLevels: ['عادي', 'حساس', 'سري', 'سري للغاية'],
        allowCustomValues: true,
        sortListsAlphabetically: false
      });

      toast({
        title: "تم بنجاح",
        description: "تم إعادة تعيين جميع الإعدادات إلى القيم الافتراضية"
      });
    }
  };

  if (loading) {
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
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">إعدادات النظام</h1>
            <p className="text-muted-foreground">إدارة شاملة لجميع إعدادات المنصة والنظام</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults} disabled={saving}>
              <RotateCcw className="w-4 h-4 mr-2" />
              إعادة تعيين
            </Button>
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              حفظ الإعدادات
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1">
            <TabsTrigger value="general" className="flex items-center gap-2 h-12 text-sm">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">عام</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2 h-12 text-sm">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">التحديات</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 h-12 text-sm">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">الأمان</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 h-12 text-sm">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">الإشعارات</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 h-12 text-sm">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">التكامل</span>
            </TabsTrigger>
            <TabsTrigger value="lists" className="flex items-center gap-2 h-12 text-sm">
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
