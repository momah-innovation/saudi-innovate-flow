import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Calendar,
  ArrowRight,
  Star
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface RecommendedEvent {
  id: string;
  title_ar: string;
  description_ar: string;
  event_date: string;
  event_type: string;
  registered_participants: number;
  image_url?: string;
  recommendation_score: number;
  reason: string;
}

interface EventRecommendationsProps {
  onEventSelect: (eventId: string) => void;
  className?: string;
}

export const EventRecommendations = ({ onEventSelect, className = "" }: EventRecommendationsProps) => {
  const { isRTL } = useDirection();
  const { me, ms, end } = useRTLAware();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get user's recommended events
      const { data: recommended, error } = await supabase
        .from('event_recommendations')
        .select(`
          recommendation_score,
          reason,
          events!fk_event_recommendations_event_id(
            id,
            title_ar,
            description_ar,
            event_date,
            event_type,
            registered_participants,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('recommendation_score', { ascending: false })
        .limit(6);

      if (error) throw error;

      // If no personalized recommendations, get trending events
      if (!recommended || recommended.length === 0) {
        const { data: trending, error: trendingError } = await supabase
          .from('events')
          .select('*')
          .gte('event_date', new Date().toISOString())
          .order('registered_participants', { ascending: false })
          .limit(6);

        if (trendingError) throw trendingError;

        const trendingRecommendations = trending?.map(event => ({
          ...event,
          recommendation_score: 0.8,
          reason: isRTL ? 'فعالية رائجة' : 'Trending Event'
        })) || [];

        setRecommendations(trendingRecommendations);
      } else {
        const formattedRecommendations = recommended.map(item => ({
          ...(item.events as any),
          recommendation_score: item.recommendation_score,
          reason: item.reason
        }));
        setRecommendations(formattedRecommendations);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReasonIcon = (reason: string) => {
    if (reason.includes('trending') || reason.includes('رائجة')) return TrendingUp;
    if (reason.includes('interest') || reason.includes('اهتمام')) return Star;
    if (reason.includes('similar') || reason.includes('مشابه')) return Users;
    return Sparkles;
  };

  const getReasonColor = (reason: string) => {
    if (reason.includes('trending') || reason.includes('رائجة')) return 'text-warning';
    if (reason.includes('interest') || reason.includes('اهتمام')) return 'text-accent';
    if (reason.includes('similar') || reason.includes('مشابه')) return 'text-primary';
    return 'text-primary';
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className={cn("overflow-hidden border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10", className)}>
      <CardHeader className="pb-3 border-b border-accent/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            {isRTL ? 'مقترحة لك' : 'For You'}
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <Star className={`w-3 h-3 ${me('1')}`} />
            {isRTL ? 'مخصص' : 'Personal'}
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {isRTL ? 'فعاليات مختارة بناءً على اهتماماتك' : 'Events curated based on your interests'}
        </p>
      </CardHeader>

      <CardContent className="p-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-primary/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <p className="text-muted-foreground text-sm">
              {isRTL ? 'لا توجد توصيات متاحة' : 'No recommendations available'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.slice(0, 4).map((event, index) => {
              const ReasonIcon = getReasonIcon(event.reason);
              const scoreColor = event.recommendation_score > 0.8 ? 'text-success' : 
                               event.recommendation_score > 0.6 ? 'text-warning' : 'text-muted-foreground';
              
              return (
                <div 
                  key={event.id}
                  className="group relative overflow-hidden rounded-lg p-3 bg-background/70 hover:bg-background/90 transition-all duration-300 cursor-pointer border border-accent/10 hover:border-accent/20 hover:shadow-lg"
                  onClick={() => onEventSelect(event.id)}
                >
                  {/* Recommendation Score */}
                  <div className={`absolute top-2 ${end('2')}`}>
                    <Badge variant="outline" className={cn("text-xs border-0 bg-white/90", scoreColor)}>
                      <Star className={`w-3 h-3 ${me('1')}`} />
                      {Math.round(event.recommendation_score * 100)}%
                    </Badge>
                  </div>

                  <div className="flex items-start gap-3">
                    {/* Event Image/Icon */}
                    <div className="flex-shrink-0">
                      {event.image_url ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-accent/20">
                          <img 
                            src={event.image_url} 
                            alt={event.title_ar}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/10 to-accent/20 flex items-center justify-center border border-accent/20">
                          <Calendar className="w-6 h-6 text-accent" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-accent transition-colors leading-tight">
                          {event.title_ar}
                        </h4>
                        
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="font-medium">
                              {new Date(event.event_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{event.registered_participants}</span>
                          </div>
                        </div>
                      </div>

                      {/* Recommendation Reason */}
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-accent/10">
                          <ReasonIcon className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                          {event.reason}
                        </span>
                      </div>

                      {/* Event Type */}
                      <Badge 
                        variant="outline" 
                        className="text-xs px-2 py-0.5 border-accent/20 text-accent bg-accent/10"
                      >
                        {event.event_type}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {recommendations.length > 4 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4 border-accent/20 text-accent hover:bg-accent/10"
                onClick={() => onEventSelect('all-recommendations')}
              >
                {isRTL ? `عرض جميع التوصيات (${recommendations.length})` : `View All Recommendations (${recommendations.length})`}
                <ArrowRight className={`w-4 h-4 ${ms('2')}`} />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};