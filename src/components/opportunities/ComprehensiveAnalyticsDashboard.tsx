import { useState, useEffect } from 'react';
import { Application, Like, Share, ViewSession } from '@/types/opportunities';
import { logger } from '@/utils/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import {
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Target,
  Activity,
  Globe,
  MessageSquare,
  Heart,
  Share2,
  BookOpen,
  Zap
} from 'lucide-react';
import { ChartPlaceholder } from '@/components/common/ChartPlaceholder'

interface AnalyticsSummary {
  totalOpportunities: number;
  totalViews: number;
  totalApplications: number;
  totalLikes: number;
  totalShares: number;
  totalBookmarks: number;
  avgConversionRate: number;
  avgEngagementRate: number;
  topPerformingOpportunities: Array<{
    id: string;
    title: string;
    views: number;
    applications: number;
    conversionRate: number;
  }>;
  engagementTrend: Array<{
    date: string;
    views: number;
    applications: number;
    engagement: number;
  }>;
  geographicData: Array<{
    country: string;
    views: number;
    applications: number;
  }>;
  trafficSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
}

export const ComprehensiveAnalyticsDashboard = () => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadComprehensiveAnalytics();
  }, [timeRange]);

  const loadComprehensiveAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load all opportunities with their analytics
      const { data: opportunities } = await supabase
        .from('partnership_opportunities')
        .select(`
          id,
          title_ar,
          title_en,
          opportunity_analytics (
            view_count,
            like_count,
            application_count,
            share_count
          )
        `)
        .eq('status', 'open');

      // Load all analytics data
      const { data: analyticsData } = await supabase
        .from('opportunity_analytics')
        .select('*');

      // Load applications for conversion calculations
      const { data: applications } = await supabase
        .from('opportunity_applications')
        .select('opportunity_id, created_at')
        .gte('created_at', getDateRangeStart(timeRange));

      // Load view sessions for engagement data
      const { data: viewSessions } = await supabase
        .from('opportunity_view_sessions')
        .select('*')
        .gte('created_at', getDateRangeStart(timeRange));

      // Load likes and shares
      const { data: likes } = await supabase
        .from('opportunity_likes')
        .select('opportunity_id, created_at')
        .gte('created_at', getDateRangeStart(timeRange));

      const { data: shares } = await supabase
        .from('opportunity_shares')
        .select('opportunity_id, created_at, platform')
        .gte('created_at', getDateRangeStart(timeRange));

      const { data: bookmarks } = await supabase
        .from('opportunity_bookmarks')
        .select('opportunity_id, created_at')
        .gte('created_at', getDateRangeStart(timeRange));

      // Process the data
      const processedAnalytics = await processAnalyticsData({
        opportunities: opportunities || [],
        analyticsData: analyticsData || [],
        applications: applications || [],
        viewSessions: viewSessions || [],
        likes: likes || [],
        shares: shares || [],
        bookmarks: bookmarks || []
      });

      setAnalytics(processedAnalytics);
    } catch (error) {
      logger.error('Error loading comprehensive analytics', { 
        component: 'ComprehensiveAnalyticsDashboard', 
        action: 'loadAnalytics' 
      }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeStart = (range: string) => {
    const now = new Date();
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const processAnalyticsData = async (data: any): Promise<AnalyticsSummary> => {
    const { opportunities, analyticsData, applications, viewSessions, likes, shares, bookmarks } = data;

    // Calculate totals
    const totalViews = analyticsData.reduce((sum: number, item: any) => sum + (item.view_count || 0), 0);
    const totalApplications = applications.length;
    const totalLikes = likes.length;
    const totalShares = shares.length;
    const totalBookmarks = bookmarks.length;

    // Calculate averages
    const avgConversionRate = totalViews > 0 ? (totalApplications / totalViews) * 100 : 0;
    const avgEngagementRate = totalViews > 0 ? ((totalLikes + totalShares + totalBookmarks) / totalViews) * 100 : 0;

    // Top performing opportunities
    const topPerformingOpportunities = opportunities
      .map((opp: any) => {
        const analytics = opp.opportunity_analytics?.[0];
        const views = analytics?.view_count || 0;
        const apps = analytics?.application_count || 0;
        return {
          id: opp.id,
          title: isRTL ? opp.title_ar : opp.title_en || opp.title_ar,
          views,
          applications: apps,
          conversionRate: views > 0 ? (apps / views) * 100 : 0
        };
      })
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, 10);

    // Engagement trend (last 30 days)
    const engagementTrend = generateEngagementTrend(applications, likes, shares, viewSessions);

    // Geographic data from real Supabase table
    const { data: geoDataResult } = await supabase
      .from('opportunity_geographic_analytics')
      .select('country_name, country_code, view_count')
      .order('view_count', { ascending: false })
      .limit(5);

    const geographicData = (geoDataResult || []).map(item => ({
      country: item.country_name,
      views: item.view_count,
      applications: 0 // Will be calculated from real application data if geo data is available
    }));

    // Traffic sources from real shares data and application sources
    const platformShares = shares.reduce((acc: any, share: any) => {
      acc[share.platform] = (acc[share.platform] || 0) + 1;
      return acc;
    }, {});

    const applicationSources = applications.reduce((acc: any, app: any) => {
      const source = app.application_source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    // Get real traffic sources from applications and view sessions
    const trafficSourcesFromData = applications.reduce((acc: any, app: any) => {
      const source = app.application_source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    
    const sessionSources = viewSessions.reduce((acc: any, session: any) => {
      const source = session.referrer_domain || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    
    // Combine all unique sources
    const allSources = new Set([
      ...Object.keys(trafficSourcesFromData),
      ...Object.keys(sessionSources),
      ...Object.keys(platformShares)
    ]);
    
    const trafficSources = Array.from(allSources).map(source => ({
      source: source === 'direct' ? t('opportunities:dashboard.charts.direct') : source,
      count: (trafficSourcesFromData[source] || 0) + (sessionSources[source] || 0) + (platformShares[source] || 0)
    })).filter(item => item.count > 0)
      .map(source => ({
        ...source,
        percentage: totalViews > 0 ? Math.round((source.count / totalViews) * 100) : 0
      }))
      .filter(source => source.count > 0);

    return {
      totalOpportunities: opportunities.length,
      totalViews,
      totalApplications,
      totalLikes,
      totalShares,
      totalBookmarks,
      avgConversionRate,
      avgEngagementRate,
      topPerformingOpportunities,
      engagementTrend,
      geographicData,
      trafficSources
    };
  };

  const generateEngagementTrend = (applications: Application[], likes: Like[], shares: Share[], viewSessions: ViewSession[]) => {
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayViews = viewSessions.filter(s => s.created_at && s.created_at.startsWith(dateStr)).length;
      const dayApplications = applications.filter(a => a.created_at && a.created_at.startsWith(dateStr)).length;
      const dayLikes = likes.filter(l => l.created_at && l.created_at.startsWith(dateStr)).length;
      const dayShares = shares.filter(s => s.created_at.startsWith(dateStr)).length;
      
      last30Days.push({
        date: dateStr,
        views: dayViews,
        applications: dayApplications,
        engagement: dayLikes + dayShares
      });
    }
    return last30Days;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex gap-2">
        {[
          { value: '7d', label: t('opportunities:dashboard.time_ranges.7d') },
          { value: '30d', label: t('opportunities:dashboard.time_ranges.30d') },
          { value: '90d', label: t('opportunities:dashboard.time_ranges.90d') }
        ].map(range => (
          <Button
            key={range.value}
            variant={timeRange === range.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range.value)}
          >
            {range.label}
          </Button>
        ))}
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{t('opportunities:dashboard.stats.total_views')}</p>
                {/* Real trend would be calculated from historical data */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalApplications}</p>
                <p className="text-sm text-muted-foreground">{t('opportunities:dashboard.stats.total_applications')}</p>
                {/* Real trend would be calculated from historical data */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{analytics.avgConversionRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">{t('opportunities:dashboard.stats.conversion_rate')}</p>
                {/* Real trend would be calculated from historical data */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{analytics.avgEngagementRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">{t('opportunities:dashboard.stats.engagement_rate')}</p>
                {/* Real trend would be calculated from historical data */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('opportunities:dashboard.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="performance">{t('opportunities:dashboard.tabs.performance')}</TabsTrigger>
          <TabsTrigger value="engagement">{t('opportunities:dashboard.tabs.engagement')}</TabsTrigger>
          <TabsTrigger value="geographic">{t('opportunities:dashboard.tabs.geographic')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Engagement Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t('opportunities:dashboard.charts.engagement_trend')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder title={t('opportunities:dashboard.charts.engagement_trends')} height={300} />
            </CardContent>
          </Card>

          {/* Top Performing Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {t('opportunities:dashboard.charts.top_performing')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topPerformingOpportunities.slice(0, 5).map((opp, index) => (
                  <div key={opp.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium text-sm">{opp.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {opp.views} {t('opportunities:dashboard.charts.views')} • {opp.applications} {t('opportunities:dashboard.charts.applications')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {opp.conversionRate.toFixed(1)}% {t('opportunities:dashboard.charts.conv')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalLikes}</p>
                    <p className="text-sm text-muted-foreground">{t('opportunities:dashboard.charts.total_likes')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalShares}</p>
                    <p className="text-sm text-muted-foreground">{t('opportunities:dashboard.charts.total_shares')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalBookmarks}</p>
                    <p className="text-sm text-muted-foreground">{t('opportunities:dashboard.charts.bookmarks')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>{t('opportunities:dashboard.charts.traffic_sources')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder title={t('opportunities:dashboard.charts.traffic_sources')} height={300} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          {/* Engagement metrics would go here */}
          <Card>
            <CardHeader>
              <CardTitle>{t('opportunities:dashboard.charts.engagement_details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('opportunities:dashboard.charts.coming_soon')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          {/* Geographic Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('opportunities:dashboard.charts.geographic_distribution')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.geographicData.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <span className="font-medium">{country.country}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {country.views} {t('opportunities:dashboard.charts.views')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {country.applications} {t('opportunities:dashboard.charts.applications')}
                      </span>
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
