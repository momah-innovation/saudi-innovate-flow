-- Add missing settings translation keys for campaign themes and other settings
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('settings.campaign_themes.label', 'Campaign Themes', 'موضوعات الحملات', 'settings'),
('settings.campaign_themes.description', 'List of available themes for campaigns', 'قائمة الموضوعات المتاحة للحملات', 'settings'),
('settings.analytics_metrics.label', 'Analytics Metrics', 'مقاييس التحليلات', 'settings'),
('settings.analytics_metrics.description', 'List of analytics metrics to track', 'قائمة مقاييس التحليلات للمتابعة', 'settings'),
('settings.team_specializations.label', 'Team Specializations', 'تخصصات الفريق', 'settings'),
('settings.team_specializations.description', 'List of team member specializations', 'قائمة تخصصات أعضاء الفريق', 'settings'),
('settings.expert_roles.label', 'Expert Roles', 'أدوار الخبراء', 'settings'),
('settings.expert_roles.description', 'List of available expert roles', 'قائمة أدوار الخبراء المتاحة', 'settings'),
('settings.idea_assignment_types.label', 'Idea Assignment Types', 'أنواع تكليف الأفكار', 'settings'),
('settings.idea_assignment_types.description', 'List of idea assignment types', 'قائمة أنواع تكليف الأفكار', 'settings'),
('settings.evaluator_types.label', 'Evaluator Types', 'أنواع المقيمين', 'settings'),
('settings.evaluator_types.description', 'List of evaluator types and roles', 'قائمة أنواع وأدوار المقيمين', 'settings'),
('settings.challenge_types.label', 'Challenge Types', 'أنواع التحديات', 'settings'),
('settings.challenge_types.description', 'List of available challenge types', 'قائمة أنواع التحديات المتاحة', 'settings'),
('settings.priority_levels.label', 'Priority Levels', 'مستويات الأولوية', 'settings'),
('settings.priority_levels.description', 'List of priority levels for items', 'قائمة مستويات الأولوية للعناصر', 'settings'),
('settings.status_options.label', 'Status Options', 'خيارات الحالة', 'settings'),
('settings.status_options.description', 'List of available status options', 'قائمة خيارات الحالة المتاحة', 'settings'),
('settings.event_types.label', 'Event Types', 'أنواع الفعاليات', 'settings'),
('settings.event_types.description', 'List of available event types', 'قائمة أنواع الفعاليات المتاحة', 'settings'),
('settings.event_categories.label', 'Event Categories', 'فئات الفعاليات', 'settings'),
('settings.event_categories.description', 'List of event categories', 'قائمة فئات الفعاليات', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();