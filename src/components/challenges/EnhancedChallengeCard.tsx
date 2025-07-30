import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarIcon, Target, Users, Award, Star, Eye, BookmarkIcon, 
  TrendingUp, Clock, Zap, CheckCircle, AlertCircle 
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useState } from 'react';

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
  trending?: boolean;
  featured?: boolean;
  experts?: Array<{ name: string; avatar: string; }>;
}

interface EnhancedChallengeCardProps {
  challenge: Challenge;
  onViewDetails: (challenge: Challenge) => void;
  onParticipate: (challenge: Challenge) => void;
  onBookmark?: (challenge: Challenge) => void;
  viewMode?: 'cards' | 'list' | 'grid';
}

export const EnhancedChallengeCard = ({ 
  challenge, 
  onViewDetails, 
  onParticipate, 
  onBookmark,
  viewMode = 'cards' 
}: EnhancedChallengeCardProps) => {
  const { isRTL } = useDirection();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'published': return 'bg-green-500 text-white';
      case 'upcoming': return 'bg-blue-500 text-white';
      case 'planning': return 'bg-blue-500 text-white';
      case 'closed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDifficultyColor = (priority: string) => {
    switch (priority) {
      case 'منخفض': case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'متوسط': case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'عالي': case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': case 'published': return isRTL ? 'نشط' : 'Active';
      case 'upcoming': case 'planning': return isRTL ? 'قريباً' : 'Upcoming';
      case 'closed': return isRTL ? 'مغلق' : 'Closed';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': case 'published': return CheckCircle;
      case 'upcoming': case 'planning': return Clock;
      case 'closed': return AlertCircle;
      default: return Target;
    }
  };

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

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(challenge);
  };

  const daysLeft = calculateDaysLeft();
  const progress = calculateProgress();
  const StatusIcon = getStatusIcon(challenge.status);

  return (
    <Card className="group relative overflow-hidden hover-scale animate-fade-in transition-all duration-300 hover:shadow-xl">
      {/* Enhanced Image Section */}
      <div className="relative h-48 overflow-hidden">
        {challenge.image_url ? (
          <img 
            src={challenge.image_url} 
            alt={challenge.title_ar} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Target className="w-16 h-16 text-primary" />
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badge - Enhanced */}
        <div className="absolute top-3 right-3 flex gap-2">
          {challenge.priority_level === 'عالي' && (
            <Badge className="bg-orange-500 text-white border-0">
              <TrendingUp className="w-3 h-3 mr-1" />
              {isRTL ? 'رائج' : 'Trending'}
            </Badge>
          )}
          <Badge className={`${getStatusColor(challenge.status)} border-0 flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {getStatusText(challenge.status)}
          </Badge>
        </div>

        {/* Bookmark Button - Enhanced */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`absolute top-3 left-3 transition-all duration-200 ${
            isBookmarked 
              ? 'bg-primary text-white hover:bg-primary/90' 
              : 'bg-white/80 hover:bg-white text-gray-700'
          }`}
        >
          <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>

        {/* Days Left Indicator */}
        {daysLeft !== null && daysLeft <= 7 && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {daysLeft === 0 ? (isRTL ? 'اليوم الأخير' : 'Last Day') : `${daysLeft} ${isRTL ? 'أيام' : 'days'}`}
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {isRTL ? challenge.title_ar : challenge.title_en || challenge.title_ar}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {isRTL ? challenge.description_ar : challenge.description_en || challenge.description_ar}
            </p>
          </div>
          <Badge className={getDifficultyColor(challenge.priority_level || 'متوسط')}>
            {challenge.priority_level || 'متوسط'}
          </Badge>
        </div>

        {/* Progress Bar */}
        {challenge.start_date && challenge.end_date && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{isRTL ? 'التقدم' : 'Progress'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Expert Avatars - Enhanced */}
        {challenge.experts && challenge.experts.length > 0 && (
          <div className="flex items-center justify-between mt-3 p-2 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium text-foreground">{isRTL ? 'الخبراء المرشدون:' : 'Expert Mentors:'}</span>
            <div className="flex -space-x-2">
              {challenge.experts.slice(0, 4).map((expert, index) => (
                <Avatar key={index} className="w-8 h-8 border-2 border-background hover:scale-110 transition-transform cursor-pointer" title={expert.name}>
                  <AvatarImage src={expert.avatar} alt={expert.name} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">{expert.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {challenge.experts.length > 4 && (
                <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center hover:bg-muted/80 transition-colors">
                  <span className="text-xs font-medium">+{challenge.experts.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Users className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">{challenge.participants || 0}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'مشارك' : 'participants'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Target className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">{challenge.submissions || 0}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'مساهمة' : 'submissions'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">
                {challenge.end_date ? new Date(challenge.end_date).toLocaleDateString('ar-SA') : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'تاريخ الانتهاء' : 'deadline'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Award className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">
                {challenge.estimated_budget ? `${challenge.estimated_budget.toLocaleString()} ريال` : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'الجائزة' : 'prize'}</div>
            </div>
          </div>
        </div>

        {/* Challenge Type Badge */}
        <div className="mb-4">
          <Badge variant="outline" className="truncate">
            <Zap className="w-3 h-3 mr-1" />
            {challenge.challenge_type || 'تحدي'}
          </Badge>
        </div>

        {/* Action Buttons - Enhanced */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(challenge)}
            className="flex-1 hover:bg-primary hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isRTL ? 'التفاصيل' : 'Details'}
          </Button>
          <Button 
            size="sm" 
            onClick={() => onParticipate(challenge)}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Star className="h-4 w-4 mr-2" />
            {isRTL ? 'المشاركة' : 'Participate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};