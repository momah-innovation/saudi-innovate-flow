// Real-time Collaboration Components
export { CollaborationProvider, useCollaboration } from '@/contexts/CollaborationContext';
export { UserPresence } from './UserPresence';
export { ActivityFeed } from './ActivityFeed';
export { MessagingPanel } from './MessagingPanel';
export { LiveDocumentEditor } from './LiveDocumentEditor';
export { NotificationCenter } from './NotificationCenter';
export { CollaborationWidget } from './CollaborationWidget';

// Re-export hook for convenience
export { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';

// Re-export types
// export type * from '@/types/collaboration';