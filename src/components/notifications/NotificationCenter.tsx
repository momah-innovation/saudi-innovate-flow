import React, { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, CheckCircle2, AlertTriangle, Info, X, MoreVertical, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSystemSettings } from '@/contexts/SystemSettingsContext';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  metadata?: any;
  created_at: string;
}

const NotificationCenter = memo(function NotificationCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { notificationFetchLimit } = useSystemSettings();
  const { t, isRTL } = useUnifiedTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

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
      logger.error('Failed to fetch notifications', { 
        component: 'NotificationCenter', 
        action: 'fetchNotifications',
        userId: user.id 
      }, error as Error);
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
      logger.error('Failed to mark notification as read', { 
        component: 'NotificationCenter', 
        action: 'markAsRead',
        notificationId 
      }, error as Error);
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
      logger.error('Failed to mark all notifications as read', { 
        component: 'NotificationCenter', 
        action: 'markAllAsRead',
        userId: user.id 
      }, error as Error);
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
      logger.error('Failed to delete notification', { 
        component: 'NotificationCenter', 
        action: 'deleteNotification',
        notificationId 
      }, error as Error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500';
      case 'warning': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      default: return 'border-l-blue-500';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read first
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate to relevant page based on notification metadata
    if (notification.metadata) {
      const { role_request_id, challenge_id, expert_assignment_id, requester_id, type } = notification.metadata;
      
      if (role_request_id) {
        // If it's a role request notification for the requester, go to their profile
        // If it's for an admin, go to admin users page
        if (requester_id === user?.id) {
          navigate(`/profile/${user.id}`);
        } else {
          navigate('/admin/users');
        }
        setIsOpen(false);
      } else if (challenge_id) {
        navigate(`/challenges/${challenge_id}`);
        setIsOpen(false);
      } else if (expert_assignment_id) {
        navigate('/expert-assignments');
        setIsOpen(false);
      }
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-accent hover:text-accent-foreground touch-manipulation"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className={cn(
              "absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 text-xs bg-warning text-warning-foreground animate-pulse",
              "min-w-[16px] sm:min-w-[20px] flex items-center justify-center"
            )}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent 
        side={isRTL ? "left" : "right"}
        className={cn(
          "w-[90vw] sm:w-[400px] lg:w-[540px] max-w-[90vw]",
          isRTL && "text-right"
        )}
      >
        <SheetHeader>
          <SheetTitle className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
            isRTL && "sm:flex-row-reverse text-right"
          )}>
            <div className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{t('notifications.title', 'Notifications')}</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">{unreadCount}</Badge>
              )}
            </div>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="h-8 text-xs sm:h-9 sm:text-sm"
              >
                {t('notifications.mark_all_read', 'Mark all read')}
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 sm:mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className={cn(
              "text-center py-8 px-4",
              isRTL && "text-right"
            )}>
              <Bell className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('notifications.empty', 'No notifications yet')}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-10rem)] sm:h-[calc(100vh-8rem)]">
              <div className="space-y-2 px-1">
                {notifications.map((notification) => (
                  <Card 
                    key={notification.id}
                    className={cn(
                      "transition-all duration-200 hover:shadow-md cursor-pointer border-l-4",
                      getNotificationColor(notification.type),
                      notification.is_read ? 'bg-muted/30' : 'bg-primary/5 border-primary/20',
                      "touch-manipulation"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className={cn(
                        "flex items-start gap-2 sm:gap-3",
                        isRTL && "flex-row-reverse"
                      )}>
                        <div className={cn(
                          "p-1.5 sm:p-2 rounded-lg flex-shrink-0",
                          notification.is_read ? "bg-muted" : "bg-primary/10"
                        )}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium line-clamp-1 ${
                                !notification.is_read && "font-semibold"
                              }`}>
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
                                    New
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
});