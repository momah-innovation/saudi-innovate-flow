import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Check, CheckCircle2, AlertTriangle, Info, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSystemSettings } from '@/contexts/SystemSettingsContext';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useResponsiveSidebar } from "@/contexts/ResponsiveSidebarContext";
import { useDirection } from "@/components/ui/direction-provider";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  metadata?: any;
  created_at: string;
}

export function ResponsiveNotificationCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { notificationFetchLimit } = useSystemSettings();
  const { showNotifications, setShowNotifications, sidePosition, isRTL } = useResponsiveSidebar();
  const { language } = useDirection();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Set up real-time subscription for new notifications
      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show toast for new notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
              variant: newNotification.type === 'error' ? 'destructive' : 'default',
            });
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, toast]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(notificationFetchLimit);

      if (error) throw error;
      setNotifications((data || []).map(item => ({
        ...item,
        type: item.type as 'info' | 'success' | 'warning' | 'error'
      })));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error': return <X className="h-4 w-4 text-destructive" />;
      default: return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-success';
      case 'warning': return 'border-l-warning';
      case 'error': return 'border-l-destructive';
      default: return 'border-l-info';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read first
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate to relevant page based on notification metadata
    if (notification.metadata) {
      const { role_request_id, challenge_id, expert_assignment_id, requester_id } = notification.metadata;
      
      if (role_request_id) {
        if (requester_id === user?.id) {
          navigate(`/profile/${user.id}`);
        } else {
          navigate('/admin/users');
        }
        setShowNotifications(false);
      } else if (challenge_id) {
        navigate(`/challenges/${challenge_id}`);
        setShowNotifications(false);
      } else if (expert_assignment_id) {
        navigate('/expert-assignments');
        setShowNotifications(false);
      }
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return language === 'ar' ? 'الآن' : 'Just now';
    if (diffInHours < 24) return language === 'ar' ? `منذ ${diffInHours} ساعات` : `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return language === 'ar' ? `منذ ${diffInDays} أيام` : `${diffInDays}d ago`;
    
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getTitle = () => language === 'ar' ? 'الإشعارات' : 'Notifications';
  const getMarkAllReadText = () => language === 'ar' ? 'تمييز الكل كمقروء' : 'Mark all read';
  const getNoNotificationsText = () => language === 'ar' ? 'لا توجد إشعارات بعد' : 'No notifications yet';

  return (
    <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-foreground hover:bg-muted transition-colors duration-200"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-warning text-warning-foreground animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent 
        side={sidePosition}
        className={cn(
          "w-[400px] sm:w-[540px] bg-background border-border",
          "data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right"
        )}
      >
        <SheetHeader>
          <SheetTitle className={cn(
            "flex items-center justify-between",
            isRTL && "flex-row-reverse"
          )}>
            <div className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <Bell className="w-5 h-5" />
              <span className={isRTL ? "font-arabic" : "font-english"}>
                {getTitle()}
              </span>
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
                className="text-sm"
              >
                {getMarkAllReadText()}
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
              <p className="text-muted-foreground">{getNoNotificationsText()}</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <Card 
                    key={notification.id}
                    className={cn(
                      "transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 hover-scale",
                      getNotificationColor(notification.type),
                      notification.is_read ? 'bg-muted/30' : 'bg-primary/5 border-primary/20'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className={cn(
                        "flex items-start gap-3",
                        isRTL && "flex-row-reverse"
                      )}>
                        <div className={cn(
                          "p-2 rounded-lg flex-shrink-0 transition-colors duration-200",
                          notification.is_read ? "bg-muted" : "bg-primary/10"
                        )}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "flex items-start justify-between gap-2",
                            isRTL && "flex-row-reverse"
                          )}>
                            <div className={cn("flex-1", isRTL && "text-right")}>
                              <h4 className={cn(
                                "text-sm line-clamp-1 transition-all duration-200",
                                !notification.is_read && "font-semibold",
                                isRTL && "font-arabic"
                              )}>
                                {notification.title}
                              </h4>
                              <p className={cn(
                                "text-sm text-muted-foreground line-clamp-2 mt-1",
                                isRTL && "text-right font-arabic"
                              )}>
                                {notification.message}
                              </p>
                              <div className={cn(
                                "flex items-center gap-2 mt-2",
                                isRTL && "flex-row-reverse"
                              )}>
                                <div className={cn(
                                  "flex items-center gap-1 text-xs text-muted-foreground",
                                  isRTL && "flex-row-reverse"
                                )}>
                                  <Clock className="w-3 h-3" />
                                  <span className={isRTL ? "font-arabic" : ""}>
                                    {formatTimeAgo(notification.created_at)}
                                  </span>
                                </div>
                                {!notification.is_read && (
                                  <Badge variant="secondary" className="text-xs">
                                    {language === 'ar' ? 'جديد' : 'New'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className={cn(
                              "flex gap-1",
                              isRTL && "flex-row-reverse"
                            )}>
                              {!notification.is_read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover-scale"
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
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover-scale"
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
}