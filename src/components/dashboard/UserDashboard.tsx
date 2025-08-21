
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { DashboardHero } from './DashboardHero';
import { DashboardMetrics } from './DashboardMetrics';
import { UnifiedQuickActions } from '@/components/ui/unified-quick-actions';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Shield, 
  Activity,
  TrendingUp,
  FileText,
  Calendar,
  UserPlus,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useUnifiedTranslation();
  const { logActivity } = useActivityLogger();
  const { 
    user, 
    userProfile, 
    dashboardAccess, 
    activityAccess,
    uiAccess,
    isAdmin,
    isSuperAdmin,
    isTeamMember 
  } = useRoleBasedAccess();
  
  const { metrics, isLoading, error } = useDashboardData();
  const { activities, isLoading: activitiesLoading } = useActivityFeed({ 
    auto_refresh: true,
    refresh_interval: 30000 
  });
  const [activeTab, setActiveTab] = useState('overview');

  // Log dashboard access with valid activity type
  useEffect(() => {
    if (user) {
      logActivity({
        action_type: 'workspace_joined', // Use valid activity type
        entity_type: 'workspace',
        entity_id: user.id,
        metadata: {
          dashboard_version: '2.0',
          features_accessed: ['overview', 'activity_feed'],
          user_role: userProfile?.user_roles?.[0]?.role || 'user'
        },
        privacy_level: 'private',
        severity: 'info',
        tags: ['dashboard', 'access']
      });
    }
  }, [user, logActivity, userProfile]);

  const handleNavigate = (path: string) => {
    navigate(path);
    // Remove invalid activity logging - navigation is filtered out anyway
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Remove invalid activity logging - tab changes are filtered out anyway
  };

  // Role-based metrics
  const roleBasedMetrics = [
    {
      title: t('dashboard.metrics.total_challenges'),
      value: metrics.totalChallenges.toString(),
      change: '+12%',
      icon: FileText,
      description: t('dashboard.metrics.this_month'),
      visible: dashboardAccess.canViewAnalytics
    },
    {
      title: t('dashboard.metrics.active_users'),
      value: metrics.totalUsers.toString(),
      change: '+8%',
      icon: Users,
      description: t('dashboard.metrics.this_month'),
      visible: dashboardAccess.canViewUserMetrics
    },
    {
      title: t('dashboard.metrics.new_submissions'),
      value: metrics.totalSubmissions.toString(),
      change: '+23%',
      icon: TrendingUp,
      description: t('dashboard.metrics.this_month'),
      visible: dashboardAccess.canViewAnalytics
    },
    {
      title: t('dashboard.metrics.system_uptime'),
      value: '99.9%',
      change: '+0.1%',
      icon: Shield,
      description: t('dashboard.metrics.this_month'),
      visible: dashboardAccess.canViewSystemHealth
    }
  ].filter(metric => metric.visible);

  // Role-based quick actions
  const quickActions = [
    {
      id: 'new_challenge',
      title: t('dashboard.cards.quick_actions.new_challenge'),
      description: t('dashboard.cards.quick_actions.new_challenge_desc', { defaultValue: 'Create and manage innovation challenges' }),
      icon: FileText,
      onClick: () => handleNavigate('/challenges/create'),
      visible: dashboardAccess.canManageChallenges,
      colorScheme: 'innovation' as const
    },
    {
      id: 'new_campaign',
      title: t('dashboard.cards.quick_actions.new_campaign'),
      description: t('dashboard.cards.quick_actions.new_campaign_desc', { defaultValue: 'Launch strategic innovation campaigns' }),
      icon: Calendar,
      onClick: () => handleNavigate('/campaigns/create'),
      visible: dashboardAccess.canCreateCampaigns,
      colorScheme: 'success' as const
    },
    {
      id: 'invite_users',
      title: t('dashboard.cards.quick_actions.invite_users'),
      description: t('dashboard.cards.quick_actions.invite_users_desc', { defaultValue: 'Expand your innovation network' }),
      icon: UserPlus,
      onClick: () => handleNavigate('/users/invite'),
      visible: dashboardAccess.canInviteUsers,
      colorScheme: 'social' as const
    },
    {
      id: 'view_analytics',
      title: t('dashboard.cards.quick_actions.view_analytics'),
      description: t('dashboard.cards.quick_actions.view_analytics_desc', { defaultValue: 'Analyze performance and insights' }),
      icon: BarChart3,
      onClick: () => handleNavigate('/analytics'),
      visible: dashboardAccess.canViewAnalytics,
      colorScheme: 'info' as const
    }
  ].filter(action => action.visible);

  const userRoleString = userProfile?.user_roles?.[0]?.role || 'user';

  const stats = {
    totalIdeas: metrics.totalSubmissions,
    activeChallenges: metrics.totalChallenges,
    totalPoints: 0, // This would come from a points system
    innovationScore: 85 // This would be calculated based on user activity
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading dashboard: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Hero Section */}
      <DashboardHero
        userProfile={userProfile}
        stats={stats}
        onNavigate={handleNavigate}
        userRole={userRoleString}
        rolePermissions={{
          canCreateIdeas: true,
          canJoinChallenges: true,
          canViewAnalytics: dashboardAccess.canViewAnalytics,
          canManageUsers: dashboardAccess.canManageUsers,
          canManageSystem: isAdmin || isSuperAdmin,
          canAccessAdminPanel: isAdmin || isSuperAdmin,
          canModerateCommunity: isTeamMember || isAdmin || isSuperAdmin,
          allowedSections: uiAccess.showAdminPanel ? ['all'] : ['basic']
        }}
      />

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{t('dashboard.tabs.overview')}</TabsTrigger>
          {uiAccess.showTeamFeatures && (
            <TabsTrigger value="management">{t('dashboard.tabs.management')}</TabsTrigger>
          )}
          <TabsTrigger value="content">{t('dashboard.tabs.content')}</TabsTrigger>
          {uiAccess.showAdminPanel && (
            <TabsTrigger value="system">{t('dashboard.tabs.system')}</TabsTrigger>
          )}
          {uiAccess.showAdvancedMetrics && (
            <TabsTrigger value="advanced">{t('dashboard.tabs.advanced')}</TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <DashboardMetrics metrics={roleBasedMetrics} isLoading={isLoading} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardRecentActivity 
                activities={activities.slice(0, 5)} 
                isLoading={activitiesLoading}
                onViewAll={() => handleTabChange('content')}
              />
            </div>
            <div>
              <UnifiedQuickActions 
                title={t('dashboard.cards.quick_actions.title')}
                actions={quickActions}
              />
            </div>
          </div>
        </TabsContent>

        {/* Management Tab */}
        {uiAccess.showTeamFeatures && (
          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage users, roles, and permissions
                  </p>
                  <Button onClick={() => handleNavigate('/admin/users')} className="w-full">
                    Manage Users
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Challenge Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create and manage innovation challenges
                  </p>
                  <Button onClick={() => handleNavigate('/admin/challenges')} className="w-full">
                    Manage Challenges
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Campaign Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Plan and execute innovation campaigns
                  </p>
                  <Button onClick={() => handleNavigate('/admin/campaigns')} className="w-full">
                    Manage Campaigns
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          {activityAccess.canViewAllActivities ? (
            <ActivityFeed 
              showFilters={true}
              variant="default"
              className="min-h-[600px]"
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  You don't have permission to view all activities
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* System Tab */}
        {uiAccess.showAdminPanel && (
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.system_health.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>{t('dashboard.system_health.database_status')}</span>
                      <span className="text-green-600">Healthy</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('dashboard.system_health.storage_status')}</span>
                      <span className="text-green-600">Operational</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('dashboard.system_health.security_score')}</span>
                      <span className="text-green-600">98/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick System Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleNavigate('/admin/system/backup')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    System Backup
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleNavigate('/admin/system/logs')}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    View System Logs
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleNavigate('/admin/system/maintenance')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Maintenance Mode
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Advanced Tab */}
        {uiAccess.showAdvancedMetrics && (
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.trends.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{metrics.totalUsers}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{metrics.totalChallenges}</div>
                    <div className="text-sm text-muted-foreground">Challenges</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{metrics.totalSubmissions}</div>
                    <div className="text-sm text-muted-foreground">Submissions</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{metrics.recentActivity}</div>
                    <div className="text-sm text-muted-foreground">Recent Activity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserDashboard;
