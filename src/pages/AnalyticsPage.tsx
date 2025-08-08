import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, TrendingUp, Users, Target, 
  Calendar, DollarSign, Activity, Eye,
  ArrowUp, ArrowDown, Download
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

const createMockAnalytics = (t: any) => ({
  overview: {
    totalUsers: 2847,
    activeProjects: 156,
    completedChallenges: 89,
    revenue: 1250000,
    growthRate: 15.3,
    engagementRate: 78.5
  },
  trends: [
    { month: 'Jan', users: 1200, projects: 45, revenue: 180000 },
    { month: 'Feb', users: 1450, projects: 52, revenue: 210000 },
    { month: 'Mar', users: 1680, projects: 68, revenue: 245000 },
    { month: 'Apr', users: 1920, projects: 71, revenue: 280000 },
    { month: 'May', users: 2150, projects: 89, revenue: 320000 },
    { month: 'Jun', users: 2380, projects: 102, revenue: 385000 },
    { month: 'Jul', users: 2580, projects: 124, revenue: 420000 },
    { month: 'Aug', users: 2847, projects: 156, revenue: 480000 }
  ],
  topChallenges: [
    {
      id: 1,
      title: t('challenge.digital_transformation_gov'),
      title_en: 'Digital Transformation for Organizations',
      participants: 245,
      submissions: 67,
      completion_rate: 87,
      category: t('category.technology'),
      category_en: 'Technology'
    },
    {
      id: 2,
      title: t('challenge.ai_solutions'),
      title_en: 'AI Solutions',
      participants: 189,
      submissions: 43,
      completion_rate: 78,
      category: t('category.ai'),
      category_en: 'Artificial Intelligence'
    },
    {
      id: 3,
      title: t('challenge.environmental_sustainability'),
      title_en: 'Environmental Sustainability',
      participants: 167,
      submissions: 39,
      completion_rate: 91,
      category: t('category.environment'),
      category_en: 'Environment'
    }
  ]
});

const AnalyticsPage = () => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  
  const mockAnalytics = createMockAnalytics(t);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, trendValue, color = 'text-primary' }: any) => (
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
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend === 'up' && <ArrowUp className="h-3 w-3" />}
                {trend === 'down' && <ArrowDown className="h-3 w-3" />}
                {trendValue}
              </div>
            )}
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ChallengeCard = ({ challenge }: { challenge: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {isRTL ? challenge.title : challenge.title_en}
            </CardTitle>
            <Badge variant="outline" className="mt-2">
              {isRTL ? challenge.category : challenge.category_en}
            </Badge>
          </div>
          <Badge className="bg-primary/10 text-primary">
            {challenge.completion_rate}% {t('label.complete')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">{t('label.participants')}:</span>
              <div className="font-medium flex items-center gap-1">
                <Users className="h-4 w-4" />
                {formatNumber(challenge.participants)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">{t('label.submissions')}:</span>
              <div className="font-medium flex items-center gap-1">
                <Target className="h-4 w-4" />
                {formatNumber(challenge.submissions)}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('label.completion_rate')}</span>
              <span>{challenge.completion_rate}%</span>
            </div>
            <Progress value={challenge.completion_rate} className="h-2" />
          </div>

          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            {t('action.view_details')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppShell>
      <PageLayout
        title={t('page.analytics_title')}
        description={t('page.analytics_description')}
        secondaryActions={
          <Button>
            <Download className="h-4 w-4 mr-2" />
            {t('button.export_report')}
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Overview Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              icon={Users}
              title={t('metric.total_users')}
              value={formatNumber(mockAnalytics.overview.totalUsers)}
              trend="up"
              trendValue="+12.5%"
              color="text-blue-500"
            />
            <MetricCard
              icon={Target}
              title={t('metric.active_projects')}
              value={formatNumber(mockAnalytics.overview.activeProjects)}
              trend="up"
              trendValue="+8.2%"
              color="text-green-500"
            />
            <MetricCard
              icon={Activity}
              title={t('metric.completed_challenges')}
              value={formatNumber(mockAnalytics.overview.completedChallenges)}
              trend="up"
              trendValue="+15.3%"
              color="text-purple-500"
            />
            <MetricCard
              icon={DollarSign}
              title={t('metric.revenue')}
              value={formatCurrency(mockAnalytics.overview.revenue)}
              trend="up"
              trendValue="+18.7%"
              color="text-yellow-500"
            />
            <MetricCard
              icon={TrendingUp}
              title={t('metric.growth_rate')}
              value={`${mockAnalytics.overview.growthRate}%`}
              trend="up"
              trendValue="+2.1%"
              color="text-indigo-500"
            />
            <MetricCard
              icon={BarChart3}
              title={t('metric.engagement_rate')}
              value={`${mockAnalytics.overview.engagementRate}%`}
              trend="up"
              trendValue="+5.4%"
              color="text-pink-500"
            />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">{t('tab.overview')}</TabsTrigger>
              <TabsTrigger value="users">{t('tab.users')}</TabsTrigger>
              <TabsTrigger value="projects">{t('tab.projects')}</TabsTrigger>
              <TabsTrigger value="financial">{t('tab.financial')}</TabsTrigger>
              <TabsTrigger value="performance">{t('tab.performance')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'الاتجاهات الشهرية' : 'Monthly Trends'}</CardTitle>
                    <CardDescription>
                      {isRTL ? 'نمو المستخدمين والمشاريع على مدار العام' : 'User and project growth over the year'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnalytics.trends.slice(-4).map((trend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{trend.month}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-blue-600">{formatNumber(trend.users)} {isRTL ? 'مستخدم' : 'users'}</span>
                            <span className="text-green-600">{formatNumber(trend.projects)} {isRTL ? 'مشروع' : 'projects'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'التوزيع الجغرافي' : 'Geographic Distribution'}</CardTitle>
                    <CardDescription>
                      {isRTL ? 'توزيع المستخدمين حسب المنطقة' : 'User distribution by region'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'الرياض' : 'Riyadh'}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={45} className="w-24 h-2" />
                          <span className="text-sm font-medium">45%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'جدة' : 'Jeddah'}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={30} className="w-24 h-2" />
                          <span className="text-sm font-medium">30%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'الدمام' : 'Dammam'}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={15} className="w-24 h-2" />
                          <span className="text-sm font-medium">15%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'أخرى' : 'Others'}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={10} className="w-24 h-2" />
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {isRTL ? 'أفضل التحديات أداءً' : 'Top Performing Challenges'}
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mockAnalytics.topChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'المستخدمين الجدد' : 'New Users'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">+342</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'هذا الشهر' : 'This month'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'المستخدمين النشطين' : 'Active Users'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">2,156</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'آخر 30 يوم' : 'Last 30 days'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'معدل الاحتفاظ' : 'Retention Rate'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">84.2%</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'معدل شهري' : 'Monthly rate'}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'المشاريع الجديدة' : 'New Projects'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">23</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'هذا الشهر' : 'This month'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'معدل الإكمال' : 'Completion Rate'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">78.5%</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'معدل عام' : 'Overall rate'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'المشاريع المعلقة' : 'Pending Projects'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'تتطلب اهتمام' : 'Need attention'}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'الإيرادات الشهرية' : 'Monthly Revenue'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(480000)}</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'أغسطس 2024' : 'August 2024'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'متوسط القيمة' : 'Average Value'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(3200)}</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'لكل مشروع' : 'Per project'}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'النمو السنوي' : 'Annual Growth'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">+24.8%</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'مقارنة بالعام الماضي' : 'vs last year'}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'معدل رضا المستخدمين' : 'User Satisfaction'}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={92} className="w-24 h-2" />
                          <span className="font-medium">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'جودة المشاريع' : 'Project Quality'}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={87} className="w-24 h-2" />
                          <span className="font-medium">87%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'الالتزام بالمواعيد' : 'On-time Delivery'}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={78} className="w-24 h-2" />
                          <span className="font-medium">78%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'معدل الابتكار' : 'Innovation Rate'}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={84} className="w-24 h-2" />
                          <span className="font-medium">84%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'اتجاهات الأداء' : 'Performance Trends'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{isRTL ? 'الأسبوع الماضي' : 'Last Week'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          +5.2%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{isRTL ? 'الشهر الماضي' : 'Last Month'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          +12.8%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{isRTL ? 'الربع الماضي' : 'Last Quarter'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          +18.3%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{isRTL ? 'العام الماضي' : 'Last Year'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          +24.7%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </AppShell>
  );
};

export default AnalyticsPage;