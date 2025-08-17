-- Create missing tables for team collaboration features

-- Create workspace_teams table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.workspace_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.workspace_teams ENABLE ROW LEVEL SECURITY;

-- Create policies for workspace_teams
CREATE POLICY "Users can view teams in their workspaces" 
ON public.workspace_teams 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_teams.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
);

CREATE POLICY "Workspace members can create teams" 
ON public.workspace_teams 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm 
    WHERE wm.workspace_id = workspace_teams.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.status = 'active'
  )
);

-- Create team_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  status VARCHAR(50) DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Users can view team members" 
ON public.team_members 
FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.team_members tm 
    WHERE tm.team_id = team_members.team_id 
    AND tm.user_id = auth.uid() 
    AND tm.status = 'active'
  )
);

-- Create message_reactions table
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL,
  user_id UUID NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Enable RLS
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for message_reactions
CREATE POLICY "Users can manage their own reactions" 
ON public.message_reactions 
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create message_read_status table
CREATE TABLE IF NOT EXISTS public.message_read_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL,
  user_id UUID NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS
ALTER TABLE public.message_read_status ENABLE ROW LEVEL SECURITY;

-- Create policies for message_read_status
CREATE POLICY "Users can manage their own read status" 
ON public.message_read_status 
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create document_operations table
CREATE TABLE IF NOT EXISTS public.document_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  user_id UUID NOT NULL,
  operation_type VARCHAR(50) NOT NULL,
  operation_data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_operations ENABLE ROW LEVEL SECURITY;

-- Create policies for document_operations
CREATE POLICY "Users can create document operations" 
ON public.document_operations 
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view document operations for accessible documents" 
ON public.document_operations 
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workspace_files wf
    JOIN public.workspace_members wm ON wf.workspace_id = wm.workspace_id
    WHERE wf.id = document_operations.document_id
    AND wm.user_id = auth.uid()
    AND wm.status = 'active'
  )
);

-- Create document_sessions table
CREATE TABLE IF NOT EXISTS public.document_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  user_id UUID NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  cursor_position JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.document_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for document_sessions
CREATE POLICY "Users can manage their own sessions" 
ON public.document_sessions 
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create document_shares table
CREATE TABLE IF NOT EXISTS public.document_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  shared_by UUID NOT NULL,
  shared_with UUID,
  shared_with_email VARCHAR(255),
  permission_level VARCHAR(50) DEFAULT 'read',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

-- Create policies for document_shares
CREATE POLICY "Users can manage shares they created" 
ON public.document_shares 
FOR ALL
USING (shared_by = auth.uid())
WITH CHECK (shared_by = auth.uid());

CREATE POLICY "Users can view shares for them" 
ON public.document_shares 
FOR SELECT
USING (shared_with = auth.uid());

-- Add team_id column to team_chat_messages if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'team_chat_messages' 
        AND column_name = 'team_id'
    ) THEN
        ALTER TABLE public.team_chat_messages ADD COLUMN team_id UUID;
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workspace_teams_workspace_id ON public.workspace_teams(workspace_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_status_message_id ON public.message_read_status(message_id);
CREATE INDEX IF NOT EXISTS idx_document_operations_document_id ON public.document_operations(document_id);
CREATE INDEX IF NOT EXISTS idx_document_sessions_document_id ON public.document_sessions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_shares_document_id ON public.document_shares(document_id);