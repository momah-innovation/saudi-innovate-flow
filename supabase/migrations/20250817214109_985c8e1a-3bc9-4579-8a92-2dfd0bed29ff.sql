-- Workspace Database Migration - Building on existing team infrastructure
-- This migration extends the existing innovation_teams and innovation_team_members tables

-- 1. Create workspace types enum
CREATE TYPE workspace_type AS ENUM (
  'user', 'expert', 'organization', 'team', 'project', 'admin', 'partner', 'stakeholder'
);

-- 2. Create workspace status enum
CREATE TYPE workspace_status AS ENUM (
  'active', 'inactive', 'suspended', 'archived'
);

-- 3. Create workspace privacy enum
CREATE TYPE workspace_privacy AS ENUM (
  'public', 'private', 'restricted', 'confidential'
);

-- 4. Main workspaces table
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  workspace_type workspace_type NOT NULL,
  privacy_level workspace_privacy DEFAULT 'private',
  status workspace_status DEFAULT 'active',
  
  -- Owner and team relationships
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  innovation_team_id UUID REFERENCES public.innovation_teams(id) ON DELETE SET NULL,
  parent_workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  
  -- Organizational hierarchy
  organization_id UUID,
  department_id UUID,
  deputy_id UUID,
  sector_id UUID,
  
  -- Configuration
  settings JSONB DEFAULT '{}',
  features_enabled JSONB DEFAULT '{}',
  access_rules JSONB DEFAULT '{}',
  
  -- Metadata
  avatar_url TEXT,
  banner_url TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_workspace_hierarchy CHECK (
    CASE 
      WHEN workspace_type = 'project' THEN parent_workspace_id IS NOT NULL
      ELSE true 
    END
  )
);

-- 5. Workspace members table (extends existing team structure)
CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Role and permissions
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  permissions JSONB DEFAULT '{}',
  access_level VARCHAR(20) DEFAULT 'standard',
  
  -- Status and dates
  status VARCHAR(20) DEFAULT 'active',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE,
  
  -- Settings
  notification_preferences JSONB DEFAULT '{}',
  workspace_settings JSONB DEFAULT '{}',
  
  -- Constraints
  UNIQUE(workspace_id, user_id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Workspace invitations table
CREATE TABLE public.workspace_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  
  -- Invitation details
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  invitation_token VARCHAR(255) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64'),
  
  -- Status and expiry
  status VARCHAR(20) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES auth.users(id),
  
  -- Permissions and message
  permissions JSONB DEFAULT '{}',
  personal_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_expiry CHECK (expires_at > created_at),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'cancelled'))
);

-- 7. Workspace projects table
CREATE TABLE public.workspace_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Project details
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  
  -- Project management
  status VARCHAR(20) DEFAULT 'planning',
  priority VARCHAR(20) DEFAULT 'medium',
  progress DECIMAL(5,2) DEFAULT 0.00,
  
  -- Dates and timeline
  start_date DATE,
  end_date DATE,
  deadline DATE,
  
  -- Team and resources
  project_manager_id UUID REFERENCES auth.users(id),
  budget DECIMAL(15,2),
  estimated_hours INTEGER,
  actual_hours INTEGER DEFAULT 0,
  
  -- Metadata
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_progress CHECK (progress >= 0 AND progress <= 100),
  CONSTRAINT valid_dates CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date),
  CONSTRAINT valid_status CHECK (status IN ('planning', 'active', 'completed', 'on_hold', 'cancelled'))
);

-- 8. Project tasks table
CREATE TABLE public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.workspace_projects(id) ON DELETE CASCADE,
  
  -- Task details
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  
  -- Task management
  status VARCHAR(20) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  progress DECIMAL(5,2) DEFAULT 0.00,
  
  -- Assignment and dates
  assigned_to UUID REFERENCES auth.users(id),
  assigned_by UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Effort estimation
  estimated_hours INTEGER,
  actual_hours INTEGER DEFAULT 0,
  
  -- Hierarchy
  parent_task_id UUID REFERENCES public.project_tasks(id),
  order_index INTEGER DEFAULT 0,
  
  -- Metadata
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_task_progress CHECK (progress >= 0 AND progress <= 100),
  CONSTRAINT valid_task_status CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled'))
);

-- 9. Task assignments table
CREATE TABLE public.task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
  assignee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Assignment details
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  role VARCHAR(50) DEFAULT 'executor',
  
  -- Status and dates
  status VARCHAR(20) DEFAULT 'pending',
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  
  -- Time tracking
  estimated_hours INTEGER,
  actual_hours INTEGER DEFAULT 0,
  
  -- Notes and feedback
  assignment_notes TEXT,
  completion_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(task_id, assignee_id),
  CONSTRAINT valid_assignment_status CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'rejected'))
);

-- 10. Workspace meetings table
CREATE TABLE public.workspace_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Meeting details
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  
  -- Schedule
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
  
  -- Meeting setup
  meeting_type VARCHAR(50) DEFAULT 'general',
  location TEXT,
  virtual_link TEXT,
  meeting_password VARCHAR(50),
  
  -- Organization
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'scheduled',
  
  -- Content
  agenda JSONB DEFAULT '[]',
  meeting_notes TEXT,
  recording_url TEXT,
  attachments JSONB DEFAULT '[]',
  
  -- Settings
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB,
  max_participants INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_meeting_times CHECK (start_time < end_time),
  CONSTRAINT valid_meeting_status CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled'))
);

-- 11. Meeting participants table
CREATE TABLE public.meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.workspace_meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Participation details
  role VARCHAR(50) DEFAULT 'attendee',
  status VARCHAR(20) DEFAULT 'invited',
  response VARCHAR(20),
  
  -- Attendance tracking
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  attendance_duration INTEGER DEFAULT 0,
  
  -- Notifications
  reminder_sent BOOLEAN DEFAULT false,
  invitation_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(meeting_id, user_id),
  CONSTRAINT valid_participant_status CHECK (status IN ('invited', 'accepted', 'declined', 'tentative', 'attended', 'no_show')),
  CONSTRAINT valid_response CHECK (response IN ('yes', 'no', 'maybe') OR response IS NULL)
);

-- 12. Team chat messages table
CREATE TABLE public.team_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Message details
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text',
  
  -- Threading
  parent_message_id UUID REFERENCES public.team_chat_messages(id),
  thread_id UUID,
  
  -- Rich content
  attachments JSONB DEFAULT '[]',
  mentions JSONB DEFAULT '[]',
  reactions JSONB DEFAULT '{}',
  
  -- Status
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  
  -- Channel/Room
  channel_name VARCHAR(100) DEFAULT 'general',
  is_private BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_message_type CHECK (message_type IN ('text', 'file', 'image', 'system', 'announcement')),
  CONSTRAINT non_empty_content CHECK (LENGTH(TRIM(content)) > 0 OR message_type != 'text')
);

-- 13. Workspace activity feed table
CREATE TABLE public.workspace_activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Activity details
  actor_id UUID REFERENCES auth.users(id),
  action_type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  
  -- Activity content
  activity_title VARCHAR(255) NOT NULL,
  activity_title_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  visibility_scope VARCHAR(20) DEFAULT 'workspace',
  
  -- Aggregation
  is_aggregated BOOLEAN DEFAULT false,
  aggregation_key VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_visibility CHECK (visibility_scope IN ('public', 'workspace', 'team', 'private'))
);

-- 14. Workspace settings table
CREATE TABLE public.workspace_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- General settings
  language VARCHAR(10) DEFAULT 'ar',
  timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  currency VARCHAR(10) DEFAULT 'SAR',
  
  -- Features
  features_enabled JSONB DEFAULT '{}',
  integrations JSONB DEFAULT '{}',
  
  -- Permissions and access
  default_member_permissions JSONB DEFAULT '{}',
  guest_access_enabled BOOLEAN DEFAULT false,
  public_join_enabled BOOLEAN DEFAULT false,
  
  -- Notifications
  notification_settings JSONB DEFAULT '{}',
  email_notifications JSONB DEFAULT '{}',
  
  -- Branding
  theme_settings JSONB DEFAULT '{}',
  custom_branding JSONB DEFAULT '{}',
  
  -- Security
  security_settings JSONB DEFAULT '{}',
  data_retention_days INTEGER DEFAULT 365,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(workspace_id)
);

-- 15. Workspace analytics table
CREATE TABLE public.workspace_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Metrics
  member_count INTEGER DEFAULT 0,
  active_members_count INTEGER DEFAULT 0,
  project_count INTEGER DEFAULT 0,
  task_count INTEGER DEFAULT 0,
  meeting_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  
  -- Activity metrics
  daily_active_users INTEGER DEFAULT 0,
  weekly_active_users INTEGER DEFAULT 0,
  monthly_active_users INTEGER DEFAULT 0,
  
  -- Engagement metrics
  avg_session_duration INTEGER DEFAULT 0,
  total_messages_today INTEGER DEFAULT 0,
  total_tasks_completed INTEGER DEFAULT 0,
  
  -- Performance metrics
  project_completion_rate DECIMAL(5,2) DEFAULT 0.00,
  average_task_completion_time INTEGER DEFAULT 0,
  meeting_attendance_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Calculated fields
  engagement_score DECIMAL(5,2) DEFAULT 0.00,
  productivity_score DECIMAL(5,2) DEFAULT 0.00,
  collaboration_score DECIMAL(5,2) DEFAULT 0.00,
  
  -- Metadata
  calculation_date DATE DEFAULT CURRENT_DATE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(workspace_id, calculation_date)
);

-- 16. Workspace files table
CREATE TABLE public.workspace_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- File details
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  
  -- Upload details
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  upload_session_id UUID,
  
  -- Organization
  folder_path TEXT DEFAULT '/',
  tags TEXT[],
  description TEXT,
  
  -- Permissions
  access_level VARCHAR(20) DEFAULT 'workspace',
  permissions JSONB DEFAULT '{}',
  
  -- Versioning
  version_number INTEGER DEFAULT 1,
  parent_file_id UUID REFERENCES public.workspace_files(id),
  is_current_version BOOLEAN DEFAULT true,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active',
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES auth.users(id),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  thumbnail_url TEXT,
  preview_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_file_size CHECK (file_size > 0),
  CONSTRAINT valid_access_level CHECK (access_level IN ('public', 'workspace', 'team', 'private')),
  CONSTRAINT valid_file_status CHECK (status IN ('active', 'archived', 'processing', 'failed'))
);

-- Create indexes for better performance
CREATE INDEX idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX idx_workspaces_type ON public.workspaces(workspace_type);
CREATE INDEX idx_workspaces_team ON public.workspaces(innovation_team_id);
CREATE INDEX idx_workspaces_parent ON public.workspaces(parent_workspace_id);

CREATE INDEX idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX idx_workspace_members_active ON public.workspace_members(workspace_id, status) WHERE status = 'active';

CREATE INDEX idx_workspace_projects_workspace ON public.workspace_projects(workspace_id);
CREATE INDEX idx_workspace_projects_manager ON public.workspace_projects(project_manager_id);
CREATE INDEX idx_workspace_projects_status ON public.workspace_projects(status);

CREATE INDEX idx_project_tasks_project ON public.project_tasks(project_id);
CREATE INDEX idx_project_tasks_assigned ON public.project_tasks(assigned_to);
CREATE INDEX idx_project_tasks_status ON public.project_tasks(status);

CREATE INDEX idx_workspace_meetings_workspace ON public.workspace_meetings(workspace_id);
CREATE INDEX idx_workspace_meetings_organizer ON public.workspace_meetings(organizer_id);
CREATE INDEX idx_workspace_meetings_time ON public.workspace_meetings(start_time);

CREATE INDEX idx_team_chat_workspace ON public.team_chat_messages(workspace_id);
CREATE INDEX idx_team_chat_sender ON public.team_chat_messages(sender_id);
CREATE INDEX idx_team_chat_created ON public.team_chat_messages(created_at);
CREATE INDEX idx_team_chat_channel ON public.team_chat_messages(workspace_id, channel_name);

CREATE INDEX idx_activity_feed_workspace ON public.workspace_activity_feed(workspace_id);
CREATE INDEX idx_activity_feed_actor ON public.workspace_activity_feed(actor_id);
CREATE INDEX idx_activity_feed_created ON public.workspace_activity_feed(created_at);

CREATE INDEX idx_workspace_files_workspace ON public.workspace_files(workspace_id);
CREATE INDEX idx_workspace_files_uploader ON public.workspace_files(uploaded_by);
CREATE INDEX idx_workspace_files_folder ON public.workspace_files(workspace_id, folder_path);

-- Enable Row Level Security on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspaces table
CREATE POLICY "Users can view workspaces they have access to"
ON public.workspaces FOR SELECT
USING (
  owner_id = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = workspaces.id 
    AND user_id = auth.uid() 
    AND status = 'active'
  )
  OR 
  privacy_level = 'public'
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can create their own workspaces"
ON public.workspaces FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Workspace owners and admins can update workspaces"
ON public.workspaces FOR UPDATE
USING (
  owner_id = auth.uid() 
  OR 
  has_role(auth.uid(), 'admin'::app_role)
  OR
  EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = workspaces.id 
    AND user_id = auth.uid() 
    AND role IN ('admin', 'manager')
    AND status = 'active'
  )
);

-- RLS Policies for workspace_members table
CREATE POLICY "Users can view workspace members for accessible workspaces"
ON public.workspace_members FOR SELECT
USING (
  user_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.workspaces w 
    WHERE w.id = workspace_id 
    AND (
      w.owner_id = auth.uid() 
      OR 
      EXISTS (
        SELECT 1 FROM public.workspace_members wm2 
        WHERE wm2.workspace_id = w.id 
        AND wm2.user_id = auth.uid() 
        AND wm2.status = 'active'
      )
    )
  )
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Workspace admins can manage members"
ON public.workspace_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.workspaces w 
    WHERE w.id = workspace_id 
    AND (
      w.owner_id = auth.uid() 
      OR 
      has_role(auth.uid(), 'admin'::app_role)
      OR
      EXISTS (
        SELECT 1 FROM public.workspace_members wm2 
        WHERE wm2.workspace_id = w.id 
        AND wm2.user_id = auth.uid() 
        AND wm2.role IN ('admin', 'manager')
        AND wm2.status = 'active'
      )
    )
  )
);

-- RLS Policies for workspace_projects table
CREATE POLICY "Users can view projects in accessible workspaces"
ON public.workspace_projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_projects.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
  OR
  project_manager_id = auth.uid()
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Workspace members can create projects"
ON public.workspace_projects FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_projects.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
    AND wm.role IN ('admin', 'manager', 'member')
  )
);

-- RLS Policies for team_chat_messages table
CREATE POLICY "Users can view messages in accessible workspaces"
ON public.team_chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = team_chat_messages.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
  OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can send messages in accessible workspaces"
ON public.team_chat_messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = team_chat_messages.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
);

-- Create trigger functions for maintaining analytics
CREATE OR REPLACE FUNCTION update_workspace_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update member count when workspace_members changes
  IF TG_TABLE_NAME = 'workspace_members' THEN
    INSERT INTO public.workspace_analytics (workspace_id, member_count, active_members_count)
    SELECT 
      NEW.workspace_id,
      COUNT(*),
      COUNT(*) FILTER (WHERE status = 'active')
    FROM public.workspace_members 
    WHERE workspace_id = NEW.workspace_id
    ON CONFLICT (workspace_id, calculation_date) 
    DO UPDATE SET 
      member_count = EXCLUDED.member_count,
      active_members_count = EXCLUDED.active_members_count,
      last_updated = NOW();
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER update_workspace_analytics_on_member_change
  AFTER INSERT OR UPDATE OR DELETE ON public.workspace_members
  FOR EACH ROW EXECUTE FUNCTION update_workspace_analytics();

-- Create function to check workspace access
CREATE OR REPLACE FUNCTION has_workspace_access(workspace_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspaces w
    LEFT JOIN public.workspace_members wm ON w.id = wm.workspace_id
    WHERE w.id = workspace_uuid
    AND (
      w.owner_id = user_uuid
      OR
      (wm.user_id = user_uuid AND wm.status = 'active')
      OR
      w.privacy_level = 'public'
      OR
      has_role(user_uuid, 'admin'::app_role)
    )
  );
$$;