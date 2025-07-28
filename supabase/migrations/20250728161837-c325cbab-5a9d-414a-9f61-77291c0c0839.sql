-- Create system_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_category VARCHAR NOT NULL DEFAULT 'general',
  description TEXT,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for system settings
CREATE POLICY "Team members can view system settings" 
ON public.system_settings 
FOR SELECT 
USING ((EXISTS ( SELECT 1 FROM innovation_team_members itm WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Insert default challenge settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('challenge_default_status', '"draft"', 'challenges', 'Default status for new challenges'),
('challenge_default_priority', '"medium"', 'challenges', 'Default priority level for new challenges'),
('challenge_default_sensitivity', '"normal"', 'challenges', 'Default sensitivity level for new challenges'),
('challenge_max_per_user', '10', 'challenges', 'Maximum challenges per user'),
('challenge_auto_archive_days', '365', 'challenges', 'Auto archive after days'),
('challenge_default_view_mode', '"cards"', 'challenges', 'Default view mode for challenges'),
('challenge_items_per_page', '12', 'challenges', 'Items per page in challenge list'),
('challenge_enable_advanced_filters', 'true', 'challenges', 'Enable advanced filtering options'),
('challenge_email_notifications', 'true', 'challenges', 'Enable email notifications'),
('challenge_require_approval', 'true', 'challenges', 'Require approval for publishing'),
('ui_default_textarea_rows', '3', 'ui', 'Default textarea rows'),
('ui_enable_rtl_support', 'true', 'ui', 'Enable RTL language support'),
('ui_default_language', '"ar"', 'ui', 'Default language (ar/en)'),
('ui_theme_preference', '"system"', 'ui', 'Theme preference (light/dark/system)')
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();