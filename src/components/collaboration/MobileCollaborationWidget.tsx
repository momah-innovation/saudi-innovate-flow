import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { debugLog } from '@/utils/debugLogger';
import { 
  MessageSquare, 
  Users, 
  Bell, 
  Activity,
  X,
  ChevronUp,
  ChevronDown,
  Phone,
  Video,
  Share
} from 'lucide-react';

interface MobileCollaborationWidgetProps {
  contextType?: 'global' | 'organization' | 'team' | 'project' | 'direct';
  contextId?: string;
  entityType?: string;
  entityId?: string;
  position?: 'bottom' | 'top';
}

export const MobileCollaborationWidget: React.FC<MobileCollaborationWidgetProps> = ({
  contextType = 'global',
  contextId,
  entityType,
  entityId,
  position = 'bottom'
}) => {
  const { onlineUsers, notifications, currentUserPresence } = useCollaboration();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState<'presence' | 'messages' | 'notifications' | 'activity'>('presence');

  const unreadNotifications = notifications?.filter((n: any) => !n.read)?.length || 0;
  const activeCollaborators = onlineUsers.length;

  const quickActions = [
    {
      id: 'share',
      icon: Share,
      label: 'Share',
      action: () => debugLog.log('Share'),
      color: 'text-blue-500'
    },
    {
      id: 'call',
      icon: Phone,
      label: 'Call',
      action: () => debugLog.log('Start voice call'),
      color: 'text-green-500'
    },
    {
      id: 'video',
      icon: Video,
      label: 'Video',
      action: () => debugLog.log('Start video call'),
      color: 'text-purple-500'
    }
  ];

  return (
    <>
      {/* Mobile Floating Widget */}
      <div 
        className={`fixed left-4 right-4 z-50 md:hidden ${
          position === 'bottom' ? 'bottom-4' : 'top-4'
        }`}
      >
        <Card className="shadow-lg border-2">
          <CardContent className="p-3">
            {!isExpanded ? (
              /* Collapsed State */
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {onlineUsers.slice(0, 3).map((user) => (
                      <Avatar key={user.user_id} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={user.user_info.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {user.user_info.display_name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {activeCollaborators > 3 && (
                      <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-medium">+{activeCollaborators - 3}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {activeCollaborators} online
                    </div>
                    {unreadNotifications > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {unreadNotifications} new notifications
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {unreadNotifications}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(true)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Expanded State */
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Collaboration</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant={activePanel === 'presence' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePanel('presence')}
                    className="flex flex-col items-center gap-1 h-auto py-2"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-xs">{activeCollaborators}</span>
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex flex-col items-center gap-1 h-auto py-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-xs">Chat</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh]">
                      <SheetHeader>
                        <SheetTitle>Messages</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4 text-center text-muted-foreground">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No recent messages</p>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Button
                    variant={activePanel === 'notifications' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePanel('notifications')}
                    className="flex flex-col items-center gap-1 h-auto py-2 relative"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="text-xs">{unreadNotifications}</span>
                    {unreadNotifications > 0 && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                    )}
                  </Button>
                  <Button
                    variant={activePanel === 'activity' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePanel('activity')}
                    className="flex flex-col items-center gap-1 h-auto py-2"
                  >
                    <Activity className="h-4 w-4" />
                    <span className="text-xs">Feed</span>
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className="flex-1 flex flex-col items-center gap-1 h-auto py-2"
                    >
                      <action.icon className={`h-4 w-4 ${action.color}`} />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Active Users Preview */}
                {activePanel === 'presence' && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {onlineUsers.slice(0, 5).map((user) => (
                      <div key={user.user_id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.user_info.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {user.user_info.display_name?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">
                            {user.user_info.display_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.status}
                          </div>
                        </div>
                        <div className={`h-2 w-2 rounded-full ${
                          user.status === 'online' ? 'bg-green-500' : 
                          user.status === 'busy' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                    ))}
                    {activeCollaborators > 5 && (
                      <div className="text-xs text-center text-muted-foreground">
                        +{activeCollaborators - 5} more users
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Presence Indicators */}
      <div className="fixed top-4 right-4 z-40 md:hidden">
        <div className="flex flex-col gap-2">
          {/* Live Activity Indicator */}
          {activeCollaborators > 1 && (
            <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Live
            </Badge>
          )}
          
          {/* Notification Badge */}
          {unreadNotifications > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadNotifications}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};