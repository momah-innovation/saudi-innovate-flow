import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDirection } from '@/components/ui/direction-provider';

interface InteractionButtonsProps {
  itemId: string;
  itemType: 'challenge' | 'event';
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
  
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Check if user has liked/bookmarked this item
  useEffect(() => {
    if (!user) return;
    
    const checkInteractions = async () => {
      try {
        // Check likes (we'll need to create a likes table)
        const tableName = itemType === 'challenge' ? 'challenge_bookmarks' : 'event_bookmarks';
        
        const { data: bookmark } = await supabase
          .from(tableName as any)
          .select('id')
          .eq(`${itemType}_id`, itemId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        setBookmarked(!!bookmark);
        
        // Get total likes count (placeholder for now)
        setLikesCount(Math.floor(Math.random() * 50) + 5);
        
      } catch (error) {
        console.error('Error checking interactions:', error);
      }
    };

    checkInteractions();
  }, [user, itemId, itemType]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in',
        description: isRTL ? 'يجب تسجيل الدخول للإعجاب' : 'You need to sign in to like',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Toggle like (we'll implement this when we have a likes table)
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
      
      toast({
        title: liked ? (isRTL ? 'تم إلغاء الإعجاب' : 'Unliked') : (isRTL ? 'أعجبني' : 'Liked'),
        description: `${title}`,
      });
    } catch (error) {
      console.error('Error liking:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في العملية' : 'Failed to process action',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in',
        description: isRTL ? 'يجب تسجيل الدخول للحفظ' : 'You need to sign in to bookmark',
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
          title: isRTL ? 'تم إلغاء الحفظ' : 'Bookmark removed',
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
          title: isRTL ? 'تم الحفظ' : 'Bookmarked',
          description: `${title}`,
        });
      }
    } catch (error) {
      console.error('Error bookmarking:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في الحفظ' : 'Failed to bookmark',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${itemType}s/${itemId}`;
    
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
          title: isRTL ? 'تم النسخ' : 'Copied to clipboard',
          description: url,
        });
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: isRTL ? 'تم النسخ' : 'Copied to clipboard',
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
        className={`flex items-center gap-1 ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
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
        className={`flex items-center gap-1 ${bookmarked ? 'text-blue-500 hover:text-blue-600' : 'text-muted-foreground hover:text-blue-500'}`}
      >
        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
      </Button>

      {/* Comment Button */}
      {onComment && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onComment}
          className="flex items-center gap-1 text-muted-foreground hover:text-primary"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      )}

      {/* Share Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-1 text-muted-foreground hover:text-green-500"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};