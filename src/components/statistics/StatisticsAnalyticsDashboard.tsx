import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useStatisticsAnalytics, StatisticsAnalyticsData } from '@/hooks/useStatisticsAnalytics';

// Interface moved to hook

interface StatisticsAnalyticsDashboardProps {
  className?: string;
}

export const StatisticsAnalyticsDashboard = ({ className }: StatisticsAnalyticsDashboardProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const { loading, data, loadAnalyticsData } = useStatisticsAnalytics();

  useEffect(() => {
    loadAnalyticsData(isRTL);
  }, [isRTL, loadAnalyticsData]);

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
      title: t('statistics:analytics.total_metrics'),
      value: data.totalMetrics,
      change: '+12%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: t('statistics:analytics.active_reports'),
      value: data.activeReports,
      change: '+8%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: t('statistics:analytics.total_users'),
      value: data.totalUsers,
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: t('statistics:analytics.avg_engagement'),
      value: `${data.averageEngagement}%`,
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
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
                    {t('statistics:analytics.from_last_month')}
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
          <TabsTrigger value="overview">{t('statistics:tabs.overview')}</TabsTrigger>
          <TabsTrigger value="trends">{t('statistics:tabs.trends')}</TabsTrigger>
          <TabsTrigger value="categories">{t('statistics:tabs.categories')}</TabsTrigger>
          <TabsTrigger value="reports">{t('statistics:analytics.reports')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  {t('statistics:charts.monthly_trends')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.monthlyTrends.slice(-3).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{trend.month}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">{t('statistics:analytics.reports')}:</span>
                          <span className="font-semibold ml-1">{trend.reports}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">{t('statistics:analytics.users')}:</span>
                          <span className="font-semibold ml-1">{trend.users}</span>
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
                  {t('statistics:analytics.performance_goals')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('statistics:analytics.report_completion_rate')}</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('statistics:impact.user_engagement')}</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('statistics:analytics.data_accuracy')}</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('statistics:analytics.trend_analysis')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.monthlyTrends.map((trend, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="font-semibold text-lg">{trend.month}</div>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{t('statistics:analytics.reports')}</span>
                        <span className="font-medium">{trend.reports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{t('statistics:analytics.users')}</span>
                        <span className="font-medium">{trend.users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{t('statistics:analytics.engagement')}</span>
                        <span className="font-medium">{trend.engagement}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  {t('statistics:analytics.top_categories')}
                </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-primary" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{category.count}</div>
                        <div className="text-sm text-muted-foreground">{category.percentage}%</div>
                      </div>
                      <div className="w-20">
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('statistics:analytics.report_types')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.reportTypes.map((report, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{report.type}</span>
                      <Badge variant="outline">{report.count}</Badge>
                    </div>
                    <Progress value={report.percentage} className="h-2" />
                    <div className="text-sm text-muted-foreground mt-1">
                      {report.percentage}% {t('statistics:analytics.of_total_reports')}
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
