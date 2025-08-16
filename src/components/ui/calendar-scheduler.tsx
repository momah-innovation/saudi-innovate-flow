import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  Users,
  MapPin,
  MoreHorizontal
} from 'lucide-react';
import { dateHandler } from '@/utils/unified-date-handler';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, format } from 'date-fns';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  allDay?: boolean;
  color?: string;
  attendees?: number;
  location?: string;
  type?: 'meeting' | 'event' | 'deadline' | 'reminder';
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onEventCreate?: (date: Date) => void;
  selectedDate?: Date;
  className?: string;
}

export function CalendarView({
  events,
  onEventClick,
  onDateClick,
  onEventCreate,
  selectedDate = new Date(),
  className
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
      
      return date >= eventStart && date <= eventEnd;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const EventCard = ({ event }: { event: CalendarEvent }) => (
    <div
      className={cn(
        "text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity truncate",
        event.color || "bg-primary"
      )}
      style={{ backgroundColor: event.color }}
      onClick={(e) => {
        e.stopPropagation();
        onEventClick?.(event);
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
      {!event.allDay && (
        <div className="opacity-90">
          {format(event.startDate, 'HH:mm')}
        </div>
      )}
    </div>
  );

  const DayCell = ({ date }: { date: Date }) => {
    const dayEvents = getEventsForDate(date);
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);

    return (
      <div
        className={cn(
          "min-h-24 p-1 border-r border-b cursor-pointer hover:bg-muted/50 transition-colors",
          !isCurrentMonth && "bg-muted/20 text-muted-foreground",
          isSelected && "bg-primary/10",
          isCurrentDay && "bg-accent/50"
        )}
        onClick={() => onDateClick?.(date)}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            "text-sm font-medium",
            isCurrentDay && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs"
          )}>
            {format(date, 'd')}
          </span>
          
          {isCurrentMonth && onEventCreate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEventCreate(date);
              }}
              className="h-5 w-5 p-0 opacity-0 hover:opacity-100 transition-opacity"
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          
          {dayEvents.length > 3 && (
            <div className="text-xs text-muted-foreground">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {format(currentDate, 'MMMM yyyy')}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex rounded-md border">
              {(['month', 'week', 'day'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className="rounded-none first:rounded-l-md last:rounded-r-md"
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
            
            {/* Navigation */}
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {viewMode === 'month' && (
          <div className="grid grid-cols-7">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium border-r border-b bg-muted/50">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {monthDays.map((date) => (
              <DayCell key={date.toISOString()} date={date} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Event details popover
interface EventDetailsProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export function EventDetails({ event, isOpen, onClose, onEdit, onDelete }: EventDetailsProps) {
  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              {event.type && (
                <Badge variant="outline" className="mt-1">
                  {event.type}
                </Badge>
              )}
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-32">
                <div className="space-y-1">
                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(event)} className="w-full justify-start">
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(event.id)} 
                      className="w-full justify-start text-destructive"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground">{event.description}</p>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>
                {event.allDay 
                  ? 'All day' 
                  : `${format(event.startDate, 'MMM d, HH:mm')}${event.endDate ? ` - ${format(event.endDate, 'HH:mm')}` : ''}`
                }
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}

            {event.attendees && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{event.attendees} attendees</span>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}