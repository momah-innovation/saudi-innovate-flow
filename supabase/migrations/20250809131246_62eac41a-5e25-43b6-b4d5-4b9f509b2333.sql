-- Real-time Collaboration System Tables

-- Activity Events (using existing notifications table structure as reference)
CREATE TABLE IF NOT EXISTS public.activity_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('create', 'update', 'delete', 'comment', 'like', 'share', 'join', 'leave')),
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('challenge', 'idea', 'event', 'opportunity', 'campaign', 'workspace', 'project')),
  entity_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  privacy_level VARCHAR(20) DEFAULT 'public' CHECK (privacy_level IN ('public', 'organization', 'team', 'project', 'private')),
  visibility_scope JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration Spaces
CREATE TABLE IF NOT EXISTS public.collaboration_spaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  space_type VARCHAR(20) NOT NULL CHECK (space_type IN ('global', 'organization', 'team', 'project', 'direct')),
  privacy_level VARCHAR(20) DEFAULT 'public' CHECK (privacy_level IN ('public', 'organization', 'team', 'project', 'private')),
  participants UUID[] DEFAULT '{}',
  admins UUID[] DEFAULT '{}',
  settings JSONB DEFAULT '{"allow_file_uploads": true, "allow_mentions": true, "require_approval_for_new_members": false}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration Messages
CREATE TABLE IF NOT EXISTS public.collaboration_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'mention', 'system', 'reaction')),
  thread_id UUID,
  reply_to UUID REFERENCES public.collaboration_messages(id) ON DELETE SET NULL,
  space_id UUID REFERENCES public.collaboration_spaces(id) ON DELETE CASCADE,
  entity_type VARCHAR(50),
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Notifications (extending existing notifications pattern)
CREATE TABLE IF NOT EXISTS public.realtime_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  channels TEXT[] DEFAULT ARRAY['in_app'],
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Presence
CREATE TABLE IF NOT EXISTS public.user_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  current_location JSONB DEFAULT '{}',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- Live Documents
CREATE TABLE IF NOT EXISTS public.live_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content JSONB DEFAULT '{}',
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('idea', 'challenge_submission', 'project_plan', 'proposal', 'notes')),
  entity_id UUID,
  collaborators UUID[] DEFAULT '{}',
  current_editors JSONB DEFAULT '[]',
  version INTEGER DEFAULT 1,
  privacy_level VARCHAR(20) DEFAULT 'private' CHECK (privacy_level IN ('public', 'organization', 'team', 'project', 'private')),
  permissions JSONB DEFAULT '{"can_edit": [], "can_comment": [], "can_view": []}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live Edits
CREATE TABLE IF NOT EXISTS public.live_edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.live_documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('insert', 'delete', 'format', 'move')),
  position INTEGER NOT NULL,
  content TEXT,
  length INTEGER,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_edits ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Activity Events
CREATE POLICY "Users can view public activities" ON public.activity_events
  FOR SELECT USING (
    privacy_level = 'public' OR 
    user_id = auth.uid() OR
    (privacy_level = 'organization' AND auth.uid() IS NOT NULL)
  );

CREATE POLICY "Users can create their own activities" ON public.activity_events
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Collaboration Spaces
CREATE POLICY "Users can view spaces they participate in" ON public.collaboration_spaces
  FOR SELECT USING (
    privacy_level = 'public' OR 
    created_by = auth.uid() OR
    auth.uid() = ANY(participants) OR
    auth.uid() = ANY(admins)
  );

CREATE POLICY "Users can create collaboration spaces" ON public.collaboration_spaces
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Space admins can update spaces" ON public.collaboration_spaces
  FOR UPDATE USING (
    created_by = auth.uid() OR 
    auth.uid() = ANY(admins)
  );

-- Collaboration Messages
CREATE POLICY "Users can view messages in accessible spaces" ON public.collaboration_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collaboration_spaces cs 
      WHERE cs.id = collaboration_messages.space_id 
      AND (
        cs.privacy_level = 'public' OR 
        cs.created_by = auth.uid() OR
        auth.uid() = ANY(cs.participants) OR
        auth.uid() = ANY(cs.admins)
      )
    )
  );

CREATE POLICY "Users can create messages in accessible spaces" ON public.collaboration_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.collaboration_spaces cs 
      WHERE cs.id = collaboration_messages.space_id 
      AND (
        cs.privacy_level = 'public' OR 
        cs.created_by = auth.uid() OR
        auth.uid() = ANY(cs.participants) OR
        auth.uid() = ANY(cs.admins)
      )
    )
  );

-- Real-time Notifications
CREATE POLICY "Users can view their own notifications" ON public.realtime_notifications
  FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.realtime_notifications
  FOR UPDATE USING (recipient_id = auth.uid());

-- User Presence
CREATE POLICY "Users can view all presence data" ON public.user_presence
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own presence" ON public.user_presence
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Live Documents
CREATE POLICY "Users can view documents based on permissions" ON public.live_documents
  FOR SELECT USING (
    privacy_level = 'public' OR
    auth.uid() = ANY(collaborators) OR
    auth.uid()::text = ANY(SELECT jsonb_array_elements_text(permissions->'can_view')) OR
    auth.uid()::text = ANY(SELECT jsonb_array_elements_text(permissions->'can_edit')) OR
    auth.uid()::text = ANY(SELECT jsonb_array_elements_text(permissions->'can_comment'))
  );

-- Live Edits
CREATE POLICY "Users can view edits for accessible documents" ON public.live_edits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.live_documents ld 
      WHERE ld.id = live_edits.document_id 
      AND (
        ld.privacy_level = 'public' OR
        auth.uid() = ANY(ld.collaborators) OR
        auth.uid()::text = ANY(SELECT jsonb_array_elements_text(ld.permissions->'can_view'))
      )
    )
  );

CREATE POLICY "Users can create edits for editable documents" ON public.live_edits
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.live_documents ld 
      WHERE ld.id = live_edits.document_id 
      AND (
        auth.uid() = ANY(ld.collaborators) OR
        auth.uid()::text = ANY(SELECT jsonb_array_elements_text(ld.permissions->'can_edit'))
      )
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_events_user_id ON public.activity_events(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_entity ON public.activity_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_created_at ON public.activity_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_collaboration_messages_space_id ON public.collaboration_messages(space_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_messages_sender_id ON public.collaboration_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_messages_created_at ON public.collaboration_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_realtime_notifications_recipient ON public.realtime_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_realtime_notifications_created_at ON public.realtime_notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_presence_user_id ON public.user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON public.user_presence(status);

CREATE INDEX IF NOT EXISTS idx_live_edits_document_id ON public.live_edits(document_id);
CREATE INDEX IF NOT EXISTS idx_live_edits_timestamp ON public.live_edits(timestamp DESC);

-- Enable realtime for collaboration tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collaboration_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.realtime_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_edits;