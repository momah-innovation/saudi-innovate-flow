import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarIcon, 
  Users, 
  Trophy, 
  Clock, 
  Star,
  Bookmark,
  Share2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  Target,
  Award,
  Heart,
  MessageSquare,
  Eye,
  Download
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { InteractionButtons } from '@/components/ui/interaction-buttons';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  challenge_type?: string;
  status: string;
  priority_level: string;
  start_date: string;
  end_date: string;
  estimated_budget?: number;
  image_url?: string;
  participants?: number;
  submissions?: number;
  trending?: boolean;
  experts?: any[];
  difficulty?: string;
  tags?: string[];
  success_rate?: number;
}

interface SuperChallengeCardProps {
  challenge: Challenge;
  onViewDetails: (challenge: Challenge) => void;
  onParticipate: (challenge: Challenge) => void;
  onBookmark?: (challenge: Challenge) => void;
  viewMode?: 'cards' | 'list' | 'grid';
}

export const SuperChallengeCard = ({ 
  challenge, 
  onViewDetails, 
  onParticipate, 
  onBookmark,
  viewMode = 'cards'
}: SuperChallengeCardProps) => {
  const { isRTL } = useDirection();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالي': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'منخفض': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'صعب': return 'bg-red-100 text-red-800 border-red-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'سهل': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }) : 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateDaysLeft = () => {
    const deadline = new Date(challenge.end_date);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const calculateProgress = () => {
    const start = new Date(challenge.start_date);
    const end = new Date(challenge.end_date);
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const daysLeft = calculateDaysLeft();
  const progress = calculateProgress();
  const isUrgent = daysLeft <= 7 && daysLeft > 0;
  const isNew = new Date(challenge.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-300 hover-scale animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Challenge Image */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted">
                {challenge.image_url ? (
                  <img 
                    src={challenge.image_url} 
                    alt={challenge.title_ar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <Target className="w-10 h-10 text-primary/40" />
                  </div>
                )}
              </div>
              
              {/* Status Indicators */}
              {challenge.trending && (
                <div className="absolute -top-1 -right-1">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800">
                    <TrendingUp className="w-3 h-3" />
                  </Badge>
                </div>
              )}
            </div>

            {/* Challenge Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg truncate text-foreground">{challenge.title_ar}</h3>
                    {isNew && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                        {isRTL ? 'جديد' : 'New'}
                      </Badge>
                    )}
                    {isUrgent && (
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 border-red-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {isRTL ? 'عاجل' : 'Urgent'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {challenge.description_ar}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span>{challenge.participants || 0} {isRTL ? 'مشارك' : 'participants'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-muted-foreground" />
                      <span>{challenge.estimated_budget ? `${challenge.estimated_budget.toLocaleString()}` : 'N/A'} {isRTL ? 'ر.س' : 'SAR'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{daysLeft} {isRTL ? 'يوم متبقي' : 'days left'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-muted-foreground" />
                      <span>{challenge.success_rate || 85}% {isRTL ? 'نجاح' : 'success'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(challenge.status)}>
                      {challenge.status === 'active' ? (isRTL ? 'نشط' : 'Active') : 
                       challenge.status === 'draft' ? (isRTL ? 'مسودة' : 'Draft') : challenge.status}
                    </Badge>
                    <Badge className={getPriorityColor(challenge.priority_level)}>
                      {challenge.priority_level}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <InteractionButtons 
                      itemId={challenge.id}
                      itemType="challenge"
                      title={challenge.title_ar}
                      className="scale-90"
                    />
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(challenge)}>
                      <Eye className="w-4 h-4 mr-1" />
                      {isRTL ? 'التفاصيل' : 'Details'}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => onParticipate(challenge)}
                      disabled={challenge.status !== 'active'}
                    >
                      {isRTL ? 'شارك' : 'Participate'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{isRTL ? 'التقدم' : 'Progress'}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in overflow-hidden">
      {/* Challenge Image */}
      <div className="relative h-48 overflow-hidden">
        {challenge.image_url ? (
          <img 
            src={challenge.image_url} 
            alt={challenge.title_ar}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Target className="w-20 h-20 text-primary/40" />
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={getStatusColor(challenge.status)}>
            {challenge.status === 'active' ? (isRTL ? 'نشط' : 'Active') : 
             challenge.status === 'draft' ? (isRTL ? 'مسودة' : 'Draft') : challenge.status}
          </Badge>
          {challenge.trending && (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              {isRTL ? 'رائج' : 'Trending'}
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Star className="w-3 h-3 mr-1" />
              {isRTL ? 'جديد' : 'New'}
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <InteractionButtons 
            itemId={challenge.id}
            itemType="challenge"
            title={challenge.title_ar}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Urgency Indicator */}
        {isUrgent && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">
              <AlertCircle className="w-3 h-3 mr-1" />
              {daysLeft} {isRTL ? 'أيام متبقية' : 'days left'}
            </Badge>
          </div>
        )}

        {/* Prize Amount */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center min-w-[4rem]">
            <div className="text-xs font-medium text-muted-foreground">
              {isRTL ? 'الجائزة' : 'Prize'}
            </div>
            <div className="text-sm font-bold text-foreground">
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
            <CardTitle className="text-lg line-clamp-2 mb-2">
              {challenge.title_ar}
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {challenge.description_ar}
            </CardDescription>
          </div>
          <Badge className={getPriorityColor(challenge.priority_level)}>
            {challenge.priority_level}
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
        {challenge.experts && challenge.experts.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">{isRTL ? 'الخبراء:' : 'Experts:'}</span>
            <div className="flex -space-x-1">
              {challenge.experts.slice(0, 3).map((expert, index) => (
                <Avatar key={index} className="w-6 h-6 border-2 border-background">
                  <AvatarImage src={expert.avatar} />
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

        {/* Progress Bar */}
        <div className="mt-4">
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
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">{challenge.participants || 0}</div>
            <div className="text-xs text-muted-foreground">{isRTL ? 'مشارك' : 'participants'}</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">{challenge.submissions || 0}</div>
            <div className="text-xs text-muted-foreground">{isRTL ? 'مقترح' : 'submissions'}</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">{challenge.success_rate || 85}%</div>
            <div className="text-xs text-muted-foreground">{isRTL ? 'نجاح' : 'success'}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onViewDetails(challenge)} className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            {isRTL ? 'التفاصيل' : 'View Details'}
          </Button>
          <Button 
            onClick={() => onParticipate(challenge)}
            className="flex-1"
            disabled={challenge.status !== 'active'}
          >
            <Zap className="w-4 h-4 mr-2" />
            {challenge.status !== 'active' ? 
              (isRTL ? 'غير متاح' : 'Unavailable') :
              (isRTL ? 'شارك الآن' : 'Participate Now')
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};