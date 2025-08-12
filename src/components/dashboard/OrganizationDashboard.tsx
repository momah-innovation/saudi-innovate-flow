import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Users, 
  Shield, 
  Settings,
  TrendingUp,
  ArrowRight,
  UserCheck,
  BarChart3,
  Activity,
  Briefcase
} from 'lucide-react';

interface OrganizationDashboardProps {
  userProfile: any;
  canManageOrganization: boolean;
  canManageEntities: boolean;
  canViewOrgAnalytics: boolean;
}

export function OrganizationDashboard({ userProfile, canManageOrganization, canManageEntities, canViewOrgAnalytics }: OrganizationDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();

  const orgStats = [
    {
      title: language === 'ar' ? 'أعضاء المنظمة' : 'Organization Members',
      value: '245',
      change: '+18',
      changeText: language === 'ar' ? 'هذا الشهر' : 'this month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: language === 'ar' ? 'الكيانات المدارة' : 'Managed Entities',
      value: '12',
      change: '+2',
      changeText: language === 'ar' ? 'جديدة' : 'new',
      icon: Building,
      color: 'text-green-600'
    },
    {
      title: language === 'ar' ? 'الأدوار النشطة' : 'Active Roles',
      value: '8',
      change: '100%',
      changeText: language === 'ar' ? 'مفعلة' : 'activated',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      title: language === 'ar' ? 'كفاءة العمليات' : 'Operational Efficiency',
      value: '92%',
      change: '+5%',
      changeText: language === 'ar' ? 'تحسن' : 'improvement',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const orgActions = [
    {
      title: language === 'ar' ? 'إدارة المنظمة' : 'Organization Management',
      description: language === 'ar' ? 'إدارة هيكل المنظمة والعضوية' : 'Manage organization structure and membership',
      icon: Building,
      action: () => navigate('/admin/organizational-structure'),
      show: canManageOrganization
    },
    {
      title: language === 'ar' ? 'إدارة الكيانات' : 'Entity Management',
      description: language === 'ar' ? 'إدارة الكيانات التابعة والفروع' : 'Manage subsidiary entities and branches',
      icon: Briefcase,
      action: () => navigate('/admin/entities'),
      show: canManageEntities
    },
    {
      title: language === 'ar' ? 'إدارة الأعضاء' : 'Member Management',
      description: language === 'ar' ? 'إدارة أعضاء المنظمة والصلاحيات' : 'Manage organization members and permissions',
      icon: UserCheck,
      action: () => navigate('/organization/members'),
      show: canManageOrganization
    },
    {
      title: language === 'ar' ? 'الهيكل التنظيمي' : 'Organizational Structure',
      description: language === 'ar' ? 'تصميم وتحديث الهيكل التنظيمي' : 'Design and update organizational structure',
      icon: BarChart3,
      action: () => navigate('/admin/organizational-structure'),
      show: canManageOrganization
    },
    {
      title: language === 'ar' ? 'تقارير المنظمة' : 'Organization Reports',
      description: language === 'ar' ? 'عرض تقارير أداء المنظمة' : 'View organization performance reports',
      icon: BarChart3,
      action: () => navigate('/analytics/organization'),
      show: canViewOrgAnalytics
    },
    {
      title: language === 'ar' ? 'إعدادات المنظمة' : 'Organization Settings',
      description: language === 'ar' ? 'تكوين إعدادات المنظمة العامة' : 'Configure general organization settings',
      icon: Settings,
      action: () => navigate('/organization/settings'),
      show: canManageOrganization
    }
  ];

  return (
    <div className="space-y-6">
      {/* Organization Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orgStats.map((stat) => {
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

      {/* Organization Tabs */}
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
            value="entities" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Building className="w-4 h-4" />
            {language === 'ar' ? 'الكيانات' : 'Entities'}
          </TabsTrigger>
          <TabsTrigger 
            value="members" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Users className="w-4 h-4" />
            {language === 'ar' ? 'الأعضاء' : 'Members'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgActions.filter(action => action.show).map((action, index) => (
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

        <TabsContent value="entities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إدارة الكيانات' : 'Entity Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدوات إدارة الكيانات التابعة والفروع ستكون متاحة هنا.'
                  : 'Subsidiary entity and branch management tools will be available here.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إدارة الأعضاء' : 'Member Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدوات إدارة أعضاء المنظمة والصلاحيات ستكون متاحة هنا.'
                  : 'Organization member and permissions management tools will be available here.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}