import { useState } from 'react';
import { Bell, X, Check, Clock, Calendar, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useDirection } from '@/components/ui/direction-provider';
import { useEventNotifications } from '@/hooks/useEventNotifications';
import { cn } from '@/lib/utils';

export const EventNotificationCenter = () => {
  const { isRTL } = useDirection();
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useEventNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_reminder': return <Calendar className="w-4 h-4" />;
      case 'event_update': return <AlertCircle className="w-4 h-4" />;
      case 'registration_confirmed': return <Check className="w-4 h-4" />;
      case 'event_cancelled': return <X className="w-4 h-4" />;
      case 'new_participant': return <Users className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'event_reminder': return 'text-blue-500';
      case 'event_update': return 'text-orange-500';
      case 'registration_confirmed': return 'text-green-500';
      case 'event_cancelled': return 'text-red-500';
      case 'new_participant': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return isRTL ? 'منذ قليل' : 'Just now';
    if (diffInHours < 24) return isRTL ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return isRTL ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`;
    
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {isRTL ? 'التنبيهات' : 'Notifications'}
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount}</Badge>
              )}
            </div>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                {isRTL ? 'تحديد الكل كمقروء' : 'Mark all read'}
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isRTL ? 'لا توجد تنبيهات' : 'No notifications'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <Card 
                    key={notification.id}
                    className={cn(
                      "transition-all duration-200 hover:shadow-md cursor-pointer",
                      !notification.is_read && "bg-primary/5 border-primary/20"
                    )}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg flex-shrink-0",
                          notification.is_read ? "bg-muted" : "bg-primary/10"
                        )}>
                          <div className={getNotificationColor(notification.type)}>
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={cn(
                                "text-sm font-medium line-clamp-1",
                                !notification.is_read && "font-semibold"
                              )}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {formatTimeAgo(notification.created_at)}
                                </div>
                                {!notification.is_read && (
                                  <Badge variant="secondary" className="text-xs">
                                    {isRTL ? 'جديد' : 'New'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-1">
                              {!notification.is_read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};