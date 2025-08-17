import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Shield, Bell, Globe, Database, Plus } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingItem {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_category: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  is_public: boolean;
  description?: string;
  updated_at: string;
}

export function SettingsManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('general');
  
  // ✅ MIGRATED: Using existing centralized hooks
  const {
    settings,
    isLoading,
    getSettingValue,
    updateSetting
  } = useSettingsManager();
  
  const loadingManager = useUnifiedLoading({
    component: 'SettingsManagement',
    showToast: true,
    logErrors: true
  });

  // Mock additional settings for display
  const mockSettings: SettingItem[] = [
    {
      id: '1',
      setting_key: 'app_name',
      setting_value: 'Innovation Center',
      setting_category: 'general',
      setting_type: 'string',
      is_public: true,
      description: 'Application display name',
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      setting_key: 'maintenance_mode',
      setting_value: 'false',
      setting_category: 'system',
      setting_type: 'boolean',
      is_public: false,
      description: 'Enable maintenance mode',
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      setting_key: 'max_upload_size',
      setting_value: '10485760',
      setting_category: 'system',
      setting_type: 'number',
      is_public: false,
      description: 'Maximum file upload size in bytes',
      updated_at: new Date().toISOString()
    }
  ];

  const settingColumns: Column<SettingItem>[] = [
    {
      key: 'setting_key',
      title: t('settings.key'),
    },
    {
      key: 'setting_value',
      title: t('settings.value'),
      render: (value: string, item: SettingItem) => {
        if (item.setting_type === 'boolean') {
          return (
            <Switch 
              checked={value === 'true'} 
              onCheckedChange={(checked) => {
                // Mock update for now
                console.log('Setting update:', item.setting_key, checked.toString());
              }}
            />
          );
        }
        if (value.length > 50) {
          return value.substring(0, 50) + '...';
        }
        return value;
      },
    },
    {
      key: 'setting_category',
      title: t('settings.category'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'setting_type',
      title: t('settings.type'),
      render: (value: string) => (
        <Badge variant="secondary">
          {value}
        </Badge>
      ),
    },
    {
      key: 'is_public',
      title: t('settings.visibility'),
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'destructive'}>
          {value ? t('settings.public') : t('settings.private')}
        </Badge>
      ),
    },
  ];

  const GeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.application_settings')}</CardTitle>
          <CardDescription>{t('settings.application_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">{t('settings.app_name')}</Label>
              <Input 
                id="app-name" 
                defaultValue={getSettingValue('app_name', 'Innovation Center')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-description">{t('settings.app_description')}</Label>
              <Input 
                id="app-description" 
                defaultValue={getSettingValue('app_description', 'Innovation Management Platform')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-language">{t('settings.default_language')}</Label>
              <Input 
                id="default-language" 
                defaultValue={getSettingValue('default_language', 'ar')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">{t('settings.timezone')}</Label>
              <Input 
                id="timezone" 
                defaultValue={getSettingValue('timezone', 'Asia/Riyadh')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.user_defaults')}</CardTitle>
          <CardDescription>{t('settings.user_defaults_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.auto_approve_users')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.auto_approve_description')}</p>
            </div>
            <Switch defaultChecked={getSettingValue('auto_approve_users', 'false') === 'true'} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.email_notifications')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.email_notifications_description')}</p>
            </div>
            <Switch defaultChecked={getSettingValue('email_notifications', 'true') === 'true'} />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SystemSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {t('settings.system_configuration')}
          </CardTitle>
          <CardDescription>{t('settings.system_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.maintenance_mode')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.maintenance_description')}</p>
            </div>
            <Switch defaultChecked={getSettingValue('maintenance_mode', 'false') === 'true'} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-upload">{t('settings.max_upload_size')}</Label>
              <Input 
                id="max-upload" 
                type="number"
                defaultValue={getSettingValue('max_upload_size', '10485760')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout">{t('settings.session_timeout')}</Label>
              <Input 
                id="session-timeout" 
                type="number"
                defaultValue={getSettingValue('session_timeout', '3600')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t('settings.security_settings')}
          </CardTitle>
          <CardDescription>{t('settings.security_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.two_factor_required')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.two_factor_description')}</p>
            </div>
            <Switch defaultChecked={getSettingValue('require_2fa', 'false') === 'true'} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.password_complexity')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.password_complexity_description')}</p>
            </div>
            <Switch defaultChecked={getSettingValue('strong_passwords', 'true') === 'true'} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="login-attempts">{t('settings.max_login_attempts')}</Label>
              <Input 
                id="login-attempts" 
                type="number"
                defaultValue={getSettingValue('max_login_attempts', '5')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lockout-duration">{t('settings.lockout_duration')}</Label>
              <Input 
                id="lockout-duration" 
                type="number"
                defaultValue={getSettingValue('lockout_duration', '900')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AllSettingsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('settings.all_settings')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('settings.add_setting')}
        </Button>
      </div>
      
      <DataTable
        columns={settingColumns}
        data={mockSettings}
        loading={isLoading}
        searchable={true}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('settings_management.title')}
        description={t('settings_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              {t('settings_management.general_tab')}
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              {t('settings_management.system_tab')}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {t('settings_management.security_tab')}
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t('settings_management.all_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="all">
            <AllSettingsTab />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}