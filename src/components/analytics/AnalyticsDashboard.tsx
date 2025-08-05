import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useAppTranslation';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Lightbulb, 
  Calendar, 
  Handshake,
  BarChart3,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnalyticsData {
  metric_category: string;
  total_users: number;
  total_challenges: number;
  total_ideas: number;
  total_events: number;
  total_partners: number;
  total_campaigns: number;
  implemented_ideas: number;
  completed_challenges: number;
  idea_implementation_rate: number;
  challenge_completion_rate: number;
  total_budget_utilized: number;
}

interface UserEngagement {
  user_id: string;
  name: string;
  name_ar: string;
  department: string;
  position: string;
  total_events: number;
  page_views: number;
  challenge_participations: number;
  idea_submissions: number;
  comments_made: number;
  last_activity: string;
  days_since_last_activity: number;
  avg_session_duration: number;
}

interface ChallengePerformance {
  challenge_id: string;
  title_ar: string;
  status: string;
  priority_level: string;
  sector_name: string;
  sector_name_ar: string;
  department_name: string;
  department_name_ar: string;
  total_participants: number;
  total_submissions: number;
  approved_submissions: number;
  total_comments: number;
  total_likes: number;
  avg_rating: number;
  approval_rate: number;
  duration_days: number;
  estimated_budget: number;
  actual_budget: number;
}

export function AnalyticsDashboard() {
  const { t, getDynamicText, formatNumber } = useTranslation();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [userEngagement, setUserEngagement] = useState<UserEngagement[]>([]);
  const [challengePerformance, setChallengePerformance] = useState<ChallengePerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // For now, use mock data until views are properly registered in types
      // In production, this would use the analytics views we created
      const mockAnalyticsData: AnalyticsData = {
        metric_category: 'platform_overview',
        total_users: 150,
        total_challenges: 45,
        total_ideas: 120,
        total_events: 25,
        total_partners: 18,
        total_campaigns: 12,
        implemented_ideas: 35,
        completed_challenges: 20,
        idea_implementation_rate: 29.2,
        challenge_completion_rate: 44.4,
        total_budget_utilized: 2500000
      };

      setAnalyticsData(mockAnalyticsData);

      // Mock user engagement data
      const mockUserEngagement: UserEngagement[] = [
        {
          user_id: '1',
          name: 'Ahmed Al-Rashid',
          name_ar: 'أحمد الراشد',
          department: 'Digital Transformation',
          position: 'Innovation Manager',
          total_events: 85,
          page_views: 320,
          challenge_participations: 8,
          idea_submissions: 12,
          comments_made: 45,
          last_activity: new Date().toISOString(),
          days_since_last_activity: 1,
          avg_session_duration: 25
        }
      ];

      setUserEngagement(mockUserEngagement);

      // Mock challenge performance data
      const mockChallengePerformance: ChallengePerformance[] = [
        {
          challenge_id: '1',
          title_ar: 'تطوير منصة الخدمات الرقمية',
          status: 'active',
          priority_level: 'high',
          sector_name: 'Technology',
          sector_name_ar: 'التكنولوجيا',
          department_name: 'Digital Services',
          department_name_ar: 'الخدمات الرقمية',
          total_participants: 45,
          total_submissions: 28,
          approved_submissions: 15,
          total_comments: 125,
          total_likes: 78,
          avg_rating: 4.2,
          approval_rate: 53.6,
          duration_days: 60,
          estimated_budget: 500000,
          actual_budget: 450000
        }
      ];

      setChallengePerformance(mockChallengePerformance);

      // Track dashboard view
      await supabase.from('analytics_events').insert({
        event_type: 'dashboard_view',
        event_category: 'analytics',
        properties: {
          dashboard_type: 'innovation_impact',
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const platformMetrics = [
    {
      title: t('total_users'),
      value: analyticsData?.total_users || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: t('total_challenges'),
      value: analyticsData?.total_challenges || 0,
      icon: Target,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: t('total_ideas'),
      value: analyticsData?.total_ideas || 0,
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: t('total_events'),
      value: analyticsData?.total_events || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: t('total_partners'),
      value: analyticsData?.total_partners || 0,
      icon: Handshake,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: t('implemented_ideas'),
      value: analyticsData?.implemented_ideas || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: t('idea_implementation_rate'),
      value: `${analyticsData?.idea_implementation_rate || 0}%`,
      icon: TrendingUp,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      title: t('budget_utilized'),
      value: formatNumber(analyticsData?.total_budget_utilized || 0),
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on_hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Platform Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Implementation Rate Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('idea_implementation_progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('implementation_rate')}</span>
                  <span>{analyticsData?.idea_implementation_rate || 0}%</span>
                </div>
                <Progress value={analyticsData?.idea_implementation_rate || 0} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('total_ideas')}</span>
                  <p className="text-lg font-semibold">{analyticsData?.total_ideas || 0}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('implemented')}</span>
                  <p className="text-lg font-semibold text-green-600">
                    {analyticsData?.implemented_ideas || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('challenge_completion_progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('completion_rate')}</span>
                  <span>{analyticsData?.challenge_completion_rate || 0}%</span>
                </div>
                <Progress value={analyticsData?.challenge_completion_rate || 0} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('total_challenges')}</span>
                  <p className="text-lg font-semibold">{analyticsData?.total_challenges || 0}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('completed')}</span>
                  <p className="text-lg font-semibold text-green-600">
                    {analyticsData?.completed_challenges || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t('top_performing_challenges')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challengePerformance.slice(0, 5).map((challenge, index) => (
              <div key={challenge.challenge_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{challenge.title_ar}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusBadgeColor(challenge.status)}>
                      {t(challenge.status)}
                    </Badge>
                    <Badge className={getPriorityBadgeColor(challenge.priority_level)}>
                      {t(challenge.priority_level)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {getDynamicText(challenge.sector_name_ar, challenge.sector_name)}
                    </span>
                  </div>
                </div>
                 <div className="text-end">
                   <div className="text-sm text-muted-foreground">{t('participants')}</div>
                   <div className="text-lg font-semibold">{challenge.total_participants}</div>
                   {challenge.approval_rate !== null && (
                     <div className="text-sm text-success">
                       {challenge.approval_rate}% {t('approval_rate')}
                     </div>
                   )}
                 </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Active Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('most_active_users')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userEngagement.slice(0, 5).map((user, index) => (
              <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">
                    {getDynamicText(user.name_ar, user.name)}
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    {user.position && `${user.position} • `}
                    {user.department}
                  </div>
                </div>
                 <div className="text-end">
                   <div className="text-lg font-semibold">{user.total_events}</div>
                   <div className="text-sm text-muted-foreground">{t('total_activities')}</div>
                   <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                     <span>{user.challenge_participations} {t('challenges')}</span>
                     <span>{user.idea_submissions} {t('ideas')}</span>
                     <span>{user.comments_made} {t('comments')}</span>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}