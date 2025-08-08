-- Add missing UI settings translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('settings.feedback_rating_labels.label', 'Feedback Rating Labels', 'تسميات تقييم التعليقات', 'settings'),
('settings.feedback_rating_labels.description', 'Labels for feedback rating system', 'تسميات نظام تقييم التعليقات', 'settings'),
('settings.supported_layout_types.label', 'Supported Layout Types', 'أنواع التخطيط المدعومة', 'settings'),
('settings.supported_layout_types.description', 'Available layout types for the interface', 'أنواع التخطيط المتاحة للواجهة', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();