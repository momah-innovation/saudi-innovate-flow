import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTimerManager } from '@/utils/timerManager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Bookmark, 
  Folder, 
  Share2, 
  Heart,
  Check,
  X,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface SavedNotification {
  id: string;
  type: 'bookmark_added' | 'collection_shared' | 'item_liked' | 'reminder' | 'collaboration';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  data?: any;
  priority: 'low' | 'medium' | 'high';
}

interface SavedNotificationCenterProps {
  className?: string;
}

export const SavedNotificationCenter = ({ className }: SavedNotificationCenterProps) => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<SavedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    // Set up real-time updates with managed timer
    const { setInterval: scheduleInterval } = useTimerManager();
    const clearTimer = scheduleInterval(() => {
      checkForNewNotifications();
    }, 30000); // Check every 30 seconds

    return clearTimer;
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Simulate loading notifications - in real app this would come from API
      const mockNotifications: SavedNotification[] = [
        {
          id: '1',
          type: 'bookmark_added',
          title: isRTL ? 'تم إضافة عنصر جديد' : 'New Item Bookmarked',
          message: isRTL ? 'تم حفظ "مؤتمر الابتكار الرقمي" في مجموعة الفعاليات' : 'Digital Innovation Conference saved to Events collection',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
          isRead: false,
          priority: 'medium',
          data: { itemType: 'event', itemId: '123' }
        },
        {
          id: '2',
          type: 'collection_shared',
          title: isRTL ? 'تمت مشاركة مجموعة' : 'Collection Shared',
          message: isRTL ? 'شارك أحمد المحمد مجموعة "التحديات التقنية" معك' : 'Ahmed Al-Mohammed shared "Tech Challenges" collection with you',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
          isRead: false,
          priority: 'high',
          data: { collectionId: '456', sharedBy: 'Ahmed Al-Mohammed' }
        },
        {
          id: '3',
          type: 'item_liked',
          title: isRTL ? 'إعجاب بعنصر' : 'Item Liked',
          message: isRTL ? 'أعجبت فاطمة العلي بفكرة "نظام إدارة الطاقة الذكي"' : 'Fatima Al-Ali liked your idea "Smart Energy Management System"',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
          isRead: true,
          priority: 'low',
          data: { itemType: 'idea', itemId: '789', likedBy: 'Fatima Al-Ali' }
        },
        {
          id: '4',
          type: 'reminder',
          title: isRTL ? 'تذكير موعد' : 'Reminder Due',
          message: isRTL ? 'موعد انتهاء تسجيل "ورشة ريادة الأعمال" غداً' : 'Registration deadline for "Entrepreneurship Workshop" is tomorrow',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
          isRead: false,
          priority: 'high',
          data: { itemType: 'event', itemId: '321', reminderType: 'deadline' }
        },
        {
          id: '5',
          type: 'collaboration',
          title: isRTL ? 'دعوة للتعاون' : 'Collaboration Invite',
          message: isRTL ? 'دعاك محمد السعود للتعاون في مشروع "الذكاء الاصطناعي في التعليم"' : 'Mohammed Al-Saud invited you to collaborate on "AI in Education" project',
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
          isRead: true,
          priority: 'medium',
          data: { projectId: '654', invitedBy: 'Mohammed Al-Saud' }
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      logger.error('Error loading notifications', { component: 'SavedNotificationCenter', action: 'fetchNotifications' }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const checkForNewNotifications = async () => {
    // Simulate checking for new notifications
    const randomNew = Math.random() > 0.7; // 30% chance of new notification
    
    if (randomNew) {
      const newNotification: SavedNotification = {
        id: Date.now().toString(),
        type: 'bookmark_added',
        title: isRTL ? 'تم إضافة عنصر جديد' : 'New Item Added',
        message: isRTL ? 'تم حفظ عنصر جديد في مجموعاتك' : 'A new item was saved to your collections',
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: 'medium'
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      toast({
        title: newNotification.title,
        description: newNotification.message,
        duration: 3000,
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast({
      title: isRTL ? 'تم وضع علامة قراءة على جميع الإشعارات' : 'All notifications marked as read',
      duration: 2000,
    });
  };

  const removeNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: SavedNotification['type']) => {
    switch (type) {
      case 'bookmark_added':
        return <Bookmark className="w-4 h-4 text-blue-500" />;
      case 'collection_shared':
        return <Share2 className="w-4 h-4 text-green-500" />;
      case 'item_liked':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'collaboration':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: SavedNotification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);

    if (diffInMinutes < 1) {
      return isRTL ? 'الآن' : 'Just now';
    } else if (diffInMinutes < 60) {
      return isRTL ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return isRTL ? `منذ ${hours} ساعة` : `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return isRTL ? `منذ ${days} يوم` : `${days}d ago`;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {isRTL ? 'الإشعارات' : 'Notifications'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {isRTL ? 'الإشعارات' : 'Notifications'}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              {isRTL ? 'قراءة الكل' : 'Mark all read'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="p-4 space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{isRTL ? 'لا توجد إشعارات' : 'No notifications'}</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border-l-4 transition-colors cursor-pointer",
                      getPriorityColor(notification.priority),
                      !notification.isRead ? "bg-blue-50 dark:bg-blue-950/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-sm font-medium",
                          !notification.isRead && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="w-6 h-6 p-0 hover:bg-red-100 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      {notification.priority === 'high' && (
                        <div className="flex items-center gap-1 mt-2">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-600 font-medium">
                            {isRTL ? 'أولوية عالية' : 'High Priority'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-2" />}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};