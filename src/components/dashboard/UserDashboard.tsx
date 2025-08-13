import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Lightbulb, Target, Star, Award, Calendar, TrendingUp, Users, Plus, 
  Eye, MessageCircle, Trophy, Brain, Zap, Activity, Bell, ChevronRight,
  BookOpen, Bookmark, Heart, Share2, Download, ExternalLink
} from 'lucide-react';
// Removed PageLayout import - AppShell provides the layout
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
// Removed AppShell import - route provides AppShell wrapper
import { DashboardHero } from './DashboardHero';
import { AdminDashboard } from './AdminDashboardComponent';
import { ExpertDashboard } from './ExpertDashboard';
import { PartnerDashboard } from './PartnerDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { CoordinatorDashboard } from './CoordinatorDashboard';
import { AnalystDashboard } from './AnalystDashboard';
import { ContentDashboard } from './ContentDashboard';
import { OrganizationDashboard } from './OrganizationDashboard';
import { logger } from '@/utils/logger';
// Collaboration imports
import { CollaborationProvider } from '@/components/collaboration';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';

interface DashboardStats {
  totalIdeas: number;
  activeIdeas: number;
  evaluatedIdeas: number;
  challengesParticipated: number;
  eventsAttended: number;
  totalRewards: number;
  innovationScore: number;
  weeklyGoal: number;
  monthlyGoal: number;
}

interface RecentActivity {
  id: string;
  type: 'idea_submitted' | 'idea_evaluated' | 'challenge_joined' | 'event_attended' | 'achievement_earned';
  title: string;
  description: string;
  date: string;
  status?: string;
  metadata?: Record<string, unknown>;
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
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  type: 'ideas' | 'challenges' | 'events';
}

export default React.memo(function UserDashboard() {
  const { userProfile } = useAuth();
  const { permissions, getPrimaryRole: getRoleFromHook, canAccess } = useRoleAccess();
  const { t, language } = useUnifiedTranslation();
  const currentLanguage = language;
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  
  // Memoize the role function to prevent unnecessary re-renders
  const getPrimaryRole = useCallback(() => getRoleFromHook(), [getRoleFromHook]);
  
  const [primaryRole, setPrimaryRole] = useState<string>('innovator');
  
  const [stats, setStats] = useState<DashboardStats>({
    totalIdeas: 0,
    activeIdeas: 0,
    evaluatedIdeas: 0,
    challengesParticipated: 0,
    eventsAttended: 0,
    totalRewards: 0,
    innovationScore: 0,
    weeklyGoal: 2,
    monthlyGoal: 10
  });
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);

  // Memoize dashboard data loading to prevent unnecessary calls
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadUserStats(),
        loadUserActivities(),
        loadUserAchievements(),
        loadUserGoals()
      ]);
    } catch (error) {
      logger.error('Error loading dashboard data', { component: 'UserDashboard', action: 'loadDashboardData' }, error as Error);
      toast.error('خطأ في تحميل بيانات لوحة القيادة');
    } finally {
      setLoading(false);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    // Update primary role when user profile changes
    const role = getPrimaryRole();
    setPrimaryRole(role);
  }, [userProfile, getPrimaryRole]);

  useEffect(() => {
    if (userProfile?.id && !loading) {
      loadDashboardData();
      
      // Set up real-time updates (removed to prevent multiple renders)
    }
  }, [userProfile?.id]);

  const loadUserStats = async () => {
    if (!userProfile?.id) return;

    // Get user's innovator profile
    const { data: innovatorData } = await supabase
      .from('innovators')
      .select('id')
      .eq('user_id', userProfile.id)
      .single();

    if (!innovatorData) return;

    // Load user ideas
    const { data: ideas } = await supabase
      .from('ideas')
      .select('id, title_ar, status, created_at, challenge_id')
      .eq('innovator_id', innovatorData.id);

    // Load user challenge participations
    const { data: challengeParticipations } = await supabase
      .from('challenge_participants')
      .select('challenge_id')
      .eq('user_id', userProfile.id);

    // Load user events
    const { data: eventParticipations } = await supabase
      .from('event_participants')
      .select('event_id')
      .eq('user_id', userProfile.id);

    // Load user achievements
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('points_earned')
      .eq('user_id', userProfile.id);

    // Calculate stats
    const totalIdeas = ideas?.length || 0;
    const activeIdeas = ideas?.filter(idea => ['pending', 'under_review'].includes(idea.status))?.length || 0;
    const evaluatedIdeas = ideas?.filter(idea => ['approved', 'rejected'].includes(idea.status))?.length || 0;
    const totalRewards = userAchievements?.reduce((sum, ach) => sum + ach.points_earned, 0) || 0;
    const innovationScore = Math.min(Math.round(totalIdeas * 0.4 + challengeParticipations?.length * 0.3 + eventParticipations?.length * 0.2 + (totalRewards / 100) * 0.1), 100);

    setStats({
      totalIdeas,
      activeIdeas,
      evaluatedIdeas,
      challengesParticipated: challengeParticipations?.length || 0,
      eventsAttended: eventParticipations?.length || 0,
      totalRewards,
      innovationScore,
      weeklyGoal: 2,
      monthlyGoal: 10
    });

    // Create recent activities from ideas
    const activities: RecentActivity[] = ideas?.slice(0, 5).map(idea => ({
      id: idea.id,
      type: 'idea_submitted',
      title: idea.title_ar || 'فكرة بدون عنوان',
      description: 'تم تقديم الفكرة للمراجعة',
      date: idea.created_at,
      status: idea.status
    })) || [];

    setRecentActivities(activities);
  };

  const loadUserActivities = async () => {
    // This would typically come from a dedicated activities table
    // For now, we'll use the data from ideas
  };

  const loadUserAchievements = async () => {
    if (!userProfile?.id) return;
    
    // For now, use placeholder data
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
        earned_at: new Date().toISOString()
      }
    ]);
  };

  const loadUserGoals = async () => {
    // Sample goals - in a real app, these would come from the database
    const weeklyIdeasProgress = Math.min(stats.totalIdeas % 7, stats.weeklyGoal);
    const monthlyIdeasProgress = Math.min(stats.totalIdeas, stats.monthlyGoal);
    
    setGoals([
      {
        id: '1',
        title: currentLanguage === 'ar' ? 'أفكار هذا الأسبوع' : 'This Week\'s Ideas',
        target: stats.weeklyGoal,
        current: weeklyIdeasProgress,
        deadline: '2024-02-11',
        type: 'ideas'
      },
      {
        id: '2', 
        title: currentLanguage === 'ar' ? 'أفكار هذا الشهر' : 'This Month\'s Ideas',
        target: stats.monthlyGoal,
        current: monthlyIdeasProgress,
        deadline: '2024-02-29',
        type: 'ideas'
      },
      {
        id: '3',
        title: currentLanguage === 'ar' ? 'المشاركة في التحديات' : 'Challenge Participation',
        target: 5,
        current: stats.challengesParticipated,
        deadline: '2024-03-01',
        type: 'challenges'
      }
    ]);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'idea_submitted': return <Lightbulb className="w-4 h-4" />;
      case 'idea_evaluated': return <Star className="w-4 h-4" />;
      case 'challenge_joined': return <Target className="w-4 h-4" />;
      case 'event_attended': return <Calendar className="w-4 h-4" />;
      case 'achievement_earned': return <Trophy className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} size="sm" />;
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'ideas': return <Lightbulb className="w-5 h-5" />;
      case 'challenges': return <Target className="w-5 h-5" />;
      case 'events': return <Calendar className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <CollaborationProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
        <DashboardHero
          userProfile={userProfile}
          unifiedData={{
            totalIdeas: stats.totalIdeas,
            activeChallenges: stats.challengesParticipated,
            totalPoints: stats.totalRewards,
            innovationScore: stats.innovationScore,
            expertStats: {
              assignedChallenges: 0,
              pendingEvaluations: 0,
              completedEvaluations: 0,
              averageRating: 0
            },
            partnerStats: {
              activePartnerships: 0,
              supportedProjects: 0,
              totalInvestment: 0,
              partnershipScore: 0
            },
            adminStats: {
              totalUsers: 0,
              activeUsers: 0,
              systemUptime: 0,
              securityScore: 0,
              totalChallenges: 0,
              totalSubmissions: 0
            }
          }}
          onNavigate={navigate}
          userRole={primaryRole}
          rolePermissions={permissions}
        />
        
        <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Role-specific Dashboard Content */}
        {useMemo(() => {
          if (primaryRole === 'admin' || primaryRole === 'super_admin') {
            return (
              <AdminDashboard 
                userProfile={userProfile ? {
                  id: userProfile.id,
                  name: userProfile.name || '',
                  position: userProfile.position,
                  organization: userProfile.organization,
                  profile_completion_percentage: userProfile.profile_completion_percentage,
                  user_roles: userProfile.user_roles
                } : {
                  id: '',
                  name: '',
                  profile_completion_percentage: 0
                }}
                canManageUsers={permissions.canManageUsers}
                canManageSystem={permissions.canManageSystem}
                canViewAnalytics={permissions.canViewAnalytics}
              />
            );
          }
          return null;
        }, [primaryRole, userProfile, permissions])}
        
        {primaryRole === 'expert' && (
          <ExpertDashboard 
            userProfile={userProfile}
            canEvaluateIdeas={permissions.canEvaluateIdeas}
            canAccessExpertTools={permissions.canAccessExpertTools}
          />
        )}
        
        {primaryRole === 'partner' && (
          <PartnerDashboard 
            userProfile={userProfile}
            canManageOpportunities={permissions.canManageOpportunities}
            canViewPartnerDashboard={permissions.canViewPartnerDashboard}
          />
        )}
        
        {/* Manager Dashboard - for leadership roles */}
        {['team_lead', 'project_manager', 'department_head', 'sector_lead', 'innovation_manager'].includes(primaryRole) && (
          <ManagerDashboard 
            userProfile={userProfile}
            canManageTeams={permissions.canManageTeams}
            canViewAnalytics={permissions.canViewAnalytics}
            canManageProjects={permissions.canManageTeams} // Using existing permission
          />
        )}
        
        {/* Coordinator Dashboard - for coordination roles */}
        {['expert_coordinator', 'campaign_manager', 'event_manager', 'stakeholder_manager'].includes(primaryRole) && (
          <CoordinatorDashboard 
            userProfile={userProfile}
            canCoordinateExperts={permissions.canManageUsers}
            canManageEvents={permissions.canViewAnalytics}
            canViewAnalytics={permissions.canViewAnalytics}
          />
        )}
        
        {/* Analyst Dashboard - for data and analysis roles */}
        {['data_analyst', 'system_auditor'].includes(primaryRole) && (
          <AnalystDashboard 
            userProfile={userProfile}
            canAccessAnalytics={permissions.canAccessAnalytics}
            canViewSystemData={permissions.canViewSystemData}
            canGenerateReports={permissions.canGenerateReports}
          />
        )}
        
        {/* Content Dashboard - for content and research roles */}
        {['content_manager', 'challenge_manager', 'research_lead'].includes(primaryRole) && (
          <ContentDashboard 
            userProfile={userProfile}
            canManageContent={permissions.canManageContent}
            canManageChallenges={permissions.canManageChallenges}
            canResearch={permissions.canResearch}
          />
        )}
        
        {/* Organization Dashboard - for organizational roles */}
        {['organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager'].includes(primaryRole) && (
          <OrganizationDashboard 
            userProfile={userProfile}
            canManageOrganization={permissions.canManageOrganization}
            canManageEntities={permissions.canManageEntities}
            canViewOrgAnalytics={permissions.canViewOrgAnalytics}
          />
        )}
        
        {/* Default Innovator Dashboard for other roles */}
        {!['admin', 'super_admin', 'expert', 'partner', 'team_lead', 'project_manager', 'department_head', 'sector_lead', 'innovation_manager', 'expert_coordinator', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'data_analyst', 'system_auditor', 'content_manager', 'challenge_manager', 'research_lead', 'organization_admin', 'entity_manager', 'deputy_manager', 'domain_manager', 'sub_domain_manager', 'service_manager'].includes(primaryRole) && (
          <div>
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-innovation to-innovation-foreground text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {currentLanguage === 'ar' ? `مرحباً ${userProfile?.display_name || 'المبتكر'}` : `Welcome ${userProfile?.display_name || 'Innovator'}`}
                </h1>
                <p className="text-white/80">
                  {currentLanguage === 'ar' 
                    ? `نقاط الابتكار: ${stats.totalRewards} | النتيجة: ${stats.innovationScore}/100`
                    : `Innovation Points: ${stats.totalRewards} | Score: ${stats.innovationScore}/100`}
                </p>
                <div className="mt-3">
                  <Progress value={stats.innovationScore} className="w-64 h-2" />
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/dashboard-images/team-collaboration.jpg" 
                  alt="Innovation" 
                  className="w-24 h-24 rounded-lg object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {currentLanguage === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {currentLanguage === 'ar' ? 'أفكاري' : 'My Ideas'}
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              {currentLanguage === 'ar' ? 'الإنجازات' : 'Achievements'}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {currentLanguage === 'ar' ? 'النشاط' : 'Activity'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {currentLanguage === 'ar' ? 'إجمالي الأفكار' : 'Total Ideas'}
                  </CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalIdeas}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.activeIdeas} {currentLanguage === 'ar' ? 'نشطة' : 'active'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {currentLanguage === 'ar' ? 'التحديات' : 'Challenges'}
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.challengesParticipated}</div>
                  <p className="text-xs text-muted-foreground">
                    {currentLanguage === 'ar' ? 'مشاركة' : 'participated'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {currentLanguage === 'ar' ? 'الفعاليات' : 'Events'}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.eventsAttended}</div>
                  <p className="text-xs text-muted-foreground">
                    {currentLanguage === 'ar' ? 'حضور' : 'attended'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {currentLanguage === 'ar' ? 'النقاط' : 'Points'}
                  </CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRewards}</div>
                  <p className="text-xs text-muted-foreground">
                    {currentLanguage === 'ar' ? 'نقطة مكتسبة' : 'points earned'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{currentLanguage === 'ar' ? 'تقدم الابتكار' : 'Innovation Progress'}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'ar' ? 'تقدم رحلة الابتكار الخاصة بك' : 'Your innovation journey progress'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <div className="flex items-center gap-2">
                          {getGoalIcon(goal.type)}
                          <span>{goal.title}</span>
                        </div>
                        <span>{goal.current}/{goal.target}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{currentLanguage === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'ar' ? 'ماذا تريد أن تفعل الآن؟' : 'What would you like to do next?'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => navigate('/submit-idea')} className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    {currentLanguage === 'ar' ? 'تقديم فكرة جديدة' : 'Submit New Idea'}
                  </Button>
                  <Button onClick={() => navigate('/challenges')} variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    {currentLanguage === 'ar' ? 'تصفح التحديات' : 'Browse Challenges'}
                  </Button>
                  <Button onClick={() => navigate('/events')} variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    {currentLanguage === 'ar' ? 'تصفح الفعاليات' : 'Browse Events'}
                  </Button>
                  <Button onClick={() => navigate('/ideas')} variant="outline" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    {currentLanguage === 'ar' ? 'عرض أفكاري' : 'View My Ideas'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ideas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{currentLanguage === 'ar' ? 'أفكاري' : 'My Ideas'}</CardTitle>
                <CardDescription>
                  {currentLanguage === 'ar' ? 'تتبع الأفكار المقدمة وحالتها' : 'Track your submitted ideas and their status'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivities.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {activity.status && getStatusBadge(activity.status)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US')}
                          </span>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">
                      {currentLanguage === 'ar' ? 'لا توجد أفكار بعد' : 'No ideas yet'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {currentLanguage === 'ar' 
                        ? 'ابدأ رحلة الابتكار بتقديم فكرتك الأولى'
                        : 'Start your innovation journey by submitting your first idea'}
                    </p>
                    <Button onClick={() => navigate('/submit-idea')}>
                      <Plus className="w-4 h-4 mr-2" />
                      {currentLanguage === 'ar' ? 'قدم فكرتك الأولى' : 'Submit Your First Idea'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
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
                          <Trophy className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {currentLanguage === 'ar' ? achievement.achievement_name_ar : achievement.achievement_name_en}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {currentLanguage === 'ar' ? achievement.description_ar : achievement.description_en}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline">
                              {achievement.points_earned} {currentLanguage === 'ar' ? 'نقطة' : 'points'}
                            </Badge>
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

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{currentLanguage === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle>
                <CardDescription>
                  {currentLanguage === 'ar' ? 'أحدث إجراءاتك وتحديثاتك' : 'Your latest actions and updates'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivities.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.date).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                        {activity.status && (
                          <div className="flex-shrink-0">
                            {getStatusBadge(activity.status)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">
                      {currentLanguage === 'ar' ? 'لا يوجد نشاط حديث' : 'No recent activity'}
                    </h3>
                    <p className="text-muted-foreground">
                      {currentLanguage === 'ar' ? 'ستظهر أنشطتك الحديثة هنا' : 'Your recent activities will appear here'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Collaboration moved to workspace pages */}
        </div>
        )}
      </div>
      </div>
    </CollaborationProvider>
  );
});