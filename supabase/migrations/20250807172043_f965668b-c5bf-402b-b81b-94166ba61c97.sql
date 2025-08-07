-- Add Ideas settings translation keys (Part 2)
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Collaboration
('settings.idea_collaboration_enabled.label', 'Enable Idea Collaboration', 'تفعيل التعاون في الأفكار', 'settings'),
('settings.idea_collaboration_enabled.description', 'Allow multiple users to collaborate on ideas', 'السماح لعدة مستخدمين بالتعاون في الأفكار', 'settings'),

('settings.idea_collaboration_invite_expiry_hours.label', 'Collaboration Invite Expiry (Hours)', 'انتهاء دعوة التعاون (ساعات)', 'settings'),
('settings.idea_collaboration_invite_expiry_hours.description', 'Hours before collaboration invites expire', 'الساعات قبل انتهاء دعوات التعاون', 'settings'),

-- Comments
('settings.idea_comments_allow_replies.label', 'Allow Comment Replies', 'السماح بالرد على التعليقات', 'settings'),
('settings.idea_comments_allow_replies.description', 'Allow users to reply to comments on ideas', 'السماح للمستخدمين بالرد على التعليقات على الأفكار', 'settings'),

('settings.idea_comments_enabled.label', 'Enable Idea Comments', 'تفعيل تعليقات الأفكار', 'settings'),
('settings.idea_comments_enabled.description', 'Allow users to comment on ideas', 'السماح للمستخدمين بالتعليق على الأفكار', 'settings'),

('settings.idea_comments_max_length.label', 'Maximum Comment Length', 'الحد الأقصى لطول التعليق', 'settings'),
('settings.idea_comments_max_length.description', 'Maximum number of characters in a comment', 'الحد الأقصى لعدد الأحرف في التعليق', 'settings'),

('settings.idea_comments_moderation_enabled.label', 'Enable Comment Moderation', 'تفعيل إشراف التعليقات', 'settings'),
('settings.idea_comments_moderation_enabled.description', 'Require moderation before comments are published', 'تتطلب الإشراف قبل نشر التعليقات', 'settings'),

('settings.idea_comments_public_by_default.label', 'Comments Public by Default', 'التعليقات عامة افتراضياً', 'settings'),
('settings.idea_comments_public_by_default.description', 'Make comments public by default', 'جعل التعليقات عامة افتراضياً', 'settings'),

-- View Mode
('settings.idea_default_view_mode.label', 'Default View Mode', 'وضع العرض الافتراضي', 'settings'),
('settings.idea_default_view_mode.description', 'Default view mode for displaying ideas', 'وضع العرض الافتراضي لعرض الأفكار', 'settings'),

-- Draft Expiry
('settings.idea_draft_expiry_days.label', 'Draft Expiry Days', 'أيام انتهاء المسودة', 'settings'),
('settings.idea_draft_expiry_days.description', 'Number of days before drafts expire', 'عدد الأيام قبل انتهاء المسودات', 'settings'),

-- Advanced Filters
('settings.idea_enable_advanced_filters.label', 'Enable Advanced Filters', 'تفعيل الفلاتر المتقدمة', 'settings'),
('settings.idea_enable_advanced_filters.description', 'Enable advanced filtering options for ideas', 'تفعيل خيارات التصفية المتقدمة للأفكار', 'settings'),

-- Evaluation
('settings.idea_evaluation_criteria.label', 'Evaluation Criteria', 'معايير التقييم', 'settings'),
('settings.idea_evaluation_criteria.description', 'Criteria used for evaluating ideas', 'المعايير المستخدمة لتقييم الأفكار', 'settings'),

('settings.idea_evaluation_criteria_weights.label', 'Evaluation Criteria Weights', 'أوزان معايير التقييم', 'settings'),
('settings.idea_evaluation_criteria_weights.description', 'Weights assigned to each evaluation criteria', 'الأوزان المخصصة لكل معيار تقييم', 'settings'),

('settings.idea_evaluation_multiple_allowed.label', 'Allow Multiple Evaluations', 'السماح بتقييمات متعددة', 'settings'),
('settings.idea_evaluation_multiple_allowed.description', 'Allow multiple evaluations from the same user', 'السماح بتقييمات متعددة من نفس المستخدم', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();