import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { IconActionButton } from '@/components/ui/icon-action-button';
import { 
  CalendarIcon, Target, Users, Award, Star, Eye, BookmarkIcon, 
  TrendingUp, Clock, Zap, CheckCircle, AlertCircle, Heart,
  Share2, MessageSquare, Trophy
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

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
  experts?: Array<{ name: string; profile_image_url: string; }>;
  difficulty?: string;
  success_rate?: number;
  tags?: string[];
}

interface ChallengeCardProps {
  challenge: Challenge;
  onViewDetails: (challenge: Challenge) => void;
  onParticipate: (challenge: Challenge) => void;
  onBookmark?: (challenge: Challenge) => void;
  onLike?: (challenge: Challenge) => void;
  onShare?: (challenge: Challenge) => void;
  viewMode?: 'cards' | 'list' | 'grid';
  variant?: 'basic' | 'enhanced' | 'compact';
}

export const ChallengeCard = ({ 
  challenge, 
  onViewDetails, 
  onParticipate,
  onBookmark,
  onLike,
  onShare,
  viewMode = 'cards',
  variant = 'enhanced'
}: ChallengeCardProps) => {
  const { isRTL } = useDirection();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400',
      published: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400',
      upcoming: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
      planning: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
      draft: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400',
      closed: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400',
      completed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
      cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'عالي': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400',
      'High': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400',
      'متوسط': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
      'منخفض': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400',
      'Low': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400'
    };
    return colors[priority as keyof typeof colors] || colors['متوسط'];
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'صعب': 'bg-red-100 text-red-800 border-red-200',
      'Hard': 'bg-red-100 text-red-800 border-red-200',
      'متوسط': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'سهل': 'bg-green-100 text-green-800 border-green-200',
      'Easy': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[difficulty as keyof typeof colors] || colors['متوسط'];
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      active: isRTL ? 'نشط' : 'Active',
      published: isRTL ? 'نشط' : 'Active',
      upcoming: isRTL ? 'قريباً' : 'Upcoming',
      planning: isRTL ? 'قريباً' : 'Upcoming',
      draft: isRTL ? 'مسودة' : 'Draft',
      closed: isRTL ? 'مغلق' : 'Closed',
      completed: isRTL ? 'مكتمل' : 'Completed',
      cancelled: isRTL ? 'ملغي' : 'Cancelled'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusIcon = (status: string) => {
    const iconMap = {
      active: CheckCircle,
      published: CheckCircle,
      upcoming: Clock,
      planning: Clock,
      closed: AlertCircle,
      completed: CheckCircle,
      cancelled: AlertCircle,
      draft: Clock
    };
    return iconMap[status as keyof typeof iconMap] || Target;
  };

  const calculateDaysLeft = () => {
    if (!challenge.end_date) return null;
    const endDate = new Date(challenge.end_date);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }) : 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(challenge);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(challenge);
  };

  const handleShare = () => {
    onShare?.(challenge);
  };

  // Calculations
  const daysLeft = calculateDaysLeft();
  const progress = calculateProgress();
  const StatusIcon = getStatusIcon(challenge.status);
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
  const isNew = new Date(challenge.start_date || Date.now()) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const title = isRTL ? challenge.title_ar : challenge.title_en || challenge.title_ar;
  const description = isRTL ? challenge.description_ar : challenge.description_en || challenge.description_ar;

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-300 hover-scale animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Challenge Image */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                {challenge.image_url ? (
                  <img 
                    src={challenge.image_url} 
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary/40" />
                  </div>
                )}
              </div>
              
              {/* Status Indicators */}
              {(challenge.trending || isNew) && (
                <div className="absolute -top-1 -right-1">
                  <Badge variant="secondary" className="text-xs px-1 py-0.5">
                    {challenge.trending ? <TrendingUp className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                  </Badge>
                </div>
              )}
            </div>

            {/* Challenge Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg truncate">{title}</h3>
                    {isNew && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        {isRTL ? 'جديد' : 'New'}
                      </Badge>
                    )}
                    {isUrgent && (
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {isRTL ? 'عاجل' : 'Urgent'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span>{challenge.participants || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-muted-foreground" />
                      <span>{challenge.estimated_budget ? `${(challenge.estimated_budget / 1000).toFixed(0)}k` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{daysLeft || 0} {isRTL ? 'يوم' : 'days'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-muted-foreground" />
                      <span>{challenge.success_rate || 85}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(challenge.status)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {getStatusText(challenge.status)}
                    </Badge>
                    <Badge className={getPriorityColor(challenge.priority_level || 'متوسط')}>
                      {challenge.priority_level || 'متوسط'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <IconActionButton
                      icon={<Heart className={cn("w-4 h-4", isLiked && "fill-current text-red-500")} />}
                      tooltip={isRTL ? 'أعجبني' : 'Like'}
                      onClick={handleLike}
                    />
                    <IconActionButton
                      icon={<BookmarkIcon className={cn("w-4 h-4", isBookmarked && "fill-current")} />}
                      tooltip={isRTL ? 'حفظ' : 'Bookmark'}
                      onClick={handleBookmark}
                    />
                    <IconActionButton
                      icon={<Share2 className="w-4 h-4" />}
                      tooltip={isRTL ? 'مشاركة' : 'Share'}
                      onClick={handleShare}
                    />
                    <IconActionButton
                      icon={<Eye className="w-4 h-4" />}
                      tooltip={isRTL ? 'التفاصيل' : 'View Details'}
                      onClick={() => onViewDetails(challenge)}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => onParticipate(challenge)}
                      disabled={challenge.status !== 'active' && challenge.status !== 'published'}
                      className="ml-2"
                    >
                      {isRTL ? 'شارك' : 'Join'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {variant === 'enhanced' && challenge.start_date && challenge.end_date && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{isRTL ? 'التقدم' : 'Progress'}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // CARD/GRID VIEW
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {challenge.image_url ? (
          <img 
            src={challenge.image_url} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Target className="w-16 h-16 text-primary/40" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={getStatusColor(challenge.status)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {getStatusText(challenge.status)}
          </Badge>
          {challenge.trending && (
            <Badge className="bg-orange-100 text-orange-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              {isRTL ? 'رائج' : 'Trending'}
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-blue-100 text-blue-800">
              <Star className="w-3 h-3 mr-1" />
              {isRTL ? 'جديد' : 'New'}
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconActionButton
            icon={<Heart className={cn("w-4 h-4", isLiked && "fill-current text-red-500")} />}
            tooltip={isRTL ? 'أعجبني' : 'Like'}
            onClick={handleLike}
            className="bg-white/80 hover:bg-white"
          />
          <IconActionButton
            icon={<BookmarkIcon className={cn("w-4 h-4", isBookmarked && "fill-current")} />}
            tooltip={isRTL ? 'حفظ' : 'Bookmark'}
            onClick={handleBookmark}
            className="bg-white/80 hover:bg-white"
          />
          <IconActionButton
            icon={<Share2 className="w-4 h-4" />}
            tooltip={isRTL ? 'مشاركة' : 'Share'}
            onClick={handleShare}
            className="bg-white/80 hover:bg-white"
          />
        </div>

        {/* Urgency Indicator */}
        {isUrgent && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-red-500 text-white animate-pulse">
              <AlertCircle className="w-3 h-3 mr-1" />
              {daysLeft} {isRTL ? 'أيام' : 'days'}
            </Badge>
          </div>
        )}

        {/* Prize */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center min-w-[4rem]">
            <div className="text-xs font-medium text-muted-foreground">
              {isRTL ? 'الجائزة' : 'Prize'}
            </div>
            <div className="text-sm font-bold">
              {challenge.estimated_budget ? 
                `${(challenge.estimated_budget / 1000).toFixed(0)}k` : 
                (isRTL ? 'غير محدد' : 'TBD')
              }
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {description}
            </CardDescription>
          </div>
          <Badge className={getPriorityColor(challenge.priority_level || 'متوسط')}>
            {challenge.priority_level || 'متوسط'}
          </Badge>
        </div>

        {/* Challenge Type & Difficulty */}
        <div className="flex items-center gap-2 mt-3">
          {challenge.challenge_type && (
            <Badge variant="outline" className="text-xs">
              {challenge.challenge_type}
            </Badge>
          )}
          {challenge.difficulty && (
            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
          )}
        </div>

        {/* Experts */}
        {variant === 'enhanced' && challenge.experts && challenge.experts.length > 0 && (
          <div className="flex items-center gap-2 mt-3 p-2 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium">{isRTL ? 'الخبراء:' : 'Experts:'}</span>
            <div className="flex -space-x-1">
              {challenge.experts.slice(0, 3).map((expert, index) => (
                <Avatar key={index} className="w-6 h-6 border-2 border-background">
                  <AvatarImage src={expert.profile_image_url} />
                  <AvatarFallback className="text-xs">{expert.name?.[0] || 'X'}</AvatarFallback>
                </Avatar>
              ))}
              {challenge.experts.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs">+{challenge.experts.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress */}
        {variant === 'enhanced' && challenge.start_date && challenge.end_date && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{isRTL ? 'التقدم' : 'Progress'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatDate(challenge.start_date)}</span>
              <span>{formatDate(challenge.end_date)}</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats */}
        {variant !== 'compact' && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">{challenge.participants || 0}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'مشارك' : 'participants'}</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">{challenge.submissions || 0}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'مقترح' : 'submissions'}</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">{challenge.success_rate || 85}%</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'نجاح' : 'success'}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <IconActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip={isRTL ? 'التفاصيل' : 'View Details'}
            onClick={() => onViewDetails(challenge)}
            variant="outline"
          />
          <Button 
            onClick={() => onParticipate(challenge)}
            className="flex-1"
            disabled={challenge.status !== 'active' && challenge.status !== 'published'}
          >
            <Zap className="w-4 h-4 mr-2" />
            {challenge.status !== 'active' && challenge.status !== 'published' ? 
              (isRTL ? 'غير متاح' : 'Unavailable') :
              (isRTL ? 'شارك الآن' : 'Participate')
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};