import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plug, Plus, TestTube, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useIntegrationData } from '@/hooks/useIntegrationData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface Integration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'messaging' | 'storage' | 'analytics';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'pending' | 'testing';
  configuration: {
    endpoint?: string;
    api_key?: string;
    webhook_url?: string;
    authentication_method: 'api_key' | 'oauth' | 'basic_auth' | 'bearer_token';
    rate_limit?: number;
    timeout?: number;
    retry_count?: number;
  };
  health_check: {
    last_checked: string;
    response_time_ms: number;
    success_rate: number;
    error_count: number;
  };
  usage_stats: {
    requests_today: number;
    requests_this_month: number;
    data_transferred_mb: number;
    errors_today: number;
  };
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface IntegrationLog {
  id: string;
  integration_id: string;
  event_type: 'request' | 'response' | 'error' | 'health_check';
  timestamp: string;
  status_code?: number;
  response_time_ms?: number;
  error_message?: string;
  request_data?: Record<string, any>;
  response_data?: Record<string, any>;
}

export function IntegrationManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    integrations,
    logs,
    loading,
    refreshIntegrationData,
    createIntegration,
    updateIntegration,
    testIntegration,
    toggleIntegration,
    deleteIntegration
  } = useIntegrationData();
  
  const loadingManager = useUnifiedLoading({
    component: 'IntegrationManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshIntegrationData();
  }, [refreshIntegrationData]);

  const integrationColumns: Column<Integration>[] = [
    {
      key: 'name',
      title: t('integration.name'),
    },
    {
      key: 'type',
      title: t('integration.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'provider',
      title: t('integration.provider'),
    },
    {
      key: 'status',
      title: t('integration.status'),
      render: (value: string, item: Integration) => (
        <div className="flex items-center gap-2">
          <Badge variant={
            value === 'active' ? 'default' : 
            value === 'testing' ? 'secondary' : 
            value === 'error' ? 'destructive' : 'outline'
          }>
            {value}
          </Badge>
          <Switch 
            checked={value === 'active'} 
            onCheckedChange={() => toggleIntegration(item.id)}
          />
        </div>
      ),
    },
    {
      key: 'health_check',
      title: t('integration.health'),
      render: (health: Integration['health_check']) => (
        <div className="flex items-center gap-2">
          {health.success_rate > 95 ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-600" />
          )}
          <span className="text-sm">{health.success_rate.toFixed(1)}%</span>
        </div>
      ),
    },
    {
      key: 'usage_stats',
      title: t('integration.requests_today'),
      render: (stats: Integration['usage_stats']) => stats.requests_today,
    },
    {
      key: 'id' as keyof Integration,
      title: t('common.actions'),
      render: (_, item: Integration) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => testIntegration(item.id)}
            disabled={item.status === 'testing'}
          >
            <TestTube className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Activity className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const logColumns: Column<IntegrationLog>[] = [
    {
      key: 'integration_id',
      title: t('integration.integration'),
      render: (integrationId: string) => {
        const integration = integrations.find(i => i.id === integrationId);
        return integration?.name || integrationId;
      },
    },
    {
      key: 'event_type',
      title: t('integration.event_type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'status_code',
      title: t('integration.status_code'),
      render: (value?: number) => (
        value ? (
          <Badge variant={value < 400 ? 'default' : 'destructive'}>
            {value}
          </Badge>
        ) : '-'
      ),
    },
    {
      key: 'response_time_ms',
      title: t('integration.response_time'),
      render: (value?: number) => value ? `${value}ms` : '-',
    },
    {
      key: 'timestamp',
      title: t('integration.timestamp'),
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: 'error_message',
      title: t('integration.error'),
      render: (value?: string) => value ? (
        <span className="text-destructive text-sm">{value}</span>
      ) : '-',
    },
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('integration.total_integrations')}</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
              <Plug className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('integration.active_integrations')}</p>
                <p className="text-2xl font-bold">
                  {integrations.filter(i => i.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('integration.requests_today')}</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + i.usage_stats.requests_today, 0)}
                </p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('integration.errors_today')}</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + i.usage_stats.errors_today, 0)}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('integration.integration_health')}</CardTitle>
            <CardDescription>{t('integration.health_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {integrations.slice(0, 5).map((integration) => (
                <div key={integration.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {integration.health_check.response_time_ms}ms avg
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.health_check.success_rate > 95 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className="text-sm">{integration.health_check.success_rate.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('integration.integration_types')}</CardTitle>
            <CardDescription>{t('integration.types_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['api', 'webhook', 'database', 'messaging', 'storage', 'analytics'].map((type) => {
                const count = integrations.filter(i => i.type === type).length;
                return (
                  <div key={type} className="flex justify-between items-center p-2 border rounded">
                    <span className="capitalize">{type}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const IntegrationsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('integration.all_integrations')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('integration.add_integration')}
        </Button>
      </div>
      
      <DataTable
        columns={integrationColumns}
        data={integrations || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const LogsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('integration.integration_logs')}</h3>
        <p className="text-sm text-muted-foreground">
          {logs.length} {t('integration.recent_events')}
        </p>
      </div>
      
      <DataTable
        columns={logColumns}
        data={logs || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('integration_management.title')}
        description={t('integration_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t('integration_management.overview_tab')}
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Plug className="w-4 h-4" />
              {t('integration_management.integrations_tab')}
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {t('integration_management.logs_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="logs">
            <LogsTab />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}