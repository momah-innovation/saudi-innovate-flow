import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Target, Lightbulb, Users, TrendingUp, Calendar, Award, Zap, Building,
  Bell, ChevronRight, Star, Trophy, Sparkles, Brain, Activity,
  BarChart3, PieChart, LineChart, Globe, Shield, Cpu, ArrowUp, ArrowDown, Minus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useAppTranslation";
import { supabase } from "@/integrations/supabase/client";
import { useDirection } from "@/components/ui/direction-provider";
import { toast } from "sonner";

interface DashboardStats {
  activeChallenges: number;
  submittedIdeas: number;
  activeStakeholders: number;
  innovationMaturity: number;
  totalEvents: number;
  totalPartners: number;
  avgRating: number;
  successRate: number;
}

interface Achievement {
  id: string;
  achievement_name_ar: string;
  achievement_name_en: string;
  description_ar: string;
  description_en: string;
  points_earned: number;
  badge_icon: string;
  badge_color: string;
  earned_at: string;
  achievement_type: string;
}

interface Notification {
  id: string;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  type: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

interface Trend {
  id: string;
  trend_name_ar: string;
  trend_name_en: string;
  trend_category: string;
  growth_percentage: number;
  current_value: number;
  trend_direction: 'up' | 'down' | 'stable';
}

export const EnhancedDashboardOverview = () => {
  const { userProfile } = useAuth();
  const { t, language } = useTranslation();
  const currentLanguage = language;
  const { isRTL } = useDirection();
  const [stats, setStats] = useState<DashboardStats>({
    activeChallenges: 0,
    submittedIdeas: 0,
    activeStakeholders: 0,
    innovationMaturity: 0,
    totalEvents: 0,
    totalPartners: 0,
    avgRating: 0,
    successRate: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dashboard_notifications'
      }, () => {
        loadNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadStats(),
        loadAchievements(),
        loadNotifications(),
        loadTrends()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('خطأ في تحميل بيانات لوحة القيادة');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const [challengesRes, ideasRes, stakeholdersRes, eventsRes, partnersRes] = await Promise.all([
      supabase.from('challenges').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('ideas').select('id', { count: 'exact' }),
      supabase.from('innovation_team_members').select('id', { count: 'exact' }).eq('status', 'active'),
      supabase.from('events').select('id', { count: 'exact' }),
      supabase.from('partners').select('id', { count: 'exact' })
    ]);

    // Calculate derived metrics
    const totalChallenges = challengesRes.count || 0;
    const totalIdeas = ideasRes.count || 0;
    const innovationMaturity = Math.min(Math.round(((totalIdeas / Math.max(totalChallenges, 1)) * 100) * 0.7), 100);
    
    setStats({
      activeChallenges: totalChallenges,
      submittedIdeas: totalIdeas,
      activeStakeholders: stakeholdersRes.count || 0,
      innovationMaturity,
      totalEvents: eventsRes.count || 0,
      totalPartners: partnersRes.count || 0,
      avgRating: 0,
      successRate: 0
    });
  };

  const loadAchievements = async () => {
    if (!userProfile?.id) return;
    
    // For now, use placeholder data since the migration table structure doesn't match
    setAchievements([
      {
        id: '1',
        achievement_name_ar: 'أول فكرة',
        achievement_name_en: 'First Idea',
        description_ar: 'تم تقديم أول فكرة ابتكارية',
        description_en: 'Submitted your first innovative idea',
        points_earned: 100,
        badge_icon: 'lightbulb',
        badge_color: '#10B981',
        earned_at: new Date().toISOString(),
        achievement_type: 'first_idea'
      }
    ]);
  };

  const loadNotifications = async () => {
    if (!userProfile?.id) return;
    
    // For now, use placeholder data
    setNotifications([
      {
        id: '1',
        title_ar: 'مرحباً بك في لوحة القيادة',
        title_en: 'Welcome to Dashboard',
        message_ar: 'نرحب بك في لوحة القيادة الجديدة والمحسنة للابتكار',
        message_en: 'Welcome to the new and improved innovation dashboard',
        type: 'info',
        is_read: false,
        created_at: new Date().toISOString()
      }
    ]);
  };

  const loadTrends = async () => {
    // For now, use placeholder data
    setTrends([
      {
        id: '1',
        trend_name_ar: 'الذكاء الاصطناعي',
        trend_name_en: 'Artificial Intelligence',
        trend_category: 'technology',
        growth_percentage: 45.2,
        current_value: 245,
        trend_direction: 'up'
      },
      {
        id: '2',
        trend_name_ar: 'إنترنت الأشياء',
        trend_name_en: 'Internet of Things',
        trend_category: 'technology',
        growth_percentage: 32.8,
        current_value: 189,
        trend_direction: 'up'
      }
    ]);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
  };

  const getStatIcon = (index: number) => {
    const icons = [Target, Lightbulb, Users, TrendingUp, Calendar, Building, Star, Trophy];
    return icons[index] || Activity;
  };

  const getStatColor = (index: number) => {
    const colors = [
      'text-primary bg-primary/10',
      'text-innovation bg-innovation/10', 
      'text-accent bg-accent/10',
      'text-success bg-success/10',
      'text-warning bg-warning/10',
      'text-info bg-info/10',
      'text-secondary bg-secondary/10',
      'text-destructive bg-destructive/10'
    ];
    return colors[index] || 'text-muted-foreground bg-muted/10';
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <ArrowUp className="w-4 h-4 text-success" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-destructive" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const statItems = [
    { title: "التحديات النشطة", titleEn: "Active Challenges", value: stats.activeChallenges, change: "+3 هذا الشهر" },
    { title: "الأفكار المقدمة", titleEn: "Submitted Ideas", value: stats.submittedIdeas, change: "+18 هذا الأسبوع" },
    { title: "أصحاب المصلحة", titleEn: "Active Stakeholders", value: stats.activeStakeholders, change: "+5 جديد" },
    { title: "نضج الابتكار", titleEn: "Innovation Maturity", value: `${stats.innovationMaturity}%`, change: "+2% تحسن" },
    { title: "إجمالي الفعاليات", titleEn: "Total Events", value: stats.totalEvents, change: "+1 هذا الشهر" },
    { title: "الشركاء", titleEn: "Partners", value: stats.totalPartners, change: "نشط" },
    { title: "متوسط التقييم", titleEn: "Average Rating", value: stats.avgRating.toFixed(1), change: "⭐ ممتاز" },
    { title: "معدل النجاح", titleEn: "Success Rate", value: `${stats.successRate.toFixed(0)}%`, change: "+5% تحسن" }
  ];

  if (loading) {
    return <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {currentLanguage === 'ar' ? 'مرحباً بك في لوحة القيادة' : 'Welcome to Dashboard'}
              </h1>
              <p className="text-primary-foreground/80">
                {currentLanguage === 'ar' 
                  ? 'نظرة شاملة على منظومة الابتكار والتطوير'
                  : 'Comprehensive overview of innovation ecosystem'}
              </p>
            </div>
            <div className="hidden md:block">
              <img 
                src="/dashboard-images/dashboard-hero.jpg" 
                alt="Dashboard" 
                className="w-24 h-24 rounded-lg object-cover opacity-80"
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {currentLanguage === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            {currentLanguage === 'ar' ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {currentLanguage === 'ar' ? 'الاتجاهات' : 'Trends'}
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            {currentLanguage === 'ar' ? 'الإنجازات' : 'Achievements'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statItems.map((stat, index) => {
              const Icon = getStatIcon(index);
              const colorClass = getStatColor(index);
              return (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {currentLanguage === 'ar' ? stat.title : stat.titleEn}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  {currentLanguage === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.slice(0, 3).map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                      !notification.is_read ? 'bg-primary/5 border-primary/20' : 'bg-background'
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'success' ? 'bg-success/10 text-success' :
                      notification.type === 'warning' ? 'bg-warning/10 text-warning' :
                      notification.type === 'error' ? 'bg-destructive/10 text-destructive' :
                      'bg-info/10 text-info'
                    }`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {currentLanguage === 'ar' ? notification.title_ar : notification.title_en}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {currentLanguage === 'ar' ? notification.message_ar : notification.message_en}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Innovation Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-innovation" />
                  {currentLanguage === 'ar' ? 'خط أنابيب الابتكار' : 'Innovation Pipeline'}
                </CardTitle>
                <CardDescription>
                  {currentLanguage === 'ar' 
                    ? 'توزيع المراحل عبر جميع المبادرات'
                    : 'Stage distribution across all initiatives'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{currentLanguage === 'ar' ? 'طرح الأفكار' : 'Ideation'}</span>
                      <span>15 {currentLanguage === 'ar' ? 'تحدي' : 'challenges'}</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{currentLanguage === 'ar' ? 'التقييم' : 'Evaluation'}</span>
                      <span>8 {currentLanguage === 'ar' ? 'تحدي' : 'challenges'}</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{currentLanguage === 'ar' ? 'تجريبي' : 'Pilot'}</span>
                      <span>4 {currentLanguage === 'ar' ? 'تحدي' : 'challenges'}</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{currentLanguage === 'ar' ? 'توسع' : 'Scale'}</span>
                      <span>2 {currentLanguage === 'ar' ? 'تحدي' : 'challenges'}</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                {currentLanguage === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium">
                    {currentLanguage === 'ar' ? 'إنشاء تحدي جديد' : 'Create New Challenge'}
                  </span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-innovation" />
                  <span className="text-sm font-medium">
                    {currentLanguage === 'ar' ? 'تقديم فكرة' : 'Submit Idea'}
                  </span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Calendar className="w-6 h-6 text-accent" />
                  <span className="text-sm font-medium">
                    {currentLanguage === 'ar' ? 'جدولة فعالية' : 'Schedule Event'}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{currentLanguage === 'ar' ? 'التحليلات المتقدمة' : 'Advanced Analytics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 bg-muted rounded-lg flex items-center justify-center">
                  <img 
                    src="/dashboard-images/analytics-charts.jpg" 
                    alt="Analytics" 
                    className="w-full h-full object-cover rounded-lg opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <p className="text-white font-medium">
                      {currentLanguage === 'ar' ? 'مخططات تفاعلية قادمة' : 'Interactive Charts Coming Soon'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{currentLanguage === 'ar' ? 'مؤشرات الأداء' : 'Performance Metrics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 bg-muted rounded-lg flex items-center justify-center">
                  <img 
                    src="/dashboard-images/innovation-metrics.jpg" 
                    alt="Metrics" 
                    className="w-full h-full object-cover rounded-lg opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <p className="text-white font-medium">
                      {currentLanguage === 'ar' ? 'تتبع مؤشرات الأداء الرئيسية' : 'KPI Tracking Dashboard'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trends.map((trend) => (
              <Dialog key={trend.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">
                          {currentLanguage === 'ar' ? trend.trend_name_ar : trend.trend_name_en}
                        </h3>
                        {getTrendIcon(trend.trend_direction)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{trend.current_value}</span>
                        <Badge variant={trend.growth_percentage > 0 ? 'default' : 'secondary'}>
                          {trend.growth_percentage > 0 ? '+' : ''}{trend.growth_percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {trend.trend_category}
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {currentLanguage === 'ar' ? trend.trend_name_ar : trend.trend_name_en}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {currentLanguage === 'ar' ? 'القيمة الحالية' : 'Current Value'}
                        </label>
                        <p className="text-2xl font-bold">{trend.current_value}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {currentLanguage === 'ar' ? 'معدل النمو' : 'Growth Rate'}
                        </label>
                        <p className="text-2xl font-bold text-success">
                          {trend.growth_percentage > 0 ? '+' : ''}{trend.growth_percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">
                        {currentLanguage === 'ar' ? 'مخطط الاتجاه التفاعلي' : 'Interactive Trend Chart'}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <Card key={achievement.id} className="relative overflow-hidden">
                  <div 
                    className="absolute top-0 right-0 w-2 h-full"
                    style={{ backgroundColor: achievement.badge_color }}
                  ></div>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${achievement.badge_color}20`, color: achievement.badge_color }}
                      >
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {currentLanguage === 'ar' ? achievement.achievement_name_ar : achievement.achievement_name_en}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {currentLanguage === 'ar' ? achievement.description_ar : achievement.description_en}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline">{achievement.points_earned} نقطة</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(achievement.earned_at).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-2">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {currentLanguage === 'ar' ? 'لا توجد إنجازات بعد' : 'No Achievements Yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentLanguage === 'ar' 
                      ? 'ابدأ رحلة الابتكار لكسب الإنجازات والنقاط'
                      : 'Start your innovation journey to earn achievements and points'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};