
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
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
  Lightbulb
} from 'lucide-react';

const UserDashboard = () => {
  const { user, userProfile } = useAuth();
  const { t } = useUnifiedTranslation();
  const { isAdmin, canManage, canView } = useRolePermissions();

  const metrics = [
    {
      title: t('dashboard.metrics.total_challenges'),
      value: '24',
      change: '+12%',
      icon: Target,
      description: t('dashboard.metrics.this_month')
    },
    {
      title: t('dashboard.metrics.active_users'),
      value: '1,284',
      change: '+8%',
      icon: Users,
      description: t('dashboard.metrics.this_month')
    },
    {
      title: t('dashboard.metrics.new_submissions'),
      value: '156',
      change: '+23%',
      icon: Lightbulb,
      description: t('dashboard.metrics.this_month')
    },
    {
      title: t('dashboard.metrics.completion_rate'),
      value: '87%',
      change: '+5%',
      icon: TrendingUp,
      description: t('dashboard.metrics.this_month')
    }
  ];

  const quickActions = [
    { label: t('dashboard.cards.quick_actions.new_challenge'), icon: Target, href: '/challenges/create' },
    { label: t('dashboard.cards.quick_actions.view_analytics'), icon: BarChart3, href: '/analytics' },
    { label: t('dashboard.cards.quick_actions.invite_users'), icon: Users, href: '/users/invite' },
    { label: 'View Activity Feed', icon: Activity, href: '/activity' }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'challenge_created',
      message: 'New challenge "Digital Innovation 2024" was created',
      timestamp: '5 minutes ago',
      user: 'Ahmed Al-Rashid'
    },
    {
      id: '2',
      type: 'submission_received',
      message: 'New submission received for "Smart City Solutions"',
      timestamp: '15 minutes ago',
      user: 'Sara Mohammed'
    },
    {
      id: '3',
      type: 'user_registered',
      message: 'New user joined the platform',
      timestamp: '1 hour ago',
      user: 'Omar Hassan'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t('dashboard.welcome', { name: userProfile?.name || user?.email || 'User' })}
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your innovation dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-green-600">
                  {metric.change}
                </Badge>
                <span>{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="challenges">My Challenges</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.cards.quick_actions.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button key={index} variant="ghost" className="w-full justify-start">
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          by {activity.user} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track all activities across the platform
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Activity feed component will be implemented here
              </div>
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
      </Tabs>
    </div>
  );
};

export default UserDashboard;
