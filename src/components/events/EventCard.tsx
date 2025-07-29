import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, MapPin, Users, Clock, Bookmark, Share2, Star, Ticket } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface Event {
  id: number;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  location_en: string;
  capacity: number;
  registered: number;
  category: string;
  category_en: string;
  price: string;
  type: string;
  image?: string;
  featured?: boolean;
  online?: boolean;
  organizer?: { name: string; avatar: string; };
  tags?: string[];
}

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onRegister: (event: Event) => void;
  viewMode?: 'cards' | 'list' | 'grid';
}

export const EventCard = ({ event, onViewDetails, onRegister, viewMode = 'cards' }: EventCardProps) => {
  const { isRTL } = useDirection();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'conference': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'seminar': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'networking': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400';
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

  const getAvailabilityPercentage = () => {
    return Math.min((event.registered / event.capacity) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ? 
      date.toLocaleDateString('ar-SA') : 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: !isRTL 
    });
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Event Image */}
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
              {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <CalendarIcon className="w-8 h-8 text-primary" />
              )}
            </div>
            
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold truncate">
                      {isRTL ? event.title : event.title_en}
                    </h3>
                    {event.featured && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                        <Star className="w-3 h-3 mr-1" />
                        {isRTL ? 'مميز' : 'Featured'}
                      </Badge>
                    )}
                    {event.online && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {isRTL ? 'عبر الإنترنت' : 'Online'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {isRTL ? event.description : event.description_en}
                  </p>
                  
                  {/* Quick Info */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{isRTL ? event.location : event.location_en}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{event.registered}/{event.capacity}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status and Actions */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getStatusColor(event.status)}>
                      {getStatusText(event.status)}
                    </Badge>
                    <Badge className={getTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    {event.price && (
                      <span className="text-sm font-semibold text-primary">{event.price}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(event)}>
                      <Ticket className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => onRegister(event)} disabled={event.status === 'completed' || event.registered >= event.capacity}>
                      {isRTL ? 'التسجيل' : 'Register'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in group">
      {/* Event Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg">
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-t-lg" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CalendarIcon className="w-16 h-16 text-primary" />
          </div>
        )}
        
        {/* Status Badge - Overlay */}
        <div className="absolute top-3 right-3 flex gap-2">
          {event.featured && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Star className="w-3 h-3 mr-1" />
              {isRTL ? 'مميز' : 'Featured'}
            </Badge>
          )}
          <Badge className={getStatusColor(event.status)}>
            {getStatusText(event.status)}
          </Badge>
        </div>

        {/* Online Badge */}
        {event.online && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              {isRTL ? 'عبر الإنترنت' : 'Online'}
            </Badge>
          </div>
        )}

        {/* Bookmark Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 left-3 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 line-clamp-2">
              {isRTL ? event.title : event.title_en}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-3">
              {isRTL ? event.description : event.description_en}
            </CardDescription>
          </div>
          <Badge className={getTypeColor(event.type)}>
            {event.type}
          </Badge>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{formatTime(event.startDate)}</span>
          </div>
        </div>

        {/* Organizer */}
        {event.organizer && (
          <div className="flex items-center gap-2 mt-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
              <AvatarFallback className="text-xs">{event.organizer.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{event.organizer.name}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{isRTL ? event.location : event.location_en}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{event.registered}/{event.capacity} {isRTL ? 'مسجل' : 'registered'}</span>
          </div>
          <div className="col-span-2">
            <div className="flex justify-between text-xs mb-1">
              <span>{isRTL ? 'التسجيلات' : 'Registrations'}</span>
              <span>{Math.round(getAvailabilityPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getAvailabilityPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="truncate">
              {isRTL ? event.category : event.category_en}
            </Badge>
            {event.price && (
              <span className="text-sm font-semibold text-primary">{event.price}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(event)}>
              <Ticket className="h-4 w-4 mr-2" />
              {isRTL ? 'التفاصيل' : 'Details'}
            </Button>
            <Button 
              size="sm" 
              onClick={() => onRegister(event)}
              disabled={event.status === 'completed' || event.registered >= event.capacity}
            >
              {isRTL ? 'التسجيل' : 'Register'}
            </Button>
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {event.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{event.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};