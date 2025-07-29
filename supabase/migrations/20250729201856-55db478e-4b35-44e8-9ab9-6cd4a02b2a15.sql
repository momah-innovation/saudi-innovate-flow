-- Simple seeding migration with proper UUID casting

-- 1. Challenge experts
INSERT INTO challenge_experts (challenge_id, expert_id, role_type, status, notes) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618'::uuid, '36a8aaf8-b9e6-459a-97de-37d17bea1167'::uuid, 'lead_evaluator', 'active', 'خبير رئيسي في تقييم التحديات التقنية'),
('63cafee8-48ab-40e2-bbf4-951ae4c03616'::uuid, '36a8aaf8-b9e6-459a-97de-37d17bea1167'::uuid, 'evaluator', 'active', 'مقيم للحلول المبتكرة'),
('64cafee8-48ab-40e2-bbf4-951ae4c03617'::uuid, '36a8aaf8-b9e6-459a-97de-37d17bea1167'::uuid, 'consultant', 'active', 'مستشار تقني');

-- 2. Campaign challenge links (with proper casting)
INSERT INTO campaign_challenge_links (campaign_id, challenge_id) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a'::uuid, '65cafee8-48ab-40e2-bbf4-951ae4c03618'::uuid),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1'::uuid, '63cafee8-48ab-40e2-bbf4-951ae4c03616'::uuid),
('2ca80e4b-9ed5-48b3-9613-388a41b25a81'::uuid, '64cafee8-48ab-40e2-bbf4-951ae4c03617'::uuid);

-- 3. Campaign department links
INSERT INTO campaign_department_links (campaign_id, department_id) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a'::uuid, 'a0f6d473-45d8-4681-a836-37ed317d8151'::uuid),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1'::uuid, 'a0f6d473-45d8-4681-a836-37ed317d8152'::uuid);

-- 4. Idea tags
INSERT INTO idea_tags (tag_name, description, color_code) VALUES
('ذكي', 'حلول تقنية ذكية', '#3B82F6'),
('مستدام', 'حلول صديقة للبيئة', '#10B981'),
('مبتكر', 'أفكار إبداعية جديدة', '#8B5CF6'),
('سريع', 'حلول سريعة التنفيذ', '#F59E0B'),
('اقتصادي', 'حلول منخفضة التكلفة', '#EF4444');

-- 5. Idea comments
INSERT INTO idea_comments (idea_id, author_id, content, comment_type, is_internal) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97'::uuid, 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e'::uuid, 'فكرة رائعة تحتاج إلى تطوير الجانب التقني', 'feedback', true),
('880e8400-e29b-41d4-a716-446655440001'::uuid, '392bb10b-f2a8-4791-8f8b-510262056f9a'::uuid, 'أقترح إضافة دراسة تحليل التكلفة والعائد', 'suggestion', false),
('880e8400-e29b-41d4-a716-446655440002'::uuid, '98c13bbb-edf7-44cb-b483-099637988714'::uuid, 'الفكرة تتماشى مع رؤية 2030', 'general', false);

-- 6. Idea evaluations
INSERT INTO idea_evaluations (idea_id, evaluator_id, evaluator_type, technical_feasibility, financial_viability, market_potential, strategic_alignment, innovation_level, implementation_complexity, strengths, weaknesses, recommendations, next_steps) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97'::uuid, '36a8aaf8-b9e6-459a-97de-37d17bea1167'::uuid, 'expert', 8, 7, 9, 8, 9, 6, 'حل مبتكر وقابل للتطبيق', 'يحتاج استثمار كبير', 'تطوير نموذج أولي', 'البحث عن شركاء تمويل'),
('880e8400-e29b-41d4-a716-446655440001'::uuid, 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e'::uuid, 'team_member', 7, 8, 7, 9, 7, 5, 'متوافق مع الاستراتيجية', 'معقد تقنياً', 'تبسيط الحل', 'استشارة خبراء إضافيين');

-- 7. User roles
INSERT INTO user_roles (user_id, role, is_active) VALUES
('8066cfaf-4a91-4985-922b-74f6a286c441'::uuid, 'super_admin', true),
('fa80bed2-ed61-4c27-8941-f713cf050944'::uuid, 'admin', true),
('cb18b70f-a8fb-4265-bed0-a086ed236c22'::uuid, 'team_lead', true),
('157e3ce7-6e92-4a97-ad75-ef641234c307'::uuid, 'expert', true),
('daa9f9ab-510f-45f1-8908-a6772e8f0c2b'::uuid, 'innovator', true);

-- 8. System settings
INSERT INTO system_settings (setting_key, setting_value, setting_category, description, is_public) VALUES
('platform_name', 'منصة رواد للابتكار', 'general', 'اسم المنصة', true),
('max_ideas_per_user', '10', 'limits', 'الحد الأقصى للأفكار لكل مستخدم شهرياً', false),
('idea_evaluation_period', '14', 'workflow', 'فترة تقييم الأفكار بالأيام', false),
('enable_notifications', 'true', 'features', 'تفعيل النوتيفيكيشن', false),
('default_language', 'ar', 'localization', 'اللغة الافتراضية', true);

-- 9. Basic notifications
INSERT INTO notifications (user_id, title, message, type, metadata) VALUES
('8066cfaf-4a91-4985-922b-74f6a286c441'::uuid, 'مرحباً بك في منصة رواد', 'نرحب بك في منصة رواد للابتكار. ابدأ رحلتك بتقديم فكرتك الأولى!', 'welcome', '{"onboarding": true}'),
('fa80bed2-ed61-4c27-8941-f713cf050944'::uuid, 'تحديث حالة الفكرة', 'تم قبول فكرتك للمرحلة التالية', 'idea_status', '{"new_status": "approved"}');

-- 10. Public statistics
INSERT INTO public_statistics (metric_name, metric_value, metric_description, display_category, display_order, is_featured, last_updated_by) VALUES
('total_ideas', 340, 'إجمالي الأفكار المقدمة', 'innovation', 1, true, 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e'::uuid),
('active_innovators', 150, 'عدد المبتكرين النشطين', 'community', 2, true, 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e'::uuid),
('completed_challenges', 12, 'التحديات المكتملة', 'challenges', 3, true, '71e0fb71-c8f6-455c-a10a-8ced61ca830a'::uuid);

-- Success notification
INSERT INTO public.notifications (user_id, title, message, type, metadata)
VALUES (
  '8066cfaf-4a91-4985-922b-74f6a286c441'::uuid,
  'تم إكمال البذر الأساسي',
  'تم بنجاح تعبئة عدة جداول رئيسية بالبيانات التجريبية',
  'success',
  '{"seeding_batch": "core_tables"}'
);