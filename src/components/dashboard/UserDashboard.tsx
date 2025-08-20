
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { useDashboardData, type DashboardUserProfile } from '@/hooks/useDashboardData';
import { DashboardHero } from './DashboardHero';
import { DashboardMetrics } from './DashboardMetrics';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  Plus,
  Search,
  Filter,
  Settings,
  Shield,
  Database,
  FileText,
  Calendar,
  MessageSquare,
  Bell
} from 'lucide-react';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { t } = useUnifiedTranslation();
  const { 
    hasPermission, 
    userRole, 
    canCreateChallenges,
    canManageUsers,
    canAccessAdminPanel,
    canViewSystemMetrics
  } = useRoleBasedAccess();
  const { logActivity } = useActivityLogger();
  const { metrics, isLoading: metricsLoading } = useDashboardData();
  
  const { 
    activities, 
    isLoading: activitiesLoading, 
    refreshActivities 
  } = useActivityFeed({
    auto_refresh: true,
    refresh_interval: 30000
  });

  const [activeTab, setActiveTab] = useState('overview');

  // Log dashboard view activity
  React.useEffect(() => {
    if (user) {
      logActivity({
        action_type: 'user_login',
        entity_type: 'system',
        entity_id: 'dashboard',
        metadata: { dashboard_view: activeTab },
        privacy_level: 'private'
      });
    }
  }, [user, activeTab, logActivity]);

  // Dashboard navigation handler
  const handleNavigate = (path: string) => {
    logActivity({
      action_type: 'user_login',
      entity_type: 'system',
      entity_id: 'navigation',
      metadata: { target_path: path },
      privacy_level: 'private'
    });
    navigate(path);
  };

  // Quick actions based on user permissions
  const quickActions = [
    ...(canCreateChallenges ? [{
      label: t('dashboard.cards.quick_actions.new_challenge'),
      icon: Plus,
      href: '/challenges/create',
      visible: true,
      color: 'bg-blue-500'
    }] : []),
    {
      label: 'Submit Idea',
      icon: FileText,
      href: '/ideas/submit',
      visible: true,
      color: 'bg-green-500'
    },
    {
      label: 'Join Event',
      icon: Calendar,
      href: '/events',
      visible: true,
      color: 'bg-purple-500'
    },
    ...(canAccessAdminPanel ? [{
      label: 'Admin Panel',
      icon: Shield,
      href: '/admin',
      visible: true,
      color: 'bg-red-500'
    }] : []),
    ...(canViewSystemMetrics ? [{
      label: 'System Metrics',
      icon: BarChart3,
      href: '/admin/analytics',
      visible: true,
      color: 'bg-indigo-500'
    }] : [])
  ].filter(action => action.visible);

  // Dashboard metrics based on user role
  const dashboardMetrics = [
    {
      title: t('dashboard.metrics.total_challenges'),
      value: metrics.totalChallenges.toString(),
      change: '+12%',
      icon: FileText,
      description: t('dashboard.metrics.this_month'),
      visible: true
    },
    {
      title: t('dashboard.metrics.active_challenges'),
      value: metrics.activeChallenges.toString(),
      change: '+8%',
      icon: Activity,
      description: t('dashboard.metrics.this_month'),
      visible: true
    },
    {
      title: 'My Submissions',
      value: '5',
      change: '+2',
      icon: TrendingUp,
      description: 'This month',
      visible: true
    },
    {
      title: t('dashboard.metrics.total_users'),
      value: metrics.totalUsers.toString(),
      change: '+15%',
      icon: Users,
      description: t('dashboard.metrics.this_month'),
      visible: canViewSystemMetrics
    }
  ].filter(metric => metric.visible);

  // Dashboard stats for hero section
  const dashboardStats = {
    totalIdeas: 45,
    activeChallenges: metrics.activeChallenges,
    totalPoints: 1250,
    innovationScore: 87
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access the dashboard</h2>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Hero Section */}
        <DashboardHero
          userProfile={userProfile as DashboardUserProfile}
          stats={dashboardStats}
          onNavigate={handleNavigate}
          userRole={userRole}
          rolePermissions={{
            canCreateIdeas: true,
            canJoinChallenges: true,
            canViewAnalytics: canViewSystemMetrics,
            canManageUsers: canManageUsers,
            canManageSystem: canAccessAdminPanel,
            canAccessAdminPanel: canAccessAdminPanel,
            canModerateCommunity: hasPermission(['admin', 'super_admin']),
            allowedSections: ['overview', 'challenges', 'ideas']
          }}
        />

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t('dashboard.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="management">{t('dashboard.tabs.management')}</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            {(canAccessAdminPanel || canViewSystemMetrics) && (
              <TabsTrigger value="system">{t('dashboard.tabs.system')}</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Metrics */}
              <div className="lg:col-span-2">
                <DashboardMetrics 
                  metrics={dashboardMetrics}
                  isLoading={metricsLoading}
                />
              </div>

              {/* Quick Actions */}
              <div>
                <DashboardQuickActions
                  actions={quickActions}
                  onActionClick={handleNavigate}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardRecentActivity
                activities={activities}
                isLoading={activitiesLoading}
                onViewAll={() => setActiveTab('activity')}
              />

              {/* Additional Dashboard Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">New challenge published</p>
                        <p className="text-sm text-muted-foreground">Innovation Challenge 2024</p>
                      </div>
                      <Badge variant="secondary">New</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">Idea evaluation completed</p>
                        <p className="text-sm text-muted-foreground">Smart City Solutions</p>
                      </div>
                      <Badge variant="outline">Reviewed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {canCreateChallenges && (
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleNavigate('/challenges')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Challenge Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Create and manage innovation challenges</p>
                  </CardContent>
                </Card>
              )}

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleNavigate('/ideas')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Ideas & Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">View and manage idea submissions</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleNavigate('/events')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Events Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Organize and participate in events</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed
                  className="max-h-[600px] overflow-y-auto"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab - Admin Only */}
          {(canAccessAdminPanel || canViewSystemMetrics) && (
            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {canViewSystemMetrics && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          {t('dashboard.system_analytics.title')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{t('dashboard.system_analytics.description')}</p>
                        <Button className="mt-4" onClick={() => handleNavigate('/admin/analytics')}>
                          View Analytics
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5" />
                          {t('dashboard.system_health.title')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('dashboard.system_health.database_status')}</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">Healthy</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('dashboard.system_health.active_sessions')}</span>
                            <span className="font-medium">24</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {canManageUsers && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Manage user accounts and permissions</p>
                      <Button className="mt-4" onClick={() => handleNavigate('/admin/users')}>
                        Manage Users
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
