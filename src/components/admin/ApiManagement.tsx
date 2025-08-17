import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Key, Plus, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useApiData } from '@/hooks/useApiData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'active' | 'inactive' | 'deprecated' | 'testing';
  version: string;
  description: string;
  rate_limit: {
    requests_per_minute: number;
    burst_limit: number;
    enabled: boolean;
  };
  authentication: {
    required: boolean;
    type: 'api_key' | 'oauth' | 'jwt' | 'basic_auth';
    roles: string[];
  };
  metrics: {
    total_requests: number;
    requests_today: number;
    success_rate: number;
    avg_response_time_ms: number;
    error_count_today: number;
  };
  documentation_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  usage_count: number;
  last_used: string;
  expires_at?: string;
  status: 'active' | 'revoked' | 'expired';
  created_at: string;
  created_by: string;
}

export function ApiManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    endpoints,
    apiKeys,
    metrics,
    loading,
    refreshApiData,
    createEndpoint,
    updateEndpoint,
    createApiKey,
    revokeApiKey,
    toggleEndpoint
  } = useApiData();
  
  const loadingManager = useUnifiedLoading({
    component: 'ApiManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshApiData();
  }, [refreshApiData]);

  const endpointColumns: Column<ApiEndpoint>[] = [
    {
      key: 'name',
      title: t('api.name'),
    },
    {
      key: 'method',
      title: t('api.method'),
      render: (value: string) => (
        <Badge variant={
          value === 'GET' ? 'default' : 
          value === 'POST' ? 'secondary' : 
          value === 'PUT' ? 'outline' : 'destructive'
        }>
          {value}
        </Badge>
      ),
    },
    {
      key: 'path',
      title: t('api.path'),
      render: (value: string) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {value}
        </code>
      ),
    },
    {
      key: 'status',
      title: t('api.status'),
      render: (value: string, item: ApiEndpoint) => (
        <div className="flex items-center gap-2">
          <Badge variant={
            value === 'active' ? 'default' : 
            value === 'testing' ? 'secondary' : 
            value === 'deprecated' ? 'destructive' : 'outline'
          }>
            {value}
          </Badge>
          <Switch 
            checked={value === 'active'} 
            onCheckedChange={() => toggleEndpoint(item.id)}
          />
        </div>
      ),
    },
    {
      key: 'metrics',
      title: t('api.requests_today'),
      render: (metrics: ApiEndpoint['metrics']) => metrics.requests_today,
    },
    {
      key: 'metrics',
      title: t('api.success_rate'),
      render: (metrics: ApiEndpoint['metrics']) => `${metrics.success_rate.toFixed(1)}%`,
    },
    {
      key: 'id' as keyof ApiEndpoint,
      title: t('common.actions'),
      render: (_, item: ApiEndpoint) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Code className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Activity className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const keyColumns: Column<ApiKey>[] = [
    {
      key: 'name',
      title: t('api.key_name'),
    },
    {
      key: 'key_prefix',
      title: t('api.key_prefix'),
      render: (value: string) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {value}***
        </code>
      ),
    },
    {
      key: 'permissions',
      title: t('api.permissions'),
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {permissions.slice(0, 2).map((permission) => (
            <Badge key={permission} variant="outline" className="text-xs">
              {permission}
            </Badge>
          ))}
          {permissions.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{permissions.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      title: t('api.status'),
      render: (value: string) => (
        <Badge variant={
          value === 'active' ? 'default' : 
          value === 'expired' ? 'destructive' : 'secondary'
        }>
          {value}
        </Badge>
      ),
    },
    {
      key: 'usage_count',
      title: t('api.usage_count'),
    },
    {
      key: 'last_used',
      title: t('api.last_used'),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'id' as keyof ApiKey,
      title: t('common.actions'),
      render: (_, item: ApiKey) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => revokeApiKey(item.id)}
            disabled={item.status === 'revoked'}
          >
            {t('api.revoke')}
          </Button>
        </div>
      ),
    },
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('api.total_endpoints')}</p>
                <p className="text-2xl font-bold">{metrics?.totalEndpoints || 0}</p>
              </div>
              <Code className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('api.active_endpoints')}</p>
                <p className="text-2xl font-bold">{metrics?.activeEndpoints || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('api.requests_today')}</p>
                <p className="text-2xl font-bold">{metrics?.requestsToday || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('api.error_rate')}</p>
                <p className="text-2xl font-bold">{metrics?.errorRate || 0}%</p>
              </div>
              <AlertCircle className={`w-8 h-8 ${(metrics?.errorRate || 0) > 5 ? 'text-destructive' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('api.endpoint_performance')}</CardTitle>
            <CardDescription>{t('api.performance_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {endpoints.slice(0, 5).map((endpoint) => (
                <div key={endpoint.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{endpoint.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {endpoint.metrics.avg_response_time_ms}ms avg
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={endpoint.metrics.success_rate > 95 ? 'default' : 'destructive'}>
                      {endpoint.metrics.success_rate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('api.recent_activity')}</CardTitle>
            <CardDescription>{t('api.activity_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {apiKeys.slice(0, 5).map((key) => (
                <div key={key.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {key.usage_count.toLocaleString()} requests
                    </p>
                  </div>
                  <Badge variant={key.status === 'active' ? 'default' : 'secondary'}>
                    {key.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const EndpointsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('api.api_endpoints')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('api.add_endpoint')}
        </Button>
      </div>
      
      <DataTable
        columns={endpointColumns}
        data={endpoints || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const KeysTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('api.api_keys')}</h3>
        <Button>
          <Key className="w-4 h-4 mr-2" />
          {t('api.generate_key')}
        </Button>
      </div>
      
      <DataTable
        columns={keyColumns}
        data={apiKeys || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('api_management.title')}
        description={t('api_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t('api_management.overview_tab')}
            </TabsTrigger>
            <TabsTrigger value="endpoints" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              {t('api_management.endpoints_tab')}
            </TabsTrigger>
            <TabsTrigger value="keys" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              {t('api_management.keys_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="endpoints">
            <EndpointsTab />
          </TabsContent>

          <TabsContent value="keys">
            <KeysTab />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}