import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, Users, Target, Calendar, 
  BarChart3, FileText, Star, Bell,
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

const mockMetrics = {
  totalProjects: 48,
  activeProjects: 12,
  completedProjects: 24,
  totalBudget: 2400000,
  spentBudget: 1680000,
  engagementRate: 87,
  stakeholderSatisfaction: 4.2
};

const mockProjects = [
  {
    id: 1,
    title: 'مبادرة التحول الرقمي',
    title_en: 'Digital Transformation Initiative',
    status: 'active',
    progress: 78,
    budget: 500000,
    spent: 390000,
    stakeholders: 15,
    lastUpdate: '2024-07-28',
    priority: 'high'
  },
  {
    id: 2,
    title: 'برنامج التطوير المهني',
    title_en: 'Professional Development Program',
    status: 'planning',
    progress: 25,
    budget: 300000,
    spent: 75000,
    stakeholders: 8,
    lastUpdate: '2024-07-26',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'مشروع الاستدامة البيئية',
    title_en: 'Environmental Sustainability Project',
    status: 'completed',
    progress: 100,
    budget: 450000,
    spent: 425000,
    stakeholders: 12,
    lastUpdate: '2024-07-25',
    priority: 'high'
  }
];

const mockNotifications = [
  {
    id: 1,
    title: 'تحديث حالة المشروع',
    title_en: 'Project Status Update',
    message: 'تم إكمال المرحلة الثانية من مبادرة التحول الرقمي',
    message_en: 'Phase 2 of Digital Transformation Initiative completed',
    type: 'success',
    time: '2024-07-28 10:30'
  },
  {
    id: 2,
    title: 'طلب موافقة على الميزانية',
    title_en: 'Budget Approval Request',
    message: 'يتطلب برنامج التطوير المهني موافقة إضافية على الميزانية',
    message_en: 'Professional Development Program requires additional budget approval',
    type: 'warning',
    time: '2024-07-27 14:20'
  }
];

const StakeholderDashboard = () => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-light text-success border-success-border';
      case 'planning': return 'bg-info-light text-info border-info-border';
      case 'completed': return 'bg-complete-light text-complete border-complete-border';
      case 'on_hold': return 'bg-warning-light text-warning border-warning-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-priority-high-light text-priority-high border-priority-high-border';
      case 'medium': return 'bg-priority-medium-light text-priority-medium border-priority-medium-border';
      case 'low': return 'bg-priority-low-light text-priority-low border-priority-low-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('status.active');
      case 'planning': return t('common:status.planning');
      case 'completed': return t('status.completed');
      case 'on_hold': return t('status.on_hold');
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return t('common:priority.high');
      case 'medium': return t('common:priority.medium');
      case 'low': return t('common:priority.low');
      default: return priority;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, trendValue }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {trend && (
              <div className={`flex items-center gap-1 text-xs ${
                trend === 'up' ? 'text-trend-up' : 
                trend === 'down' ? 'text-trend-down' : 'text-trend-stable'
              }`}>
                {trend === 'up' && <ArrowUp className="h-3 w-3" />}
                {trend === 'down' && <ArrowDown className="h-3 w-3" />}
                {trend === 'neutral' && <Minus className="h-3 w-3" />}
                {trendValue}
              </div>
            )}
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProjectCard = ({ project }: { project: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {isRTL ? project.title : project.title_en}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(project.status)}>
                {getStatusText(project.status)}
              </Badge>
              <Badge className={getPriorityColor(project.priority)}>
                {getPriorityText(project.priority)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('projects.progress')}</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">{t('investments.amount')}:</span>
              <div className="font-medium">{formatCurrency(project.budget)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">{t('common:metrics.spent')}:</span>
              <div className="font-medium">{formatCurrency(project.spent)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">{t('title')}:</span>
              <div className="font-medium">{project.stakeholders}</div>
            </div>
            <div>
              <span className="text-muted-foreground">{t('dashboard.last_updated')}:</span>
              <div className="font-medium">{project.lastUpdate}</div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" size="sm">
              {t('projects.view_details')}
            </Button>
            <Button size="sm">
              {t('common:actions.manage')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppShell>
      <PageLayout
        title={t('title')}
        description={t('overview')}
      >
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Target}
              title={t('projects.all_projects')}
              value={mockMetrics.totalProjects}
              trend="up"
              trendValue="+12%"
            />
            <MetricCard
              icon={TrendingUp}
              title={t('metrics.active_projects')}
              value={mockMetrics.activeProjects}
              trend="up"
              trendValue="+3"
            />
            <MetricCard
              icon={BarChart3}
              title={t('common:metrics.budget_spent')}
              value={formatCurrency(mockMetrics.spentBudget)}
              subtitle={`${t('common:of')} ${formatCurrency(mockMetrics.totalBudget)}`}
              trend="neutral"
              trendValue="70%"
            />
            <MetricCard
              icon={Star}
              title={t('common:satisfaction')}
              value={`${mockMetrics.stakeholderSatisfaction}/5`}
              trend="up"
              trendValue="+0.3"
            />
          </div>

          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">{t('projects.title')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('common:labels.analytics')}</TabsTrigger>
              <TabsTrigger value="reports">{t('reports.title')}</TabsTrigger>
              <TabsTrigger value="notifications">{t('communications.notifications')}</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('reports.performance')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{t('common:metrics.completion_rate')}</span>
                        <span className="font-bold">78%</span>
                      </div>
                      <Progress value={78} />
                      
                      <div className="flex justify-between items-center">
                        <span>{t('common:metrics.budget')}</span>
                        <span className="font-bold">85%</span>
                      </div>
                      <Progress value={85} />
                      
                      <div className="flex justify-between items-center">
                        <span>{t('common:metrics.engagement')}</span>
                        <span className="font-bold">92%</span>
                      </div>
                      <Progress value={92} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('stakeholder:indicators.key_indicators')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{t('stakeholder:indicators.projects_on_time')}</span>
                        <span className="font-medium text-success">9/12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{t('stakeholder:indicators.within_budget')}</span>
                        <span className="font-medium text-success">10/12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{t('stakeholder:indicators.identified_risks')}</span>
                        <span className="font-medium text-warning">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{t('stakeholder:indicators.actions_required')}</span>
                        <span className="font-medium text-destructive">2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t('reports.quarterly')}
                    </CardTitle>
                    <CardDescription>
                      {t('reports.performance')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      {t('reports.download')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {t('reports.financial')}
                    </CardTitle>
                    <CardDescription>
                      {t('investments.current')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      {t('reports.download')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {t('stakeholder:reports.stakeholder_report')}
                    </CardTitle>
                    <CardDescription>
                      {t('stakeholder:reports.stakeholder_report_description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      {t('stakeholder:reports.download')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-3">
                {mockNotifications.map((notification) => (
                  <Card key={notification.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Bell className={`h-5 w-5 mt-0.5 ${
                          notification.type === 'success' ? 'text-success' :
                          notification.type === 'warning' ? 'text-warning' :
                          'text-info'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {isRTL ? notification.title : notification.title_en}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {isRTL ? notification.message : notification.message_en}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </AppShell>
  );
};

export default StakeholderDashboard;
