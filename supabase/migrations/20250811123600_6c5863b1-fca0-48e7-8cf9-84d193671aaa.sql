-- Add final missing settings translation keys for complete coverage
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
  ('settings.notification_channels.description', 'Configure notification delivery channels and methods', 'تكوين قنوات وطرق توصيل الإشعارات', 'settings'),
  ('settings.rating_scales.label', 'Rating Scales', 'مقاييس التقييم', 'settings'),
  ('settings.rating_scales.description', 'Define rating scales and measurement criteria for evaluations', 'تحديد مقاييس التقييم ومعايير القياس للتقييمات', 'settings'),
  ('settings.status_types.label', 'Status Types', 'أنواع الحالات', 'settings'),
  ('settings.status_types.description', 'Manage different status types and workflow states', 'إدارة أنواع الحالات المختلفة وحالات سير العمل', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();