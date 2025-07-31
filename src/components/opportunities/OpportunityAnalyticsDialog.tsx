import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useDirection } from '@/components/ui/direction-provider';
import { useTranslation } from '@/hooks/useTranslation';
import { AnalyticsExportDialog } from './AnalyticsExportDialog';
import { OpportunityLivePresence } from './OpportunityLivePresence';
import { GeographicAnalytics } from './GeographicAnalytics';
import { AdvancedPerformanceMetrics } from './AdvancedPerformanceMetrics';
import { TimeRangeFilter } from './TimeRangeFilter';
import { EngagementAnalytics } from './EngagementAnalytics';
import { ApplicationsAnalytics } from './ApplicationsAnalytics';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { useUserJourneyTracker } from '@/hooks/useUserJourneyTracker';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  MessageSquare,
  Share2,
  Download,
  Calendar,
  Target,
  Clock,
  Globe,
  Activity
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OpportunityAnalyticsDialogProps {
  opportunityId: string;
  opportunityTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalApplications: number;
  totalShares: number;
  totalBookmarks: number;
  totalComments: number;
  conversionRate: number;
  viewsData: Array<{ date: string; views: number; applications: number }>;
  applicationSourceData: Array<{ source: string; count: number; percentage: number }>;
  timelineData: Array<{ date: string; action: string; count: number }>;
  engagementMetrics: {
    avgTimeOnPage: number;
    bounceRate: number;
    returnVisitors: number;
  };
}

export const OpportunityAnalyticsDialog = ({
  opportunityId,
  opportunityTitle,
  open,
  onOpenChange
}: OpportunityAnalyticsDialogProps) => {
  const { isRTL } = useDirection();
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [trends, setTrends] = useState<Record<string, { value: number; isPositive: boolean }>>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });
  const [sessionId] = useState(() => 
    sessionStorage.getItem('opportunity-session') || crypto.randomUUID()
  );

  // Journey tracking
  const { trackSectionView } = useUserJourneyTracker({
    opportunityId,
    sessionId
  });

  useEffect(() => {
    if (open && opportunityId) {
      loadAnalytics();
      trackSectionView('analytics_dialog', 'Analytics Dialog Opened');
    }
  }, [open, opportunityId, dateRange]);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackSectionView(tab, `Analytics Tab: ${tab}`);
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load real analytics data from multiple sources
      const [opportunityData, applicationsData, analyticsData, likesData, sharesData, bookmarksData, commentsData, journeyData, viewsHistoryData] = await Promise.all([
        supabase
          .from('opportunities')
          .select('*')
          .eq('id', opportunityId)
          .maybeSingle(),
        supabase
          .from('opportunity_applications')
          .select('created_at, status, application_source')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_analytics')
          .select('*')
          .eq('opportunity_id', opportunityId)
          .maybeSingle(),
        supabase
          .from('opportunity_likes')
          .select('created_at')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_shares')
          .select('created_at, platform')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_bookmarks')
          .select('created_at')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_comments')
          .select('created_at')
          .eq('opportunity_id', opportunityId)
          .eq('is_public', true),
        // Get user journey data for engagement metrics
        supabase
          .from('opportunity_user_journeys')
          .select('step_timestamp, time_from_previous_ms, step_data')
          .eq('opportunity_id', opportunityId)
          .gte('step_timestamp', dateRange.start.toISOString())
          .lte('step_timestamp', dateRange.end.toISOString()),
        // Get historical views data
        supabase
          .from('opportunity_analytics')
          .select('view_count, last_updated')
          .eq('opportunity_id', opportunityId)
          .order('last_updated', { ascending: false })
          .limit(30)
      ]);

      // Get real analytics summary
      const { data: summaryData } = await supabase.rpc('get_opportunity_analytics_summary', {
        p_opportunity_id: opportunityId
      });

      const analytics = analyticsData.data;
      const applications = applicationsData.data || [];
      const likes = likesData.data || [];
      const shares = sharesData.data || [];
      const bookmarks = bookmarksData.data || [];
      const comments = commentsData.data || [];
      const journey = journeyData.data || [];
      const viewsHistory = viewsHistoryData.data || [];
      const summary = summaryData?.[0];

      // Calculate engagement metrics from real journey data
      const engagementMetrics = calculateEngagementMetrics(journey);
      
      // Calculate trends based on recent activity
      const recentTrends = calculateTrends(applications, likes, shares, bookmarks, analytics, viewsHistory);
      setTrends(recentTrends);

      // Calculate real metrics
      const realAnalytics: AnalyticsData = {
        totalViews: analytics?.view_count || 0,
        totalLikes: likes.length,
        totalApplications: applications.length,
        totalShares: shares.length,
        totalBookmarks: bookmarks.length,
        totalComments: comments.length,
        conversionRate: summary?.conversion_rate || 0,
        viewsData: generateViewsDataFromReal(applications, viewsHistory),
        applicationSourceData: generateApplicationSourceData(applications),
        timelineData: generateTimelineFromReal(applications, likes, shares, bookmarks, comments),
        engagementMetrics
      };

      setAnalytics(realAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Fallback to basic data if analytics fail
      const fallbackAnalytics: AnalyticsData = {
        totalViews: 0,
        totalLikes: 0,
        totalApplications: 0,
        totalShares: 0,
        totalBookmarks: 0,
        totalComments: 0,
        conversionRate: 0,
        viewsData: [],
        applicationSourceData: [],
        timelineData: [],
        engagementMetrics: {
          avgTimeOnPage: 0,
          bounceRate: 0,
          returnVisitors: 0
        }
      };
      setAnalytics(fallbackAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const generateViewsDataFromReal = (applications: any[], viewsHistory: any[]) => {
    const last30Days = new Map();
    
    // Initialize last 30 days with zero counts
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last30Days.set(dateStr, { date: dateStr, views: 0, applications: 0 });
    }
    
    // Count applications by date
    applications.forEach(app => {
      const dateStr = new Date(app.created_at).toISOString().split('T')[0];
      if (last30Days.has(dateStr)) {
        last30Days.get(dateStr).applications++;
      }
    });
    
    // Use real views data only - no estimates
    const distributedData = Array.from(last30Days.keys()).map(dateStr => {
      const dayData = last30Days.get(dateStr);
      // Only count actual recorded applications, no artificial view boosts
      return {
        date: dateStr,
        views: 0, // Will be populated from real view tracking data
        applications: dayData.applications
      };
    });
    
    return distributedData;
  };

  const generateApplicationSourceData = (applications: any[]) => {
    const sourceCounts = new Map();
    const total = applications.length;
    
    if (total === 0) return [];
    
    // Count real application sources
    applications.forEach(app => {
      const source = app.application_source || 'direct';
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
    });
    
    // Convert to array with proper labels
    const sourceLabels = {
      direct: isRTL ? 'البحث المباشر' : 'Direct Search',
      social: isRTL ? 'وسائل التواصل' : 'Social Media',
      referral: isRTL ? 'الإحالات' : 'Referrals',
      email: isRTL ? 'البريد الإلكتروني' : 'Email',
      other: isRTL ? 'أخرى' : 'Other'
    };
    
    const sources = Array.from(sourceCounts.entries()).map(([key, count]) => ({
      source: sourceLabels[key] || (isRTL ? 'أخرى' : 'Other'),
      count,
      percentage: Math.round((count / total) * 100)
    }));
    
    return sources.sort((a, b) => b.count - a.count);
  };

  const generateTimelineFromReal = (applications: any[], likes: any[], shares: any[], bookmarks: any[], comments: any[]) => {
    const timeline = new Map();
    
    // Initialize last 7 days
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      timeline.set(dateStr, { date: dateStr, action: isRTL ? 'نشاط' : 'Activity', count: 0 });
    }
    
    // Count all activities
    [...applications, ...likes, ...shares, ...bookmarks, ...comments].forEach(item => {
      const dateStr = new Date(item.created_at).toISOString().split('T')[0];
      if (timeline.has(dateStr)) {
        timeline.get(dateStr).count++;
      }
    });
    
    return Array.from(timeline.values());
  };

  const calculateEngagementMetrics = (journey: any[]) => {
    if (journey.length === 0) {
      return {
        avgTimeOnPage: 0,
        bounceRate: 0,
        returnVisitors: 0
      };
    }

    // Calculate average time on page from journey data
    const timeSpentData = journey
      .filter(j => j.time_from_previous_ms > 0)
      .map(j => j.time_from_previous_ms / 1000); // Convert to seconds
    
    const avgTimeOnPage = timeSpentData.length > 0 
      ? Math.round(timeSpentData.reduce((sum, time) => sum + time, 0) / timeSpentData.length)
      : 0;

    // Calculate bounce rate (sessions with only one step)
    const sessionMap = new Map();
    journey.forEach(j => {
      const sessionId = j.session_id;
      sessionMap.set(sessionId, (sessionMap.get(sessionId) || 0) + 1);
    });
    
    const totalSessions = sessionMap.size;
    const bounceSessions = Array.from(sessionMap.values()).filter(count => count === 1).length;
    const bounceRate = totalSessions > 0 ? Math.round((bounceSessions / totalSessions) * 100) : 0;

    // Calculate return visitors (users with multiple sessions)
    const userSessions = new Map();
    journey.forEach(j => {
      const userId = j.user_id;
      if (userId) {
        const sessions = userSessions.get(userId) || new Set();
        sessions.add(j.session_id);
        userSessions.set(userId, sessions);
      }
    });
    
    const returnVisitors = Array.from(userSessions.values()).filter(sessions => sessions.size > 1).length;

    return {
      avgTimeOnPage,
      bounceRate,
      returnVisitors
    };
  };

  const calculateTrends = (applications: any[], likes: any[], shares: any[], bookmarks: any[], analytics: any, viewsHistory: any[]) => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Count recent activity vs previous week
    const recentCounts = {
      applications: applications.filter(item => new Date(item.created_at) > lastWeek).length,
      likes: likes.filter(item => new Date(item.created_at) > lastWeek).length,
      shares: shares.filter(item => new Date(item.created_at) > lastWeek).length,
      bookmarks: bookmarks.filter(item => new Date(item.created_at) > lastWeek).length,
    };

    const prevCounts = {
      applications: applications.filter(item => {
        const date = new Date(item.created_at);
        return date > prevWeek && date <= lastWeek;
      }).length,
      likes: likes.filter(item => {
        const date = new Date(item.created_at);
        return date > prevWeek && date <= lastWeek;
      }).length,
      shares: shares.filter(item => {
        const date = new Date(item.created_at);
        return date > prevWeek && date <= lastWeek;
      }).length,
      bookmarks: bookmarks.filter(item => {
        const date = new Date(item.created_at);
        return date > prevWeek && date <= lastWeek;
      }).length,
    };

    const calculatePercentage = (recent: number, prev: number) => {
      if (prev === 0) return recent > 0 ? 100 : 0;
      return Math.round(((recent - prev) / prev) * 100);
    };

    // Calculate views trend from historical data
    const recentViews = viewsHistory.filter(v => new Date(v.last_updated) > lastWeek);
    const prevViews = viewsHistory.filter(v => {
      const date = new Date(v.last_updated);
      return date > prevWeek && date <= lastWeek;
    });
    
    const viewsTrend = calculatePercentage(
      recentViews.reduce((sum, v) => sum + (v.view_count || 0), 0),
      prevViews.reduce((sum, v) => sum + (v.view_count || 0), 0)
    );

    // Calculate conversion trend
    const recentConversion = recentCounts.applications > 0 && recentViews.length > 0 
      ? (recentCounts.applications / recentViews.reduce((sum, v) => sum + (v.view_count || 0), 0)) * 100 
      : 0;
    const prevConversion = prevCounts.applications > 0 && prevViews.length > 0 
      ? (prevCounts.applications / prevViews.reduce((sum, v) => sum + (v.view_count || 0), 0)) * 100 
      : 0;
    const conversionTrend = calculatePercentage(recentConversion, prevConversion);

    return {
      views: { value: viewsTrend, isPositive: viewsTrend >= 0 },
      applications: { 
        value: calculatePercentage(recentCounts.applications, prevCounts.applications), 
        isPositive: recentCounts.applications >= prevCounts.applications 
      },
      likes: { 
        value: calculatePercentage(recentCounts.likes, prevCounts.likes), 
        isPositive: recentCounts.likes >= prevCounts.likes 
      },
      conversion: { value: conversionTrend, isPositive: conversionTrend >= 0 },
    };
  };


  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!analytics) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {isRTL ? 'لا توجد بيانات إحصائية متاحة' : 'No analytics data available'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <DialogTitle>{isRTL ? 'إحصائيات الفرصة' : 'Opportunity Analytics'}</DialogTitle>
              <OpportunityLivePresence opportunityId={opportunityId} />
            </div>
            <AnalyticsExportDialog
              opportunityId={opportunityId}
              opportunityTitle={opportunityTitle}
            />
          </div>
          <p className="text-sm text-muted-foreground">{opportunityTitle}</p>
        </DialogHeader>

        {/* Time Range Filter */}
        <div className="flex gap-4">
          <div className="flex-1">
            <TimeRangeFilter 
              onDateRangeChange={handleDateRangeChange}
              className="w-full max-w-sm"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="engagement">{isRTL ? 'التفاعل' : 'Engagement'}</TabsTrigger>
            <TabsTrigger value="applications">{isRTL ? 'الطلبات' : 'Applications'}</TabsTrigger>
            <TabsTrigger value="geographic">{isRTL ? 'جغرافي' : 'Geographic'}</TabsTrigger>
            <TabsTrigger value="performance">{isRTL ? 'الأداء' : 'Performance'}</TabsTrigger>
            <TabsTrigger value="advanced">{isRTL ? 'متقدم' : 'Advanced'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي المشاهدات' : 'Total Views'}</p>
                       <div className="flex items-center gap-1 mt-1">
                         {trends.views?.isPositive ? 
                           <TrendingUp className="w-3 h-3 text-green-500" /> : 
                           <TrendingDown className="w-3 h-3 text-red-500" />
                         }
                         <span className={`text-xs ${trends.views?.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                           {trends.views?.isPositive ? '+' : ''}{trends.views?.value || 0}%
                         </span>
                       </div>
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
                      <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي الطلبات' : 'Total Applications'}</p>
                       <div className="flex items-center gap-1 mt-1">
                         {trends.applications?.isPositive ? 
                           <TrendingUp className="w-3 h-3 text-green-500" /> : 
                           <TrendingDown className="w-3 h-3 text-red-500" />
                         }
                         <span className={`text-xs ${trends.applications?.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                           {trends.applications?.isPositive ? '+' : ''}{trends.applications?.value || 0}%
                         </span>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalLikes}</p>
                      <p className="text-sm text-muted-foreground">{isRTL ? 'إعجابات' : 'Likes'}</p>
                       <div className="flex items-center gap-1 mt-1">
                         {trends.likes?.isPositive ? 
                           <TrendingUp className="w-3 h-3 text-green-500" /> : 
                           <TrendingDown className="w-3 h-3 text-red-500" />
                         }
                         <span className={`text-xs ${trends.likes?.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                           {trends.likes?.isPositive ? '+' : ''}{trends.likes?.value || 0}%
                         </span>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</p>
                       <div className="flex items-center gap-1 mt-1">
                         {trends.conversion?.isPositive ? 
                           <TrendingUp className="w-3 h-3 text-green-500" /> : 
                           <TrendingDown className="w-3 h-3 text-red-500" />
                         }
                         <span className={`text-xs ${trends.conversion?.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                           {trends.conversion?.isPositive ? '+' : ''}{trends.conversion?.value || 0}%
                         </span>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Views Over Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {isRTL ? 'المشاهدات والطلبات عبر الزمن' : 'Views and Applications Over Time'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name={isRTL ? 'المشاهدات' : 'Views'}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="applications" 
                      stackId="2" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name={isRTL ? 'الطلبات' : 'Applications'}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <EngagementAnalytics opportunityId={opportunityId} analytics={analytics} />
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <ApplicationsAnalytics opportunityId={opportunityId} analytics={analytics} />
          </TabsContent>

          {/* Geographic Analytics Tab */}
          <TabsContent value="geographic" className="space-y-4">
            <GeographicAnalytics opportunityId={opportunityId} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <AdvancedPerformanceMetrics opportunityId={opportunityId} />
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <AdvancedAnalytics opportunityId={opportunityId} analytics={analytics} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};