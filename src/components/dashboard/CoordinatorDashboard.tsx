import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Briefcase, 
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Settings,
  Activity,
  Zap
} from 'lucide-react';

interface CoordinatorDashboardProps {
  userProfile: any;
  canCoordinateExperts: boolean;
  canManageEvents: boolean;
  canViewAnalytics: boolean;
}

export function CoordinatorDashboard({ userProfile, canCoordinateExperts, canManageEvents, canViewAnalytics }: CoordinatorDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();

  const coordinatorStats = [
    {
      title: language === 'ar' ? 'الخبراء المنسقون' : 'Coordinated Experts',
      value: '28',
      change: '+4',
      changeText: language === 'ar' ? 'هذا الشهر' : 'this month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: language === 'ar' ? 'الفعاليات النشطة' : 'Active Events',
      value: '7',
      change: '+2',
      changeText: language === 'ar' ? 'قادمة' : 'upcoming',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: language === 'ar' ? 'الحملات الجارية' : 'Running Campaigns',
      value: '3',
      change: '100%',
      changeText: language === 'ar' ? 'نشطة' : 'active',
      icon: Briefcase,
      color: 'text-purple-600'
    },
    {
      title: language === 'ar' ? 'معدل المشاركة' : 'Engagement Rate',
      value: '89%',
      change: '+7%',
      changeText: language === 'ar' ? 'تحسن' : 'improvement',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const coordinatorActions = [
    {
      title: language === 'ar' ? 'تنسيق الخبراء' : 'Expert Coordination',
      description: language === 'ar' ? 'تنسيق وإدارة تعيينات الخبراء' : 'Coordinate and manage expert assignments',
      icon: Users,
      action: () => navigate('/admin/expert-assignments'),
      show: canCoordinateExperts
    },
    {
      title: language === 'ar' ? 'إدارة الفعاليات' : 'Event Management',
      description: language === 'ar' ? 'تنظيم وإدارة الفعاليات والمؤتمرات' : 'Organize and manage events and conferences',
      icon: Calendar,
      action: () => navigate('/admin/events'),
      show: canManageEvents
    },
    {
      title: language === 'ar' ? 'إدارة الحملات' : 'Campaign Management',
      description: language === 'ar' ? 'إنشاء وإدارة حملات الابتكار' : 'Create and manage innovation campaigns',
      icon: Briefcase,
      action: () => navigate('/admin/campaigns'),
      show: true
    },
    {
      title: language === 'ar' ? 'التواصل' : 'Communications',
      description: language === 'ar' ? 'إدارة التواصل مع أصحاب المصلحة' : 'Manage stakeholder communications',
      icon: MessageSquare,
      action: () => navigate('/communications'),
      show: true
    },
    {
      title: language === 'ar' ? 'تقارير التنسيق' : 'Coordination Reports',
      description: language === 'ar' ? 'عرض تقارير أداء التنسيق' : 'View coordination performance reports',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      show: canViewAnalytics
    },
    {
      title: language === 'ar' ? 'أصحاب المصلحة' : 'Stakeholder Management',
      description: language === 'ar' ? 'إدارة علاقات أصحاب المصلحة' : 'Manage stakeholder relationships',
      icon: Settings,
      action: () => navigate('/admin/stakeholders'),
      show: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Coordinator Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coordinatorStats.map((stat) => {
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

      {/* Coordinator Tabs */}
      <Tabs defaultValue="coordination" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-muted rounded-lg p-1">
          <TabsTrigger 
            value="coordination" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Activity className="w-4 h-4" />
            {language === 'ar' ? 'التنسيق' : 'Coordination'}
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Calendar className="w-4 h-4" />
            {language === 'ar' ? 'الفعاليات' : 'Events'}
          </TabsTrigger>
          <TabsTrigger 
            value="campaigns" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Zap className="w-4 h-4" />
            {language === 'ar' ? 'الحملات' : 'Campaigns'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coordination" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coordinatorActions.filter(action => action.show).map((action, index) => (
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

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إدارة الفعاليات' : 'Event Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدوات تنظيم الفعاليات والمؤتمرات ستكون متاحة هنا.'
                  : 'Event and conference organization tools will be available here.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إدارة الحملات' : 'Campaign Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدوات إنشاء وإدارة حملات الابتكار ستكون متاحة هنا.'
                  : 'Innovation campaign creation and management tools will be available here.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}