# 🗄️ **WORKSPACE DATABASE REQUIREMENTS - PART 2** ✅ **COMPLETE**
*Extended database schema for edge functions, file storage, and advanced features - FULLY DEPLOYED*

## 🔧 **Edge Function Support Tables** ✅ **IMPLEMENTED**

### **AI Usage Tracking Enhancement** ✅ **DEPLOYED**
```sql
-- Enhance existing ai_usage_tracking table for workspace analytics
ALTER TABLE public.ai_usage_tracking 
ADD COLUMN IF NOT EXISTS workspace_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS workspace_context JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS response_quality_score DECIMAL(3,2);

-- Create index for workspace analytics
CREATE INDEX IF NOT EXISTS idx_ai_usage_workspace ON public.ai_usage_tracking(workspace_type, user_id, created_at);

-- Add RLS policy for workspace AI usage
CREATE POLICY "Workspace AI usage tracking" ON public.ai_usage_tracking
FOR SELECT USING (
  user_id = auth.uid()
  OR auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'super_admin', 'analyst') AND is_active = true
  )
);
```

### **File Management Tables**
```sql
-- Create file management table for workspace files
CREATE TABLE public.workspace_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_type VARCHAR(50) NOT NULL,
    workspace_id VARCHAR(100) NOT NULL,
    file_path TEXT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    category VARCHAR(50) DEFAULT 'general',
    uploaded_by UUID NOT NULL,
    storage_bucket VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_files ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_workspace_files_workspace ON public.workspace_files(workspace_type, workspace_id);
CREATE INDEX idx_workspace_files_uploader ON public.workspace_files(uploaded_by, created_at);
CREATE INDEX idx_workspace_files_category ON public.workspace_files(category, workspace_type);

-- RLS Policies
CREATE POLICY "Users can view their workspace files" ON public.workspace_files
FOR SELECT USING (
  uploaded_by = auth.uid()
  OR is_public = true
  OR (workspace_type = 'expert' AND auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('expert', 'evaluator') AND is_active = true
  ))
  OR (workspace_type = 'manager' AND auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('manager', 'team_lead') AND is_active = true
  ))
  OR auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'super_admin') AND is_active = true
  )
);

CREATE POLICY "Users can manage their workspace files" ON public.workspace_files
FOR ALL USING (
  uploaded_by = auth.uid()
  OR auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'super_admin') AND is_active = true
  )
);
```

### **File Versions Table**
```sql
-- Create file versions table for workspace file versioning
CREATE TABLE public.workspace_file_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES public.workspace_files(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    upload_reason TEXT,
    uploaded_by UUID NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_file_versions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_file_versions_file ON public.workspace_file_versions(file_id, version_number);
CREATE INDEX idx_file_versions_current ON public.workspace_file_versions(file_id, is_current);

-- RLS Policies
CREATE POLICY "Users can view file versions" ON public.workspace_file_versions
FOR SELECT USING (
  file_id IN (
    SELECT id FROM public.workspace_files 
    WHERE uploaded_by = auth.uid() OR is_public = true
  )
  OR auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'super_admin') AND is_active = true
  )
);

CREATE POLICY "Users can manage their file versions" ON public.workspace_file_versions
FOR ALL USING (
  file_id IN (
    SELECT id FROM public.workspace_files WHERE uploaded_by = auth.uid()
  )
  OR auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'super_admin') AND is_active = true
  )
);
```

---

## 🌐 **Real-time Enhancement Tables**

### **Live Presence Tracking**
```sql
-- Create enhanced presence tracking for workspaces
CREATE TABLE public.workspace_live_presence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_type VARCHAR(50) NOT NULL,
    workspace_id VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL,
    presence_status VARCHAR(20) DEFAULT 'online', -- 'online', 'away', 'busy', 'offline'
    current_activity VARCHAR(100),
    location_context JSONB DEFAULT '{}',
    device_info JSONB DEFAULT '{}',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_type, workspace_id, user_id)
);

-- Enable RLS
ALTER TABLE public.workspace_live_presence ENABLE ROW LEVEL SECURITY;

-- Create indexes for real-time queries
CREATE INDEX idx_workspace_presence_active ON public.workspace_live_presence(workspace_type, workspace_id, presence_status, last_seen);
CREATE INDEX idx_workspace_presence_user ON public.workspace_live_presence(user_id, updated_at);

-- RLS Policies
CREATE POLICY "Users can view workspace presence" ON public.workspace_live_presence
FOR SELECT USING (
  workspace_type IN ('user', 'organization') -- Public workspaces
  OR workspace_id IN (
    SELECT CONCAT(workspace_type, '-', user_id) 
    FROM public.team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
  OR auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'super_admin') AND is_active = true
  )
);

CREATE POLICY "Users can update their presence" ON public.workspace_live_presence
FOR ALL USING (user_id = auth.uid());

-- Real-time subscriptions
ALTER TABLE public.workspace_live_presence REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_live_presence;
```

### **Notification Queue Table**
```sql
-- Create workspace notification queue
CREATE TABLE public.workspace_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL,
    workspace_type VARCHAR(50) NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    title_ar VARCHAR(255),
    title_en VARCHAR(255),
    message_ar TEXT,
    message_en TEXT,
    action_url TEXT,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    category VARCHAR(50) DEFAULT 'general',
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    is_delivered BOOLEAN DEFAULT false,
    delivery_method VARCHAR(20) DEFAULT 'in_app', -- 'in_app', 'email', 'push'
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_notifications ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_workspace_notifications_recipient ON public.workspace_notifications(recipient_id, is_read, created_at);
CREATE INDEX idx_workspace_notifications_workspace ON public.workspace_notifications(workspace_type, notification_type);
CREATE INDEX idx_workspace_notifications_delivery ON public.workspace_notifications(is_delivered, scheduled_for);

-- RLS Policies
CREATE POLICY "Users can view their notifications" ON public.workspace_notifications
FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON public.workspace_notifications
FOR UPDATE USING (recipient_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.workspace_notifications
FOR INSERT WITH CHECK (true);

-- Real-time subscriptions
ALTER TABLE public.workspace_notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_notifications;
```

---

## 📊 **Advanced Analytics Tables**

### **User Behavior Analytics**
```sql
-- Create detailed user behavior tracking
CREATE TABLE public.workspace_user_behavior (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    workspace_type VARCHAR(50) NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    page_path VARCHAR(255),
    action_type VARCHAR(100) NOT NULL,
    element_type VARCHAR(50),
    element_id VARCHAR(100),
    interaction_data JSONB DEFAULT '{}',
    duration_ms INTEGER,
    scroll_depth INTEGER,
    click_coordinates JSONB,
    device_viewport JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_user_behavior ENABLE ROW LEVEL SECURITY;

-- Create indexes for analytics queries
CREATE INDEX idx_user_behavior_user_session ON public.workspace_user_behavior(user_id, session_id, timestamp);
CREATE INDEX idx_user_behavior_workspace_action ON public.workspace_user_behavior(workspace_type, action_type, timestamp);
CREATE INDEX idx_user_behavior_analytics ON public.workspace_user_behavior(workspace_type, timestamp) WHERE timestamp >= (NOW() - INTERVAL '30 days');

-- RLS Policies
CREATE POLICY "Analysts can view behavior data" ON public.workspace_user_behavior
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'super_admin', 'analyst', 'data_analyst') 
    AND is_active = true
  )
);

CREATE POLICY "System can insert behavior data" ON public.workspace_user_behavior
FOR INSERT WITH CHECK (true);
```

### **Performance Metrics Table**
```sql
-- Create performance metrics tracking
CREATE TABLE public.workspace_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_type VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_category VARCHAR(50) NOT NULL, -- 'load_time', 'interaction', 'error', 'usage'
    metric_value DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20) DEFAULT 'ms', -- 'ms', 'count', 'percentage', 'bytes'
    user_id UUID,
    session_id VARCHAR(100),
    device_type VARCHAR(20),
    browser_type VARCHAR(20),
    network_type VARCHAR(20),
    page_path VARCHAR(255),
    additional_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_performance_metrics_workspace ON public.workspace_performance_metrics(workspace_type, metric_category, timestamp);
CREATE INDEX idx_performance_metrics_user ON public.workspace_performance_metrics(user_id, timestamp);
CREATE INDEX idx_performance_metrics_recent ON public.workspace_performance_metrics(timestamp) WHERE timestamp >= (NOW() - INTERVAL '7 days');

-- RLS Policies
CREATE POLICY "Analysts can view performance metrics" ON public.workspace_performance_metrics
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'super_admin', 'analyst', 'data_analyst') 
    AND is_active = true
  )
);

CREATE POLICY "System can insert performance metrics" ON public.workspace_performance_metrics
FOR INSERT WITH CHECK (true);
```

---

## 🔐 **Security Enhancement Tables**

### **Workspace Access Audit**
```sql
-- Create workspace access audit table
CREATE TABLE public.workspace_access_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    workspace_type VARCHAR(50) NOT NULL,
    access_type VARCHAR(50) NOT NULL, -- 'login', 'logout', 'access_denied', 'permission_check'
    ip_address INET,
    user_agent TEXT,
    access_granted BOOLEAN NOT NULL,
    denial_reason TEXT,
    security_context JSONB DEFAULT '{}',
    risk_score INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_access_audit ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_access_audit_user ON public.workspace_access_audit(user_id, timestamp);
CREATE INDEX idx_access_audit_workspace ON public.workspace_access_audit(workspace_type, access_granted, timestamp);
CREATE INDEX idx_access_audit_security ON public.workspace_access_audit(risk_score, timestamp) WHERE risk_score > 50;

-- RLS Policies
CREATE POLICY "Admins can view access audit" ON public.workspace_access_audit
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('admin', 'super_admin', 'security_admin') 
    AND is_active = true
  )
);

CREATE POLICY "Users can view their access audit" ON public.workspace_access_audit
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can log access audit" ON public.workspace_access_audit
FOR INSERT WITH CHECK (true);
```

---

## 🔧 **Database Functions for Workspace Operations**

### **Workspace Analytics Function**
```sql
-- Function to get comprehensive workspace analytics
CREATE OR REPLACE FUNCTION public.get_workspace_analytics(
    p_workspace_type VARCHAR(50),
    p_user_id UUID,
    p_timeframe VARCHAR(10) DEFAULT '30d'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    result JSONB;
    days_back INTEGER;
    start_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Calculate timeframe
    days_back := CASE p_timeframe
        WHEN '7d' THEN 7
        WHEN '30d' THEN 30
        WHEN '90d' THEN 90
        ELSE 30
    END;
    
    start_date := NOW() - (days_back || ' days')::INTERVAL;
    
    -- Build comprehensive analytics
    WITH activity_stats AS (
        SELECT 
            COUNT(*) as total_activities,
            COUNT(DISTINCT activity_type) as unique_activities,
            COUNT(DISTINCT DATE(created_at)) as active_days
        FROM workspace_activities 
        WHERE workspace_type = p_workspace_type 
        AND user_id = p_user_id 
        AND created_at >= start_date
    ),
    collaboration_stats AS (
        SELECT 
            COUNT(DISTINCT wc.id) as collaborations_joined,
            COUNT(DISTINCT cm.id) as messages_sent,
            AVG(EXTRACT(EPOCH FROM (wc.ended_at - wc.started_at))/60)::INTEGER as avg_session_minutes
        FROM workspace_collaborations wc
        LEFT JOIN collaboration_messages cm ON wc.id = cm.collaboration_id AND cm.sender_id = p_user_id
        WHERE wc.workspace_type = p_workspace_type 
        AND (wc.owner_id = p_user_id OR p_user_id::text = ANY(SELECT jsonb_array_elements_text(wc.participants)))
        AND wc.created_at >= start_date
    ),
    file_stats AS (
        SELECT 
            COUNT(*) as files_uploaded,
            COALESCE(SUM(file_size), 0) as total_storage_used,
            COUNT(DISTINCT category) as file_categories
        FROM workspace_files 
        WHERE workspace_type = p_workspace_type 
        AND uploaded_by = p_user_id 
        AND created_at >= start_date
    ),
    presence_stats AS (
        SELECT 
            COUNT(DISTINCT DATE(last_seen)) as active_presence_days,
            AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60)::INTEGER as avg_online_minutes
        FROM workspace_live_presence 
        WHERE workspace_type = p_workspace_type 
        AND user_id = p_user_id 
        AND last_seen >= start_date
    )
    SELECT jsonb_build_object(
        'timeframe', p_timeframe,
        'workspace_type', p_workspace_type,
        'activity', jsonb_build_object(
            'total_activities', COALESCE(a.total_activities, 0),
            'unique_activities', COALESCE(a.unique_activities, 0),
            'active_days', COALESCE(a.active_days, 0),
            'avg_activities_per_day', CASE 
                WHEN a.active_days > 0 THEN ROUND(a.total_activities::numeric / a.active_days, 2)
                ELSE 0 
            END
        ),
        'collaboration', jsonb_build_object(
            'collaborations_joined', COALESCE(c.collaborations_joined, 0),
            'messages_sent', COALESCE(c.messages_sent, 0),
            'avg_session_minutes', COALESCE(c.avg_session_minutes, 0)
        ),
        'files', jsonb_build_object(
            'files_uploaded', COALESCE(f.files_uploaded, 0),
            'total_storage_used', COALESCE(f.total_storage_used, 0),
            'file_categories', COALESCE(f.file_categories, 0)
        ),
        'presence', jsonb_build_object(
            'active_presence_days', COALESCE(p.active_presence_days, 0),
            'avg_online_minutes', COALESCE(p.avg_online_minutes, 0)
        ),
        'generated_at', NOW()
    ) INTO result
    FROM activity_stats a, collaboration_stats c, file_stats f, presence_stats p;
    
    RETURN result;
END;
$$;
```

### **Workspace Setup Function**
```sql
-- Function to initialize workspace for new users
CREATE OR REPLACE FUNCTION public.setup_user_workspace(
    p_user_id UUID,
    p_workspace_type VARCHAR(50)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    workspace_id VARCHAR(100);
    setup_result JSONB;
BEGIN
    workspace_id := p_workspace_type || '-' || p_user_id::text;
    
    -- Create initial workspace activity
    INSERT INTO workspace_activities (
        workspace_type,
        workspace_id,
        user_id,
        activity_type,
        activity_category,
        description_en,
        description_ar,
        metadata
    ) VALUES (
        p_workspace_type,
        workspace_id,
        p_user_id,
        'workspace_initialized',
        'system',
        'Workspace initialized for user',
        'تم تهيئة مساحة العمل للمستخدم',
        jsonb_build_object('setup_timestamp', NOW())
    );
    
    -- Initialize workspace preferences
    UPDATE profiles SET 
        workspace_preferences = COALESCE(workspace_preferences, '{}'::jsonb) || jsonb_build_object(
            p_workspace_type, jsonb_build_object(
                'initialized', true,
                'theme', 'default',
                'notifications_enabled', true,
                'collaboration_enabled', true,
                'setup_date', NOW()
            )
        )
    WHERE user_id = p_user_id;
    
    -- Create initial metrics entry
    INSERT INTO workspace_metrics (
        workspace_type,
        user_id,
        metric_name,
        metric_category,
        metric_value,
        metric_unit,
        period_start,
        period_end,
        aggregation_level
    ) VALUES (
        p_workspace_type,
        p_user_id,
        'setup_completion',
        'system',
        100.0,
        'percentage',
        NOW(),
        NOW(),
        'daily'
    );
    
    setup_result := jsonb_build_object(
        'success', true,
        'workspace_id', workspace_id,
        'workspace_type', p_workspace_type,
        'user_id', p_user_id,
        'setup_at', NOW()
    );
    
    RETURN setup_result;
END;
$$;
```

This comprehensive database enhancement provides complete support for edge functions, file storage, real-time features, analytics, and security auditing for the workspace system.