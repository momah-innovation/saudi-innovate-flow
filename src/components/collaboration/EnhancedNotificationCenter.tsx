import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { 
  Bell, 
  BellOff, 
  MessageSquare, 
  Users, 
  Calendar, 
  FileText,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  Settings,
  Filter,
  MoreHorizontal
} from 'lucide-react';
// import type { RealtimeNotification } from '@/types/collaboration';

interface NotificationPreferences {
  mentions: boolean;
  comments: boolean;
  assignments: boolean;
  meetings: boolean;
  documents: boolean;
  presence: boolean;
  digestFrequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface EnhancedNotification {
  id: string;
  recipient_id?: string;
  user_id?: string;
  type: 'mention' | 'assignment' | 'collaboration' | 'meeting' | 'document' | 'system';
  title: string;
  content?: string;
  message?: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  created_at: string;
  context?: {
    entity_type: string;
    entity_id: string;
    workspace_id?: string;
  };
  metadata?: Record<string, any>;
}

interface EnhancedNotificationCenterProps {
  contextType?: 'global' | 'organization' | 'team' | 'project';
  contextId?: string;
  className?: string;
}

export const EnhancedNotificationCenter: React.FC<EnhancedNotificationCenterProps> = ({
  contextType = 'global',
  contextId,
  className = ''
}) => {
  const { notifications: baseNotifications, currentUserPresence } = useCollaboration();
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'mentions' | 'urgent'>('all');
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    mentions: true,
    comments: true,
    assignments: true,
    meetings: true,
    documents: true,
    presence: false,
    digestFrequency: 'instant',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Unified loading and error handling
  const unifiedLoading = useUnifiedLoading({
    component: 'EnhancedNotificationCenter',
    showToast: true,
    logErrors: true
  });
  const errorHandler = createErrorHandler({
    component: 'EnhancedNotificationCenter',
    showToast: true,
    logError: true
  });

  // Simulate enhanced notifications with smart categorization
  useEffect(() => {
    const enhancedNotifications: EnhancedNotification[] = [
      {
        id: 'notif_1',
        recipient_id: 'user_1',
        type: 'mention',
        title: 'You were mentioned in a comment',
        content: 'Sarah mentioned you in the project discussion',
        priority: 'high',
        is_read: false,
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        context: {
          entity_type: 'comment',
          entity_id: 'comment_123',
          workspace_id: contextId
        },
        metadata: {
          avatar_url: '/placeholder.svg',
          user_name: 'Sarah Wilson'
        }
      },
      {
        id: 'notif_2',
        user_id: 'user_2',
        type: 'assignment',
        title: 'New task assigned',
        content: 'You have been assigned to "Update documentation"',
        priority: 'medium',
        is_read: false,
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        context: {
          entity_type: 'task',
          entity_id: 'task_456',
          workspace_id: contextId
        },
        metadata: {
          avatar_url: '/placeholder.svg',
          user_name: 'Project Manager'
        }
      },
      {
        id: 'notif_3',
        user_id: 'user_3',
        type: 'collaboration',
        title: 'Someone joined your workspace',
        content: 'Alex joined the Design Team workspace',
        priority: 'low',
        is_read: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        context: {
          entity_type: 'workspace',
          entity_id: contextId,
          workspace_id: contextId
        },
        metadata: {
          avatar_url: '/placeholder.svg',
          user_name: 'Alex Chen'
        }
      },
      {
        id: 'notif_4',
        user_id: 'user_4',
        type: 'meeting',
        title: 'Meeting reminder',
        content: 'Team standup starts in 30 minutes',
        priority: 'high',
        is_read: false,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        context: {
          entity_type: 'meeting',
          entity_id: 'meeting_789',
          workspace_id: contextId
        },
        metadata: {
          meeting_time: '10:00 AM',
          meeting_room: 'Conference Room A'
        }
      }
    ];

    setNotifications(enhancedNotifications);
  }, [contextId]);

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.is_read;
      case 'mentions':
        return notification.type === 'mention';
      case 'urgent':
        return notification.priority === 'high';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const urgentCount = notifications.filter(n => n.priority === 'high' && !n.is_read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (type) {
      case 'mention':
        return <MessageSquare {...iconProps} />;
      case 'assignment':
        return <FileText {...iconProps} />;
      case 'meeting':
        return <Calendar {...iconProps} />;
      case 'collaboration':
        return <Users {...iconProps} />;
      default:
        return priority === 'high' ? <AlertCircle {...iconProps} /> : <Info {...iconProps} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
            {urgentCount > 0 && (
              <Badge variant="outline" className="text-xs border-red-500 text-red-500">
                {urgentCount} urgent
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreferences(!showPreferences)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs value={showPreferences ? 'preferences' : 'notifications'} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="notifications" 
              onClick={() => setShowPreferences(false)}
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="preferences"
              onClick={() => setShowPreferences(true)}
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-4">
            {/* Filter Bar */}
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                {['all', 'unread', 'mentions', 'urgent'].map((filterOption) => (
                  <Button
                    key={filterOption}
                    variant={filter === filterOption ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(filterOption as any)}
                    className="text-xs"
                  >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                    {filterOption === 'unread' && unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border rounded-lg transition-colors ${
                       !notification.is_read 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${getPriorityColor(notification.priority)} mt-1`}>
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-medium ${
                            !notification.is_read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {getRelativeTime(notification.created_at)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(notification as any).content || notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          {(notification as any).metadata?.user_name && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={(notification as any).metadata.avatar_url} />
                                <AvatarFallback className="text-xs">
                                  {(notification as any).metadata.user_name[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {(notification as any).metadata.user_name}
                              </span>
                            </div>
                          )}
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BellOff className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">
                    {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-4">
            <div className="space-y-6">
              {/* Notification Types */}
              <div>
                <h4 className="text-sm font-medium mb-3">Notification Types</h4>
                <div className="space-y-3">
                  {[
                    { key: 'mentions', label: 'Mentions', description: 'When someone mentions you' },
                    { key: 'comments', label: 'Comments', description: 'New comments on your content' },
                    { key: 'assignments', label: 'Assignments', description: 'When you\'re assigned tasks' },
                    { key: 'meetings', label: 'Meetings', description: 'Meeting reminders and updates' },
                    { key: 'documents', label: 'Documents', description: 'Document changes and shares' },
                    { key: 'presence', label: 'Presence', description: 'When users join/leave workspaces' }
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{label}</div>
                        <div className="text-xs text-muted-foreground">{description}</div>
                      </div>
                      <Switch
                        checked={preferences[key as keyof NotificationPreferences] as boolean}
                        onCheckedChange={(checked) =>
                          setPreferences(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Digest Frequency */}
              <div>
                <h4 className="text-sm font-medium mb-3">Digest Frequency</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['instant', 'hourly', 'daily', 'weekly'].map((frequency) => (
                    <Button
                      key={frequency}
                      variant={preferences.digestFrequency === frequency ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setPreferences(prev => ({ 
                          ...prev, 
                          digestFrequency: frequency as any 
                        }))
                      }
                      className="text-xs"
                    >
                      {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Quiet Hours</h4>
                  <Switch
                    checked={preferences.quietHours.enabled}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, enabled: checked }
                      }))
                    }
                  />
                </div>
                {preferences.quietHours.enabled && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>From</span>
                    <input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) =>
                        setPreferences(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, start: e.target.value }
                        }))
                      }
                      className="border rounded px-2 py-1"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) =>
                        setPreferences(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, end: e.target.value }
                        }))
                      }
                      className="border rounded px-2 py-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};