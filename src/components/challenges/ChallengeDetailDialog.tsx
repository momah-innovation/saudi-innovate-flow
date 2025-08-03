import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  FileText
} from 'lucide-react';

interface ChallengeDetailDialogProps {
  challenge: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParticipate?: (challenge: any) => void;
  onSubmit?: (challenge: any) => void;
  onBookmark?: (challenge: any) => void;
}

export const ChallengeDetailDialog = ({
  challenge,
  open,
  onOpenChange,
  onParticipate,
  onSubmit,
  onBookmark
}: ChallengeDetailDialogProps) => {
  const { isRTL } = useDirection();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isParticipating, setIsParticipating] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFocusQuestionWizard, setShowFocusQuestionWizard] = useState(false);

  useEffect(() => {
    if (challenge && user) {
      checkParticipationStatus();
      checkBookmarkStatus();
    }
  }, [challenge, user]);

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

  if (!challenge) return null;

  const daysRemaining = getDaysRemaining();
  const progressPercentage = getProgressPercentage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header with Hero Image */}
        <div className="relative h-48 bg-gradient-to-r from-primary to-primary-glow overflow-hidden">
          {challenge.image_url && (
            <img 
              src={challenge.image_url} 
              alt={challenge.title_ar}
              className="w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500 text-white">
              {challenge.status}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onBookmark?.(challenge)}
              className={`backdrop-blur-sm ${
                isBookmarked 
                  ? 'bg-red-500/80 hover:bg-red-600/80 text-white' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Title and Key Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
              <TabsTrigger value="details">{isRTL ? 'التفاصيل' : 'Details'}</TabsTrigger>
              <TabsTrigger value="requirements">{isRTL ? 'المتطلبات' : 'Requirements'}</TabsTrigger>
              <TabsTrigger value="admin">{isRTL ? 'إدارة' : 'Admin'}</TabsTrigger>
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
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{challenge.estimated_budget?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-muted-foreground">{isRTL ? 'ريال' : 'SAR'}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{daysRemaining || 0}</div>
                  <div className="text-sm text-muted-foreground">{isRTL ? 'يوم متبقي' : 'Days Left'}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
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

            <TabsContent value="admin" className="space-y-6 mt-6">
              {hasRole('admin') || hasRole('moderator') ? (
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{isRTL ? 'ليس لديك صلاحية للوصول لأدوات الإدارة.' : 'You do not have permission to access admin tools.'}</p>
                </div>
              )}
            </TabsContent>
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
              className={isBookmarked ? 'border-red-500 text-red-500' : ''}
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
};