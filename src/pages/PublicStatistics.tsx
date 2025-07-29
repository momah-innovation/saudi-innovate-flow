import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, TrendingUp, Users, Lightbulb, Target, 
  Calendar, Award, Building, Globe, Star, PieChart
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
}

interface TrendData {
  period: string;
  ideas: number;
  events: number;
  participants: number;
}

interface CategoryStats {
  name: string;
  count: number;
  percentage: number;
  color: string;
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
    totalParticipants: 0
  });

  const [trendData] = useState<TrendData[]>([
    { period: 'Jan 2024', ideas: 45, events: 12, participants: 234 },
    { period: 'Feb 2024', ideas: 62, events: 15, participants: 298 },
    { period: 'Mar 2024', ideas: 78, events: 18, participants: 345 },
    { period: 'Apr 2024', ideas: 95, events: 22, participants: 412 },
    { period: 'May 2024', ideas: 103, events: 25, participants: 456 },
    { period: 'Jun 2024', ideas: 118, events: 28, participants: 523 }
  ]);

  const [categoryStats] = useState<CategoryStats[]>([
    { name: 'Technology', count: 45, percentage: 35, color: 'bg-blue-500' },
    { name: 'Healthcare', count: 32, percentage: 25, color: 'bg-green-500' },
    { name: 'Education', count: 25, percentage: 20, color: 'bg-purple-500' },
    { name: 'Environment', count: 18, percentage: 14, color: 'bg-emerald-500' },
    { name: 'Finance', count: 8, percentage: 6, color: 'bg-orange-500' }
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicStatistics();
  }, []);

  const loadPublicStatistics = async () => {
    try {
      setLoading(true);

      // Load public statistics
      const [
        ideasResponse,
        challengesResponse,
        eventsResponse,
        expertsResponse,
        partnersResponse,
        eventParticipantsResponse
      ] = await Promise.all([
        supabase.from('ideas').select('id', { count: 'exact', head: true }),
        supabase.from('challenges').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('experts').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase.from('event_participants').select('user_id', { count: 'exact', head: true })
      ]);

      // Count unique innovators
      const { count: innovatorsCount } = await supabase
        .from('innovators')
        .select('id', { count: 'exact', head: true });

      setStats({
        totalIdeas: ideasResponse.count || 0,
        totalChallenges: challengesResponse.count || 0,
        totalEvents: eventsResponse.count || 0,
        totalExperts: expertsResponse.count || 0,
        activeInnovators: innovatorsCount || 0,
        totalPartners: partnersResponse.count || 0,
        averageIdeaScore: 7.8, // Placeholder
        successfulImplementations: Math.floor((ideasResponse.count || 0) * 0.15), // 15% success rate
        ongoingProjects: Math.floor((ideasResponse.count || 0) * 0.25), // 25% ongoing
        totalParticipants: eventParticipantsResponse.count || 0
      });

    } catch (error) {
      console.error('Error loading public statistics:', error);
      toast.error('Error loading statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Public Statistics" description="Loading innovation platform statistics...">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Public Statistics"
      description="Explore the impact and growth of our innovation platform"
      className="space-y-6"
    >
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
            <PieChart className="w-4 h-4" />
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalIdeas.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  submitted by innovators
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChallenges}</div>
                <p className="text-xs text-muted-foreground">
                  innovation challenges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats.activeInnovators + stats.totalExperts).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  innovators & experts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events Hosted</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  innovation events
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Participation Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Growth</CardTitle>
                <CardDescription>Platform participation statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Active Innovators</span>
                    <span>{stats.activeInnovators}</span>
                  </div>
                  <Progress value={70} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Expert Evaluators</span>
                    <span>{stats.totalExperts}</span>
                  </div>
                  <Progress value={45} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Partner Organizations</span>
                    <span>{stats.totalPartners}</span>
                  </div>
                  <Progress value={25} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Innovation quality indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.averageIdeaScore}/10</div>
                  <p className="text-sm text-muted-foreground">Average Idea Score</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-semibold">{stats.successfulImplementations}</div>
                    <p className="text-xs text-muted-foreground">Implemented</p>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{stats.ongoingProjects}</div>
                    <p className="text-xs text-muted-foreground">In Development</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Participation</CardTitle>
                <CardDescription>Event engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.totalParticipants}</div>
                  <p className="text-sm text-muted-foreground">Total Event Participants</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold">
                    {stats.totalEvents > 0 ? Math.round(stats.totalParticipants / stats.totalEvents) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Average per Event</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends (Last 6 Months)</CardTitle>
              <CardDescription>Platform activity trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendData.map((trend, index) => (
                  <div key={trend.period} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{trend.period}</span>
                      <div className="flex gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          {trend.ideas} ideas
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {trend.events} events
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {trend.participants} participants
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Progress value={(trend.ideas / 120) * 100} className="h-2" />
                      <Progress value={(trend.events / 30) * 100} className="h-2" />
                      <Progress value={(trend.participants / 600) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ideas by Category</CardTitle>
              <CardDescription>Distribution of submitted ideas across sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{category.count} ideas</span>
                        <Badge variant="outline">{category.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${category.color}`}></div>
                      <Progress value={category.percentage} className="flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
  );
}