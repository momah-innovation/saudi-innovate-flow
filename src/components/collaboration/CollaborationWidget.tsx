import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Bell, 
  Users, 
  Activity,
  Settings,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { UserPresence } from './UserPresence';
import { MessagingPanel } from './MessagingPanel';
import { NotificationCenter } from './NotificationCenter';
import { ActivityFeed } from './ActivityFeed';
import { useCollaboration } from '@/contexts/CollaborationContext';

interface CollaborationWidgetProps {
  contextType?: 'global' | 'organization' | 'team' | 'project' | 'direct';
  contextId?: string;
  entityType?: string;
  entityId?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-right';
}

export const CollaborationWidget: React.FC<CollaborationWidgetProps> = ({
  contextType = 'global',
  contextId = 'global',
  entityType,
  entityId,
  position = 'bottom-right'
}) => {
  const { 
    onlineUsers, 
    notifications, 
    activities,
    startCollaboration,
    endCollaboration 
  } = useCollaboration();
  
  const [activePanel, setActivePanel] = useState<'none' | 'messages' | 'notifications' | 'activity'>('none');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  // Get users in current context
  const contextUsers = onlineUsers.filter(user => 
    user.current_location.entity_type === entityType && 
    user.current_location.entity_id === entityId
  );

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4', 
    'top-right': 'top-20 right-4'
  };

  const handleToggleCollaboration = async () => {
    if (entityType && entityId) {
      if (isCollaborating) {
        await endCollaboration(entityType, entityId);
        setIsCollaborating(false);
      } else {
        await startCollaboration(entityType, entityId);
        setIsCollaborating(true);
      }
    }
  };

  const togglePanel = (panel: typeof activePanel) => {
    setActivePanel(activePanel === panel ? 'none' : panel);
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-40`}>
      {/* Main Widget Bar */}
      <div className={`flex items-center gap-2 p-2 bg-background border rounded-lg shadow-lg ${
        isMinimized ? 'w-auto' : 'min-w-64'
      }`}>
        
        {/* Minimize/Maximize Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMinimized(!isMinimized)}
          className="h-8 w-8 p-0"
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </Button>

        {!isMinimized && (
          <>
            {/* Online Users Presence */}
            <div className="flex items-center gap-2">
              <UserPresence 
                users={contextUsers.length > 0 ? contextUsers : onlineUsers}
                maxVisible={3}
                size="sm"
              />
              <span className="text-xs text-muted-foreground">
                {onlineUsers.length} متصل
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Messages */}
              <Button
                variant={activePanel === 'messages' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => togglePanel('messages')}
                className="h-8 w-8 p-0"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>

              {/* Notifications */}
              <Button
                variant={activePanel === 'notifications' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => togglePanel('notifications')}
                className="h-8 w-8 p-0 relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Activity Feed */}
              <Button
                variant={activePanel === 'activity' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => togglePanel('activity')}
                className="h-8 w-8 p-0"
              >
                <Activity className="w-4 h-4" />
              </Button>

              {/* Collaboration Toggle */}
              {entityType && entityId && (
                <Button
                  variant={isCollaborating ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleToggleCollaboration}
                  className="h-8 px-2"
                >
                  <Users className="w-4 h-4 ml-1" />
                  {isCollaborating ? 'إنهاء' : 'تعاون'}
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Active Panels */}
      {activePanel === 'messages' && (
        <div className="mt-2">
          <MessagingPanel
            contextType={contextType}
            contextId={contextId}
            isOpen={true}
            onClose={() => setActivePanel('none')}
          />
        </div>
      )}

      {activePanel === 'notifications' && (
        <div className="mt-2">
          <NotificationCenter
            isOpen={true}
            onClose={() => setActivePanel('none')}
          />
        </div>
      )}

      {activePanel === 'activity' && (
        <div className="mt-2">
          <div className="w-80">
            <ActivityFeed
              scope={contextType === 'global' ? 'all' : 'organization'}
              limit={20}
              showFilters={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};