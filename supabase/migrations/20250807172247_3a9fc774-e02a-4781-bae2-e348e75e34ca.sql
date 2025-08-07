-- Add Ideas settings translation keys (Part 3 - Final)
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Evaluation continued
('settings.idea_evaluation_require_comments.label', 'Require Evaluation Comments', 'تتطلب تعليقات التقييم', 'settings'),
('settings.idea_evaluation_require_comments.description', 'Require comments when evaluating ideas', 'تتطلب تعليقات عند تقييم الأفكار', 'settings'),

('settings.idea_evaluation_scale_max.label', 'Maximum Evaluation Scale', 'الحد الأقصى لمقياس التقييم', 'settings'),
('settings.idea_evaluation_scale_max.description', 'Maximum value on the evaluation scale', 'القيمة القصوى في مقياس التقييم', 'settings'),

-- Implementation & Lifecycle
('settings.idea_implementation_tracking_enabled.label', 'Enable Implementation Tracking', 'تفعيل تتبع التنفيذ', 'settings'),
('settings.idea_implementation_tracking_enabled.description', 'Track implementation progress of ideas', 'تتبع تقدم تنفيذ الأفكار', 'settings'),

('settings.idea_lifecycle_milestones_enabled.label', 'Enable Lifecycle Milestones', 'تفعيل معالم دورة الحياة', 'settings'),
('settings.idea_lifecycle_milestones_enabled.description', 'Enable milestone tracking for idea lifecycle', 'تفعيل تتبع المعالم لدورة حياة الفكرة', 'settings'),

('settings.idea_milestone_notifications_enabled.label', 'Enable Milestone Notifications', 'تفعيل إشعارات المعالم', 'settings'),
('settings.idea_milestone_notifications_enabled.description', 'Send notifications when milestones are reached', 'إرسال إشعارات عند الوصول للمعالم', 'settings'),

-- Limits and Constraints
('settings.idea_items_per_page.label', 'Ideas Per Page', 'الأفكار لكل صفحة', 'settings'),
('settings.idea_items_per_page.description', 'Number of ideas displayed per page', 'عدد الأفكار المعروضة لكل صفحة', 'settings'),

('settings.idea_max_attachment_size_mb.label', 'Maximum Attachment Size (MB)', 'الحد الأقصى لحجم المرفق (ميجابايت)', 'settings'),
('settings.idea_max_attachment_size_mb.description', 'Maximum file size for idea attachments in MB', 'الحد الأقصى لحجم ملف مرفقات الأفكار بالميجابايت', 'settings'),

('settings.idea_max_attachments_per_idea.label', 'Maximum Attachments Per Idea', 'الحد الأقصى للمرفقات لكل فكرة', 'settings'),
('settings.idea_max_attachments_per_idea.description', 'Maximum number of attachments per idea', 'الحد الأقصى لعدد المرفقات لكل فكرة', 'settings'),

('settings.idea_max_collaborators.label', 'Maximum Collaborators', 'الحد الأقصى للمتعاونين', 'settings'),
('settings.idea_max_collaborators.description', 'Maximum number of collaborators per idea', 'الحد الأقصى لعدد المتعاونين لكل فكرة', 'settings'),

('settings.idea_max_description_length.label', 'Maximum Description Length', 'الحد الأقصى لطول الوصف', 'settings'),
('settings.idea_max_description_length.description', 'Maximum characters in idea description', 'الحد الأقصى للأحرف في وصف الفكرة', 'settings'),

('settings.idea_max_title_length.label', 'Maximum Title Length', 'الحد الأقصى لطول العنوان', 'settings'),
('settings.idea_max_title_length.description', 'Maximum characters in idea title', 'الحد الأقصى للأحرف في عنوان الفكرة', 'settings'),

('settings.idea_min_description_length.label', 'Minimum Description Length', 'الحد الأدنى لطول الوصف', 'settings'),
('settings.idea_min_description_length.description', 'Minimum characters required in idea description', 'الحد الأدنى للأحرف المطلوبة في وصف الفكرة', 'settings'),

-- Display and Interface
('settings.idea_predefined_tags.label', 'Predefined Tags', 'العلامات المحددة مسبقاً', 'settings'),
('settings.idea_predefined_tags.description', 'Predefined tags available for ideas', 'العلامات المحددة مسبقاً المتاحة للأفكار', 'settings'),

('settings.idea_public_analytics_enabled.label', 'Enable Public Analytics', 'تفعيل التحليلات العامة', 'settings'),
('settings.idea_public_analytics_enabled.description', 'Make idea analytics publicly visible', 'جعل تحليلات الأفكار مرئية للعامة', 'settings'),

('settings.idea_require_focus_question.label', 'Require Focus Question', 'تتطلب سؤال التركيز', 'settings'),
('settings.idea_require_focus_question.description', 'Require focus question when submitting ideas', 'تتطلب سؤال التركيز عند إرسال الأفكار', 'settings'),

('settings.idea_show_preview_on_hover.label', 'Show Preview on Hover', 'إظهار المعاينة عند التمرير', 'settings'),
('settings.idea_show_preview_on_hover.description', 'Show idea preview when hovering over titles', 'إظهار معاينة الفكرة عند التمرير فوق العناوين', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();