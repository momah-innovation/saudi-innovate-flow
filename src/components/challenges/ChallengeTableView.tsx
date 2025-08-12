import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Eye,
  Heart,
  Share2,
  Users,
  Calendar,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/components/ui/direction-provider';
import { Challenge } from '@/hooks/useChallengesData';
import { formatDistanceToNow } from 'date-fns';

interface ChallengeTableViewProps {
  challenges: Challenge[];
  onViewDetails: (challenge: Challenge) => void;
  onParticipate: (challenge: Challenge) => void;
  onLike: (challenge: Challenge) => void;
  onShare: (challenge: Challenge) => void;
  likedChallenges: Set<string>;
  className?: string;
}

export const ChallengeTableView: React.FC<ChallengeTableViewProps> = ({
  challenges,
  onViewDetails,
  onParticipate,
  onLike,
  onShare,
  likedChallenges,
  className
}) => {
  const { isRTL } = useDirection();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'planning':
        return 'secondary';
      case 'closed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { ar: string; en: string }> = {
      'active': { ar: 'نشط', en: 'Active' },
      'planning': { ar: 'قيد التخطيط', en: 'Planning' },
      'closed': { ar: 'مغلق', en: 'Closed' },
      'draft': { ar: 'مسودة', en: 'Draft' }
    };
    return statusMap[status]?.[isRTL ? 'ar' : 'en'] || status;
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'سهل':
      case 'easy':
        return 'secondary';
      case 'متوسط':
      case 'medium':
        return 'default';
      case 'صعب':
      case 'hard':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isRTL) {
        return date.toLocaleDateString('ar-SA');
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'غير محدد';
    }
  };

  const formatBudget = (budget: number) => {
    if (budget >= 1000000) {
      return `${(budget / 1000000).toFixed(1)}M ريال`;
    } else if (budget >= 1000) {
      return `${(budget / 1000).toFixed(0)}K ريال`;
    } else {
      return `${budget} ريال`;
    }
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
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={cn("w-[300px]", isRTL && "text-right")}>
                  {isRTL ? 'التحدي' : 'Challenge'}
                </TableHead>
                <TableHead className={cn(isRTL && "text-right")}>
                  {isRTL ? 'الحالة' : 'Status'}
                </TableHead>
                <TableHead className={cn(isRTL && "text-right")}>
                  {isRTL ? 'الصعوبة' : 'Difficulty'}
                </TableHead>
                <TableHead className={cn(isRTL && "text-right")}>
                  <Users className="w-4 h-4 inline-block mr-1" />
                  {isRTL ? 'المشاركون' : 'Participants'}
                </TableHead>
                <TableHead className={cn(isRTL && "text-right")}>
                  <Trophy className="w-4 h-4 inline-block mr-1" />
                  {isRTL ? 'الجائزة' : 'Prize'}
                </TableHead>
                <TableHead className={cn(isRTL && "text-right")}>
                  <Calendar className="w-4 h-4 inline-block mr-1" />
                  {isRTL ? 'الموعد النهائي' : 'Deadline'}
                </TableHead>
                <TableHead className={cn("text-center", isRTL && "text-right")}>
                  {isRTL ? 'الإجراءات' : 'Actions'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((challenge) => (
                <TableRow key={challenge.id} className="hover:bg-muted/50">
                  <TableCell className="py-4">
                    <div className="flex items-start gap-3">
                      {challenge.image_url && (
                        <Avatar className="w-12 h-12 rounded-lg">
                          <AvatarImage 
                            src={challenge.image_url} 
                            alt={challenge.title_ar}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-lg">
                            {challenge.title_ar.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {challenge.title_ar}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {challenge.description_ar}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {challenge.category}
                          </Badge>
                          {challenge.trending && (
                            <Badge variant="secondary" className="text-xs">
                              {isRTL ? 'رائج' : 'Trending'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(challenge.status)}>
                      {getStatusLabel(challenge.status)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={getDifficultyBadgeVariant(challenge.difficulty)}>
                      {challenge.difficulty || 'متوسط'}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {challenge.participants}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {challenge.estimated_budget 
                          ? formatBudget(challenge.estimated_budget)
                          : 'غير محدد'
                        }
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {challenge.end_date ? formatDate(challenge.end_date) : 'غير محدد'}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(challenge)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLike(challenge)}
                        className={cn(
                          "h-8 w-8 p-0",
                          likedChallenges.has(challenge.id) && "text-red-500"
                        )}
                      >
                        <Heart 
                          className={cn(
                            "w-4 h-4",
                            likedChallenges.has(challenge.id) && "fill-current"
                          )} 
                        />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onShare(challenge)}
                        className="h-8 w-8 p-0"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};