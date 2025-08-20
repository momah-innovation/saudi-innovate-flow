import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { navigationHandler } from '@/utils/unified-navigation';
import { formatDateArabic, formatRelativeTime } from '@/utils/unified-date-handler';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  Lightbulb,
  MessageSquare,
  FileText,
  Trophy,
  AlertTriangle,
  Eye,
  Share2,
  Bookmark,
  ChevronRight,
  Zap,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { ChallengeCollaborationSidebar } from './ChallengeCollaborationSidebar';
import { ChallengeDiscussionBoard } from './ChallengeDiscussionBoard';
import { ChallengeTeamWorkspace } from './ChallengeTeamWorkspace';
import { ChallengeSubmissionHub } from './ChallengeSubmissionHub';
import { ChallengeExpertPanel } from './ChallengeExpertPanel';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';
import { useChallengeStats } from '@/hooks/useChallengeStats';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type?: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  created_at: string;
  updated_at: string;
  sector_id?: string;
  sectors?: {
    name_ar: string;
  } | null;
}

interface ChallengeStats {
  participants_count: number;
  submissions_count: number;
  experts_count: number;
  discussions_count: number;
  teams_count: number;
}

export const ChallengePage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);

  // Initialize error handler
  const errorHandler = createErrorHandler({
    component: 'ChallengePage',
    showToast: true,
    logError: true
  });

  const { user } = useAuth();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [stats, setStats] = useState<ChallengeStats>({
    participants_count: 0,
    submissions_count: 0,
    experts_count: 0,
    discussions_count: 0,
    teams_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isParticipant, setIsParticipant] = useState(false);
  const [userTeam, setUserTeam] = useState<any>(null);
  const { data: challengeStats } = useChallengeStats(challengeId);

  useEffect(() => {
    if (challengeStats) {
      setStats(prev => ({ ...prev, ...challengeStats }));
    }
  }, [challengeStats]);

  useEffect(() => {
    if (challengeId) {
      loadChallenge();
      loadChallengeStats();
      checkUserParticipation();
    }
  }, [challengeId]);

  const loadChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          sectors(name_ar)
        `)
        .eq('id', challengeId)
        .maybeSingle();

      if (error) throw error;
      setChallenge(data as any);
    } catch (error) {
      errorHandler.handleError(error, 
        { operation: 'loadChallenge', metadata: { challengeId } },
        'خطأ في تحميل التحدي. حدث خطأ أثناء تحميل بيانات التحدي'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadChallengeStats = async () => {
    try {
      if (challengeStats) {
        setStats(prev => ({ ...prev, ...challengeStats }));
      }
    } catch (error) {
      errorHandler.handleError(error, 
        { operation: 'loadChallengeStats', metadata: { challengeId } },
        'خطأ في تحميل إحصائيات التحدي'
      );
    }
  };

  const checkUserParticipation = async () => {
    if (!user) return;

    try {
      const { data: participation } = await supabase
        .from('challenge_participants')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id)
        .maybeSingle();

      setIsParticipant(!!participation);
      
      // TODO: Check if user is part of any team for this challenge
    } catch (error) {
      // User is not a participant
      setIsParticipant(false);
    }
  };

  const handleJoinChallenge = async () => {
    if (!user || !challengeId) return;

    try {
      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          status: 'registered',
          participation_type: 'individual'
        });

      if (error) throw error;

      setIsParticipant(true);
      toast({
        title: 'تم الانضمام للتحدي',
        description: 'تم تسجيلك في التحدي بنجاح'
      });
      
      // Reload stats
      loadChallengeStats();
    } catch (error) {
      errorHandler.handleError(error, 
        { operation: 'joinChallenge', metadata: { challengeId } },
        'خطأ في الانضمام. حدث خطأ أثناء الانضمام للتحدي'
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'closed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">جاري تحميل التحدي...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">التحدي غير موجود</h3>
            <p className="text-muted-foreground mb-4">لم نتمكن من العثور على التحدي المطلوب</p>
            <Button onClick={() => navigationHandler.navigateTo('/challenges')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للتحديات
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CollaborationProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigationHandler.navigateTo('/challenges')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  العودة للتحديات
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Badge className={getStatusColor(challenge.status)}>
                    {challenge.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(challenge.priority_level)}>
                    {challenge.priority_level}
                  </Badge>
                  {challenge.sensitivity_level === 'sensitive' && (
                    <Badge variant="outline" className="text-orange-600">
                      <Eye className="h-3 w-3 mr-1" />
                      محدود
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  مشاركة
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-1" />
                  حفظ
                </Button>
                {!isParticipant && (
                  <Button onClick={handleJoinChallenge} size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    انضم للتحدي
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Challenge Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {challenge.title_ar}
                      </h1>
                      {challenge.sectors && (
                        <p className="text-sm text-muted-foreground">
                          {challenge.sectors.name_ar}
                        </p>
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 border-y">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{stats.participants_count}</div>
                        <div className="text-sm text-muted-foreground">مشارك</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{stats.submissions_count}</div>
                        <div className="text-sm text-muted-foreground">مقترح</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{stats.experts_count}</div>
                        <div className="text-sm text-muted-foreground">خبير</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{stats.discussions_count}</div>
                        <div className="text-sm text-muted-foreground">نقاش</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{stats.teams_count}</div>
                        <div className="text-sm text-muted-foreground">فريق</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-muted-foreground leading-relaxed">
                        {challenge.description_ar}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Challenge Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="discussions">النقاشات</TabsTrigger>
                  <TabsTrigger value="submissions">المقترحات</TabsTrigger>
                  <TabsTrigger value="teams">الفرق</TabsTrigger>
                  <TabsTrigger value="experts">الخبراء</TabsTrigger>
                  <TabsTrigger value="timeline">الجدول الزمني</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>تفاصيل التحدي</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {challenge.start_date && (
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">تاريخ البداية</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDateArabic(challenge.start_date)}
                              </p>
                            </div>
                          </div>
                        )}
                        {challenge.end_date && (
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">تاريخ الانتهاء</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDateArabic(challenge.end_date)}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <Target className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">نوع التحدي</p>
                            <p className="text-sm text-muted-foreground">
                              {challenge.challenge_type || 'عام'}
                            </p>
                          </div>
                        </div>
                        {challenge.estimated_budget && (
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Trophy className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">الميزانية المقدرة</p>
                              <p className="text-sm text-muted-foreground">
                                {challenge.estimated_budget.toLocaleString()} ريال
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="discussions">
                  <ChallengeDiscussionBoard challengeId={challengeId!} />
                </TabsContent>

                <TabsContent value="submissions">
                  <ChallengeSubmissionHub challengeId={challengeId!} />
                </TabsContent>

                <TabsContent value="teams">
                  <ChallengeTeamWorkspace challengeId={challengeId!} />
                </TabsContent>

                <TabsContent value="experts">
                  <ChallengeExpertPanel challengeId={challengeId!} />
                </TabsContent>

                <TabsContent value="timeline">
                  <Card>
                    <CardHeader>
                      <CardTitle>الجدول الزمني للتحدي</CardTitle>
                      <CardDescription>تتبع مراحل وأهداف التحدي</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">إطلاق التحدي</p>
                            <p className="text-sm text-muted-foreground">تم إطلاق التحدي وفتح التسجيل</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDateArabic(challenge.created_at)}
                          </div>
                        </div>
                        {/* Add more timeline items */}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Collaboration Sidebar */}
            <div className="lg:col-span-1">
              <ChallengeCollaborationSidebar 
                challengeId={challengeId!}
                isParticipant={isParticipant}
                userTeam={userTeam}
              />
            </div>
          </div>
        </div>
      </div>
    </CollaborationProvider>
  );
};

export default ChallengePage;