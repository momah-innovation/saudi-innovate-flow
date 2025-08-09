import React from 'react';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { CollaborationWidget } from './CollaborationWidget';

interface RealTimeCollaborationWrapperProps {
  children: React.ReactNode;
  contextType?: 'global' | 'organization' | 'team' | 'project' | 'direct';
  contextId?: string;
  entityType?: string;
  entityId?: string;
  showWidget?: boolean;
  widgetPosition?: 'bottom-left' | 'bottom-right' | 'top-right';
}

export const RealTimeCollaborationWrapper: React.FC<RealTimeCollaborationWrapperProps> = ({
  children,
  contextType = 'global',
  contextId,
  entityType,
  entityId,
  showWidget = true,
  widgetPosition = 'bottom-right'
}) => {
  return (
    <CollaborationProvider>
      {children}
      {showWidget && (
        <CollaborationWidget
          contextType={contextType}
          contextId={contextId}
          entityType={entityType}
          entityId={entityId}
          position={widgetPosition}
        />
      )}
    </CollaborationProvider>
  );
};

export default RealTimeCollaborationWrapper;