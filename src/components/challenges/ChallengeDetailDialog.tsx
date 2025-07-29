import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarIcon, 
  Target, 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  BookmarkIcon,
  Share2,
  Star,
  TrendingUp,
  FileText,
  MessageSquare,
  User
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface Challenge {
  id: number;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  status: string;
  deadline: string;
  participants: number;
  submissions: number;
  category: string;
  category_en: string;
  prize: string;
  difficulty: string;
  image?: string;
  trending?: boolean;
  featured?: boolean;
  experts?: Array<{ name: string; avatar: string; role: string; }>;
  requirements?: string[];
  timeline?: Array<{ phase: string; date: string; }>;
  criteria?: string[];
  resources?: Array<{ title: string; url: string; type: string; }>;
}

interface ChallengeDetailDialogProps {
  challenge: Challenge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParticipate: (challenge: Challenge) => void;
}

export const ChallengeDetailDialog = ({ challenge, open, onOpenChange, onParticipate }: ChallengeDetailDialogProps) => {
  const { isRTL } = useDirection();

  if (!challenge) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'سهل': case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'متوسط': case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'صعب': case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return isRTL ? 'نشط' : 'Active';
      case 'upcoming': return isRTL ? 'قريباً' : 'Upcoming';
      case 'closed': return isRTL ? 'مغلق' : 'Closed';
      default: return status;
    }
  };

  const getProgressPercentage = () => {
    const targetParticipants = 500; // Mock target
    return Math.min((challenge.participants / targetParticipants) * 100, 100);
  };

  const mockRequirements = [
    isRTL ? 'خبرة في التقنية والبرمجة' : 'Experience in technology and programming',
    isRTL ? 'فهم المشاكل البيئية' : 'Understanding of environmental issues',
    isRTL ? 'القدرة على العمل ضمن فريق' : 'Ability to work in a team'
  ];

  const mockTimeline = [
    { phase: isRTL ? 'التسجيل' : 'Registration', date: '2024-01-15' },
    { phase: isRTL ? 'تطوير الحلول' : 'Solution Development', date: '2024-02-15' },
    { phase: isRTL ? 'التقييم النهائي' : 'Final Evaluation', date: '2024-03-15' }
  ];

  const mockCriteria = [
    isRTL ? 'الابتكار والإبداع' : 'Innovation and Creativity',
    isRTL ? 'الجدوى التقنية' : 'Technical Feasibility',
    isRTL ? 'التأثير البيئي' : 'Environmental Impact',
    isRTL ? 'إمكانية التطبيق' : 'Implementation Potential'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader className="space-y-4">
          {/* Challenge Image */}
          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg -mx-6 -mt-6 mb-6">
            {challenge.image ? (
              <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Target className="w-24 h-24 text-primary" />
              </div>
            )}
            
            {/* Status Badges Overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              {challenge.trending && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {isRTL ? 'رائج' : 'Trending'}
                </Badge>
              )}
              <Badge className={getStatusColor(challenge.status)}>
                {getStatusText(challenge.status)}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Button variant="secondary" size="sm" className="bg-white/80 hover:bg-white">
                <BookmarkIcon className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/80 hover:bg-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-2">
                  {isRTL ? challenge.title : challenge.title_en}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {isRTL ? challenge.description : challenge.description_en}
                </DialogDescription>
              </div>
              <Badge className={getDifficultyColor(challenge.difficulty)} variant="outline">
                {challenge.difficulty}
              </Badge>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{challenge.participants}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'مشارك' : 'Participants'}</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{challenge.submissions}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'مساهمة' : 'Submissions'}</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Award className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold">{challenge.prize}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'الجائزة' : 'Prize'}</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <CalendarIcon className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-bold">{challenge.deadline}</div>
                <div className="text-xs text-muted-foreground">{isRTL ? 'الموعد النهائي' : 'Deadline'}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isRTL ? 'تقدم المشاركة' : 'Participation Progress'}</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            {/* Expert Team */}
            {challenge.experts && challenge.experts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {isRTL ? 'فريق الخبراء' : 'Expert Team'}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {challenge.experts.map((expert, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={expert.avatar} alt={expert.name} />
                        <AvatarFallback>{expert.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{expert.name}</div>
                        <div className="text-xs text-muted-foreground">{expert.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogHeader>

        <Separator />

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="requirements">{isRTL ? 'المتطلبات' : 'Requirements'}</TabsTrigger>
            <TabsTrigger value="timeline">{isRTL ? 'الجدول الزمني' : 'Timeline'}</TabsTrigger>
            <TabsTrigger value="resources">{isRTL ? 'الموارد' : 'Resources'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {isRTL ? 'معايير التقييم' : 'Evaluation Criteria'}
                </h4>
                <div className="grid gap-2">
                  {mockCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {criterion}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {isRTL ? 'الفئة' : 'Category'}
                </h4>
                <Badge variant="outline" className="text-sm">
                  {isRTL ? challenge.category : challenge.category_en}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isRTL ? 'متطلبات المشاركة' : 'Participation Requirements'}
              </h4>
              <div className="grid gap-3">
                {mockRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <span className="text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {isRTL ? 'الجدول الزمني' : 'Timeline'}
              </h4>
              <div className="space-y-4">
                {mockTimeline.map((phase, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{phase.phase}</div>
                      <div className="text-sm text-muted-foreground">{phase.date}</div>
                    </div>
                    {index < mockTimeline.length - 1 && (
                      <div className="w-px h-8 bg-border absolute ml-4 mt-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isRTL ? 'الموارد والمراجع' : 'Resources & References'}
              </h4>
              <div className="grid gap-3">
                <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">
                        {isRTL ? 'دليل المشاركة' : 'Participation Guide'}
                      </div>
                      <div className="text-xs text-muted-foreground">PDF • 2.3 MB</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">
                        {isRTL ? 'منتدى النقاش' : 'Discussion Forum'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isRTL ? 'انضم للنقاش مع المشاركين الآخرين' : 'Join the discussion with other participants'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BookmarkIcon className="w-4 h-4 mr-2" />
              {isRTL ? 'حفظ' : 'Save'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              {isRTL ? 'مشاركة' : 'Share'}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
            <Button onClick={() => onParticipate(challenge)} className="animate-pulse">
              <User className="w-4 h-4 mr-2" />
              {isRTL ? 'المشاركة الآن' : 'Participate Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};