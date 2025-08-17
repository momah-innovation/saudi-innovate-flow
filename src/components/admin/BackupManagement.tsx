import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardDrive, Play, Clock, Download, RotateCcw, Plus } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useBackupData } from '@/hooks/useBackupData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface BackupJob {
  id: string;
  name: string;
  type: 'database' | 'files' | 'configuration' | 'full_system';
  status: 'scheduled' | 'running' | 'completed' | 'failed' | 'cancelled';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'manual';
    time: string;
    enabled: boolean;
  };
  last_run?: string;
  next_run?: string;
  size_mb?: number;
  retention_days: number;
  destination: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface RestorePoint {
  id: string;
  backup_id: string;
  name: string;
  type: string;
  size_mb: number;
  created_at: string;
  expires_at: string;
  verified: boolean;
  metadata: Record<string, any>;
}

export function BackupManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    backupJobs,
    restorePoints,
    metrics,
    loading,
    refreshBackupData,
    createBackupJob,
    runBackupJob,
    toggleBackupSchedule,
    restoreFromBackup
  } = useBackupData();
  
  const loadingManager = useUnifiedLoading({
    component: 'BackupManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshBackupData();
  }, [refreshBackupData]);

  const backupColumns: Column<BackupJob>[] = [
    {
      key: 'name',
      title: t('backup.name'),
    },
    {
      key: 'type',
      title: t('backup.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: t('backup.status'),
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
      key: 'schedule',
      title: t('backup.schedule'),
      render: (schedule: BackupJob['schedule']) => (
        <div className="flex items-center gap-2">
          {schedule ? (
            <>
              <Switch 
                checked={schedule.enabled} 
                onCheckedChange={() => {}} 
                size="sm"
              />
              <span className="text-sm">
                {schedule.frequency} at {schedule.time}
              </span>
            </>
          ) : (
            <Badge variant="secondary">Manual</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'size_mb',
      title: t('backup.size'),
      render: (value?: number) => value ? `${value.toFixed(1)} MB` : '-',
    },
    {
      key: 'last_run',
      title: t('backup.last_run'),
      render: (value?: string) => 
        value ? new Date(value).toLocaleDateString() : t('backup.never_run'),
    },
    {
      key: 'id' as keyof BackupJob,
      title: t('common.actions'),
      render: (_, item: BackupJob) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => runBackupJob(item.id)}
            disabled={item.status === 'running'}
          >
            <Play className="w-4 h-4" />
          </Button>
          {item.schedule && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => toggleBackupSchedule(item.id)}
            >
              <Clock className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const restoreColumns: Column<RestorePoint>[] = [
    {
      key: 'name',
      title: t('backup.restore_point'),
    },
    {
      key: 'type',
      title: t('backup.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'size_mb',
      title: t('backup.size'),
      render: (value: number) => `${value.toFixed(1)} MB`,
    },
    {
      key: 'created_at',
      title: t('backup.created_at'),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'expires_at',
      title: t('backup.expires_at'),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'verified',
      title: t('backup.verified'),
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'destructive'}>
          {value ? t('backup.verified') : t('backup.unverified')}
        </Badge>
      ),
    },
    {
      key: 'id' as keyof RestorePoint,
      title: t('common.actions'),
      render: (_, item: RestorePoint) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => restoreFromBackup(item.id)}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4" />
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
                <p className="text-sm text-muted-foreground">{t('backup.total_backups')}</p>
                <p className="text-2xl font-bold">{metrics?.totalBackups || 0}</p>
              </div>
              <HardDrive className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('backup.successful_backups')}</p>
                <p className="text-2xl font-bold">{metrics?.successfulBackups || 0}</p>
              </div>
              <HardDrive className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('backup.failed_backups')}</p>
                <p className="text-2xl font-bold">{metrics?.failedBackups || 0}</p>
              </div>
              <HardDrive className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('backup.total_size')}</p>
                <p className="text-2xl font-bold">{metrics?.totalSizeGB || 0} GB</p>
              </div>
              <HardDrive className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('backup.recent_backups')}</CardTitle>
            <CardDescription>{t('backup.recent_backups_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backupJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{job.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.last_run ? new Date(job.last_run).toLocaleString() : t('backup.never_run')}
                    </p>
                  </div>
                  <Badge variant={
                    job.status === 'completed' ? 'default' : 
                    job.status === 'running' ? 'secondary' : 
                    job.status === 'failed' ? 'destructive' : 'outline'
                  }>
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('backup.next_scheduled')}</CardTitle>
            <CardDescription>{t('backup.next_scheduled_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backupJobs
                .filter(job => job.schedule?.enabled && job.next_run)
                .slice(0, 5)
                .map((job) => (
                  <div key={job.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{job.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.next_run ? new Date(job.next_run).toLocaleString() : ''}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {job.schedule?.frequency}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const BackupJobsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('backup.backup_jobs')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('backup.create_job')}
        </Button>
      </div>
      
      <DataTable
        columns={backupColumns}
        data={backupJobs || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const RestorePointsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('backup.restore_points')}</h3>
        <p className="text-sm text-muted-foreground">
          {restorePoints.length} {t('backup.available_restore_points')}
        </p>
      </div>
      
      <DataTable
        columns={restoreColumns}
        data={restorePoints || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('backup_management.title')}
        description={t('backup_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              {t('backup_management.overview_tab')}
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t('backup_management.jobs_tab')}
            </TabsTrigger>
            <TabsTrigger value="restore" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              {t('backup_management.restore_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="jobs">
            <BackupJobsTab />
          </TabsContent>

          <TabsContent value="restore">
            <RestorePointsTab />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}