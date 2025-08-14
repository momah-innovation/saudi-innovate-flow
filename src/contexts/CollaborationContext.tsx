import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';
import type { CollaborationContextType, ActivityEvent } from '@/types/collaboration';
import { debugLog } from '@/utils/debugLogger';

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

interface CollaborationProviderProps {
  children: React.ReactNode;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({ children }) => {
  const collaboration = useRealTimeCollaboration();
  
  // Extended state for collaboration management
  const [activeCollaborations, setActiveCollaborations] = useState<Record<string, string[]>>({});
  const [teamActivities, setTeamActivities] = useState<Record<string, ActivityEvent[]>>({});
  const [organizationActivities, setOrganizationActivities] = useState<ActivityEvent[]>([]);

  // Filter activities by scope
  useEffect(() => {
    const filteredOrgActivities = collaboration.activities.filter(
      activity => activity.privacy_level === 'public' || activity.privacy_level === 'organization'
    );
    setOrganizationActivities(filteredOrgActivities);

    // Group team activities
    const teamGrouped = collaboration.activities.reduce((acc, activity) => {
      if (activity.privacy_level === 'team' && activity.visibility_scope?.team_ids) {
        activity.visibility_scope.team_ids.forEach(teamId => {
          if (!acc[teamId]) acc[teamId] = [];
          acc[teamId].push(activity);
        });
      }
      return acc;
    }, {} as Record<string, ActivityEvent[]>);
    
    setTeamActivities(teamGrouped);
  }, [collaboration.activities]);

  const startCollaboration = async (entityType: string, entityId: string) => {
    setActiveCollaborations(prev => ({
      ...prev,
      [entityId]: [...(prev[entityId] || []), collaboration.currentUserPresence?.user_id].filter(Boolean) as string[]
    }));

    await collaboration.updatePresence({
      page: window.location.pathname,
      entity_type: entityType,
      entity_id: entityId
    });
  };

  const endCollaboration = async (entityType: string, entityId: string) => {
    setActiveCollaborations(prev => {
      const updated = { ...prev };
      if (updated[entityId]) {
        updated[entityId] = updated[entityId].filter(
          userId => userId !== collaboration.currentUserPresence?.user_id
        );
        if (updated[entityId].length === 0) {
          delete updated[entityId];
        }
      }
      return updated;
    });

    await collaboration.updatePresence({
      page: window.location.pathname
    });
  };

  const inviteToCollaboration = async (entityType: string, entityId: string, userIds: string[]) => {
    // TODO: Implement invitation system
    debugLog.debug('Inviting users to collaboration', { entityType, entityId, userIds });
  };

  const contextValue: CollaborationContextType = {
    ...collaboration,
    activeCollaborations,
    teamActivities,
    organizationActivities,
    startCollaboration,
    endCollaboration,
    inviteToCollaboration
  };

  return (
    <CollaborationContext.Provider value={contextValue}>
      {children}
    </CollaborationContext.Provider>
  );
};