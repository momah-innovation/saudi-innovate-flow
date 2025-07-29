-- Create comprehensive seed data with correct column structures

-- Create comprehensive stakeholders using correct columns
INSERT INTO stakeholders (id, name, organization, position, email, phone, stakeholder_type, influence_level, interest_level, engagement_status, notes) VALUES 
(gen_random_uuid(), 'Dr. Abdulrahman Alshami', 'Ministry of Economy', 'Deputy Minister', 'alshami@mep.gov.sa', '+966112345678', 'government', 'high', 'high', 'active', 'رئيس لجنة الابتكار الاقتصادي'),
(gen_random_uuid(), 'Eng. Maha Alsudairi', 'CITC', 'Innovation Director', 'maha.alsudairi@citc.gov.sa', '+966112345679', 'regulatory', 'high', 'high', 'active', 'متخصصة في تنظيم التقنيات الناشئة'),
(gen_random_uuid(), 'Prof. Omar Batterjee', 'King Saud University', 'Research Dean', 'obatterjee@ksu.edu.sa', '+966112345680', 'academic', 'medium', 'high', 'engaged', 'خبير في الذكاء الاصطناعي والبحث العلمي'),
(gen_random_uuid(), 'Ms. Reem Alghamdi', 'Saudi Chamber', 'Business Development', 'reem.alghamdi@saudichamber.sa', '+966112345681', 'private_sector', 'medium', 'medium', 'active', 'ممثلة القطاع الخاص في مبادرات الابتكار'),
(gen_random_uuid(), 'Dr. Khalid Alfalih', 'Ministry of Energy', 'Innovation Advisor', 'khalid.alfalih@moenergy.gov.sa', '+966112345682', 'government', 'high', 'high', 'active', 'مستشار الابتكار في وزارة الطاقة'),
(gen_random_uuid(), 'Eng. Nora Alharbi', 'MCIT', 'Digital Transformation Director', 'nora.alharbi@mcit.gov.sa', '+966112345683', 'government', 'high', 'high', 'active', 'مديرة التحول الرقمي في وزارة الاتصالات');

-- Create realistic challenges with different sensitivity levels
INSERT INTO challenges (id, title_ar, description_ar, priority_level, status, challenge_type, sensitivity_level, start_date, end_date, estimated_budget, department_id, sector_id, deputy_id, created_by) VALUES 
(gen_random_uuid(), 'منصة الخدمات الحكومية الموحدة', 'تطوير منصة رقمية شاملة لتقديم جميع الخدمات الحكومية من خلال واجهة موحدة مع تكامل كامل مع الأنظمة الحالية', 'high', 'active', 'digital_transformation', 'normal', '2024-04-01', '2024-12-31', 5000000, (SELECT id FROM departments WHERE name = 'Digital Innovation' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Smart Cities' LIMIT 1), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'نظام الذكاء الاصطناعي للتشخيص الطبي', 'تطوير نظام ذكي لمساعدة الأطباء في التشخيص المبكر للأمراض باستخدام تقنيات الذكاء الاصطناعي وتحليل الصور الطبية', 'critical', 'planning', 'technology_innovation', 'sensitive', '2024-06-01', '2025-03-31', 8000000, (SELECT id FROM departments WHERE name = 'Research & Development' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Healthcare Innovation' LIMIT 1), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'منصة التعليم التفاعلي بالواقع الافتراضي', 'إنشاء بيئة تعليمية افتراضية متقدمة تستخدم تقنيات الواقع الافتراضي والمعزز لتحسين جودة التعليم وزيادة التفاعل', 'medium', 'active', 'education_innovation', 'normal', '2024-05-15', '2024-11-30', 3500000, (SELECT id FROM departments WHERE name = 'Digital Innovation' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Education Technology' LIMIT 1), (SELECT id FROM deputies LIMIT 1), 'fa80bed2-ed61-4c27-8941-f713cf050944'),

(gen_random_uuid(), 'منظومة المدن الذكية المتكاملة', 'تطوير حلول متكاملة للمدن الذكية تشمل إدارة المرور والطاقة والنفايات باستخدام إنترنت الأشياء', 'high', 'planning', 'smart_cities', 'normal', '2024-07-01', '2025-06-30', 12000000, (SELECT id FROM departments WHERE name = 'Strategic Partnerships' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Smart Cities' LIMIT 1), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'نظام المدفوعات الرقمية الحكومية', 'تطوير نظام موحد للمدفوعات الرقمية لجميع الخدمات الحكومية مع ضمان الأمان والسرعة', 'critical', 'active', 'fintech', 'sensitive', '2024-03-15', '2024-10-31', 6500000, (SELECT id FROM departments WHERE name = 'Digital Innovation' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Financial Technology' LIMIT 1), (SELECT id FROM deputies LIMIT 1), 'fa80bed2-ed61-4c27-8941-f713cf050944');