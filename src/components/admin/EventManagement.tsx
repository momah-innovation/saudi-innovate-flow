import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, Settings, Plus } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAdminEvents } from '@/hooks/useAdminEvents';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable } from '@/components/ui/data-table';

interface Event {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  location?: string;
  capacity?: number;
  registration_required: boolean;
  created_at: string;
  updated_at: string;
}

export function EventManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('events');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    events,
    loading,
    createEvent: createAdminEvent,
    updateEvent: updateAdminEvent,
    deleteEvent: deleteAdminEvent,
    refreshEvents
  } = useEvents();
  
  const loadingManager = useUnifiedLoading({
    component: 'EventManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const columns = [
    {
      key: 'title_ar' as keyof any,
      title: t('events.title'),
      accessorKey: 'title_ar',
      header: t('events.title'),
    },
    {
      key: 'event_type' as keyof any,
      title: t('events.type'),
      accessorKey: 'event_type',
      header: t('events.type'),
    },
    {
      key: 'status' as keyof any,
      title: t('events.status'),
      accessorKey: 'status',
      header: t('events.status'),
    },
    {
      key: 'start_date' as keyof any,
      title: t('events.start_date'),
      accessorKey: 'start_date',
      header: t('events.start_date'),
      cell: ({ row }: any) => {
        return new Date(row.original.start_date).toLocaleDateString();
      },
    },
    {
      key: 'capacity' as keyof any,
      title: t('events.capacity'),
      accessorKey: 'capacity',
      header: t('events.capacity'),
    },
  ];

  const EventsList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('events.list')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('events.create')}
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={events || []}
        loading={loading}
        className="w-full"
      />
    </div>
  );

  const EventsAnalytics = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t('events.analytics')}</CardTitle>
        <CardDescription>{t('events.analytics_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{events?.length || 0}</div>
            <div className="text-sm text-muted-foreground">{t('events.total')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {events?.filter(e => e.status === 'active').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">{t('events.active')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {events?.filter(e => e.status === 'completed').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">{t('events.completed')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('event_management.title')}
        description={t('event_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('event_management.events_tab')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('event_management.analytics_tab')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('event_management.settings_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventsList />
          </TabsContent>

          <TabsContent value="analytics">
            <EventsAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t('event_management.settings')}</CardTitle>
                <CardDescription>{t('event_management.settings_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('event_management.settings_coming_soon')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}