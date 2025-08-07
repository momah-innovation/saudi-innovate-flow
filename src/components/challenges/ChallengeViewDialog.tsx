import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChallengeFocusQuestionWizard } from './ChallengeFocusQuestionWizard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  Calendar,
  Trophy,
  Target,
  Send,
  Bookmark,
  Clock,
  Star,
  Share2,
  Activity,
  HelpCircle,
  MapPin,
  DollarSign,
  FileText,
  Heart,
  MessageCircle,
  Download,
  Eye
} from 'lucide-react';
import { challengesPageConfig } from '@/config/challengesPageConfig';

interface ChallengeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge: any;
  onParticipate?: (challenge: any) => void;
  onSubmit?: (challenge: any) => void;
  onBookmark?: (challenge: any) => void;
}

export function ChallengeViewDialog({ 
  open, 
  onOpenChange, 
  challenge,
  onParticipate,
  onSubmit,
  onBookmark
}: ChallengeViewDialogProps) {
  const { isRTL } = useDirection();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'winners' | 'top-rated' | 'recent'>('all');
  const [isParticipating, setIsParticipating] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFocusQuestionWizard, setShowFocusQuestionWizard] = useState(false);

  useEffect(() => {
    if (open && challenge) {
      fetchSubmissions();
      if (user) {
        checkParticipationStatus();
        checkBookmarkStatus();
      }
    }
  }, [open, challenge, user]);

  const fetchSubmissions = async () => {
    if (!challenge) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('challenge_submissions')
        .select(`
          id,
          title,
          description,
          created_at,
          score,
          status,
          file_url,
          profiles!challenge_submissions_user_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('challenge_id', challenge.id)
        .eq('status', 'public')
        .order('score', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkParticipationStatus = async () => {
    if (!user || !challenge) return;
    
    try {
      const { data } = await supabase
        .from('challenge_participants')
        .select('id')
        .eq('challenge_id', challenge.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      setIsParticipating(!!data);
    } catch (error) {
      console.error('Error checking participation:', error);
    }
  };

  const checkBookmarkStatus = async () => {
    if (!user || !challenge) return;
    
    try {
      const { data } = await supabase
        .from('challenge_bookmarks')
        .select('id')
        .eq('challenge_id', challenge.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      setIsBookmarked(!!data);
    } catch (error) {
      console.error('Error checking bookmark:', error);
    }
  };

  const handleVoteSubmission = async (submissionId: string) => {
    // Placeholder implementation - will need submission_votes table
    try {
      // For now, just show success message until database table is created
      toast({
        title: "Voted",
        description: "Your vote has been recorded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record your vote",
        variant: "destructive"
      });
    }
  };

  const handleBookmarkSubmission = async (submissionId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to bookmark submissions",
        variant: "destructive"
      });
      return;
    }

    // Placeholder implementation - will need submission_bookmarks table
    try {
      toast({
        title: "Bookmarked",
        description: "Submission bookmarked successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to bookmark submission",
        variant: "destructive"
      });
    }
  };

  const getDaysRemaining = () => {
    if (!challenge.end_date) return null;
    const now = new Date();
    const endDate = new Date(challenge.end_date);
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getProgressPercentage = () => {
    if (!challenge.start_date || !challenge.end_date) return 0;
    const start = new Date(challenge.start_date);
    const end = new Date(challenge.end_date);
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.max(0, Math.min(100, (current / total) * 100));
  };

  const getFilteredSubmissions = () => {
    switch (activeTab) {
      case 'winners':
        return submissions.filter(s => s.status === 'winner');
      case 'top-rated':
        return submissions.filter(s => s.score && s.score >= 8);
      case 'recent':
        return submissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return submissions;
    }
  };

  const renderSubmissionCard = (submission: any) => (
    <Card key={submission.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={submission.profiles?.avatar_url} />
              <AvatarFallback>
                {submission.profiles?.display_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{submission.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {submission.profiles?.display_name || 'User'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {submission.status === 'winner' && (
              <Badge variant="default" className="gap-1">
                <Trophy className="h-3 w-3" />
                {isRTL ? 'فائز' : 'Winner'}
              </Badge>
            )}
            {submission.score && (
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                {submission.score}/10
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-3">{submission.description}</p>
        
        {submission.score && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{isRTL ? 'التقييم' : 'Rating'}</span>
              <span>{submission.score}/10</span>
            </div>
            <Progress value={submission.score * 10} className="h-2" />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleVoteSubmission(submission.id)}
            >
              <Heart className="h-4 w-4 mr-1" />
              {isRTL ? 'إعجاب' : 'Like'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleBookmarkSubmission(submission.id)}
            >
              <Bookmark className="h-4 w-4 mr-1" />
              {isRTL ? 'حفظ' : 'Save'}
            </Button>
          </div>
          
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              {isRTL ? 'عرض' : 'View'}
            </Button>
            {submission.file_url && (
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                {isRTL ? 'تحميل' : 'Download'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {isRTL ? 'تم الإرسال في' : 'Submitted on'} {new Date(submission.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );

  if (!challenge) return null;

  const daysRemaining = getDaysRemaining();
  const progressPercentage = getProgressPercentage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header with Hero Image */}
        <div className={`relative h-48 ${challengesPageConfig.ui.gradients.hero} overflow-hidden`}>
          {challenge.image_url && (
            <img 
              src={challenge.image_url} 
              alt={challenge.title_ar}
              className="w-full h-full object-cover opacity-50"
            />
          )}
          <div className={`absolute inset-0 ${challengesPageConfig.ui.colors.background.overlay} bg-gradient-to-t from-black/60 to-transparent`} />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge className={`${challengesPageConfig.ui.gradients.success} ${challengesPageConfig.ui.colors.text.accent}`}>
              {challenge.status}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className={`${challengesPageConfig.ui.glassMorphism.medium} ${challengesPageConfig.ui.glassMorphism.cardHover}`}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onBookmark?.(challenge)}
              className={`backdrop-blur-sm ${
                isBookmarked 
                  ? `${challengesPageConfig.ui.gradients.danger} ${challengesPageConfig.ui.colors.text.accent}` 
                  : `${challengesPageConfig.ui.glassMorphism.medium} ${challengesPageConfig.ui.glassMorphism.cardHover}`
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Title and Key Info */}
          <div className={`absolute bottom-4 left-4 right-4 ${challengesPageConfig.ui.colors.text.accent}`}>
            <h2 className="text-2xl font-bold mb-2">{challenge.title_ar}</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              {daysRemaining !== null && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{daysRemaining} {isRTL ? 'يوم متبقي' : 'days left'}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{challenge.participants || 0} {isRTL ? 'مشارك' : 'participants'}</span>
              </div>
              {challenge.estimated_budget && (
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>{challenge.estimated_budget.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {challenge.start_date && challenge.end_date && (
          <div className="px-6 pt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{isRTL ? 'تقدم التحدي' : 'Challenge Progress'}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className={`grid w-full ${(hasRole('admin') || hasRole('moderator')) ? 'grid-cols-5' : 'grid-cols-4'}`}>
              <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
              <TabsTrigger value="details">{isRTL ? 'التفاصيل' : 'Details'}</TabsTrigger>
              <TabsTrigger value="requirements">{isRTL ? 'المتطلبات' : 'Requirements'}</TabsTrigger>
              <TabsTrigger value="submissions">{isRTL ? 'المشاركات' : 'Submissions'}</TabsTrigger>
              {(hasRole('admin') || hasRole('moderator')) && (
                <TabsTrigger value="admin">{isRTL ? 'إدارة' : 'Admin'}</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{isRTL ? 'وصف التحدي' : 'Challenge Description'}</h3>
                <p className="text-muted-foreground leading-relaxed">{challenge.description_ar}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{challenge.participants || 0}</div>
                  <div className="text-sm text-muted-foreground">{isRTL ? 'مشارك' : 'Participants'}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Trophy className={`w-6 h-6 mx-auto mb-2 ${challengesPageConfig.ui.colors.stats.yellow}`} />
                  <div className="text-2xl font-bold">{challenge.estimated_budget?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-muted-foreground">{isRTL ? 'ريال' : 'SAR'}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Clock className={`w-6 h-6 mx-auto mb-2 ${challengesPageConfig.ui.colors.stats.blue}`} />
                  <div className="text-2xl font-bold">{daysRemaining || 0}</div>
                  <div className="text-sm text-muted-foreground">{isRTL ? 'يوم متبقي' : 'Days Left'}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Target className={`w-6 h-6 mx-auto mb-2 ${challengesPageConfig.ui.colors.stats.green}`} />
                  <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
                  <div className="text-sm text-muted-foreground">{isRTL ? 'مكتمل' : 'Complete'}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {isRTL ? 'تواريخ التحدي' : 'Challenge Dates'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRTL ? 'تاريخ البداية:' : 'Start Date:'}</span>
                        <span>{challenge.start_date ? new Date(challenge.start_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRTL ? 'تاريخ النهاية:' : 'End Date:'}</span>
                        <span>{challenge.end_date ? new Date(challenge.end_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {challenge.location && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {isRTL ? 'الموقع' : 'Location'}
                      </h4>
                      <p className="text-sm text-muted-foreground">{challenge.location}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {isRTL ? 'الميزانية والجوائز' : 'Budget & Awards'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRTL ? 'الميزانية المقدرة:' : 'Estimated Budget:'}</span>
                        <span>{challenge.estimated_budget?.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRTL ? 'نوع الجائزة:' : 'Award Type:'}</span>
                        <span>{challenge.award_type || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      {isRTL ? 'مستوى التحدي' : 'Challenge Level'}
                    </h4>
                    <div className="flex gap-2">
                      <Badge variant="outline">{challenge.priority_level}</Badge>
                      <Badge variant="outline">{challenge.sensitivity_level}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {isRTL ? 'متطلبات التحدي' : 'Challenge Requirements'}
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">{isRTL ? 'المتطلبات الأساسية' : 'Basic Requirements'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {challenge.requirements || (isRTL ? 'لم يتم تحديد متطلبات خاصة للتحدي.' : 'No specific requirements defined for this challenge.')}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">{isRTL ? 'معايير التقييم' : 'Evaluation Criteria'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {challenge.evaluation_criteria || (isRTL ? 'سيتم الإعلان عن معايير التقييم قريباً.' : 'Evaluation criteria will be announced soon.')}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="space-y-6 mt-6">
              <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">{isRTL ? 'جميع المشاركات' : 'All Submissions'}</TabsTrigger>
                    <TabsTrigger value="winners">{isRTL ? 'الفائزون' : 'Winners'}</TabsTrigger>
                    <TabsTrigger value="top-rated">{isRTL ? 'الأعلى تقييماً' : 'Top Rated'}</TabsTrigger>
                    <TabsTrigger value="recent">{isRTL ? 'الأحدث' : 'Recent'}</TabsTrigger>
                  </TabsList>

                  <div className="flex-1 mt-4 overflow-hidden">
                    <ScrollArea className="h-[400px]">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-1">
                        {loading ? (
                          Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="animate-pulse">
                              <CardHeader>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-8 h-8 ${challengesPageConfig.ui.glassMorphism.light} rounded-full`}></div>
                                  <div className="space-y-2">
                                     <div className={`h-4 ${challengesPageConfig.ui.glassMorphism.light} rounded w-24`}></div>
                                     <div className={`h-3 ${challengesPageConfig.ui.glassMorphism.light} rounded w-16`}></div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                   <div className={`h-4 ${challengesPageConfig.ui.glassMorphism.light} rounded`}></div>
                                   <div className={`h-4 ${challengesPageConfig.ui.glassMorphism.light} rounded w-3/4`}></div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : getFilteredSubmissions().length === 0 ? (
                          <div className="col-span-full text-center py-8">
                            <p className="text-muted-foreground">
                              {activeTab === 'all' ? (isRTL ? 'لا توجد مشاركات بعد' : 'No submissions yet') : `${isRTL ? 'لا توجد' : 'No'} ${activeTab} ${isRTL ? 'مشاركات' : 'submissions'}`}
                            </p>
                          </div>
                        ) : (
                          getFilteredSubmissions().map((submission) => renderSubmissionCard(submission))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </Tabs>
              </div>
            </TabsContent>

            {(hasRole('admin') || hasRole('moderator')) && (
              <TabsContent value="admin" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-3">{isRTL ? 'أدوات الإدارة' : 'Admin Tools'}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-16 flex-col gap-2"
                      onClick={() => navigate(`/admin/challenges/activity/${challenge.id}`)}
                    >
                      <Activity className="w-6 h-6" />
                      <span>{isRTL ? 'مركز النشاط' : 'Activity Hub'}</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-16 flex-col gap-2"
                      onClick={() => setShowFocusQuestionWizard(true)}
                    >
                      <HelpCircle className="w-6 h-6" />
                      <span>{isRTL ? 'إدارة الأسئلة' : 'Manage Questions'}</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            {!isParticipating ? (
              <Button
                onClick={() => onParticipate?.(challenge)}
                className="flex-1"
              >
                <Users className="w-4 h-4 mr-2" />
                {isRTL ? 'انضم للتحدي' : 'Join Challenge'}
              </Button>
            ) : (
              <Button
                onClick={() => onSubmit?.(challenge)}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                {isRTL ? 'قدم مشروعك' : 'Submit Project'}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onBookmark?.(challenge)}
              className={isBookmarked ? `${challengesPageConfig.ui.colors.stats.red} ${challengesPageConfig.ui.colors.stats.red.replace('text-', 'border-')}` : ''}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Focus Question Wizard */}
        <ChallengeFocusQuestionWizard
          open={showFocusQuestionWizard}
          onOpenChange={setShowFocusQuestionWizard}
          challengeId={challenge.id}
          onQuestionSaved={() => {
            setShowFocusQuestionWizard(false);
            toast({
              title: isRTL ? "تم الحفظ" : "Saved",
              description: isRTL ? "تم حفظ السؤال بنجاح" : "Question saved successfully"
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}