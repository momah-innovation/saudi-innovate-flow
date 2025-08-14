import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
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
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'يجب تسجيل الدخول أولاً' : 'Please log in to bookmark opportunities',
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
          title: isRTL ? 'تم إلغاء الإشارة المرجعية' : 'Bookmark Removed',
          description: isRTL ? 'تم إزالة الفرصة من الإشارات المرجعية' : 'Opportunity removed from bookmarks',
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
          title: isRTL ? 'تم حفظ الإشارة المرجعية' : 'Bookmarked',
          description: isRTL ? 'تم حفظ الفرصة في الإشارات المرجعية' : 'Opportunity saved to bookmarks',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث الإشارة المرجعية' : 'Failed to update bookmark',
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
            ? (isRTL ? 'محفوظ' : 'Saved')
            : (isRTL ? 'حفظ' : 'Save')
          }
        </span>
      )}
    </Button>
  );
};