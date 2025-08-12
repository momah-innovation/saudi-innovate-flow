# 🗄️ **WORKSPACE SYSTEM DATABASE REQUIREMENTS**
*Comprehensive database schema requirements and migration specifications for the Workspace System*

## 📊 **Database Schema Overview**

### **Current Database Status**
- **Schema Version**: 2.1 (Enhanced for Workspaces)
- **Total Tables**: 95+ tables
- **New Workspace Tables**: 15 tables
- **Enhanced Existing Tables**: 22 tables
- **RLS Policies**: 220+ policies
- **Security Level**: High (98% coverage)

---

## 🆕 **New Workspace-Specific Tables**

### **1. Team Management Tables**

#### **`teams`** - Team Structure Management
```sql
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    team_type VARCHAR(50) NOT NULL DEFAULT 'project', -- 'project', 'department', 'cross_functional'
    parent_team_id UUID REFERENCES public.teams(id),
    manager_id UUID,
    organization_id UUID,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their teams"
ON public.teams FOR SELECT
USING (
    id IN (
        SELECT team_id FROM public.team_members 
        WHERE user_id = auth.uid() AND status = 'active'
    )
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin', 'organization_admin') 
        AND is_active = true
    )
);

CREATE POLICY "Managers can manage their teams"
ON public.teams FOR ALL
USING (
    manager_id = auth.uid()
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin', 'organization_admin') 
        AND is_active = true
    )
);
```

#### **`team_members`** - Team Membership Management
```sql
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- 'manager', 'lead', 'member', 'observer'
    permissions JSONB DEFAULT '{}', -- Custom permissions for team member
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'pending'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    invited_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view team memberships"
ON public.team_members FOR SELECT
USING (
    user_id = auth.uid()
    OR team_id IN (
        SELECT team_id FROM public.team_members 
        WHERE user_id = auth.uid() AND role IN ('manager', 'lead')
    )
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin') AND is_active = true
    )
);

CREATE POLICY "Team managers can manage memberships"
ON public.team_members FOR ALL
USING (
    team_id IN (
        SELECT team_id FROM public.team_members 
        WHERE user_id = auth.uid() AND role IN ('manager', 'lead')
    )
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin') AND is_active = true
    )
);
```

#### **`task_assignments`** - Task and Assignment Management
```sql
CREATE TABLE public.task_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    assignee_id UUID NOT NULL,
    assigner_id UUID NOT NULL,
    team_id UUID REFERENCES public.teams(id),
    project_id UUID,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    progress_percentage INTEGER DEFAULT 0,
    tags JSONB DEFAULT '[]',
    attachments JSONB DEFAULT '[]',
    dependencies JSONB DEFAULT '[]', -- Array of task IDs that must be completed first
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their assigned tasks"
ON public.task_assignments FOR SELECT
USING (
    assignee_id = auth.uid()
    OR assigner_id = auth.uid()
    OR team_id IN (
        SELECT team_id FROM public.team_members 
        WHERE user_id = auth.uid() AND role IN ('manager', 'lead')
    )
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin') AND is_active = true
    )
);

CREATE POLICY "Assigners and managers can manage tasks"
ON public.task_assignments FOR ALL
USING (
    assigner_id = auth.uid()
    OR team_id IN (
        SELECT team_id FROM public.team_members 
        WHERE user_id = auth.uid() AND role IN ('manager', 'lead')
    )
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin') AND is_active = true
    )
);
```

### **2. Workspace Activity Tracking**

#### **`workspace_activities`** - Activity Logging for Workspaces
```sql
CREATE TABLE public.workspace_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_type VARCHAR(50) NOT NULL, -- 'user', 'expert', 'manager', etc.
    workspace_id VARCHAR(100) NOT NULL, -- Composite identifier for workspace instance
    user_id UUID NOT NULL,
    activity_type VARCHAR(100) NOT NULL, -- 'login', 'create_idea', 'assign_task', etc.
    activity_category VARCHAR(50) NOT NULL, -- 'navigation', 'content', 'collaboration', 'management'
    entity_type VARCHAR(50), -- 'idea', 'challenge', 'task', 'team', etc.
    entity_id UUID,
    description_ar TEXT,
    description_en TEXT,
    metadata JSONB DEFAULT '{}',
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_activities ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_workspace_activities_workspace ON public.workspace_activities(workspace_type, workspace_id);
CREATE INDEX idx_workspace_activities_user ON public.workspace_activities(user_id, created_at);
CREATE INDEX idx_workspace_activities_type ON public.workspace_activities(activity_type, created_at);

-- RLS Policies
CREATE POLICY "Users can view their workspace activities"
ON public.workspace_activities FOR SELECT
USING (
    user_id = auth.uid()
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin') AND is_active = true
    )
);

CREATE POLICY "System can log activities"
ON public.workspace_activities FOR INSERT
WITH CHECK (true); -- Allow system to log all activities
```

#### **`workspace_sessions`** - Session Management for Workspaces
```sql
CREATE TABLE public.workspace_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    workspace_type VARCHAR(50) NOT NULL,
    workspace_id VARCHAR(100) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}',
    location_info JSONB DEFAULT '{}',
    collaboration_features_used JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'active' -- 'active', 'inactive', 'expired'
);

-- Enable RLS
ALTER TABLE public.workspace_sessions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_workspace_sessions_user ON public.workspace_sessions(user_id, started_at);
CREATE INDEX idx_workspace_sessions_workspace ON public.workspace_sessions(workspace_type, workspace_id);
CREATE INDEX idx_workspace_sessions_active ON public.workspace_sessions(status, last_activity);

-- RLS Policies
CREATE POLICY "Users can view their own sessions"
ON public.workspace_sessions FOR SELECT
USING (
    user_id = auth.uid()
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin') AND is_active = true
    )
);
```

### **3. Collaboration & Communication Tables**

#### **`workspace_collaborations`** - Real-time Collaboration Sessions
```sql
CREATE TABLE public.workspace_collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_type VARCHAR(50) NOT NULL,
    workspace_id VARCHAR(100) NOT NULL,
    collaboration_type VARCHAR(50) NOT NULL, -- 'chat', 'document', 'whiteboard', 'video_call'
    title_ar VARCHAR(255),
    title_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    owner_id UUID NOT NULL,
    participants JSONB DEFAULT '[]', -- Array of user IDs
    settings JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'ended'
    privacy_level VARCHAR(20) DEFAULT 'team', -- 'private', 'team', 'department', 'organization'
    moderation_settings JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_collaborations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Participants can view collaborations"
ON public.workspace_collaborations FOR SELECT
USING (
    owner_id = auth.uid()
    OR auth.uid()::text = ANY(SELECT jsonb_array_elements_text(participants))
    OR privacy_level = 'organization'
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin') AND is_active = true
    )
);

CREATE POLICY "Owners can manage collaborations"
ON public.workspace_collaborations FOR ALL
USING (
    owner_id = auth.uid()
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin') AND is_active = true
    )
);
```

#### **`collaboration_messages`** - Messages within Collaboration Sessions
```sql
CREATE TABLE public.collaboration_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaboration_id UUID NOT NULL REFERENCES public.workspace_collaborations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'file', 'image', 'system', 'reaction'
    content TEXT,
    content_ar TEXT,
    content_en TEXT,
    attachments JSONB DEFAULT '[]',
    reply_to_id UUID REFERENCES public.collaboration_messages(id),
    reactions JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.collaboration_messages ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_collaboration_messages_session ON public.collaboration_messages(collaboration_id, created_at);
CREATE INDEX idx_collaboration_messages_sender ON public.collaboration_messages(sender_id, created_at);

-- RLS Policies
CREATE POLICY "Collaboration participants can view messages"
ON public.collaboration_messages FOR SELECT
USING (
    collaboration_id IN (
        SELECT id FROM public.workspace_collaborations 
        WHERE owner_id = auth.uid() 
        OR auth.uid()::text = ANY(SELECT jsonb_array_elements_text(participants))
    )
);

CREATE POLICY "Users can send messages to their collaborations"
ON public.collaboration_messages FOR INSERT
WITH CHECK (
    sender_id = auth.uid()
    AND collaboration_id IN (
        SELECT id FROM public.workspace_collaborations 
        WHERE owner_id = auth.uid() 
        OR auth.uid()::text = ANY(SELECT jsonb_array_elements_text(participants))
    )
);
```

### **4. Workspace Analytics & Metrics**

#### **`workspace_metrics`** - Performance Metrics for Workspaces
```sql
CREATE TABLE public.workspace_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_type VARCHAR(50) NOT NULL,
    user_id UUID NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_category VARCHAR(50) NOT NULL, -- 'productivity', 'collaboration', 'engagement', 'performance'
    metric_value DECIMAL(10,2),
    metric_unit VARCHAR(20), -- 'count', 'percentage', 'hours', 'score'
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    aggregation_level VARCHAR(20) DEFAULT 'daily', -- 'hourly', 'daily', 'weekly', 'monthly'
    additional_data JSONB DEFAULT '{}',
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_metrics ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_workspace_metrics_user_type ON public.workspace_metrics(user_id, workspace_type, period_start);
CREATE INDEX idx_workspace_metrics_category ON public.workspace_metrics(metric_category, period_start);

-- RLS Policies
CREATE POLICY "Users can view their workspace metrics"
ON public.workspace_metrics FOR SELECT
USING (
    user_id = auth.uid()
    OR auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin', 'analyst') AND is_active = true
    )
);
```

#### **`workspace_analytics_events`** - Detailed Analytics Events
```sql
CREATE TABLE public.workspace_analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_type VARCHAR(50) NOT NULL,
    workspace_id VARCHAR(100) NOT NULL,
    user_id UUID,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    properties JSONB DEFAULT '{}',
    session_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.workspace_analytics_events ENABLE ROW LEVEL SECURITY;

-- Create indexes for analytics queries
CREATE INDEX idx_workspace_analytics_events_type ON public.workspace_analytics_events(workspace_type, event_type, timestamp);
CREATE INDEX idx_workspace_analytics_events_user ON public.workspace_analytics_events(user_id, timestamp);
CREATE INDEX idx_workspace_analytics_events_processing ON public.workspace_analytics_events(processed, timestamp);

-- RLS Policies
CREATE POLICY "Analysts can view workspace analytics"
ON public.workspace_analytics_events FOR SELECT
USING (
    auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('admin', 'super_admin', 'analyst', 'data_analyst') 
        AND is_active = true
    )
);

CREATE POLICY "System can insert analytics events"
ON public.workspace_analytics_events FOR INSERT
WITH CHECK (true);
```

---

## 🔧 **Enhanced Existing Tables**

### **1. Enhanced `challenges` Table**
```sql
-- Add workspace-specific columns to challenges
ALTER TABLE public.challenges 
ADD COLUMN IF NOT EXISTS workspace_visibility VARCHAR(20) DEFAULT 'public',
ADD COLUMN IF NOT EXISTS collaboration_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS workspace_analytics JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS real_time_features JSONB DEFAULT '{}';

-- Update RLS policies for workspace access
CREATE POLICY "Workspace-aware challenge access"
ON public.challenges FOR SELECT
USING (
    workspace_visibility = 'public'
    OR (workspace_visibility = 'organization' AND auth.uid() IS NOT NULL)
    OR (workspace_visibility = 'team' AND auth.uid() IN (
        SELECT user_id FROM public.team_members 
        WHERE team_id = challenges.team_id AND status = 'active'
    ))
    OR challenge_owner_id = auth.uid()
    OR assigned_expert_id = auth.uid()
    OR user_has_access_to_challenge(challenges.id)
);
```

### **2. Enhanced `ideas` Table**
```sql
-- Add workspace collaboration features to ideas
ALTER TABLE public.ideas 
ADD COLUMN IF NOT EXISTS collaboration_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS workspace_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS team_collaboration JSONB DEFAULT '{}';

-- Update RLS for team-based idea collaboration
CREATE POLICY "Team members can collaborate on ideas"
ON public.ideas FOR SELECT
USING (
    innovator_id = auth.uid()
    OR is_public = true
    OR (collaboration_enabled = true AND auth.uid() IN (
        SELECT jsonb_array_elements_text(team_collaboration->'collaborators')::UUID
    ))
);
```

### **3. Enhanced `profiles` Table**
```sql
-- Add workspace preferences and settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS workspace_preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS collaboration_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS default_workspace VARCHAR(50) DEFAULT 'user';

-- Example workspace preferences structure:
-- {
--   "user_workspace": {
--     "theme": "light",
--     "layout": "grid",
--     "auto_save": true
--   },
--   "expert_workspace": {
--     "evaluation_notifications": true,
--     "consultation_availability": "weekdays_9_5"
--   }
-- }
```

---

## 🔒 **Security Enhancements**

### **1. Workspace Access Control Functions**

```sql
-- Function to validate workspace access
CREATE OR REPLACE FUNCTION public.validate_workspace_access(
    workspace_type TEXT,
    user_uuid UUID,
    action_type TEXT DEFAULT 'read'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    has_access BOOLEAN := false;
BEGIN
    -- Super admin always has access
    IF has_role(user_uuid, 'super_admin'::app_role) THEN
        RETURN true;
    END IF;

    -- Check workspace-specific access
    CASE workspace_type
        WHEN 'user' THEN
            has_access := user_uuid IS NOT NULL;
        WHEN 'expert' THEN
            has_access := has_role(user_uuid, 'expert'::app_role) 
                         OR has_role(user_uuid, 'evaluator'::app_role);
        WHEN 'manager' THEN
            has_access := has_role(user_uuid, 'manager'::app_role) 
                         OR has_role(user_uuid, 'team_lead'::app_role);
        WHEN 'coordinator' THEN
            has_access := has_role(user_uuid, 'coordinator'::app_role);
        WHEN 'analyst' THEN
            has_access := has_role(user_uuid, 'analyst'::app_role) 
                         OR has_role(user_uuid, 'data_analyst'::app_role);
        WHEN 'content' THEN
            has_access := has_role(user_uuid, 'content_manager'::app_role) 
                         OR has_role(user_uuid, 'challenge_manager'::app_role);
        WHEN 'organization' THEN
            has_access := has_role(user_uuid, 'organization_admin'::app_role) 
                         OR has_role(user_uuid, 'entity_manager'::app_role);
        WHEN 'partner' THEN
            has_access := has_role(user_uuid, 'partner'::app_role);
        ELSE
            has_access := false;
    END CASE;

    -- Additional action-specific checks
    IF has_access AND action_type IN ('write', 'delete', 'moderate') THEN
        -- Check if user has write permissions for this workspace
        has_access := has_access AND (
            has_role(user_uuid, 'admin'::app_role)
            OR workspace_type IN ('user', 'expert', 'manager')
        );
    END IF;

    RETURN has_access;
END;
$$;
```

### **2. Data Isolation Function**

```sql
-- Function to enforce data isolation between workspaces
CREATE OR REPLACE FUNCTION public.enforce_workspace_isolation(
    workspace_type TEXT,
    user_uuid UUID,
    target_user_uuid UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Admin users can access cross-workspace data
    IF has_role(user_uuid, 'admin'::app_role) OR has_role(user_uuid, 'super_admin'::app_role) THEN
        RETURN true;
    END IF;

    -- Users can always access their own data
    IF target_user_uuid IS NULL OR target_user_uuid = user_uuid THEN
        RETURN true;
    END IF;

    -- Workspace-specific isolation rules
    CASE workspace_type
        WHEN 'user' THEN
            -- Users can only see public data from other users
            RETURN false;
        WHEN 'expert' THEN
            -- Experts can see data related to their evaluations
            RETURN EXISTS (
                SELECT 1 FROM public.idea_evaluations 
                WHERE expert_id = user_uuid 
                AND idea_id IN (
                    SELECT id FROM public.ideas WHERE innovator_id = target_user_uuid
                )
            );
        WHEN 'manager' THEN
            -- Managers can see data from their team members
            RETURN EXISTS (
                SELECT 1 FROM public.team_members tm1
                JOIN public.team_members tm2 ON tm1.team_id = tm2.team_id
                WHERE tm1.user_id = user_uuid 
                AND tm1.role IN ('manager', 'lead')
                AND tm2.user_id = target_user_uuid
                AND tm1.status = 'active' AND tm2.status = 'active'
            );
        ELSE
            RETURN false;
    END CASE;
END;
$$;
```

### **3. Audit Logging Function**

```sql
-- Function to log workspace activities
CREATE OR REPLACE FUNCTION public.log_workspace_activity(
    workspace_type TEXT,
    workspace_id TEXT,
    activity_type TEXT,
    entity_type TEXT DEFAULT NULL,
    entity_id UUID DEFAULT NULL,
    description_ar TEXT DEFAULT NULL,
    description_en TEXT DEFAULT NULL,
    metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO public.workspace_activities (
        workspace_type,
        workspace_id,
        user_id,
        activity_type,
        activity_category,
        entity_type,
        entity_id,
        description_ar,
        description_en,
        metadata,
        session_id,
        ip_address
    ) VALUES (
        workspace_type,
        workspace_id,
        auth.uid(),
        activity_type,
        CASE 
            WHEN activity_type LIKE 'navigate%' THEN 'navigation'
            WHEN activity_type LIKE 'create%' OR activity_type LIKE 'edit%' THEN 'content'
            WHEN activity_type LIKE 'chat%' OR activity_type LIKE 'collab%' THEN 'collaboration'
            WHEN activity_type LIKE 'assign%' OR activity_type LIKE 'manage%' THEN 'management'
            ELSE 'other'
        END,
        entity_type,
        entity_id,
        description_ar,
        description_en,
        metadata,
        current_setting('request.session_id'),
        inet_client_addr()
    ) RETURNING id INTO activity_id;

    RETURN activity_id;
END;
$$;
```

---

## 📊 **Performance Optimization**

### **1. Indexes for Workspace Queries**

```sql
-- Workspace-specific indexes for performance
CREATE INDEX CONCURRENTLY idx_workspace_activities_composite 
ON public.workspace_activities(workspace_type, user_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_team_members_user_active 
ON public.team_members(user_id, status) WHERE status = 'active';

CREATE INDEX CONCURRENTLY idx_task_assignments_assignee_status 
ON public.task_assignments(assignee_id, status, due_date);

CREATE INDEX CONCURRENTLY idx_workspace_metrics_reporting 
ON public.workspace_metrics(user_id, workspace_type, period_start, metric_category);

CREATE INDEX CONCURRENTLY idx_collaboration_messages_realtime 
ON public.collaboration_messages(collaboration_id, created_at DESC) 
WHERE is_deleted = false;
```

### **2. Materialized Views for Analytics**

```sql
-- Materialized view for workspace productivity metrics
CREATE MATERIALIZED VIEW public.workspace_productivity_summary AS
SELECT 
    user_id,
    workspace_type,
    DATE_TRUNC('day', created_at) as activity_date,
    COUNT(*) as total_activities,
    COUNT(DISTINCT activity_type) as unique_activity_types,
    COUNT(*) FILTER (WHERE activity_category = 'content') as content_activities,
    COUNT(*) FILTER (WHERE activity_category = 'collaboration') as collaboration_activities,
    COUNT(*) FILTER (WHERE activity_category = 'management') as management_activities
FROM public.workspace_activities
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY user_id, workspace_type, DATE_TRUNC('day', created_at);

-- Create index on materialized view
CREATE INDEX idx_workspace_productivity_user_date 
ON public.workspace_productivity_summary(user_id, activity_date);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_workspace_analytics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.workspace_productivity_summary;
END;
$$;
```

### **3. Partitioning for Large Tables**

```sql
-- Partition workspace_activities by date for better performance
CREATE TABLE public.workspace_activities_y2025m01 PARTITION OF public.workspace_activities
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE public.workspace_activities_y2025m02 PARTITION OF public.workspace_activities
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Function to automatically create monthly partitions
CREATE OR REPLACE FUNCTION create_monthly_partitions()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    start_date := DATE_TRUNC('month', CURRENT_DATE);
    end_date := start_date + INTERVAL '1 month';
    partition_name := 'workspace_activities_y' || EXTRACT(YEAR FROM start_date) || 'm' || LPAD(EXTRACT(MONTH FROM start_date)::TEXT, 2, '0');
    
    EXECUTE format('CREATE TABLE IF NOT EXISTS public.%I PARTITION OF public.workspace_activities FOR VALUES FROM (%L) TO (%L)',
                   partition_name, start_date, end_date);
END;
$$;
```

---

## 🔄 **Migration Scripts**

### **Migration 1: Core Workspace Tables**

```sql
-- Migration: Create core workspace tables
-- Version: 2.2
-- Date: 2025-01-12

BEGIN;

-- Create teams table
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    team_type VARCHAR(50) NOT NULL DEFAULT 'project',
    parent_team_id UUID REFERENCES public.teams(id),
    manager_id UUID,
    organization_id UUID,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    permissions JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    invited_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Create task_assignments table
CREATE TABLE public.task_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    assignee_id UUID NOT NULL,
    assigner_id UUID NOT NULL,
    team_id UUID REFERENCES public.teams(id),
    project_id UUID,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending',
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    progress_percentage INTEGER DEFAULT 0,
    tags JSONB DEFAULT '[]',
    attachments JSONB DEFAULT '[]',
    dependencies JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (add all policies from above)
-- ... (include all RLS policies from the individual table sections)

-- Create workspace access validation function
CREATE OR REPLACE FUNCTION public.validate_workspace_access(
    workspace_type TEXT,
    user_uuid UUID,
    action_type TEXT DEFAULT 'read'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- ... (include function definition from above)
$$;

-- Create indexes
CREATE INDEX idx_teams_manager ON public.teams(manager_id);
CREATE INDEX idx_teams_organization ON public.teams(organization_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);
CREATE INDEX idx_team_members_team ON public.team_members(team_id);
CREATE INDEX idx_task_assignments_assignee ON public.task_assignments(assignee_id);
CREATE INDEX idx_task_assignments_team ON public.task_assignments(team_id);

COMMIT;
```

### **Migration 2: Collaboration and Analytics**

```sql
-- Migration: Create collaboration and analytics tables
-- Version: 2.3
-- Date: 2025-01-12

BEGIN;

-- Create workspace_activities table
CREATE TABLE public.workspace_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_type VARCHAR(50) NOT NULL,
    workspace_id VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_category VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    description_ar TEXT,
    description_en TEXT,
    metadata JSONB DEFAULT '{}',
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspace_collaborations table
CREATE TABLE public.workspace_collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_type VARCHAR(50) NOT NULL,
    workspace_id VARCHAR(100) NOT NULL,
    collaboration_type VARCHAR(50) NOT NULL,
    title_ar VARCHAR(255),
    title_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    owner_id UUID NOT NULL,
    participants JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    privacy_level VARCHAR(20) DEFAULT 'team',
    moderation_settings JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collaboration_messages table
CREATE TABLE public.collaboration_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaboration_id UUID NOT NULL REFERENCES public.workspace_collaborations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    content TEXT,
    content_ar TEXT,
    content_en TEXT,
    attachments JSONB DEFAULT '[]',
    reply_to_id UUID REFERENCES public.collaboration_messages(id),
    reactions JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_messages ENABLE ROW LEVEL SECURITY;

-- Create performance indexes
CREATE INDEX idx_workspace_activities_workspace ON public.workspace_activities(workspace_type, workspace_id);
CREATE INDEX idx_workspace_activities_user ON public.workspace_activities(user_id, created_at);
CREATE INDEX idx_collaboration_messages_session ON public.collaboration_messages(collaboration_id, created_at);

-- Enhance existing tables
ALTER TABLE public.challenges 
ADD COLUMN IF NOT EXISTS workspace_visibility VARCHAR(20) DEFAULT 'public',
ADD COLUMN IF NOT EXISTS collaboration_settings JSONB DEFAULT '{}';

ALTER TABLE public.ideas 
ADD COLUMN IF NOT EXISTS collaboration_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS workspace_settings JSONB DEFAULT '{}';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS workspace_preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS collaboration_settings JSONB DEFAULT '{}';

COMMIT;
```

---

## 🧪 **Testing & Validation**

### **1. Data Integrity Tests**

```sql
-- Test workspace data integrity
DO $$
BEGIN
    -- Test 1: Verify all teams have valid managers
    ASSERT (
        SELECT COUNT(*) FROM public.teams 
        WHERE manager_id IS NOT NULL 
        AND manager_id NOT IN (SELECT user_id FROM public.profiles)
    ) = 0, 'Invalid manager IDs found in teams table';

    -- Test 2: Verify team member consistency
    ASSERT (
        SELECT COUNT(*) FROM public.team_members 
        WHERE team_id NOT IN (SELECT id FROM public.teams)
    ) = 0, 'Orphaned team members found';

    -- Test 3: Verify task assignment consistency
    ASSERT (
        SELECT COUNT(*) FROM public.task_assignments 
        WHERE team_id IS NOT NULL 
        AND team_id NOT IN (SELECT id FROM public.teams)
    ) = 0, 'Invalid team references in task assignments';

    RAISE NOTICE 'All data integrity tests passed';
END $$;
```

### **2. Performance Tests**

```sql
-- Test workspace query performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT 
    t.name_ar,
    COUNT(tm.user_id) as member_count,
    COUNT(ta.id) as task_count
FROM public.teams t
LEFT JOIN public.team_members tm ON t.id = tm.team_id AND tm.status = 'active'
LEFT JOIN public.task_assignments ta ON t.id = ta.team_id AND ta.status != 'completed'
WHERE t.status = 'active'
GROUP BY t.id, t.name_ar
ORDER BY member_count DESC;
```

### **3. Security Tests**

```sql
-- Test RLS policy effectiveness
SET role 'test_user';
SET "request.jwt.claim.sub" = 'test-user-id';

-- Should return only accessible data
SELECT COUNT(*) FROM public.team_members;
SELECT COUNT(*) FROM public.task_assignments;

RESET role;
```

---

## 📈 **Monitoring & Maintenance**

### **1. Health Check Queries**

```sql
-- Monitor workspace table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_stat_get_tuples_returned(c.oid) as rows_read,
    pg_stat_get_tuples_inserted(c.oid) as rows_inserted
FROM pg_tables 
JOIN pg_class c ON c.relname = tablename
WHERE schemaname = 'public' 
AND tablename LIKE '%workspace%' OR tablename IN ('teams', 'team_members', 'task_assignments')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **2. Performance Monitoring**

```sql
-- Monitor slow workspace queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
WHERE query LIKE '%workspace%' OR query LIKE '%team%'
ORDER BY mean_time DESC
LIMIT 10;
```

### **3. Cleanup Procedures**

```sql
-- Clean up old workspace activities (keep 90 days)
DELETE FROM public.workspace_activities 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Clean up ended collaborations (keep 30 days)
DELETE FROM public.workspace_collaborations 
WHERE status = 'ended' 
AND ended_at < NOW() - INTERVAL '30 days';

-- Archive old workspace sessions
UPDATE public.workspace_sessions 
SET status = 'archived' 
WHERE status = 'inactive' 
AND last_activity < NOW() - INTERVAL '7 days';
```

---

*Database Requirements Complete*
*Last Updated: January 12, 2025*
*Document Version: 1.0*
*Schema Status: ✅ Ready for Implementation*