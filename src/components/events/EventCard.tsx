import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, MapPin, Users, Clock, Bookmark, Ticket, UserMinus } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useEventInteractions } from '@/hooks/useEventInteractions';
import { useParticipants } from '@/hooks/useParticipants';
import { useRealTimeEvents } from '@/hooks/useRealTimeEvents';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface Event {
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
}

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  viewMode?: 'cards' | 'list' | 'grid';
}

export const EventCard = ({ event, onViewDetails, viewMode = 'cards' }: EventCardProps) => {
  const { isRTL } = useDirection();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);
  
  // Use centralized event interaction hooks
  const { 
    interactions,
    registerForEvent,
    refetch: refetchInteractions,
    refreshAfterRegistrationChange
  } = useEventInteractions(event?.id || null);

  const {
    participants,
    cancelRegistration,
    fetchParticipants
  } = useParticipants(event?.id || null);

  // Set up real-time updates
  useRealTimeEvents({
    onParticipantUpdate: (eventId, count) => {
      if (eventId === event.id) {
        console.log('🔄 Real-time participant update for EventCard:', eventId, count);
        fetchParticipants(); // Refresh participants when count changes
        refetchInteractions(); // Refresh interactions as well
      }
    },
    onEventUpdate: (update) => {
      if (update.event_id === event.id) {
        console.log('🔄 Real-time event update for EventCard:', update);
        refetchInteractions(); // Refresh when event is updated
      }
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return isRTL ? 'قادم' : 'Upcoming';
      case 'ongoing': return isRTL ? 'جاري' : 'Ongoing';
      case 'completed': return isRTL ? 'مكتمل' : 'Completed';
      case 'cancelled': return isRTL ? 'ملغي' : 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA') : 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isEventFull = event.max_participants && event.registered_participants >= event.max_participants;
  const isPastEvent = new Date(event.event_date) < new Date();
  
  // Find current user's participation
  const currentUserParticipation = participants.find(p => p.user_id === currentUserId);
  const isRegistered = !!currentUserParticipation;

  const handleRegistrationToggle = async () => {
    try {
      if (isRegistered && currentUserParticipation) {
        console.log('🔄 Cancelling registration for event:', event.id);
        await cancelRegistration(currentUserParticipation.id, event.id);
        // Force immediate refresh of both data sources
        await Promise.all([
          fetchParticipants(),
          refetchInteractions()
        ]);
      } else {
        console.log('🔄 Registering for event:', event.id);
        await registerForEvent();
        // Force immediate refresh after successful registration
        await fetchParticipants();
      }
    } catch (error) {
      console.error('Failed to toggle registration:', error);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 line-clamp-2">
              {event.title_ar}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-3">
              {event.description_ar}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(event.status)}>
            {getStatusText(event.status)}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(event.event_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{event.start_time || 'TBD'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{event.location || 'Location TBD'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{event.registered_participants}/{event.max_participants || '∞'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant="outline">{event.event_type}</Badge>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(event)}>
              <Ticket className="h-4 w-4 mr-2" />
              {isRTL ? 'التفاصيل' : 'Details'}
            </Button>
            <Button 
              size="sm" 
              variant={isRegistered ? "destructive" : "default"}
              onClick={handleRegistrationToggle}
              disabled={(() => {
                if (isPastEvent) return true;
                if (event.status === 'completed' || event.status === 'cancelled') return true;
                if (!isRegistered && isEventFull) return true;
                return false;
              })()}
            >
              {(() => {
                if (isPastEvent) {
                  return isRegistered 
                    ? (isRTL ? 'مسجل/حضر' : 'Registered/Attended')
                    : (isRTL ? 'غير مسجل/انتهت الفعالية' : 'Not Registered/Event Ended');
                }
                if (isRegistered) {
                  return (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      {isRTL ? 'إلغاء التسجيل' : 'Cancel Registration'}
                    </>
                  );
                }
                return isRTL ? 'التسجيل' : 'Register';
              })()}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};