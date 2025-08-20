import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { debugLog } from '@/utils/debugLogger';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { VisibilityBadge } from '@/components/ui/VisibilityBadge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, Users, Clock, Ticket, UserMinus } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useEventState } from '@/hooks/useEventState';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

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
  visibility?: string;
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
  const { t } = useUnifiedTranslation();
  
  // Use unified event state management
  const {
    isRegistered,
    participantCount,
    loading,
    registerForEvent,
    cancelRegistration
  } = useEventState(event?.id || null);

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
      case 'upcoming': return t('events:status.upcoming');
      case 'ongoing': return t('events:status.ongoing');
      case 'completed': return t('events:status.completed');
      case 'cancelled': return t('events:status.cancelled');
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA') : 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isEventFull = event.max_participants && participantCount >= event.max_participants;
  const isPastEvent = new Date(event.event_date) < new Date();

  const handleRegistrationToggle = async () => {
    try {
      if (isRegistered) {
        debugLog.debug('Cancelling registration for event', { eventId: event.id });
        await cancelRegistration();
      } else {
        debugLog.debug('Registering for event', { eventId: event.id });
        await registerForEvent();
      }
    } catch (error) {
      debugLog.error('Failed to toggle registration:', error);
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
            <span>{participantCount}/{event.max_participants || '∞'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={event.status} size="sm" />
            <TypeBadge type={event.event_type} size="sm" />
            {event.visibility && <VisibilityBadge visibility={event.visibility} size="sm" />}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(event)}>
              <Ticket className="h-4 w-4 mr-2" />
              {t('events:actions.view_details')}
            </Button>
            <Button 
              size="sm" 
              variant={isRegistered ? "destructive" : "default"}
              onClick={handleRegistrationToggle}
              disabled={(() => {
                if (loading) return true;
                if (isPastEvent) return true;
                if (event.status === 'completed' || event.status === 'cancelled') return true;
                if (!isRegistered && isEventFull) return true;
                return false;
              })()}
            >
              {(() => {
                if (loading) {
                  return t('events:registration.updating');
                }
                if (isPastEvent) {
                  return isRegistered 
                    ? t('events:registration.registered_attended')
                    : t('events:registration.event_ended');
                }
                if (isRegistered) {
                  return (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      {t('events:actions.cancel_registration')}
                    </>
                  );
                }
                return t('events:registration.register');
              })()}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
