import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

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

  useEffect(() => {
    checkBookmarkStatus();
  }, [opportunityId]);

  const checkBookmarkStatus = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('opportunity_bookmarks')
        .select('id')
        .eq('opportunity_id', opportunityId)
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking bookmark status:', error);
        return;
      }

      setIsBookmarked(!!data);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const toggleBookmark = async () => {
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
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
          .eq('user_id', user.user.id);

        if (error) throw error;

        setIsBookmarked(false);
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
            user_id: user.user.id
          });

        if (error) throw error;

        setIsBookmarked(true);
        toast({
          title: isRTL ? 'تم حفظ الإشارة المرجعية' : 'Bookmarked',
          description: isRTL ? 'تم حفظ الفرصة في الإشارات المرجعية' : 'Opportunity saved to bookmarks',
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
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
        <span className="ml-2">
          {isBookmarked 
            ? (isRTL ? 'محفوظ' : 'Saved')
            : (isRTL ? 'حفظ' : 'Save')
          }
        </span>
      )}
    </Button>
  );
};