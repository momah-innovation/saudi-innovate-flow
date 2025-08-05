import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, BellRing, X, Check, Eye, Heart, MessageSquare, 
  Star, Award, Lightbulb, AlertCircle, Info, CheckCircle,
  Clock, RefreshCw, Settings, Filter
} from 'lucide-react';

interface IdeaNotification {
  id: string;
  idea_id: string;
  recipient_id: string;
  sender_id?: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  metadata?: any;
  created_at: string;
  sender_profile?: {
    name: string;
    name_ar: string;
    profile_image_url?: string;
  };
  idea?: {
    title_ar: string;
  };
}

interface IdeaNotificationCenterProps {
  className?: string;
}

export function IdeaNotificationCenter({ className }: IdeaNotificationCenterProps) {
  const { user } = useAuth();
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<IdeaNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadNotifications();
      setupRealtimeSubscription();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('idea_notifications')
        .select(`
          *,
          ideas!idea_notifications_idea_id_fkey(title_ar)
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch sender profiles
      const notificationsWithProfiles = await Promise.all(
        (data || []).map(async (notification) => {
          if (notification.sender_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, name_ar, profile_image_url')
              .eq('id', notification.sender_id)
              .single();
            
            return { ...notification, sender_profile: profile };
          }
          return notification;
        })
      );

      setNotifications(notificationsWithProfiles);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: 'خطأ في تحميل الإشعارات',
        description: 'حدث خطأ أثناء تحميل الإشعارات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('idea-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'idea_notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as IdeaNotification;
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast for new notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('idea_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
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
        .from('idea_notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );

      toast({
        title: 'تم وضع علامة "مقروء" على جميع الإشعارات',
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('idea_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'evaluation':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'assignment':
        return <Award className="w-4 h-4 text-purple-500" />;
      case 'feature':
        return <Lightbulb className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case 'status_change': return 'تغيير الحالة';
      case 'comment': return 'تعليق جديد';
      case 'like': return 'إعجاب';
      case 'evaluation': return 'تقييم';
      case 'assignment': return 'تكليف';
      case 'feature': return 'فكرة مميزة';
      default: return 'إشعار';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعة`;
    return `${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.is_read) return false;
    if (filter === 'read' && !notification.is_read) return false;
    if (typeFilter !== 'all' && notification.notification_type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className={cn("absolute -top-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs", end("-2"))}
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">الإشعارات</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={loadNotifications}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 pt-2">
          <div className="flex rounded-lg border p-1">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              الكل
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              غير مقروء ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              مقروء
            </Button>
          </div>
          
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-1 text-sm border rounded-md bg-background"
          >
            <option value="all">جميع الأنواع</option>
            <option value="status_change">تغيير الحالة</option>
            <option value="comment">التعليقات</option>
            <option value="like">الإعجابات</option>
            <option value="evaluation">التقييمات</option>
            <option value="assignment">التكليفات</option>
            <option value="feature">الأفكار المميزة</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-start gap-3 p-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد إشعارات</p>
              {filter !== 'all' && (
                <Button variant="link" onClick={() => setFilter('all')}>
                  عرض جميع الإشعارات
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-muted/30 transition-colors ${
                    !notification.is_read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {notification.sender_profile?.profile_image_url ? (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={notification.sender_profile.profile_image_url} />
                          <AvatarFallback>
                            {(notification.sender_profile.name_ar || notification.sender_profile.name)?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          
                          {notification.idea?.title_ar && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {notification.idea.title_ar}
                            </Badge>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {getNotificationTypeText(notification.notification_type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}