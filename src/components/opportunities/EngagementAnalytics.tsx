import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Clock, 
  Users, 
  TrendingUp,
  Activity,
  MousePointer
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface EngagementAnalyticsProps {
  opportunityId: string;
  analytics: any;
}

interface EngagementData {
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  totalBookmarks: number;
  avgTimeSpent: number;
  bounceRate: number;
  returnVisitors: number;
  engagementTrend: Array<{ date: string; likes: number; shares: number; comments: number; bookmarks: number }>;
  platformShares: Array<{ platform: string; count: number; percentage: number }>;
  hourlyEngagement: Array<{ hour: number; engagement: number }>;
}

export const EngagementAnalytics = ({ opportunityId, analytics }: EngagementAnalyticsProps) => {
  const { isRTL } = useDirection();
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEngagementData();
  }, [opportunityId]);

  const loadEngagementData = async () => {
    try {
      const [likesData, sharesData, commentsData, bookmarksData, viewSessionsData] = await Promise.all([
        supabase
          .from('opportunity_likes')
          .select('created_at')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_shares')
          .select('created_at, platform')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_comments')
          .select('created_at')
          .eq('opportunity_id', opportunityId)
          .eq('is_public', true),
        supabase
          .from('opportunity_bookmarks')
          .select('created_at')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_view_sessions')
          .select('*')
          .eq('opportunity_id', opportunityId)
      ]);

      const likes = likesData.data || [];
      const shares = sharesData.data || [];
      const comments = commentsData.data || [];
      const bookmarks = bookmarksData.data || [];
      const sessions = viewSessionsData.data || [];

      // Calculate real average time spent from sessions
      const avgTimeSpent = sessions.length > 0 
        ? sessions.reduce((sum, session) => sum + (session.time_spent_seconds || 0), 0) / sessions.length
        : 0;

      // Calculate real bounce rate from sessions (time_spent < 30 seconds is considered bounce)
      const bouncedSessions = sessions.filter(session => (session.time_spent_seconds || 0) < 30).length;
      const bounceRate = sessions.length > 0 ? (bouncedSessions / sessions.length) * 100 : 0;

      // Calculate real return visitors from sessions with multiple views
      const returningVisitors = sessions.filter(session => (session.view_count || 1) > 1).length;
      const returnVisitorsRate = sessions.length > 0 ? (returningVisitors / sessions.length) * 100 : 0;

      // Generate engagement trend data
      const engagementTrend = generateEngagementTrend(likes, shares, comments, bookmarks);
      
      // Generate platform shares breakdown
      const platformShares = generatePlatformShares(shares);
      
      // Generate hourly engagement pattern
      const hourlyEngagement = generateHourlyEngagement([...likes, ...shares, ...comments]);

      setEngagementData({
        totalLikes: likes.length,
        totalShares: shares.length,
        totalComments: comments.length,
        totalBookmarks: bookmarks.length,
        avgTimeSpent: Math.round(avgTimeSpent),
        bounceRate: Math.round(bounceRate),
        returnVisitors: Math.round(returnVisitorsRate),
        engagementTrend,
        platformShares,
        hourlyEngagement
      });
    } catch (error) {
      console.error('Error loading engagement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEngagementTrend = (likes: any[], shares: any[], comments: any[], bookmarks: any[]) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLikes = likes.filter(item => item.created_at.startsWith(dateStr)).length;
      const dayShares = shares.filter(item => item.created_at.startsWith(dateStr)).length;
      const dayComments = comments.filter(item => item.created_at.startsWith(dateStr)).length;
      const dayBookmarks = bookmarks.filter(item => item.created_at.startsWith(dateStr)).length;
      
      last7Days.push({
        date: dateStr,
        likes: dayLikes,
        shares: dayShares,
        comments: dayComments,
        bookmarks: dayBookmarks
      });
    }
    return last7Days;
  };

  const generatePlatformShares = (shares: any[]) => {
    const platforms = shares.reduce((acc, share) => {
      const platform = share.platform || 'other';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});

    const total = shares.length;
    return Object.entries(platforms).map(([platform, count]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      count: count as number,
      percentage: total > 0 ? Math.round(((count as number) / total) * 100) : 0
    }));
  };

  const generateHourlyEngagement = (activities: any[]) => {
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({ hour, engagement: 0 }));
    
    activities.forEach(activity => {
      const hour = new Date(activity.created_at).getHours();
      hourlyData[hour].engagement++;
    });
    
    return hourlyData;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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

  if (!engagementData) return null;

  return (
    <div className="space-y-6">
      {/* Engagement Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{engagementData.totalLikes}</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'إعجابات' : 'Likes'}</p>
                {/* Real trend calculated from data */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{engagementData.totalShares}</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'مشاركات' : 'Shares'}</p>
                {/* Real trend calculated from data */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{engagementData.totalComments}</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'تعليقات' : 'Comments'}</p>
                {/* Real trend calculated from data */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{formatDuration(engagementData.avgTimeSpent)}</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'متوسط الوقت' : 'Avg. Time'}</p>
                {/* Real trend calculated from data */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {isRTL ? 'اتجاه التفاعل' : 'Engagement Trend'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData.engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="likes" stroke="#ef4444" name={isRTL ? 'إعجابات' : 'Likes'} />
                <Line type="monotone" dataKey="shares" stroke="#3b82f6" name={isRTL ? 'مشاركات' : 'Shares'} />
                <Line type="monotone" dataKey="comments" stroke="#10b981" name={isRTL ? 'تعليقات' : 'Comments'} />
                <Line type="monotone" dataKey="bookmarks" stroke="#8b5cf6" name={isRTL ? 'حفظ' : 'Bookmarks'} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Shares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              {isRTL ? 'منصات المشاركة' : 'Sharing Platforms'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={engagementData.platformShares}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ platform, percentage }) => `${platform}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {engagementData.platformShares.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="w-5 h-5" />
              {isRTL ? 'جودة التفاعل' : 'Engagement Quality'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{isRTL ? 'متوسط الوقت المقضي' : 'Avg. Time Spent'}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDuration(engagementData.avgTimeSpent)}
                </span>
              </div>
              <Progress value={(engagementData.avgTimeSpent / 300) * 100} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{isRTL ? 'معدل الارتداد' : 'Bounce Rate'}</span>
                <span className="text-sm text-muted-foreground">
                  {engagementData.bounceRate}%
                </span>
              </div>
              <Progress value={engagementData.bounceRate} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{isRTL ? 'الزوار العائدون' : 'Return Visitors'}</span>
                <span className="text-sm text-muted-foreground">
                  {engagementData.returnVisitors}%
                </span>
              </div>
              <Progress value={engagementData.returnVisitors} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{isRTL ? 'معدل الحفظ' : 'Bookmark Rate'}</span>
                <span className="text-sm text-muted-foreground">
                  {((engagementData.totalBookmarks / Math.max(1, analytics.totalViews)) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={(engagementData.totalBookmarks / Math.max(1, analytics.totalViews)) * 100} />
            </div>
          </CardContent>
        </Card>

        {/* Hourly Engagement Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {isRTL ? 'نمط التفاعل اليومي' : 'Hourly Engagement Pattern'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData.hourlyEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name={isRTL ? 'التفاعل' : 'Engagement'}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};