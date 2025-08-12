import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Target, 
  BarChart3, 
  Calendar, 
  TrendingUp,
  ArrowRight,
  UserCheck,
  Building,
  ClipboardList,
  Activity
} from 'lucide-react';

interface ManagerDashboardProps {
  userProfile: any;
  canManageTeams: boolean;
  canViewAnalytics: boolean;
  canManageProjects: boolean;
}

export function ManagerDashboard({ userProfile, canManageTeams, canViewAnalytics, canManageProjects }: ManagerDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();

  const managerStats = [
    {
      title: language === 'ar' ? 'أعضاء الفريق' : 'Team Members',
      value: '12',
      change: '+2',
      changeText: language === 'ar' ? 'هذا الشهر' : 'this month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: language === 'ar' ? 'المشاريع النشطة' : 'Active Projects',
      value: '5',
      change: '+1',
      changeText: language === 'ar' ? 'مشروع جديد' : 'new project',
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: language === 'ar' ? 'التحديات المكتملة' : 'Challenges Completed',
      value: '18',
      change: '+3',
      changeText: language === 'ar' ? 'هذا الأسبوع' : 'this week',
      icon: ClipboardList,
      color: 'text-purple-600'
    },
    {
      title: language === 'ar' ? 'أداء الفريق' : 'Team Performance',
      value: '94%',
      change: '+5%',
      changeText: language === 'ar' ? 'تحسن' : 'improvement',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const managerActions = [
    {
      title: language === 'ar' ? 'إدارة الفريق' : 'Team Management',
      description: language === 'ar' ? 'إدارة أعضاء الفريق والأدوار' : 'Manage team members and roles',
      icon: Users,
      action: () => navigate('/admin/teams'),
      show: canManageTeams
    },
    {
      title: language === 'ar' ? 'تقارير الأداء' : 'Performance Reports',
      description: language === 'ar' ? 'عرض تقارير أداء الفريق والمشاريع' : 'View team and project performance reports',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      show: canViewAnalytics
    },
    {
      title: language === 'ar' ? 'إدارة المشاريع' : 'Project Management',
      description: language === 'ar' ? 'تتبع وإدارة المشاريع النشطة' : 'Track and manage active projects',
      icon: Target,
      action: () => navigate('/projects'),
      show: canManageProjects
    },
    {
      title: language === 'ar' ? 'جدولة الاجتماعات' : 'Meeting Scheduling',
      description: language === 'ar' ? 'تنظيم اجتماعات الفريق والمراجعات' : 'Schedule team meetings and reviews',
      icon: Calendar,
      action: () => navigate('/meetings'),
      show: true
    },
    {
      title: language === 'ar' ? 'تقييم الأداء' : 'Performance Reviews',
      description: language === 'ar' ? 'إجراء تقييمات دورية للأداء' : 'Conduct periodic performance evaluations',
      icon: UserCheck,
      action: () => navigate('/reviews'),
      show: canManageTeams
    },
    {
      title: language === 'ar' ? 'موارد القطاع' : 'Sector Resources',
      description: language === 'ar' ? 'إدارة موارد ومتطلبات القطاع' : 'Manage sector resources and requirements',
      icon: Building,
      action: () => navigate('/admin/sectors'),
      show: canViewAnalytics
    }
  ];

  return (
    <div className="space-y-6">
      {/* Manager Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {managerStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 transition-colors ${stat.color || 'text-muted-foreground group-hover:text-primary'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color || 'text-foreground'}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} {stat.changeText}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Manager Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-muted rounded-lg p-1">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Activity className="w-4 h-4" />
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger 
            value="team" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Users className="w-4 h-4" />
            {language === 'ar' ? 'الفريق' : 'Team'}
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Target className="w-4 h-4" />
            {language === 'ar' ? 'المشاريع' : 'Projects'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managerActions.filter(action => action.show).map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                  <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mt-2">
                    {action.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={action.action}
                  >
                    <ArrowRight className="w-3 h-3 mr-2" />
                    {language === 'ar' ? 'الوصول للواجهة' : 'Access Interface'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إدارة الفريق' : 'Team Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدوات إدارة أعضاء الفريق وتتبع الأداء ستكون متاحة هنا.'
                  : 'Team member management tools and performance tracking will be available here.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إدارة المشاريع' : 'Project Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدوات تتبع المشاريع وإدارة المهام ستكون متاحة هنا.'
                  : 'Project tracking tools and task management will be available here.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}