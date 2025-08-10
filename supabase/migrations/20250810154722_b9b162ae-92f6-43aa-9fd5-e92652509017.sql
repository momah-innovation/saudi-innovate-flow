-- Challenge Wizard Translation Keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- Challenge Wizard Steps
('challenge_wizard.basic_info', 'Basic Information', 'المعلومات الأساسية', 'challenge_wizard'),
('challenge_wizard.organizational', 'Organizational Information', 'المعلومات التنظيمية', 'challenge_wizard'),
('challenge_wizard.technical', 'Technical Details', 'التفاصيل التقنية', 'challenge_wizard'),
('challenge_wizard.relationships', 'Partnerships & Relationships', 'الشراكات والعلاقات', 'challenge_wizard'),
('challenge_wizard.review', 'Review & Submit', 'مراجعة وإرسال', 'challenge_wizard'),

-- Comments and error messages
('challenge_wizard.update_existing', 'Update existing challenge', 'تحديث التحدي الموجود', 'challenge_wizard'),
('challenge_wizard.create_new', 'Create new challenge', 'إنشاء تحدي جديد', 'challenge_wizard'),
('challenge_wizard.add_experts', 'Add selected experts', 'إضافة الخبراء المختارين', 'challenge_wizard'),
('challenge_wizard.add_partners', 'Add selected partners', 'إضافة الشركاء المختارين', 'challenge_wizard'),
('challenge_wizard.failed_load', 'Failed to load challenge wizard data - using defaults', 'فشل في تحميل بيانات معالج التحدي - استخدام القيم الافتراضية', 'challenge_wizard'),

-- Vision 2030 and KPI Fields
('form.vision_2030_goal', 'Vision 2030 Goal', 'هدف رؤية 2030', 'form'),
('form.kpi_alignment', 'Related KPIs', 'مؤشرات الأداء المرتبطة', 'form'),
('placeholder.vision_2030_goal', 'How does this challenge contribute to Vision 2030 goals?', 'كيف يساهم هذا التحدي في تحقيق أهداف رؤية 2030؟', 'placeholder'),
('placeholder.kpi_alignment', 'Key performance indicators affected by this challenge', 'مؤشرات الأداء الرئيسية المتأثرة بهذا التحدي', 'placeholder'),

-- Partnership and Expert Assignment
('form.participating_partners', 'Participating Partners', 'الشركاء المشاركون', 'form'),
('form.assigned_experts', 'Assigned Experts', 'الخبراء المعينون', 'form'),
('form.collaboration_details', 'Collaboration Details', 'تفاصيل التعاون', 'form'),
('form.internal_team_notes', 'Internal Team Notes', 'ملاحظات الفريق الداخلي', 'form'),
('placeholder.collaboration_details', 'Details on how to collaborate with partners and experts', 'تفاصيل كيفية التعاون مع الشركاء والخبراء', 'placeholder'),
('placeholder.internal_team_notes', 'Internal notes for the team (will not be visible to participants)', 'ملاحظات داخلية للفريق (لن تظهر للمشاركين)', 'placeholder'),

-- Expert descriptions
('expert.prefix', 'Expert', 'خبير', 'expert'),
('expert.diverse_areas', 'Diverse areas', 'مجالات متنوعة', 'expert'),
('expert.varied', 'Varied', 'متنوع', 'expert'),

-- Review section titles and labels
('review.challenge_info', 'Challenge Information', 'معلومات التحدي', 'review'),
('review.technical_details', 'Technical Details', 'التفاصيل التقنية', 'review'),
('review.partners_experts', 'Partners and Experts', 'الشركاء والخبراء', 'review'),
('review.title_label', 'Title:', 'العنوان:', 'review'),
('review.description_label', 'Description:', 'الوصف:', 'review'),
('review.start_date_label', 'Start Date:', 'تاريخ البداية:', 'review'),
('review.end_date_label', 'End Date:', 'تاريخ النهاية:', 'review'),
('review.estimated_budget_label', 'Estimated Budget:', 'الميزانية المقدرة:', 'review'),
('review.partners_count_label', 'Number of Partners:', 'عدد الشركاء:', 'review'),
('review.experts_count_label', 'Number of Experts:', 'عدد الخبراء:', 'review'),
('review.not_specified', 'Not specified', 'غير محدد', 'review'),
('review.currency_sar', 'SAR', 'ريال', 'review')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();