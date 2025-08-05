import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarIcon, MapPin, Users, Clock, Bookmark, 
  Ticket, Star, Heart, Eye, Share2, Video,
  Globe, MapPinIcon, BookmarkIcon
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useState } from 'react';
import { InteractionButtons } from '@/components/ui/interaction-buttons';
import { useRTLAware } from '@/hooks/useRTLAware';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useAppTranslation';

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
  image_url?: string;
}

interface EnhancedEventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onRegister: (event: Event) => void;
  onBookmark?: (event: Event) => void;
  viewMode?: 'cards' | 'list' | 'grid';
  isBookmarked?: boolean;
}

export const EnhancedEventCard = ({ 
  event, 
  onViewDetails, 
  onRegister, 
  onBookmark,
  viewMode = 'cards',
  isBookmarked = false
}: EnhancedEventCardProps) => {
  const { isRTL } = useDirection();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const { end, me, start } = useRTLAware();
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'scheduled': return 'badge-info';
      case 'ongoing': return 'badge-success';
      case 'completed': return 'badge-secondary';
      case 'cancelled': return 'badge-error';
      default: return 'badge-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'scheduled': return t('upcoming') || 'قادم';
      case 'ongoing': return t('ongoing') || 'جاري';
      case 'completed': return t('completed') || 'مكتمل';
      case 'cancelled': return t('cancelled') || 'ملغي';
      default: return status;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'badge-partner';
      case 'conference': return 'badge-expert';
      case 'webinar': return 'badge-info';
      case 'meetup': return 'badge-warning';
      case 'hackathon': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }) : 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRegistrationPercentage = () => {
    if (!event.max_participants) return 0;
    return Math.min((event.registered_participants / event.max_participants) * 100, 100);
  };

  const isEventFull = event.max_participants && event.registered_participants >= event.max_participants;
  const isEventSoon = () => {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark?.(event);
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-300 hover-scale animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Event Image */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                {event.image_url ? (
                  <img 
                    src={event.image_url} 
                    alt={event.title_ar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CalendarIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              {/* Format Badge */}
              {event.format === 'virtual' && (
                <div className={cn("absolute -top-1", end('1'))}>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    <Video className="w-3 h-3" />
                  </Badge>
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate text-foreground">{event.title_ar}</h3>
                    {isEventSoon() && (
                       <Badge variant="secondary" className="text-xs badge-warning">
                         {t('soon') || 'قريباً'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                    {event.description_ar}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{event.start_time || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                       <span className="truncate">{event.location || (event.format === 'virtual' ? (t('online') || 'عبر الإنترنت') : 'TBD')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <Badge className={getStatusColor(event.status)}>
                      {getStatusText(event.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handleBookmark}>
                      <BookmarkIcon className={`w-4 h-4 ${bookmarked ? 'fill-current text-primary' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(event)}>
                      <Eye className={`w-4 h-4 ${me('1')}`} />
                       {t('details') || 'التفاصيل'}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => onRegister(event)}
                      disabled={event.status === 'completed' || isEventFull}
                    >
                       {isEventFull ? 
                         (t('full') || 'ممتلئ') :
                         (t('register') || 'تسجيل')
                       }
                    </Button>
                  </div>
                </div>
              </div>

              {/* Registration Progress */}
              {event.max_participants && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{event.registered_participants}/{event.max_participants} {t('registered') || 'مسجل'}</span>
                    <span>{Math.round(getRegistrationPercentage())}%</span>
                  </div>
                  <Progress value={getRegistrationPercentage()} className="h-1.5" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in overflow-hidden">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        {event.image_url ? (
          <img 
            src={event.image_url} 
            alt={event.title_ar}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <CalendarIcon className="w-16 h-16 text-primary/40" />
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className={cn("absolute top-3 flex flex-col gap-2", start('3'))}>
          <Badge className={getStatusColor(event.status)}>
            {getStatusText(event.status)}
          </Badge>
          {event.format === 'virtual' && (
             <Badge variant="secondary" className="bg-background/90 text-muted-foreground">
               <Globe className={`w-3 h-3 ${me('1')}`} />
               {t('online') || 'عبر الإنترنت'}
             </Badge>
          )}
           {isEventSoon() && (
             <Badge className="badge-warning">
               {t('soon') || 'قريباً'}
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className={cn("absolute top-3 flex gap-2", end('3'))}>
          <Button
            variant="secondary"
            size="sm"
             className="bg-background/90 hover:bg-background"
            onClick={handleBookmark}
          >
            <BookmarkIcon className={`w-4 h-4 ${bookmarked ? 'fill-current text-primary' : ''}`} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-background/90 hover:bg-background"
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current text-destructive' : ''}`} />
          </Button>
        </div>

        {/* Date Badge */}
        <div className={cn("absolute bottom-3", start('3'))}>
          <div className="bg-background/95 rounded-lg p-2 text-center min-w-[3rem]">
            <div className="text-xs font-medium text-muted-foreground">
              {new Date(event.event_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short' })}
            </div>
            <div className="text-lg font-bold text-foreground">
              {new Date(event.event_date).getDate()}
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 mb-2">
              {event.title_ar}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {event.description_ar}
            </CardDescription>
          </div>
          <Badge className={getEventTypeColor(event.event_type)}>
            {event.event_type}
          </Badge>
        </div>

        {/* Event Meta */}
        <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{event.start_time || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4" />
            <span className="truncate">{event.location || (event.format === 'virtual' ? (t('online') || 'عبر الإنترنت') : 'TBD')}</span>
          </div>
        </div>

        {/* Registration Progress */}
        {event.max_participants && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{t('registration') || 'التسجيل'}</span>
              <span>{event.registered_participants}/{event.max_participants}</span>
            </div>
            <Progress value={getRegistrationPercentage()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
               <span>{Math.round(getRegistrationPercentage())}% {t('full') || 'ممتلئ'}</span>
               {getRegistrationPercentage() > 80 && (
                 <span className="text-warning">{t('limited_spots') || 'أماكن محدودة'}</span>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">{event.registered_participants}</div>
            <div className="text-xs text-muted-foreground">{t('registered') || 'مسجل'}</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">
               {event.budget ? `${event.budget.toLocaleString()} ${t('currency_sar') || 'ر.س'}` : (t('free') || 'مجاني')}
             </div>
             <div className="text-xs text-muted-foreground">{t('price') || 'السعر'}</div>
          </div>
        </div>

        {/* Social Interactions */}
        <div className="mb-4">
          <InteractionButtons 
            itemId={event.id}
            itemType="event"
            title={event.title_ar}
            className="justify-center"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onViewDetails(event)} className="flex-1">
            <Ticket className={`w-4 h-4 ${me('2')}`} />
            {t('details') || 'التفاصيل'}
          </Button>
          <Button 
            onClick={() => onRegister(event)}
            className="flex-1"
            disabled={event.status === 'completed' || isEventFull}
          >
             {isEventFull ? 
               (t('full') || 'ممتلئ') :
               event.status === 'completed' ?
               (t('ended') || 'انتهى') :
               (t('register') || 'تسجيل')
             }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};