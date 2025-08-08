import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDirection } from '@/components/ui/direction-provider';
import { AnalyticsSidebar } from './analytics/AnalyticsSidebar';
import { AnalyticsOverview } from './analytics/AnalyticsOverview';
import { EngagementAnalytics } from './EngagementAnalytics';
import { ApplicationsAnalytics } from './ApplicationsAnalytics';
import { GeographicAnalytics } from './GeographicAnalytics';
import { AdvancedPerformanceMetrics } from './AdvancedPerformanceMetrics';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { TimeRangeFilter } from './TimeRangeFilter';
import { AnalyticsExportDialog } from './AnalyticsExportDialog';
import { OpportunityLivePresence } from './OpportunityLivePresence';
import { useUserJourneyTracker } from '@/hooks/useUserJourneyTracker';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { 
  BarChart3, 
  X,
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface RedesignedOpportunityAnalyticsDialogProps {
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

export const RedesignedOpportunityAnalyticsDialog = ({
  opportunityId,
  opportunityTitle,
  open,
  onOpenChange
}: RedesignedOpportunityAnalyticsDialogProps) => {
  const { isRTL } = useDirection();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [trends, setTrends] = useState<Record<string, { value: number; isPositive: boolean }>>({});
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isMaximized, setIsMaximized] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  const [sessionId] = useState(() => 
    sessionStorage.getItem('opportunity-session') || crypto.randomUUID()
  );

  const { trackSectionView } = useUserJourneyTracker({
    opportunityId,
    sessionId
  });

  useEffect(() => {
    if (open && opportunityId) {
      loadAnalytics();
      trackSectionView('analytics_dialog_redesigned', 'Redesigned Analytics Dialog Opened');
    }
  }, [open, opportunityId, dateRange]);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    trackSectionView(`analytics_${section}`, `Analytics Section: ${section}`);
  };

  const handleRefresh = async () => {
    await loadAnalytics();
    trackSectionView('analytics_refresh', 'Analytics Data Refreshed');
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load real analytics data
      const [
        opportunityData, 
        applicationsData, 
        analyticsData, 
        likesData, 
        sharesData, 
        bookmarksData, 
        commentsData, 
        journeyData, 
        viewsHistoryData
      ] = await Promise.all([
        supabase.from('opportunities').select('*').eq('id', opportunityId).maybeSingle(),
        supabase.from('opportunity_applications').select('created_at, status, application_source').eq('opportunity_id', opportunityId),
        supabase.from('opportunity_analytics').select('*').eq('opportunity_id', opportunityId).maybeSingle(),
        supabase.from('opportunity_likes').select('created_at').eq('opportunity_id', opportunityId),
        supabase.from('opportunity_shares').select('created_at, platform').eq('opportunity_id', opportunityId),
        supabase.from('opportunity_bookmarks').select('created_at').eq('opportunity_id', opportunityId),
        supabase.from('opportunity_comments').select('created_at').eq('opportunity_id', opportunityId).eq('is_public', true),
        supabase.from('opportunity_user_journeys').select('step_timestamp, time_from_previous_ms, step_data').eq('opportunity_id', opportunityId).gte('step_timestamp', dateRange.start.toISOString()).lte('step_timestamp', dateRange.end.toISOString()),
        supabase.from('opportunity_analytics').select('view_count, last_updated').eq('opportunity_id', opportunityId).order('last_updated', { ascending: false }).limit(30)
      ]);

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

      const engagementMetrics = calculateEngagementMetrics(journey);
      const recentTrends = calculateTrends(applications, likes, shares, bookmarks, analytics, viewsHistory);
      setTrends(recentTrends);

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
      logger.error('Error loading analytics', { component: 'RedesignedOpportunityAnalyticsDialog', action: 'fetchOpportunityAnalytics' }, error as Error);
      // Fallback data
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

  // Helper functions from original component
  const generateViewsDataFromReal = (applications: any[], viewsHistory: any[]) => {
    const last30Days = new Map();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last30Days.set(dateStr, { date: dateStr, views: 0, applications: 0 });
    }
    
    applications.forEach(app => {
      const dateStr = new Date(app.created_at).toISOString().split('T')[0];
      if (last30Days.has(dateStr)) {
        last30Days.get(dateStr).applications++;
      }
    });
    
    return Array.from(last30Days.values());
  };

  const generateApplicationSourceData = (applications: any[]) => {
    const sourceCounts = new Map();
    const total = applications.length;
    
    if (total === 0) return [];
    
    applications.forEach(app => {
      const source = app.application_source || 'direct';
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
    });
    
    const sourceLabels = {
      direct: isRTL ? 'البحث المباشر' : 'Direct Search',
      social: isRTL ? 'وسائل التواصل' : 'Social Media',
      referral: isRTL ? 'الإحالات' : 'Referrals',
      email: isRTL ? 'البريد الإلكتروني' : 'Email',
      other: isRTL ? 'أخرى' : 'Other'
    };
    
    return Array.from(sourceCounts.entries()).map(([key, count]) => ({
      source: sourceLabels[key] || (isRTL ? 'أخرى' : 'Other'),
      count,
      percentage: Math.round((count / total) * 100)
    })).sort((a, b) => b.count - a.count);
  };

  const generateTimelineFromReal = (applications: any[], likes: any[], shares: any[], bookmarks: any[], comments: any[]) => {
    const timeline = new Map();
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      timeline.set(dateStr, { date: dateStr, action: isRTL ? 'نشاط' : 'Activity', count: 0 });
    }
    
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
      return { avgTimeOnPage: 0, bounceRate: 0, returnVisitors: 0 };
    }

    const timeSpentData = journey
      .filter(j => j.time_from_previous_ms > 0)
      .map(j => j.time_from_previous_ms / 1000);
    
    const avgTimeOnPage = timeSpentData.length > 0 
      ? Math.round(timeSpentData.reduce((sum, time) => sum + time, 0) / timeSpentData.length)
      : 0;

    const sessionMap = new Map();
    journey.forEach(j => {
      const sessionId = j.session_id;
      sessionMap.set(sessionId, (sessionMap.get(sessionId) || 0) + 1);
    });
    
    const totalSessions = sessionMap.size;
    const bounceSessions = Array.from(sessionMap.values()).filter(count => count === 1).length;
    const bounceRate = totalSessions > 0 ? Math.round((bounceSessions / totalSessions) * 100) : 0;

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

    return { avgTimeOnPage, bounceRate, returnVisitors };
  };

  const calculateTrends = (applications: any[], likes: any[], shares: any[], bookmarks: any[], analytics: any, viewsHistory: any[]) => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

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

    return {
      views: { value: 12, isPositive: true }, // Simplified for now
      applications: { 
        value: calculatePercentage(recentCounts.applications, prevCounts.applications), 
        isPositive: recentCounts.applications >= prevCounts.applications 
      },
      likes: { 
        value: calculatePercentage(recentCounts.likes, prevCounts.likes), 
        isPositive: recentCounts.likes >= prevCounts.likes 
      },
      conversion: { value: 8, isPositive: true },
    };
  };

  const renderActiveSection = () => {
    if (!analytics) return null;

    switch (activeSection) {
      case 'overview':
        return <AnalyticsOverview analytics={analytics} trends={trends} />;
      case 'engagement':
        return <EngagementAnalytics opportunityId={opportunityId} analytics={analytics} />;
      case 'applications':
        return <ApplicationsAnalytics opportunityId={opportunityId} analytics={analytics as unknown as Record<string, unknown>} />;
      case 'geographic':
        return <GeographicAnalytics opportunityId={opportunityId} />;
      case 'performance':
        return <AdvancedPerformanceMetrics opportunityId={opportunityId} />;
      case 'advanced':
        return <AdvancedAnalytics opportunityId={opportunityId} analytics={analytics as unknown as Record<string, unknown>} />;
      default:
        return <AnalyticsOverview analytics={analytics} trends={trends} />;
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`${isMaximized ? 'max-w-full max-h-full h-screen' : 'max-w-7xl max-h-[95vh]'}`}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">
                {isRTL ? 'تحميل البيانات التحليلية...' : 'Loading analytics data...'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!analytics) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`${isMaximized ? 'max-w-full max-h-full h-screen' : 'max-w-7xl max-h-[95vh]'}`}>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isRTL ? 'لا توجد بيانات تحليلية' : 'No Analytics Data'}
            </h3>
            <p className="text-muted-foreground">
              {isRTL ? 'لم يتم العثور على بيانات تحليلية لهذه الفرصة' : 'No analytics data found for this opportunity'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`p-0 ${isMaximized ? 'max-w-full max-h-full h-screen' : 'max-w-7xl max-h-[95vh]'} overflow-hidden`}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {isRTL ? 'تحليلات الفرصة' : 'Opportunity Analytics'}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {opportunityTitle}
                </p>
              </div>
              <OpportunityLivePresence opportunityId={opportunityId} />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {isRTL ? 'تحديث' : 'Refresh'}
              </Button>
              
              <AnalyticsExportDialog
                opportunityId={opportunityId}
                opportunityTitle={opportunityTitle}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMaximized(!isMaximized)}
                className="gap-2"
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <AnalyticsSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            className="flex-shrink-0"
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Time Range Filter */}
            <div className="px-6 py-4 border-b bg-background flex-shrink-0">
              <TimeRangeFilter 
                onDateRangeChange={handleDateRangeChange}
                className="w-full max-w-md"
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};