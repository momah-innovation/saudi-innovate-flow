import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users,
  Target,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { useAuth } from '@/contexts/AuthContext';

interface StatisticsNotification {
  id: string;
  type: 'report_generated' | 'threshold_reached' | 'data_updated' | 'alert' | 'milestone';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  metadata?: {
    reportId?: string;
    value?: number;
    threshold?: number;
  };
}

interface StatisticsNotificationCenterProps {
  className?: string;
}

export const StatisticsNotificationCenter = ({ 
  className = "" 
}: StatisticsNotificationCenterProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<StatisticsNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Set up real-time subscription for new notifications
      const channel = supabase
        .channel('statistics-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'statistics_notifications'
          },
          (payload) => {
            // New statistics notification received
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Mock notifications for now - in real app would fetch from backend
      const mockNotifications: StatisticsNotification[] = [
        {
          id: '1',
          type: 'report_generated',
          title: t('statistics:notifications.types.report_generated.title'),
          message: t('statistics:notifications.types.report_generated.message'),
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
          priority: 'high',
          metadata: { reportId: 'monthly-2024-01' }
        },
        {
          id: '2',
          type: 'threshold_reached',
          title: t('statistics:notifications.types.threshold_reached.title'),
          message: t('statistics:notifications.types.threshold_reached.message'),
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
          priority: 'medium',
          metadata: { value: 1024, threshold: 1000 }
        },
        {
          id: '3',
          type: 'data_updated',
          title: t('statistics:notifications.types.data_updated.title'),
          message: t('statistics:notifications.types.data_updated.message'),
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: true,
          priority: 'low'
        },
        {
          id: '4',
          type: 'milestone',
          title: t('statistics:notifications.types.milestone.title'),
          message: t('statistics:notifications.types.milestone.message'),
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'high'
        },
        {
          id: '5',
          type: 'alert',
          title: t('statistics:notifications.types.alert.title'),
          message: t('statistics:notifications.types.alert.message'),
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: 'medium'
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      logger.error('Failed to load statistics notifications', { 
        component: 'StatisticsNotificationCenter', 
        action: 'loadNotifications',
        userId: user.id 
      }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Update in backend (mock for now)
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      logger.error('Failed to mark notification as read', { 
        component: 'StatisticsNotificationCenter', 
        action: 'markAsRead',
        notificationId 
      }, error as Error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update all in backend (mock for now)
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      logger.error('Failed to mark all notifications as read', { 
        component: 'StatisticsNotificationCenter', 
        action: 'markAllAsRead',
        userId: user?.id 
      }, error as Error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'report_generated':
        return <BarChart3 className="w-4 h-4" />;
      case 'threshold_reached':
        return <TrendingUp className="w-4 h-4" />;
      case 'data_updated':
        return <Activity className="w-4 h-4" />;
      case 'milestone':
        return <Target className="w-4 h-4" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'report_generated':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'threshold_reached':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'data_updated':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'milestone':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'alert':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return t('statistics:notifications.time_ago.now');
    } else if (diffInMinutes < 60) {
      return t('statistics:notifications.time_ago.minutes_ago', { count: diffInMinutes });
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return t('statistics:notifications.time_ago.hours_ago', { count: hours });
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return t('statistics:notifications.time_ago.days_ago', { count: days });
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={`relative ${className}`}>
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t('statistics:notifications.title')}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                {t('statistics:notifications.mark_all_read')}
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('statistics:notifications.no_notifications')}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-muted/30' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          
                          {notification.metadata && (
                            <div className="flex items-center gap-2">
                              {notification.metadata.value && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.metadata.value}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
