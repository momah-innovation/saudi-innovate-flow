import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Bell, 
  Star, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Target, 
  Award,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  X
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'urgent' | 'assignment' | 'deadline' | 'achievement' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  relatedId?: string;
}

export const ExpertNotificationCenter = () => {
  const { isRTL } = useDirection();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'urgent',
        title: isRTL ? 'تقييم عاجل مطلوب' : 'Urgent Evaluation Required',
        description: isRTL ? 'فكرة "نظام ذكي للمدن" تحتاج تقييم عاجل - انتهاء المهلة خلال 24 ساعة' : 'Idea "Smart City System" needs urgent evaluation - deadline in 24 hours',
        timestamp: '2024-01-15T10:30:00Z',
        read: false,
        actionRequired: true,
        relatedId: 'idea-123'
      },
      {
        id: '2',
        type: 'assignment',
        title: isRTL ? 'تكليف جديد في قطاع التكنولوجيا' : 'New Assignment in Technology Sector',
        description: isRTL ? 'تم تكليفك بتقييم 5 أفكار جديدة في تحدي "الذكاء الاصطناعي"' : 'You have been assigned 5 new ideas to evaluate in "AI Innovation" challenge',
        timestamp: '2024-01-15T09:15:00Z',
        read: false,
        actionRequired: true,
        relatedId: 'challenge-456'
      },
      {
        id: '3',
        type: 'deadline',
        title: isRTL ? 'تذكير: موعد نهائي قريب' : 'Reminder: Approaching Deadline',
        description: isRTL ? '3 تقييمات تحتاج إنجاز خلال الـ 48 ساعة القادمة' : '3 evaluations need completion within the next 48 hours',
        timestamp: '2024-01-15T08:00:00Z',
        read: true,
        actionRequired: true
      },
      {
        id: '4',
        type: 'achievement',
        title: isRTL ? 'تهانينا! إنجاز جديد' : 'Congratulations! New Achievement',
        description: isRTL ? 'لقد حققت معدل جودة تقييم 9.2/10 هذا الشهر' : 'You achieved 9.2/10 evaluation quality rating this month',
        timestamp: '2024-01-14T16:45:00Z',
        read: false,
        actionRequired: false
      },
      {
        id: '5',
        type: 'system',
        title: isRTL ? 'تحديث النظام' : 'System Update',
        description: isRTL ? 'تم إضافة ميزات جديدة لتحسين تجربة التقييم' : 'New features added to improve evaluation experience',
        timestamp: '2024-01-14T14:20:00Z',
        read: true,
        actionRequired: false
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, [isRTL]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'assignment':
        return <Target className="w-4 h-4 text-blue-500" />;
      case 'deadline':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels = {
      urgent: isRTL ? 'عاجل' : 'Urgent',
      assignment: isRTL ? 'تكليف' : 'Assignment',
      deadline: isRTL ? 'موعد نهائي' : 'Deadline',
      achievement: isRTL ? 'إنجاز' : 'Achievement',
      system: isRTL ? 'النظام' : 'System'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === id);
      return notification && !notification.read ? prev - 1 : prev;
    });
  };

  const getTabNotifications = (type?: string) => {
    switch (type) {
      case 'urgent':
        return notifications.filter(n => n.type === 'urgent' || n.actionRequired);
      case 'assignments':
        return notifications.filter(n => n.type === 'assignment');
      case 'achievements':
        return notifications.filter(n => n.type === 'achievement');
      default:
        return notifications;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return isRTL ? 'منذ دقائق' : 'minutes ago';
    } else if (diffInHours < 24) {
      return isRTL ? `منذ ${diffInHours} ساعة` : `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return isRTL ? `منذ ${diffInDays} يوم` : `${diffInDays} days ago`;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align={isRTL ? "start" : "end"}>
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {isRTL ? 'الإشعارات' : 'Notifications'}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  {isRTL ? 'قراءة الكل' : 'Mark all read'}
                </Button>
              )}
              <Badge variant="secondary">{unreadCount} {isRTL ? 'جديد' : 'new'}</Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
            <TabsTrigger value="all" className="text-xs">
              {isRTL ? 'الكل' : 'All'}
            </TabsTrigger>
            <TabsTrigger value="urgent" className="text-xs">
              {isRTL ? 'عاجل' : 'Urgent'}
            </TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs">
              {isRTL ? 'تكاليف' : 'Tasks'}
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs">
              {isRTL ? 'إنجازات' : 'Awards'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-96">
              <div className="space-y-1 p-2">
                {getTabNotifications().map((notification) => (
                  <Card 
                    key={notification.id}
                    className={cn(
                      "border-l-4 cursor-pointer transition-all hover:bg-muted/50",
                      !notification.read && "bg-blue-50 border-l-blue-500",
                      notification.read && "border-l-gray-200",
                      notification.type === 'urgent' && "border-l-red-500",
                      notification.type === 'achievement' && "border-l-yellow-500"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type)}
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                            >
                              {getNotificationTypeLabel(notification.type)}
                            </Badge>
                            {notification.actionRequired && (
                              <Badge variant="destructive" className="text-xs">
                                {isRTL ? 'مطلوب إجراء' : 'Action Required'}
                              </Badge>
                            )}
                          </div>
                          
                          <h4 className={cn(
                            "text-sm font-medium",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </h4>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.description}
                          </p>
                          
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        
                        <div className="flex items-start gap-1">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {getTabNotifications().length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {isRTL ? 'لا توجد إشعارات' : 'No notifications'}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="urgent" className="mt-0">
            <ScrollArea className="h-96">
              <div className="space-y-1 p-2">
                {getTabNotifications('urgent').map((notification) => (
                  <Card 
                    key={notification.id}
                    className="border-l-4 border-l-red-500 cursor-pointer transition-all hover:bg-muted/50"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <Badge variant="destructive" className="text-xs">
                              {isRTL ? 'عاجل' : 'Urgent'}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="assignments" className="mt-0">
            <ScrollArea className="h-96">
              <div className="space-y-1 p-2">
                {getTabNotifications('assignments').map((notification) => (
                  <Card 
                    key={notification.id}
                    className="border-l-4 border-l-blue-500 cursor-pointer transition-all hover:bg-muted/50"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            <Badge variant="outline" className="text-xs">
                              {isRTL ? 'تكليف' : 'Assignment'}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="achievements" className="mt-0">
            <ScrollArea className="h-96">
              <div className="space-y-1 p-2">
                {getTabNotifications('achievements').map((notification) => (
                  <Card 
                    key={notification.id}
                    className="border-l-4 border-l-yellow-500 cursor-pointer transition-all hover:bg-muted/50"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                              {isRTL ? 'إنجاز' : 'Achievement'}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="border-t p-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {isRTL ? 'عرض جميع الإشعارات' : 'View All Notifications'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};