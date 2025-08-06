-- Add missing array-based settings that are used in UI
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type, description) VALUES
('ai_features', '["idea_generation", "content_moderation", "smart_matching", "evaluation_assist", "trend_analysis"]', 'ai', 'array', 'Available AI features'),
('ai_models', '["gpt-4", "gpt-3.5-turbo", "claude-3", "gemini-pro"]', 'ai', 'array', 'Available AI models'),
('evaluation_criteria', '["technical_feasibility", "financial_viability", "market_potential", "strategic_alignment", "innovation_level"]', 'evaluations', 'array', 'Evaluation criteria options'),
('partner_types', '["technology", "financial", "strategic", "research", "implementation"]', 'partners', 'array', 'Partner type categories'),

-- Add more missing array settings found in UI
('tag_categories', '["innovation", "digital", "sustainability", "efficiency", "technology", "business", "social", "environmental"]', 'analytics', 'array', 'Tag categories for content organization'),
('assignment_types', '["campaign", "event", "project", "content", "analysis"]', 'campaigns', 'array', 'Campaign assignment types'),
('evaluator_types', '["lead_expert", "evaluator", "reviewer", "subject_matter_expert", "external_consultant"]', 'evaluations', 'array', 'Types of evaluators'),
('expert_role_types', '["خبير رئيسي", "مقيم", "مراجع", "خبير موضوع", "مستشار خارجي"]', 'evaluations', 'array', 'Expert role types in Arabic'),
('event_types', '["workshop", "seminar", "conference", "networking", "hackathon", "pitch_session", "training"]', 'events', 'array', 'Event type categories'),
('event_categories', '["standalone", "campaign_event", "training", "workshop"]', 'events', 'array', 'Event categories'),
('focus_question_types', '["عام", "تقني", "تجاري", "تأثير", "تنفيذ", "اجتماعي", "أخلاقي", "طبي", "تنظيمي"]', 'challenges', 'array', 'Focus question types'),
('opportunity_types', '["تطوير حلول", "شراكة تقنية", "تنفيذ مشروع", "استشارة", "تدريب"]', 'opportunities', 'array', 'Opportunity types'),
('notification_types', '["email", "sms", "push", "in_app", "webhook"]', 'notifications', 'array', 'Notification delivery types'),
('integration_types', '["api", "webhook", "sso", "file_sync", "database"]', 'integrations', 'array', 'Integration types available');