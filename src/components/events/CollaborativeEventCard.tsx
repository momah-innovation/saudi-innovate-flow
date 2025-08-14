import React, { useState, useEffect } from 'react';
import { useTimerManager } from '@/utils/timerManager';
import { debugLog } from '@/utils/debugLogger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { 
  CalendarIcon, MapPin, Users, Clock, Bookmark, 
  Ticket, Star, Heart, Eye, Share2, Video,
  Globe, MapPinIcon, BookmarkIcon, MessageSquare,
  Wifi, WifiOff, Activity
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { useEventState } from '@/hooks/useEventState';

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

interface CollaborativeEventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onStartCollaboration?: (event: Event) => void;
  viewMode?: 'cards' | 'list' | 'grid';
  isBookmarked?: boolean;
  showCollaboration?: boolean;
}

export const CollaborativeEventCard = ({ 
  event, 
  onViewDetails, 
  onStartCollaboration,
  viewMode = 'cards',
  isBookmarked = false,
  showCollaboration = true
}: CollaborativeEventCardProps) => {
  const { setInterval: scheduleInterval } = useTimerManager();
  const { isRTL } = useDirection();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [liveParticipants, setLiveParticipants] = useState(event.registered_participants);
  
  // Collaboration integration
  const { 
    onlineUsers, 
    isConnected, 
    activities,
    startCollaboration,
    endCollaboration 
  } = useCollaboration();
  
  // Use unified event state management
  const {
    isRegistered,
    participantCount,
    loading,
    userParticipation,
    registerForEvent,
    cancelRegistration
  } = useEventState(event?.id || null);

  // Get users currently viewing this event
  const eventViewers = onlineUsers.filter(user => 
    user.current_location.page?.includes('event') || user.current_location.entity_type === 'event'
  );

  const recentActivity = activities
    .filter(activity => 
      activity.entity_type === 'event' && 
      activity.entity_id === event.id
    )
    .slice(0, 3);

  useEffect(() => {
    // Update live participants based on real data
    setLiveParticipants(participantCount);
  }, [participantCount]);

  useEffect(() => {
    // Simulate real-time updates for demo
    const cleanup = scheduleInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of update
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        setLiveParticipants(prev => Math.max(0, prev + variation));
      }
    }, 45000); // Update every 45 seconds

    return cleanup;
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'scheduled': return 'status-scheduled';
      case 'ongoing': return 'status-active';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'pending': return 'status-pending';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getEventTypeClass = (type: string) => {
    switch (type) {
      case 'workshop': return 'event-workshop';
      case 'conference': return 'event-conference';
      case 'webinar': return 'event-webinar';
      case 'meetup': return 'event-meetup';
      case 'hackathon': return 'event-hackathon';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'scheduled': return isRTL ? 'قادم' : 'Upcoming';
      case 'ongoing': return isRTL ? 'جاري' : 'Ongoing';
      case 'completed': return isRTL ? 'مكتمل' : 'Completed';
      case 'cancelled': return isRTL ? 'ملغي' : 'Cancelled';
      default: return status;
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
    return Math.min((liveParticipants / event.max_participants) * 100, 100);
  };

  const isEventFull = event.max_participants && liveParticipants >= event.max_participants;
  const isEventSoon = () => {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

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

  const handleBookmark = async () => {
    try {
      setBookmarked(!bookmarked);
    } catch (error) {
      debugLog.error('Failed to toggle bookmark:', error);
    }
  };

  const handleStartCollaboration = async () => {
    try {
      await startCollaboration('event', event.id);
      onStartCollaboration?.(event);
    } catch (error) {
      debugLog.error('Failed to start collaboration:', error);
    }
  };

  const handleRegistrationAction = async () => {
    if (isEventPast()) {
      if (isRegistered) {
        onViewDetails(event);
      }
      return;
    }
    
    await handleRegistrationToggle();
  };

  const getButtonVariant = () => {
    if (isEventPast() && isRegistered) {
      return "secondary";
    }
    if (isEventPast() || event.status === 'completed') {
      return "outline";
    }
    return isRegistered ? "destructive" : "primary";
  };

  const isEventPast = () => {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    return eventDate < now;
  };

  const getRegistrationButtonText = () => {
    if (isEventPast()) {
      if (isRegistered) {
        return isRTL ? 'تم الحضور' : 'Attended';
      } else {
        return isRTL ? 'انتهت الفعالية' : 'Event Ended';
      }
    }
    
    if (isEventFull) return isRTL ? 'ممتلئ' : 'Full';
    if (event.status === 'completed') return isRTL ? 'انتهى' : 'Ended';
    if (isRegistered) return isRTL ? 'إلغاء التسجيل' : 'Cancel Registration';
    return isRTL ? 'تسجيل' : 'Register';
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-300 hover-scale animate-fade-in cursor-pointer" onClick={() => onViewDetails(event)}>
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
              
              {/* Collaboration Status */}
              {showCollaboration && (
                <div className="absolute -top-1 -right-1">
                  <Badge variant="secondary" className="text-xs px-1 py-0.5">
                    {isConnected ? (
                      <Wifi className="w-3 h-3 text-green-500" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-gray-500" />
                    )}
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
                      <Badge className="bg-warning text-warning-foreground border-warning-border text-xs">
                        {isRTL ? 'قريباً' : 'Soon'}
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
                      <span className="truncate">{event.location || (event.format === 'virtual' ? (isRTL ? 'عبر الإنترنت' : 'Online') : 'TBD')}</span>
                    </div>
                    {showCollaboration && eventViewers.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-primary" />
                        <span className="text-primary font-medium">{eventViewers.length} متصل</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <Badge className={getStatusClass(event.status)}>
                      {getStatusText(event.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon-sm" onClick={handleBookmark}>
                      <BookmarkIcon className={`w-4 h-4 ${bookmarked ? 'fill-current text-primary' : ''}`} />
                    </Button>
                    {showCollaboration && (
                      <Button variant="ghost" size="icon-sm" onClick={handleStartCollaboration}>
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      variant={getButtonVariant()}
                      size="sm" 
                      onClick={handleRegistrationAction}
                      disabled={loading || (isEventFull && !isRegistered) || (isEventPast() && !isRegistered)}
                    >
                      {loading ? (isRTL ? 'جاري التحديث...' : 'Updating...') : getRegistrationButtonText()}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Live Registration Progress */}
              {event.max_participants && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>
                      {liveParticipants}/{event.max_participants} {isRTL ? 'مسجل' : 'registered'}
                      {liveParticipants !== event.registered_participants && (
                        <span className="text-primary ml-1">📈</span>
                      )}
                    </span>
                    <span>{Math.round(getRegistrationPercentage())}%</span>
                  </div>
                  <Progress value={getRegistrationPercentage()} className="h-1.5" />
                </div>
              )}

              {/* Recent Activity */}
              {showCollaboration && recentActivity.length > 0 && (
                <div className="mt-2 p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="w-3 h-3" />
                    <span>{isRTL ? 'نشاط حديث:' : 'Recent activity:'}</span>
                    <span className="text-primary">
                      {recentActivity[0].event_type} {isRTL ? 'منذ' : ''} {
                        Math.floor((Date.now() - new Date(recentActivity[0].created_at).getTime()) / (1000 * 60))
                      } {isRTL ? 'دقيقة' : 'min ago'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in overflow-hidden cursor-pointer" onClick={() => onViewDetails(event)}>
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
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={getStatusClass(event.status)}>
            {getStatusText(event.status)}
          </Badge>
          {event.format === 'virtual' && (
            <Badge variant="secondary" className="overlay-secondary">
              <Globe className="w-3 h-3 mr-1" />
              {isRTL ? 'عبر الإنترنت' : 'Online'}
            </Badge>
          )}
          {isEventSoon() && (
            <Badge className="bg-warning text-warning-foreground border-warning-border">
              {isRTL ? 'قريباً' : 'Soon'}
            </Badge>
          )}
        </div>

        {/* Collaboration Status & Live Viewers */}
        {showCollaboration && (
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Connection Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 flex items-center gap-1">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs text-white">{eventViewers.length}</span>
            </div>
            
            {/* Active Viewers */}
            {eventViewers.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex -space-x-1">
                  {eventViewers.slice(0, 3).map((user, index) => (
                    <Avatar key={index} className="w-6 h-6 border-2 border-white">
                      <AvatarImage src={user.user_info.avatar_url} />
                      <AvatarFallback className="text-xs bg-primary text-white">
                        {user.user_id?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {eventViewers.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-white/90 border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-700 font-bold">+{eventViewers.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="secondary"
            size="sm"
            className="overlay-primary"
            onClick={handleBookmark}
          >
            <BookmarkIcon className={`w-4 h-4 ${bookmarked ? 'fill-current text-primary' : ''}`} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="overlay-primary"
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current text-destructive' : ''}`} />
          </Button>
          {showCollaboration && (
            <Button
              variant="secondary"
              size="sm"
              className="overlay-primary"
              onClick={handleStartCollaboration}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-background/95 border border-border rounded-lg p-2 text-center min-w-[3rem]">
            <div className="text-xs font-medium text-muted-foreground">
              {new Date(event.event_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short' })}
            </div>
            <div className="text-lg font-bold text-foreground">
              {new Date(event.event_date).getDate()}
            </div>
          </div>
        </div>

        {/* Live Participant Count */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-background/95 border border-border rounded-lg p-2 text-center min-w-[3rem]">
            <div className="text-xs font-medium text-muted-foreground">
              {isRTL ? 'مسجل' : 'Registered'}
            </div>
            <div className={`text-sm font-bold ${liveParticipants !== event.registered_participants ? 'text-primary' : 'text-foreground'}`}>
              {liveParticipants}
              {liveParticipants !== event.registered_participants && (
                <span className="text-xs ml-1">📈</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-3">
              <Badge className={getEventTypeClass(event.event_type)}>
                {event.event_type}
              </Badge>
            </div>
            <CardTitle className="text-lg line-clamp-2 mb-3">
              {event.title_ar}
            </CardTitle>
          </div>
        </div>

        {/* Event Meta */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{event.start_time || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4" />
            <span className="flex-1">{event.location || (event.format === 'virtual' ? (isRTL ? 'عبر الإنترنت' : 'Online') : 'TBD')}</span>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        {showCollaboration && recentActivity.length > 0 && (
          <div className="mt-3 p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{isRTL ? 'نشاط حديث' : 'Recent Activity'}</span>
            </div>
            <div className="space-y-1">
              {recentActivity.slice(0, 2).map((activity, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {activity.event_type} • {
                    Math.floor((Date.now() - new Date(activity.created_at).getTime()) / (1000 * 60))
                  } {isRTL ? 'دقيقة مضت' : 'min ago'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Registration Progress */}
        {event.max_participants && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>
                {liveParticipants}/{event.max_participants} {isRTL ? 'مسجل' : 'registered'}
                {liveParticipants !== event.registered_participants && (
                  <span className="text-primary ml-1">📈</span>
                )}
              </span>
              <span>{Math.round(getRegistrationPercentage())}%</span>
            </div>
            <Progress value={getRegistrationPercentage()} className="h-1.5" />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0 px-4 pb-4">
        {/* Compact Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className={liveParticipants !== event.registered_participants ? 'text-primary font-medium' : ''}>
              {liveParticipants} {isRTL ? 'مسجل' : 'registered'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Ticket className="w-4 h-4" />
            <span>{event.budget ? `${event.budget.toLocaleString()} ${isRTL ? 'ر.س' : 'SAR'}` : (isRTL ? 'مجاني' : 'Free')}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(event)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isRTL ? 'التفاصيل' : 'Details'}
          </Button>
          <Button 
            variant={getButtonVariant()}
            onClick={handleRegistrationAction}
            className="flex-1 h-9"
            disabled={loading || (isEventFull && !isRegistered) || (isEventPast() && !isRegistered)}
          >
            {loading ? (isRTL ? 'جاري التحديث...' : 'Updating...') : getRegistrationButtonText()}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};