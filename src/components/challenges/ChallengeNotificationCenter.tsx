import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  Users, 
  Trophy, 
  Target, 
  MessageSquare, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Star,
  TrendingUp,
  X
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { getNotificationTypeMapping } from '@/config/challengesPageConfig';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

interface ChallengeNotification {
  id: string;
  challenge_id: string;
  recipient_id: string;
  sender_id?: string;
  notification_type: string;
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, unknown>;
  challenge?: {
    title_ar: string;
    image_url?: string;
  };
}

interface ChallengeNotificationCenterProps {
  className?: string;
}

export const ChallengeNotificationCenter = ({ 
  className = "" 
}: ChallengeNotificationCenterProps) => {
  const { isRTL } = useDirection();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ChallengeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      
      // Subscribe to real-time notifications
      const channel = supabase
        .channel('challenge-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'challenge_notifications',
            filter: `recipient_id=eq.${user.id}`
          },
          (payload) => {
            // New notification received
            const newNotification = payload.new as ChallengeNotification;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('challenge_notifications')
        .select(`
          *,
          challenge:challenges(title_ar, image_url)
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications((data || []).map(item => ({
        ...item,
        metadata: (item.metadata as Record<string, unknown>) || {}
      })) as ChallengeNotification[]);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      logger.error('Error loading notifications', { 
        component: 'ChallengeNotificationCenter', 
        action: 'loadNotifications',
        userId: user?.id
      }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('challenge_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      logger.error('Error marking notification as read', { 
        component: 'ChallengeNotificationCenter', 
        action: 'markAsRead',
        data: { notificationId }
      }, error as Error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('challenge_notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      logger.error('Error marking all as read', { 
        component: 'ChallengeNotificationCenter', 
        action: 'markAllAsRead',
        userId: user?.id
      }, error as Error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const mapping = getNotificationTypeMapping(type);
    const IconComponent = mapping.icon;
    return <IconComponent className={`w-4 h-4 ${mapping.color}`} />;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return isRTL ? 'الآن' : 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}${isRTL ? ' د' : 'm'}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}${isRTL ? ' س' : 'h'}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}${isRTL ? ' ي' : 'd'}`;
  };

  const NotificationItem = ({ notification }: { notification: ChallengeNotification }) => (
    <Card 
      className={cn(
        "mb-3 transition-all duration-200 hover:shadow-md cursor-pointer",
        !notification.is_read && "border-l-4 border-l-primary bg-primary/5"
      )}
      onClick={() => !notification.is_read && markAsRead(notification.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.notification_type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={cn(
                "text-sm font-medium truncate",
                !notification.is_read && "font-semibold"
              )}>
                {notification.title}
              </h4>
              {!notification.is_read && (
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {notification.message}
            </p>
            
            {notification.challenge && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Target className="w-3 h-3" />
                <span className="truncate">{notification.challenge.title_ar}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(notification.created_at)}
            </span>
            
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
                <CheckCircle2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("relative", className)}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs animate-pulse"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {isRTL ? 'إشعارات التحديات' : 'Challenge Notifications'}
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount}</Badge>
              )}
            </SheetTitle>
            
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                {isRTL ? 'تمييز الكل كمقروء' : 'Mark all read'}
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="mt-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-4 h-4 bg-muted rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {isRTL ? 'لا توجد إشعارات' : 'No notifications'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'ستظهر إشعارات التحديات هنا' : 'Challenge notifications will appear here'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};