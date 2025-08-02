import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { 
  Bell, 
  Check, 
  X, 
  Eye, 
  ExternalLink,
  Calendar,
  MessageSquare,
  Heart,
  Share,
  UserPlus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  opportunity_id: string;
  notification_type: string;
  title: string;
  message: string;
  action_url?: string;
  metadata: any;
  is_read: boolean;
  created_at: string;
}

interface OpportunityNotificationsPanelProps {
  opportunityId?: string; // Optional - if provided, shows only notifications for this opportunity
  className?: string;
}

export const OpportunityNotificationsPanel = ({ 
  opportunityId, 
  className 
}: OpportunityNotificationsPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Set up real-time subscription
      const channel = supabase
        .channel('opportunity-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'opportunity_notifications',
            filter: `recipient_id=eq.${user.id}`
          },
          (payload) => {
            // New notification received
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, opportunityId]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('opportunity_notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (opportunityId) {
        query = query.eq('opportunity_id', opportunityId);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      // Failed to load notifications
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحميل الإشعارات' : 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('opportunity_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('recipient_id', user?.id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      // Failed to mark as read
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث الإشعار' : 'Failed to update notification',
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('opportunity_notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);

      toast({
        title: isRTL ? 'تم تحديث الإشعارات' : 'Notifications Updated',
        description: isRTL ? 'تم تحديد جميع الإشعارات كمقروءة' : 'All notifications marked as read',
      });
    } catch (error) {
      // Failed to mark all as read
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث الإشعارات' : 'Failed to update notifications',
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_received':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'application_status_change':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'new_comment':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'new_like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'new_share':
        return <Share className="w-4 h-4 text-blue-400" />;
      case 'status_change':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return isRTL ? 'الآن' : 'now';
    if (diffInMinutes < 60) return isRTL ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return isRTL ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return isRTL ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    if (notification.action_url) {
      window.open(notification.action_url, '_blank');
    }
  };

  if (!user) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {isRTL ? 'الإشعارات' : 'Notifications'}
            {unreadCount > 0 && (
              <Badge variant="destructive" className={isRTL ? 'mr-2' : 'ml-2'}>
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              <Check className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تحديد الكل كمقروء' : 'Mark All Read'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 p-3 rounded-lg border animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{isRTL ? 'لا توجد إشعارات' : 'No notifications'}</p>
            <p className="text-sm">{isRTL ? 'ستظهر الإشعارات هنا عند وصولها' : 'Notifications will appear here when they arrive'}</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                  !notification.is_read ? 'bg-blue-50/50 border-blue-200' : 'bg-background'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                          {notification.action_url && (
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};