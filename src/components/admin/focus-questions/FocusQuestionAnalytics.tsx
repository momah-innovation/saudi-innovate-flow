import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSystemLists } from "@/hooks/useSystemLists";
import { 
  BarChart3, 
  TrendingUp, 
  HelpCircle, 
  Users, 
  Calendar, 
  Target,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalQuestions: number;
    activeQuestions: number;
    totalIdeas: number;
    totalEvents: number;
    sensitiveQuestions: number;
    averageResponseRate: number;
  };
  byType: Record<string, number>;
  bySensitivity: Record<string, number>;
  byChallenge: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    questions: number;
    ideas: number;
    events: number;
  }>;
  topPerformers: Array<{
    id: string;
    text: string;
    ideasCount: number;
    eventsCount: number;
    responseRate: number;
  }>;
}

export function FocusQuestionAnalytics() {
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
      // Fetch focus questions data
      const { data: questions, error: questionsError } = await supabase
        .from('focus_questions')
        .select(`
          *,
          ideas(id),
          event_focus_question_links(id)
        `);

      if (questionsError) throw questionsError;

      // Process analytics data
      const processedAnalytics = processAnalyticsData(questions || []);
      setAnalytics(processedAnalytics);

    } catch (error) {
      // Failed to fetch focus question analytics
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات التحليلات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (questions: any[]): AnalyticsData => {
    const overview = {
      totalQuestions: questions.length,
      activeQuestions: questions.filter(q => !q.is_sensitive || q.challenge_id).length,
      sensitiveQuestions: questions.filter(q => q.is_sensitive).length,
      totalIdeas: questions.reduce((sum, q) => sum + (q.ideas?.length || 0), 0),
      totalEvents: questions.reduce((sum, q) => sum + (q.event_focus_question_links?.length || 0), 0),
      averageResponseRate: questions.reduce((sum, q) => sum + (q.ideas?.length || 0), 0) / questions.length || 0
    };

    const byType = questions.reduce((acc, q) => {
      acc[q.question_type] = (acc[q.question_type] || 0) + 1;
      return acc;
    }, {});

    const bySensitivity = questions.reduce((acc, q) => {
      const key = q.is_sensitive ? 'sensitive' : 'normal';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const byChallenge = questions.reduce((acc, q) => {
      const key = q.challenge_id ? 'challenge_linked' : 'general';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Mock monthly trends data
    const monthlyTrends = [
      { month: 'يناير', questions: 8, ideas: 32, events: 4 },
      { month: 'فبراير', questions: 12, ideas: 48, events: 6 },
      { month: 'مارس', questions: 15, ideas: 60, events: 8 },
      { month: 'أبريل', questions: 10, ideas: 40, events: 5 },
      { month: 'مايو', questions: 18, ideas: 72, events: 9 },
      { month: 'يونيو', questions: 14, ideas: 56, events: 7 }
    ];

    const topPerformers = questions
      .map(q => ({
        id: q.id,
        text: q.question_text_ar.substring(0, 50) + '...',
        ideasCount: q.ideas?.length || 0,
        eventsCount: q.event_focus_question_links?.length || 0,
        responseRate: (q.ideas?.length || 0) * 10 // Mock calculation
      }))
      .sort((a, b) => b.ideasCount - a.ideasCount)
      .slice(0, 5);

    return {
      overview,
      byType,
      bySensitivity,
      byChallenge,
      monthlyTrends,
      topPerformers
    };
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      open_ended: 'سؤال مفتوح',
      multiple_choice: 'متعدد الخيارات',
      yes_no: 'نعم/لا',
      rating: 'تقييم',
      ranking: 'ترتيب'
    };
    return labels[type as keyof typeof labels] || type;
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
          <h2 className="text-2xl font-bold">تحليلات الأسئلة المحورية</h2>
          <p className="text-muted-foreground">نظرة شاملة على أداء الأسئلة المحورية والتفاعل معها</p>
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
                <p className="text-sm font-medium text-muted-foreground">إجمالي الأسئلة</p>
                <p className="text-3xl font-bold">{analytics.overview.totalQuestions}</p>
              </div>
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الأسئلة النشطة</p>
                <p className="text-3xl font-bold hero-stats-challenges">{analytics.overview.activeQuestions}</p>
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
                <p className="text-3xl font-bold hero-stats-ideas">{analytics.overview.totalIdeas}</p>
              </div>
              <Users className="w-8 h-8 icon-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الفعاليات المرتبطة</p>
                <p className="text-3xl font-bold hero-stats-users">{analytics.overview.totalEvents}</p>
              </div>
              <Calendar className="w-8 h-8 icon-info" />
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
            {/* Distribution by Type */}
            <Card>
              <CardHeader>
                <CardTitle>التوزيع حسب النوع</CardTitle>
                <CardDescription>توزيع الأسئلة حسب نوع كل منها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getTypeLabel(type)}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / analytics.overview.totalQuestions) * 100}%` }}
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
                <CardDescription>توزيع الأسئلة حسب مستوى الحساسية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.bySensitivity).map(([sensitivity, count]) => (
                  <div key={sensitivity} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={sensitivity === 'sensitive' ? 'destructive' : 'secondary'}
                      >
                        {sensitivity === 'sensitive' ? 'حساس' : 'عادي'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / analytics.overview.totalQuestions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Distribution by Challenge Link */}
            <Card>
              <CardHeader>
                <CardTitle>التوزيع حسب الارتباط</CardTitle>
                <CardDescription>توزيع الأسئلة حسب ارتباطها بالتحديات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.byChallenge).map(([linkType, count]) => (
                  <div key={linkType} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {linkType === 'challenge_linked' ? 'مرتبط بتحدي' : 'سؤال عام'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / analytics.overview.totalQuestions) * 100}%` }}
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
                <CardTitle>أفضل الأسئلة أداءً</CardTitle>
                <CardDescription>الأسئلة الأكثر جذباً للأفكار والتفاعل</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.topPerformers.map((question, index) => (
                  <div key={question.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{question.text}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {question.ideasCount} فكرة
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {question.eventsCount} فعالية
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{question.responseRate}%</div>
                      <Progress value={question.responseRate} className="w-16 h-1 mt-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Response Rate */}
            <Card>
              <CardHeader>
                <CardTitle>معدل الاستجابة العام</CardTitle>
                <CardDescription>متوسط استجابة المبتكرين للأسئلة</CardDescription>
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
                        strokeDasharray={`${analytics.overview.averageResponseRate}, 100`}
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
                      <span className="text-2xl font-bold">{analytics.overview.averageResponseRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">معدل الاستجابة العام</p>
                    <div className="flex justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>تم الإجابة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-muted rounded-full"></div>
                        <span>لم تتم الإجابة</span>
                      </div>
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
              <CardTitle>اتجاهات الأداء الشهرية</CardTitle>
              <CardDescription>تطور الأسئلة والأفكار والفعاليات عبر الوقت</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyTrends.map((trend, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-3 border rounded">
                    <div className="font-medium">{trend.month}</div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">أسئلة</div>
                      <div className="font-bold text-primary">{trend.questions}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">أفكار</div>
                      <div className="font-bold hero-stats-ideas">{trend.ideas}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">فعاليات</div>
                      <div className="font-bold hero-stats-users">{trend.events}</div>
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