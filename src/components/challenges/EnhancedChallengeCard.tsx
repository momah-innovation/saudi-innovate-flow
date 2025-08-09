import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Users, 
  Target, 
  Award, 
  Eye, 
  Heart, 
  Share2, 
  Clock,
  MapPin,
  Building,
  User,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: 'draft' | 'active' | 'planning' | 'completed' | 'paused';
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  actual_budget?: number;
  sector_name?: string;
  sector_name_ar?: string;
  department_name?: string;
  department_name_ar?: string;
  participant_count?: number;
  submission_count?: number;
  like_count?: number;
  view_count?: number;
  tag_names?: string[];
  tag_names_ar?: string[];
  tag_colors?: string[];
  image_url?: string;
  challenge_owner?: {
    name: string;
    profile_image_url?: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface EnhancedChallengeCardProps {
  challenge: Challenge;
  onViewDetails: (challengeId: string) => void;
  onParticipate?: (challengeId: string) => void;
  onLike?: (challengeId: string) => void;
  onShare?: (challengeId: string) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  showStats?: boolean;
  showOwner?: boolean;
  isLiked?: boolean;
}

export function EnhancedChallengeCard({
  challenge,
  onViewDetails,
  onParticipate,
  onLike,
  onShare,
  className,
  variant = 'default',
  showActions = true,
  showStats = true,
  showOwner = true,
  isLiked = false
}: EnhancedChallengeCardProps) {
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const { user, hasRole } = useAuth();

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active': return 'نشط';
      case 'planning': return 'قيد التخطيط';
      case 'completed': return 'مكتمل';
      case 'paused': return 'متوقف';
      case 'draft': return 'مسودة';
      default: return status;
    }
  };

  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'مرتفع';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  const calculateDaysLeft = (): number | null => {
    if (!challenge.end_date) return null;
    const today = new Date();
    const endDate = new Date(challenge.end_date);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatBudget = (amount?: number): string => {
    if (!amount) return '';
    return `${amount.toLocaleString('ar-SA')} ريال`;
  };

  const daysLeft = calculateDaysLeft();
  const canParticipate = challenge.status === 'active' && user && daysLeft && daysLeft > 0;

  const cardClasses = cn(
    'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5',
    'border border-border/50 hover:border-primary/20',
    'bg-card hover:bg-accent/5',
    variant === 'featured' && 'ring-2 ring-primary/20',
    variant === 'compact' && 'max-w-sm',
    className
  );

  return (
    <Card className={cardClasses}>
      {/* Image Section */}
      {challenge.image_url && variant !== 'compact' && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={challenge.image_url}
            alt={challenge.title_ar}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status & Priority Badges */}
          <div className={cn(
            "absolute top-3 flex gap-2",
            isRTL ? "right-3" : "left-3"
          )}>
            <Badge 
              variant="secondary" 
              className={cn(getStatusColor(challenge.status), "text-white border-0")}
            >
              {getStatusText(challenge.status)}
            </Badge>
            
            {challenge.priority_level && challenge.priority_level !== 'medium' && (
              <Badge 
                variant="outline" 
                className={cn(getPriorityColor(challenge.priority_level), "text-white border-white/20")}
              >
                {getPriorityText(challenge.priority_level)}
              </Badge>
            )}
          </div>

          {/* Days Left Indicator */}
          {daysLeft !== null && (
            <div className={cn(
              "absolute top-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full",
              isRTL ? "left-3" : "right-3"
            )}>
              <div className="flex items-center gap-1 text-white text-sm">
                <Clock className="w-3 h-3" />
                <span>{daysLeft > 0 ? `${daysLeft} أيام متبقية` : 'انتهى'}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        {/* Owner Info */}
        {showOwner && challenge.challenge_owner && (
          <div className={cn(
            "flex items-center gap-2 mb-3 text-sm text-muted-foreground",
            isRTL && "flex-row-reverse"
          )}>
            <Avatar className="w-6 h-6">
              <AvatarImage src={challenge.challenge_owner.profile_image_url} />
              <AvatarFallback className="text-xs">
                {challenge.challenge_owner.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span>{challenge.challenge_owner.name}</span>
          </div>
        )}

        {/* Title & Status (for compact/non-image cards) */}
        <div className={cn(
          "flex items-start justify-between gap-2 mb-2",
          isRTL && "flex-row-reverse"
        )}>
          <CardTitle 
            className={cn(
              "text-lg leading-tight flex-1 cursor-pointer hover:text-primary transition-colors",
              variant === 'compact' ? 'line-clamp-2' : 'line-clamp-3'
            )}
            onClick={() => onViewDetails(challenge.id)}
          >
            {challenge.title_ar}
          </CardTitle>
          
          {(!challenge.image_url || variant === 'compact') && (
            <div className="flex flex-col gap-1">
              <Badge 
                variant="secondary" 
                className={cn(getStatusColor(challenge.status), "text-white text-xs")}
              >
                {getStatusText(challenge.status)}
              </Badge>
            </div>
          )}
        </div>

        {/* Description */}
        <p className={cn(
          "text-sm text-muted-foreground leading-relaxed",
          variant === 'compact' ? 'line-clamp-2' : 'line-clamp-3'
        )}>
          {challenge.description_ar}
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Tags */}
        {challenge.tag_names_ar && challenge.tag_names_ar.length > 0 && (
          <div className={cn("flex flex-wrap gap-1", isRTL && "flex-row-reverse")}>
            {challenge.tag_names_ar.slice(0, variant === 'compact' ? 2 : 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                style={{ 
                  borderColor: challenge.tag_colors?.[index] || 'hsl(var(--primary))',
                  color: challenge.tag_colors?.[index] || 'hsl(var(--primary))'
                }}
                className="text-xs px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
            {challenge.tag_names_ar.length > (variant === 'compact' ? 2 : 3) && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{challenge.tag_names_ar.length - (variant === 'compact' ? 2 : 3)}
              </Badge>
            )}
          </div>
        )}

        {/* Location & Department Info */}
        {(challenge.sector_name_ar || challenge.department_name_ar) && (
          <div className="space-y-2">
            {challenge.sector_name_ar && (
              <div className={cn(
                "flex items-center gap-2 text-xs text-muted-foreground",
                isRTL && "flex-row-reverse"
              )}>
                <Building className="w-3 h-3" />
                <span>{challenge.sector_name_ar}</span>
              </div>
            )}
            {challenge.department_name_ar && (
              <div className={cn(
                "flex items-center gap-2 text-xs text-muted-foreground",
                isRTL && "flex-row-reverse"
              )}>
                <MapPin className="w-3 h-3" />
                <span>{challenge.department_name_ar}</span>
              </div>
            )}
          </div>
        )}

        {/* Stats Row */}
        {showStats && (
          <div className={cn(
            "flex items-center gap-4 text-sm text-muted-foreground",
            isRTL && "flex-row-reverse"
          )}>
            <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
              <Users className="w-4 h-4" />
              <span>{challenge.participant_count || 0}</span>
            </div>
            <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
              <Target className="w-4 h-4" />
              <span>{challenge.submission_count || 0}</span>
            </div>
            {showStats && challenge.view_count && (
              <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                <Eye className="w-4 h-4" />
                <span>{challenge.view_count}</span>
              </div>
            )}
            {challenge.end_date && (
              <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(challenge.end_date), 'MMM dd', { locale: ar })}</span>
              </div>
            )}
          </div>
        )}

        {/* Budget */}
        {challenge.estimated_budget && (
          <div className={cn(
            "flex items-center gap-2 p-2 bg-primary/5 rounded-md",
            isRTL && "flex-row-reverse"
          )}>
            <Award className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary text-sm">
              {formatBudget(challenge.estimated_budget)}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-2">
            {/* Primary Actions */}
            <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onViewDetails(challenge.id)}
              >
                <Eye className="w-4 h-4 mx-1" />
                عرض التفاصيل
                <ChevronRight className={cn("w-3 h-3 mx-1", isRTL && "rotate-180")} />
              </Button>
              
              {canParticipate && onParticipate && (
                <Button 
                  size="sm" 
                  onClick={() => onParticipate(challenge.id)}
                  className="flex-1"
                >
                  <Target className="w-4 h-4 mx-1" />
                  شارك الآن
                </Button>
              )}
            </div>

            {/* Secondary Actions */}
            {(onLike || onShare) && (
              <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                {onLike && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onLike(challenge.id)}
                    className={cn(
                      "flex-1 transition-colors",
                      isLiked && "text-red-500 hover:text-red-600"
                    )}
                  >
                    <Heart className={cn("w-4 h-4 mx-1", isLiked && "fill-current")} />
                    {challenge.like_count || 0}
                  </Button>
                )}
                
                {onShare && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onShare(challenge.id)}
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mx-1" />
                    مشاركة
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EnhancedChallengeCard;