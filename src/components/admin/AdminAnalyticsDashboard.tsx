import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  DollarSign,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Filter,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface AdminAnalyticsDashboardProps {
  className?: string;
}

export function AdminAnalyticsDashboard({ className }: AdminAnalyticsDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // ✅ MIGRATED: Using unified loading and error handling
  const { isLoading, withLoading } = useUnifiedLoading({
    component: 'AdminAnalyticsDashboard',
    showToast: true,
    logErrors: true
  });
  const errorHandler = createErrorHandler({ component: 'AdminAnalyticsDashboard' });

  // Mock analytics data with comprehensive metrics
  const analyticsData = {
    overview: {
      totalUsers: 1248,
      activeUsers: 856,
      newUsers: 124,
      retention: 78.5,
      engagement: 65.2,
      revenue: 125000,
      conversion: 12.8,
      satisfaction: 4.6
    },
    trends: {
      userGrowth: [
        { period: '30 days ago', value: 1124 },
        { period: '25 days ago', value: 1156 },
        { period: '20 days ago', value: 1189 },
        { period: '15 days ago', value: 1203 },
        { period: '10 days ago', value: 1221 },
        { period: '5 days ago', value: 1235 },
        { period: 'Today', value: 1248 }
      ],
      engagement: [
        { period: 'Week 1', value: 62.1 },
        { period: 'Week 2', value: 64.3 },
        { period: 'Week 3', value: 63.8 },
        { period: 'Week 4', value: 65.2 }
      ]
    },
    channels: {
      acquisition: [
        { channel: 'Direct', users: 456, percentage: 36.5 },
        { channel: 'Social Media', users: 324, percentage: 26.0 },
        { channel: 'Email', users: 298, percentage: 23.9 },
        { channel: 'Referrals', users: 170, percentage: 13.6 }
      ]
    },
    performance: {
      challenges: {
        total: 45,
        active: 12,
        completed: 28,
        submissions: 324,
        avgSubmissionsPerChallenge: 7.2
      },
      ideas: {
        total: 892,
        implemented: 156,
        underReview: 89,
        rejected: 124,
        implementationRate: 17.5
      }
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (current < previous) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleExport = () => {
    return withLoading('export', async () => {
      // Mock export functionality
      const csvContent = 'Metric,Value,Period\nTotal Users,1248,30d\nActive Users,856,30d\nEngagement Rate,65.2%,30d';
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics-report.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      return true;
    }, {
      successMessage: t('success.export_completed'),
      errorMessage: t('error.export_failed'),
      logContext: { timeframe: selectedTimeframe, metric: selectedMetric }
    });
  };

  if (isLoading('refresh')) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {language === 'ar' ? 'لوحة التحليلات المتقدمة' : 'Advanced Analytics Dashboard'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'تحليلات شاملة ومقاييس الأداء' : 'Comprehensive analytics and performance metrics'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{language === 'ar' ? '7 أيام' : '7 Days'}</SelectItem>
              <SelectItem value="30d">{language === 'ar' ? '30 يوم' : '30 Days'}</SelectItem>
              <SelectItem value="90d">{language === 'ar' ? '90 يوم' : '90 Days'}</SelectItem>
              <SelectItem value="1y">{language === 'ar' ? 'سنة' : '1 Year'}</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={isLoading('export')}
          >
            <Download className={`w-4 h-4 mr-2 ${isLoading('export') ? 'animate-spin' : ''}`} />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => withLoading('refresh', async () => window.location.reload())}
            disabled={isLoading('refresh')}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading('refresh') ? 'animate-spin' : ''}`} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
                </p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm">
                  {getTrendIcon(analyticsData.overview.totalUsers, 1124)}
                  <span className={getTrendColor(analyticsData.overview.totalUsers, 1124)}>
                    +{Math.round((analyticsData.overview.totalUsers - 1124) / 1124 * 100)}%
                  </span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'معدل المشاركة' : 'Engagement Rate'}
                </p>
                <p className="text-2xl font-bold">{analyticsData.overview.engagement}%</p>
                <div className="flex items-center gap-1 text-sm">
                  {getTrendIcon(analyticsData.overview.engagement, 62.1)}
                  <span className={getTrendColor(analyticsData.overview.engagement, 62.1)}>
                    +{(analyticsData.overview.engagement - 62.1).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'معدل التحويل' : 'Conversion Rate'}
                </p>
                <p className="text-2xl font-bold">{analyticsData.overview.conversion}%</p>
                <div className="flex items-center gap-1 text-sm">
                  {getTrendIcon(analyticsData.overview.conversion, 11.2)}
                  <span className={getTrendColor(analyticsData.overview.conversion, 11.2)}>
                    +{(analyticsData.overview.conversion - 11.2).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'درجة الرضا' : 'Satisfaction Score'}
                </p>
                <p className="text-2xl font-bold">{analyticsData.overview.satisfaction}/5</p>
                <div className="flex items-center gap-1 text-sm">
                  {getTrendIcon(analyticsData.overview.satisfaction, 4.4)}
                  <span className={getTrendColor(analyticsData.overview.satisfaction, 4.4)}>
                    +{(analyticsData.overview.satisfaction - 4.4).toFixed(1)}
                  </span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            {language === 'ar' ? 'الاتجاهات' : 'Trends'}
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            {language === 'ar' ? 'القنوات' : 'Channels'}
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            {language === 'ar' ? 'الأداء' : 'Performance'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {language === 'ar' ? 'إحصائيات المستخدمين' : 'User Statistics'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? 'مستخدمون نشطون' : 'Active Users'}</p>
                    <p className="text-xl font-bold">{analyticsData.overview.activeUsers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? 'مستخدمون جدد' : 'New Users'}</p>
                    <p className="text-xl font-bold text-green-600">+{analyticsData.overview.newUsers}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{language === 'ar' ? 'معدل الاحتفاظ' : 'Retention Rate'}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${analyticsData.overview.retention}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-right mt-1">{analyticsData.overview.retention}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {language === 'ar' ? 'المقاييس المالية' : 'Financial Metrics'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue'}</p>
                  <p className="text-2xl font-bold">${analyticsData.overview.revenue.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? 'معدل التحويل' : 'Conversion Rate'}</p>
                    <p className="text-lg font-semibold">{analyticsData.overview.conversion}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? 'متوسط القيمة' : 'Avg. Value'}</p>
                    <p className="text-lg font-semibold">$97</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                {language === 'ar' ? 'نمو المستخدمين' : 'User Growth Trend'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {analyticsData.trends.userGrowth.map((point, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-600 w-full rounded-t"
                      style={{ 
                        height: `${(point.value - 1100) / (1250 - 1100) * 200}px`,
                        minHeight: '10px'
                      }}
                    ></div>
                    <p className="text-xs mt-2 text-center">{point.period}</p>
                    <p className="text-xs font-semibold">{point.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                {language === 'ar' ? 'قنوات الحصول على المستخدمين' : 'User Acquisition Channels'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.channels.acquisition.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ 
                          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index] 
                        }}
                      ></div>
                      <span className="font-medium">{channel.channel}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{channel.users} users</span>
                      <span className="font-semibold">{channel.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {language === 'ar' ? 'أداء التحديات' : 'Challenges Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? 'إجمالي التحديات' : 'Total Challenges'}</p>
                    <p className="text-2xl font-bold">{analyticsData.performance.challenges.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? 'نشطة' : 'Active'}</p>
                    <p className="text-2xl font-bold text-green-600">{analyticsData.performance.challenges.active}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'المشاركات' : 'Submissions'}</p>
                  <p className="text-xl font-semibold">{analyticsData.performance.challenges.submissions}</p>
                  <p className="text-xs text-muted-foreground">
                    {analyticsData.performance.challenges.avgSubmissionsPerChallenge} {language === 'ar' ? 'في المتوسط' : 'average per challenge'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {language === 'ar' ? 'أداء الأفكار' : 'Ideas Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? 'إجمالي الأفكار' : 'Total Ideas'}</p>
                    <p className="text-2xl font-bold">{analyticsData.performance.ideas.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? 'منفذة' : 'Implemented'}</p>
                    <p className="text-2xl font-bold text-green-600">{analyticsData.performance.ideas.implemented}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'معدل التنفيذ' : 'Implementation Rate'}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${analyticsData.performance.ideas.implementationRate}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-right mt-1">{analyticsData.performance.ideas.implementationRate}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'عرض تفصيلي' : 'Detailed View'}
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تقرير شهري' : 'Monthly Report'}
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'توقعات النمو' : 'Growth Forecast'}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}