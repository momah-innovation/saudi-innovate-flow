-- Enhanced Workspace Database Migration
-- This migration enhances the existing workspace system with improved relationships,
-- RLS policies, and workspace-specific functions for complete workspace functionality

-- Add missing columns to existing tables for better workspace integration
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS workspace_type VARCHAR(50) DEFAULT 'user';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS privacy_level VARCHAR(20) DEFAULT 'private';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'free';

-- Enhance workspace_members table
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}';

-- Enhance workspace_projects table  
ALTER TABLE public.workspace_projects ADD COLUMN IF NOT EXISTS project_type VARCHAR(50) DEFAULT 'general';
ALTER TABLE public.workspace_projects ADD COLUMN IF NOT EXISTS privacy_level VARCHAR(20) DEFAULT 'team';
ALTER TABLE public.workspace_projects ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';
ALTER TABLE public.workspace_projects ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '{}';

-- Enhance project_tasks table
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS task_type VARCHAR(50) DEFAULT 'general';
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS complexity_level VARCHAR(20) DEFAULT 'medium';
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS estimated_hours INTEGER;
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS actual_hours INTEGER;
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS dependencies JSONB DEFAULT '[]';
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';

-- Enhance task_assignments table
ALTER TABLE public.task_assignments ADD COLUMN IF NOT EXISTS assignment_type VARCHAR(50) DEFAULT 'primary';
ALTER TABLE public.task_assignments ADD COLUMN IF NOT EXISTS workload_percentage INTEGER DEFAULT 100;
ALTER TABLE public.task_assignments ADD COLUMN IF NOT EXISTS skills_required JSONB DEFAULT '[]';

-- Enhance workspace_meetings table
ALTER TABLE public.workspace_meetings ADD COLUMN IF NOT EXISTS meeting_type VARCHAR(50) DEFAULT 'general';
ALTER TABLE public.workspace_meetings ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
ALTER TABLE public.workspace_meetings ADD COLUMN IF NOT EXISTS recurrence_pattern JSONB DEFAULT '{}';
ALTER TABLE public.workspace_meetings ADD COLUMN IF NOT EXISTS recording_settings JSONB DEFAULT '{}';
ALTER TABLE public.workspace_meetings ADD COLUMN IF NOT EXISTS agenda JSONB DEFAULT '{}';

-- Enhance meeting_participants table
ALTER TABLE public.meeting_participants ADD COLUMN IF NOT EXISTS participant_type VARCHAR(50) DEFAULT 'attendee';
ALTER TABLE public.meeting_participants ADD COLUMN IF NOT EXISTS attendance_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE public.meeting_participants ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.meeting_participants ADD COLUMN IF NOT EXISTS left_at TIMESTAMP WITH TIME ZONE;

-- Enhance team_chat_messages table
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'text';
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS parent_message_id UUID;
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS mentions JSONB DEFAULT '[]';
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '{}';
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE;

-- Enhance workspace_files table
ALTER TABLE public.workspace_files ADD COLUMN IF NOT EXISTS file_category VARCHAR(50) DEFAULT 'document';
ALTER TABLE public.workspace_files ADD COLUMN IF NOT EXISTS access_level VARCHAR(20) DEFAULT 'team';
ALTER TABLE public.workspace_files ADD COLUMN IF NOT EXISTS version_number INTEGER DEFAULT 1;
ALTER TABLE public.workspace_files ADD COLUMN IF NOT EXISTS is_current_version BOOLEAN DEFAULT true;
ALTER TABLE public.workspace_files ADD COLUMN IF NOT EXISTS collaboration_settings JSONB DEFAULT '{}';

-- Create workspace-specific security function
CREATE OR REPLACE FUNCTION public.has_workspace_permission(
  workspace_uuid UUID, 
  user_uuid UUID, 
  required_permission TEXT DEFAULT 'read'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
  workspace_privacy TEXT;
  is_owner BOOLEAN;
BEGIN
  -- Check if user is workspace owner
  SELECT owner_id = user_uuid INTO is_owner
  FROM public.workspaces 
  WHERE id = workspace_uuid;
  
  IF is_owner THEN
    RETURN true;
  END IF;
  
  -- Get workspace privacy level
  SELECT privacy_level INTO workspace_privacy
  FROM public.workspaces 
  WHERE id = workspace_uuid;
  
  -- Public workspaces allow read access to authenticated users
  IF workspace_privacy = 'public' AND required_permission = 'read' AND user_uuid IS NOT NULL THEN
    RETURN true;
  END IF;
  
  -- Check user membership and role
  SELECT role INTO user_role
  FROM public.workspace_members 
  WHERE workspace_id = workspace_uuid 
    AND user_id = user_uuid 
    AND status = 'active';
  
  IF user_role IS NULL THEN
    RETURN false;
  END IF;
  
  -- Permission logic based on role and required permission
  CASE required_permission
    WHEN 'read' THEN RETURN true;
    WHEN 'write' THEN RETURN user_role IN ('admin', 'editor', 'manager');
    WHEN 'admin' THEN RETURN user_role IN ('admin', 'owner');
    WHEN 'delete' THEN RETURN user_role IN ('admin', 'owner');
    ELSE RETURN false;
  END CASE;
END;
$$;

-- Create workspace activity logging function
CREATE OR REPLACE FUNCTION public.log_workspace_activity(
  workspace_uuid UUID,
  user_uuid UUID,
  activity_type TEXT,
  entity_type TEXT DEFAULT NULL,
  entity_id UUID DEFAULT NULL,
  activity_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.workspace_activity_feed (
    workspace_id,
    user_id,
    activity_type,
    entity_type,
    entity_id,
    activity_data,
    created_at
  ) VALUES (
    workspace_uuid,
    user_uuid,
    activity_type,
    entity_type,
    entity_id,
    activity_data,
    NOW()
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Enhanced RLS Policies for workspaces
DROP POLICY IF EXISTS "Users can view accessible workspaces" ON public.workspaces;
CREATE POLICY "Users can view accessible workspaces" 
ON public.workspaces 
FOR SELECT 
USING (
  owner_id = auth.uid() 
  OR privacy_level = 'public'
  OR has_workspace_permission(id, auth.uid(), 'read')
);

DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
CREATE POLICY "Users can create workspaces" 
ON public.workspaces 
FOR INSERT 
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Workspace owners can update workspaces" ON public.workspaces;
CREATE POLICY "Workspace owners can update workspaces" 
ON public.workspaces 
FOR UPDATE 
USING (has_workspace_permission(id, auth.uid(), 'admin'));

-- Enhanced RLS Policies for workspace_projects
DROP POLICY IF EXISTS "Users can view workspace projects" ON public.workspace_projects;
CREATE POLICY "Users can view workspace projects" 
ON public.workspace_projects 
FOR SELECT 
USING (has_workspace_permission(workspace_id, auth.uid(), 'read'));

DROP POLICY IF EXISTS "Users can create workspace projects" ON public.workspace_projects;
CREATE POLICY "Users can create workspace projects" 
ON public.workspace_projects 
FOR INSERT 
WITH CHECK (has_workspace_permission(workspace_id, auth.uid(), 'write'));

-- Enhanced RLS Policies for project_tasks
DROP POLICY IF EXISTS "Users can view project tasks" ON public.project_tasks;
CREATE POLICY "Users can view project tasks" 
ON public.project_tasks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_projects wp
    WHERE wp.id = project_tasks.project_id
    AND has_workspace_permission(wp.workspace_id, auth.uid(), 'read')
  )
);

DROP POLICY IF EXISTS "Users can manage project tasks" ON public.project_tasks;
CREATE POLICY "Users can manage project tasks" 
ON public.project_tasks 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_projects wp
    WHERE wp.id = project_tasks.project_id
    AND has_workspace_permission(wp.workspace_id, auth.uid(), 'write')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_projects wp
    WHERE wp.id = project_tasks.project_id
    AND has_workspace_permission(wp.workspace_id, auth.uid(), 'write')
  )
);

-- Enhanced RLS Policies for team_chat_messages
DROP POLICY IF EXISTS "Users can view team chat messages" ON public.team_chat_messages;
CREATE POLICY "Users can view team chat messages" 
ON public.team_chat_messages 
FOR SELECT 
USING (
  team_id IS NULL OR
  EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = team_chat_messages.team_id
    AND tm.user_id = auth.uid()
    AND tm.status = 'active'
  )
);

DROP POLICY IF EXISTS "Users can create team chat messages" ON public.team_chat_messages;
CREATE POLICY "Users can create team chat messages" 
ON public.team_chat_messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND
  (team_id IS NULL OR
   EXISTS (
     SELECT 1 FROM public.team_members tm
     WHERE tm.team_id = team_chat_messages.team_id
     AND tm.user_id = auth.uid()
     AND tm.status = 'active'
   ))
);

-- Enhanced RLS Policies for workspace_files
DROP POLICY IF EXISTS "Users can view workspace files" ON public.workspace_files;
CREATE POLICY "Users can view workspace files" 
ON public.workspace_files 
FOR SELECT 
USING (
  access_level = 'public' OR
  has_workspace_permission(workspace_id, auth.uid(), 'read') OR
  uploader_id = auth.uid()
);

DROP POLICY IF EXISTS "Users can upload workspace files" ON public.workspace_files;
CREATE POLICY "Users can upload workspace files" 
ON public.workspace_files 
FOR INSERT 
WITH CHECK (
  uploader_id = auth.uid() AND
  has_workspace_permission(workspace_id, auth.uid(), 'write')
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_privacy_level ON public.workspaces(privacy_level);
CREATE INDEX IF NOT EXISTS idx_workspaces_workspace_type ON public.workspaces(workspace_type);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_user ON public.workspace_members(workspace_id, user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_status ON public.workspace_members(status);
CREATE INDEX IF NOT EXISTS idx_workspace_projects_workspace_id ON public.workspace_projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assigned_to ON public.project_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_task_assignments_task_user ON public.task_assignments(task_id, assigned_to);
CREATE INDEX IF NOT EXISTS idx_workspace_meetings_workspace_id ON public.workspace_meetings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting_user ON public.meeting_participants(meeting_id, user_id);
CREATE INDEX IF NOT EXISTS idx_team_chat_messages_team_id ON public.team_chat_messages(team_id);
CREATE INDEX IF NOT EXISTS idx_team_chat_messages_sender_id ON public.team_chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_workspace_activity_feed_workspace_id ON public.workspace_activity_feed(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_files_workspace_id ON public.workspace_files(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_files_uploader_id ON public.workspace_files(uploader_id);

-- Create triggers for activity logging
CREATE OR REPLACE FUNCTION public.trigger_workspace_activity_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log activity for workspace-related changes
  IF TG_TABLE_NAME = 'workspace_projects' THEN
    PERFORM log_workspace_activity(
      NEW.workspace_id,
      auth.uid(),
      CASE TG_OP 
        WHEN 'INSERT' THEN 'project_created'
        WHEN 'UPDATE' THEN 'project_updated'
        WHEN 'DELETE' THEN 'project_deleted'
      END,
      'project',
      NEW.id,
      jsonb_build_object('project_name', NEW.title)
    );
  ELSIF TG_TABLE_NAME = 'project_tasks' THEN
    PERFORM log_workspace_activity(
      (SELECT workspace_id FROM workspace_projects WHERE id = NEW.project_id),
      auth.uid(),
      CASE TG_OP 
        WHEN 'INSERT' THEN 'task_created'
        WHEN 'UPDATE' THEN 'task_updated'
        WHEN 'DELETE' THEN 'task_deleted'
      END,
      'task',
      NEW.id,
      jsonb_build_object('task_title', NEW.title, 'project_id', NEW.project_id)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create activity logging triggers
DROP TRIGGER IF EXISTS workspace_projects_activity_trigger ON public.workspace_projects;
CREATE TRIGGER workspace_projects_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.workspace_projects
  FOR EACH ROW EXECUTE FUNCTION public.trigger_workspace_activity_log();

DROP TRIGGER IF EXISTS project_tasks_activity_trigger ON public.project_tasks;  
CREATE TRIGGER project_tasks_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.project_tasks
  FOR EACH ROW EXECUTE FUNCTION public.trigger_workspace_activity_log();

-- Enable realtime for workspace tables
ALTER TABLE public.workspaces REPLICA IDENTITY FULL;
ALTER TABLE public.workspace_members REPLICA IDENTITY FULL;
ALTER TABLE public.workspace_projects REPLICA IDENTITY FULL;
ALTER TABLE public.project_tasks REPLICA IDENTITY FULL;
ALTER TABLE public.team_chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.workspace_activity_feed REPLICA IDENTITY FULL;
ALTER TABLE public.workspace_files REPLICA IDENTITY FULL;