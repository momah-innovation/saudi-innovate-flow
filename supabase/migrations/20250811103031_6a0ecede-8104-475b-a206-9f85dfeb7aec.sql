-- Add remaining missing translation keys for continued migration (fixed syntax)
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Challenge Hero (fixed apostrophe escaping)
('challenges.hero_description', 'Join innovators worldwide in solving real-world challenges and contributing to Saudi Arabia''s Vision 2030 transformation.', 'انضم إلى المبتكرين حول العالم في حل التحديات الحقيقية والمساهمة في تحويل رؤية السعودية 2030.', 'challenges'),
('challenges.platform_badge', 'Innovation Challenges Platform', 'منصة تحديات الابتكار', 'challenges'),
('challenges.hero_title_part1', 'Take on', 'تحدى', 'challenges'),
('challenges.hero_title_part2', 'Challenges', 'التحديات', 'challenges'),
('challenges.hero_title_part3', 'Shape the Future', 'اصنع المستقبل', 'challenges'),
('challenges.explore_challenges', 'Explore Challenges', 'استكشف التحديات', 'challenges'),
('challenges.create_challenge', 'Create Challenge', 'أنشئ تحدي', 'challenges'),
('challenges.advanced_filters', 'Advanced Filters', 'فلاتر متقدمة', 'challenges'),
('challenges.active', 'Active', 'نشط', 'challenges'),
('challenges.featured', 'Featured', 'مميز', 'challenges'),
('challenges.participants', 'participants', 'مشاركين', 'challenges'),
('challenges.end_date', 'end date', 'تاريخ الانتهاء', 'challenges'),
('challenges.view_details', 'View Details', 'عرض التفاصيل', 'challenges'),
('challenges.no_featured_challenge', 'No Featured Challenge', 'لا يوجد تحدي مميز', 'challenges'),
('challenges.featured_will_appear', 'Featured challenges will appear here', 'ستظهر التحديات المميزة هنا', 'challenges'),
('challenges.saved_challenges', 'Saved Challenges', 'التحديات المحفوظة', 'challenges'),
('challenges.view_saved', 'View Saved', 'عرض المحفوظ', 'challenges'),
('challenges.achievements', 'Achievements', 'الإنجازات', 'challenges'),
('challenges.my_achievements', 'My Achievements', 'إنجازاتي', 'challenges')

ON CONFLICT (translation_key) DO UPDATE SET 
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category,
updated_at = now();