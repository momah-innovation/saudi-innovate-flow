import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, Target, Star, Award, Calendar, 
  TrendingUp, Users, Plus, Eye, MessageCircle 
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';

interface DashboardStats {
  totalIdeas: number;
  activeIdeas: number;
  evaluatedIdeas: number;
  challengesParticipated: number;
  eventsAttended: number;
  totalRewards: number;
}

interface RecentActivity {
  id: string;
  type: 'idea_submitted' | 'idea_evaluated' | 'challenge_joined' | 'event_attended';
  title: string;
  description: string;
  date: string;
  status?: string;
}

export default function UserDashboard() {
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalIdeas: 0,
    activeIdeas: 0,
    evaluatedIdeas: 0,
    challengesParticipated: 0,
    eventsAttended: 0,
    totalRewards: 0
  });
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.id) {
      loadDashboardData();
    }
  }, [userProfile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user ideas
      const { data: ideas } = await supabase
        .from('ideas')
        .select('id, title_ar, status, created_at')
        .eq('innovator_id', userProfile?.id);

      // Load user challenge participations (through ideas)
      const { data: challengeIdeas } = await supabase
        .from('ideas')
        .select('challenge_id')
        .eq('innovator_id', userProfile?.id)
        .not('challenge_id', 'is', null);

      // Load user events
      const { data: eventParticipations } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('user_id', userProfile?.id);

      // Calculate stats
      const totalIdeas = ideas?.length || 0;
      const activeIdeas = ideas?.filter(idea => ['pending', 'under_review'].includes(idea.status))?.length || 0;
      const evaluatedIdeas = ideas?.filter(idea => ['approved', 'rejected'].includes(idea.status))?.length || 0;
      
      // Get unique challenge IDs
      const uniqueChallengeIds = new Set(challengeIdeas?.map(idea => idea.challenge_id));

      setStats({
        totalIdeas,
        activeIdeas,
        evaluatedIdeas,
        challengesParticipated: uniqueChallengeIds.size || 0,
        eventsAttended: eventParticipations?.length || 0,
        totalRewards: Math.floor(Math.random() * 1000) // Placeholder
      });

      // Create recent activities from ideas
      const activities: RecentActivity[] = ideas?.slice(0, 5).map(idea => ({
        id: idea.id,
        type: 'idea_submitted',
        title: idea.title_ar || 'Untitled Idea',
        description: `Idea submitted for review`,
        date: idea.created_at,
        status: idea.status
      })) || [];

      setRecentActivities(activities);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'idea_submitted': return <Lightbulb className="w-4 h-4" />;
      case 'idea_evaluated': return <Star className="w-4 h-4" />;
      case 'challenge_joined': return <Target className="w-4 h-4" />;
      case 'event_attended': return <Calendar className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary', text: 'Pending' },
      under_review: { variant: 'default', text: 'Under Review' },
      approved: { variant: 'default', text: 'Approved' },
      rejected: { variant: 'destructive', text: 'Rejected' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  return (
    <AppShell>
      <PageLayout
        title="لوحة القيادة - المبتكر"
        description={`أهلاً بك ${userProfile?.display_name || 'المبتكر'}! إليك نظرة عامة على أنشطتك`}
        className="space-y-6"
      >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="ideas" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            My Ideas
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalIdeas}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.activeIdeas} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Challenges</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.challengesParticipated}</div>
                <p className="text-xs text-muted-foreground">
                  participated in
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.eventsAttended}</div>
                <p className="text-xs text-muted-foreground">
                  attended
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rewards</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRewards}</div>
                <p className="text-xs text-muted-foreground">
                  points earned
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Innovation Progress</CardTitle>
                <CardDescription>Your innovation journey progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Ideas Submitted</span>
                    <span>{stats.totalIdeas}/20</span>
                  </div>
                  <Progress value={(stats.totalIdeas / 20) * 100} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Ideas Evaluated</span>
                    <span>{stats.evaluatedIdeas}/{stats.totalIdeas}</span>
                  </div>
                  <Progress value={stats.totalIdeas > 0 ? (stats.evaluatedIdeas / stats.totalIdeas) * 100 : 0} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Challenge Participation</span>
                    <span>{stats.challengesParticipated}/10</span>
                  </div>
                  <Progress value={(stats.challengesParticipated / 10) * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>What would you like to do next?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => navigate('/submit-idea')} className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Idea
                </Button>
                <Button onClick={() => navigate('/challenges')} variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Browse Challenges
                </Button>
                <Button onClick={() => navigate('/events')} variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse Events
                </Button>
                <Button onClick={() => navigate('/ideas')} variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View My Ideas
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ideas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Ideas</CardTitle>
              <CardDescription>Track your submitted ideas and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {activity.status && getStatusBadge(activity.status)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No ideas yet</h3>
                  <p className="text-muted-foreground mb-4">Start your innovation journey by submitting your first idea</p>
                  <Button onClick={() => navigate('/submit-idea')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Your First Idea
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No recent activity</h3>
                  <p className="text-muted-foreground">Your recent activities will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </PageLayout>
    </AppShell>
  );
}