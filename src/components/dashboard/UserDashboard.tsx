
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { DashboardHero } from './DashboardHero';
import { DashboardMetrics } from './DashboardMetrics';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Activity,
  BarChart3,
  Settings,
  Bell,
  Calendar,
  FileText,
  Award,
  Lightbulb,
  Shield,
  Database,
  Zap
} from 'lucide-react';

const UserDashboard = () => {
  const { user, userProfile } = useAuth();
  const { t } = useUnifiedTranslation();
  const { 
    isAdmin, 
    isSuperAdmin,
    canManage, 
    canView, 
    canManageUsers,
    canViewAnalytics,
    canManageSystem 
  } = useRolePermissions();
  
  const { metrics, isLoading: metricsLoading } = useDashboardData();
  const { activities, isLoading: activitiesLoading } = useActivityFeed({
    limit: 10,
    filters: { privacy_levels: ['public', 'team'] }
  });
  const { logActivity } = useActivityLogger();

  // Log dashboard view
  React.useEffect(() => {
    if (user) {
      logActivity('dashboard_viewed', 'dashboard', 'main', {
        userRole: userProfile?.user_roles?.[0]?.role || 'user',
        timestamp: new Date().toISOString()
      });
    }
  }, [user, logActivity, userProfile]);

  if (metricsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const roleBasedMetrics = [
    {
      title: t('dashboard.metrics.total_challenges'),
      value: metrics.totalChallenges?.toString() || '0',
      change: '+12%',
      icon: Target,
      description: t('dashboard.metrics.this_month'),
      visible: canView
    },
    {
      title: t('dashboard.metrics.active_users'),
      value: metrics.activeUsers?.toString() || '0',
      change: '+8%',
      icon: Users,
      description: t('dashboard.metrics.this_month'),
      visible: canViewAnalytics
    },
    {
      title: t('dashboard.metrics.new_submissions'),
      value: metrics.totalSubmissions?.toString() || '0',
      change: '+23%',
      icon: Lightbulb,
      description: t('dashboard.metrics.this_month'),
      visible: canView
    },
    {
      title: t('dashboard.metrics.system_health'),
      value: '98%',
      change: '+2%',
      icon: Shield,
      description: t('dashboard.metrics.uptime'),
      visible: canManageSystem
    }
  ].filter(metric => metric.visible);

  const quickActions = [
    { 
      label: t('dashboard.cards.quick_actions.new_challenge'), 
      icon: Target, 
      href: '/challenges/create',
      visible: canManage,
      color: 'bg-primary'
    },
    { 
      label: t('dashboard.cards.quick_actions.view_analytics'), 
      icon: BarChart3, 
      href: '/analytics',
      visible: canViewAnalytics,
      color: 'bg-blue-500'
    },
    { 
      label: t('dashboard.cards.quick_actions.invite_users'), 
      icon: Users, 
      href: '/users/invite',
      visible: canManageUsers,
      color: 'bg-green-500'
    },
    { 
      label: 'System Monitor', 
      icon: Database, 
      href: '/admin/system',
      visible: isSuperAdmin,
      color: 'bg-orange-500'
    },
    { 
      label: 'Security Center', 
      icon: Shield, 
      href: '/admin/security',
      visible: isAdmin,
      color: 'bg-red-500'
    }
  ].filter(action => action.visible);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Enhanced Header with Role Badge */}
      <DashboardHero 
        userProfile={userProfile}
        stats={{
          totalIdeas: metrics.totalSubmissions || 0,
          activeChallenges: metrics.activeChallenges || 0,
          totalPoints: 1250,
          innovationScore: 85
        }}
        onNavigate={(path) => window.location.href = path}
        userRole={userProfile?.user_roles?.[0]?.role}
        rolePermissions={{
          canCreateIdeas: canManage,
          canJoinChallenges: canView,
          canViewAnalytics: canViewAnalytics,
          canManageUsers: canManageUsers,
          canManageSystem: canManageSystem,
          canAccessAdminPanel: isAdmin,
          canModerateCommunity: canManage,
          allowedSections: []
        }}
      />

      {/* Role-Based Metrics Grid */}
      <DashboardMetrics 
        metrics={roleBasedMetrics}
        isLoading={metricsLoading}
      />

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{t('dashboard.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="activity">{t('activity.feed.title')}</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <DashboardQuickActions 
              actions={quickActions}
              onActionClick={(href) => {
                logActivity('quick_action_clicked', 'dashboard', 'action', { href });
                window.location.href = href;
              }}
            />

            {/* Recent Activity Preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t('activity.feed.recent')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed 
                  activities={activities.slice(0, 5)} 
                  isLoading={activitiesLoading}
                  showViewAll={true}
                  onViewAll={() => window.location.href = '/activity'}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('activity.feed.title')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('activity.feed.description')}
              </p>
            </CardHeader>
            <CardContent>
              <ActivityFeed 
                activities={activities} 
                isLoading={activitiesLoading}
                showFilters={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No challenges yet. Create your first challenge to get started.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No submissions yet. Participate in challenges to make your first submission.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Database className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Database</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Healthy</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">98% Available</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Security</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Monitoring</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isSuperAdmin && (
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <Shield className="h-5 w-5" />
                      Security Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Threat Level</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">Low</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed Logins</span>
                        <Badge variant="outline">0</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Sessions</span>
                        <Badge variant="outline">{metrics.activeUsers || 0}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Zap className="h-5 w-5" />
                    Quick Admin
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                  {isSuperAdmin && (
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Access Control
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserDashboard;
