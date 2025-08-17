import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardDrive, BarChart3, Settings, Plus, Folder, File, Upload, Download } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useResourceData } from '@/hooks/useResourceData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface Resource {
  id: string;
  name: string;
  type: string;
  size: number;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  file_path?: string;
  category: string;
}

export function ResourceManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('resources');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    resources,
    loading,
    createResource,
    updateResource,
    deleteResource,
    refreshResources
  } = useResourceData();
  
  const loadingManager = useUnifiedLoading({
    component: 'ResourceManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshResources();
  }, [refreshResources]);

  const resourceColumns: Column<Resource>[] = [
    {
      key: 'name',
      title: t('resources.name'),
    },
    {
      key: 'type',
      title: t('resources.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'size',
      title: t('resources.size'),
      render: (value: number) => `${(value / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      key: 'status',
      title: t('resources.status'),
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      title: t('resources.created_at'),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const ResourcesList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('resources.list')}</h3>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            {t('resources.upload')}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t('resources.create')}
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={resourceColumns}
        data={resources || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const ResourceAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('resources.analytics')}
          </CardTitle>
          <CardDescription>{t('resources.analytics_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{resources?.length || 0}</div>
              <div className="text-sm text-muted-foreground">{t('resources.total')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {resources?.filter(r => r.status === 'active').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('resources.active')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {resources?.reduce((sum, r) => sum + r.size, 0) / 1024 / 1024 || 0}
              </div>
              <div className="text-sm text-muted-foreground">MB {t('resources.total_size')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {resources?.filter(r => r.type === 'document').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('resources.documents')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5" />
              {t('resources.by_category')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['documents', 'images', 'videos', 'other'].map(category => {
                const count = resources?.filter(r => r.category === category).length || 0;
                return (
                  <div key={category} className="flex justify-between">
                    <span>{t(`resources.category_${category}`)}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="w-5 h-5" />
              {t('resources.by_type')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['pdf', 'image', 'video', 'archive'].map(type => {
                const count = resources?.filter(r => r.type === type).length || 0;
                return (
                  <div key={type} className="flex justify-between">
                    <span>{t(`resources.type_${type}`)}</span>
                    <Badge variant="secondary">{count}</Badge>
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
        title={t('resource_management.title')}
        description={t('resource_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              {t('resource_management.resources_tab')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('resource_management.analytics_tab')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('resource_management.settings_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources">
            <ResourcesList />
          </TabsContent>

          <TabsContent value="analytics">
            <ResourceAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t('resource_management.settings')}</CardTitle>
                <CardDescription>{t('resource_management.settings_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('resource_management.settings_coming_soon')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}