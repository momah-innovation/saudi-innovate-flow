/**
 * Real-time Collaboration System Types
 */

// Core presence and activity types
export interface UserPresence {
  user_id: string;
  session_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  current_location: {
    page: string;
    entity_type?: string;
    entity_id?: string;
    section?: string;
  };
  last_seen: string;
  user_info: {
    display_name: string;
    avatar_url?: string;
    role: string;
  };
}

export interface ActivityEvent {
  id: string;
  user_id: string;
  event_type: 'create' | 'update' | 'delete' | 'comment' | 'like' | 'share' | 'join' | 'leave';
  entity_type: 'challenge' | 'idea' | 'event' | 'opportunity' | 'campaign' | 'workspace' | 'project';
  entity_id: string;
  metadata: Record<string, any>;
  privacy_level: 'public' | 'organization' | 'team' | 'project' | 'private';
  created_at: string;
  visibility_scope?: {
    organization_ids?: string[];
    team_ids?: string[];
    project_ids?: string[];
    user_ids?: string[];
  };
}

// Messaging system types
export interface CollaborationMessage {
  id: string;
  sender_id: string;
  sender: {
    display_name: string;
    avatar_url?: string;
    role: string;
  };
  content: string;
  message_type: 'text' | 'file' | 'image' | 'mention' | 'system' | 'reaction';
  thread_id?: string;
  reply_to?: string;
  context: {
    space_type: 'global' | 'organization' | 'team' | 'project' | 'direct';
    space_id: string;
    entity_type?: string;
    entity_id?: string;
  };
  metadata?: {
    file_url?: string;
    file_name?: string;
    file_size?: number;
    mentioned_users?: string[];
    reactions?: Record<string, string[]>; // emoji -> user_ids
  };
  is_edited: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CollaborationSpace {
  id: string;
  name: string;
  description?: string;
  type: 'global' | 'organization' | 'team' | 'project' | 'direct';
  privacy_level: 'public' | 'organization' | 'team' | 'project' | 'private';
  participants: string[];
  admins: string[];
  settings: {
    allow_file_uploads: boolean;
    allow_mentions: boolean;
    message_retention_days?: number;
    require_approval_for_new_members: boolean;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Live collaboration types
export interface LiveDocument {
  id: string;
  title: string;
  content: any; // JSON content (could be rich text, structured data, etc.)
  document_type: 'idea' | 'challenge_submission' | 'project_plan' | 'proposal' | 'notes';
  entity_id?: string;
  collaborators: string[];
  current_editors: {
    user_id: string;
    cursor_position?: number;
    selection_range?: { start: number; end: number };
    last_activity: string;
  }[];
  version: number;
  privacy_level: 'public' | 'organization' | 'team' | 'project' | 'private';
  permissions: {
    can_edit: string[];
    can_comment: string[];
    can_view: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface LiveEdit {
  id: string;
  document_id: string;
  user_id: string;
  operation_type: 'insert' | 'delete' | 'format' | 'move';
  position: number;
  content?: string;
  length?: number;
  metadata?: Record<string, any>;
  timestamp: string;
  version: number;
}

// Notification system types
export interface RealtimeNotification {
  id: string;
  recipient_id: string;
  sender_id?: string;
  type: 'mention' | 'message' | 'activity' | 'system' | 'collaboration_invite' | 'document_shared';
  title: string;
  message: string;
  data: {
    entity_type?: string;
    entity_id?: string;
    space_id?: string;
    document_id?: string;
    action_url?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: ('in_app' | 'push' | 'email' | 'sms')[];
  is_read: boolean;
  created_at: string;
}

// Team collaboration types
export interface TeamCollaboration {
  team_id: string;
  active_projects: string[];
  shared_documents: string[];
  team_channels: string[];
  collaboration_settings: {
    default_privacy_level: 'team' | 'organization';
    allow_external_collaboration: boolean;
    require_approval_for_sharing: boolean;
    activity_notifications: boolean;
  };
  current_activities: ActivityEvent[];
}

// Real-time hooks and state types
export interface UseCollaborationReturn {
  // Presence
  onlineUsers: UserPresence[];
  currentUserPresence: UserPresence | null;
  updatePresence: (location: UserPresence['current_location']) => void;
  
  // Messaging
  messages: CollaborationMessage[];
  sendMessage: (content: string, context: CollaborationMessage['context']) => void;
  spaces: CollaborationSpace[];
  
  // Live documents
  liveDocuments: LiveDocument[];
  joinDocument: (documentId: string) => void;
  leaveDocument: (documentId: string) => void;
  
  // Activity feed
  activities: ActivityEvent[];
  
  // Notifications
  notifications: RealtimeNotification[];
  markAsRead: (notificationId: string) => void;
  
  // Connection status
  isConnected: boolean;
  connectionQuality: 'good' | 'slow' | 'poor';
}

export interface CollaborationContextType extends UseCollaborationReturn {
  // Global collaboration state
  activeCollaborations: Record<string, string[]>; // entity_id -> user_ids
  teamActivities: Record<string, ActivityEvent[]>; // team_id -> activities
  organizationActivities: ActivityEvent[];
  
  // Collaboration controls
  startCollaboration: (entityType: string, entityId: string) => void;
  endCollaboration: (entityType: string, entityId: string) => void;
  inviteToCollaboration: (entityType: string, entityId: string, userIds: string[]) => void;
}