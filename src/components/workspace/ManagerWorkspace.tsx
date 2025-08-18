import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWorkspaceTranslations } from '@/hooks/useWorkspaceTranslations';
import { useUserWorkspaceData } from '@/hooks/useUserWorkspaceData';
import { useWorkspaceAnalytics } from '@/hooks/useWorkspaceAnalytics';
import { 
  Users, 
  BarChart3, 
  CheckSquare, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Target,
  Clock,
  UserPlus,
  Settings,
  FileText,
  Award,
  Activity
} from 'lucide-react';

interface ManagerWorkspaceProps {
  userId: string;
}

export const ManagerWorkspace: React.FC<ManagerWorkspaceProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { tw, isRTL } = useWorkspaceTranslations({
    workspaceType: 'manager',
    dynamicContent: true,
    fallbackStrategy: 'english'
  });

  const { 
    workspaceData,
    userMetrics,
    isLoading: isDataLoading 
  } = useUserWorkspaceData({
    workspaceType: 'team',
    workspaceId: `manager-${userId}`,
    userId
  });

  const {
    data: analytics,
    isLoading: isAnalyticsLoading
  } = useWorkspaceAnalytics({
    workspaceType: 'team',
    workspaceId: `manager-${userId}`,
    timeRange: '30d'
  });

  const managerStats = {
    totalTeamMembers: userMetrics?.totalTeamMembers || 24,
    activeProjects: userMetrics?.activeProjects || 8,
    completedTasks: userMetrics?.completedTasks || 156,
    pendingTasks: userMetrics?.pendingTasks || 23,
    teamPerformance: userMetrics?.teamPerformance || 87,
    resourceUtilization: userMetrics?.resourceUtilization || 78
  };

  const teamMembers = [
    {
      id: 1,
      name: 'أحمد الزهراني',
      role: tw('roles.senior_developer'),
      avatar: '',
      performance: 92,
      tasksCompleted: 28,
      currentTask: tw('tasks.ai_integration_module'),
      status: 'active'
    },
    {
      id: 2,
      name: 'سارة المطيري',
      role: tw('roles.ui_ux_designer'),
      avatar: '',
      performance: 88,
      tasksCompleted: 21,
      currentTask: tw('tasks.user_interface_redesign'),
      status: 'active'
    },
    {
      id: 3,
      name: 'محمد العتيبي',
      role: tw('roles.project_coordinator'),
      avatar: '',
      performance: 85,
      tasksCompleted: 19,
      currentTask: tw('tasks.milestone_planning'),
      status: 'on_leave'
    },
    {
      id: 4,
      name: 'فاطمة الشهري',
      role: tw('roles.quality_analyst'),
      avatar: '',
      performance: 94,
      tasksCompleted: 32,
      currentTask: tw('tasks.quality_assessment'),
      status: 'active'
    }
  ];

  const activeProjects = [
    {
      id: 1,
      name: tw('projects.digital_transformation_initiative'),
      progress: 75,
      dueDate: '2024-02-15',
      priority: 'high',
      teamSize: 8,
      budget: 450000,
      status: 'on_track',
      milestonesCompleted: 6,
      totalMilestones: 8
    },
    {
      id: 2,
      name: tw('projects.customer_portal_enhancement'),
      progress: 60,
      dueDate: '2024-03-01',
      priority: 'medium',
      teamSize: 5,
      budget: 200000,
      status: 'at_risk',
      milestonesCompleted: 3,
      totalMilestones: 6
    },
    {
      id: 3,
      name: tw('projects.mobile_app_development'),
      progress: 40,
      dueDate: '2024-04-10',
      priority: 'medium',
      teamSize: 6,
      budget: 320000,
      status: 'on_track',
      milestonesCompleted: 2,
      totalMilestones: 7
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      title: tw('tasks.code_review_approval'),
      assignee: 'أحمد الزهراني',
      priority: 'high',
      dueDate: 'اليوم',
      project: tw('projects.digital_transformation_initiative'),
      status: 'pending_approval'
    },
    {
      id: 2,
      title: tw('tasks.resource_allocation_review'),
      assignee: 'محمد العتيبي',
      priority: 'medium',
      dueDate: 'غداً',
      project: tw('projects.customer_portal_enhancement'),
      status: 'in_progress'
    },
    {
      id: 3,
      title: tw('tasks.stakeholder_presentation'),
      assignee: 'سارة المطيري',
      priority: 'high',
      dueDate: 'الخميس',
      project: tw('projects.mobile_app_development'),
      status: 'pending'
    }
  ];

  const resourceAllocation = [
    {
      category: tw('resources.development_team'),
      allocated: 85,
      capacity: 100,
      utilization: 85
    },
    {
      category: tw('resources.design_team'),
      allocated: 70,
      capacity: 80,
      utilization: 87.5
    },
    {
      category: tw('resources.qa_team'),
      allocated: 60,
      capacity: 70,
      utilization: 85.7
    },
    {
      category: tw('resources.project_management'),
      allocated: 45,
      capacity: 50,
      utilization: 90
    }
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: tw('deadlines.phase_two_delivery'),
      project: tw('projects.digital_transformation_initiative'),
      dueDate: '15 فبراير 2024',
      daysLeft: 3,
      priority: 'critical'
    },
    {
      id: 2,
      title: tw('deadlines.user_testing_completion'),
      project: tw('projects.customer_portal_enhancement'),
      dueDate: '22 فبراير 2024',
      daysLeft: 10,
      priority: 'high'
    },
    {
      id: 3,
      title: tw('deadlines.stakeholder_review'),
      project: tw('projects.mobile_app_development'),
      dueDate: '28 فبراير 2024',
      daysLeft: 16,
      priority: 'medium'
    }
  ];

  if (isDataLoading || isAnalyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {tw('header.manager_dashboard')}
          </h1>
          <p className="text-muted-foreground">
            {tw('header.team_project_overview')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            {tw('actions.add_team_member')}
          </Button>
          <Button size="sm">
            <Target className="w-4 h-4 mr-2" />
            {tw('actions.create_project')}
          </Button>
        </div>
      </div>

      {/* Manager Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tw('stats.team_members')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {managerStats.totalTeamMembers}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tw('stats.active_projects')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {managerStats.activeProjects}
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tw('stats.team_performance')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {managerStats.teamPerformance}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tw('stats.pending_tasks')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {managerStats.pendingTasks}
                </p>
              </div>
              <CheckSquare className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">{tw('tabs.team_dashboard')}</TabsTrigger>
          <TabsTrigger value="projects">{tw('tabs.projects')}</TabsTrigger>
          <TabsTrigger value="resources">{tw('tabs.resources')}</TabsTrigger>
          <TabsTrigger value="analytics">{tw('tabs.performance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {tw('dashboard.team_overview')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{member.name}</h4>
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {tw(`status.${member.status}`)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      <p className="text-xs text-muted-foreground">{member.currentTask}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={member.performance} className="h-1 flex-1" />
                        <span className="text-xs text-muted-foreground">{member.performance}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {tw('dashboard.pending_approvals')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' :
                        task.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {tw(`priority.${task.priority}`)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tw('tasks.assigned_to')}: {task.assignee}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tw('tasks.due_date')}: {task.dueDate}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        {tw('actions.review')}
                      </Button>
                      <Button size="sm" className="flex-1">
                        {tw('actions.approve')}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {tw('dashboard.upcoming_deadlines')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={
                        deadline.priority === 'critical' ? 'destructive' :
                        deadline.priority === 'high' ? 'default' : 'secondary'
                      }>
                        {deadline.daysLeft} {tw('deadlines.days_left')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{deadline.dueDate}</span>
                    </div>
                    <h4 className="font-medium text-sm">{deadline.title}</h4>
                    <p className="text-xs text-muted-foreground">{deadline.project}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {tw('projects.active_projects')}
              </CardTitle>
              <CardDescription>{tw('projects.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeProjects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{project.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        project.status === 'on_track' ? 'default' :
                        project.status === 'at_risk' ? 'destructive' : 'secondary'
                      }>
                        {tw(`project_status.${project.status}`)}
                      </Badge>
                      <Badge variant="outline">
                        {tw(`priority.${project.priority}`)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{tw('projects.team_size')}:</span>
                      <p className="font-medium">{project.teamSize} {tw('projects.members')}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{tw('projects.budget')}:</span>
                      <p className="font-medium">{project.budget.toLocaleString()} {tw('projects.sar')}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{tw('projects.due_date')}:</span>
                      <p className="font-medium">{project.dueDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{tw('projects.milestones')}:</span>
                      <p className="font-medium">{project.milestonesCompleted}/{project.totalMilestones}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{tw('projects.progress')}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {tw('actions.view_details')}
                    </Button>
                    <Button size="sm" variant="outline">
                      {tw('actions.manage_team')}
                    </Button>
                    <Button size="sm" variant="outline">
                      {tw('actions.update_status')}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {tw('resources.allocation_overview')}
              </CardTitle>
              <CardDescription>{tw('resources.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resourceAllocation.map((resource, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{resource.category}</span>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{resource.allocated}/{resource.capacity} {tw('resources.capacity')}</span>
                      <span>{resource.utilization.toFixed(1)}% {tw('resources.utilization')}</span>
                    </div>
                  </div>
                  <Progress value={resource.utilization} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{tw('resources.team_workload')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">{managerStats.resourceUtilization}%</p>
                  <p className="text-sm text-muted-foreground">{tw('resources.overall_utilization')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{tw('resources.budget_tracking')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{tw('resources.allocated_budget')}</span>
                    <span>970,000 {tw('projects.sar')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{tw('resources.spent_budget')}</span>
                    <span>650,000 {tw('projects.sar')}</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  <p className="text-xs text-muted-foreground">67% {tw('resources.budget_utilized')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {tw('analytics.team_performance')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{managerStats.teamPerformance}%</p>
                  <p className="text-sm text-muted-foreground">{tw('analytics.overall_performance')}</p>
                </div>
                <Progress value={managerStats.teamPerformance} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h4 className="font-medium">{tw('analytics.completed_tasks')}</h4>
                  <p className="text-2xl font-bold text-primary">{managerStats.completedTasks}</p>
                  <p className="text-sm text-muted-foreground">{tw('analytics.this_month')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h4 className="font-medium">{tw('analytics.project_delivery')}</h4>
                  <p className="text-2xl font-bold text-primary">94%</p>
                  <p className="text-sm text-muted-foreground">{tw('analytics.on_time_delivery')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{tw('analytics.monthly_trends')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{tw('analytics.productivity_trend')}</span>
                      <span className="text-green-600">+12%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{tw('analytics.quality_score')}</span>
                      <span className="text-green-600">+8%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};