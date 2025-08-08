import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface AdvancedPerformanceProps {
  opportunityId: string;
}

interface PerformanceMetrics {
  clickThroughRate: number;
  engagementRate: number;
  conversionRate: number;
  averageTimeSpent: number;
  bounceRate: number;
  qualityScore: number;
  totalInteractions: number;
  uniqueVisitors: number;
  returningVisitors: number;
  peakViewingHours: string[];
  recommendations: string[];
  trends: {
    views: { value: number; change: number; direction: 'up' | 'down' | 'stable' };
    engagement: { value: number; change: number; direction: 'up' | 'down' | 'stable' };
    conversion: { value: number; change: number; direction: 'up' | 'down' | 'stable' };
  };
}

export const AdvancedPerformanceMetrics = ({ opportunityId }: AdvancedPerformanceProps) => {
  const { isRTL } = useDirection();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (opportunityId) {
      loadPerformanceMetrics();
    }
  }, [opportunityId]);

  const loadPerformanceMetrics = async () => {
    try {
      setLoading(true);
      
      // Load comprehensive analytics data
      const [
        analyticsData,
        viewSessionsData,
        journeyData,
        applicationsData
      ] = await Promise.all([
        supabase
          .from('opportunity_analytics')
          .select('*')
          .eq('opportunity_id', opportunityId)
          .maybeSingle(),
        supabase
          .from('opportunity_view_sessions')
          .select('*')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_user_journeys')
          .select('*')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_applications')
          .select('created_at, status')
          .eq('opportunity_id', opportunityId)
      ]);

      const analytics = analyticsData?.data;
      const sessions = viewSessionsData?.data || [];
      const journeys = journeyData?.data || [];
      const applications = applicationsData?.data || [];

      // Calculate real metrics
      const totalViews = analytics?.view_count || 0;
      const totalApplications = applications.length;
      const uniqueVisitors = sessions.length;
      const totalTimeSpent = sessions.reduce((sum, session) => sum + (session.time_spent_seconds || 0), 0);
      const averageTimeSpent = sessions.length > 0 ? totalTimeSpent / sessions.length : 0;
      
      // Calculate engagement metrics
      const clickEvents = journeys.filter(j => j.journey_step === 'section_click').length;
      const totalInteractions = journeys.length;
      const engagementRate = totalViews > 0 ? (totalInteractions / totalViews) * 100 : 0;
      const clickThroughRate = totalViews > 0 ? (clickEvents / totalViews) * 100 : 0;
      const conversionRate = totalViews > 0 ? (totalApplications / totalViews) * 100 : 0;
      
      // Calculate bounce rate (sessions with < 30 seconds)
      const shortSessions = sessions.filter(s => (s.time_spent_seconds || 0) < 30).length;
      const bounceRate = sessions.length > 0 ? (shortSessions / sessions.length) * 100 : 0;
      
      // Calculate quality score
      const qualityScore = calculateQualityScore({
        engagementRate,
        conversionRate,
        averageTimeSpent,
        bounceRate
      });

      // Generate recommendations
      const recommendations = generateRecommendations({
        engagementRate,
        conversionRate,
        bounceRate,
        averageTimeSpent,
        clickThroughRate
      });

      // Calculate trends from historical data by comparing with previous periods
      const calculateTrendFromHistory = (current: number, historical: Record<string, unknown>[], field: string) => {
        if (historical.length < 2) return { change: 0, direction: 'stable' as const };
        
        const previousValue = historical[historical.length - 2]?.[field] || 0;
        const change = current > 0 && previousValue > 0 
          ? Math.round(((current - previousValue) / previousValue) * 100)
          : 0;
        
        return {
          change: Math.abs(change),
          direction: change > 5 ? 'up' as const : change < -5 ? 'down' as const : 'stable' as const
        };
      };
      
      const trends = {
        views: { 
          value: totalViews, 
          ...calculateTrendFromHistory(totalViews, sessions, 'page_views')
        },
        engagement: { 
          value: engagementRate, 
          ...calculateTrendFromHistory(engagementRate, sessions, 'engagement_score')
        },
        conversion: { 
          value: conversionRate, 
          ...calculateTrendFromHistory(conversionRate, applications, 'conversion_rate')
        }
      };

      const performanceData: PerformanceMetrics = {
        clickThroughRate,
        engagementRate,
        conversionRate,
        averageTimeSpent,
        bounceRate,
        qualityScore,
        totalInteractions,
        uniqueVisitors,
        returningVisitors: sessions.filter(s => s.view_count && s.view_count > 1).length,
        peakViewingHours: calculatePeakHours(sessions),
        recommendations,
        trends
      };

      setMetrics(performanceData);
    } catch (error) {
      logger.error('Failed to load advanced performance metrics', { 
        component: 'AdvancedPerformanceMetrics', 
        action: 'loadPerformanceMetrics',
        opportunityId 
      }, error as Error);
      // Set fallback data
      setMetrics(generateFallbackMetrics());
    } finally {
      setLoading(false);
    }
  };

  const calculatePeakHours = (sessions: Record<string, unknown>[]) => {
    const hourCounts = sessions.reduce((acc, session) => {
      const hour = new Date(session.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    return Object.entries(hourCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([hour]) => `${hour.toString().padStart(2, '0')}:00`);
  };

  const calculateQualityScore = (metrics: {
    engagementRate: number;
    conversionRate: number;
    averageTimeSpent: number;
    bounceRate: number;
  }) => {
    const { engagementRate, conversionRate, averageTimeSpent, bounceRate } = metrics;
    
    let score = 0;
    
    // Engagement rate scoring (0-3 points)
    if (engagementRate > 20) score += 3;
    else if (engagementRate > 10) score += 2;
    else if (engagementRate > 5) score += 1;
    
    // Conversion rate scoring (0-3 points)
    if (conversionRate > 5) score += 3;
    else if (conversionRate > 2) score += 2;
    else if (conversionRate > 0.5) score += 1;
    
    // Time spent scoring (0-2 points)
    if (averageTimeSpent > 120) score += 2;
    else if (averageTimeSpent > 60) score += 1;
    
    // Bounce rate scoring (0-2 points, inverted)
    if (bounceRate < 30) score += 2;
    else if (bounceRate < 50) score += 1;
    
    return Math.min(score, 10);
  };

  const generateRecommendations = (metrics: {
    engagementRate: number;
    conversionRate: number;
    bounceRate: number;
    averageTimeSpent: number;
    clickThroughRate: number;
  }) => {
    const recommendations: string[] = [];
    
    if (metrics.conversionRate < 2) {
      recommendations.push(isRTL ? 'تبسيط عملية التطبيق لزيادة التحويلات' : 'Simplify application process to increase conversions');
    }
    
    if (metrics.engagementRate < 10) {
      recommendations.push(isRTL ? 'إضافة محتوى تفاعلي أكثر جاذبية' : 'Add more engaging interactive content');
    }
    
    if (metrics.bounceRate > 60) {
      recommendations.push(isRTL ? 'تحسين المحتوى لتقليل معدل الارتداد' : 'Improve content to reduce bounce rate');
    }
    
    if (metrics.averageTimeSpent < 60) {
      recommendations.push(isRTL ? 'إضافة المزيد من التفاصيل والوسائط' : 'Add more detailed content and media');
    }
    
    if (metrics.clickThroughRate < 5) {
      recommendations.push(isRTL ? 'تحسين العناوين والأزرار لزيادة النقرات' : 'Optimize headings and buttons for better click-through');
    }
    
    return recommendations;
  };

  const generateFallbackMetrics = (): PerformanceMetrics => ({
    clickThroughRate: 0,
    engagementRate: 0,
    conversionRate: 0,
    averageTimeSpent: 0,
    bounceRate: 0,
    qualityScore: 0,
    totalInteractions: 0,
    uniqueVisitors: 0,
    returningVisitors: 0,
    peakViewingHours: [],
    recommendations: [
      isRTL ? 'لا توجد بيانات كافية للتحليل' : 'Not enough data for analysis'
    ],
    trends: {
      views: { value: 0, change: 0, direction: 'stable' },
      engagement: { value: 0, change: 0, direction: 'stable' },
      conversion: { value: 0, change: 0, direction: 'stable' }
    }
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Target;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return { variant: 'default' as const, label: isRTL ? 'ممتاز' : 'Excellent' };
    if (score >= 6) return { variant: 'secondary' as const, label: isRTL ? 'جيد' : 'Good' };
    return { variant: 'destructive' as const, label: isRTL ? 'يحتاج تحسين' : 'Needs Improvement' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'مقاييس الأداء المتقدمة' : 'Advanced Performance Metrics'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const scoreBadge = getScoreBadge(metrics.qualityScore);

  return (
    <div className="space-y-6">
      {/* Quality Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {isRTL ? 'نقاط الجودة الإجمالية' : 'Overall Quality Score'}
            </span>
            <Badge variant={scoreBadge.variant}>{scoreBadge.label}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">
              <span className={getScoreColor(metrics.qualityScore)}>
                {metrics.qualityScore.toFixed(1)}
              </span>
              <span className="text-2xl text-muted-foreground">/10</span>
            </div>
            <div className="flex-1">
              <Progress value={metrics.qualityScore * 10} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {isRTL ? 'بناءً على التفاعل والتحويل والوقت المقضي' : 'Based on engagement, conversion, and time spent'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Click-through Rate */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-2xl font-bold">{metrics.clickThroughRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'نسبة النقر' : 'Click-through Rate'}</p>
                <div className="flex items-center gap-1 mt-1">
                  {(() => {
                    const TrendIcon = getTrendIcon(metrics.trends.views.direction);
                    return <TrendIcon className={`w-3 h-3 ${getTrendColor(metrics.trends.views.direction)}`} />;
                  })()}
                  <span className={`text-xs ${getTrendColor(metrics.trends.views.direction)}`}>
                    {metrics.trends.views.change > 0 ? '+' : ''}{metrics.trends.views.change}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Rate */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="text-2xl font-bold">{metrics.engagementRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'معدل التفاعل' : 'Engagement Rate'}</p>
                <div className="flex items-center gap-1 mt-1">
                  {(() => {
                    const TrendIcon = getTrendIcon(metrics.trends.engagement.direction);
                    return <TrendIcon className={`w-3 h-3 ${getTrendColor(metrics.trends.engagement.direction)}`} />;
                  })()}
                  <span className={`text-xs ${getTrendColor(metrics.trends.engagement.direction)}`}>
                    {metrics.trends.engagement.change > 0 ? '+' : ''}{metrics.trends.engagement.change}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Time Spent */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <div className="flex-1">
                <p className="text-2xl font-bold">{formatDuration(metrics.averageTimeSpent)}</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'متوسط الوقت المقضي' : 'Avg. Time Spent'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.totalInteractions} {isRTL ? 'تفاعل' : 'interactions'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {isRTL ? 'تفاصيل الزوار' : 'Visitor Details'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>{isRTL ? 'زوار فريدون' : 'Unique Visitors'}</span>
              <span className="font-medium">{metrics.uniqueVisitors}</span>
            </div>
            <div className="flex justify-between">
              <span>{isRTL ? 'زوار عائدون' : 'Returning Visitors'}</span>
              <span className="font-medium">{metrics.returningVisitors}</span>
            </div>
            <div className="flex justify-between">
              <span>{isRTL ? 'معدل الارتداد' : 'Bounce Rate'}</span>
              <span className="font-medium">{metrics.bounceRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</span>
              <span className="font-medium">{metrics.conversionRate.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {isRTL ? 'التوصيات' : 'Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
              {metrics.qualityScore >= 8 && (
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700">
                    {isRTL ? 'أداء ممتاز! استمر في الحفاظ على هذا المستوى' : 'Excellent performance! Keep maintaining this level'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};