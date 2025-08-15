import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Star,
  Activity
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { getActivityTypeMapping, challengesPageConfig } from '@/config/challengesPageConfig';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  end_date: string;
  participants?: number;
  submissions?: number;
}

interface ChallengeActivity {
  id: string;
  challenge_id: string;
  type: 'comment' | 'submission' | 'participation' | 'status_change';
  user_name: string;
  user_avatar?: string;
  action_text: string;
  created_at: string;
  challenge_title: string;
}

interface ChallengeActivityHubProps {
  challenge: Challenge;
  className?: string;
}

export const ChallengeActivityHub = ({ 
  challenge, 
  className = "" 
}: ChallengeActivityHubProps) => {
  const { isRTL } = useDirection();
  const { user } = useAuth();
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('activity');
  const [activities, setActivities] = useState<ChallengeActivity[]>([]);
  const [participants, setParticipants] = useState<unknown[]>([]);
  const [submissions, setSubmissions] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (challenge) {
      loadCollaborationData();
    }
  }, [challenge]);

  const loadCollaborationData = async () => {
    try {
      setLoading(true);
      
      // Load participants
      const { data: participantsData } = await supabase
        .from('challenge_participants')
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('challenge_id', challenge.id)
        .eq('status', 'active');

      setParticipants(participantsData || []);

      // Load submissions
      const { data: submissionsData } = await supabase
        .from('challenge_submissions')
        .select(`
          *,
          profiles:submitted_by (
            display_name,
            avatar_url
          )
        `)
        .eq('challenge_id', challenge.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setSubmissions(submissionsData || []);

      // Mock activity data (in real app, this would be aggregated from multiple tables)
      const mockActivities: ChallengeActivity[] = [
        {
          id: '1',
          challenge_id: challenge.id,
          type: 'participation',
          user_name: 'أحمد محمد',
          user_avatar: '/api/placeholder/32/32',
          action_text: isRTL ? t('challenges:joined_challenge') : t('challenges:joined_challenge'),
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          challenge_title: challenge.title_ar
        },
        {
          id: '2',
          challenge_id: challenge.id,
          type: 'comment',
          user_name: 'فاطمة علي',
          user_avatar: '/api/placeholder/32/32',
          action_text: isRTL ? t('challenges:commented_on_challenge') : t('challenges:commented_on_challenge'),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          challenge_title: challenge.title_ar
        },
        {
          id: '3',
          challenge_id: challenge.id,
          type: 'submission',
          user_name: 'محمد عبدالله',
          user_avatar: '/api/placeholder/32/32',
          action_text: isRTL ? t('challenges:submitted_new_project') : t('challenges:submitted_new_project'),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          challenge_title: challenge.title_ar
        }
      ];

      setActivities(mockActivities);
      
    } catch (error) {
      logger.error('Error loading collaboration data', { 
        component: 'ChallengeActivityHub', 
        action: 'loadCollaborationData',
        data: { challengeId: challenge.id }
      }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    const mapping = getActivityTypeMapping(type);
    const IconComponent = mapping.icon;
    return <IconComponent className={`w-4 h-4 ${mapping.color}`} />;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return isRTL ? t('challenges:now') : t('challenges:now');
    if (diffInMinutes < 60) return `${diffInMinutes}${isRTL ? ' د' : 'm'}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}${isRTL ? ' س' : 'h'}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}${isRTL ? ' ي' : 'd'}`;
  };

  const calculateProgress = () => {
    const deadline = new Date(challenge.end_date);
    const now = new Date();
    const start = new Date(challenge.end_date);
    start.setDate(start.getDate() - 60); // Assume 60-day challenge
    
    const totalDuration = deadline.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  const ActivityItem = ({ activity }: { activity: ChallengeActivity }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <Avatar className="w-8 h-8">
        <AvatarImage src={activity.user_avatar} />
        <AvatarFallback>{activity.user_name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {getActivityIcon(activity.type)}
          <span className="text-sm font-medium">{activity.user_name}</span>
          <span className="text-sm text-muted-foreground">{activity.action_text}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatTimeAgo(activity.created_at)}
        </p>
      </div>
    </div>
  );

  const ParticipantItem = ({ participant }: { participant: unknown }) => {
    const p = participant as Record<string, unknown>;
    const profiles = p.profiles as Record<string, unknown> | null;
    
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
        <Avatar className="w-10 h-10">
          <AvatarImage src={profiles?.avatar_url as string} />
          <AvatarFallback>
            {(profiles?.display_name as string)?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h4 className="text-sm font-medium">
            {profiles?.display_name as string || t('challenges:participant')}
          </h4>
          <p className="text-xs text-muted-foreground">
            {isRTL ? t('challenges:joined') : t('challenges:joined')} {new Date(p.registration_date as string).toLocaleDateString()}
          </p>
        </div>
        
        <Badge variant="outline" className="text-xs">
          {p.participation_type === 'individual' ? 
            (isRTL ? t('challenges:individual') : t('challenges:individual')) : 
            (isRTL ? t('challenges:team') : t('challenges:team'))
          }
        </Badge>
      </div>
    );
  };

  const SubmissionItem = ({ submission }: { submission: unknown }) => {
    const s = submission as Record<string, unknown>;
    const profiles = s.profiles as Record<string, unknown> | null;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profiles?.avatar_url as string} />
              <AvatarFallback>
                {(profiles?.display_name as string)?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h4 className="text-sm font-semibold line-clamp-1">
                {s.title_ar as string}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {isRTL ? t('challenges:by') : t('challenges:by')} {profiles?.display_name as string || t('challenges:unknown')}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {s.description_ar as string}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {s.status as string}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(s.created_at as string)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {isRTL ? t('challenges:collaboration_hub') : t('challenges:collaboration_hub')}
        </CardTitle>
        
        {/* Progress Overview */}
        <div className="bg-muted/30 rounded-lg p-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {isRTL ? t('challenges:challenge_progress') : t('challenges:challenge_progress')}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(calculateProgress())}%
            </span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{participants.length}</div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? t('challenges:participants') : t('challenges:participants')}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${challengesPageConfig.ui.colors.stats.purple}`}>{submissions.length}</div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? t('challenges:submissions') : t('challenges:submissions')}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${challengesPageConfig.ui.colors.stats.orange}`}>{activities.length}</div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? t('challenges:activities') : t('challenges:activities')}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">
              {isRTL ? t('challenges:activity') : t('challenges:activity')}
            </TabsTrigger>
            <TabsTrigger value="participants">
              {isRTL ? t('challenges:participants') : t('challenges:participants')}
            </TabsTrigger>
            <TabsTrigger value="submissions">
              {isRTL ? t('challenges:projects') : t('challenges:projects')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-3 mt-4">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {isRTL ? t('challenges:no_activities_yet') : t('challenges:no_activities_yet')}
                </p>
              </div>
            ) : (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="participants" className="space-y-3 mt-4">
            {participants.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {isRTL ? t('challenges:no_participants_yet') : t('challenges:no_participants_yet')}
                </p>
              </div>
            ) : (
              participants.map((participant) => (
                <ParticipantItem key={(participant as Record<string, unknown>).id as string} participant={participant} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="submissions" className="space-y-3 mt-4">
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {isRTL ? t('challenges:no_submissions_yet') : t('challenges:no_submissions_yet')}
                </p>
              </div>
            ) : (
              submissions.map((submission) => (
                <SubmissionItem key={(submission as Record<string, unknown>).id as string} submission={submission} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};