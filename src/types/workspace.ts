/**
 * Workspace and Team Management Types
 */

export interface TeamMember {
  id: string;
  user_id?: string;
  name?: string;
  display_name?: string;
  email?: string;
  role: string;
  specialization: string;
  avatar_url?: string;
  profile_image_url?: string;
  profiles?: {
    display_name: string;
    profile_image_url?: string;
  };
  status?: 'active' | 'inactive' | 'pending';
  joined_at?: string;
  last_active?: string;
  expertise_areas?: string[];
  department?: string;
  current_workload?: number;
}

export interface WorkspaceProject {
  id: string;
  title: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  deadline?: string;
  progress?: number;
  team_members?: TeamMember[];
  creator_id: string;
}

export interface TaskAssignment {
  id: string;
  title: string;
  description?: string;
  assignee_id: string;
  assigner_id: string;
  project_id?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  created_at: string;
  updated_at: string;
  estimated_hours?: number;
  actual_hours?: number;
}

export interface WorkspaceMeeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  meeting_type: 'team-sync' | 'project-review' | 'brainstorming' | 'one-on-one';
  location?: string;
  virtual_link?: string;
  attendees: TeamMember[];
  organizer_id: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  agenda?: string[];
  meeting_notes?: string;
}

export interface TeamChatMessage {
  id: string;
  sender_id: string;
  sender: TeamMember;
  content: string;
  message_type: 'text' | 'file' | 'image' | 'system';
  created_at: string;
  edited_at?: string;
  reply_to?: string;
  attachments?: {
    id: string;
    filename: string;
    file_url: string;
    file_type: string;
    file_size: number;
  }[];
}

export interface WorkspaceInvitation {
  id: string;
  email: string;
  role: string;
  invited_by: string;
  created_at: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitation_token: string;
}

// New comprehensive workspace types

export type WorkspaceType = 
  | 'user' 
  | 'expert' 
  | 'organization' 
  | 'team' 
  | 'project' 
  | 'admin' 
  | 'partner' 
  | 'stakeholder';

export type WorkspaceStatus = 'active' | 'inactive' | 'suspended' | 'archived';
export type WorkspacePrivacy = 'public' | 'private' | 'restricted' | 'confidential';

export interface BaseWorkspace {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  workspace_type: WorkspaceType;
  privacy_level: WorkspacePrivacy;
  status: WorkspaceStatus;
  
  // Owner and relationships
  owner_id: string;
  innovation_team_id?: string;
  parent_workspace_id?: string;
  
  // Organizational hierarchy
  organization_id?: string;
  department_id?: string;
  deputy_id?: string;
  sector_id?: string;
  
  // Configuration
  settings: Record<string, any>;
  features_enabled: Record<string, boolean>;
  access_rules: Record<string, any>;
  
  // Metadata
  avatar_url?: string;
  banner_url?: string;
  tags?: string[];
  metadata: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: string;
  permissions: Record<string, any>;
  access_level: 'standard' | 'elevated' | 'admin';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  invited_by?: string;
  joined_at: string;
  last_active_at?: string;
  notification_preferences: Record<string, any>;
  workspace_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Simplified workspace interface for database compatibility
export type Workspace = BaseWorkspace;

// Workspace activity and collaboration types

export interface WorkspaceActivity {
  id: string;
  workspace_id: string;
  actor_id?: string;
  action_type: string;
  entity_type: string;
  entity_id?: string;
  activity_title: string;
  activity_title_ar?: string;
  description?: string;
  description_ar?: string;
  metadata: Record<string, any>;
  visibility_scope: 'public' | 'workspace' | 'team' | 'private';
  is_aggregated: boolean;
  aggregation_key?: string;
  created_at: string;
}

export interface WorkspaceFile {
  id: string;
  workspace_id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  upload_session_id?: string;
  folder_path: string;
  tags?: string[];
  description?: string;
  access_level: 'public' | 'workspace' | 'team' | 'private';
  permissions: Record<string, any>;
  version_number: number;
  parent_file_id?: string;
  is_current_version: boolean;
  status: 'active' | 'archived' | 'processing' | 'failed';
  is_deleted: boolean;
  deleted_at?: string;
  deleted_by?: string;
  metadata: Record<string, any>;
  thumbnail_url?: string;
  preview_url?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceSettings {
  id: string;
  workspace_id: string;
  language: string;
  timezone: string;
  date_format: string;
  currency: string;
  features_enabled: Record<string, boolean>;
  integrations: Record<string, any>;
  default_member_permissions: Record<string, any>;
  guest_access_enabled: boolean;
  public_join_enabled: boolean;
  notification_settings: Record<string, any>;
  email_notifications: Record<string, any>;
  theme_settings: Record<string, any>;
  custom_branding: Record<string, any>;
  security_settings: Record<string, any>;
  data_retention_days: number;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceAnalytics {
  id: string;
  workspace_id: string;
  member_count: number;
  active_members_count: number;
  project_count: number;
  task_count: number;
  meeting_count: number;
  message_count: number;
  daily_active_users: number;
  weekly_active_users: number;
  monthly_active_users: number;
  avg_session_duration: number;
  total_messages_today: number;
  total_tasks_completed: number;
  project_completion_rate: number;
  average_task_completion_time: number;
  meeting_attendance_rate: number;
  engagement_score: number;
  productivity_score: number;
  collaboration_score: number;
  calculation_date: string;
  last_updated: string;
}

// Multi-role user context for RBAC
export interface UserWorkspaceContext {
  user_id: string;
  roles: string[];
  workspaces: {
    workspace_id: string;
    workspace_type: WorkspaceType;
    member_role: string;
    access_level: string;
    permissions: Record<string, any>;
  }[];
  default_workspace_id?: string;
  workspace_priority: {
    workspace_id: string;
    priority_order: number;
  }[];
}

// Workspace navigation and routing types
export interface WorkspaceRoute {
  workspace_type: WorkspaceType;
  path: string;
  component: string;
  required_roles: string[];
  required_permissions: string[];
  icon: string;
  label: string;
  label_ar: string;
  group: string;
  order: number;
}

export interface WorkspaceSidebarItem {
  id: string;
  label: string;
  label_ar: string;
  path: string;
  icon: string;
  workspace_types: WorkspaceType[];
  required_roles?: string[];
  required_permissions?: string[];
  children?: WorkspaceSidebarItem[];
  badge_count?: number;
  is_external?: boolean;
}