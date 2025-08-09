import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { WorkspaceMetrics } from '@/components/workspace/WorkspaceMetrics';
import { WorkspaceQuickActions } from '@/components/workspace/WorkspaceQuickActions';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { useAdminWorkspaceData } from '@/hooks/useWorkspaceData';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, BarChart3, Settings, UserPlus, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_ROUTES } from '@/routing/routes';

export default function AdminWorkspace() {
  const { t } = useUnifiedTranslation();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const permissions = useWorkspacePermissions();
  const { data: workspaceData, isLoading } = useAdminWorkspaceData();

  const navigationItems = [
    {
      id: 'users',
      label: t('workspace.admin.nav.users'),
      icon: Users,
      count: workspaceData?.stats?.totalUsers || 0,
      active: true,
      onClick: () => navigate(ALL_ROUTES.ADMIN_USERS)
    },
    {
      id: 'system',
      label: t('workspace.admin.nav.system'),
      icon: Settings,
      count: 0,
      active: false,
      onClick: () => navigate(ALL_ROUTES.ADMIN_DASHBOARD)
    },
    {
      id: 'analytics',
      label: t('workspace.admin.nav.analytics'),
      icon: BarChart3,
      count: 0,
      active: false,
      onClick: () => navigate(ALL_ROUTES.ADMIN_ANALYTICS)
    }
  ];

  const quickActions = [
    {
      id: 'add-user',
      title: t('workspace.admin.actions.add_user'),
      description: t('workspace.admin.actions.add_user_desc'),
      icon: UserPlus,
      onClick: () => navigate(ALL_ROUTES.ADMIN_USERS + '?action=create'),
      variant: 'default' as const
    },
    {
      id: 'system-settings',
      title: t('workspace.admin.actions.system_settings'),
      description: t('workspace.admin.actions.system_settings_desc'),
      icon: Settings,
      onClick: () => navigate(ALL_ROUTES.ADMIN_DASHBOARD),
      variant: 'outline' as const
    },
    {
      id: 'backup-data',
      title: t('workspace.admin.actions.backup_data'),
      description: t('workspace.admin.actions.backup_data_desc'),
      icon: Database,
      onClick: () => {},
      variant: 'outline' as const
    }
  ];

  const stats = [
    {
      label: t('workspace.admin.metrics.total_users'),
      value: workspaceData?.stats?.totalUsers || 0,
      icon: Users
    },
    {
      label: t('workspace.admin.metrics.total_challenges'),
      value: workspaceData?.stats?.totalChallenges || 0,
      icon: Shield
    },
    {
      label: t('workspace.admin.metrics.total_ideas'),
      value: workspaceData?.stats?.totalIdeas || 0,
      icon: BarChart3
    },
    {
      label: t('workspace.admin.metrics.active_challenges'),
      value: workspaceData?.stats?.activeChallenges || 0,
      icon: Settings
    }
  ];

  const metrics = [
    {
      title: t('workspace.admin.metrics.total_users'),
      value: workspaceData?.stats?.totalUsers || 0,
      icon: Users
    },
    {
      title: t('workspace.admin.metrics.total_challenges'),
      value: workspaceData?.stats?.totalChallenges || 0,
      icon: Shield
    },
    {
      title: t('workspace.admin.metrics.total_ideas'),
      value: workspaceData?.stats?.totalIdeas || 0,
      icon: BarChart3
    },
    {
      title: t('workspace.admin.metrics.active_challenges'),
      value: workspaceData?.stats?.activeChallenges || 0,
      icon: Settings
    }
  ];

  if (isLoading) {
    return (
      <WorkspaceLayout
        title={t('workspace.admin.title')}
        description={t('workspace.admin.description')}
        userRole={userProfile?.roles?.[0] || 'admin'}
      >
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout
      title={t('workspace.admin.title')}
      description={t('workspace.admin.description')}
      userRole={userProfile?.roles?.[0] || 'admin'}
      stats={stats}
      quickActions={[
        {
          label: t('workspace.admin.actions.manage_system'),
          onClick: () => navigate(ALL_ROUTES.ADMIN_DASHBOARD),
          icon: Settings
        }
      ]}
    >
      <div className="space-y-6">
        {/* Navigation */}
        <WorkspaceNavigation items={navigationItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>{t('workspace.admin.system_health')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{t('workspace.admin.uptime')}</h4>
                      <p className="text-sm text-muted-foreground">{workspaceData?.systemHealth?.uptime || '99.9%'}</p>
                    </div>
                    <Badge variant="success">
                      {t('workspace.admin.healthy')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{t('workspace.admin.response_time')}</h4>
                      <p className="text-sm text-muted-foreground">{workspaceData?.systemHealth?.responseTime || '120ms'}</p>
                    </div>
                    <Badge variant="success">
                      {t('workspace.admin.optimal')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{t('workspace.admin.active_users')}</h4>
                      <p className="text-sm text-muted-foreground">{workspaceData?.systemHealth?.activeUsers || 1250}</p>
                    </div>
                    <Badge variant="success">
                      {t('workspace.admin.normal')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('workspace.admin.recent_users')}
                  <Button 
                    size="sm" 
                    onClick={() => navigate(ALL_ROUTES.ADMIN_USERS)}
                  >
                    {t('workspace.admin.manage_all')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.recentUsers?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.recentUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{user.email}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('workspace.admin.joined')}: {new Date(user.created_at || '').toLocaleDateString('ar')}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          {t('common.manage')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 mb-4" />
                    <p>{t('workspace.admin.no_users')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <WorkspaceQuickActions
              title={t('workspace.admin.quick_actions')}
              actions={quickActions}
            />

            {/* Metrics */}
            <WorkspaceMetrics metrics={metrics} />
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}