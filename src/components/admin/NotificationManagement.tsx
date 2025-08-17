import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, BarChart3, Settings, Plus, Mail, MessageSquare, AlertTriangle } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useNotificationData } from '@/hooks/useNotificationData';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  recipient_type: string;
  recipient_id?: string;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  priority: string;
  channel: string;
}

export function NotificationManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('notifications');
  
  // ✅ MIGRATED: Using centralized hooks
  const {
    notifications,
    loading,
    createNotification,
    updateNotification,
    deleteNotification,
    refreshNotifications
  } = useNotificationData();
  
  const loadingManager = useUnifiedLoading({
    component: 'NotificationManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const notificationColumns: Column<Notification>[] = [
    {
      key: 'title',
      title: t('notifications.title'),
    },
    {
      key: 'type',
      title: t('notifications.type'),
      render: (value: string) => (
        <Badge variant="outline">
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: t('notifications.status'),
      render: (value: string) => (
        <Badge variant={value === 'sent' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'priority',
      title: t('notifications.priority'),
      render: (value: string) => (
        <Badge variant={value === 'high' ? 'destructive' : 'outline'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'channel',
      title: t('notifications.channel'),
      render: (value: string) => {
        const icon = value === 'email' ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />;
        return (
          <div className="flex items-center gap-1">
            {icon}
            {value}
          </div>
        );
      },
    },
    {
      key: 'created_at',
      title: t('notifications.created_at'),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const NotificationsList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('notifications.list')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('notifications.create')}
        </Button>
      </div>
      
      <DataTable
        columns={notificationColumns}
        data={notifications || []}
        loading={loading}
        searchable={true}
      />
    </div>
  );

  const NotificationAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('notifications.analytics')}
          </CardTitle>
          <CardDescription>{t('notifications.analytics_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{notifications?.length || 0}</div>
              <div className="text-sm text-muted-foreground">{t('notifications.total')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {notifications?.filter(n => n.status === 'sent').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('notifications.sent')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {notifications?.filter(n => n.status === 'pending').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('notifications.pending')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {notifications?.filter(n => n.priority === 'high').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('notifications.high_priority')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t('notifications.by_type')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['info', 'warning', 'error', 'success'].map(type => {
                const count = notifications?.filter(n => n.type === type).length || 0;
                return (
                  <div key={type} className="flex justify-between">
                    <span>{t(`notifications.type_${type}`)}</span>
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
              <MessageSquare className="w-5 h-5" />
              {t('notifications.by_channel')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['email', 'sms', 'push', 'in-app'].map(channel => {
                const count = notifications?.filter(n => n.channel === channel).length || 0;
                return (
                  <div key={channel} className="flex justify-between">
                    <span>{t(`notifications.channel_${channel}`)}</span>
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
        title={t('notification_management.title')}
        description={t('notification_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              {t('notification_management.notifications_tab')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('notification_management.analytics_tab')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('notification_management.settings_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <NotificationsList />
          </TabsContent>

          <TabsContent value="analytics">
            <NotificationAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t('notification_management.settings')}</CardTitle>
                <CardDescription>{t('notification_management.settings_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('notification_management.settings_coming_soon')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}