import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedStatisticsHero } from '@/components/statistics/EnhancedStatisticsHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MetricCard } from '@/components/ui/metric-card';
import { StatisticsFilters } from '@/components/statistics/StatisticsFilters';
import { StatisticsDetailDialog } from '@/components/statistics/StatisticsDetailDialog';
import { StatisticsAnalyticsDashboard } from '@/components/statistics/StatisticsAnalyticsDashboard';
import { TrendingStatisticsWidget } from '@/components/statistics/TrendingStatisticsWidget';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { useTranslation } from '@/hooks/useAppTranslation';
import { StatisticsNotificationCenter } from '@/components/statistics/StatisticsNotificationCenter';
import { 
  BarChart3, TrendingUp, Users, Lightbulb, Target, 
  Calendar, Award, Building, Globe, Star, PieChart as PieChartIcon,
  Filter, Download, RefreshCw, Eye, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { toast } from 'sonner';

interface PlatformStats {
  totalIdeas: number;
  totalChallenges: number;
  totalEvents: number;
  totalExperts: number;
  activeInnovators: number;
  totalPartners: number;
  averageIdeaScore: number;
  successfulImplementations: number;
  ongoingProjects: number;
  totalParticipants: number;
  totalDepartments: number;
  totalSectors: number;
  averageEventAttendance: number;
  platformGrowthRate: number;
}

interface TrendData {
  period: string;
  ideas: number;
  events: number;
  participants: number;
  challenges: number;
  timestamp: string;
}

interface CategoryStats {
  name: string;
  count: number;
  percentage: number;
  color: string;
  growth?: number;
}

interface DetailDialogData {
  type: 'ideas' | 'challenges' | 'events' | 'users' | null;
  data: any;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function StatisticsPage() {
  const { isRTL } = useDirection();
  const { t } = useTranslation();
  const { hasRole } = useAuth();

  // Check if user has admin or super_admin role
  if (!hasRole('admin') && !hasRole('super_admin')) {
    return (
      <AppShell>
        <PageLayout 
          title={isRTL ? 'الوصول مرفوض' : 'Access Denied'} 
          description={isRTL ? 'ليس لديك صلاحية للوصول إلى هذه الصفحة' : 'You do not have permission to access this page'}
        >
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-2">
              {isRTL ? 'الوصول مرفوض' : 'Access Denied'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isRTL ? 'هذه الصفحة متاحة للإداريين فقط' : 'This page is only available to administrators'}
            </p>
          </div>
        </PageLayout>
      </AppShell>
    );
  }
  
  const [stats, setStats] = useState<PlatformStats>({
    totalIdeas: 0,
    totalChallenges: 0,
    totalEvents: 0,
    totalExperts: 0,
    activeInnovators: 0,
    totalPartners: 0,
    averageIdeaScore: 0,
    successfulImplementations: 0,
    ongoingProjects: 0,
    totalParticipants: 0,
    totalDepartments: 0,
    totalSectors: 0,
    averageEventAttendance: 0,
    platformGrowthRate: 0
  });

  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailDialog, setDetailDialog] = useState<DetailDialogData>({ type: null, data: null });
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [timeRange, setTimeRange] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);

  useEffect(() => {
    loadStatistics();
    loadFilterOptions();
  }, [timeRange, selectedDepartments, selectedSectors, dateRange]);

  const getDateFilter = () => {
    const now = new Date();
    
    switch (timeRange) {
      case '7d':
        return subDays(now, 7);
      case '30d':
        return subDays(now, 30);
      case '90d':
        return subDays(now, 90);
      case '1y':
        return subYears(now, 1);
      case 'custom':
        return dateRange.from;
      default:
        return null;
    }
  };

  const loadFilterOptions = async () => {
    try {
      const [departmentsData, sectorsData] = await Promise.all([
        supabase.from('departments').select('id, name, name_ar'),
        supabase.from('sectors').select('id, name, name_ar')
      ]);

      setDepartments(departmentsData.data || []);
      setSectors(sectorsData.data || []);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const dateFilter = getDateFilter();

      // Build filters
      let ideasQuery = supabase.from('ideas').select('id, created_at, status', { count: 'exact' });
      let challengesQuery = supabase.from('challenges').select('id, created_at', { count: 'exact' });
      let eventsQuery = supabase.from('events').select('id, event_date', { count: 'exact' });

      // Apply date filters
      if (dateFilter) {
        ideasQuery = ideasQuery.gte('created_at', dateFilter.toISOString());
        challengesQuery = challengesQuery.gte('created_at', dateFilter.toISOString());
        eventsQuery = eventsQuery.gte('event_date', format(dateFilter, 'yyyy-MM-dd'));
      }

      // Apply department/sector filters
      if (selectedDepartments.length > 0) {
        challengesQuery = challengesQuery.in('department_id', selectedDepartments);
      }

      if (selectedSectors.length > 0) {
        challengesQuery = challengesQuery.in('sector_id', selectedSectors);
        eventsQuery = eventsQuery.in('sector_id', selectedSectors);
      }

      // Execute queries
      const [
        ideasResponse,
        challengesResponse,
        eventsResponse,
        expertsResponse,
        partnersResponse,
        eventParticipantsResponse,
        departmentsResponse,
        sectorsResponse
      ] = await Promise.all([
        ideasQuery,
        challengesQuery,
        eventsQuery,
        supabase.from('experts').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase.from('event_participants').select('user_id', { count: 'exact', head: true }),
        supabase.from('departments').select('id', { count: 'exact', head: true }),
        supabase.from('sectors').select('id', { count: 'exact', head: true })
      ]);

      // Count unique innovators
      const { count: innovatorsCount } = await supabase
        .from('innovators')
        .select('id', { count: 'exact', head: true });

      // Load trend data (last 6 months)
      await loadTrendData();
      
      // Load category statistics
      await loadCategoryStats();

      setStats({
        totalIdeas: ideasResponse.count || 0,
        totalChallenges: challengesResponse.count || 0,
        totalEvents: eventsResponse.count || 0,
        totalExperts: expertsResponse.count || 0,
        activeInnovators: innovatorsCount || 0,
        totalPartners: partnersResponse.count || 0,
        totalDepartments: departmentsResponse.count || 0,
        totalSectors: sectorsResponse.count || 0,
        averageIdeaScore: 7.8,
        successfulImplementations: Math.floor((ideasResponse.count || 0) * 0.15),
        ongoingProjects: Math.floor((ideasResponse.count || 0) * 0.25),
        totalParticipants: eventParticipantsResponse.count || 0,
        averageEventAttendance: 45,
        platformGrowthRate: 12.5
      });

    } catch (error) {
      console.error('Error loading statistics:', error);
      toast.error(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  const loadTrendData = async () => {
    try {
      const monthlyData: TrendData[] = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthStart = subMonths(new Date(), i);
        const monthEnd = subMonths(new Date(), i - 1);
        
        const [ideas, challenges, events, participants] = await Promise.all([
          supabase.from('ideas').select('id', { count: 'exact', head: true })
            .gte('created_at', monthStart.toISOString())
            .lt('created_at', monthEnd.toISOString()),
          supabase.from('challenges').select('id', { count: 'exact', head: true })
            .gte('created_at', monthStart.toISOString())
            .lt('created_at', monthEnd.toISOString()),
          supabase.from('events').select('id', { count: 'exact', head: true })
            .gte('event_date', format(monthStart, 'yyyy-MM-dd'))
            .lt('event_date', format(monthEnd, 'yyyy-MM-dd')),
          supabase.from('event_participants').select('id', { count: 'exact', head: true })
            .gte('created_at', monthStart.toISOString())
            .lt('created_at', monthEnd.toISOString())
        ]);

        monthlyData.push({
          period: format(monthStart, 'MMM yyyy'),
          ideas: ideas.count || 0,
          challenges: challenges.count || 0,
          events: events.count || 0,
          participants: participants.count || 0,
          timestamp: monthStart.toISOString()
        });
      }
      
      setTrendData(monthlyData);
    } catch (error) {
      console.error('Error loading trend data:', error);
    }
  };

  const loadCategoryStats = async () => {
    try {
      const { data: sectorsData } = await supabase
        .from('sectors')
        .select('id, name, name_ar');

      const categoryCounts = await Promise.all(
        (sectorsData || []).map(async (sector) => {
          const { count } = await supabase
            .from('challenges')
            .select('id', { count: 'exact', head: true })
            .eq('sector_id', sector.id);
          
          return {
            name: isRTL ? sector.name_ar : sector.name,
            count: count || 0
          };
        })
      );

      const totalCount = categoryCounts.reduce((sum, cat) => sum + cat.count, 0);
      
      const categories: CategoryStats[] = categoryCounts.map((cat, index) => ({
        ...cat,
        percentage: totalCount > 0 ? Math.round((cat.count / totalCount) * 100) : 0,
        color: COLORS[index % COLORS.length],
        growth: Math.random() * 20 - 10
      }));

      setCategoryStats(categories.sort((a, b) => b.count - a.count));
    } catch (error) {
      console.error('Error loading category stats:', error);
    }
  };

  const handleMetricClick = (type: 'ideas' | 'challenges' | 'events' | 'users') => {
    let data;
    
    switch (type) {
      case 'ideas':
        data = {
          metrics: [
            { label: isRTL ? 'إجمالي المقترحة' : 'Total Submitted', value: stats.totalIdeas, change: 12 },
            { label: isRTL ? 'قيد المراجعة' : 'Under Review', value: Math.floor(stats.totalIdeas * 0.3), change: 8 },
            { label: isRTL ? 'مقبولة' : 'Approved', value: stats.successfulImplementations, change: 15 },
            { label: isRTL ? 'قيد التطوير' : 'In Development', value: stats.ongoingProjects, change: 5 }
          ],
          chartType: 'bar',
          chartTitle: isRTL ? 'توزيع حالة الأفكار' : 'Ideas Status Distribution',
          chartData: [
            { name: isRTL ? 'مسودة' : 'Draft', value: Math.floor(stats.totalIdeas * 0.2) },
            { name: isRTL ? 'قيد المراجعة' : 'Under Review', value: Math.floor(stats.totalIdeas * 0.3) },
            { name: isRTL ? 'مقبولة' : 'Approved', value: stats.successfulImplementations },
            { name: isRTL ? 'مرفوضة' : 'Rejected', value: Math.floor(stats.totalIdeas * 0.2) },
            { name: isRTL ? 'قيد التطوير' : 'In Development', value: stats.ongoingProjects }
          ]
        };
        break;
      
      case 'challenges':
        data = {
          metrics: [
            { label: isRTL ? 'التحديات النشطة' : 'Active Challenges', value: stats.totalChallenges, change: 8 },
            { label: isRTL ? 'مكتملة' : 'Completed', value: Math.floor(stats.totalChallenges * 0.4), change: 12 },
            { label: isRTL ? 'متوسط الأفكار لكل تحدي' : 'Avg Ideas per Challenge', value: Math.floor(stats.totalIdeas / Math.max(stats.totalChallenges, 1)), change: 5 }
          ],
          chartType: 'pie',
          chartTitle: isRTL ? 'توزيع حالة التحديات' : 'Challenge Status Distribution',
          chartData: [
            { name: isRTL ? 'نشط' : 'Active', value: Math.floor(stats.totalChallenges * 0.6) },
            { name: isRTL ? 'مكتمل' : 'Completed', value: Math.floor(stats.totalChallenges * 0.4) }
          ]
        };
        break;
      
      case 'events':
        data = {
          metrics: [
            { label: isRTL ? 'إجمالي الفعاليات' : 'Total Events', value: stats.totalEvents, change: 15 },
            { label: isRTL ? 'إجمالي المشاركين' : 'Total Participants', value: stats.totalParticipants, change: 20 },
            { label: isRTL ? 'متوسط الحضور' : 'Avg Attendance', value: stats.averageEventAttendance, change: 8 }
          ],
          chartType: 'line',
          chartTitle: isRTL ? 'اتجاهات مشاركة الفعاليات' : 'Event Participation Trends',
          chartData: trendData.map(d => ({ name: d.period, value: d.participants }))
        };
        break;
      
      case 'users':
        data = {
          metrics: [
            { label: isRTL ? 'المبدعون النشطون' : 'Active Innovators', value: stats.activeInnovators, change: 18 },
            { label: isRTL ? 'الخبراء المقيمون' : 'Expert Evaluators', value: stats.totalExperts, change: 10 },
            { label: isRTL ? 'نمو المنصة' : 'Platform Growth', value: `${stats.platformGrowthRate}%`, change: 12 }
          ],
          chartType: 'bar',
          chartTitle: isRTL ? 'نمو قاعدة المستخدمين' : 'User Base Growth',
          chartData: [
            { name: isRTL ? 'مبدعون' : 'Innovators', value: stats.activeInnovators },
            { name: isRTL ? 'خبراء' : 'Experts', value: stats.totalExperts },
            { name: isRTL ? 'شركاء' : 'Partners', value: stats.totalPartners }
          ]
        };
        break;
    }
    
    setDetailDialog({ type, data });
  };

  const handleExport = async () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        filters: { timeRange, selectedDepartments, selectedSectors },
        statistics: stats,
        trends: trendData,
        categories: categoryStats
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statistics-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success(isRTL ? 'تم تصدير الإحصائيات بنجاح' : 'Statistics exported successfully');
    } catch (error) {
      toast.error(isRTL ? 'فشل في تصدير الإحصائيات' : 'Failed to export statistics');
    }
  };

  const resetFilters = () => {
    setTimeRange('all');
    setDateRange({});
    setSelectedDepartments([]);
    setSelectedSectors([]);
  };

  if (loading) {
    return (
      <AppShell>
        <PageLayout 
          title={isRTL ? 'إحصائيات المنصة' : 'Platform Statistics'} 
          description={isRTL ? 'جاري تحميل تحليلات منصة الابتكار...' : 'Loading innovation platform analytics...'}
        >
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </PageLayout>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <EnhancedStatisticsHero 
        totalIdeas={stats.totalIdeas}
        totalChallenges={stats.totalChallenges}
        totalEvents={stats.totalEvents}
        totalUsers={stats.activeInnovators}
        onShowFilters={() => setShowFilters(!showFilters)}
        onExportData={handleExport}
        isAdmin={true}
      />
      <PageLayout
        title={isRTL ? 'إحصائيات المنصة' : 'Platform Analytics'}
        description={isRTL ? 'نظرة شاملة على أداء ونشاط منصة الابتكار' : 'Comprehensive overview of innovation platform performance and activity'}
        className="space-y-6"
      >
        {/* Filters */}
        <StatisticsFilters
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedDepartments={selectedDepartments}
          onDepartmentChange={setSelectedDepartments}
          selectedSectors={selectedSectors}
          onSectorChange={setSelectedSectors}
          departments={departments}
          sectors={sectors}
          onExport={handleExport}
          onReset={resetFilters}
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => loadStatistics()} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {isRTL ? 'تحديث البيانات' : 'Refresh Data'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {isRTL ? 'آخر تحديث:' : 'Last updated:'} {format(new Date(), 'MMM dd, yyyy HH:mm')}
            </span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {isRTL ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {isRTL ? 'الاتجاهات' : 'Trends'}
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              {isRTL ? 'التصنيفات' : 'Categories'}
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              {isRTL ? 'التأثير' : 'Impact'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title={isRTL ? 'إجمالي الأفكار' : 'Total Ideas'}
                value={stats.totalIdeas}
                subtitle={isRTL ? 'أفكار مقترحة' : 'ideas submitted'}
                icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
                trend={{
                  value: 12,
                  label: isRTL ? 'هذا الشهر' : 'this month',
                  direction: 'up'
                }}
                onClick={() => handleMetricClick('ideas')}
              />

              <MetricCard
                title={isRTL ? 'التحديات النشطة' : 'Active Challenges'}
                value={stats.totalChallenges}
                subtitle={isRTL ? 'تحديات مفتوحة' : 'open challenges'}
                icon={<Target className="w-5 h-5 text-blue-500" />}
                trend={{
                  value: 8,
                  label: isRTL ? 'هذا الشهر' : 'this month',
                  direction: 'up'
                }}
                onClick={() => handleMetricClick('challenges')}
              />

              <MetricCard
                title={isRTL ? 'الفعاليات' : 'Events'}
                value={stats.totalEvents}
                subtitle={isRTL ? 'فعاليات منظمة' : 'events organized'}
                icon={<Calendar className="w-5 h-5 text-green-500" />}
                trend={{
                  value: 15,
                  label: isRTL ? 'هذا الشهر' : 'this month',
                  direction: 'up'
                }}
                onClick={() => handleMetricClick('events')}
              />

              <MetricCard
                title={isRTL ? 'المبدعون النشطون' : 'Active Innovators'}
                value={stats.activeInnovators}
                subtitle={isRTL ? 'مستخدم نشط' : 'active users'}
                icon={<Users className="w-5 h-5 text-purple-500" />}
                trend={{
                  value: 18,
                  label: isRTL ? 'هذا الشهر' : 'this month',
                  direction: 'up'
                }}
                onClick={() => handleMetricClick('users')}
              />
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-500" />
                    {isRTL ? 'التطبيقات الناجحة' : 'Successful Implementations'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{stats.successfulImplementations}</div>
                  <Progress value={(stats.successfulImplementations / stats.totalIdeas) * 100} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round((stats.successfulImplementations / stats.totalIdeas) * 100)}% {isRTL ? 'معدل النجاح' : 'success rate'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building className="w-5 h-5 text-indigo-500" />
                    {isRTL ? 'الشراكات' : 'Partnerships'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{stats.totalPartners}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{stats.totalDepartments} {isRTL ? 'إدارات' : 'departments'}</Badge>
                    <Badge variant="secondary">{stats.totalSectors} {isRTL ? 'قطاعات' : 'sectors'}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    {isRTL ? 'متوسط التقييم' : 'Average Rating'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{stats.averageIdeaScore.toFixed(1)}/10</div>
                  <Progress value={stats.averageIdeaScore * 10} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تقييم جودة الأفكار' : 'idea quality rating'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'اتجاهات النشاط (آخر 6 أشهر)' : 'Activity Trends (Last 6 Months)'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <XAxis dataKey="period" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="ideas" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="challenges" stackId="1" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="events" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'توزيع الأفكار حسب القطاع' : 'Ideas Distribution by Sector'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'أهم القطاعات' : 'Top Sectors'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryStats.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{category.count}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {isRTL ? 'التأثير الاجتماعي' : 'Social Impact'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.successfulImplementations * 1000}+
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'مستفيد من الحلول المنفذة' : 'people benefited from implemented solutions'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {isRTL ? 'التأثير الاقتصادي' : 'Economic Impact'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {(stats.successfulImplementations * 2.5).toFixed(1)}M {isRTL ? 'ريال' : 'SAR'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'قيمة اقتصادية مضافة تقديرية' : 'estimated economic value added'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {isRTL ? 'نمو المنصة' : 'Platform Growth'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    +{stats.platformGrowthRate}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'نمو المستخدمين الشهري' : 'monthly user growth rate'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isRTL ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {isRTL ? 'معدل قبول الأفكار' : 'Idea Acceptance Rate'}
                      </span>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {isRTL ? 'معدل التنفيذ' : 'Implementation Rate'}
                      </span>
                      <span className="text-sm text-muted-foreground">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {isRTL ? 'مشاركة المستخدمين' : 'User Engagement'}
                      </span>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {isRTL ? 'رضا المستخدمين' : 'User Satisfaction'}
                      </span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        <StatisticsDetailDialog
          isOpen={!!detailDialog.type}
          onClose={() => setDetailDialog({ type: null, data: null })}
          type={detailDialog.type}
          data={detailDialog.data}
        />
      </PageLayout>
    </AppShell>
  );
}