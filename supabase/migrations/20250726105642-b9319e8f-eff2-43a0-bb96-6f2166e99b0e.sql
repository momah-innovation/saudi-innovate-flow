-- Create system_settings table to store system-wide configuration
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_category VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for system settings (only admins can manage)
CREATE POLICY "Admins can manage system settings" 
ON public.system_settings 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('team_max_concurrent_projects', '5', 'team_management', 'Default maximum concurrent projects for new team members'),
('team_default_performance_rating', '0', 'team_management', 'Starting performance rating for new team members'),
('challenge_default_duration_days', '30', 'challenge_management', 'Default duration for new challenges in days'),
('challenge_default_submission_limit', '5', 'challenge_management', 'Default submission limit for challenges'),
('challenge_auto_approve_ideas', 'false', 'challenge_management', 'Automatically approve submitted ideas'),
('notification_email_enabled', 'true', 'notifications', 'Send email notifications for important events'),
('notification_role_requests_enabled', 'true', 'notifications', 'Notify admins of new role requests'),
('notification_challenge_deadlines_enabled', 'true', 'notifications', 'Send reminders before challenge deadlines');