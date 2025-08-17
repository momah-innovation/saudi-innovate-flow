import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Activity, Settings, CheckCircle, XCircle } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSecurityData } from '@/hooks/useSecurityData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface SecurityEvent {
  id: string;
  event_type: 'login_attempt' | 'permission_change' | 'data_access' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address: string;
  user_agent: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  type: 'access_control' | 'data_protection' | 'audit' | 'compliance';
  enabled: boolean;
  rules: Array<{
    condition: string;
    action: string;
    priority: number;
  }>;
  created_at: string;
  updated_at: string;
}

export function SecurityManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    events,
    policies,
    metrics,
    loading,
    refreshSecurityData,
    resolveEvent,
    updatePolicy,
    togglePolicy
  } = useSecurityData();
  
  const loadingManager = useUnifiedLoading({
    component: 'SecurityManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshSecurityData();
  }, [refreshSecurityData]);

  const eventColumns: Column<SecurityEvent>[] = [
    {
      key: 'event_type',
      title: t('security.event_type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'severity',
      title: t('security.severity'),
      render: (value: string) => (
        <Badge variant={
          value === 'critical' ? 'destructive' : 
          value === 'high' ? 'destructive' : 
          value === 'medium' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      ),
    },
    {
      key: 'description',
      title: t('security.description'),
      render: (value: string) => 
        value.length > 50 ? `${value.substring(0, 50)}...` : value,
    },
    {
      key: 'ip_address',
      title: t('security.ip_address'),
    },
    {
      key: 'created_at',
      title: t('security.created_at'),
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: 'resolved',
      title: t('security.status'),
      render: (value: boolean, item: SecurityEvent) => (
        <div className="flex items-center gap-2">
          {value ? (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {t('security.resolved')}
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              {t('security.unresolved')}
            </Badge>
          )}
          {!value && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => resolveEvent(item.id)}
            >
              {t('security.resolve')}
            </Button>
          )}
        </div>
      ),
    },
  ];

  const policyColumns: Column<SecurityPolicy>[] = [
    {
      key: 'name',
      title: t('security.policy_name'),
    },
    {
      key: 'type',
      title: t('security.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'enabled',
      title: t('security.status'),
      render: (value: boolean, item: SecurityPolicy) => (
        <div className="flex items-center gap-2">
          <Switch 
            checked={value} 
            onCheckedChange={() => togglePolicy(item.id)}
          />
          <span className="text-sm">
            {value ? t('security.enabled') : t('security.disabled')}
          </span>
        </div>
      ),
    },
    {
      key: 'updated_at',
      title: t('security.updated_at'),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('security.threats_detected')}</p>
                <p className="text-2xl font-bold">{metrics?.threatsDetected || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('security.events_processed')}</p>
                <p className="text-2xl font-bold">{metrics?.eventsProcessed || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('security.active_policies')}</p>
                <p className="text-2xl font-bold">{metrics?.policiesActive || 0}</p>
              </div>
              <Settings className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('security.risk_score')}</p>
                <p className="text-2xl font-bold">{metrics?.riskScore || 0}%</p>
              </div>
              <Shield className={`w-8 h-8 ${(metrics?.riskScore || 0) > 50 ? 'text-destructive' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('security.compliance_score')}</p>
                <p className="text-2xl font-bold">{metrics?.complianceScore || 0}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('security.recent_events')}</CardTitle>
            <CardDescription>{t('security.recent_events_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{event.description}</p>
                    <p className="text-sm text-muted-foreground">{event.ip_address}</p>
                  </div>
                  <Badge variant={
                    event.severity === 'critical' ? 'destructive' : 
                    event.severity === 'high' ? 'destructive' : 'secondary'
                  }>
                    {event.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('security.policy_status')}</CardTitle>
            <CardDescription>{t('security.policy_status_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policies.slice(0, 5).map((policy) => (
                <div key={policy.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{policy.name}</p>
                    <p className="text-sm text-muted-foreground">{policy.type.replace('_', ' ')}</p>
                  </div>
                  <Badge variant={policy.enabled ? 'default' : 'secondary'}>
                    {policy.enabled ? t('security.enabled') : t('security.disabled')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const EventsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('security.security_events')}</h3>
        <Button onClick={refreshSecurityData} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          {t('common.refresh')}
        </Button>
      </div>
      
      <DataTable
        columns={eventColumns}
        data={events || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const PoliciesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('security.security_policies')}</h3>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          {t('security.add_policy')}
        </Button>
      </div>
      
      <DataTable
        columns={policyColumns}
        data={policies || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('security_management.title')}
        description={t('security_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {t('security_management.overview_tab')}
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t('security_management.events_tab')}
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('security_management.policies_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab />
          </TabsContent>

          <TabsContent value="policies">
            <PoliciesTab />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}