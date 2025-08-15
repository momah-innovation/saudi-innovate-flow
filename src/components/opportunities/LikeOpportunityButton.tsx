import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Heart } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';

interface LikeOpportunityButtonProps {
  opportunityId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showCount?: boolean;
  className?: string;
}

export const LikeOpportunityButton = ({
  opportunityId,
  variant = 'ghost',
  size = 'sm',
  showCount = true,
  className
}: LikeOpportunityButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkLikeStatus();
    }
    loadLikeCount();
  }, [opportunityId, user]);

  const checkLikeStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('opportunity_likes')
        .select('id')
        .eq('opportunity_id', opportunityId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setIsLiked(!!data);
    } catch (error) {
      // Error handling - like status check failed
    }
  };

  const loadLikeCount = async () => {
    // Use opportunity stats hook for like count
    // This will be handled by useOpportunityStats hook
    setLikeCount(0); // Initial value, will be updated by parent component
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like opportunities",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('opportunity_likes')
          .delete()
          .eq('opportunity_id', opportunityId)
          .eq('user_id', user.id);

        if (error) throw error;

        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
        
        // Track analytics
        await supabase.functions.invoke('track-opportunity-analytics', {
          body: {
            opportunityId,
            action: 'unlike',
            userId: user.id,
            sessionId: sessionStorage.getItem('opportunity-session'),
            metadata: { timestamp: new Date().toISOString() }
          }
        });

        toast({
          title: "Removed from favorites",
          description: "Opportunity unliked successfully"
        });
      } else {
        // Like
        const { error } = await supabase
          .from('opportunity_likes')
          .insert({
            opportunity_id: opportunityId,
            user_id: user.id
          });

        if (error) throw error;

        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        
        // Track analytics
        await supabase.functions.invoke('track-opportunity-analytics', {
          body: {
            opportunityId,
            action: 'like',
            userId: user.id,
            sessionId: sessionStorage.getItem('opportunity-session'),
            metadata: { timestamp: new Date().toISOString() }
          }
        });

        toast({
          title: "Added to favorites",
          description: "Opportunity liked successfully"
        });
      }

      // Refresh opportunity analytics
      await supabase.rpc('refresh_opportunity_analytics', {
        p_opportunity_id: opportunityId
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('common.status.error'),
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLike}
      disabled={loading}
      className={cn(
        "gap-2 transition-colors",
        isLiked && "text-red-500 hover:text-red-600",
        className
      )}
    >
      <Heart 
        className={cn(
          "w-4 h-4 transition-all",
          isLiked && "fill-current"
        )} 
      />
      {showCount && <span className="text-sm">{likeCount}</span>}
    </Button>
  );
};