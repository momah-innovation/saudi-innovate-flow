import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

interface InteractionButtonsProps {
  itemId: string;
  itemType: 'challenge' | 'event' | 'idea';
  title: string;
  onComment?: () => void;
  className?: string;
}

export const InteractionButtons = ({ 
  itemId, 
  itemType, 
  title, 
  onComment, 
  className = "" 
}: InteractionButtonsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Check if user has liked/bookmarked this item
  useEffect(() => {
    if (!user) return;
    
    const checkInteractions = async () => {
      try {
        if (itemType === 'idea') {
          // Check idea likes - use existing table for now
          const { data: likesData } = await supabase
            .from('idea_likes')
            .select('*')
            .eq('idea_id', itemId);

          setLikesCount(likesData?.length || 0);
          setLiked(likesData?.some((like: any) => like.user_id === user.id) || false);

          // Check idea comments count
          const { data: commentsData } = await supabase
            .from('idea_comments')
            .select('id')
            .eq('idea_id', itemId);

          setCommentsCount(commentsData?.length || 0);

        } else {
          // For challenges/events, get placeholder likes count and check bookmarks
          setLikesCount(Math.floor(Math.random() * 50) + 5);
          
          const tableName = itemType === 'challenge' ? 'challenge_bookmarks' : 'event_bookmarks';
          
          const { data: bookmark } = await supabase
            .from(tableName as any)
            .select('id')
            .eq(`${itemType}_id`, itemId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          setBookmarked(!!bookmark);
        }
        
        } catch (error) {
        logger.error('Error checking interactions', { component: 'InteractionButtons', action: 'checkInteractions', itemId, itemType }, error as Error);
      }
    };

    checkInteractions();
  }, [user, itemId, itemType]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: t('common:auth.sign_in_required'),
        description: t('common:auth.sign_in_to_like'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (itemType === 'idea') {
        if (liked) {
          // Remove like
          const { error } = await supabase
            .from('idea_likes')
            .delete()
            .eq('idea_id', itemId)
            .eq('user_id', user.id);

          if (error) throw error;
          
          setLiked(false);
          setLikesCount(prev => prev - 1);
        } else {
          // Add like
          const { error } = await supabase
            .from('idea_likes')
            .insert({
              idea_id: itemId,
              user_id: user.id
            });

          if (error) throw error;
          
          setLiked(true);
          setLikesCount(prev => prev + 1);
        }
      } else {
        // For challenges/events, use placeholder logic for now
        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);
      }
      
      toast({
        title: liked ? t('common:interactions.unliked') : t('common:interactions.liked'),
        description: `${title}`,
      });
    } catch (error) {
      logger.error('Error liking', { component: 'InteractionButtons', action: 'handleLike', itemId, itemType }, error as Error);
      toast({
        title: t('common:error'),
        description: t('common:interactions.action_failed'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: t('common:auth.sign_in_required'),
        description: t('common:auth.sign_in_to_bookmark'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const tableName = itemType === 'challenge' ? 'challenge_bookmarks' : 'event_bookmarks';
      const columnName = `${itemType}_id`;

      if (bookmarked) {
        // Remove bookmark
        await supabase
          .from(tableName as any)
          .delete()
          .eq(columnName, itemId)
          .eq('user_id', user.id);
        
        setBookmarked(false);
        toast({
          title: t('common:interactions.bookmark_removed'),
          description: `${title}`,
        });
      } else {
        // Add bookmark
        const insertData = itemType === 'challenge' 
          ? { challenge_id: itemId, user_id: user.id }
          : { event_id: itemId, user_id: user.id };
          
        const { error } = await supabase
          .from(tableName as any)
          .insert(insertData);
          
        if (error) throw error;
        
        setBookmarked(true);
        toast({
          title: t('common:interactions.bookmarked'),
          description: `${title}`,
        });
      }
    } catch (error) {
      logger.error('Error bookmarking', { component: 'InteractionButtons', action: 'handleBookmark', itemId, itemType }, error as Error);
      toast({
        title: t('common:error'),
        description: t('common:interactions.bookmark_failed'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    // Use proper URL building for interaction sharing
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/${itemType}s/${itemId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        toast({
          title: t('common:interactions.copied_to_clipboard'),
          description: url,
        });
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: t('common:interactions.copied_to_clipboard'),
        description: url,
      });
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Like Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-1 ${liked ? 'text-destructive hover:text-destructive/80' : 'text-muted-foreground hover:text-destructive'}`}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        {likesCount > 0 && <span className="text-xs">{likesCount}</span>}
      </Button>

      {/* Bookmark Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        disabled={loading}
        className={`flex items-center gap-1 ${bookmarked ? 'text-info hover:text-info-hover' : 'text-muted-foreground hover:text-info'}`}
      >
        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
      </Button>

      {/* Comment Button */}
      {(onComment || itemType === 'idea') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onComment}
          className="flex items-center gap-1 text-muted-foreground hover:text-primary"
        >
          <MessageCircle className="w-4 h-4" />
          {commentsCount > 0 && <span className="text-xs">{commentsCount}</span>}
        </Button>
      )}

      {/* Share Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-1 text-muted-foreground hover:text-success"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
