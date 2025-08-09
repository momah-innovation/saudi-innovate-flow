import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { CollaborativeEventCard } from './CollaborativeEventCard';
import { ActivityFeed } from '@/components/collaboration/ActivityFeed';
import { UserPresence } from '@/components/collaboration/UserPresence';
import { CollaborationWidget } from '@/components/collaboration/CollaborationWidget';
import { 
  Users, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Clock,
  Calendar,
  MapPin,
  UserCheck
} from 'lucide-react';

interface EventData {
  id: string;
  title_ar: string;
  description_ar: string;
  event_date: string;
  location: string;
  status: string;
  participants_count?: number;
  max_capacity?: number;
  format: string;
}

interface CollaborativeEventsBrowseProps {
  events: EventData[];
  onEventSelect: (event: EventData) => void;
  viewMode?: 'cards' | 'list' | 'grid';
  activeTab?: string;
}

export const CollaborativeEventsBrowse: React.FC<CollaborativeEventsBrowseProps> = ({
  events,
  onEventSelect,
  viewMode = 'cards',
  activeTab = 'upcoming'
}) => {
  const { onlineUsers, activities, isConnected, startCollaboration } = useCollaboration();
  const [realtimeStats, setRealtimeStats] = useState({
    totalViewers: 0,
    activeRegistrations: 0,
    recentActivity: 0
  });

  // Calculate collaboration stats
  useEffect(() => {
    const browseViewers = onlineUsers.filter(user => 
      user.current_location.page?.includes('/events')
    );
    
    const recentActivities = activities.filter(activity => 
      activity.entity_type === 'event' && 
      Date.now() - new Date(activity.created_at).getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    setRealtimeStats({
      totalViewers: browseViewers.length,
      activeRegistrations: activities.filter(a => 
        a.entity_type === 'event' && a.event_type === 'join'
      ).length,
      recentActivity: recentActivities.length
    });
  }, [onlineUsers, activities]);

  // Start collaboration for events browse
  useEffect(() => {
    if (isConnected) {
      startCollaboration('events', 'browse');
    }
  }, [isConnected, startCollaboration]);

  const renderCollaborationHeader = () => (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">المشاركون النشطون</span>
            </div>
            <UserPresence 
              users={onlineUsers.filter(user => 
                user.current_location.page?.includes('/events')
              )}
              maxVisible={6}
              showStatus={true}
              size="sm"
            />
          </div>

          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">
                      {realtimeStats.totalViewers}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>المتصفحون النشطون</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      {realtimeStats.activeRegistrations}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>التسجيلات النشطة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-600">
                      {realtimeStats.recentActivity}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>النشاط الأخير</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCollaborativeGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <CollaborativeEventCard
          key={event.id}
          event={event as any}
          onViewDetails={(e) => onEventSelect(e as any)}
          onRegister={(e) => onEventSelect(e as any)}
          showCollaboration={true}
        />
      ))}
    </div>
  );

  const renderCollaborativeList = () => (
    <div className="space-y-4">
      {events.map((event) => (
        <CollaborativeEventCard
          key={event.id}
          event={event as any}
          onViewDetails={(e) => onEventSelect(e as any)}
          onRegister={(e) => onEventSelect(e as any)}
          showCollaboration={true}
        />
      ))}
    </div>
  );

  const renderTrendingEvents = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <TrendingUp className="w-5 h-5" />
          <span>الفعاليات الرائجة</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.slice(0, 5).map((event, index) => {
            const viewers = onlineUsers.filter(user => 
              user.current_location.entity_type === 'event' && 
              user.current_location.entity_id === event.id
            );
            
            return (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 cursor-pointer transition-colors"
                   onClick={() => onEventSelect(event)}>
                <div className="flex-1">
                  <p className="text-sm font-medium truncate mb-1">{event.title_ar}</p>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.event_date).toLocaleDateString('ar')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                    <span className="text-xs text-muted-foreground">
                      {viewers.length} متصفح • {event.participants_count || 0} مسجل
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {viewers.length > 0 && (
                    <div className="flex -space-x-1 rtl:space-x-reverse">
                      {viewers.slice(0, 3).map((user, userIndex) => (
                        <Avatar key={userIndex} className="w-5 h-5 border border-background">
                          <AvatarImage src={user.user_info.avatar_url} />
                          <AvatarFallback className="text-xs bg-primary text-white">
                            {user.user_info.display_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {viewers.length > 3 && (
                        <div className="w-5 h-5 rounded-full bg-muted border border-background flex items-center justify-center text-xs font-medium">
                          +{viewers.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {event.format}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const renderUpcomingEvents = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <Clock className="w-5 h-5" />
          <span>الفعاليات القادمة</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events
            .filter(event => new Date(event.event_date) > new Date())
            .slice(0, 3)
            .map((event) => (
              <div key={event.id} className="p-3 rounded-lg border bg-background hover:bg-muted/50 cursor-pointer transition-colors"
                   onClick={() => onEventSelect(event)}>
                <h4 className="font-medium text-sm mb-2 line-clamp-2">{event.title_ar}</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString('ar')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {event.format}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {event.participants_count || 0}/{event.max_capacity || '∞'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">جاري الاتصال بنظام التعاون...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderCollaborationHeader()}
      
      <div className="flex gap-6">
        <div className="flex-1">
          {viewMode === 'grid' && renderCollaborativeGrid()}
          {viewMode === 'cards' && renderCollaborativeGrid()}
          {viewMode === 'list' && renderCollaborativeList()}
          
          {events.length === 0 && (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد فعاليات متاحة</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على فعاليات تطابق المعايير المحددة.
              </p>
            </Card>
          )}
        </div>
        
        <div className="w-80 space-y-6">
          {renderTrendingEvents()}
          {renderUpcomingEvents()}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <MessageSquare className="w-5 h-5" />
                <span>النشاط المباشر</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                scope="all"
                limit={8}
                showFilters={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <CollaborationWidget
        contextType="global"
        contextId="events-browse"
        entityType="events"
        entityId="browse"
        position="bottom-right"
      />
    </div>
  );
};