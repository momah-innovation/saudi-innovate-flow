-- Create uploader settings table to store global and upload-specific configurations
CREATE TABLE public.uploader_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_type VARCHAR(50) NOT NULL,
  setting_key VARCHAR(100) NOT NULL,
  setting_value JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(setting_type, setting_key)
);

-- Enable RLS
ALTER TABLE public.uploader_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage uploader settings"
ON public.uploader_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Team members can view uploader settings"
ON public.uploader_settings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create update trigger
CREATE TRIGGER update_uploader_settings_updated_at
  BEFORE UPDATE ON public.uploader_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default global settings
INSERT INTO public.uploader_settings (setting_type, setting_key, setting_value) VALUES
('global', 'auto_cleanup_enabled', '{"value": true, "description": "Enable automatic cleanup of temporary files"}'),
('global', 'default_cleanup_days', '{"value": 7, "description": "Default number of days before automatic cleanup"}'),
('global', 'max_concurrent_uploads', '{"value": 3, "description": "Maximum number of concurrent uploads per user"}'),
('global', 'chunk_size_mb', '{"value": 1, "description": "Upload chunk size in megabytes"}'),
('global', 'retry_attempts', '{"value": 3, "description": "Number of retry attempts for failed uploads"}'),
('global', 'compression_enabled', '{"value": true, "description": "Enable image compression for uploads"}'),
('global', 'thumbnail_generation', '{"value": true, "description": "Enable automatic thumbnail generation"}');

-- Insert default upload configurations
INSERT INTO public.uploader_settings (setting_type, setting_key, setting_value) VALUES
('upload_config', 'OPPORTUNITY_IMAGES', '{
  "uploadType": "opportunities-images-public",
  "bucket": "opportunities-images-public",
  "path": "opportunity-images",
  "maxSizeBytes": 5242880,
  "allowedTypes": ["image/jpeg", "image/png", "image/webp"],
  "maxFiles": 3,
  "enabled": true,
  "autoCleanup": true,
  "cleanupDays": 7
}'),
('upload_config', 'USER_AVATARS', '{
  "uploadType": "user-avatars-public",
  "bucket": "user-avatars-public", 
  "path": "profiles",
  "maxSizeBytes": 3145728,
  "allowedTypes": ["image/jpeg", "image/png", "image/webp"],
  "maxFiles": 1,
  "enabled": true,
  "autoCleanup": false,
  "cleanupDays": 0
}'),
('upload_config', 'CHALLENGE_DOCUMENTS', '{
  "uploadType": "challenges-documents-private",
  "bucket": "challenges-documents-private",
  "path": "documents", 
  "maxSizeBytes": 20971520,
  "allowedTypes": ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  "maxFiles": 10,
  "enabled": true,
  "autoCleanup": true,
  "cleanupDays": 30
}'),
('upload_config', 'EVENT_RESOURCES', '{
  "uploadType": "event-resources",
  "bucket": "event-resources",
  "path": "resources",
  "maxSizeBytes": 52428800,
  "allowedTypes": ["application/pdf", "image/jpeg", "image/png", "video/mp4", "audio/mpeg"],
  "maxFiles": 20,
  "enabled": true,
  "autoCleanup": true,
  "cleanupDays": 90
}');