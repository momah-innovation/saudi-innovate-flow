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