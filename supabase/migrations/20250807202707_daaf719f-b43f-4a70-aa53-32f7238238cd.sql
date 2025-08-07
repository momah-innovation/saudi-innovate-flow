-- Add remaining hardcoded arrays that were missed

-- Analytics chart colors (standardized across all components)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('analytics_colors_primary', '["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"]', 'ui_theme', 'array'),
('analytics_colors_secondary', '["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]', 'ui_theme', 'array'),
('statistics_colors', '["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"]', 'ui_theme', 'array')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- File upload MIME types
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('mime_types_images', '["image/jpeg", "image/png", "image/webp"]', 'file_upload', 'array'),
('mime_types_documents', '["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]', 'file_upload', 'array'),
('mime_types_videos', '["video/mp4", "video/webm"]', 'file_upload', 'array'),
('mime_types_audio', '["audio/mp3", "audio/wav", "audio/mpeg"]', 'file_upload', 'array'),
('mime_types_mixed', '["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]', 'file_upload', 'array'),
('mime_types_avatars', '["image/jpeg", "image/png", "application/pdf"]', 'file_upload', 'array')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- UI Layout and feedback options  
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('layout_types', '["cards", "list", "grid"]', 'ui_layout', 'array'),
('feedback_labels', '["Poor", "Fair", "Good", "Very Good", "Excellent"]', 'ui_feedback', 'array'),
('navigation_group_order', '["main", "discover", "personal", "workflow", "subscription", "analytics", "admin", "system", "settings"]', 'ui_navigation', 'array'),
('event_visible_tabs', '["details", "registration", "feedback"]', 'events', 'array')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Access control constants
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('access_levels', '["none", "read", "write", "admin"]', 'access_control', 'array'),
('resource_types', '["page", "feature", "action"]', 'access_control', 'array')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Animation shapes (UI component)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('animation_shapes', '["circle", "square", "triangle"]', 'ui_animations', 'array')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Add translations for all new settings
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Analytics colors
('settings.analytics_colors_primary.label', 'Primary Analytics Colors', 'ألوان التحليلات الأساسية', 'settings'),
('settings.analytics_colors_primary.description', 'Color palette for primary analytics charts', 'لوحة الألوان للرسوم البيانية الأساسية', 'settings'),
('settings.analytics_colors_secondary.label', 'Secondary Analytics Colors', 'ألوان التحليلات الثانوية', 'settings'),
('settings.analytics_colors_secondary.description', 'Color palette for secondary analytics displays', 'لوحة الألوان لعروض التحليلات الثانوية', 'settings'),
('settings.statistics_colors.label', 'Statistics Colors', 'ألوان الإحصائيات', 'settings'),
('settings.statistics_colors.description', 'Color scheme for statistics components using CSS variables', 'نظام الألوان لمكونات الإحصائيات باستخدام متغيرات CSS', 'settings'),

-- MIME types
('settings.mime_types_images.label', 'Image MIME Types', 'أنواع MIME للصور', 'settings'),
('settings.mime_types_images.description', 'Supported MIME types for image uploads', 'أنواع MIME المدعومة لرفع الصور', 'settings'),
('settings.mime_types_documents.label', 'Document MIME Types', 'أنواع MIME للمستندات', 'settings'),
('settings.mime_types_documents.description', 'Supported MIME types for document uploads', 'أنواع MIME المدعومة لرفع المستندات', 'settings'),
('settings.mime_types_videos.label', 'Video MIME Types', 'أنواع MIME للفيديو', 'settings'),
('settings.mime_types_videos.description', 'Supported MIME types for video uploads', 'أنواع MIME المدعومة لرفع الفيديو', 'settings'),
('settings.mime_types_audio.label', 'Audio MIME Types', 'أنواع MIME للصوت', 'settings'),
('settings.mime_types_audio.description', 'Supported MIME types for audio uploads', 'أنواع MIME المدعومة لرفع الملفات الصوتية', 'settings'),

-- UI components
('settings.layout_types.label', 'Layout Types', 'أنواع التخطيط', 'settings'),
('settings.layout_types.description', 'Available layout options for content display', 'خيارات التخطيط المتاحة لعرض المحتوى', 'settings'),
('settings.feedback_labels.label', 'Feedback Labels', 'تصنيفات التقييم', 'settings'),
('settings.feedback_labels.description', 'Labels used in feedback rating systems', 'التصنيفات المستخدمة في أنظمة تقييم التقييم', 'settings'),
('settings.navigation_group_order.label', 'Navigation Group Order', 'ترتيب مجموعات التنقل', 'settings'),
('settings.navigation_group_order.description', 'Order of navigation groups in the sidebar', 'ترتيب مجموعات التنقل في الشريط الجانبي', 'settings'),

-- Access control
('settings.access_levels.label', 'Access Levels', 'مستويات الوصول', 'settings'),
('settings.access_levels.description', 'Available access permission levels', 'مستويات أذونات الوصول المتاحة', 'settings'),
('settings.resource_types.label', 'Resource Types', 'أنواع الموارد', 'settings'),
('settings.resource_types.description', 'Types of resources that can be access controlled', 'أنواع الموارد التي يمكن التحكم في الوصول إليها', 'settings');