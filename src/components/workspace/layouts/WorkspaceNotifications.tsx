import React, { useState } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Bell, 
  BellRing, 
  Check, 
  X, 
  Settings,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface WorkspaceNotification {
  id: string;
  type: 'mention' | 'assignment' | 'comment' | 'meeting' | 'file' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  sender?: {
    name: string;
    avatar?: string;
  };
}

interface WorkspaceNotificationsProps {
  workspaceId?: string;
  className?: string;
}

export function WorkspaceNotifications({
  workspaceId,
  className
}: WorkspaceNotificationsProps) {
  const { t, isRTL } = useUnifiedTranslation();
  const [open, setOpen] = useState(false);

  // Mock notifications data - replace with actual data fetching
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>([
    {
      id: '1',
      type: 'mention',
      title: t('notifications.mention.title'),
      message: t('mock_data.mention_message'),
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      priority: 'high',
      sender: { name: t('mock_data.sample_member_1') }
    },
    {
      id: '2',
      type: 'assignment',
      title: t('notifications.assignment.title'),
      message: t('mock_data.assignment_message'),
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      priority: 'medium',
      sender: { name: t('mock_data.sample_member_2') }
    },
    {
      id: '3',
      type: 'comment',
      title: t('notifications.comment.title'),
      message: t('mock_data.comment_message'),
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      priority: 'low',
      sender: { name: t('mock_data.sample_member_3') }
    },
    {
      id: '4',
      type: 'meeting',
      title: t('notifications.meeting.title'),
      message: t('mock_data.meeting_message'),
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      priority: 'high'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: WorkspaceNotification['type']) => {
    switch (type) {
      case 'mention':
        return <Users className="h-4 w-4" />;
      case 'assignment':
        return <FileText className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'file':
        return <FileText className="h-4 w-4" />;
      case 'system':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: WorkspaceNotification['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <div className="relative">
            {unreadCount > 0 ? (
              <BellRing className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0" 
        align={isRTL ? "start" : "end"}
        sideOffset={5}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {t('notifications.title')}
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    {t('notifications.mark_all_read')}
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="p-0">
            {notifications.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-muted/50 transition-colors ${
                        !notification.read ? 'bg-muted/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(notification.timestamp, {
                                    addSuffix: true,
                                    locale: isRTL ? ar : enUS
                                  })}
                                </p>
                                {notification.sender && (
                                  <>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <p className="text-xs text-muted-foreground">
                                      {notification.sender.name}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-6 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('notifications.empty')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}