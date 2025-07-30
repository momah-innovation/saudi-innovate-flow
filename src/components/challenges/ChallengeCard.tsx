import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, Target, Users, Award, Star, Eye, BookmarkIcon, TrendingUp } from 'lucide-react';
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
  trending?: boolean;
  featured?: boolean;
  experts?: Array<{ name: string; profile_image_url: string; }>;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onViewDetails: (challenge: Challenge) => void;
  onParticipate: (challenge: Challenge) => void;
  viewMode?: 'cards' | 'list' | 'grid';
}

export const ChallengeCard = ({ challenge, onViewDetails, onParticipate, viewMode = 'cards' }: ChallengeCardProps) => {
  const { isRTL } = useDirection();

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

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Challenge Image/Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <Target className="w-8 h-8 text-primary" />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                     <h3 className="text-lg font-semibold truncate">
                       {isRTL ? challenge.title_ar : challenge.title_en || challenge.title_ar}
                     </h3>
                    {challenge.trending && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {isRTL ? 'رائج' : 'Trending'}
                      </Badge>
                    )}
                  </div>
                   <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                     {isRTL ? challenge.description_ar : challenge.description_en || challenge.description_ar}
                   </p>
                  
                  {/* Quick Stats */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{challenge.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{challenge.submissions}</span>
                    </div>
                     <div className="flex items-center gap-1">
                       <CalendarIcon className="w-4 h-4" />
                       <span>{challenge.end_date || 'N/A'}</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <Award className="w-4 h-4" />
                       <span>{challenge.estimated_budget ? `${challenge.estimated_budget} ريال` : 'N/A'}</span>
                     </div>
                  </div>
                </div>
                
                {/* Status and Actions */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getStatusColor(challenge.status)}>
                      {getStatusText(challenge.status)}
                    </Badge>
                     <Badge className={getDifficultyColor(challenge.priority_level || 'متوسط')}>
                       {challenge.priority_level || 'متوسط'}
                     </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(challenge)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <BookmarkIcon className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => onParticipate(challenge)}>
                      {isRTL ? 'المشاركة' : 'Participate'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in group">
      {/* Challenge Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg">
        {challenge.image_url ? (
          <img src={challenge.image_url} alt={challenge.title_ar} className="w-full h-full object-cover rounded-t-lg" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Target className="w-16 h-16 text-primary" />
          </div>
        )}
        
        {/* Status Badge - Overlay */}
        <div className="absolute top-3 right-3 flex gap-2">
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

        {/* Bookmark Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 left-3 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <BookmarkIcon className="w-4 h-4" />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
             <CardTitle className="text-lg mb-2 line-clamp-2">
               {isRTL ? challenge.title_ar : challenge.title_en || challenge.title_ar}
             </CardTitle>
             <CardDescription className="text-sm line-clamp-3">
               {isRTL ? challenge.description_ar : challenge.description_en || challenge.description_ar}
             </CardDescription>
           </div>
           <Badge className={getDifficultyColor(challenge.priority_level || 'متوسط')}>
             {challenge.priority_level || 'متوسط'}
           </Badge>
        </div>

        {/* Expert Avatars */}
        {challenge.experts && challenge.experts.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">{isRTL ? 'الخبراء:' : 'Experts:'}</span>
            <div className="flex -space-x-2">
              {challenge.experts.slice(0, 3).map((expert, index) => (
                <Avatar key={index} className="w-6 h-6 border-2 border-background">
                  <AvatarImage src={expert.profile_image_url} alt={expert.name} />
                  <AvatarFallback className="text-xs">{expert.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {challenge.experts.length > 3 && (
                <div className="w-6 h-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                  <span className="text-xs">+{challenge.experts.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
           <div className="flex items-center gap-2">
             <CalendarIcon className="h-4 w-4" />
             <span className="truncate">{challenge.end_date || 'N/A'}</span>
           </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{challenge.participants} {isRTL ? 'مشارك' : 'participants'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>{challenge.submissions} {isRTL ? 'مساهمة' : 'submissions'}</span>
          </div>
           <div className="flex items-center gap-2">
             <Award className="h-4 w-4" />
             <span className="truncate">{challenge.estimated_budget ? `${challenge.estimated_budget} ريال` : 'N/A'}</span>
           </div>
        </div>

        <div className="flex justify-between items-center">
           <Badge variant="outline" className="truncate">
             {challenge.challenge_type || 'تحدي'}
           </Badge>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(challenge)}>
              <Eye className="h-4 w-4 mr-2" />
              {isRTL ? 'التفاصيل' : 'Details'}
            </Button>
            <Button size="sm" onClick={() => onParticipate(challenge)}>
              {isRTL ? 'المشاركة' : 'Participate'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};