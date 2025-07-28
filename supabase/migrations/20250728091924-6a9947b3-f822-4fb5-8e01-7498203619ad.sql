-- Add Arabic system settings for stakeholders
INSERT INTO system_settings (setting_key, setting_value, setting_category, description)
VALUES 
  ('stakeholder_type_options', '["حكومي", "خاص", "أكاديمي", "غير ربحي", "دولي"]', 'stakeholder', 'أنواع أصحاب المصلحة المتاحة'),
  ('stakeholder_status_options', '["نشط", "غير نشط", "معلق", "محظور"]', 'stakeholder', 'خيارات حالة أصحاب المصلحة'),
  ('stakeholder_role_options', '["شريك استراتيجي", "مطور", "مقدم خدمات", "مستشار", "مطبق"]', 'stakeholder', 'أدوار أصحاب المصلحة المتاحة'),
  ('influence_level_options', '["عالي", "متوسط", "منخفض"]', 'stakeholder', 'مستويات التأثير المتاحة'),
  ('engagement_level_options', '["عالي", "متوسط", "منخفض", "معدوم"]', 'stakeholder', 'مستويات المشاركة المتاحة')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description,
  updated_at = now();