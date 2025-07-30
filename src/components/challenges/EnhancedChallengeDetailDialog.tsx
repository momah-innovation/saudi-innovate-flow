import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, Users, Trophy, Target, Clock, MapPin, 
  FileText, Share2, BookmarkIcon, Star, CheckCircle,
  MessageSquare, TrendingUp, Zap, Award 
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  end_date?: string;
  start_date?: string;
  participants?: number;
  submissions?: number;
  challenge_type?: string;
  estimated_budget?: number;
  priority_level?: string;
  image_url?: string;
  experts?: Array<{ name: string; profile_image_url: string; }>;
}

interface EnhancedChallengeDetailDialogProps {
  challenge: Challenge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParticipate: (challenge: Challenge) => void;
  onSubmit: (challenge: Challenge) => void;
  onViewComments: (challenge: Challenge) => void;
}

export const EnhancedChallengeDetailDialog = ({
  challenge,
  open,
  onOpenChange,
  onParticipate,
  onSubmit,
  onViewComments
}: EnhancedChallengeDetailDialogProps) => {
  const { isRTL } = useDirection();
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!challenge) return null;

  const calculateDaysLeft = () => {
    if (!challenge.end_date) return null;
    const endDate = new Date(challenge.end_date);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateProgress = () => {
    if (!challenge.start_date || !challenge.end_date) return 0;
    const startDate = new Date(challenge.start_date);
    const endDate = new Date(challenge.end_date);
    const now = new Date();
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  const daysLeft = calculateDaysLeft();
  const progress = calculateProgress();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          {/* Hero Image */}
          <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-lg">
            {challenge.image_url ? (
              <img 
                src={challenge.image_url} 
                alt={challenge.title_ar}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Target className="w-16 h-16 text-primary" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-primary text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  {challenge.challenge_type}
                </Badge>
                
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={isBookmarked ? 'bg-primary text-white' : ''}
                  >
                    <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                {isRTL ? challenge.title_ar : challenge.title_en || challenge.title_ar}
              </DialogTitle>
              
              <DialogDescription className="text-white/80 mb-2">
                {isRTL ? 'تفاصيل التحدي والمشاركة' : 'Challenge details and participation'}
              </DialogDescription>
              
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{challenge.participants || 0} {isRTL ? 'مشارك' : 'participants'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{challenge.submissions || 0} {isRTL ? 'مساهمة' : 'submissions'}</span>
                </div>
                {daysLeft !== null && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{daysLeft} {isRTL ? 'أيام متبقية' : 'days left'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        {challenge.start_date && challenge.end_date && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{isRTL ? 'تقدم التحدي' : 'Challenge Progress'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-lg text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold">
              {challenge.estimated_budget ? `${challenge.estimated_budget.toLocaleString()} ريال` : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">{isRTL ? 'قيمة الجائزة' : 'Prize Value'}</div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold">
              {challenge.end_date ? new Date(challenge.end_date).toLocaleDateString('ar-SA') : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">{isRTL ? 'تاريخ الانتهاء' : 'Deadline'}</div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold">{challenge.priority_level || 'متوسط'}</div>
            <div className="text-xs text-muted-foreground">{isRTL ? 'مستوى الأولوية' : 'Priority Level'}</div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold">{challenge.status}</div>
            <div className="text-xs text-muted-foreground">{isRTL ? 'الحالة' : 'Status'}</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="details">{isRTL ? 'التفاصيل' : 'Details'}</TabsTrigger>
            <TabsTrigger value="experts">{isRTL ? 'الخبراء' : 'Experts'}</TabsTrigger>
            <TabsTrigger value="timeline">{isRTL ? 'الجدول الزمني' : 'Timeline'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">{isRTL ? 'وصف التحدي' : 'Challenge Description'}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL ? challenge.description_ar : challenge.description_en || challenge.description_ar}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">{isRTL ? 'الأهداف المتوقعة' : 'Expected Outcomes'}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {isRTL ? 'حلول مبتكرة ومناسبة للسوق المحلي' : 'Innovative solutions suitable for local market'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {isRTL ? 'تطوير المواهب المحلية في مجال التكنولوجيا' : 'Development of local tech talent'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {isRTL ? 'دعم أهداف رؤية 2030' : 'Support Vision 2030 objectives'}
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">{isRTL ? 'معايير المشاركة' : 'Participation Criteria'}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {isRTL ? 'مفتوح للجميع' : 'Open to everyone'}</li>
                  <li>• {isRTL ? 'يمكن المشاركة فردياً أو ضمن فريق' : 'Individual or team participation'}</li>
                  <li>• {isRTL ? 'الحد الأقصى 5 أعضاء للفريق' : 'Maximum 5 team members'}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">{isRTL ? 'متطلبات التقديم' : 'Submission Requirements'}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {isRTL ? 'عرض تقديمي (PDF)' : 'Presentation (PDF)'}</li>
                  <li>• {isRTL ? 'نموذج أولي أو عرض توضيحي' : 'Prototype or demo'}</li>
                  <li>• {isRTL ? 'خطة تنفيذية مفصلة' : 'Detailed implementation plan'}</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experts" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{isRTL ? 'الخبراء المرشدون' : 'Expert Mentors'}</h3>
                <Badge variant="outline" className="text-xs">
                  {challenge.experts?.length || 0} {isRTL ? 'خبير' : 'experts'}
                </Badge>
              </div>
              
              {challenge.experts && challenge.experts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {challenge.experts.map((expert, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow bg-card">
                      <Avatar className="w-14 h-14 ring-2 ring-primary/10">
                        <AvatarImage src={expert.profile_image_url} alt={expert.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {expert.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{expert.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {isRTL ? 'خبير استشاري' : 'Expert Consultant'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {isRTL ? 'متاح للاستشارة' : 'Available'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">{isRTL ? 'سيتم تحديد الخبراء قريباً' : 'Experts will be assigned soon'}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'الجدول الزمني' : 'Timeline'}</h3>
              <div className="space-y-3">
                {challenge.start_date && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">{isRTL ? 'بداية التحدي' : 'Challenge Start'}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(challenge.start_date).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">{isRTL ? 'فترة التقديم' : 'Submission Period'}</div>
                    <div className="text-sm text-muted-foreground">{isRTL ? 'مفتوحة الآن' : 'Open now'}</div>
                  </div>
                </div>
                
                {challenge.end_date && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">{isRTL ? 'نهاية التقديم' : 'Submission Deadline'}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(challenge.end_date).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t">
          <Button 
            onClick={() => onParticipate(challenge)}
            className="flex-1"
          >
            <Star className="w-4 h-4 mr-2" />
            {isRTL ? 'المشاركة في التحدي' : 'Join Challenge'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => onSubmit(challenge)}
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isRTL ? 'تقديم الحل' : 'Submit Solution'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => onViewComments(challenge)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {isRTL ? 'المناقشات' : 'Discussions'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};