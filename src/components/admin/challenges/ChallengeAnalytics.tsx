import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSystemLists } from "@/hooks/useSystemLists";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/logger";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar, 
  DollarSign,
  Lightbulb,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

interface Challenge {
  id: string;
  title_ar: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type?: string;
  estimated_budget?: number;
  ideas?: { id: string }[];
  implementation_tracker?: {
    completion_percentage: number;
  }[];
}

interface AnalyticsData {
  overview: {
    totalChallenges: number;
    activeChallenges: number;
    completedChallenges: number;
    totalIdeas: number;
    totalBudget: number;
    averageCompletion: number;
  };
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  bySensitivity: Record<string, number>;
  byType: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    challenges: number;
    ideas: number;
    budget: number;
  }>;
  topPerformers: Array<{
    id: string;
    title: string;
    ideasCount: number;
    completion: number;
    budget: number;
  }>;
}

export function ChallengeAnalytics() {
  const { t } = useUnifiedTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");
  const { toast } = useToast();
  const { timeRangeOptions } = useSystemLists();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch challenges data
      const { data: challenges, error: challengesError } = await supabase
        .from('challenges')
        .select(`
          *,
          ideas(id),
          implementation_tracker(completion_percentage)
        `);

      if (challengesError) throw challengesError;

      // Process analytics data
      const processedAnalytics = processAnalyticsData(challenges || []);
      setAnalytics(processedAnalytics);

    } catch (error) {
      logger.error('Error fetching analytics', { component: 'ChallengeAnalytics', action: 'fetchAnalytics' }, error as Error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات التحليلات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (challenges: Challenge[]): AnalyticsData => {
    const overview = {
      totalChallenges: challenges.length,
      activeChallenges: challenges.filter(c => c.status === 'active').length,
      completedChallenges: challenges.filter(c => c.status === 'completed').length,
      totalIdeas: challenges.reduce((sum, c) => sum + (c.ideas?.length || 0), 0),
      totalBudget: challenges.reduce((sum, c) => sum + (c.estimated_budget || 0), 0),
      averageCompletion: challenges.reduce((sum, c) => sum + (c.implementation_tracker?.[0]?.completion_percentage || 0), 0) / challenges.length
    };

    const byStatus = challenges.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});

    const byPriority = challenges.reduce((acc, c) => {
      acc[c.priority_level] = (acc[c.priority_level] || 0) + 1;
      return acc;
    }, {});

    const bySensitivity = challenges.reduce((acc, c) => {
      acc[c.sensitivity_level] = (acc[c.sensitivity_level] || 0) + 1;
      return acc;
    }, {});

    const byType = challenges.reduce((acc, c) => {
      if (c.challenge_type) {
        acc[c.challenge_type] = (acc[c.challenge_type] || 0) + 1;
      }
      return acc;
    }, {});

    // Mock monthly trends data
    const monthlyTrends = [
      { month: 'يناير', challenges: 12, ideas: 45, budget: 500000 },
      { month: 'فبراير', challenges: 15, ideas: 62, budget: 750000 },
      { month: 'مارس', challenges: 18, ideas: 78, budget: 890000 },
      { month: 'أبريل', challenges: 14, ideas: 56, budget: 680000 },
      { month: 'مايو', challenges: 20, ideas: 89, budget: 950000 },
      { month: 'يونيو', challenges: 16, ideas: 67, budget: 720000 }
    ];

    const topPerformers = challenges
      .map(c => ({
        id: c.id,
        title: c.title_ar,
        ideasCount: c.ideas?.length || 0,
        completion: c.implementation_tracker?.[0]?.completion_percentage || 0,
        budget: c.estimated_budget || 0
      }))
      .sort((a, b) => b.ideasCount - a.ideasCount)
      .slice(0, 5);

    return {
      overview,
      byStatus,
      byPriority,
      bySensitivity,
      byType,
      monthlyTrends,
      topPerformers
    };
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'مسودة',
      active: 'نشط',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      on_hold: 'معلق'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: 'عالي',
      medium: 'متوسط',
      low: 'منخفض'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-card rounded-lg h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-card rounded-lg h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">تحليلات التحديات</h2>
          <p className="text-muted-foreground">نظرة شاملة على أداء التحديات الابتكارية</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="اختر الفترة الزمنية" />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map(range => (
              <SelectItem key={range} value={range}>
                {range === 'all' ? 'جميع الفترات' : range === 'last_30' ? 'آخر 30 يوم' : range === 'last_90' ? 'آخر 90 يوم' : range === 'last_year' ? 'آخر سنة' : range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي التحديات</p>
                <p className="text-3xl font-bold">{analytics.overview.totalChallenges}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">التحديات النشطة</p>
                <p className="text-3xl font-bold text-success">{analytics.overview.activeChallenges}</p>
              </div>
              <CheckCircle className="w-8 h-8 icon-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الأفكار</p>
                <p className="text-3xl font-bold text-primary">{analytics.overview.totalIdeas}</p>
              </div>
              <Lightbulb className="w-8 h-8 icon-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الميزانية</p>
                <p className="text-3xl font-bold text-innovation">
                  {(analytics.overview.totalBudget / 1000000).toFixed(1)}م ريال
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-innovation" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="space-y-6">
        <TabsList>
          <TabsTrigger value="distribution">التوزيع</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribution by Status */}
            <Card>
              <CardHeader>
                <CardTitle>التوزيع حسب الحالة</CardTitle>
                <CardDescription>توزيع التحديات حسب حالة كل منها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getStatusLabel(status)}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / analytics.overview.totalChallenges) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Distribution by Priority */}
            <Card>
              <CardHeader>
                <CardTitle>التوزيع حسب الأولوية</CardTitle>
                <CardDescription>توزيع التحديات حسب مستوى الأولوية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.byPriority).map(([priority, count]) => (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          priority === 'high' ? 'destructive' :
                          priority === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {getPriorityLabel(priority)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / analytics.overview.totalChallenges) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Distribution by Type */}
            <Card>
              <CardHeader>
                <CardTitle>التوزيع حسب النوع</CardTitle>
                <CardDescription>توزيع التحديات حسب نوع كل منها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / analytics.overview.totalChallenges) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Distribution by Sensitivity */}
            <Card>
              <CardHeader>
                <CardTitle>التوزيع حسب الحساسية</CardTitle>
                <CardDescription>توزيع التحديات حسب مستوى الحساسية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.bySensitivity).map(([sensitivity, count]) => (
                  <div key={sensitivity} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{sensitivity}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / analytics.overview.totalChallenges) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>أفضل التحديات أداءً</CardTitle>
                <CardDescription>التحديات الأكثر جذباً للأفكار</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.topPerformers.map((challenge, index) => (
                  <div key={challenge.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{challenge.title}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          {challenge.ideasCount} فكرة
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {(challenge.budget / 1000).toFixed(0)}ك ريال
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{challenge.completion}%</div>
                      <Progress value={challenge.completion} className="w-16 h-1 mt-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Completion Status */}
            <Card>
              <CardHeader>
                <CardTitle>معدل الإنجاز العام</CardTitle>
                <CardDescription>متوسط إنجاز جميع التحديات</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${analytics.overview.averageCompletion}, 100`}
                        className="text-primary"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-muted"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{analytics.overview.averageCompletion.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">مكتملة</p>
                      <p className="font-semibold text-success">{analytics.overview.completedChallenges}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">نشطة</p>
                      <p className="font-semibold text-primary">{analytics.overview.activeChallenges}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي</p>
                      <p className="font-semibold">{analytics.overview.totalChallenges}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الاتجاهات الشهرية</CardTitle>
              <CardDescription>تطور التحديات والأفكار والميزانيات عبر الوقت</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium">{trend.month}</div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 icon-info" />
                          <span className="text-sm">{trend.challenges} تحدي</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Lightbulb className="w-4 h-4 icon-star" />
                          <span className="text-sm">{trend.ideas} فكرة</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 icon-success" />
                          <span className="text-sm">{(trend.budget / 1000).toFixed(0)}ك ريال</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {index > 0 && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 icon-success" />
                          <span className="text-xs text-success">
                            +{((trend.challenges / analytics.monthlyTrends[index - 1].challenges - 1) * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
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