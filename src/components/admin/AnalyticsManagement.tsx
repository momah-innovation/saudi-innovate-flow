import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Activity, Download, RefreshCw } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { createErrorHandler } from '@/utils/errorHandler';

interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_id: string;
  properties: Record<string, any>;
  timestamp: string;
  source: string;
}

export function AnalyticsManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const errorHandler = createErrorHandler({ component: 'AnalyticsManagement' });
  
  // ✅ MIGRATED: Using existing centralized hooks
  const {
    coreMetrics,
    securityMetrics,
    roleBasedMetrics,
    isLoading,
    refresh,
    isRefreshing,
    hasAccess
  } = useAnalytics({
    autoRefresh: true,
    includeRoleSpecific: true,
    includeSecurity: true
  });
  
  const loadingManager = useUnifiedLoading({
    component: 'AnalyticsManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    if (!hasAccess.analytics) {
      errorHandler.handleError(
        new Error('Insufficient permissions to view analytics'),
        'permission_check'
      );
    }
  }, [hasAccess.analytics, errorHandler]);

  const mockEvents: AnalyticsEvent[] = [
    {
      id: '1',
      event_type: 'user_login',
      user_id: 'user123',
      properties: { device: 'desktop', browser: 'chrome' },
      timestamp: new Date().toISOString(),
      source: 'web_app'
    },
    {
      id: '2',
      event_type: 'challenge_created',
      user_id: 'admin456',
      properties: { category: 'innovation', difficulty: 'medium' },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      source: 'admin_panel'
    }
  ];

  const eventColumns: Column<AnalyticsEvent>[] = [
    {
      key: 'event_type',
      title: t('analytics.event_type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'user_id',
      title: t('analytics.user_id'),
      render: (value: string) => value.substring(0, 8) + '...',
    },
    {
      key: 'source',
      title: t('analytics.source'),
      render: (value: string) => (
        <Badge variant="secondary">
          {value}
        </Badge>
      ),
    },
    {
      key: 'timestamp',
      title: t('analytics.timestamp'),
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('analytics.overview')}</h3>
        <Button 
          onClick={refresh} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t('common.refresh')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.total_users')}</p>
                <p className="text-2xl font-bold">{coreMetrics?.users?.total || 0}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.page_views')}</p>
                <p className="text-2xl font-bold">{coreMetrics?.challenges?.total || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.conversion_rate')}</p>
                <p className="text-2xl font-bold">{coreMetrics?.engagement?.avgSessionDuration || '0%'}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.bounce_rate')}</p>
                <p className="text-2xl font-bold">{coreMetrics?.business?.roi || '0%'}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {hasAccess.security && securityMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.security_metrics')}</CardTitle>
            <CardDescription>{t('analytics.security_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold">{securityMetrics.threatCount || 0}</div>
                <div className="text-sm text-muted-foreground">{t('analytics.threats_detected')}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{securityMetrics.suspiciousActivities || 0}</div>
                <div className="text-sm text-muted-foreground">{t('analytics.blocked_requests')}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{securityMetrics.failedLogins || 0}</div>
                <div className="text-sm text-muted-foreground">{t('analytics.vulnerabilities')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const EventsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('analytics.events')}</h3>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          {t('analytics.export_events')}
        </Button>
      </div>
      
      <DataTable
        columns={eventColumns}
        data={mockEvents}
        loading={isLoading}
        searchable={true}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('analytics_management.title')}
        description={t('analytics_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('analytics_management.overview_tab')}
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t('analytics_management.events_tab')}
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t('analytics_management.reports_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab />
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics_management.reports')}</CardTitle>
                <CardDescription>{t('analytics_management.reports_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('analytics_management.reports_coming_soon')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}