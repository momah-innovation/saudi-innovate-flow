-- Add comprehensive system settings for all hardcoded lists
INSERT INTO public.system_settings (setting_key, setting_value, category, description) VALUES
-- Challenge settings
('challenge_priority_levels', '["low", "medium", "high", "critical"]', 'challenge', 'Priority levels for challenges'),
('challenge_sensitivity_levels', '["normal", "confidential", "restricted"]', 'challenge', 'Sensitivity levels for challenges'),
('challenge_types', '["innovation", "improvement", "research", "development"]', 'challenge', 'Types of challenges'),
('challenge_status_options', '["draft", "active", "published", "completed", "closed", "archived"]', 'challenge', 'Status options for challenges'),

-- Partner settings
('partner_status_options', '["active", "inactive", "pending", "suspended"]', 'partner', 'Status options for partners'),
('partner_type_options', '["government", "private", "academic", "non_profit", "international"]', 'partner', 'Types of partners'),
('partnership_type_options', '["collaborator", "sponsor", "technical_partner", "strategic_partner", "implementation_partner"]', 'partner', 'Types of partnerships'),

-- Expert settings
('expert_status_options', '["active", "inactive", "available", "busy", "unavailable"]', 'expert', 'Status options for experts'),
('expert_role_types', '["lead_expert", "evaluator", "reviewer", "subject_matter_expert", "external_consultant"]', 'expert', 'Role types for experts'),

-- User and role settings
('user_status_options', '["active", "inactive", "suspended", "pending", "revoked"]', 'user', 'Status options for users'),
('available_user_roles', '[{"value": "innovator", "label": "Innovator", "description": "Default role for new users"}, {"value": "evaluator", "label": "Evaluator", "description": "Evaluate challenge submissions and ideas"}, {"value": "domain_expert", "label": "Domain Expert", "description": "Subject matter expert in specific domains"}]', 'user', 'Available user roles'),
('requestable_user_roles', '[{"value": "evaluator", "label": "Evaluator", "description": "Evaluate challenge submissions and ideas"}, {"value": "domain_expert", "label": "Domain Expert", "description": "Subject matter expert in specific domains"}, {"value": "team_leader", "label": "Team Leader", "description": "Lead innovation teams and coordinate projects"}]', 'user', 'User roles that can be requested'),

-- Team settings
('team_role_options', '["Innovation Manager", "Data Analyst", "Content Creator", "Project Manager", "Research Analyst"]', 'team', 'Role options for team members'),
('team_specialization_options', '["Innovation Strategy & Planning", "Project Management & Execution", "Research & Market Analysis", "Stakeholder Engagement", "Change Management"]', 'team', 'Specialization options for teams'),

-- Event settings
('event_types', '["workshop", "seminar", "conference", "networking", "hackathon", "pitch_session", "training"]', 'event', 'Types of events'),
('event_formats', '["in_person", "virtual", "hybrid"]', 'event', 'Formats for events'),
('event_categories', '["standalone", "campaign_event", "training", "workshop"]', 'event', 'Categories for events'),
('event_visibility_options', '["public", "private", "internal"]', 'event', 'Visibility options for events'),
('attendance_status_options', '["registered", "attended", "absent", "cancelled", "confirmed"]', 'event', 'Attendance status options'),

-- General system settings
('general_status_options', '["active", "inactive", "pending", "completed", "cancelled", "draft", "published", "archived"]', 'system', 'General status options'),
('assignment_status_options', '["active", "inactive", "pending", "completed", "cancelled"]', 'system', 'Assignment status options'),
('role_request_status_options', '["pending", "approved", "rejected", "withdrawn"]', 'system', 'Role request status options'),

-- Question and focus settings
('focus_question_types', '["general", "technical", "business", "impact", "implementation", "social", "ethical", "medical", "regulatory"]', 'question', 'Types of focus questions'),
('question_type_options', '["open_ended", "multiple_choice", "yes_no", "rating", "ranking"]', 'question', 'Question type options'),

-- Experience and evaluation
('experience_levels', '["beginner", "intermediate", "advanced", "expert"]', 'evaluation', 'Experience levels'),
('evaluator_types', '["lead_expert", "evaluator", "reviewer", "subject_matter_expert", "external_consultant"]', 'evaluation', 'Types of evaluators'),

-- Language settings
('supported_languages', '[{"code": "en", "label": "English", "nativeLabel": "English"}, {"code": "ar", "label": "Arabic", "nativeLabel": "العربية"}, {"code": "he", "label": "Hebrew", "nativeLabel": "עברית"}, {"code": "fa", "label": "Persian", "nativeLabel": "فارسی"}]', 'language', 'Supported languages'),
('ui_language_options', '["en", "ar"]', 'language', 'UI language options'),

-- Stakeholder settings
('stakeholder_influence_levels', '["high", "medium", "low"]', 'stakeholder', 'Influence levels for stakeholders'),
('stakeholder_interest_levels', '["high", "medium", "low"]', 'stakeholder', 'Interest levels for stakeholders'),
('stakeholder_categories', '["government", "private_sector", "academic", "civil_society", "international", "media", "experts"]', 'stakeholder', 'Categories for stakeholders'),
('engagement_levels', '["high", "medium", "low"]', 'stakeholder', 'Engagement levels'),

-- Idea and innovation settings
('idea_assignment_types', '["reviewer", "evaluator", "implementer", "observer"]', 'idea', 'Assignment types for ideas'),
('idea_maturity_levels', '["concept", "prototype", "pilot", "scaling"]', 'idea', 'Maturity levels for ideas'),
('priority_levels', '["low", "medium", "high", "urgent"]', 'system', 'Priority levels'),

-- Campaign settings
('campaign_theme_options', '["digital_transformation", "sustainability", "smart_cities", "healthcare", "education", "fintech", "energy", "transportation"]', 'campaign', 'Theme options for campaigns'),

-- Organization and relationship settings
('relationship_types', '["direct", "indirect", "collaborative", "competitive", "supportive"]', 'system', 'Types of relationships'),
('organization_types', '["operational", "strategic", "administrative", "technical", "support"]', 'system', 'Types of organizations'),
('assignment_types', '["campaign", "event", "project", "content", "analysis"]', 'system', 'Types of assignments'),
('extended_status_options', '["planning", "scheduled", "ongoing", "postponed", "draft", "published"]', 'system', 'Extended status options'),

-- Sector and categorization
('sector_types', '["health", "education", "transport", "environment", "economy", "technology", "finance", "defense", "social"]', 'sector', 'Types of sectors'),
('tag_categories', '["innovation", "digital", "sustainability", "efficiency", "technology", "business", "social", "environmental"]', 'tag', 'Categories for tags'),
('sensitivity_levels', '["normal", "sensitive", "confidential"]', 'system', 'Sensitivity levels'),

-- Frequency and timing settings
('frequency_options', '["hourly", "daily", "weekly", "monthly", "yearly"]', 'system', 'Frequency options'),
('backup_frequency_options', '["hourly", "daily", "weekly", "monthly"]', 'system', 'Backup frequency options'),
('report_frequency_options', '["daily", "weekly", "monthly"]', 'system', 'Report frequency options'),
('reminder_frequency_options', '["daily", "weekly", "monthly"]', 'system', 'Reminder frequency options'),
('recurrence_pattern_options', '["daily", "weekly", "monthly", "yearly"]', 'system', 'Recurrence pattern options'),
('time_range_options', '["all", "last_30", "last_90", "last_year"]', 'system', 'Time range options'),

-- Role request settings
('role_request_justifications', '["domain_expertise", "evaluation_experience", "academic_background", "industry_experience", "certification", "volunteer_contribution"]', 'role', 'Justifications for role requests'),

-- UI and theme settings
('chart_color_palette', '["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#ff7c7c", "#8dd9cc"]', 'ui', 'Color palette for charts'),
('chart_visualization_colors', '["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16"]', 'ui', 'Colors for chart visualizations'),
('theme_variants', '["modern", "minimal", "vibrant"]', 'ui', 'Theme variants'),
('theme_color_schemes', '["light", "dark", "auto"]', 'ui', 'Color schemes for themes'),
('theme_border_radius_options', '["none", "sm", "md", "lg", "xl"]', 'ui', 'Border radius options for themes'),

-- Filter and navigation settings
('challenge_filter_status_options', '["all", "draft", "published", "active", "closed", "archived"]', 'filter', 'Status options for challenge filters'),
('navigation_menu_visibility_roles', '["admin", "super_admin", "team_member", "evaluator", "domain_expert"]', 'navigation', 'Roles for navigation menu visibility'),
('data_export_formats', '["csv", "excel", "pdf", "json"]', 'export', 'Data export formats')

ON CONFLICT (setting_key) DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    updated_at = now();

-- Create system_lists table for cached database-driven lists
CREATE TABLE IF NOT EXISTS public.system_lists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    list_key varchar NOT NULL UNIQUE,
    list_values jsonb NOT NULL DEFAULT '[]'::jsonb,
    category varchar,
    description text,
    is_active boolean DEFAULT true,
    cache_ttl_hours integer DEFAULT 24,
    last_updated timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on system_lists
ALTER TABLE public.system_lists ENABLE ROW LEVEL SECURITY;

-- Create policies for system_lists
CREATE POLICY "Everyone can view active system lists" ON public.system_lists
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage system lists" ON public.system_lists
    FOR ALL USING (
        has_role(auth.uid(), 'admin'::app_role) OR 
        has_role(auth.uid(), 'super_admin'::app_role)
    );

-- Insert initial system lists
INSERT INTO public.system_lists (list_key, list_values, category, description) VALUES
('opportunity_types', '["partnership", "funding", "collaboration", "research", "development", "consultation"]', 'opportunity', 'Types of opportunities'),
('opportunity_status_options', '["draft", "open", "closed", "paused", "archived"]', 'opportunity', 'Status options for opportunities'),
('application_status_options', '["draft", "submitted", "under_review", "approved", "rejected", "withdrawn"]', 'opportunity', 'Status options for opportunity applications'),
('budget_ranges', '["under_10k", "10k_50k", "50k_100k", "100k_500k", "500k_1m", "over_1m"]', 'financial', 'Budget ranges for opportunities'),
('collaboration_types', '["technical", "strategic", "financial", "research", "implementation", "advisory"]', 'collaboration', 'Types of collaboration'),
('attachment_types', '["document", "image", "video", "audio", "presentation", "spreadsheet", "code"]', 'file', 'Types of file attachments'),
('notification_channels', '["email", "sms", "push", "in_app"]', 'notification', 'Notification delivery channels'),
('notification_types', '["info", "warning", "error", "success", "urgent"]', 'notification', 'Types of notifications'),
('workflow_statuses', '["initiated", "in_progress", "review_pending", "approved", "rejected", "completed", "cancelled"]', 'workflow', 'Workflow status options'),
('visibility_levels', '["public", "internal", "restricted", "private"]', 'access', 'Visibility levels for content'),
('integration_types', '["api", "webhook", "database", "file_sync", "email", "sms"]', 'integration', 'Types of system integrations'),
('file_categories', '["documents", "images", "videos", "presentations", "reports", "templates", "resources"]', 'file', 'Categories for file organization')
ON CONFLICT (list_key) DO UPDATE SET 
    list_values = EXCLUDED.list_values,
    updated_at = now();

-- Create function to refresh system lists cache
CREATE OR REPLACE FUNCTION public.refresh_system_lists_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update last_updated timestamp for all lists to trigger cache refresh
    UPDATE public.system_lists SET updated_at = now();
    
    -- Log the cache refresh
    INSERT INTO public.activity_events (
        event_type, entity_type, entity_id, metadata
    ) VALUES (
        'cache_refresh', 'system_lists', null, 
        jsonb_build_object('refreshed_at', now(), 'refreshed_by', auth.uid())
    );
END;
$$;