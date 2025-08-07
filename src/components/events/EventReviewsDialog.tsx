import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { 
  Star, 
  MessageCircle,
  ThumbsUp,
  User,
  Send,
  Calendar
} from 'lucide-react';

interface EventReview {
  id: string;
  rating: number;
  review_text: string;
  helpful_count: number;
  created_at: string;
  user_id: string;
  // We'll fetch user profile separately
  user_profile?: {
    display_name?: string;
    avatar_url?: string;
  };
}

interface Event {
  id: string;
  title_ar: string;
  event_date: string;
  status: string;
}

interface EventReviewsDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventReviewsDialog = ({ 
  event, 
  open, 
  onOpenChange 
}: EventReviewsDialogProps) => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<EventReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [userReview, setUserReview] = useState<EventReview | null>(null);

  useEffect(() => {
    if (open && event) {
      loadReviews();
    }
  }, [open, event]);

  const loadReviews = async () => {
    if (!event) return;

    try {
      setLoading(true);

      const { data: reviewsData, error } = await supabase
        .from('event_reviews')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(reviewsData || []);

      // Check if current user has already reviewed
      if (user) {
        const currentUserReview = reviewsData?.find(review => review.user_id === user.id);
        setUserReview(currentUserReview || null);
        if (currentUserReview) {
          setNewRating(currentUserReview.rating);
          setNewReview(currentUserReview.review_text || '');
        }
      }

    } catch (error) {
      logger.error('Error loading reviews', { 
        component: 'EventReviewsDialog', 
        action: 'loadReviews',
        data: { eventId: event.id }
      }, error as Error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحميل التقييمات' : 'Failed to load reviews',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !event || newRating === 0) return;

    try {
      setSubmitting(true);

      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('event_reviews')
          .update({
            rating: newRating,
            review_text: newReview,
            updated_at: new Date().toISOString()
          })
          .eq('id', userReview.id);

        if (error) throw error;

        toast({
          title: isRTL ? 'تم التحديث!' : 'Updated!',
          description: isRTL ? 'تم تحديث تقييمك بنجاح' : 'Your review has been updated successfully'
        });
      } else {
        // Create new review
        const { error } = await supabase
          .from('event_reviews')
          .insert({
            event_id: event.id,
            user_id: user.id,
            rating: newRating,
            review_text: newReview
          });

        if (error) throw error;

        toast({
          title: isRTL ? 'شكراً لك!' : 'Thank You!',
          description: isRTL ? 'تم إرسال تقييمك بنجاح' : 'Your review has been submitted successfully'
        });
      }

      // Reload reviews
      loadReviews();

    } catch (error) {
      logger.error('Error submitting review', { 
        component: 'EventReviewsDialog', 
        action: 'handleSubmitReview',
        data: { eventId: event.id, rating: newRating, userId: user?.id }
      }, error as Error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في إرسال التقييم' : 'Failed to submit review',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'star-filled' 
                : 'star-empty'
            } ${interactive ? 'star-interactive' : ''}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  const canReview = user && event?.status === 'مكتمل';
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {isRTL ? 'تقييمات الفعالية' : 'Event Reviews'}
          </DialogTitle>
          <DialogDescription>
            {event.title_ar}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Rating */}
          {reviews.length > 0 && (
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating))}
              <div className="text-sm text-muted-foreground mt-2">
                {isRTL ? `${reviews.length} تقييم` : `${reviews.length} reviews`}
              </div>
            </div>
          )}

          {/* Add/Edit Review Form */}
          {canReview && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  {userReview 
                    ? (isRTL ? 'تحديث تقييمك' : 'Update Your Review')
                    : (isRTL ? 'أضف تقييمك' : 'Add Your Review')
                  }
                </Label>
                {userReview && (
                  <Badge variant="outline">
                    {isRTL ? 'تم التقييم مسبقاً' : 'Previously Reviewed'}
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm">
                    {isRTL ? 'التقييم' : 'Rating'}
                  </Label>
                  {renderStars(newRating, true, setNewRating)}
                </div>

                <div>
                  <Label htmlFor="review-text" className="text-sm">
                    {isRTL ? 'تعليقك (اختياري)' : 'Your Review (Optional)'}
                  </Label>
                  <Textarea
                    id="review-text"
                    placeholder={isRTL 
                      ? 'شاركنا تجربتك في هذه الفعالية...'
                      : 'Share your experience with this event...'
                    }
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSubmitReview} 
                  disabled={submitting || newRating === 0}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {userReview 
                        ? (isRTL ? 'تحديث التقييم' : 'Update Review')
                        : (isRTL ? 'إرسال التقييم' : 'Submit Review')
                      }
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {isRTL ? 'جميع التقييمات' : 'All Reviews'}
            </h3>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  {isRTL ? 'جاري تحميل التقييمات...' : 'Loading reviews...'}
                </p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{isRTL ? 'لا توجد تقييمات حتى الآن' : 'No reviews yet'}</p>
                <p className="text-sm">
                  {isRTL ? 'كن أول من يقيم هذه الفعالية' : 'Be the first to review this event'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={review.id}>
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.user_profile?.avatar_url} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">
                              {review.user_profile?.display_name || (isRTL ? 'مستخدم مجهول' : 'Anonymous User')}
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        {review.review_text && (
                          <p className="text-sm text-muted-foreground">
                            {review.review_text}
                          </p>
                        )}

                        {review.helpful_count > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ThumbsUp className="w-3 h-3" />
                            <span>
                              {review.helpful_count} {isRTL ? 'مفيد' : 'helpful'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < reviews.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Guidelines */}
          {canReview && (
            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
              <p className="font-medium mb-1">
                {isRTL ? 'إرشادات التقييم:' : 'Review Guidelines:'}
              </p>
              <ul className="space-y-1">
                <li>• {isRTL ? 'كن صادقاً ومحترماً في تقييمك' : 'Be honest and respectful in your review'}</li>
                <li>• {isRTL ? 'ركز على تجربتك الشخصية' : 'Focus on your personal experience'}</li>
                <li>• {isRTL ? 'ساعد الآخرين في اتخاذ قرار مدروس' : 'Help others make informed decisions'}</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};