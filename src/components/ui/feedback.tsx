import React, { useState } from 'react';
import { Star, Heart, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Button } from './button';
import { Textarea } from './textarea';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  showLabel = false,
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= (hoverRating || rating);

          return (
            <button
              key={index}
              type="button"
              disabled={readonly}
              className={cn(
                "transition-colors",
                !readonly && "hover:scale-110 transition-transform"
              )}
              onClick={() => !readonly && onChange(starValue)}
              onMouseEnter={() => !readonly && setHoverRating(starValue)}
              onMouseLeave={() => !readonly && setHoverRating(0)}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            </button>
          );
        })}
      </div>

      {showLabel && rating > 0 && (
        <span className="text-sm text-muted-foreground">
          {labels[rating - 1] || `${rating}/${max}`}
        </span>
      )}
    </div>
  );
}

interface FeedbackFormProps {
  onSubmit: (feedback: {
    rating: number;
    type: 'like' | 'dislike' | null;
    comment: string;
  }) => void;
  title?: string;
  placeholder?: string;
  showRating?: boolean;
  showLikeDislike?: boolean;
  className?: string;
}

export function FeedbackForm({
  onSubmit,
  title = "Share your feedback",
  placeholder = "Tell us what you think...",
  showRating = true,
  showLikeDislike = true,
  className
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [type, setType] = useState<'like' | 'dislike' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if ((!showRating || rating > 0) && comment.trim()) {
      setIsSubmitting(true);
      await onSubmit({ rating, type, comment });
      setIsSubmitting(false);
      // Reset form
      setRating(0);
      setType(null);
      setComment('');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showRating && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              How would you rate your experience?
            </label>
            <StarRating
              rating={rating}
              onChange={setRating}
              showLabel
            />
          </div>
        )}

        {showLikeDislike && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Did this help you?
            </label>
            <div className="flex gap-2">
              <Button
                variant={type === 'like' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setType(type === 'like' ? null : 'like')}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Yes
              </Button>
              <Button
                variant={type === 'dislike' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setType(type === 'dislike' ? null : 'dislike')}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                No
              </Button>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-2 block">
            Additional comments
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={placeholder}
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || (!showRating && !comment.trim()) || (showRating && rating === 0 && !comment.trim())}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </CardContent>
    </Card>
  );
}

interface ReviewCardProps {
  review: {
    id: string;
    author: {
      name: string;
      avatar?: string;
      role?: string;
    };
    rating: number;
    comment: string;
    date: Date;
    helpful?: number;
    verified?: boolean;
  };
  onHelpful?: (reviewId: string) => void;
  className?: string;
}

export function ReviewCard({ review, onHelpful, className }: ReviewCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {review.author.avatar ? (
            <img
              src={review.author.avatar}
              alt={review.author.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {review.author.name.charAt(0)}
            </div>
          )}

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{review.author.name}</span>
                  {review.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                {review.author.role && (
                  <span className="text-xs text-muted-foreground">{review.author.role}</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {review.date.toLocaleDateString()}
              </span>
            </div>

            <StarRating rating={review.rating} onChange={() => {}} readonly size="sm" />

            <p className="text-sm leading-relaxed">{review.comment}</p>

            {onHelpful && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onHelpful(review.id)}
                  className="text-xs h-7"
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Helpful {review.helpful ? `(${review.helpful})` : ''}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}