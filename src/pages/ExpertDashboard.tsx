import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Star, Target, Lightbulb, Clock, CheckCircle, 
  AlertCircle, Calendar, TrendingUp, Award, Eye, Edit, Filter
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { EnhancedExpertDashboardHero } from '@/components/experts/EnhancedExpertDashboardHero';
import { ExpertAnalyticsDashboard } from '@/components/experts/ExpertAnalyticsDashboard';
import { ExpertNotificationCenter } from '@/components/experts/ExpertNotificationCenter';

interface ExpertStats {
  assignedChallenges: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  averageRating: number;
  totalIdeasEvaluated: number;
  expertiseAreas: string[];
}

interface PendingEvaluation {
  id: string;
  idea_title: string;
  challenge_title: string;
  submission_date: string;
  priority: 'high' | 'medium' | 'low';
  days_pending: number;
}

interface RecentEvaluation {
  id: string;
  idea_title: string;
  evaluation_date: string;
  score: number;
  status: string;
}

export default function ExpertDashboard() {
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<ExpertStats>({
    assignedChallenges: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
    averageRating: 0,
    totalIdeasEvaluated: 0,
    expertiseAreas: []
  });
  
  const [pendingEvaluations, setPendingEvaluations] = useState<PendingEvaluation[]>([]);
  const [recentEvaluations, setRecentEvaluations] = useState<RecentEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [featuredEvaluation, setFeaturedEvaluation] = useState<any>(null);

  useEffect(() => {
    if (userProfile?.id) {
      loadExpertData();
    }
  }, [userProfile]);

  const loadExpertData = async () => {
    try {
      setLoading(true);
      
      // Load expert assignments
      const { data: expertAssignments } = await supabase
        .from('challenge_experts')
        .select(`
          challenge_id,
          challenges (id, title_ar)
        `)
        .eq('expert_id', userProfile?.id);

      // Load idea evaluations
      const { data: evaluations } = await supabase
        .from('idea_evaluations')
        .select(`
          id,
          idea_id,
          technical_feasibility,
          created_at,
          ideas (title_ar, challenge_id, challenges (title_ar))
        `)
        .eq('evaluator_id', userProfile?.id);

      // Calculate stats
      const assignedChallenges = expertAssignments?.length || 0;
      const completedEvaluations = evaluations?.filter(e => e.technical_feasibility > 0)?.length || 0;
      const pendingEvaluations = evaluations?.filter(e => !e.technical_feasibility)?.length || 0;
      
      const scores = evaluations?.filter(e => e.technical_feasibility).map(e => e.technical_feasibility) || [];
      const averageRating = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      setStats({
        assignedChallenges,
        pendingEvaluations,
        completedEvaluations,
        averageRating,
        totalIdeasEvaluated: evaluations?.length || 0,
        expertiseAreas: ['Technology', 'Innovation', 'Business Development'] // Placeholder
      });

      // Create pending evaluations list
      const pending: PendingEvaluation[] = evaluations?.filter(e => !e.technical_feasibility).map(evaluation => ({
        id: evaluation.id,
        idea_title: evaluation.ideas?.title_ar || 'Untitled Idea',
        challenge_title: evaluation.ideas?.challenges?.title_ar || 'No Challenge',
        submission_date: evaluation.created_at,
        priority: 'medium',
        days_pending: Math.floor((new Date().getTime() - new Date(evaluation.created_at).getTime()) / (1000 * 3600 * 24))
      })) || [];

      setPendingEvaluations(pending);

      // Create recent evaluations list
      const recent: RecentEvaluation[] = evaluations?.filter(e => e.technical_feasibility > 0)
        .slice(0, 5)
        .map(evaluation => ({
          id: evaluation.id,
          idea_title: evaluation.ideas?.title_ar || 'Untitled Idea',
          evaluation_date: evaluation.created_at,
          score: evaluation.technical_feasibility || 0,
          status: 'completed'
        })) || [];

      setRecentEvaluations(recent);

      // Set featured evaluation (most urgent)
      if (pending.length > 0) {
        const mostUrgent = pending.sort((a, b) => b.days_pending - a.days_pending)[0];
        setFeaturedEvaluation({
          id: mostUrgent.id,
          idea_title: mostUrgent.idea_title,
          challenge_title: mostUrgent.challenge_title,
          daysLeft: Math.max(0, 7 - mostUrgent.days_pending),
          priority: mostUrgent.days_pending > 5 ? 'high' : mostUrgent.days_pending > 2 ? 'medium' : 'low'
        });
      }
      
    } catch (error) {
      console.error('Error loading expert data:', error);
      toast.error('Error loading expert dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string, daysPending: number) => {
    if (daysPending > 7) return <Badge variant="destructive">Urgent</Badge>;
    if (daysPending > 3) return <Badge variant="default">High</Badge>;
    return <Badge variant="secondary">Normal</Badge>;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 6) return <Badge variant="secondary">Good</Badge>;
    if (score >= 4) return <Badge variant="outline">Fair</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  return (
    <AppShell>
      {/* Enhanced Hero Section */}
      <EnhancedExpertDashboardHero 
        assignedChallenges={stats.assignedChallenges}
        pendingEvaluations={stats.pendingEvaluations}
        completedEvaluations={stats.completedEvaluations}
        averageRating={stats.averageRating}
        onStartEvaluating={() => navigate('/evaluations')}
        onShowFilters={() => setShowFilters(!showFilters)}
        featuredEvaluation={featuredEvaluation}
      />
      
      <PageLayout
        title={isRTL ? 'لوحة القيادة - الخبير' : 'Expert Dashboard'}
        description={isRTL ? 'أهلاً بك في نظام إدارة الخبراء والتقييمات' : 'Welcome to the expert evaluation management system'}
        primaryAction={{
          label: isRTL ? 'ابدأ التقييم' : 'Start Evaluating',
          onClick: () => navigate('/evaluations'),
          icon: <Star className="w-4 h-4" />
        }}
        secondaryActions={
          <div className="flex gap-2">
            <ExpertNotificationCenter />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {isRTL ? 'المرشحات' : 'Filters'}
            </Button>
          </div>
        }
        className="space-y-6"
      >
        <div className="space-y-6">
          {/* Enhanced Layout with Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {isRTL ? 'نظرة عامة' : 'Overview'}
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {isRTL ? 'في الانتظار' : 'Pending'} 
                    {stats.pendingEvaluations > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {stats.pendingEvaluations}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {isRTL ? 'مكتمل' : 'Completed'}
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {isRTL ? 'التحليلات' : 'Analytics'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 animate-fade-in">
                  {/* Expert Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {isRTL ? 'التحديات المُكلفة' : 'Assigned Challenges'}
                        </CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.assignedChallenges}</div>
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? 'تكاليف نشطة' : 'active assignments'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {isRTL ? 'التقييمات المعلقة' : 'Pending Evaluations'}
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingEvaluations}</div>
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? 'في انتظار المراجعة' : 'awaiting review'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {isRTL ? 'إجمالي المُقيّمة' : 'Total Evaluated'}
                        </CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.totalIdeasEvaluated}</div>
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? 'أفكار مراجعة' : 'ideas reviewed'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {isRTL ? 'متوسط التقييم' : 'Average Rating'}
                        </CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/10</div>
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? 'جودة التقييم' : 'evaluation quality'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{isRTL ? 'تقدم التقييم' : 'Evaluation Progress'}</CardTitle>
                        <CardDescription>
                          {isRTL ? 'مقاييس أداء التقييم الخاصة بك' : 'Your evaluation performance metrics'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>{isRTL ? 'معدل الإنجاز' : 'Completion Rate'}</span>
                            <span>{stats.totalIdeasEvaluated > 0 ? Math.round((stats.completedEvaluations / stats.totalIdeasEvaluated) * 100) : 0}%</span>
                          </div>
                          <Progress value={stats.totalIdeasEvaluated > 0 ? (stats.completedEvaluations / stats.totalIdeasEvaluated) * 100 : 0} className="mt-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>{isRTL ? 'متوسط وقت الاستجابة' : 'Average Response Time'}</span>
                            <span>{isRTL ? '2.3 أيام' : '2.3 days'}</span>
                          </div>
                          <Progress value={70} className="mt-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>{isRTL ? 'نقاط الجودة' : 'Quality Score'}</span>
                            <span>{stats.averageRating.toFixed(1)}/10</span>
                          </div>
                          <Progress value={(stats.averageRating / 10) * 100} className="mt-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{isRTL ? 'الإجراءات السريعة' : 'Quick Actions'}</CardTitle>
                        <CardDescription>
                          {isRTL ? 'ماذا تريد أن تفعل بعد ذلك؟' : 'What would you like to do next?'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button onClick={() => navigate('/evaluations')} className="w-full justify-start">
                          <Star className="w-4 h-4 mr-2" />
                          {isRTL ? 'ابدأ تقييم الأفكار' : 'Start Evaluating Ideas'}
                        </Button>
                        <Button onClick={() => navigate('/expert-profile')} variant="outline" className="w-full justify-start">
                          <Edit className="w-4 h-4 mr-2" />
                          {isRTL ? 'تحديث ملف الخبير' : 'Update Expert Profile'}
                        </Button>
                        <Button onClick={() => navigate('/challenges')} variant="outline" className="w-full justify-start">
                          <Target className="w-4 h-4 mr-2" />
                          {isRTL ? 'عرض التحديات المُكلفة' : 'View Assigned Challenges'}
                        </Button>
                        <Button onClick={() => navigate('/statistics')} variant="outline" className="w-full justify-start">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          {isRTL ? 'عرض التحليلات' : 'View Analytics'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Expertise Areas */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{isRTL ? 'مجالات الخبرة' : 'Expertise Areas'}</CardTitle>
                      <CardDescription>
                        {isRTL ? 'مجالات تخصصك' : 'Your areas of specialization'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {stats.expertiseAreas.map((area, index) => (
                          <Badge key={index} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pending" className="space-y-4 animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isRTL ? 'التقييمات المعلقة' : 'Pending Evaluations'}</CardTitle>
                      <CardDescription>
                        {isRTL ? 'الأفكار في انتظار مراجعة الخبير' : 'Ideas waiting for your expert review'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {isRTL ? 'جاري التحميل...' : 'Loading...'}
                          </p>
                        </div>
                      ) : pendingEvaluations.length > 0 ? (
                        <div className="space-y-3">
                          {pendingEvaluations.map((evaluation) => (
                            <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-start space-x-3">
                                <Lightbulb className="w-5 h-5 text-muted-foreground mt-1" />
                                <div>
                                  <h4 className="font-medium">{evaluation.idea_title}</h4>
                                  <p className="text-sm text-muted-foreground">{evaluation.challenge_title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {isRTL ? `تم التقديم منذ ${evaluation.days_pending} أيام` : `Submitted ${evaluation.days_pending} days ago`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getPriorityBadge(evaluation.priority, evaluation.days_pending)}
                                <Button size="sm" onClick={() => navigate(`/evaluations/${evaluation.id}`)}>
                                  <Star className="w-4 h-4 mr-1" />
                                  {isRTL ? 'قيّم' : 'Evaluate'}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">
                            {isRTL ? 'لا توجد تقييمات معلقة' : 'No pending evaluations'}
                          </h3>
                          <p className="text-muted-foreground">
                            {isRTL ? 'رائع! لقد أنهيت جميع المهام.' : 'Great job! You\'re all caught up.'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="completed" className="space-y-4 animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isRTL ? 'التقييمات الأخيرة' : 'Recent Evaluations'}</CardTitle>
                      <CardDescription>
                        {isRTL ? 'التقييمات المكتملة مؤخراً' : 'Your recently completed evaluations'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recentEvaluations.length > 0 ? (
                        <div className="space-y-3">
                          {recentEvaluations.map((evaluation) => (
                            <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-start space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                                <div>
                                  <h4 className="font-medium">{evaluation.idea_title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {isRTL ? `تم التقييم في ${new Date(evaluation.evaluation_date).toLocaleDateString('ar-SA')}` : 
                                             `Evaluated on ${new Date(evaluation.evaluation_date).toLocaleDateString()}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getScoreBadge(evaluation.score)}
                                <span className="text-sm font-medium">{evaluation.score}/10</span>
                                <Button size="sm" variant="outline" onClick={() => navigate(`/evaluations/${evaluation.id}`)}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  {isRTL ? 'اعرض' : 'View'}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">
                            {isRTL ? 'لم يتم إنجاز أي تقييمات بعد' : 'No completed evaluations yet'}
                          </h3>
                          <p className="text-muted-foreground">
                            {isRTL ? 'ابدأ تقييم الأفكار لترى تاريخك هنا' : 'Start evaluating ideas to see your history here'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4 animate-fade-in">
                  <ExpertAnalyticsDashboard />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Quick Stats Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-900">
                    {isRTL ? 'إحصائيات سريعة' : 'Quick Stats'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-700">
                      {isRTL ? 'هذا الأسبوع' : 'This Week'}
                    </span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {Math.floor(stats.pendingEvaluations / 2)} {isRTL ? 'تقييمات' : 'evaluations'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-700">
                      {isRTL ? 'متوسط الوقت' : 'Avg Time'}
                    </span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {isRTL ? '2.1 أيام' : '2.1 days'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-700">
                      {isRTL ? 'معدل الجودة' : 'Quality Rate'}
                    </span>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      {stats.averageRating.toFixed(1)}/10
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      action: isRTL ? 'تم تقييم فكرة' : 'Evaluated idea',
                      time: isRTL ? 'منذ ساعتين' : '2h ago',
                      type: 'evaluation'
                    },
                    {
                      action: isRTL ? 'تكليف جديد' : 'New assignment',
                      time: isRTL ? 'منذ 5 ساعات' : '5h ago',
                      type: 'assignment'
                    },
                    {
                      action: isRTL ? 'تم تحديث الملف' : 'Profile updated',
                      time: isRTL ? 'أمس' : 'Yesterday',
                      type: 'profile'
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{activity.action}</span>
                      <span className="text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    </AppShell>
  );
}