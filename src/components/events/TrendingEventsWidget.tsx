import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Users, MapPin } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';

interface TrendingEvent {
  id: string;
  title_ar: string;
  event_date: string;
  event_type: string;
  registered_participants: number;
  format: string;
  status: string;
  image_url?: string;
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
  const [trendingEvents, setTrendingEvents] = useState<TrendingEvent[]>([]);
  const [loading, setLoading] = useState(true);

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
        (events || []).map(async (event) => {
          const { count } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact' })
            .eq('event_id', event.id);

          return {
            ...event,
            registered_participants: count || 0
          };
        })
      );

      setTrendingEvents(eventsWithCounts);
      
    } catch (error) {
      console.error('Error loading trending events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }) :
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      'conference': 'bg-blue-100 text-blue-800 border-blue-200',
      'workshop': 'bg-purple-100 text-purple-800 border-purple-200',
      'summit': 'bg-green-100 text-green-800 border-green-200',
      'expo': 'bg-orange-100 text-orange-800 border-orange-200',
      'default': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.default;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {isRTL ? 'الفعاليات الرائجة' : 'Trending Events'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          {isRTL ? 'الفعاليات الرائجة' : 'Trending Events'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trendingEvents.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            {isRTL ? 'لا توجد فعاليات رائجة حالياً' : 'No trending events right now'}
          </p>
        ) : (
          <div className="space-y-4">
            {trendingEvents.map((event, index) => (
              <div 
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => onEventSelect?.(event.id)}
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                    {event.title_ar}
                  </h4>
                  
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{event.registered_participants}</span>
                    </div>
                    {event.format === 'virtual' && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{isRTL ? 'عبر الإنترنت' : 'Online'}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getEventTypeColor(event.event_type)}`}
                    >
                      {event.event_type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => onEventSelect?.('all')}
            >
              {isRTL ? 'عرض جميع الفعاليات' : 'View All Events'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};