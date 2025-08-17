import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileBarChart, Plus, Play, Download, Calendar, Settings } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useReportingData } from '@/hooks/useReportingData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'user_activity' | 'system_performance' | 'content_analytics' | 'security_audit';
  status: 'scheduled' | 'running' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  created_by: string;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    enabled: boolean;
  };
  parameters: Record<string, any>;
  last_run?: string;
  next_run?: string;
  file_url?: string;
}

export function ReportingManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('reports');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    reports,
    templates,
    loading,
    refreshReports,
    createReport,
    updateReport,
    deleteReport,
    runReport,
    downloadReport
  } = useReportingData();
  
  const loadingManager = useUnifiedLoading({
    component: 'ReportingManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  const reportColumns: Column<Report>[] = [
    {
      key: 'name',
      title: t('reports.name'),
    },
    {
      key: 'type',
      title: t('reports.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: t('reports.status'),
      render: (value: string) => (
        <Badge variant={
          value === 'completed' ? 'default' : 
          value === 'running' ? 'secondary' : 
          value === 'failed' ? 'destructive' : 'outline'
        }>
          {value}
        </Badge>
      ),
    },
    {
      key: 'last_run',
      title: t('reports.last_run'),
      render: (value?: string) => 
        value ? new Date(value).toLocaleDateString() : t('reports.never_run'),
    },
    {
      key: 'next_run',
      title: t('reports.next_run'),
      render: (value?: string) => 
        value ? new Date(value).toLocaleDateString() : t('reports.manual'),
    },
    {
      key: 'actions',
      title: t('common.actions'),
      render: (_, item: Report) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => runReport(item.id)}
            disabled={item.status === 'running'}
          >
            <Play className="w-4 h-4" />
          </Button>
          {item.file_url && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => downloadReport(item.id)}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const ReportsList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('reports.all_reports')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('reports.create_report')}
        </Button>
      </div>
      
      <DataTable
        columns={reportColumns}
        data={reports || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const TemplatesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('reports.templates')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('reports.create_template')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {template.name}
                <FileBarChart className="w-5 h-5" />
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline">{template.type.replace('_', ' ')}</Badge>
                <p className="text-sm text-muted-foreground">
                  {template.fields.length} {t('reports.fields')}
                </p>
                <Button className="w-full" size="sm">
                  {t('reports.use_template')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ScheduledTab = () => {
    const scheduledReports = reports.filter(report => report.schedule?.enabled);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t('reports.scheduled_reports')}</h3>
          <p className="text-sm text-muted-foreground">
            {scheduledReports.length} {t('reports.active_schedules')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduledReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {report.name}
                  <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {report.schedule?.frequency} at {report.schedule?.time}
                    </span>
                  </div>
                  {report.next_run && (
                    <p className="text-sm text-muted-foreground">
                      {t('reports.next_run')}: {new Date(report.next_run).toLocaleString()}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => runReport(report.id)}>
                      <Play className="w-4 h-4 mr-1" />
                      {t('reports.run_now')}
                    </Button>
                    {report.file_url && (
                      <Button size="sm" variant="outline" onClick={() => downloadReport(report.id)}>
                        <Download className="w-4 h-4 mr-1" />
                        {t('reports.download')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5" />
            {t('reports.reporting_analytics')}
          </CardTitle>
          <CardDescription>{t('reports.analytics_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{reports.length}</div>
              <div className="text-sm text-muted-foreground">{t('reports.total_reports')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {reports.filter(r => r.schedule?.enabled).length}
              </div>
              <div className="text-sm text-muted-foreground">{t('reports.scheduled')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {reports.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">{t('reports.completed')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {reports.filter(r => r.status === 'running').length}
              </div>
              <div className="text-sm text-muted-foreground">{t('reports.running')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.recent_activity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.last_run ? new Date(report.last_run).toLocaleString() : t('reports.never_run')}
                    </p>
                  </div>
                  <Badge variant={
                    report.status === 'completed' ? 'default' : 
                    report.status === 'running' ? 'secondary' : 'outline'
                  }>
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('reports.report_types')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                'user_activity',
                'system_performance', 
                'content_analytics',
                'security_audit'
              ].map((type) => {
                const count = reports.filter(r => r.type === type).length;
                return (
                  <div key={type} className="flex justify-between">
                    <span>{type.replace('_', ' ')}</span>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('reporting_management.title')}
        description={t('reporting_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileBarChart className="w-4 h-4" />
              {t('reporting_management.reports_tab')}
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('reporting_management.templates_tab')}
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('reporting_management.scheduled_tab')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <FileBarChart className="w-4 h-4" />
              {t('reporting_management.analytics_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <ReportsList />
          </TabsContent>

          <TabsContent value="templates">
            <TemplatesTab />
          </TabsContent>

          <TabsContent value="scheduled">
            <ScheduledTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}