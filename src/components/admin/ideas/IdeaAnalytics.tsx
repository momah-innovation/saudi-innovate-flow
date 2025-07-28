import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Star,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalIdeas: number;
    submittedThisMonth: number;
    approvedIdeas: number;
    averageScore: number;
    topInnovators: Array<{
      id: string;
      name: string;
      score: number;
      ideas_count: number;
    }>;
  };
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  maturityDistribution: Array<{
    maturity: string;
    count: number;
    percentage: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  challengePerformance: Array<{
    challenge_id: string;
    challenge_title: string;
    ideas_count: number;
    average_score: number;
  }>;
  timeSeriesData: Array<{
    period: string;
    submitted: number;
    approved: number;
    rejected: number;
  }>;
}

export function IdeaAnalytics() {
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [selectedChallenge, setSelectedChallenge] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe, selectedChallenge]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch ideas data
      const { data: ideas, error: ideasError } = await supabase
        .from('ideas')
        .select(`
          id,
          status,
          maturity_level,
          overall_score,
          challenge_id,
          created_at,
          innovator_id,
          challenges!challenge_id(id, title_ar),
          innovators!innovator_id(id, innovation_score)
        `);

      if (ideasError) throw ideasError;

      // Process analytics data
      const processedAnalytics = processAnalyticsData(ideas || []);
      setAnalytics(processedAnalytics);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات التحليلات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (ideas: any[]): AnalyticsData => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Overview calculations
    const totalIdeas = ideas.length;
    const submittedThisMonth = ideas.filter(idea => {
      const ideaDate = new Date(idea.created_at);
      return ideaDate.getMonth() === currentMonth && ideaDate.getFullYear() === currentYear;
    }).length;
    
    const approvedIdeas = ideas.filter(idea => idea.status === 'approved').length;
    const averageScore = ideas.length > 0 
      ? ideas.reduce((sum, idea) => sum + (idea.overall_score || 0), 0) / ideas.length 
      : 0;

    // Status distribution
    const statusCounts = ideas.reduce((acc, idea) => {
      acc[idea.status] = (acc[idea.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count: count as number,
      percentage: (count / totalIdeas) * 100
    }));

    // Maturity distribution
    const maturityCounts = ideas.reduce((acc, idea) => {
      acc[idea.maturity_level] = (acc[idea.maturity_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maturityDistribution = Object.entries(maturityCounts).map(([maturity, count]) => ({
      maturity,
      count: count as number,
      percentage: (count / totalIdeas) * 100
    }));

    // Score distribution
    const scoreRanges = [
      { range: '0-25', min: 0, max: 25 },
      { range: '26-50', min: 26, max: 50 },
      { range: '51-75', min: 51, max: 75 },
      { range: '76-100', min: 76, max: 100 }
    ];

    const scoreDistribution = scoreRanges.map(({ range, min, max }) => {
      const count = ideas.filter(idea => 
        idea.overall_score >= min && idea.overall_score <= max
      ).length;
      return {
        range,
        count,
        percentage: (count / totalIdeas) * 100
      };
    });

    // Challenge performance
    const challengeGroups = ideas.reduce((acc, idea) => {
      if (idea.challenge_id && idea.challenges) {
        const challengeId = idea.challenge_id;
        if (!acc[challengeId]) {
          acc[challengeId] = {
            challenge_id: challengeId,
            challenge_title: idea.challenges.title_ar,
            ideas: []
          };
        }
        acc[challengeId].ideas.push(idea);
      }
      return acc;
    }, {} as Record<string, any>);

    const challengePerformance = Object.values(challengeGroups).map((group: any) => ({
      challenge_id: group.challenge_id,
      challenge_title: group.challenge_title,
      ideas_count: group.ideas.length,
      average_score: group.ideas.reduce((sum: number, idea: any) => sum + (idea.overall_score || 0), 0) / group.ideas.length
    }));

    // Mock time series data (would be calculated based on actual timeframe)
    const timeSeriesData = [
      { period: 'يناير', submitted: 15, approved: 8, rejected: 3 },
      { period: 'فبراير', submitted: 22, approved: 12, rejected: 5 },
      { period: 'مارس', submitted: 18, approved: 10, rejected: 4 },
      { period: 'أبريل', submitted: 25, approved: 15, rejected: 6 },
      { period: 'مايو', submitted: 20, approved: 11, rejected: 4 },
      { period: 'يونيو', submitted: 28, approved: 18, rejected: 7 }
    ];

    // Top innovators (mock data)
    const topInnovators = [
      { id: '1', name: 'أحمد محمد', score: 95, ideas_count: 8 },
      { id: '2', name: 'فاطمة علي', score: 92, ideas_count: 6 },
      { id: '3', name: 'محمد خالد', score: 88, ideas_count: 7 }
    ];

    return {
      overview: {
        totalIdeas,
        submittedThisMonth,
        approvedIdeas,
        averageScore,
        topInnovators
      },
      statusDistribution,
      maturityDistribution,
      scoreDistribution,
      challengePerformance,
      timeSeriesData
    };
  };

  const handleExport = () => {
    toast({
      title: "جاري التصدير",
      description: "يتم تصدير تقرير التحليلات...",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-card rounded-lg h-48" />
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">لا توجد بيانات للتحليل</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">الأسبوع الحالي</SelectItem>
              <SelectItem value="month">الشهر الحالي</SelectItem>
              <SelectItem value="quarter">الربع الحالي</SelectItem>
              <SelectItem value="year">السنة الحالية</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchAnalytics} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث
          </Button>
        </div>

        <Button onClick={handleExport} size="sm">
          <Download className="w-4 h-4 mr-2" />
          تصدير التقرير
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأفكار</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalIdeas}</div>
            <p className="text-xs text-muted-foreground">
              جميع الأفكار المقدمة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأفكار المرسلة هذا الشهر</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.submittedThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              مقارنة بالشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأفكار المعتمدة</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.approvedIdeas}</div>
            <p className="text-xs text-muted-foreground">
              معدل الموافقة: {((analytics.overview.approvedIdeas / analytics.overview.totalIdeas) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط النقاط</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              من 100 نقطة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="distribution">التوزيع</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
          <TabsTrigger value="innovators">المبتكرون</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع الحالات</CardTitle>
                <CardDescription>توزيع الأفكار حسب الحالة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.statusDistribution.map((item) => (
                    <div key={item.status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {item.status === 'submitted' ? 'مُرسلة' :
                           item.status === 'approved' ? 'موافق عليها' :
                           item.status === 'rejected' ? 'مرفوضة' : item.status}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} ({item.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={item.percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maturity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع مستوى النضج</CardTitle>
                <CardDescription>توزيع الأفكار حسب مستوى النضج</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.maturityDistribution.map((item) => (
                    <div key={item.maturity} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {item.maturity === 'concept' ? 'مفهوم' :
                           item.maturity === 'prototype' ? 'نموذج أولي' :
                           item.maturity === 'pilot' ? 'تجريبي' : 
                           item.maturity === 'scaled' ? 'قابل للتوسع' : item.maturity}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} ({item.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={item.percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع النقاط</CardTitle>
              <CardDescription>توزيع الأفكار حسب نطاقات النقاط</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.scoreDistribution.map((item) => (
                  <div key={item.range} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{item.count}</div>
                    <div className="text-sm text-muted-foreground">{item.range} نقطة</div>
                    <div className="text-xs text-muted-foreground">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أداء التحديات</CardTitle>
              <CardDescription>أداء الأفكار المرتبطة بكل تحدي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.challengePerformance.map((challenge) => (
                  <div key={challenge.challenge_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{challenge.challenge_title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {challenge.ideas_count} فكرة
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {challenge.average_score.toFixed(1)}/100
                      </div>
                      <Badge variant={challenge.average_score >= 70 ? 'default' : 'secondary'}>
                        {challenge.average_score >= 70 ? 'ممتاز' : challenge.average_score >= 50 ? 'جيد' : 'متوسط'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اتجاهات زمنية</CardTitle>
              <CardDescription>تطور عدد الأفكار عبر الوقت</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.timeSeriesData.map((period) => (
                  <div key={period.period} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div className="text-center">
                      <div className="font-medium">{period.period}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{period.submitted}</div>
                      <div className="text-xs text-muted-foreground">مُرسلة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{period.approved}</div>
                      <div className="text-xs text-muted-foreground">معتمدة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{period.rejected}</div>
                      <div className="text-xs text-muted-foreground">مرفوضة</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="innovators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أفضل المبتكرين</CardTitle>
              <CardDescription>المبتكرون الأكثر نشاطاً وتميزاً</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.overview.topInnovators.map((innovator, index) => (
                  <div key={innovator.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{innovator.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {innovator.ideas_count} فكرة
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{innovator.score}</div>
                      <Badge variant="default">نقاط الابتكار</Badge>
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
}