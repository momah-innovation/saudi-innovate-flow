import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MetricsCard } from './MetricsCard';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
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
// Chart components replaced with simple visualization

interface AnalyticsOverviewProps {
  analytics: any;
  trends: any;
}

export const AnalyticsOverview = ({ analytics, trends }: AnalyticsOverviewProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  const keyMetrics = [
    {
      title: t('opportunities:analytics_overview.total_views'),
      value: analytics.totalViews.toLocaleString(),
      icon: <Eye className="w-5 h-5" />,
      trend: trends.views,
      badge: { label: t('opportunities:analytics_overview.active'), variant: 'default' as const }
    },
    {
      title: t('opportunities:analytics_overview.total_applications'),
      value: analytics.totalApplications,
      icon: <Users className="w-5 h-5" />,
      trend: trends.applications,
      badge: { label: t('opportunities:analytics_overview.new'), variant: 'secondary' as const }
    },
    {
      title: t('opportunities:analytics_overview.likes'),
      value: analytics.totalLikes,
      icon: <MessageSquare className="w-5 h-5" />,
      trend: trends.likes
    },
    {
      title: t('opportunities:analytics_overview.conversion_rate'),
      value: `${analytics.conversionRate.toFixed(1)}%`,
      icon: <Target className="w-5 h-5" />,
      trend: trends.conversion,
      badge: { label: t('opportunities:analytics_overview.excellent'), variant: 'outline' as const }
    }
  ];

  const additionalMetrics = [
    {
      title: t('opportunities:analytics_overview.shares'),
      value: analytics.totalShares || 0,
      icon: <Share2 className="w-4 h-4" />
    },
    {
      title: t('opportunities:analytics_overview.avg_time'),
      value: `${analytics.engagementMetrics.avgTimeOnPage}s`,
      icon: <Clock className="w-4 h-4" />
    },
    {
      title: t('opportunities:analytics_overview.bounce_rate'),
      value: `${analytics.engagementMetrics.bounceRate}%`,
      icon: <Activity className="w-4 h-4" />
    },
    {
      title: t('opportunities:analytics_overview.return_visitors'),
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
    if (rate >= 80) return t('opportunities:analytics_overview.performance_labels.excellent');
    if (rate >= 60) return t('opportunities:analytics_overview.performance_labels.good');
    return t('opportunities:analytics_overview.performance_labels.needs_improvement');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('opportunities:analytics_overview.performance_overview')}
          </h2>
          <p className="text-muted-foreground">
            {t('opportunities:analytics_overview.performance_summary')}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="w-3 h-3" />
          {t('opportunities:analytics_overview.live')}
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
            {t('opportunities:analytics_overview.overall_performance_score')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t('opportunities:analytics_overview.overall_score')}
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
                {t('opportunities:analytics_overview.based_on_last_30_days')}
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
              {t('opportunities:analytics_overview.views_applications_trends')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('opportunities:analytics_overview.chart_data_available')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('opportunities:analytics_overview.additional_metrics')}
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
