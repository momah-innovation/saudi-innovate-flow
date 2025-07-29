-- Create realistic challenges with valid challenge_type values

INSERT INTO challenges (id, title_ar, description_ar, priority_level, status, challenge_type, sensitivity_level, start_date, end_date, estimated_budget, department_id, sector_id, deputy_id, created_by) VALUES 
(gen_random_uuid(), 'منصة الخدمات الحكومية الموحدة', 'تطوير منصة رقمية شاملة لتقديم جميع الخدمات الحكومية من خلال واجهة موحدة مع تكامل كامل مع الأنظمة الحالية', 'high', 'active', 'تحول رقمي', 'normal', '2024-04-01', '2024-12-31', 5000000, (SELECT id FROM departments WHERE name = 'Digital Innovation' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Smart Cities' LIMIT 1), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'نظام الذكاء الاصطناعي للتشخيص الطبي', 'تطوير نظام ذكي لمساعدة الأطباء في التشخيص المبكر للأمراض باستخدام تقنيات الذكاء الاصطناعي وتحليل الصور الطبية', 'critical', 'planning', 'ابتكار صحي', 'sensitive', '2024-06-01', '2025-03-31', 8000000, (SELECT id FROM departments WHERE name = 'Research & Development' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Healthcare Innovation' LIMIT 1), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'منصة التعليم التفاعلي بالواقع الافتراضي', 'إنشاء بيئة تعليمية افتراضية متقدمة تستخدم تقنيات الواقع الافتراضي والمعزز لتحسين جودة التعليم وزيادة التفاعل', 'medium', 'active', 'تعليم', 'normal', '2024-05-15', '2024-11-30', 3500000, (SELECT id FROM departments WHERE name = 'Digital Innovation' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Education Technology' LIMIT 1), (SELECT id FROM deputies LIMIT 1), 'fa80bed2-ed61-4c27-8941-f713cf050944'),

(gen_random_uuid(), 'منظومة المدن الذكية المتكاملة', 'تطوير حلول متكاملة للمدن الذكية تشمل إدارة المرور والطاقة والنفايات باستخدام إنترنت الأشياء', 'high', 'planning', 'بنية تحتية ذكية', 'normal', '2024-07-01', '2025-06-30', 12000000, (SELECT id FROM departments WHERE name = 'Strategic Partnerships' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Smart Cities' LIMIT 1), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'نظام إدارة النفايات الذكي', 'تطوير نظام متكامل لإدارة النفايات باستخدام تقنيات الذكاء الاصطناعي وإنترنت الأشياء لتحسين الكفاءة البيئية', 'medium', 'active', 'استدامة', 'normal', '2024-03-15', '2024-10-31', 4500000, (SELECT id FROM departments WHERE name = 'Change Management' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Environmental Solutions' LIMIT 1), (SELECT id FROM deputies LIMIT 1), 'fa80bed2-ed61-4c27-8941-f713cf050944');

-- Create focus questions for challenges
INSERT INTO focus_questions (id, challenge_id, question_text_ar, question_type, order_sequence, is_sensitive) VALUES 
(gen_random_uuid(), (SELECT id FROM challenges WHERE title_ar = 'منصة الخدمات الحكومية الموحدة' LIMIT 1), 'كيف يمكن ضمان أمان البيانات الشخصية في المنصة الموحدة؟', 'security', 1, false),
(gen_random_uuid(), (SELECT id FROM challenges WHERE title_ar = 'منصة الخدمات الحكومية الموحدة' LIMIT 1), 'ما هي أفضل الطرق لتكامل الأنظمة القديمة مع المنصة الجديدة؟', 'technical', 2, false),
(gen_random_uuid(), (SELECT id FROM challenges WHERE title_ar = 'نظام الذكاء الاصطناعي للتشخيص الطبي' LIMIT 1), 'كيف يمكن ضمان دقة التشخيص والامتثال للمعايير الطبية؟', 'compliance', 1, true),
(gen_random_uuid(), (SELECT id FROM challenges WHERE title_ar = 'منصة التعليم التفاعلي بالواقع الافتراضي' LIMIT 1), 'ما هي المتطلبات التقنية للبنية التحتية لدعم الواقع الافتراضي؟', 'infrastructure', 1, false),
(gen_random_uuid(), (SELECT id FROM challenges WHERE title_ar = 'منظومة المدن الذكية المتكاملة' LIMIT 1), 'كيف يمكن تحقيق التكامل بين أنظمة إدارة المرور والطاقة والنفايات؟', 'integration', 1, false);