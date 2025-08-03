import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Trophy, 
  Target,
  Clock,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { getStatusMapping, getPriorityMapping, challengesPageConfig } from '@/config/challengesPageConfig';

interface AnalyticsData {
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  totalParticipants: number;
  totalPrizes: number;
  averageParticipation: number;
  trendingChallenges: number;
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  participationTrend: { period: string; participants: number; challenges: number }[];
  topChallenges: { id: string; title: string; participants: number; prize: number }[];
}

interface ChallengeAnalyticsDashboardProps {
  className?: string;
}

export const ChallengeAnalyticsDashboard = ({ 
  className = "" 
}: ChallengeAnalyticsDashboardProps) => {
  const { isRTL } = useDirection();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get basic challenge statistics
      const { data: challenges, error } = await supabase
        .from('challenges')
        .select('*');

      if (error) throw error;

      const totalChallenges = challenges?.length || 0;
      const activeChallenges = challenges?.filter(c => getStatusMapping(c.status).value === 'active' || getStatusMapping(c.status).value === 'published').length || 0;
      const completedChallenges = challenges?.filter(c => getStatusMapping(c.status).value === 'completed').length || 0;

      // Get total participants across all challenges
      const { count: totalParticipants } = await supabase
        .from('challenge_participants')
        .select('*', { count: 'exact' });

      // Calculate total prizes
      const totalPrizes = challenges?.reduce((sum, c) => sum + (c.estimated_budget || 0), 0) || 0;

      // Category breakdown
      const categoryBreakdown = challenges?.reduce((acc: any[], challenge) => {
        const category = challenge.challenge_type || 'other';
        const existing = acc.find(item => item.category === category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ category, count: 1, percentage: 0 });
        }
        return acc;
      }, []) || [];

      // Calculate percentages
      categoryBreakdown.forEach(item => {
        item.percentage = (item.count / totalChallenges) * 100;
      });

      // Get top challenges by participation
      const challengesWithParticipants = await Promise.all(
        (challenges || []).slice(0, 5).map(async (challenge) => {
          const { count } = await supabase
            .from('challenge_participants')
            .select('*', { count: 'exact' })
            .eq('challenge_id', challenge.id);

          return {
            id: challenge.id,
            title: challenge.title_ar,
            participants: count || 0,
            prize: challenge.estimated_budget || 0
          };
        })
      );

      const topChallenges = challengesWithParticipants
        .sort((a, b) => b.participants - a.participants)
        .slice(0, 5);

      // Mock participation trend data
      const participationTrend = [
        { period: isRTL ? 'يناير' : 'Jan', participants: 1200, challenges: 15 },
        { period: isRTL ? 'فبراير' : 'Feb', participants: 1450, challenges: 18 },
        { period: isRTL ? 'مارس' : 'Mar', participants: 1680, challenges: 22 },
        { period: isRTL ? 'أبريل' : 'Apr', participants: 1890, challenges: 25 },
        { period: isRTL ? 'مايو' : 'May', participants: 2100, challenges: 28 },
        { period: isRTL ? 'يونيو' : 'Jun', participants: 2350, challenges: 32 }
      ];

      setAnalytics({
        totalChallenges,
        activeChallenges,
        completedChallenges,
        totalParticipants: totalParticipants || 0,
        totalPrizes,
        averageParticipation: totalChallenges > 0 ? Math.round((totalParticipants || 0) / totalChallenges) : 0,
        trendingChallenges: challenges?.filter(c => getPriorityMapping(c.priority_level || 'متوسط').value === 'عالي' || getPriorityMapping(c.priority_level || 'متوسط').value === 'High').length || 0,
        categoryBreakdown,
        participationTrend,
        topChallenges
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = "blue",
    trend = "up" 
  }: {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    color?: string;
    trend?: "up" | "down";
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 text-xs ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {change}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {isRTL ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="participation">
            {isRTL ? 'المشاركة' : 'Participation'}
          </TabsTrigger>
          <TabsTrigger value="performance">
            {isRTL ? 'الأداء' : 'Performance'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title={isRTL ? 'إجمالي التحديات' : 'Total Challenges'}
              value={analytics.totalChallenges}
              change="+12%"
              icon={Target}
              color="blue"
            />
            <MetricCard
              title={isRTL ? 'التحديات النشطة' : 'Active Challenges'}
              value={analytics.activeChallenges}
              change="+8%"
              icon={Zap}
              color="green"
            />
            <MetricCard
              title={isRTL ? 'إجمالي المشاركين' : 'Total Participants'}
              value={`${Math.floor(analytics.totalParticipants / 1000)}K+`}
              change="+23%"
              icon={Users}
              color="purple"
            />
            <MetricCard
              title={isRTL ? 'إجمالي الجوائز' : 'Total Prizes'}
              value={`${Math.floor(analytics.totalPrizes / 1000000)}M+ ${isRTL ? 'ر.س' : 'SAR'}`}
              change="+15%"
              icon={Trophy}
              color="yellow"
            />
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                {isRTL ? 'التوزيع حسب الفئة' : 'Category Breakdown'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.categoryBreakdown.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.category}</span>
                      <span>{category.count} ({category.percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participation" className="space-y-6">
          {/* Participation Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title={isRTL ? 'متوسط المشاركة' : 'Avg Participation'}
              value={analytics.averageParticipation}
              change="+5%"
              icon={Users}
              color="blue"
            />
            <MetricCard
              title={isRTL ? 'التحديات الرائجة' : 'Trending Challenges'}
              value={analytics.trendingChallenges}
              change="+18%"
              icon={TrendingUp}
              color="orange"
            />
            <MetricCard
              title={isRTL ? 'التحديات المكتملة' : 'Completed'}
              value={analytics.completedChallenges}
              change="+7%"
              icon={Award}
              color="green"
            />
          </div>

          {/* Top Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {isRTL ? 'أكثر التحديات مشاركة' : 'Top Challenges by Participation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topChallenges.map((challenge, index) => (
                  <div key={challenge.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{challenge.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {challenge.participants} {isRTL ? 'مشارك' : 'participants'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {Math.floor(challenge.prize / 1000)}K {isRTL ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={(challenge.participants / analytics.topChallenges[0]?.participants) * 100} 
                      className="w-24" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {isRTL ? 'اتجاه المشاركة' : 'Participation Trend'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.participationTrend.map((period, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-sm font-medium">{period.period}</div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {period.participants} {isRTL ? 'مشارك' : 'participants'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {period.challenges} {isRTL ? 'تحدي' : 'challenges'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {isRTL ? 'إحصائيات سريعة' : 'Quick Stats'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isRTL ? 'معدل النجاح' : 'Success Rate'}</span>
                    <Badge variant="secondary">87%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isRTL ? 'متوسط مدة التحدي' : 'Avg Challenge Duration'}</span>
                    <Badge variant="secondary">{isRTL ? '45 يوم' : '45 days'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isRTL ? 'معدل الإكمال' : 'Completion Rate'}</span>
                    <Badge variant="secondary">72%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isRTL ? 'رضا المشاركين' : 'Participant Satisfaction'}</span>
                    <Badge variant="secondary">4.6/5</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};