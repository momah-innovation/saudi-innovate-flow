import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationHandler } from '@/utils/unified-navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellOff,
  Mail,
  MessageSquare,
  Activity,
  Settings,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import type { RealtimeNotification } from '@/types/collaboration';

interface NotificationCenterProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const notificationIcons = {
  mention: <MessageSquare className="w-4 h-4" />,
  message: <Mail className="w-4 h-4" />,
  activity: <Activity className="w-4 h-4" />,
  system: <Settings className="w-4 h-4" />,
  collaboration_invite: <MessageSquare className="w-4 h-4" />,
  document_shared: <ExternalLink className="w-4 h-4" />
};

const priorityColors = {
  low: 'bg-muted',
  medium: 'bg-primary',
  high: 'bg-warning',
  urgent: 'bg-destructive'
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen = false,
  onClose
}) => {
  const navigate = useNavigate();
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);
  const { notifications, markAsRead } = useCollaboration();
  const { t } = useUnifiedTranslation();
  const [selectedTab, setSelectedTab] = useState('all');

  // Filter notifications by read status
  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  const getNotificationsForTab = (): RealtimeNotification[] => {
    switch (selectedTab) {
      case 'unread':
        return unreadNotifications;
      case 'read':
        return readNotifications;
      default:
        return notifications;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };

  const formatNotificationTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('collaboration.time_now');
    if (diffMins < 60) return t('collaboration.time_minutes_ago', { count: diffMins });
    if (diffHours < 24) return t('collaboration.time_hours_ago', { count: diffHours });
    return t('collaboration.time_days_ago', { count: diffDays });
  };

  const handleNotificationClick = (notification: RealtimeNotification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.data.action_url) {
      navigationHandler.navigateTo(notification.data.action_url);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed top-16 left-4 w-96 max-h-96 z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {t('collaboration.notifications')}
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadNotifications.length}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {unreadNotifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                <Check className="w-4 h-4 ml-1" />
                {t('collaboration.mark_all_read')}
              </Button>
            )}
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 w-full rounded-none">
            <TabsTrigger value="all">
              {t('collaboration.all_notifications')} ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              {t('collaboration.unread_notifications')} ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="read">
              {t('collaboration.read_notifications')} ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-0">
            <ScrollArea className="h-80">
              <div className="p-2">
                {getNotificationsForTab().length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BellOff className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm">{t('collaboration.no_notifications')}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getNotificationsForTab().map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                          !notification.is_read ? 'bg-primary/5 border-primary/20' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 p-2 rounded-full ${priorityColors[notification.priority]}`}>
                            {notificationIcons[notification.type] || notificationIcons.system}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium line-clamp-1">
                                {notification.title}
                              </h4>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatNotificationTime(notification.created_at)}
                              </span>
                              
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {notification.type}
                                </Badge>
                                
                                {notification.priority !== 'medium' && (
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${
                                      notification.priority === 'urgent' ? 'bg-destructive text-destructive-foreground' :
                                      notification.priority === 'high' ? 'bg-warning text-warning-foreground' :
                                      'bg-muted'
                                    }`}
                                  >
                                    {notification.priority}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};