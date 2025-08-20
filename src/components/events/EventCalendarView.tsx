import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar,
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface CalendarEvent {
  id: string;
  title_ar: string;
  description_ar: string;
  event_date: string;
  start_time: string;
  end_time: string;
  end_date?: string;
  location?: string;
  virtual_link?: string;
  format: string;
  event_type: string;
  event_category: string;
  status: string;
  max_participants?: number;
  registered_participants: number;
  actual_participants: number;
  budget?: number;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  event_manager_id?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  target_stakeholder_groups?: string[];
  partner_organizations?: string[];
  related_focus_questions?: string[];
  event_visibility?: string;
  created_at?: string;
  updated_at?: string;
}

interface EventCalendarViewProps {
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  loading?: boolean;
  className?: string;
}

export const EventCalendarView = ({ 
  events, 
  onEventSelect, 
  loading = false, 
  className = "" 
}: EventCalendarViewProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get calendar data
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // First day of the month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days including previous/next month padding
  let calendarDays: (Date | null)[] = [];
  
  // Previous month padding
  const prevMonth = new Date(year, month - 1, 0);
  const prevMonthDays = Array.from(
    { length: firstDayWeekday }, 
    (_, i) => new Date(year, month - 1, prevMonth.getDate() - (firstDayWeekday - 1 - i))
  );
  
  // Current month days
  const currentMonthDays = Array.from(
    { length: daysInMonth }, 
    (_, i) => new Date(year, month, i + 1)
  );
  
  // Next month padding to complete the grid
  const totalDays = prevMonthDays.length + currentMonthDays.length;
  const remainingDays = 42 - totalDays; // 6 weeks * 7 days
  const nextMonthDays = Array.from(
    { length: remainingDays }, 
    (_, i) => new Date(year, month + 1, i + 1)
  );
  
  calendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.event_date === dateStr);
  };

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Date formatters
  const monthNames = [
    t('events:calendar.months.january'),
    t('events:calendar.months.february'),
    t('events:calendar.months.march'),
    t('events:calendar.months.april'),
    t('events:calendar.months.may'),
    t('events:calendar.months.june'),
    t('events:calendar.months.july'),
    t('events:calendar.months.august'),
    t('events:calendar.months.september'),
    t('events:calendar.months.october'),
    t('events:calendar.months.november'),
    t('events:calendar.months.december')
  ];

  const dayNames = [
    t('events:calendar.days.sunday'),
    t('events:calendar.days.monday'),
    t('events:calendar.days.tuesday'),
    t('events:calendar.days.wednesday'),
    t('events:calendar.days.thursday'),
    t('events:calendar.days.friday'),
    t('events:calendar.days.saturday')
  ];

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      'conference': 'bg-blue-500',
      'workshop': 'bg-purple-500',
      'summit': 'bg-green-500',
      'expo': 'bg-orange-500',
      'forum': 'bg-cyan-500',
      'default': 'bg-gray-500'
    };
    return colors[type as keyof typeof colors] || colors.default;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('events:calendar.title')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                {t('events:calendar.today')}
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="min-w-[120px] text-center font-medium">
                  {monthNames[month]} {year}
                </div>
                <Button variant="ghost" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((date, index) => {
              if (!date) return <div key={index} />;
              
              const dayEvents = getEventsForDate(date);
              const hasEvents = dayEvents.length > 0;
              
              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[80px] p-1 border rounded cursor-pointer transition-colors",
                    "hover:bg-muted/50",
                    isCurrentMonth(date) ? "bg-background" : "bg-muted/20",
                    isToday(date) && "ring-2 ring-primary ring-offset-1",
                    isSelected(date) && "bg-primary/10"
                  )}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className={cn(
                    "text-sm font-medium",
                    isCurrentMonth(date) ? "text-foreground" : "text-muted-foreground",
                    isToday(date) && "text-primary font-bold"
                  )}>
                    {date.getDate()}
                  </div>
                  
                  {/* Event indicators */}
                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "text-xs p-1 rounded text-white truncate cursor-pointer",
                          getEventTypeColor(event.event_type)
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventSelect(event);
                        }}
                        title={event.title_ar}
                      >
                        {event.title_ar}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 2} {t('events:calendar.more')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('events:calendar.events_for')} {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getEventsForDate(selectedDate).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t('events:calendar.no_events_date')}
              </p>
            ) : (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event) => (
                  <div 
                    key={event.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onEventSelect(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title_ar}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.start_time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{event.registered_participants}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <TypeBadge type={event.event_type} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
