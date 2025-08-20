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
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { StatisticsNotificationCenter } from '@/components/statistics/StatisticsNotificationCenter';
import { 
  BarChart3, TrendingUp, Users, Lightbulb, Target, 
  Calendar, Award, Building, Globe, Star, PieChart as PieChartIcon,
  Filter, Download, RefreshCw, Eye, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { dateHandler } from '@/utils/unified-date-handler';
import { subDays, subMonths, subYears, format } from 'date-fns';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

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
  const { t } = useUnifiedTranslation();
  const { hasRole } = useAuth();

  // Check if user has admin or super_admin role
  if (!hasRole('admin') && !hasRole('super_admin')) {
    return (
      <AppShell>
        <PageLayout 
          title={t('statistics:access.denied')} 
          description={t('statistics:access.no_permission')}
        >
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-2">
              {t('statistics:access.denied')}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t('statistics:access.admin_only')}
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
    loadStatisticsLegacy();
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
      setLoading(true);
      const { useStatisticsData } = await import('@/hooks/useStatisticsData');
      const { loadFilterOptions: loadOptions } = useStatisticsData();
      
      const options = await loadOptions();
      setDepartments(options.departments);
      setSectors(options.sectors);
    } catch (error) {
      logger.error('Error loading filter options', {}, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    // Statistics loading is now handled by useStatisticsConsolidation hook
    try {
      setLoading(true);
      // Data is automatically loaded via the hook
    } catch (error) {
      logger.error('Error loading statistics', {}, error as Error);
    } finally {
      setLoading(false);
    }
  };

  // Temporary fallback to prevent build errors - will be fully replaced by useStatisticsConsolidation hook
  const loadStatisticsLegacy = async () => {
    try {
      setLoading(true);
      const { useStatisticsData } = await import('@/hooks/useStatisticsData');
      const { loadPlatformStats } = useStatisticsData();
      
      await loadPlatformStats({ timeRange, selectedDepartments, selectedSectors });
    } catch (error) {
      logger.error('Error loading statistics', {}, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendData = async () => {
    try {
      const { useStatisticsData } = await import('@/hooks/useStatisticsData');
      const { loadTrendData: loadTrends } = useStatisticsData();
      
      await loadTrends(timeRange);
    } catch (error) {
      logger.error('Error loading trend data', {}, error as Error);
    }
  };

  const loadCategoryStats = async () => {
    try {
      const { useStatisticsData } = await import('@/hooks/useStatisticsData');
      const { loadCategoryStats: loadCategories } = useStatisticsData();
      
      await loadCategories();
    } catch (error) {
      logger.error('Error loading category stats', {}, error as Error);
    }
  };

  const handleMetricClick = (type: 'ideas' | 'challenges' | 'events' | 'users') => {
    let data;
    
    switch (type) {
      case 'ideas':
        data = {
          metrics: [
            { label: t('statistics:detailed_metrics.total_submitted'), value: stats.totalIdeas, change: 12 },
            { label: t('statistics:detailed_metrics.under_review'), value: Math.floor(stats.totalIdeas * 0.3), change: 8 },
            { label: t('statistics:detailed_metrics.approved'), value: stats.successfulImplementations, change: 15 },
            { label: t('statistics:detailed_metrics.in_development'), value: stats.ongoingProjects, change: 5 }
          ],
          chartType: 'bar',
          chartTitle: t('statistics:chart_titles.ideas_status_distribution'),
          chartData: [
            { name: t('statistics:detailed_metrics.draft'), value: Math.floor(stats.totalIdeas * 0.2) },
            { name: t('statistics:detailed_metrics.under_review'), value: Math.floor(stats.totalIdeas * 0.3) },
            { name: t('statistics:detailed_metrics.approved'), value: stats.successfulImplementations },
            { name: t('statistics:detailed_metrics.rejected'), value: Math.floor(stats.totalIdeas * 0.2) },
            { name: t('statistics:detailed_metrics.in_development'), value: stats.ongoingProjects }
          ]
        };
        break;
      
      case 'challenges':
        data = {
          metrics: [
            { label: t('statistics:metrics.active_challenges'), value: stats.totalChallenges, change: 8 },
            { label: t('statistics:detailed_metrics.completed'), value: Math.floor(stats.totalChallenges * 0.4), change: 12 },
            { label: t('statistics:detailed_metrics.avg_ideas_per_challenge'), value: Math.floor(stats.totalIdeas / Math.max(stats.totalChallenges, 1)), change: 5 }
          ],
          chartType: 'pie',
          chartTitle: t('statistics:chart_titles.challenge_status_distribution'),
          chartData: [
            { name: t('statistics:statuses.active'), value: Math.floor(stats.totalChallenges * 0.6) },
            { name: t('statistics:statuses.completed'), value: Math.floor(stats.totalChallenges * 0.4) }
          ]
        };
        break;
      
      case 'events':
        data = {
          metrics: [
            { label: t('statistics:detailed_metrics.total_events'), value: stats.totalEvents, change: 15 },
            { label: t('statistics:detailed_metrics.total_participants'), value: stats.totalParticipants, change: 20 },
            { label: t('statistics:detailed_metrics.avg_attendance'), value: stats.averageEventAttendance, change: 8 }
          ],
          chartType: 'line',
          chartTitle: t('statistics:chart_titles.event_participation_trends'),
          chartData: trendData.map(d => ({ name: d.period, value: d.participants }))
        };
        break;
      
      case 'users':
        data = {
          metrics: [
            { label: t('statistics:metrics.active_innovators'), value: stats.activeInnovators, change: 18 },
            { label: t('statistics:detailed_metrics.expert_evaluators'), value: stats.totalExperts, change: 10 },
            { label: t('statistics:detailed_metrics.platform_growth'), value: `${stats.platformGrowthRate}%`, change: 12 }
          ],
          chartType: 'bar',
          chartTitle: t('statistics:chart_titles.user_base_growth'),
          chartData: [
            { name: t('statistics:detailed_metrics.innovators'), value: stats.activeInnovators },
            { name: t('statistics:detailed_metrics.experts'), value: stats.totalExperts },
            { name: t('statistics:detailed_metrics.partners'), value: stats.totalPartners }
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
      
      toast.success(t('common:messages.export_success'));
    } catch (error) {
      toast.error(t('common:messages.export_error'));
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
          title={t('statistics:page.title')} 
          description={t('statistics:page.description')}
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
        title={t('statistics:page.analytics_title')}
        description={t('statistics:page.analytics_description')}
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
              onClick={() => loadStatisticsLegacy()} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t('statistics:actions.refresh_data')}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {t('statistics:actions.last_updated')} {format(new Date(), 'MMM dd, yyyy HH:mm')}
            </span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('statistics:tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t('statistics:tabs.trends')}
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              {t('statistics:tabs.categories')}
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              {t('statistics:tabs.impact')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title={t('statistics:metrics.total_ideas')}
                value={stats.totalIdeas}
                subtitle={t('statistics:metrics.ideas_submitted')}
                icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
                trend={{
                  value: 12,
                  label: t('statistics:hero.this_month'),
                  direction: 'up'
                }}
                onClick={() => handleMetricClick('ideas')}
              />

              <MetricCard
                title={t('statistics:metrics.active_challenges')}
                value={stats.totalChallenges}
                subtitle={t('statistics:metrics.open_challenges')}
                icon={<Target className="w-5 h-5 text-blue-500" />}
                trend={{
                  value: 8,
                  label: t('statistics:hero.this_month'),
                  direction: 'up'
                }}
                onClick={() => handleMetricClick('challenges')}
              />

              <MetricCard
                title={t('statistics:metrics.events')}
                value={stats.totalEvents}
                subtitle={t('statistics:metrics.events_organized')}
                icon={<Calendar className="w-5 h-5 text-green-500" />}
                trend={{
                  value: 15,
                  label: t('statistics:hero.this_month'),
                  direction: 'up'
                }}
                onClick={() => handleMetricClick('events')}
              />

              <MetricCard
                title={t('statistics:metrics.active_innovators')}
                value={stats.activeInnovators}
                subtitle={t('statistics:metrics.active_users')}
                icon={<Users className="w-5 h-5 text-purple-500" />}
                trend={{
                  value: 18,
                  label: t('statistics:hero.this_month'),
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
                    {t('statistics:metrics.successful_implementations')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{stats.successfulImplementations}</div>
                  <Progress value={(stats.successfulImplementations / stats.totalIdeas) * 100} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round((stats.successfulImplementations / stats.totalIdeas) * 100)}% {t('statistics:hero.success_rate')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building className="w-5 h-5 text-indigo-500" />
                    {t('statistics:metrics.partnerships')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{stats.totalPartners}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{stats.totalDepartments} {t('statistics:metrics.departments')}</Badge>
                    <Badge variant="secondary">{stats.totalSectors} {t('statistics:metrics.sectors')}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    {t('statistics:metrics.average_rating')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{stats.averageIdeaScore.toFixed(1)}/10</div>
                  <Progress value={stats.averageIdeaScore * 10} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {t('statistics:metrics.idea_quality_rating')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('statistics:chart_titles.activity_trends')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {trendData.slice(-3).map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="text-2xl font-bold text-primary">{item.ideas}</div>
                          <div className="text-sm text-muted-foreground">{item.period}</div>
                          <div className="text-xs text-muted-foreground">{t('common:ideas')}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      {t('statistics:chart_titles.activity_trends')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('statistics:chart_titles.ideas_distribution_by_sector')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="space-y-4 w-full max-w-sm">
                      {categoryStats.slice(0, 5).map((category, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: category.color }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{category.name}</span>
                              <span>{category.percentage}%</span>
                            </div>
                            <Progress value={category.percentage} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('statistics:chart_titles.top_sectors')}</CardTitle>
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
                    {t('statistics:impact.social_impact')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.successfulImplementations * 1000}+
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('statistics:impact.people_benefited')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {t('statistics:impact.economic_impact')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {(stats.successfulImplementations * 2.5).toFixed(1)}M {t('statistics:sar')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('statistics:impact.economic_value_added')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {t('statistics:impact.platform_growth')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    +{stats.platformGrowthRate}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('statistics:impact.monthly_user_growth')}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t('statistics:impact.key_performance_indicators')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {t('statistics:impact.idea_acceptance_rate')}
                      </span>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {t('statistics:impact.implementation_rate')}
                      </span>
                      <span className="text-sm text-muted-foreground">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {t('statistics:impact.user_engagement')}
                      </span>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {t('statistics:impact.user_satisfaction')}
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
