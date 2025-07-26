-- Add status and type lists to system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
-- Challenge status options
('challenge_status_options', '["draft", "published", "active", "closed", "archived", "completed"]', 'challenge', 'Available status options for challenges'),

-- Partner related options  
('partner_status_options', '["active", "inactive", "pending", "suspended"]', 'partner', 'Available status options for partners'),
('partner_type_options', '["government", "private", "academic", "non_profit", "international"]', 'partner', 'Available partner types'),
('partnership_type_options', '["collaborator", "sponsor", "technical_partner", "strategic_partner", "implementation_partner"]', 'partner', 'Available partnership types'),

-- Expert and assignment status
('expert_status_options', '["active", "inactive", "available", "busy", "unavailable"]', 'expert', 'Available status options for experts'),
('assignment_status_options', '["active", "inactive", "pending", "completed", "cancelled"]', 'assignment', 'Available status options for assignments'),

-- Role request status
('role_request_status_options', '["pending", "approved", "rejected", "withdrawn"]', 'role', 'Available status options for role requests'),

-- User status options
('user_status_options', '["active", "inactive", "suspended", "pending", "revoked"]', 'user', 'Available status options for users'),

-- General status categories that are reused
('general_status_options', '["active", "inactive", "pending", "completed", "cancelled", "draft", "published", "archived"]', 'general', 'General status options used across the application');