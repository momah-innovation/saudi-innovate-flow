import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  Calendar,
  Trophy,
  Target,
  Send,
  Bookmark,
  Clock,
  Star,
  Share2
} from 'lucide-react';

interface EnhancedChallengeDetailDialogProps {
  challenge: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParticipate?: (challenge: any) => void;
  onSubmit?: (challenge: any) => void;
  onBookmark?: (challenge: any) => void;
}

export const EnhancedChallengeDetailDialog = ({
  challenge,
  open,
  onOpenChange,
  onParticipate,
  onSubmit,
  onBookmark
}: EnhancedChallengeDetailDialogProps) => {
  const { isRTL } = useDirection();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isParticipating, setIsParticipating] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (challenge && user) {
      checkParticipationStatus();
      checkBookmarkStatus();
    }
  }, [challenge, user]);

  const checkParticipationStatus = async () => {
    if (!user || !challenge) return;
    
    try {
      const { data } = await supabase
        .from('challenge_participants')
        .select('id')
        .eq('challenge_id', challenge.id)
        .eq('user_id', user.id)
        .single();
      
      setIsParticipating(!!data);
    } catch (error) {
      console.error('Error checking participation:', error);
    }
  };

  const checkBookmarkStatus = async () => {
    if (!user || !challenge) return;
    
    try {
      const { data } = await supabase
        .from('challenge_bookmarks')
        .select('id')
        .eq('challenge_id', challenge.id)
        .eq('user_id', user.id)
        .single();
      
      setIsBookmarked(!!data);
    } catch (error) {
      console.error('Error checking bookmark:', error);
    }
  };

  const getDaysRemaining = () => {
    if (!challenge.end_date) return null;
    const now = new Date();
    const endDate = new Date(challenge.end_date);
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getProgressPercentage = () => {
    if (!challenge.start_date || !challenge.end_date) return 0;
    const start = new Date(challenge.start_date);
    const end = new Date(challenge.end_date);
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.max(0, Math.min(100, (current / total) * 100));
  };

  if (!challenge) return null;

  const daysRemaining = getDaysRemaining();
  const progressPercentage = getProgressPercentage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header with Hero Image */}
        <div className="relative h-48 bg-gradient-to-r from-primary to-primary-glow overflow-hidden">
          {challenge.image_url && (
            <img 
              src={challenge.image_url} 
              alt={challenge.title_ar}
              className="w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500 text-white">
              {challenge.status}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onBookmark?.(challenge)}
              className={`backdrop-blur-sm ${
                isBookmarked 
                  ? 'bg-red-500/80 hover:bg-red-600/80 text-white' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Title and Key Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl font-bold mb-2">{challenge.title_ar}</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              {daysRemaining !== null && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{daysRemaining} {isRTL ? 'يوم متبقي' : 'days left'}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{challenge.participants || 0} {isRTL ? 'مشارك' : 'participants'}</span>
              </div>
              {challenge.estimated_budget && (
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>{challenge.estimated_budget.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {challenge.start_date && challenge.end_date && (
          <div className="px-6 pt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{isRTL ? 'تقدم التحدي' : 'Challenge Progress'}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-6 mt-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{isRTL ? 'وصف التحدي' : 'Challenge Description'}</h3>
              <p className="text-muted-foreground leading-relaxed">{challenge.description_ar}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              {!isParticipating ? (
                <Button
                  onClick={() => onParticipate?.(challenge)}
                  className="flex-1"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {isRTL ? 'انضم للتحدي' : 'Join Challenge'}
                </Button>
              ) : (
                <Button
                  onClick={() => onSubmit?.(challenge)}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isRTL ? 'قدم مشروعك' : 'Submit Project'}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => onBookmark?.(challenge)}
                className={isBookmarked ? 'border-red-500 text-red-500' : ''}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};