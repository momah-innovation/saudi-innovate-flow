import React from 'react';
import { CollaborationWidget } from './CollaborationWidget';
import { UserPresence } from './UserPresence';
import { ActivityFeed } from './ActivityFeed';
import { useCollaboration } from '@/contexts/CollaborationContext';

interface WorkspaceCollaborationProps {
  workspaceType: 'user' | 'expert' | 'organization' | 'partner' | 'admin' | 'team';
  entityId?: string;
  showWidget?: boolean;
  showPresence?: boolean;
  showActivity?: boolean;
}

export const WorkspaceCollaboration: React.FC<WorkspaceCollaborationProps> = ({
  workspaceType,
  entityId,
  showWidget = true,
  showPresence = true,
  showActivity = false
}) => {
  const { onlineUsers, isConnected } = useCollaboration();

  // Map workspace types to collaboration contexts
  const getCollaborationContext = () => {
    switch (workspaceType) {
      case 'user':
        return { contextType: 'global' as const, contextId: 'global' };
      case 'organization':
        return { contextType: 'organization' as const, contextId: entityId || 'org' };
      case 'team':
        return { contextType: 'team' as const, contextId: entityId || 'team' };
      case 'partner':
        return { contextType: 'organization' as const, contextId: 'partners' };
      case 'admin':
        return { contextType: 'organization' as const, contextId: 'admin' };
      case 'expert':
        return { contextType: 'organization' as const, contextId: 'experts' };
      default:
        return { contextType: 'global' as const, contextId: 'global' };
    }
  };

  const { contextType, contextId } = getCollaborationContext();

  if (!isConnected) {
    return null;
  }

  return (
    <>
      {/* Inline Presence Display */}
      {showPresence && onlineUsers.length > 0 && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">المستخدمون المتصلون</h3>
            <UserPresence 
              users={onlineUsers}
              maxVisible={8}
              showStatus={true}
              showLocation={true}
            />
          </div>
        </div>
      )}

      {/* Inline Activity Feed */}
      {showActivity && (
        <div className="mb-6">
          <ActivityFeed
            scope={contextType === 'global' ? 'all' : 'organization'}
            limit={10}
            showFilters={false}
          />
        </div>
      )}

      {/* Floating Collaboration Widget */}
      {showWidget && (
        <CollaborationWidget
          contextType={contextType}
          contextId={contextId}
          entityType="workspace"
          entityId={`${workspaceType}-${entityId || 'default'}`}
          position="bottom-right"
        />
      )}
    </>
  );
};