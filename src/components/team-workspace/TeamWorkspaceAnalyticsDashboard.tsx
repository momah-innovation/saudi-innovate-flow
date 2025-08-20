import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  Folder, 
  CheckCircle,
  Clock,
  Activity,
  PieChart,
  BarChart3,
  Target,
  Calendar
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';

interface TeamWorkspaceAnalyticsData {
  totalTeams: number;
  activeProjects: number;
  teamMembers: number;
  completedTasks: number;
  monthlyTrends: Array<{
    month: string;
    projects: number;
    tasks: number;
    members: number;
  }>;
  topPerformers: Array<{
    name: string;
    avatar: string;
    tasksCompleted: number;
    projectsLed: number;
    efficiency: number;
  }>;
  projectStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  teamProductivity: Array<{
    team: string;
    productivity: number;
    tasksCompleted: number;
    activeMembers: number;
  }>;
}

interface TeamWorkspaceAnalyticsDashboardProps {
  className?: string;
}

export const TeamWorkspaceAnalyticsDashboard = ({ className }: TeamWorkspaceAnalyticsDashboardProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [data, setData] = useState<TeamWorkspaceAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Simulate data loading - in real app this would come from API
      const analyticsData: TeamWorkspaceAnalyticsData = {
        totalTeams: 8,
        activeProjects: 15,
        teamMembers: 42,
        completedTasks: 156,
        monthlyTrends: [
          { month: 'Jan', projects: 8, tasks: 95, members: 35 },
          { month: 'Feb', projects: 10, tasks: 110, members: 38 },
          { month: 'Mar', projects: 12, tasks: 125, members: 40 },
          { month: 'Apr', projects: 14, tasks: 140, members: 41 },
          { month: 'May', projects: 15, tasks: 156, members: 42 },
          { month: 'Jun', projects: 16, tasks: 165, members: 44 }
        ],
        topPerformers: [
          {
            name: t('team:analytics.sample_members.ahmed'),
            avatar: '/avatars/male-professional-1.jpg',
            tasksCompleted: 24,
            projectsLed: 3,
            efficiency: 95
          },
          {
            name: t('team:analytics.sample_members.fatima'),
            avatar: '/avatars/female-professional-1.jpg',
            tasksCompleted: 22,
            projectsLed: 2,
            efficiency: 92
          },
          {
            name: t('team:analytics.sample_members.mohammed'),
            avatar: '/avatars/male-professional-2.jpg',
            tasksCompleted: 20,
            projectsLed: 2,
            efficiency: 88
          }
        ],
        projectStatus: [
          { status: t('team:analytics.project_status.active'), count: 9, percentage: 60 },
          { status: t('team:analytics.project_status.completed'), count: 4, percentage: 27 },
          { status: t('team:analytics.project_status.delayed'), count: 2, percentage: 13 }
        ],
        teamProductivity: [
          {
            team: t('team:analytics.team_names.development'),
            productivity: 92,
            tasksCompleted: 48,
            activeMembers: 8
          },
          {
            team: t('team:analytics.team_names.design'),
            productivity: 88,
            tasksCompleted: 36,
            activeMembers: 6
          },
          {
            team: t('team:analytics.team_names.management'),
            productivity: 85,
            tasksCompleted: 28,
            activeMembers: 5
          },
          {
            team: t('team:analytics.team_names.marketing'),
            productivity: 82,
            tasksCompleted: 32,
            activeMembers: 7
          }
        ]
      };

      setData(analyticsData);
    } catch (error) {
      logger.error('Error loading team workspace analytics', { component: 'TeamWorkspaceAnalyticsDashboard', action: 'fetchTeamAnalytics' }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const keyMetrics = [
    {
      title: t('team:analytics.stats.total_teams'),
      value: data.totalTeams,
      change: '+14%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: t('team:analytics.stats.active_projects'),
      value: data.activeProjects,
      change: '+25%',
      trend: 'up',
      icon: Folder,
      color: 'text-green-600'
    },
    {
      title: t('team:analytics.stats.team_members'),
      value: data.teamMembers,
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: t('team:analytics.stats.completed_tasks'),
      value: data.completedTasks,
      change: '+32%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", metric.color)} />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {metric.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {t('team:analytics.stats.from_last_month')}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('team:analytics.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="performance">{t('team:analytics.tabs.performance')}</TabsTrigger>
          <TabsTrigger value="projects">{t('team:analytics.tabs.projects')}</TabsTrigger>
          <TabsTrigger value="teams">{t('team:analytics.tabs.teams')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t('team:analytics.trends.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.monthlyTrends.slice(-3).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{trend.month}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">{t('team:analytics.trends.projects_label')}</span>
                          <span className="font-semibold ml-1">{trend.projects}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">{t('team:analytics.trends.tasks_label')}</span>
                          <span className="font-semibold ml-1">{trend.tasks}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {t('team:analytics.productivity.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('team:analytics.productivity.project_completion')}</span>
                      <span className="font-semibold">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('team:analytics.productivity.team_efficiency')}</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('team:analytics.productivity.member_satisfaction')}</span>
                      <span className="font-semibold">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('team:analytics.top_performers.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={performer.avatar} />
                        <AvatarFallback>{performer.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{performer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {performer.tasksCompleted} {t('team:analytics.top_performers.tasks_completed')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{performer.efficiency}%</div>
                      <div className="text-sm text-muted-foreground">
                        {performer.projectsLed} {t('team:analytics.top_performers.projects')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                {t('team:analytics.project_status.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.projectStatus.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4 h-4 rounded-full",
                        status.status.includes('نشط') || status.status.includes('Active') ? 'bg-green-500' :
                        status.status.includes('مكتمل') || status.status.includes('Completed') ? 'bg-blue-500' :
                        'bg-red-500'
                      )} />
                      <span className="font-medium">{status.status}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{status.count}</div>
                        <div className="text-sm text-muted-foreground">{status.percentage}%</div>
                      </div>
                      <div className="w-20">
                        <Progress value={status.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t('team:analytics.team_productivity.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.teamProductivity.map((team, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">{team.team}</span>
                      <Badge variant="outline">{team.activeMembers} {t('team:analytics.team_productivity.members')}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('team:analytics.team_productivity.productivity')}</span>
                        <span className="font-semibold">{team.productivity}%</span>
                      </div>
                      <Progress value={team.productivity} className="h-2" />
                      
                      <div className="text-sm text-muted-foreground">
                        {team.tasksCompleted} {t('team:analytics.team_productivity.tasks_completed')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
