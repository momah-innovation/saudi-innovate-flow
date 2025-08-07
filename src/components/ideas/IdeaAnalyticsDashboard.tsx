import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { ChartPlaceholder } from '@/components/common/ChartPlaceholder'
import { 
  Lightbulb, TrendingUp, TrendingDown, Target, Trophy, 
  Star, Eye, Heart, MessageSquare, CheckCircle, Clock,
   Users, Building, Zap, Award, RefreshCw, Download
 } from 'lucide-react';
import { logger } from '@/utils/logger';

interface IdeaAnalytics {
  overview: {
    totalIdeas: number;
    approvedIdeas: number;
    implementedIdeas: number;
    averageScore: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    implementationRate: number;
  };
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  maturityDistribution: Array<{
    level: string;
    count: number;
    percentage: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    ideas: number;
    approved: number;
    implemented: number;
  }>;
  topSectors: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  topChallenges: Array<{
    title: string;
    ideas: number;
    avgScore: number;
  }>;
}

interface IdeaAnalyticsDashboardProps {
  className?: string;
}

export function IdeaAnalyticsDashboard({ className }: IdeaAnalyticsDashboardProps) {
  const { isRTL } = useDirection();
  const { userProfile } = useAuth();
  const [analytics, setAnalytics] = useState<IdeaAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case '1month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(startDate.getMonth() - 6);
      }

      // Fetch ideas data
      const { data: ideas, error } = await supabase
        .from('ideas')
        .select(`
          *,
          challenges!ideas_challenge_id_fkey(
            title_ar,
            sectors!challenges_sector_id_fkey(name_ar)
          )
        `)
        .neq('status', 'draft')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Process analytics data
      const processedAnalytics = processIdeasData(ideas || []);
      setAnalytics(processedAnalytics);

    } catch (error) {
      logger.error('Error loading idea analytics', { component: 'IdeaAnalyticsDashboard', action: 'loadAnalytics' }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const processIdeasData = (ideas: any[]): IdeaAnalytics => {
    const totalIdeas = ideas.length;
    const approvedIdeas = ideas.filter(i => i.status === 'approved').length;
    const implementedIdeas = ideas.filter(i => i.status === 'implemented').length;
    const totalViews = ideas.reduce((sum, i) => sum + (i.view_count || 0), 0);
    const totalLikes = ideas.reduce((sum, i) => sum + (i.like_count || 0), 0);
    const totalComments = ideas.reduce((sum, i) => sum + (i.comment_count || 0), 0);
    const averageScore = ideas.length > 0 ? ideas.reduce((sum, i) => sum + (i.overall_score || 0), 0) / ideas.length : 0;
    const implementationRate = totalIdeas > 0 ? (implementedIdeas / totalIdeas) * 100 : 0;

    // Status distribution
    const statusCounts = ideas.reduce((acc, idea) => {
      acc[idea.status] = (acc[idea.status] || 0) + 1;
      return acc;
    }, {});

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      name: getStatusText(status),
      value: count as number,
      color: getStatusColor(status)
    }));

    // Maturity distribution
    const maturityCounts = ideas.reduce((acc, idea) => {
      acc[idea.maturity_level] = (acc[idea.maturity_level] || 0) + 1;
      return acc;
    }, {});

    const maturityDistribution = Object.entries(maturityCounts).map(([level, count]) => ({
      level: getMaturityText(level),
      count: count as number,
      percentage: totalIdeas > 0 ? ((count as number) / totalIdeas) * 100 : 0
    }));

    // Score distribution
    const scoreRanges = [
      { range: '0-2', min: 0, max: 2 },
      { range: '2-4', min: 2, max: 4 },
      { range: '4-6', min: 4, max: 6 },
      { range: '6-8', min: 6, max: 8 },
      { range: '8-10', min: 8, max: 10 }
    ];

    const scoreDistribution = scoreRanges.map(range => ({
      range: range.range,
      count: ideas.filter(i => (i.overall_score || 0) >= range.min && (i.overall_score || 0) < range.max).length
    }));

    // Monthly trends
    const monthlyData = generateMonthlyTrends(ideas);

    // Top sectors
    const sectorCounts = ideas.reduce((acc, idea) => {
      const sector = idea.challenges?.sectors?.name_ar || 'غير محدد';
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {});

    const topSectors = Object.entries(sectorCounts)
      .map(([name, count]) => ({
        name,
        count: count as number,
        percentage: totalIdeas > 0 ? ((count as number) / totalIdeas) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top challenges
    const challengeCounts = ideas.reduce((acc, idea) => {
      if (idea.challenges?.title_ar) {
        const title = idea.challenges.title_ar;
        if (!acc[title]) {
          acc[title] = { count: 0, totalScore: 0 };
        }
        acc[title].count += 1;
        acc[title].totalScore += (idea.overall_score || 0);
      }
      return acc;
    }, {});

    const topChallenges = Object.entries(challengeCounts)
      .map(([title, data]: [string, any]) => ({
        title,
        ideas: data.count,
        avgScore: data.count > 0 ? data.totalScore / data.count : 0
      }))
      .sort((a, b) => b.ideas - a.ideas)
      .slice(0, 5);

    return {
      overview: {
        totalIdeas,
        approvedIdeas,
        implementedIdeas,
        averageScore,
        totalViews,
        totalLikes,
        totalComments,
        implementationRate
      },
      statusDistribution,
      maturityDistribution,
      scoreDistribution,
      monthlyTrends: monthlyData,
      topSectors,
      topChallenges
    };
  };

  const generateMonthlyTrends = (ideas: any[]) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('ar-SA', { month: 'long' });
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      
      const monthIdeas = ideas.filter(idea => {
        const ideaDate = new Date(idea.created_at);
        return ideaDate >= date && ideaDate < nextMonth;
      });
      
      months.push({
        month: monthName,
        ideas: monthIdeas.length,
        approved: monthIdeas.filter(i => i.status === 'approved').length,
        implemented: monthIdeas.filter(i => i.status === 'implemented').length
      });
    }
    
    return months;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return 'مُقدمة';
      case 'under_review': return 'قيد المراجعة';
      case 'approved': return 'معتمدة';
      case 'rejected': return 'مرفوضة';
      case 'in_development': return 'قيد التطوير';
      case 'implemented': return 'منفذة';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return '#6B7280';
      case 'under_review': return '#3B82F6';
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'in_development': return '#8B5CF6';
      case 'implemented': return '#059669';
      default: return '#6B7280';
    }
  };

  const getMaturityText = (level: string) => {
    switch (level) {
      case 'concept': return 'مفهوم';
      case 'prototype': return 'نموذج أولي';
      case 'pilot': return 'تجريبي';
      case 'production': return 'إنتاج';
      default: return level;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
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
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">تحليلات الأفكار</h2>
          <p className="text-muted-foreground">نظرة شاملة على إحصائيات الأفكار الابتكارية</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="1month">آخر شهر</option>
            <option value="3months">آخر 3 أشهر</option>
            <option value="6months">آخر 6 أشهر</option>
            <option value="1year">آخر سنة</option>
          </select>
          
          <Button variant="outline" size="icon" onClick={loadAnalytics}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الأفكار</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.overview.totalIdeas}</p>
                <p className="text-xs text-muted-foreground mt-1">جميع الأفكار المقدمة</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الأفكار المعتمدة</p>
                <p className="text-3xl font-bold text-green-600">{analytics.overview.approvedIdeas}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.overview.totalIdeas > 0 ? 
                    `${((analytics.overview.approvedIdeas / analytics.overview.totalIdeas) * 100).toFixed(1)}%` : 
                    '0%'
                  } من الإجمالي
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">معدل التنفيذ</p>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics.overview.implementationRate.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.overview.implementedIdeas} من {analytics.overview.totalIdeas} أفكار
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متوسط التقييم</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {analytics.overview.averageScore.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">من 10 نقاط</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="sectors">القطاعات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">توزيع الحالات</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="توزيع الحالات" />
              </CardContent>
            </Card>

            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">توزيع التقييمات</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="توزيع التقييمات" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الاتجاهات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder title="الاتجاهات الشهرية" height={400} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Maturity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">مستويات النضج</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.maturityDistribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.level}</span>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {item.percentage.toFixed(1)}% من إجمالي الأفكار
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">أهم التحديات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topChallenges.map((challenge, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2">{challenge.title}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {challenge.ideas} فكرة
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                            <span className="text-xs">
                              {challenge.avgScore.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">توزيع القطاعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topSectors.map((sector, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{sector.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{sector.count}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {sector.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={sector.percentage} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}