
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
  // 🏆 Challenge Lifecycle - HIGH PRIORITY
  | 'challenge_created' | 'challenge_published' | 'challenge_archived' | 'challenge_completed'
  // 💡 Idea & Innovation - HIGH PRIORITY
  | 'idea_created' | 'idea_submitted' | 'idea_reviewed' | 'idea_approved' | 'idea_implemented'
  // 🎯 Events & Opportunities - MEDIUM PRIORITY
  | 'event_created' | 'event_registered' | 'event_attended' | 'event_cancelled'
  | 'opportunity_created' | 'opportunity_applied' | 'opportunity_awarded'
  // 🤝 Partnerships & Campaigns - HIGH PRIORITY
  | 'partnership_created' | 'partnership_activated' | 'partnership_ended'
  | 'campaign_launched' | 'campaign_completed'
  // 👥 Team & Collaboration - MEDIUM PRIORITY
  | 'team_joined' | 'team_left' | 'workspace_created' | 'workspace_joined'
  | 'task_assigned' | 'task_completed'
  // 🔐 Security & Authentication - HIGH PRIORITY
  | 'failed_login' | 'suspicious_activity' | 'permission_denied' | 'security_alert'
  | 'role_assigned' | 'role_revoked' | 'user_activated' | 'user_suspended'
  // ⚙️ System Administration - HIGH PRIORITY
  | 'maintenance_started' | 'configuration_changed' | 'backup_created'
  | 'system_alert' | 'data_export_requested';

// Activity importance levels for filtering
export type ActivityImportance = 'critical' | 'high' | 'medium' | 'low';

// Important activities that should always be logged
export const CRITICAL_ACTIVITIES: ActivityActionType[] = [
  'challenge_created', 'challenge_published', 'challenge_completed',
  'idea_submitted', 'idea_approved', 'idea_implemented',
  'partnership_created', 'campaign_launched',
  'security_alert', 'suspicious_activity', 'permission_denied',
  'role_assigned', 'role_revoked', 'user_suspended',
  'system_alert', 'maintenance_started'
];

export const HIGH_PRIORITY_ACTIVITIES: ActivityActionType[] = [
  'challenge_archived', 'idea_created', 'idea_reviewed',
  'event_created', 'opportunity_created', 'opportunity_awarded',
  'partnership_activated', 'partnership_ended', 'campaign_completed',
  'failed_login', 'user_activated', 'configuration_changed', 'backup_created'
];

export const MEDIUM_PRIORITY_ACTIVITIES: ActivityActionType[] = [
  'event_registered', 'event_attended', 'event_cancelled',
  'opportunity_applied', 'team_joined', 'team_left',
  'workspace_created', 'workspace_joined', 'task_assigned', 'task_completed',
  'data_export_requested'
];

export type ActivityEntityType = 
  | 'challenge' | 'idea' | 'submission' | 'event' | 'opportunity' 
  | 'partnership' | 'campaign' | 'user' | 'team' | 'workspace' 
  | 'file' | 'comment' | 'notification' | 'system' | 'dashboard' | 'page';
