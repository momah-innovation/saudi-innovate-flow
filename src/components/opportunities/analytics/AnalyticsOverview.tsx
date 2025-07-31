import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MetricsCard } from './MetricsCard';
import { useDirection } from '@/components/ui/direction-provider';
import { 
  Eye, 
  Users, 
  MessageSquare, 
  Target, 
  Activity,
  Clock,
  Globe,
  Share2
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsOverviewProps {
  analytics: any;
  trends: any;
}

export const AnalyticsOverview = ({ analytics, trends }: AnalyticsOverviewProps) => {
  const { isRTL } = useDirection();

  const keyMetrics = [
    {
      title: isRTL ? 'إجمالي المشاهدات' : 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      icon: <Eye className="w-5 h-5" />,
      trend: trends.views,
      badge: { label: isRTL ? 'نشط' : 'Active', variant: 'default' as const }
    },
    {
      title: isRTL ? 'إجمالي الطلبات' : 'Total Applications',
      value: analytics.totalApplications,
      icon: <Users className="w-5 h-5" />,
      trend: trends.applications,
      badge: { label: isRTL ? 'جديد' : 'New', variant: 'secondary' as const }
    },
    {
      title: isRTL ? 'الإعجابات' : 'Likes',
      value: analytics.totalLikes,
      icon: <MessageSquare className="w-5 h-5" />,
      trend: trends.likes
    },
    {
      title: isRTL ? 'معدل التحويل' : 'Conversion Rate',
      value: `${analytics.conversionRate.toFixed(1)}%`,
      icon: <Target className="w-5 h-5" />,
      trend: trends.conversion,
      badge: { label: isRTL ? 'متميز' : 'Excellent', variant: 'outline' as const }
    }
  ];

  const additionalMetrics = [
    {
      title: isRTL ? 'المشاركات' : 'Shares',
      value: analytics.totalShares || 0,
      icon: <Share2 className="w-4 h-4" />
    },
    {
      title: isRTL ? 'متوسط الوقت' : 'Avg. Time',
      value: `${analytics.engagementMetrics.avgTimeOnPage}s`,
      icon: <Clock className="w-4 h-4" />
    },
    {
      title: isRTL ? 'معدل الارتداد' : 'Bounce Rate',
      value: `${analytics.engagementMetrics.bounceRate}%`,
      icon: <Activity className="w-4 h-4" />
    },
    {
      title: isRTL ? 'الزوار العائدون' : 'Return Visitors',
      value: analytics.engagementMetrics.returnVisitors,
      icon: <Globe className="w-4 h-4" />
    }
  ];

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPerformanceLabel = (rate: number) => {
    if (rate >= 80) return isRTL ? 'ممتاز' : 'Excellent';
    if (rate >= 60) return isRTL ? 'جيد' : 'Good';
    return isRTL ? 'يحتاج تحسين' : 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isRTL ? 'نظرة عامة على الأداء' : 'Performance Overview'}
          </h2>
          <p className="text-muted-foreground">
            {isRTL ? 'ملخص شامل لأداء الفرصة' : 'Comprehensive summary of opportunity performance'}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="w-3 h-3" />
          {isRTL ? 'مُحدَّث' : 'Live'}
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {isRTL ? 'نقاط الأداء العامة' : 'Overall Performance Score'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {isRTL ? 'النقاط الإجمالية' : 'Overall Score'}
              </span>
              <span className={`text-sm font-bold ${getPerformanceColor(75)}`}>
                75/100
              </span>
            </div>
            <Progress value={75} className="h-2" />
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {getPerformanceLabel(75)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {isRTL ? 'بناءً على آخر 30 يوم' : 'Based on last 30 days'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {isRTL ? 'اتجاهات المشاهدات والطلبات' : 'Views & Applications Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analytics.viewsData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stackId="1" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.6}
                  name={isRTL ? 'المشاهدات' : 'Views'}
                />
                <Area 
                  type="monotone" 
                  dataKey="applications" 
                  stackId="2" 
                  stroke="hsl(var(--chart-2))" 
                  fill="hsl(var(--chart-2))" 
                  fillOpacity={0.6}
                  name={isRTL ? 'الطلبات' : 'Applications'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {isRTL ? 'مؤشرات إضافية' : 'Additional Metrics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {additionalMetrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};