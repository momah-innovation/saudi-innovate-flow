-- Essential Workspace Database Enhancements
-- Add core workspace functionality without conflicting with existing structures

-- Add missing workspace type columns to workspaces table
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS workspace_type VARCHAR(50) DEFAULT 'user';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS privacy_level VARCHAR(20) DEFAULT 'private';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'free';

-- Enhance workspace_members table with permissions
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}';

-- Add collaboration features to team_chat_messages
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'text';
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS parent_message_id UUID;
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS mentions JSONB DEFAULT '[]';
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '{}';
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.team_chat_messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE;

-- Add file collaboration features
ALTER TABLE public.workspace_files ADD COLUMN IF NOT EXISTS file_category VARCHAR(50) DEFAULT 'document';
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

-- Create essential performance indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_privacy_level ON public.workspaces(privacy_level);
CREATE INDEX IF NOT EXISTS idx_workspaces_workspace_type ON public.workspaces(workspace_type);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_user ON public.workspace_members(workspace_id, user_id);
CREATE INDEX IF NOT EXISTS idx_team_chat_messages_team_id ON public.team_chat_messages(team_id);
CREATE INDEX IF NOT EXISTS idx_workspace_files_workspace_id ON public.workspace_files(workspace_id);

-- Enable realtime for key workspace tables
ALTER TABLE public.workspaces REPLICA IDENTITY FULL;
ALTER TABLE public.workspace_members REPLICA IDENTITY FULL;
ALTER TABLE public.team_chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.workspace_activity_feed REPLICA IDENTITY FULL;