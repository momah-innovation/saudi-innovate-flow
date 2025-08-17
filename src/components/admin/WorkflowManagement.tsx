import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Workflow, Play, Pause, Plus, Activity, Settings, BarChart3 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useWorkflowData } from '@/hooks/useWorkflowData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'approval' | 'notification' | 'automation' | 'integration';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  trigger: {
    type: 'manual' | 'scheduled' | 'event' | 'webhook';
    configuration: Record<string, any>;
  };
  steps: Array<{
    id: string;
    name: string;
    type: 'approval' | 'notification' | 'automation' | 'condition' | 'action';
    status: 'pending' | 'active' | 'completed' | 'failed' | 'skipped';
    assignee?: string;
    due_date?: string;
    configuration: Record<string, any>;
    position: { x: number; y: number };
  }>;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_run?: string;
  run_count: number;
  success_rate: number;
}

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  triggered_by: string;
  context: Record<string, any>;
  current_step?: string;
  error_message?: string;
}

export function WorkflowManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    workflows,
    executions,
    loading,
    refreshWorkflowData,
    createWorkflow,
    updateWorkflow,
    executeWorkflow,
    toggleWorkflow
  } = useWorkflowData();
  
  const loadingManager = useUnifiedLoading({
    component: 'WorkflowManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshWorkflowData();
  }, [refreshWorkflowData]);

  const workflowColumns: Column<Workflow>[] = [
    {
      key: 'name',
      title: t('workflow.name'),
    },
    {
      key: 'category',
      title: t('workflow.category'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: t('workflow.status'),
      render: (value: string, item: Workflow) => (
        <div className="flex items-center gap-2">
          <Badge variant={
            value === 'active' ? 'default' : 
            value === 'paused' ? 'secondary' : 
            value === 'draft' ? 'outline' : 'destructive'
          }>
            {value}
          </Badge>
          <Switch 
            checked={value === 'active'} 
            onCheckedChange={() => toggleWorkflow(item.id)}
          />
        </div>
      ),
    },
    {
      key: 'trigger',
      title: t('workflow.trigger'),
      render: (trigger: Workflow['trigger']) => (
        <Badge variant="secondary">
          {trigger.type}
        </Badge>
      ),
    },
    {
      key: 'run_count',
      title: t('workflow.executions'),
    },
    {
      key: 'success_rate',
      title: t('workflow.success_rate'),
      render: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      key: 'last_run',
      title: t('workflow.last_run'),
      render: (value?: string) => 
        value ? new Date(value).toLocaleDateString() : t('workflow.never_run'),
    },
    {
      key: 'id' as keyof Workflow,
      title: t('common.actions'),
      render: (_, item: Workflow) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => executeWorkflow(item.id)}
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const executionColumns: Column<WorkflowExecution>[] = [
    {
      key: 'workflow_id',
      title: t('workflow.workflow'),
      render: (workflowId: string) => {
        const workflow = workflows.find(w => w.id === workflowId);
        return workflow?.name || workflowId;
      },
    },
    {
      key: 'status',
      title: t('workflow.status'),
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
      key: 'triggered_by',
      title: t('workflow.triggered_by'),
    },
    {
      key: 'started_at',
      title: t('workflow.started_at'),
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: 'completed_at',
      title: t('workflow.completed_at'),
      render: (value?: string) => 
        value ? new Date(value).toLocaleString() : t('workflow.in_progress'),
    },
    {
      key: 'current_step',
      title: t('workflow.current_step'),
      render: (value?: string) => value || '-',
    },
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('workflow.total_workflows')}</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
              <Workflow className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('workflow.active_workflows')}</p>
                <p className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('workflow.running_executions')}</p>
                <p className="text-2xl font-bold">
                  {executions.filter(e => e.status === 'running').length}
                </p>
              </div>
              <Play className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('workflow.avg_success_rate')}</p>
                <p className="text-2xl font-bold">
                  {workflows.length > 0 
                    ? (workflows.reduce((sum, w) => sum + w.success_rate, 0) / workflows.length).toFixed(1)
                    : 0}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('workflow.recent_executions')}</CardTitle>
            <CardDescription>{t('workflow.recent_executions_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {executions.slice(0, 5).map((execution) => {
                const workflow = workflows.find(w => w.id === execution.workflow_id);
                return (
                  <div key={execution.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{workflow?.name || 'Unknown Workflow'}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('workflow.started')}: {new Date(execution.started_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={
                      execution.status === 'completed' ? 'default' : 
                      execution.status === 'running' ? 'secondary' : 'destructive'
                    }>
                      {execution.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('workflow.workflow_categories')}</CardTitle>
            <CardDescription>{t('workflow.categories_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['approval', 'notification', 'automation', 'integration'].map((category) => {
                const count = workflows.filter(w => w.category === category).length;
                return (
                  <div key={category} className="flex justify-between items-center p-2 border rounded">
                    <span className="capitalize">{category.replace('_', ' ')}</span>
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

  const WorkflowsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('workflow.all_workflows')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('workflow.create_workflow')}
        </Button>
      </div>
      
      <DataTable
        columns={workflowColumns}
        data={workflows || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const ExecutionsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('workflow.workflow_executions')}</h3>
        <p className="text-sm text-muted-foreground">
          {executions.length} {t('workflow.total_executions')}
        </p>
      </div>
      
      <DataTable
        columns={executionColumns}
        data={executions || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('workflow_management.title')}
        description={t('workflow_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('workflow_management.overview_tab')}
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              {t('workflow_management.workflows_tab')}
            </TabsTrigger>
            <TabsTrigger value="executions" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t('workflow_management.executions_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowsTab />
          </TabsContent>

          <TabsContent value="executions">
            <ExecutionsTab />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}