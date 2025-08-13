import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Database, 
  TrendingUp, 
  Shield,
  ArrowRight,
  Activity,
  PieChart,
  LineChart,
  Eye,
  Settings
} from 'lucide-react';

interface AnalystDashboardProps {
  userProfile: any;
  canAccessAnalytics: boolean;
  canViewSystemData: boolean;
  canGenerateReports: boolean;
}

export function AnalystDashboard({ userProfile, canAccessAnalytics, canViewSystemData, canGenerateReports }: AnalystDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();

  const analystStats = [
    {
      title: language === 'ar' ? 'نقاط البيانات' : 'Data Points',
      value: '2.4M',
      change: '+12K',
      changeText: language === 'ar' ? 'يومياً' : 'daily',
      icon: Database,
      color: 'text-info'
    },
    {
      title: language === 'ar' ? 'التقارير المولدة' : 'Reports Generated',
      value: '156',
      change: '+23',
      changeText: language === 'ar' ? 'هذا الشهر' : 'this month',
      icon: BarChart3,
      color: 'text-success'
    },
    {
      title: language === 'ar' ? 'دقة التحليل' : 'Analysis Accuracy',
      value: '97.8%',
      change: '+2.1%',
      changeText: language === 'ar' ? 'تحسن' : 'improvement',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      title: language === 'ar' ? 'أحداث الأمان' : 'Security Events',
      value: '3',
      change: '-7',
      changeText: language === 'ar' ? 'انخفاض' : 'decrease',
      icon: Shield,
      color: 'text-warning'
    }
  ];

  const analystActions = [
    {
      title: language === 'ar' ? 'التحليلات المتقدمة' : 'Advanced Analytics',
      description: language === 'ar' ? 'تحليلات فورية ورؤى المستخدمين' : 'Real-time analytics and user insights',
      icon: BarChart3,
      action: () => navigate('/admin/analytics-advanced'),
      show: canAccessAnalytics
    },
    {
      title: language === 'ar' ? 'تدقيق النظام' : 'System Auditing',
      description: language === 'ar' ? 'مراجعة وتدقيق أمان النظام' : 'System security review and auditing',
      icon: Shield,
      action: () => navigate('/admin/security-advanced'),
      show: canViewSystemData
    },
    {
      title: language === 'ar' ? 'تقارير البيانات' : 'Data Reports',
      description: language === 'ar' ? 'إنشاء تقارير مخصصة وتحليلات' : 'Generate custom reports and analytics',
      icon: PieChart,
      action: () => navigate('/reports'),
      show: canGenerateReports
    },
    {
      title: language === 'ar' ? 'مراقبة الأداء' : 'Performance Monitoring',
      description: language === 'ar' ? 'مراقبة أداء النظام والتطبيقات' : 'Monitor system and application performance',
      icon: LineChart,
      action: () => navigate('/monitoring'),
      show: canViewSystemData
    },
    {
      title: language === 'ar' ? 'تحليل المستخدمين' : 'User Analytics',
      description: language === 'ar' ? 'تحليل سلوك وتفاعل المستخدمين' : 'Analyze user behavior and engagement',
      icon: Eye,
      action: () => navigate('/user-analytics'),
      show: canAccessAnalytics
    },
    {
      title: language === 'ar' ? 'إعدادات التحليل' : 'Analytics Configuration',
      description: language === 'ar' ? 'تكوين أدوات التحليل والمقاييس' : 'Configure analytics tools and metrics',
      icon: Settings,
      action: () => navigate('/analytics/settings'),
      show: canViewSystemData
    }
  ];

  return (
    <div className="space-y-6">
      {/* Analyst Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analystStats.map((stat) => {
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

      {/* Analyst Tabs */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-muted rounded-lg p-1">
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <BarChart3 className="w-4 h-4" />
            {language === 'ar' ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
          <TabsTrigger 
            value="auditing" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Shield className="w-4 h-4" />
            {language === 'ar' ? 'التدقيق' : 'Auditing'}
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <PieChart className="w-4 h-4" />
            {language === 'ar' ? 'التقارير' : 'Reports'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analystActions.filter(action => action.show).map((action, index) => (
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

        <TabsContent value="auditing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'تدقيق النظام' : 'System Auditing'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدوات التدقيق الأمني ومراجعة النظام ستكون متاحة هنا.'
                  : 'Security auditing tools and system review capabilities will be available here.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إنشاء التقارير' : 'Report Generation'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدوات إنشاء التقارير المخصصة والتحليلات ستكون متاحة هنا.'
                  : 'Custom report generation and analytics tools will be available here.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}