
export interface ActivityEvent {
  id: string;
  actor_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  target_user_id?: string;
  workspace_id?: string;
  workspace_type?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  privacy_level: 'public' | 'team' | 'organization' | 'private';
  severity: 'info' | 'warning' | 'error' | 'critical';
  tags: string[];
  created_at: string;
  expires_at?: string;
}

export interface ActivityFeedFilter {
  action_types?: string[];
  entity_types?: string[];
  privacy_levels?: string[];
  date_range?: { start: Date; end: Date };
  actors?: string[];
  workspaces?: string[];
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface ActivityAccessContext {
  workspace_access: {
    user: boolean;
    expert: boolean;
    org: boolean;
    partner: boolean;
    admin: boolean;
    team: boolean;
  };
  privacy_levels: {
    public: boolean;
    team: boolean;
    organization: boolean;
    private: boolean;
  };
  entity_access: {
    owned: boolean;
    assigned: boolean;
    participated: boolean;
    public: boolean;
  };
}

export type ActivityActionType = 
  // Entity lifecycle
  | 'challenge_created' | 'challenge_updated' | 'challenge_published' | 'challenge_archived'
  | 'idea_created' | 'idea_submitted' | 'idea_reviewed' | 'idea_approved'
  | 'event_created' | 'event_registered' | 'event_attended' | 'event_cancelled'
  | 'opportunity_created' | 'opportunity_applied' | 'opportunity_awarded'
  | 'partnership_created' | 'partnership_activated' | 'partnership_ended'
  | 'campaign_launched' | 'campaign_updated' | 'campaign_completed'
  // User engagement
  | 'liked' | 'bookmarked' | 'shared' | 'commented' | 'followed' | 'unfollowed'
  | 'team_joined' | 'team_left' | 'task_assigned' | 'task_completed' | 'message_sent'
  | 'file_uploaded' | 'file_downloaded' | 'workspace_created' | 'workspace_joined'
  // Authentication & security
  | 'user_login' | 'user_logout' | 'password_changed' | 'profile_updated'
  | 'failed_login' | 'suspicious_activity' | 'permission_denied' | 'security_alert'
  // Administrative
  | 'role_assigned' | 'role_revoked' | 'user_activated' | 'user_suspended'
  | 'backup_created' | 'maintenance_started' | 'configuration_changed'
  | 'report_generated' | 'data_exported' | 'analytics_viewed';

export type ActivityEntityType = 
  | 'challenge' | 'idea' | 'submission' | 'event' | 'opportunity' 
  | 'partnership' | 'campaign' | 'user' | 'team' | 'workspace' 
  | 'file' | 'comment' | 'notification' | 'system';
