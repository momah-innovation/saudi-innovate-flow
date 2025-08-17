import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Handshake, BarChart3, Settings, Plus, Building, Users } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useRelationshipData } from '@/hooks/useRelationshipData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
// ✅ MIGRATED: Using unified error handling pattern
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface Partnership {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  start_date: string;
  end_date?: string;
  partnership_level: string;
  contact_person?: string;
  contact_email?: string;
  created_at: string;
  updated_at: string;
}

export function PartnershipManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('partnerships');
  
  // ✅ MIGRATED: Using centralized hooks (mock partnerships from relationships)
  const {
    relationships,
    loading,
    loadRelationships
  } = useRelationshipData();
  
  // Mock partnerships from relationships data
  const partnerships = relationships || [];
  
  const loadingManager = useUnifiedLoading({
    component: 'PartnershipManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    loadRelationships();
  }, [loadRelationships]);

  const partnershipColumns = [
    {
      key: 'name',
      title: t('partnerships.name'),
      accessorKey: 'name',
      header: t('partnerships.name'),
    },
    {
      key: 'type',
      title: t('partnerships.type'),
      accessorKey: 'type',
      header: t('partnerships.type'),
      cell: ({ row }: any) => {
        return (
          <Badge variant="outline">
            {row.original.type}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      title: t('partnerships.status'),
      accessorKey: 'status',
      header: t('partnerships.status'),
      cell: ({ row }: any) => {
        const status = row.original.status || 'active';
        const variant = status === 'active' ? 'default' : 
                      status === 'pending' ? 'secondary' : 'destructive';
        return (
          <Badge variant={variant}>
            {t(`partnerships.status_${status}`)}
          </Badge>
        );
      },
    },
    {
      key: 'description',
      title: t('partnerships.description'),
      accessorKey: 'description',
      header: t('partnerships.description'),
    },
    {
      key: 'created_at',
      title: t('partnerships.created_at'),
      accessorKey: 'created_at',
      header: t('partnerships.created_at'),
      cell: ({ row }: any) => {
        return new Date(row.original.created_at).toLocaleDateString();
      },
    },
  ];

  const PartnershipsList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('partnerships.list')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('partnerships.create')}
        </Button>
      </div>
      
      <DataTable
        columns={partnershipColumns}
        data={partnerships || []}
        loading={loading}
        searchPlaceholder={t('partnerships.search_placeholder')}
      />
    </div>
  );

  const PartnershipAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('partnerships.analytics')}
          </CardTitle>
          <CardDescription>{t('partnerships.analytics_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{partnerships?.length || 0}</div>
              <div className="text-sm text-muted-foreground">{t('partnerships.total')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {partnerships?.filter(p => p.status === 'active').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('partnerships.active')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {partnerships?.filter(p => p.status === 'pending').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('partnerships.pending')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {partnerships?.filter(p => p.partnership_level === 'strategic').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('partnerships.strategic')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {t('partnerships.by_type')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Mock data for partnership types */}
              {['corporate', 'government', 'academic', 'non-profit'].map(type => {
                const count = partnerships?.filter(p => p.type === type).length || 0;
                return (
                  <div key={type} className="flex justify-between">
                    <span>{t(`partnerships.type_${type}`)}</span>
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
              <Users className="w-5 h-5" />
              {t('partnerships.by_level')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['strategic', 'operational', 'project-based', 'advisory'].map(level => {
                const count = partnerships?.filter(p => p.partnership_level === level).length || 0;
                return (
                  <div key={level} className="flex justify-between">
                    <span>{t(`partnerships.level_${level}`)}</span>
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
        title={t('partnership_management.title')}
        description={t('partnership_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="partnerships" className="flex items-center gap-2">
              <Handshake className="w-4 h-4" />
              {t('partnership_management.partnerships_tab')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('partnership_management.analytics_tab')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('partnership_management.settings_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="partnerships">
            <PartnershipsList />
          </TabsContent>

          <TabsContent value="analytics">
            <PartnershipAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t('partnership_management.settings')}</CardTitle>
                <CardDescription>{t('partnership_management.settings_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('partnership_management.settings_coming_soon')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}