import React from 'react';
import { WorkspaceMetrics } from '@/components/workspace/WorkspaceMetrics';
import { WorkspaceQuickActions } from '@/components/workspace/WorkspaceQuickActions';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { WorkspaceBreadcrumb } from '@/components/layout/WorkspaceBreadcrumb';
import { EnhancedWorkspaceHero } from '@/components/workspace/EnhancedWorkspaceHero';
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
  const { user, userProfile } = useAuth();
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
      <>
        <WorkspaceBreadcrumb />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <WorkspaceBreadcrumb />
      <div className="container mx-auto px-4 py-8">
        <EnhancedWorkspaceHero
          userRole={userProfile?.roles?.[0] || 'admin'}
          userProfile={userProfile}
          title={t('workspace.admin.title')}
          description={t('workspace.admin.description')}
          stats={[
            { label: t('workspace.admin.metrics.total_users'), value: workspaceData?.stats?.totalUsers || 0, icon: Users },
            { label: t('workspace.admin.metrics.total_challenges'), value: workspaceData?.stats?.totalChallenges || 0, icon: Shield },
            { label: t('workspace.admin.metrics.total_ideas'), value: workspaceData?.stats?.totalIdeas || 0, icon: BarChart3 },
            { label: t('workspace.admin.metrics.active_challenges'), value: workspaceData?.stats?.totalChallenges || 0, icon: Settings }
          ]}
          quickActions={[
            {
              label: t('workspace.admin.actions.manage_system'),
              onClick: () => navigate(ALL_ROUTES.ADMIN_DASHBOARD),
              icon: Settings
            }
          ]}
        />
      </div>
      
      <div className="container mx-auto px-4 pb-12">
        <div className="space-y-6">
          {/* Navigation */}
          <WorkspaceNavigation items={navigationItems} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* System Health */}
              <Card className="gradient-border hover-scale group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
                    {t('workspace.admin.system_health')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/20 text-green-600 group-hover:from-green-500/20 group-hover:to-green-600/30 transition-all duration-300 group-hover:scale-110">
                          <Shield className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold group-hover:text-primary transition-colors">{t('workspace.admin.uptime')}</h4>
                          <p className="text-sm text-muted-foreground">{workspaceData?.systemHealth?.uptime || '99.9%'}</p>
                        </div>
                      </div>
                      <Badge variant="success" className="gradient-border">
                        {t('workspace.admin.healthy')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-600 group-hover:from-blue-500/20 group-hover:to-blue-600/30 transition-all duration-300 group-hover:scale-110">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold group-hover:text-primary transition-colors">{t('workspace.admin.response_time')}</h4>
                          <p className="text-sm text-muted-foreground">{workspaceData?.systemHealth?.responseTime || '120ms'}</p>
                        </div>
                      </div>
                      <Badge variant="success" className="gradient-border">
                        {t('workspace.admin.optimal')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/20 text-purple-600 group-hover:from-purple-500/20 group-hover:to-purple-600/30 transition-all duration-300 group-hover:scale-110">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold group-hover:text-primary transition-colors">{t('workspace.admin.active_users')}</h4>
                          <p className="text-sm text-muted-foreground">{workspaceData?.systemHealth?.activeUsers || 1250}</p>
                        </div>
                      </div>
                      <Badge variant="success" className="gradient-border">
                        {t('workspace.admin.normal')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card className="gradient-border hover-scale group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
                      {t('workspace.admin.recent_users')}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(ALL_ROUTES.ADMIN_USERS)}
                      className="hover-scale gradient-border"
                    >
                      {t('workspace.admin.manage_all')}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {workspaceData?.recentUsers?.length > 0 ? (
                    <div className="space-y-3">
                      {workspaceData.recentUsers.slice(0, 5).map((user, index) => (
                        <div 
                          key={user.id} 
                          className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold group-hover:text-primary transition-colors">{user.email}</h4>
                              <p className="text-sm text-muted-foreground">
                                {t('workspace.admin.joined')}: {new Date(user.created_at || '').toLocaleDateString('ar')}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="hover-scale gradient-border">
                            {t('common.manage')}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground animate-fade-in">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto mb-4 hover-scale">
                        <Users className="h-12 w-12 text-primary" />
                      </div>
                      <p className="text-lg font-medium mb-2">{t('workspace.admin.no_users')}</p>
                      <p className="text-sm mb-6">{t('workspace.admin.no_users_desc', 'No users registered yet')}</p>
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
        
        {/* Admin Workspace Collaboration */}
        <WorkspaceCollaboration
          workspaceType="admin"
          entityId={user?.id}
          showWidget={true}
          showPresence={true}
          showActivity={true}
        />
      </div>
    </>
  );
}
