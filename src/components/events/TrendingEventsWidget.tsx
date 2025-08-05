import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Users, MapPin, Flame, Eye, Star } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface TrendingEvent {
  id: string;
  title_ar: string;
  event_date: string;
  event_type: string;
  registered_participants: number;
  max_participants?: number;
  format: string;
  status: string;
  image_url?: string;
  location?: string;
  virtual_link?: string;
  popularity_score?: number;
  trending_rank?: number;
}

interface TrendingEventsWidgetProps {
  onEventSelect?: (eventId: string) => void;
  className?: string;
}

export const TrendingEventsWidget = ({ 
  onEventSelect, 
  className = "" 
}: TrendingEventsWidgetProps) => {
  const { isRTL } = useDirection();
  const { end, ms } = useRTLAware();
  const [trendingEvents, setTrendingEvents] = useState<TrendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    loadTrendingEvents();
  }, []);

  const loadTrendingEvents = async () => {
    try {
      setLoading(true);
      
      // Get events with high participation and recent activity
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .eq('status', 'upcoming')
        .order('registered_participants', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Get participant counts for each event
      const eventsWithCounts = await Promise.all(
        (events || []).map(async (event, index) => {
          const { count } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact' })
            .eq('event_id', event.id);

          // Calculate popularity score based on participants and recency
          const daysUntilEvent = Math.ceil((new Date(event.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const popularityScore = (count || 0) * (1 / Math.max(daysUntilEvent, 1)) * 100;

          return {
            ...event,
            registered_participants: count || 0,
            popularity_score: popularityScore,
            trending_rank: index + 1
          };
        })
      );

      setTrendingEvents(eventsWithCounts);
      setTotalViews(eventsWithCounts.reduce((sum, event) => sum + (event.popularity_score || 0), 0));
      
    } catch (error) {
      console.error('Error loading trending events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffInDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return isRTL ? 'اليوم' : 'Today';
    if (diffInDays === 1) return isRTL ? 'غداً' : 'Tomorrow';
    if (diffInDays <= 7) return isRTL ? `خلال ${diffInDays} أيام` : `In ${diffInDays} days`;
    
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }) :
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getEventTypeIcon = (type: string) => {
    const icons = {
      'conference': '🎤',
      'workshop': '🛠️',
      'summit': '🏔️',
      'expo': '🎪',
      'hackathon': '💻',
      'seminar': '📚',
      'training': '🎯',
      'default': '📅'
    };
    return icons[type as keyof typeof icons] || icons.default;
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      'conference': 'from-blue-500 to-blue-600',
      'workshop': 'from-purple-500 to-purple-600',
      'summit': 'from-green-500 to-green-600',
      'expo': 'from-orange-500 to-orange-600',
      'hackathon': 'from-red-500 to-red-600',
      'seminar': 'from-indigo-500 to-indigo-600',
      'training': 'from-yellow-500 to-yellow-600',
      'default': 'from-gray-500 to-gray-600'
    };
    return colors[type as keyof typeof colors] || colors.default;
  };

  const getTrendingIcon = (rank: number) => {
    if (rank === 1) return <Flame className="w-4 h-4 text-destructive" />;
    if (rank === 2) return <TrendingUp className="w-4 h-4 text-warning" />;
    if (rank === 3) return <Star className="w-4 h-4 text-warning" />;
    return <Eye className="w-4 h-4 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Flame className="w-3 h-3 text-primary-foreground" />
            </div>
            {isRTL ? 'الفعاليات الرائجة' : 'Trending Events'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-destructive/5", className)}>
      <CardHeader className="pb-3 border-b border-warning/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-destructive to-warning rounded-full flex items-center justify-center animate-pulse">
              <Flame className="w-3 h-3 text-primary-foreground" />
            </div>
            {isRTL ? 'الفعاليات الرائجة' : 'Trending Events'}
          </div>
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
            {isRTL ? 'مباشر' : 'Live'}
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {isRTL ? 'الأكثر شعبية هذا الأسبوع' : 'Most popular this week'}
        </p>
      </CardHeader>
      
      <CardContent className="p-4">
        {trendingEvents.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              {isRTL ? 'لا توجد فعاليات رائجة حالياً' : 'No trending events right now'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {trendingEvents.map((event, index) => {
              const capacity = event.max_participants ? 
                (event.registered_participants / event.max_participants) * 100 : 50;
              
              return (
                <div 
                  key={event.id}
                  className="group relative overflow-hidden rounded-lg p-3 bg-card/70 hover:bg-card/90 transition-all duration-300 cursor-pointer border border-warning/10 hover:border-warning/20 hover:shadow-lg"
                  onClick={() => onEventSelect?.(event.id)}
                >
                  {/* Trending Rank */}
                  <div className={`absolute top-2 ${end('2')} flex items-center gap-1`}>
                    {getTrendingIcon(event.trending_rank || index + 1)}
                    <span className="text-xs font-medium">#{index + 1}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    {/* Event Avatar */}
                    <div className="flex-shrink-0">
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-lg shadow-sm",
                        getEventTypeColor(event.event_type)
                      )}>
                        {getEventTypeIcon(event.event_type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h4 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {event.title_ar}
                        </h4>
                        
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="font-medium">{formatDate(event.event_date)}</span>
                          </div>
                           {event.format === 'virtual' ? (
                             <Badge variant="outline" className="px-1.5 py-0.5 text-xs border-success/20 text-success bg-success/5">
                               {isRTL ? 'عبر الإنترنت' : 'Online'}
                             </Badge>
                          ) : (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-20">{event.location || 'TBD'}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Participants Progress */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{event.registered_participants} {isRTL ? 'مشترك' : 'participants'}</span>
                          </div>
                          {event.max_participants && (
                            <span className="text-muted-foreground">
                              {Math.round(capacity)}% {isRTL ? 'ممتلئ' : 'full'}
                            </span>
                          )}
                        </div>
                        {event.max_participants && (
                          <Progress value={capacity} className="h-1.5" />
                        )}
                      </div>

                      {/* Event Type Badge */}
                      <Badge 
                        variant="outline" 
                        className="text-xs px-2 py-0.5 border-warning/20 text-warning bg-warning/5"
                      >
                        {event.event_type}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4 border-warning/20 text-warning hover:bg-warning/5"
              onClick={() => onEventSelect?.('all')}
            >
              {isRTL ? 'عرض جميع الفعاليات الرائجة' : 'View All Trending Events'}
              <TrendingUp className={`w-4 h-4 ${ms('2')}`} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};