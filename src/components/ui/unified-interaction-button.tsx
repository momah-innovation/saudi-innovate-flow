import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useUnifiedInteractions } from '@/hooks/useUnifiedInteractions';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Users, 
  Eye, 
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

interface UnifiedInteractionButtonProps {
  entityId: string;
  entityType: 'opportunity' | 'challenge' | 'event' | 'idea' | 'campaign';
  actionType: 'like' | 'bookmark' | 'share' | 'view' | 'apply' | 'participate';
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showCount?: boolean;
  showText?: boolean;
  className?: string;
  customIcon?: React.ReactNode;
  customText?: string;
}

const iconMap = {
  like: Heart,
  bookmark: Bookmark,
  share: Share2,
  participate: Users,
  apply: Users,
  view: Eye,
  comment: MessageSquare,
  approve: ThumbsUp
};

const textMap = {
  like: { active: 'Liked', inactive: 'Like' },
  bookmark: { active: 'Bookmarked', inactive: 'Bookmark' },
  share: { active: 'Shared', inactive: 'Share' },
  participate: { active: 'Participating', inactive: 'Participate' },
  apply: { active: 'Applied', inactive: 'Apply' },
  view: { active: 'Viewed', inactive: 'View' },
  comment: { active: 'Commented', inactive: 'Comment' },
  approve: { active: 'Approved', inactive: 'Approve' }
};

export const UnifiedInteractionButton = ({
  entityId,
  entityType,
  actionType,
  variant = 'ghost',
  size = 'sm',
  showCount = true,
  showText = true,
  className,
  customIcon,
  customText
}: UnifiedInteractionButtonProps) => {
  const {
    isLoading,
    isActive,
    count,
    toggleInteraction,
    loadInteractionData
  } = useUnifiedInteractions({
    entityId,
    entityType,
    actionType,
    optimisticUpdate: true,
    trackAnalytics: true,
    showToast: true
  });

  useEffect(() => {
    loadInteractionData();
  }, [entityId]);

  const IconComponent = iconMap[actionType] || Heart;
  const text = customText || textMap[actionType]?.[isActive ? 'active' : 'inactive'] || actionType;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleInteraction}
      disabled={isLoading}
      className={cn(
        "gap-2 transition-all",
        isActive && actionType === 'like' && "text-red-500 hover:text-red-600",
        isActive && actionType === 'bookmark' && "text-blue-500 hover:text-blue-600",
        isActive && actionType === 'share' && "text-green-500 hover:text-green-600",
        className
      )}
    >
      {customIcon || (
        <IconComponent 
          className={cn(
            "w-4 h-4 transition-all",
            isActive && (actionType === 'like' || actionType === 'bookmark') && "fill-current"
          )} 
        />
      )}
      {showText && <span className="text-sm">{text}</span>}
      {showCount && <span className="text-sm">{count}</span>}
      {isLoading && (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
      )}
    </Button>
  );
};

// Specialized components for common use cases
export const LikeButton = (props: Omit<UnifiedInteractionButtonProps, 'actionType'>) => (
  <UnifiedInteractionButton {...props} actionType="like" />
);

export const BookmarkButton = (props: Omit<UnifiedInteractionButtonProps, 'actionType'>) => (
  <UnifiedInteractionButton {...props} actionType="bookmark" />
);

export const ShareButton = (props: Omit<UnifiedInteractionButtonProps, 'actionType'>) => (
  <UnifiedInteractionButton {...props} actionType="share" />
);

export const ParticipateButton = (props: Omit<UnifiedInteractionButtonProps, 'actionType'>) => (
  <UnifiedInteractionButton {...props} actionType="participate" />
);

export const ApplyButton = (props: Omit<UnifiedInteractionButtonProps, 'actionType'>) => (
  <UnifiedInteractionButton {...props} actionType="apply" />
);