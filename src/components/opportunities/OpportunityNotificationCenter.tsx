import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, CheckCircle, Clock, User, FileText } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

export const OpportunityNotificationCenter = () => {
  const { isRTL } = useDirection();
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (open && user) {
      loadNotifications();
    }
  }, [open, user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load real notifications from Supabase
      const { data: opportunityNotifications, error } = await supabase
        .from('opportunity_notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Transform Supabase notifications to our format
      const transformedNotifications: Notification[] = (opportunityNotifications || []).map(notif => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.notification_type as 'application' | 'status_update' | 'deadline' | 'general',
        is_read: notif.is_read,
        created_at: notif.created_at,
      }));

      setNotifications(transformedNotifications);
    } catch (error) {
      // Failed to load notifications - use empty array
      setNotifications([]);
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
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, is_read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application': return <User className="w-5 h-5 text-blue-500" />;
      case 'status_update': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'deadline': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return isRTL ? `منذ ${diffDays} أيام` : `${diffDays} days ago`;
    } else if (diffHrs > 0) {
      return isRTL ? `منذ ${diffHrs} ساعات` : `${diffHrs} hours ago`;
    } else {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return isRTL ? `منذ ${diffMins} دقائق` : `${diffMins} minutes ago`;
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" className="relative" onClick={() => setOpen(true)}>
        <Bell className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        {isRTL ? 'الإشعارات' : 'Notifications'}
        {unreadCount > 0 && (
          <Badge className={`absolute -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs ${isRTL ? '-left-2' : '-right-2'}`}>
            {unreadCount}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {isRTL ? 'الإشعارات' : 'Notifications'}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  {isRTL ? 'تعيين الكل كمقروء' : 'Mark all as read'}
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground text-sm">
                  {isRTL ? 'جاري التحميل...' : 'Loading...'}
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">{isRTL ? 'لا توجد إشعارات' : 'No Notifications'}</h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'ستظهر الإشعارات هنا عند وصولها' : 'Notifications will appear here when they arrive'}
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors ${
                    !notification.is_read ? 'bg-blue-50 dark:bg-blue-950' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};