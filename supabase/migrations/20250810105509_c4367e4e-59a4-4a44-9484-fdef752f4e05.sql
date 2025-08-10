-- Add comprehensive system settings using correct column name
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
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
('role_request_status_options', '["pending", "approved", "rejected", "withdrawn"]', 'system', 'Role request status options')

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