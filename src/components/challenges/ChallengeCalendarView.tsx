import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  Users,
  Trophy,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/components/ui/direction-provider';
import { Challenge } from '@/hooks/useChallengesData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ChallengeCalendarViewProps {
  challenges: Challenge[];
  onViewDetails: (challenge: Challenge) => void;
  onParticipate: (challenge: Challenge) => void;
  onLike: (challenge: Challenge) => void;
  onShare: (challenge: Challenge) => void;
  likedChallenges: Set<string>;
  className?: string;
}

export const ChallengeCalendarView: React.FC<ChallengeCalendarViewProps> = ({
  challenges,
  onViewDetails,
  onParticipate,
  onLike,
  onShare,
  likedChallenges,
  className
}) => {
  const { isRTL } = useDirection();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getChallengesForDate = (date: Date) => {
    return challenges.filter(challenge => {
      const startDate = challenge.start_date ? new Date(challenge.start_date) : null;
      const endDate = challenge.end_date ? new Date(challenge.end_date) : null;
      
      if (startDate && isSameDay(startDate, date)) return true;
      if (endDate && isSameDay(endDate, date)) return true;
      if (startDate && endDate && date >= startDate && date <= endDate) return true;
      
      return false;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'planning':
        return 'bg-blue-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'سهل':
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'متوسط':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'صعب':
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' 
        ? subMonths(prev, 1) 
        : addMonths(prev, 1)
    );
  };

  const formatMonthYear = (date: Date) => {
    if (isRTL) {
      return format(date, 'MMMM yyyy', { locale: ar });
    }
    return format(date, 'MMMM yyyy');
  };

  const getDayName = (dayIndex: number) => {
    const days = isRTL 
      ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  if (challenges.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isRTL ? 'لا توجد تحديات' : 'No Challenges Found'}
          </h3>
          <p className="text-muted-foreground text-center">
            {isRTL 
              ? 'لم يتم العثور على تحديات تطابق المعايير المحددة'
              : 'No challenges match the selected criteria'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {isRTL ? 'التقويم' : 'Calendar View'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[140px] text-center">
              {formatMonthYear(currentDate)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {getDayName(i)}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day, index) => {
            const dayChallenges = getChallengesForDate(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] p-2 border rounded-lg",
                  isCurrentMonth ? "bg-background" : "bg-muted/30",
                  isToday && "ring-2 ring-primary",
                  "hover:bg-muted/50 transition-colors"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      !isCurrentMonth && "text-muted-foreground",
                      isToday && "text-primary font-bold"
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayChallenges.length > 0 && (
                    <Badge variant="secondary" className="text-xs h-5">
                      {dayChallenges.length}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  {dayChallenges.slice(0, 2).map((challenge) => (
                    <div
                      key={challenge.id}
                      className="p-1 rounded border bg-card cursor-pointer hover:bg-accent transition-colors group"
                      onClick={() => onViewDetails(challenge)}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <div className={cn("w-2 h-2 rounded-full", getStatusColor(challenge.status))} />
                        <span className="text-xs font-medium line-clamp-1">
                          {challenge.title_ar}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={cn("text-xs h-4", getDifficultyColor(challenge.difficulty))}
                        >
                          {challenge.difficulty || 'متوسط'}
                        </Badge>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLike(challenge);
                            }}
                            className={cn(
                              "h-5 w-5 p-0",
                              likedChallenges.has(challenge.id) && "text-red-500"
                            )}
                          >
                            <Heart 
                              className={cn(
                                "w-3 h-3",
                                likedChallenges.has(challenge.id) && "fill-current"
                              )} 
                            />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onShare(challenge);
                            }}
                            className="h-5 w-5 p-0"
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{challenge.participants}</span>
                        </div>
                        {challenge.estimated_budget && (
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            <span>
                              {challenge.estimated_budget >= 1000000
                                ? `${(challenge.estimated_budget / 1000000).toFixed(1)}M`
                                : `${(challenge.estimated_budget / 1000).toFixed(0)}K`
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {dayChallenges.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{dayChallenges.length - 2} {isRTL ? 'تحديات أخرى' : 'more'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">
              {isRTL ? 'نشط' : 'Active'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">
              {isRTL ? 'قيد التخطيط' : 'Planning'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-sm text-muted-foreground">
              {isRTL ? 'مغلق' : 'Closed'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};