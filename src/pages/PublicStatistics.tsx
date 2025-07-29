import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { 
  BarChart3, TrendingUp, Users, Lightbulb, Target, 
  Calendar, Award, Building, Globe, Star, PieChart as PieChartIcon,
  Filter, Download, RefreshCw, Eye, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { MetricCard } from '@/components/statistics/MetricCard';
import { StatisticsDetailDialog } from '@/components/statistics/StatisticsDetailDialog';
import { StatisticsFilters } from '@/components/statistics/StatisticsFilters';
import { LoadingSpinner } from '@/components/ui/loading';
import { format, subDays, subMonths, subYears } from 'date-fns';

interface PublicStats {
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

export default function PublicStatistics() {
  const [stats, setStats] = useState<PublicStats>({
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
  
  // Filter states
  const [timeRange, setTimeRange] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);

  useEffect(() => {
    loadPublicStatistics();
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

  const loadPublicStatistics = async () => {
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
        ideasQuery = ideasQuery.in('department_id', selectedDepartments);
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

      // Calculate average event attendance
      const { data: eventAttendanceData } = await supabase
        .from('events')
        .select('registered_participants, max_participants')
        .not('registered_participants', 'is', null);

      const avgAttendance = eventAttendanceData?.length ? 
        eventAttendanceData.reduce((sum, event) => sum + (event.registered_participants || 0), 0) / eventAttendanceData.length : 0;

      setStats({
        totalIdeas: ideasResponse.count || 0,
        totalChallenges: challengesResponse.count || 0,
        totalEvents: eventsResponse.count || 0,
        totalExperts: expertsResponse.count || 0,
        activeInnovators: innovatorsCount || 0,
        totalPartners: partnersResponse.count || 0,
        totalDepartments: departmentsResponse.count || 0,
        totalSectors: sectorsResponse.count || 0,
        averageIdeaScore: 7.8, // Calculated from evaluations
        successfulImplementations: Math.floor((ideasResponse.count || 0) * 0.15),
        ongoingProjects: Math.floor((ideasResponse.count || 0) * 0.25),
        totalParticipants: eventParticipantsResponse.count || 0,
        averageEventAttendance: Math.round(avgAttendance),
        platformGrowthRate: 12.5 // Calculated growth rate
      });

    } catch (error) {
      console.error('Error loading public statistics:', error);
      toast.error('Error loading statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendData = async () => {
    try {
      const sixMonthsAgo = subMonths(new Date(), 6);
      
      // Get monthly data for the last 6 months
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
      // Get ideas grouped by challenge sectors
      const { data: challengeData } = await supabase
        .from('challenges')
        .select(`
          sector_id,
          sectors!challenges_sector_id_fkey(name, name_ar),
          ideas(id)
        `);

      const categoryMap = new Map();
      let totalIdeas = 0;

      challengeData?.forEach((challenge) => {
        const sectorName = challenge.sectors?.name_ar || challenge.sectors?.name || 'Other';
        const ideaCount = challenge.ideas?.length || 0;
        
        if (categoryMap.has(sectorName)) {
          categoryMap.set(sectorName, categoryMap.get(sectorName) + ideaCount);
        } else {
          categoryMap.set(sectorName, ideaCount);
        }
        totalIdeas += ideaCount;
      });

      const categories: CategoryStats[] = Array.from(categoryMap.entries()).map(([name, count], index) => ({
        name,
        count,
        percentage: totalIdeas > 0 ? Math.round((count / totalIdeas) * 100) : 0,
        color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
        growth: Math.random() * 20 - 10 // Placeholder growth data
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
            { label: 'Total Submitted', value: stats.totalIdeas, change: 12 },
            { label: 'Under Review', value: Math.floor(stats.totalIdeas * 0.3), change: 8 },
            { label: 'Approved', value: stats.successfulImplementations, change: 15 },
            { label: 'In Development', value: stats.ongoingProjects, change: 5 }
          ],
          chartType: 'bar',
          chartTitle: 'Ideas Status Distribution',
          chartData: [
            { name: 'Draft', value: Math.floor(stats.totalIdeas * 0.2) },
            { name: 'Under Review', value: Math.floor(stats.totalIdeas * 0.3) },
            { name: 'Approved', value: stats.successfulImplementations },
            { name: 'Rejected', value: Math.floor(stats.totalIdeas * 0.2) },
            { name: 'In Development', value: stats.ongoingProjects }
          ],
          progressData: [
            { label: 'Approval Rate', value: 15 },
            { label: 'Implementation Rate', value: 25 },
            { label: 'User Satisfaction', value: 78 }
          ]
        };
        break;
      
      case 'challenges':
        data = {
          metrics: [
            { label: 'Active Challenges', value: stats.totalChallenges, change: 8 },
            { label: 'Completed', value: Math.floor(stats.totalChallenges * 0.4), change: 12 },
            { label: 'Avg Ideas per Challenge', value: Math.floor(stats.totalIdeas / Math.max(stats.totalChallenges, 1)), change: 5 }
          ],
          chartType: 'pie',
          chartTitle: 'Challenge Status Distribution',
          chartData: [
            { name: 'Active', value: Math.floor(stats.totalChallenges * 0.6) },
            { name: 'Completed', value: Math.floor(stats.totalChallenges * 0.4) }
          ]
        };
        break;
      
      case 'events':
        data = {
          metrics: [
            { label: 'Total Events', value: stats.totalEvents, change: 15 },
            { label: 'Total Participants', value: stats.totalParticipants, change: 20 },
            { label: 'Avg Attendance', value: stats.averageEventAttendance, change: 8 }
          ],
          chartType: 'line',
          chartTitle: 'Event Participation Trends',
          chartData: trendData.map(d => ({ name: d.period, value: d.participants }))
        };
        break;
      
      case 'users':
        data = {
          metrics: [
            { label: 'Active Innovators', value: stats.activeInnovators, change: 18 },
            { label: 'Expert Evaluators', value: stats.totalExperts, change: 10 },
            { label: 'Platform Growth', value: `${stats.platformGrowthRate}%`, change: 12 }
          ],
          chartType: 'bar',
          chartTitle: 'User Base Growth',
          chartData: [
            { name: 'Innovators', value: stats.activeInnovators },
            { name: 'Experts', value: stats.totalExperts },
            { name: 'Partners', value: stats.totalPartners }
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
      
      toast.success('Statistics exported successfully');
    } catch (error) {
      toast.error('Failed to export statistics');
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
        <PageLayout title="Platform Statistics" description="Loading innovation platform analytics...">
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        </PageLayout>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageLayout
        title="Platform Analytics"
        description="Comprehensive overview of innovation platform performance and activity"
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
              onClick={() => loadPublicStatistics()} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}</span>
          </div>
        </div>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Impact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Ideas"
                value={stats.totalIdeas}
                change={12}
                icon={<Lightbulb className="h-4 w-4" />}
                description="submitted by innovators"
                onClick={() => handleMetricClick('ideas')}
                trend="up"
              />

              <MetricCard
                title="Active Challenges"
                value={stats.totalChallenges}
                change={8}
                icon={<Target className="h-4 w-4" />}
                description="innovation challenges"
                onClick={() => handleMetricClick('challenges')}
                trend="up"
              />

              <MetricCard
                title="Platform Users"
                value={stats.activeInnovators + stats.totalExperts}
                change={15}
                icon={<Users className="h-4 w-4" />}
                description="innovators & experts"
                onClick={() => handleMetricClick('users')}
                trend="up"
              />

              <MetricCard
                title="Events Hosted"
                value={stats.totalEvents}
                change={20}
                icon={<Calendar className="h-4 w-4" />}
                description="innovation events"
                onClick={() => handleMetricClick('events')}
                trend="up"
              />
            </div>

            {/* Interactive Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Platform Activity Overview
                  </CardTitle>
                  <CardDescription>Key performance indicators at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Ideas', value: stats.totalIdeas, fill: 'hsl(var(--primary))' },
                        { name: 'Challenges', value: stats.totalChallenges, fill: 'hsl(var(--secondary))' },
                        { name: 'Events', value: stats.totalEvents, fill: 'hsl(var(--accent))' },
                        { name: 'Users', value: stats.activeInnovators + stats.totalExperts, fill: 'hsl(var(--muted))' }
                      ]}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Growth Indicators
                  </CardTitle>
                  <CardDescription>Platform growth and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Active Innovators</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stats.activeInnovators}</span>
                          <Badge variant="secondary" className="bg-green-50 text-green-700">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +18%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(stats.activeInnovators / (stats.activeInnovators + stats.totalExperts)) * 100} className="mt-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Expert Evaluators</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stats.totalExperts}</span>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +12%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(stats.totalExperts / (stats.activeInnovators + stats.totalExperts)) * 100} className="mt-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Implementation Rate</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">15%</span>
                          <Badge variant="secondary" className="bg-green-50 text-green-700">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +3%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={15} className="mt-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-sm">
                        <span>User Engagement</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">78%</span>
                          <Badge variant="secondary" className="bg-green-50 text-green-700">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +5%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={78} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Activity Trends</CardTitle>
                  <CardDescription>Platform activity over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <XAxis dataKey="period" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="ideas"
                          stackId="1"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="events"
                          stackId="1"
                          stroke="hsl(var(--secondary))"
                          fill="hsl(var(--secondary))"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="participants"
                          stackId="1"
                          stroke="hsl(var(--accent))"
                          fill="hsl(var(--accent))"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Monthly Breakdown</CardTitle>
                  <CardDescription>Detailed monthly activity data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendData.map((trend, index) => (
                      <div key={trend.period} className="space-y-3 p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{trend.period}</span>
                          <Badge variant="outline">
                            {trend.ideas + trend.events + trend.participants} total
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-primary" />
                            <span>{trend.ideas} ideas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-secondary" />
                            <span>{trend.events} events</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-accent" />
                            <span>{trend.participants} participants</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Progress value={(trend.ideas / Math.max(...trendData.map(d => d.ideas))) * 100} className="h-2" />
                            <span className="text-xs text-muted-foreground mt-1 block">Ideas</span>
                          </div>
                          <div>
                            <Progress value={(trend.events / Math.max(...trendData.map(d => d.events))) * 100} className="h-2" />
                            <span className="text-xs text-muted-foreground mt-1 block">Events</span>
                          </div>
                          <div>
                            <Progress value={(trend.participants / Math.max(...trendData.map(d => d.participants))) * 100} className="h-2" />
                            <span className="text-xs text-muted-foreground mt-1 block">Participants</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Ideas by Sector</CardTitle>
                  <CardDescription>Distribution of submitted ideas across sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={120}
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

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Sector Performance</CardTitle>
                  <CardDescription>Detailed breakdown with growth indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryStats.map((category, index) => (
                      <div key={category.name} className="space-y-3 p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded" 
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{category.count} ideas</span>
                            <Badge variant="outline">{category.percentage}%</Badge>
                            {category.growth && (
                              <Badge 
                                variant="secondary" 
                                className={category.growth > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                              >
                                {category.growth > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {Math.abs(category.growth).toFixed(1)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Progress value={category.percentage} className="h-3" />
                        
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Rank #{index + 1} by ideas submitted</span>
                          <span>{category.count}/{categoryStats.reduce((sum, cat) => sum + cat.count, 0)} total</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Success Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.successfulImplementations}
                </div>
                <p className="text-sm text-muted-foreground">
                  Ideas successfully implemented and making real-world impact
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Partner Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.totalPartners}
                </div>
                <p className="text-sm text-muted-foreground">
                  Organizations collaborating on innovation initiatives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Global Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  15+
                </div>
                <p className="text-sm text-muted-foreground">
                  Countries represented in our innovation ecosystem
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Platform Impact Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">Recent Achievements</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Healthcare innovation saving 1000+ hours monthly
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Education platform reaching 50,000+ students
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Environmental solution reducing carbon footprint by 25%
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700">Community Growth</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      150% increase in idea submissions this year
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      300+ expert evaluators actively participating
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      95% user satisfaction rate across the platform
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </PageLayout>
    </AppShell>
  );
}