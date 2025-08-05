import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Activity,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  todayEvents: number;
  totalParticipants: number;
  averageParticipants: number;
  mostPopularType: string;
  onlineEvents: number;
  offlineEvents: number;
  thisWeekEvents: number;
  nextWeekEvents: number;
}

interface EventStatsWidgetProps {
  className?: string;
}

export const EventStatsWidget = ({ className = "" }: EventStatsWidgetProps) => {
  const { isRTL } = useDirection();
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventStats();
  }, []);

  const loadEventStats = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const nextWeekFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Get all events
      const { data: allEvents, error: allEventsError } = await supabase
        .from('events')
        .select('*');

      if (allEventsError) throw allEventsError;

      // Get participant counts
      const { data: participantCounts, error: participantsError } = await supabase
        .from('event_participants')
        .select('event_id');

      if (participantsError) throw participantsError;

      const events = allEvents || [];
      const participants = participantCounts || [];

      // Calculate stats
      const totalEvents = events.length;
      const upcomingEvents = events.filter(e => e.event_date >= todayStr).length;
      const todayEvents = events.filter(e => e.event_date === todayStr).length;
      const thisWeekEvents = events.filter(e => e.event_date >= todayStr && e.event_date <= weekFromNow).length;
      const nextWeekEvents = events.filter(e => e.event_date > weekFromNow && e.event_date <= nextWeekFromNow).length;
      
      const totalParticipants = participants.length;
      const averageParticipants = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;
      
      const onlineEvents = events.filter(e => e.format === 'virtual').length;
      const offlineEvents = events.filter(e => e.format === 'in_person').length;
      
      // Find most popular event type
      const typeCounts = events.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostPopularType = Object.keys(typeCounts).reduce((a, b) => 
        typeCounts[a] > typeCounts[b] ? a : b, 'conference'
      );

      setStats({
        totalEvents,
        upcomingEvents,
        todayEvents,
        totalParticipants,
        averageParticipants,
        mostPopularType,
        onlineEvents,
        offlineEvents,
        thisWeekEvents,
        nextWeekEvents
      });

    } catch (error) {
      console.error('Error loading event stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
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

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-muted rounded-full animate-pulse"></div>
            {isRTL ? 'إحصائيات الفعاليات' : 'Event Stats'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-2 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const onlinePercentage = stats.totalEvents > 0 ? (stats.onlineEvents / stats.totalEvents) * 100 : 0;
  const upcomingPercentage = stats.totalEvents > 0 ? (stats.upcomingEvents / stats.totalEvents) * 100 : 0;

  return (
    <Card className={cn("overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10", className)}>
      <CardHeader className="pb-3 border-b border-primary/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <BarChart3 className="w-3 h-3 text-primary-foreground" />
            </div>
            {isRTL ? 'إحصائيات الفعاليات' : 'Event Stats'}
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {isRTL ? 'مباشر' : 'Live'}
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {isRTL ? 'نظرة عامة على أداء الفعاليات' : 'Overview of event performance'}
        </p>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/70 rounded-lg p-3 border border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                {isRTL ? 'إجمالي الفعاليات' : 'Total Events'}
              </span>
            </div>
            <div className="text-xl font-bold text-primary">{stats.totalEvents}</div>
          </div>

          <div className="bg-success/70 rounded-lg p-3 border border-success/10">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-muted-foreground">
                {isRTL ? 'المشاركون' : 'Participants'}
              </span>
            </div>
            <div className="text-xl font-bold text-success">{stats.totalParticipants}</div>
          </div>

          <div className="bg-warning/70 rounded-lg p-3 border border-warning/10">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-xs font-medium text-muted-foreground">
                {isRTL ? 'اليوم' : 'Today'}
              </span>
            </div>
            <div className="text-xl font-bold text-warning">{stats.todayEvents}</div>
          </div>

          <div className="bg-accent/70 rounded-lg p-3 border border-accent/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-muted-foreground">
                {isRTL ? 'القادمة' : 'Upcoming'}
              </span>
            </div>
            <div className="text-xl font-bold text-accent">{stats.upcomingEvents}</div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="space-y-3">
          <div className="bg-primary/70 rounded-lg p-3 border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {isRTL ? 'الفعاليات القادمة' : 'Upcoming Events'}
                </span>
              </div>
              <span className="text-sm font-bold text-primary">
                {Math.round(upcomingPercentage)}%
              </span>
            </div>
            <Progress value={upcomingPercentage} className="h-2" />
          </div>

          <div className="bg-success/70 rounded-lg p-3 border border-success/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">
                  {isRTL ? 'الفعاليات الافتراضية' : 'Virtual Events'}
                </span>
              </div>
              <span className="text-sm font-bold text-success">
                {Math.round(onlinePercentage)}%
              </span>
            </div>
            <Progress value={onlinePercentage} className="h-2" />
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-info/70 rounded-lg p-3 border border-info/10 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-info" />
            <span className="text-sm font-medium">
              {isRTL ? 'رؤى سريعة' : 'Quick Insights'}
            </span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-warning" />
              <span>
                {isRTL ? 
                  `متوسط ${stats.averageParticipants} مشارك لكل فعالية` :
                  `Avg ${stats.averageParticipants} participants per event`
                }
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {getTypeIcon(stats.mostPopularType)}
              </span>
              <span>
                {isRTL ? 
                  `الأكثر شعبية: ${stats.mostPopularType}` :
                  `Most popular: ${stats.mostPopularType}`
                }
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-primary" />
              <span>
                {isRTL ? 
                  `${stats.thisWeekEvents} فعاليات هذا الأسبوع` :
                  `${stats.thisWeekEvents} events this week`
                }
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};