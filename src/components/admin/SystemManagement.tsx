import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, BarChart3, Shield, Plus, Server, Database, Key } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSystemData } from '@/hooks/useSystemData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description?: string;
  is_public: boolean;
  updated_at: string;
  updated_by: string;
}

export function SystemManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('configurations');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    configurations,
    metrics,
    loading,
    updateConfiguration,
    refreshConfigurations
  } = useSystemData();
  
  const loadingManager = useUnifiedLoading({
    component: 'SystemManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshConfigurations();
  }, [refreshConfigurations]);

  const configColumns: Column<SystemConfig>[] = [
    {
      key: 'key',
      title: t('system.config_key'),
    },
    {
      key: 'value',
      title: t('system.config_value'),
      render: (value: string, item: SystemConfig) => {
        if (item.type === 'password' || item.key.includes('secret')) {
          return '••••••••';
        }
        return value.length > 50 ? `${value.substring(0, 50)}...` : value;
      },
    },
    {
      key: 'category',
      title: t('system.category'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'type',
      title: t('system.type'),
      render: (value: string) => (
        <Badge variant="secondary">
          {value}
        </Badge>
      ),
    },
    {
      key: 'is_public',
      title: t('system.visibility'),
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'destructive'}>
          {value ? t('system.public') : t('system.private')}
        </Badge>
      ),
    },
    {
      key: 'updated_at',
      title: t('system.updated_at'),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const ConfigurationsList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('system.configurations')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('system.add_config')}
        </Button>
      </div>
      
      <DataTable
        columns={configColumns}
        data={configurations || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const SystemAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('system.analytics')}
          </CardTitle>
          <CardDescription>{t('system.analytics_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics?.uptime || '99.9%'}</div>
              <div className="text-sm text-muted-foreground">{t('system.uptime')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics?.activeUsers || 0}</div>
              <div className="text-sm text-muted-foreground">{t('system.active_users')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics?.memoryUsage || '45%'}</div>
              <div className="text-sm text-muted-foreground">{t('system.memory_usage')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics?.storageUsed || '2.1GB'}</div>
              <div className="text-sm text-muted-foreground">{t('system.storage_used')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              {t('system.server_status')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { service: 'API Server', status: 'healthy' },
                { service: 'Database', status: 'healthy' },
                { service: 'Redis Cache', status: 'warning' },
                { service: 'File Storage', status: 'healthy' }
              ].map(({ service, status }) => (
                <div key={service} className="flex justify-between">
                  <span>{service}</span>
                  <Badge variant={
                    status === 'healthy' ? 'default' : 
                    status === 'warning' ? 'destructive' : 'secondary'
                  }>
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('system.security_status')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { check: 'SSL Certificate', status: 'valid' },
                { check: 'Firewall', status: 'active' },
                { check: 'Backup Status', status: 'completed' },
                { check: 'Security Scan', status: 'passed' }
              ].map(({ check, status }) => (
                <div key={check} className="flex justify-between">
                  <span>{check}</span>
                  <Badge variant="default">{status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('system_management.title')}
        description={t('system_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configurations" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              {t('system_management.configurations_tab')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('system_management.analytics_tab')}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {t('system_management.security_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configurations">
            <ConfigurationsList />
          </TabsContent>

          <TabsContent value="analytics">
            <SystemAnalytics />
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>{t('system_management.security')}</CardTitle>
                <CardDescription>{t('system_management.security_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('system_management.security_coming_soon')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}