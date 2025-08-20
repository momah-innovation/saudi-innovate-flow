import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { analyticsCache } from '@/utils/analyticsCache';
import { 
  Eye, 
  Users, 
  MessageSquare, 
  Share2, 
  TrendingUp, 
  TrendingDown,
  BarChart3 
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface OpportunityAnalyticsWidgetProps {
  opportunityId: string;
  opportunityTitle: string;
  compact?: boolean;
  showActions?: boolean;
  onViewDetails?: () => void;
}

interface AnalyticsSummary {
  views: number;
  applications: number;
  likes: number;
  shares: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'neutral';
  trendPercentage: number;
}

export const OpportunityAnalyticsWidget = ({
  opportunityId,
  opportunityTitle,
  compact = false,
  showActions = true,
  onViewDetails
}: OpportunityAnalyticsWidgetProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Real-time analytics updates
  const { analytics: realtimeAnalytics } = useRealTimeAnalytics({
    opportunityId,
    onAnalyticsUpdate: (newAnalytics) => {
      if (analytics) {
        setAnalytics(prev => prev ? {
          ...prev,
          views: newAnalytics.view_count || prev.views,
          likes: newAnalytics.like_count || prev.likes,
          applications: newAnalytics.application_count || prev.applications,
          shares: newAnalytics.share_count || prev.shares
        } : null);
      }
    }
  });

  useEffect(() => {
    loadAnalytics();
  }, [opportunityId]);

  const loadAnalytics = async () => {
    try {
      // Check cache first
      const cachedData = analyticsCache.get(opportunityId);
      if (cachedData) {
        setAnalytics(cachedData);
        setLoading(false);
        return;
      }

      const [analyticsData, applicationsData, likesData, sharesData] = await Promise.all([
        supabase
          .from('opportunity_analytics')
          .select('*')
          .eq('opportunity_id', opportunityId)
          .maybeSingle(),
        supabase
          .from('opportunity_applications')
          .select('id, created_at')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_likes')
          .select('id')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_shares')
          .select('id')
          .eq('opportunity_id', opportunityId)
      ]);

      const analyticsRecord = analyticsData.data;
      const applicationsCount = applicationsData.data?.length || 0;
      const likesCount = likesData.data?.length || 0;
      const sharesCount = sharesData.data?.length || 0;
      const viewsCount = analyticsRecord?.view_count || 0;

      const conversionRate = viewsCount > 0 ? (applicationsCount / viewsCount) * 100 : 0;
      
      // Calculate real trend based on recent activity vs previous period
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Count recent applications
      const recentApps = applicationsData.data?.filter(app => 
        new Date(app.created_at) > lastWeek
      ).length || 0;
      
      // Calculate trend
      const trend: 'up' | 'down' | 'neutral' = recentApps > (applicationsCount / 2) ? 'up' : 
                                                recentApps === 0 ? 'neutral' : 'down';
      const trendPercentage = applicationsCount > 0 ? 
        Math.round((recentApps / Math.max(1, applicationsCount - recentApps)) * 100) : 0;

      const summaryData: AnalyticsSummary = {
        views: viewsCount,
        applications: applicationsCount,
        likes: likesCount,
        shares: sharesCount,
        conversionRate,
        trend,
        trendPercentage
      };

      setAnalytics(summaryData);
      
      // Cache the data
      analyticsCache.set(opportunityId, summaryData);

    } catch (error) {
      // Failed to load analytics - show default values
      setAnalytics({
        views: 0,
        applications: 0,
        likes: 0,
        shares: 0,
        conversionRate: 0,
        trend: 'neutral',
        trendPercentage: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={compact ? 'w-full' : 'w-full md:w-80'}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getTrendIcon = () => {
    return analytics.trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = () => {
    return analytics.trend === 'up' ? 'text-green-500' : 'text-red-500';
  };

  if (compact) {
    return (
      <Card className="w-full">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm truncate">{opportunityTitle}</h4>
            <Badge variant="outline" className="text-xs">
              {analytics.conversionRate.toFixed(1)}%
            </Badge>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold">{formatNumber(analytics.views)}</div>
              <div className="text-muted-foreground">{t('opportunities:analytics_widget.views')}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{analytics.applications}</div>
              <div className="text-muted-foreground">{t('opportunities:analytics_widget.apps')}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{analytics.likes}</div>
              <div className="text-muted-foreground">{t('opportunities:analytics_widget.likes')}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{analytics.shares}</div>
              <div className="text-muted-foreground">{t('opportunities:analytics_widget.shares')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full md:w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          {t('opportunities:analytics_widget.title')}
        </CardTitle>
        <p className="text-xs text-muted-foreground truncate">{opportunityTitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50">
            <Eye className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-semibold text-sm">{formatNumber(analytics.views)}</div>
              <div className="text-xs text-muted-foreground">{t('opportunities:analytics_widget.views')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/50">
            <Users className="w-4 h-4 text-green-500" />
            <div>
              <div className="font-semibold text-sm">{analytics.applications}</div>
              <div className="text-xs text-muted-foreground">{t('opportunities:analytics_widget.applications')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            <div>
              <div className="font-semibold text-sm">{analytics.likes}</div>
              <div className="text-xs text-muted-foreground">{t('opportunities:analytics_widget.likes')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/50">
            <Share2 className="w-4 h-4 text-orange-500" />
            <div>
              <div className="font-semibold text-sm">{analytics.shares}</div>
              <div className="text-xs text-muted-foreground">{t('opportunities:analytics_widget.shares')}</div>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="flex items-center justify-between p-2 rounded-lg border">
          <div>
            <div className="text-sm font-medium">{t('opportunities:analytics_widget.conversion_rate')}</div>
            <div className="text-lg font-bold">{analytics.conversionRate.toFixed(1)}%</div>
          </div>
          <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
            {getTrendIcon()({ className: 'w-3 h-3' })}
            {analytics.trendPercentage}%
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={onViewDetails}
            >
              <BarChart3 className={`w-3 h-3 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('opportunities:analytics_widget.view_details')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
