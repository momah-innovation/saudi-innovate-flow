-- Drop existing policies that conflict
DROP POLICY IF EXISTS "Users can view comments on ideas they have access to" ON public.idea_comments;
DROP POLICY IF EXISTS "Users can create comments on accessible ideas" ON public.idea_comments;
DROP POLICY IF EXISTS "Users can view attachments on accessible ideas" ON public.idea_attachments;
DROP POLICY IF EXISTS "Users can upload attachments to accessible ideas" ON public.idea_attachments;

-- Check if tables exist before creating them
DO $$
BEGIN
    -- Create tables only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_comments') THEN
        CREATE TABLE public.idea_comments (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            author_id UUID NOT NULL,
            parent_comment_id UUID REFERENCES public.idea_comments(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            is_internal BOOLEAN DEFAULT false,
            comment_type VARCHAR(50) DEFAULT 'general',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_attachments') THEN
        CREATE TABLE public.idea_attachments (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            uploaded_by UUID NOT NULL,
            file_name VARCHAR(255) NOT NULL,
            file_path TEXT NOT NULL,
            file_size BIGINT,
            file_type VARCHAR(100),
            description TEXT,
            is_public BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        ALTER TABLE public.idea_attachments ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_workflow_states') THEN
        CREATE TABLE public.idea_workflow_states (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            from_status VARCHAR(50),
            to_status VARCHAR(50) NOT NULL,
            triggered_by UUID NOT NULL,
            reason TEXT,
            metadata JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        ALTER TABLE public.idea_workflow_states ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_assignments') THEN
        CREATE TABLE public.idea_assignments (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            assigned_to UUID NOT NULL,
            assigned_by UUID NOT NULL,
            assignment_type VARCHAR(50) NOT NULL,
            due_date DATE,
            status VARCHAR(50) DEFAULT 'pending',
            priority VARCHAR(20) DEFAULT 'medium',
            notes TEXT,
            completed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        ALTER TABLE public.idea_assignments ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_notifications') THEN
        CREATE TABLE public.idea_notifications (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            recipient_id UUID NOT NULL,
            sender_id UUID,
            notification_type VARCHAR(50) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT false,
            data JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        ALTER TABLE public.idea_notifications ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_versions') THEN
        CREATE TABLE public.idea_versions (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            version_number INTEGER NOT NULL,
            changes_summary TEXT,
            changed_by UUID NOT NULL,
            field_changes JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        ALTER TABLE public.idea_versions ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_tags') THEN
        CREATE TABLE public.idea_tags (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            description TEXT,
            color VARCHAR(7),
            category VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        ALTER TABLE public.idea_tags ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_tag_links') THEN
        CREATE TABLE public.idea_tag_links (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            tag_id UUID NOT NULL REFERENCES public.idea_tags(id) ON DELETE CASCADE,
            added_by UUID NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            UNIQUE(idea_id, tag_id)
        );
        ALTER TABLE public.idea_tag_links ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_collaboration_teams') THEN
        CREATE TABLE public.idea_collaboration_teams (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            member_id UUID NOT NULL,
            role VARCHAR(50) NOT NULL,
            permissions JSONB,
            added_by UUID NOT NULL,
            joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            status VARCHAR(20) DEFAULT 'active',
            UNIQUE(idea_id, member_id)
        );
        ALTER TABLE public.idea_collaboration_teams ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_lifecycle_milestones') THEN
        CREATE TABLE public.idea_lifecycle_milestones (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            milestone_type VARCHAR(50) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            achieved_date TIMESTAMP WITH TIME ZONE,
            target_date DATE,
            is_required BOOLEAN DEFAULT true,
            order_sequence INTEGER,
            status VARCHAR(20) DEFAULT 'pending',
            achieved_by UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        ALTER TABLE public.idea_lifecycle_milestones ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_approval_workflows') THEN
        CREATE TABLE public.idea_approval_workflows (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            approver_id UUID NOT NULL,
            approval_level INTEGER NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            decision_date TIMESTAMP WITH TIME ZONE,
            decision_reason TEXT,
            delegation_to UUID,
            is_required BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        ALTER TABLE public.idea_approval_workflows ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_analytics') THEN
        CREATE TABLE public.idea_analytics (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
            metric_name VARCHAR(100) NOT NULL,
            metric_value DECIMAL,
            metric_data JSONB,
            recorded_date DATE DEFAULT CURRENT_DATE,
            recorded_by UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        ALTER TABLE public.idea_analytics ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create RLS policies
CREATE POLICY "idea_comments_select_policy" ON public.idea_comments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.ideas i 
        WHERE i.id = idea_comments.idea_id 
        AND (
            EXISTS (SELECT 1 FROM public.innovators inn WHERE inn.id = i.innovator_id AND inn.user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
            OR has_role(auth.uid(), 'admin'::app_role)
        )
    )
);

CREATE POLICY "idea_comments_insert_policy" ON public.idea_comments FOR INSERT
WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.ideas i 
        WHERE i.id = idea_comments.idea_id 
        AND (
            EXISTS (SELECT 1 FROM public.innovators inn WHERE inn.id = i.innovator_id AND inn.user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
            OR has_role(auth.uid(), 'admin'::app_role)
        )
    )
);

-- Continue creating necessary policies and functions...
-- Simplified to avoid conflicts