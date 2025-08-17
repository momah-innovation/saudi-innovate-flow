-- Add missing workspace collaboration tables

-- 1. Add team_id to team_chat_messages for better organization
ALTER TABLE team_chat_messages ADD COLUMN team_id UUID REFERENCES workspace_teams(id);

-- 2. Create message reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES team_chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- 3. Create message read status table
CREATE TABLE IF NOT EXISTS message_read_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES team_chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- 4. Create document operations table for collaborative editing
CREATE TABLE IF NOT EXISTS document_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES workspace_files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('insert', 'delete', 'format')),
  position INTEGER NOT NULL,
  content TEXT,
  length INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  applied BOOLEAN DEFAULT false,
  sequence_number BIGINT
);

-- 5. Create document sessions table for live collaboration
CREATE TABLE IF NOT EXISTS document_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES workspace_files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  cursor_position INTEGER,
  selection_start INTEGER,
  selection_end INTEGER,
  UNIQUE(document_id, user_id)
);

-- 6. Create document shares table
CREATE TABLE IF NOT EXISTS document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES workspace_files(id) ON DELETE CASCADE,
  shared_with_type VARCHAR(10) NOT NULL CHECK (shared_with_type IN ('user', 'team')),
  shared_with_id UUID NOT NULL,
  permission_level VARCHAR(10) NOT NULL CHECK (permission_level IN ('read', 'write', 'admin')),
  shared_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(document_id, shared_with_type, shared_with_id)
);

-- Enable RLS on new tables
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_reactions
CREATE POLICY "Users can manage their own reactions" ON message_reactions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view all reactions" ON message_reactions
  FOR SELECT USING (true);

-- RLS Policies for message_read_status
CREATE POLICY "Users can manage their own read status" ON message_read_status
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for document_operations
CREATE POLICY "Users can create operations on accessible documents" ON document_operations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_files wf
      JOIN workspace_members wm ON wf.workspace_id = wm.workspace_id
      WHERE wf.id = document_id AND wm.user_id = auth.uid() AND wm.status = 'active'
    )
  );

CREATE POLICY "Users can view operations on accessible documents" ON document_operations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_files wf
      JOIN workspace_members wm ON wf.workspace_id = wm.workspace_id
      WHERE wf.id = document_id AND wm.user_id = auth.uid() AND wm.status = 'active'
    )
  );

-- RLS Policies for document_sessions
CREATE POLICY "Users can manage their own document sessions" ON document_sessions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view sessions on accessible documents" ON document_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_files wf
      JOIN workspace_members wm ON wf.workspace_id = wm.workspace_id
      WHERE wf.id = document_id AND wm.user_id = auth.uid() AND wm.status = 'active'
    )
  );

-- RLS Policies for document_shares
CREATE POLICY "Users can manage shares they created" ON document_shares
  FOR ALL USING (shared_by = auth.uid());

CREATE POLICY "Users can view shares for accessible documents" ON document_shares
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_files wf
      JOIN workspace_members wm ON wf.workspace_id = wm.workspace_id
      WHERE wf.id = document_id AND wm.user_id = auth.uid() AND wm.status = 'active'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX idx_message_read_status_message_id ON message_read_status(message_id);
CREATE INDEX idx_document_operations_document_id ON document_operations(document_id);
CREATE INDEX idx_document_operations_timestamp ON document_operations(timestamp);
CREATE INDEX idx_document_sessions_document_id ON document_sessions(document_id);
CREATE INDEX idx_document_shares_document_id ON document_shares(document_id);