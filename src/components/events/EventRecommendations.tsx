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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
    if (reason.includes('trending') || reason.includes('رائجة')) return 'text-orange-600';
    if (reason.includes('interest') || reason.includes('اهتمام')) return 'text-purple-600';
    if (reason.includes('similar') || reason.includes('مشابه')) return 'text-blue-600';
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
    <div className={`space-y-4 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {isRTL ? 'فعاليات مقترحة لك' : 'Recommended for You'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isRTL ? 'فعاليات مختارة خصيصاً بناءً على اهتماماتك' : 'Events curated based on your interests'}
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((event) => {
          const ReasonIcon = getReasonIcon(event.reason);
          
          return (
            <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => onEventSelect(event.id)}>
              {/* Event Image */}
              <div className="relative h-32 overflow-hidden">
                {event.image_url ? (
                  <img 
                    src={event.image_url} 
                    alt={event.title_ar}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-primary/40" />
                  </div>
                )}
                
                {/* Recommendation Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-white/90 text-gray-700 border-0">
                    <ReasonIcon className={`w-3 h-3 mr-1 ${getReasonColor(event.reason)}`} />
                    {event.reason}
                  </Badge>
                </div>

                {/* Score Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-primary/90 text-white border-0">
                    {Math.round(event.recommendation_score * 100)}%
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-2">
                  {event.title_ar}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {event.description_ar}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{event.registered_participants}</span>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventSelect(event.id);
                  }}
                >
                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};