import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationHandler } from '@/utils/unified-navigation';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Target, 
  Search, 
  BookOpen,
  TrendingUp,
  ArrowRight,
  Edit,
  Eye,
  Settings,
  Activity
} from 'lucide-react';

interface ContentDashboardProps {
  userProfile: any;
  canManageContent: boolean;
  canManageChallenges: boolean;
  canResearch: boolean;
}

export function ContentDashboard({ userProfile, canManageContent, canManageChallenges, canResearch }: ContentDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);

  const contentStats = [
    {
      title: language === 'ar' ? 'المحتوى المنشور' : 'Published Content',
      value: '142',
      change: '+12',
      changeText: language === 'ar' ? 'هذا الشهر' : 'this month',
      icon: FileText,
      color: 'text-info'
    },
    {
      title: language === 'ar' ? 'التحديات المدارة' : 'Managed Challenges',
      value: '8',
      change: '+2',
      changeText: language === 'ar' ? 'نشطة' : 'active',
      icon: Target,
      color: 'text-success'
    },
    {
      title: language === 'ar' ? 'البحوث الجارية' : 'Ongoing Research',
      value: '5',
      change: '100%',
      changeText: language === 'ar' ? 'مكتملة' : 'completed',
      icon: Search,
      color: 'text-primary'
    },
    {
      title: language === 'ar' ? 'معدل التفاعل' : 'Engagement Rate',
      value: '87%',
      change: '+4%',
      changeText: language === 'ar' ? 'تحسن' : 'improvement',
      icon: TrendingUp,
      color: 'text-warning'
    }
  ];

  const contentActions = [
    {
      title: language === 'ar' ? 'إدارة المحتوى' : 'Content Management',
      description: language === 'ar' ? 'إنشاء وتحرير وإدارة المحتوى' : 'Create, edit and manage content',
      icon: FileText,
      action: () => navigationHandler.navigateTo('/content/manage'),
      show: canManageContent
    },
    {
      title: language === 'ar' ? 'إدارة التحديات' : 'Challenge Management',
      description: language === 'ar' ? 'إنشاء وإدارة التحديات والمسابقات' : 'Create and manage challenges and competitions',
      icon: Target,
      action: () => navigationHandler.navigateTo('/admin/challenges'),
      show: canManageChallenges
    },
    {
      title: language === 'ar' ? 'قيادة البحوث' : 'Research Leadership',
      description: language === 'ar' ? 'قيادة وتنسيق المشاريع البحثية' : 'Lead and coordinate research projects',
      icon: Search,
      action: () => navigationHandler.navigateTo('/research/projects'),
      show: canResearch
    },
    {
      title: language === 'ar' ? 'مكتبة المحتوى' : 'Content Library',
      description: language === 'ar' ? 'إدارة مكتبة الموارد والوثائق' : 'Manage resource and document library',
      icon: BookOpen,
      action: () => navigationHandler.navigateTo('/library'),
      show: canManageContent
    },
    {
      title: language === 'ar' ? 'تحليل الأداء' : 'Performance Analytics',
      description: language === 'ar' ? 'تحليل أداء المحتوى والتفاعل' : 'Analyze content performance and engagement',
      icon: Eye,
      action: () => navigationHandler.navigateTo('/analytics/content'),
      show: canManageContent
    },
    {
      title: language === 'ar' ? 'إعدادات المحتوى' : 'Content Settings',
      description: language === 'ar' ? 'تكوين إعدادات النشر والمراجعة' : 'Configure publishing and review settings',
      icon: Settings,
      action: () => navigationHandler.navigateTo('/content/settings'),
      show: canManageContent
    }
  ];

  return (
    <div className="space-y-6">
      {/* Content Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentStats.map((stat) => {
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

      {/* Content Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-muted rounded-lg p-1">
          <TabsTrigger 
            value="content" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <FileText className="w-4 h-4" />
            {language === 'ar' ? 'المحتوى' : 'Content'}
          </TabsTrigger>
          <TabsTrigger 
            value="challenges" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Target className="w-4 h-4" />
            {language === 'ar' ? 'التحديات' : 'Challenges'}
          </TabsTrigger>
          <TabsTrigger 
            value="research" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Search className="w-4 h-4" />
            {language === 'ar' ? 'البحوث' : 'Research'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentActions.filter(action => action.show).map((action, index) => (
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

        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إدارة التحديات' : 'Challenge Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدوات إنشاء وإدارة التحديات والمسابقات ستكون متاحة هنا.'
                  : 'Challenge and competition creation and management tools will be available here.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'قيادة البحوث' : 'Research Leadership'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدوات تنسيق وقيادة المشاريع البحثية ستكون متاحة هنا.'
                  : 'Research project coordination and leadership tools will be available here.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}