import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface BookmarkOpportunityButtonProps {
  opportunityId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export const BookmarkOpportunityButton = ({
  opportunityId,
  variant = 'outline',
  size = 'default',
  showText = true
}: BookmarkOpportunityButtonProps) => {
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useCurrentUser();

  useEffect(() => {
    checkBookmarkStatus();
  }, [opportunityId]);

  const checkBookmarkStatus = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('opportunity_bookmarks')
        .select('id')
        .eq('opportunity_id', opportunityId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        // Error handling - bookmark status check failed
        return;
      }

      setIsBookmarked(!!data);
    } catch (error) {
      // Error handling - bookmark status check failed
    }
  };

  const toggleBookmark = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast({
          title: t('opportunities:messages.error'),
          description: t('opportunities:messages.sign_in_to_bookmark'),
          variant: 'destructive',
        });
        return;
      }

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('opportunity_bookmarks')
          .delete()
          .eq('opportunity_id', opportunityId)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setIsBookmarked(false);
        
        // Track analytics
        await supabase.functions.invoke('track-opportunity-analytics', {
          body: {
            opportunityId,
            action: 'unbookmark',
            userId: user.id,
            sessionId: sessionStorage.getItem('opportunity-session'),
            metadata: { timestamp: new Date().toISOString() }
          }
        });

        toast({
          title: t('opportunities:messages.bookmark_removed'),
          description: t('opportunities:messages.bookmark_removed_desc'),
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('opportunity_bookmarks')
          .insert({
            opportunity_id: opportunityId,
            user_id: user.id
          });

        if (error) {
          throw error;
        }

        setIsBookmarked(true);
        
        // Track analytics
        await supabase.functions.invoke('track-opportunity-analytics', {
          body: {
            opportunityId,
            action: 'bookmark',
            userId: user.id,
            sessionId: sessionStorage.getItem('opportunity-session'),
            metadata: { timestamp: new Date().toISOString() }
          }
        });

        toast({
          title: t('opportunities:messages.bookmarked'),
          description: t('opportunities:messages.bookmarked_desc'),
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('opportunities:messages.error'),
        description: t('opportunities:messages.bookmark_failed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleBookmark}
      disabled={isLoading}
      className={isBookmarked ? 'text-primary' : ''}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {showText && (
        <span className={isRTL ? "mr-2" : "ml-2"}>
          {isBookmarked 
            ? t('opportunities:bookmark.saved')
            : t('opportunities:bookmark.save')
          }
        </span>
      )}
    </Button>
  );
};
