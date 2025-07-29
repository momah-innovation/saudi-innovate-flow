-- Seed remaining tables that are empty or need more data

-- Seed idea_evaluations (experts evaluating ideas)
INSERT INTO idea_evaluations (
  idea_id, evaluator_id, technical_feasibility, financial_viability, 
  market_potential, strategic_alignment, innovation_level, implementation_complexity,
  strengths, weaknesses, recommendations, next_steps, evaluator_type
) VALUES
-- Evaluations for "منصة التعليم الذكي"
((SELECT id FROM ideas WHERE title_ar = 'منصة التعليم الذكي' LIMIT 1), 
 (SELECT id FROM experts WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'أحمد' AND last_name = 'العلي') LIMIT 1),
 8, 7, 9, 8, 9, 6,
 'حل مبتكر يستخدم تقنيات حديثة، فريق قوي، رؤية واضحة',
 'يحتاج استثمار كبير، منافسة شديدة في السوق',
 'التركيز على التمايز التقني والشراكات الاستراتيجية',
 'إعداد نموذج أولي، دراسة جدوى مفصلة، البحث عن شركاء',
 'technical_expert'),

-- Evaluations for "نظام إدارة النفايات الذكي"  
((SELECT id FROM ideas WHERE title_ar = 'نظام إدارة النفايات الذكي' LIMIT 1),
 (SELECT id FROM experts WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'فاطمة' AND last_name = 'السعدي') LIMIT 1),
 9, 8, 7, 9, 8, 7,
 'يحل مشكلة حقيقية، تقنية قابلة للتطبيق، أثر بيئي إيجابي',
 'تحديات في التطبيق على نطاق واسع، الحاجة لتعاون حكومي',
 'البدء بمشروع تجريبي في منطقة محددة',
 'التواصل مع البلديات، إعداد دراسة أثر بيئي',
 'domain_expert'),

-- Evaluations for "تطبيق الصحة النفسية"
((SELECT id FROM ideas WHERE title_ar = 'تطبيق الصحة النفسية' LIMIT 1),
 (SELECT id FROM experts WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'محمد' AND last_name = 'الحارثي') LIMIT 1),
 7, 9, 8, 8, 7, 5,
 'حاجة ملحة في المجتمع، نموذج عمل واضح، سهولة التطبيق',
 'حساسية الموضوع، الحاجة لاعتماد طبي، مخاوف الخصوصية',
 'التركيز على الجانب الوقائي والتوعوي أولاً',
 'الحصول على التراخيص اللازمة، استشارة خبراء الصحة النفسية',
 'business_expert');

-- Seed team_assignments (linking innovation team members to challenges, campaigns, events)
INSERT INTO team_assignments (
  team_member_id, assignment_type, assignment_id, role_in_assignment,
  workload_percentage, status, assigned_date, start_date, estimated_hours
) VALUES
-- Challenge assignments
((SELECT id FROM innovation_team_members WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'أحمد' AND last_name = 'العلي') LIMIT 1),
 'challenge', 
 (SELECT id FROM challenges WHERE title_ar LIKE '%التعليم%' LIMIT 1),
 'lead_evaluator', 25, 'active', '2024-01-15', '2024-01-15', 40),

((SELECT id FROM innovation_team_members WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'فاطمة' AND last_name = 'السعدي') LIMIT 1),
 'challenge',
 (SELECT id FROM challenges WHERE title_ar LIKE '%البيئة%' LIMIT 1), 
 'technical_advisor', 20, 'active', '2024-01-20', '2024-01-20', 30),

-- Campaign assignments  
((SELECT id FROM innovation_team_members WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'محمد' AND last_name = 'الحارثي') LIMIT 1),
 'campaign',
 (SELECT id FROM campaigns WHERE title_ar LIKE '%الرقمي%' LIMIT 1),
 'coordinator', 30, 'active', '2024-02-01', '2024-02-01', 50),

-- Event assignments
((SELECT id FROM innovation_team_members WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'نور' AND last_name = 'الزهراني') LIMIT 1),
 'event',
 (SELECT id FROM events WHERE title_ar LIKE '%ملتقى%' LIMIT 1),
 'organizer', 15, 'completed', '2024-03-01', '2024-03-01', 25);

-- Add more department and deputy links for campaigns
INSERT INTO campaign_department_links (campaign_id, department_id) VALUES
((SELECT id FROM campaigns WHERE title_ar LIKE '%الرقمي%' LIMIT 1), 
 (SELECT id FROM departments WHERE name_ar LIKE '%التقنية%' LIMIT 1)),
((SELECT id FROM campaigns WHERE title_ar LIKE '%الاستدامة%' LIMIT 1),
 (SELECT id FROM departments WHERE name_ar LIKE '%البيئة%' LIMIT 1));

INSERT INTO campaign_deputy_links (campaign_id, deputy_id) VALUES  
((SELECT id FROM campaigns WHERE title_ar LIKE '%الرقمي%' LIMIT 1),
 (SELECT id FROM deputies WHERE name_ar LIKE '%التقنية%' LIMIT 1)),
((SELECT id FROM campaigns WHERE title_ar LIKE '%الاستدامة%' LIMIT 1),
 (SELECT id FROM deputies WHERE name_ar LIKE '%البيئة%' LIMIT 1));

-- Add sector links for campaigns
INSERT INTO campaign_sector_links (campaign_id, sector_id) VALUES
((SELECT id FROM campaigns WHERE title_ar LIKE '%الرقمي%' LIMIT 1),
 (SELECT id FROM sectors WHERE name_ar LIKE '%التقنية%' LIMIT 1)),
((SELECT id FROM campaigns WHERE title_ar LIKE '%الاستدامة%' LIMIT 1), 
 (SELECT id FROM sectors WHERE name_ar LIKE '%البيئة%' LIMIT 1));

-- Add event partner links
INSERT INTO event_partner_links (event_id, partner_id) VALUES
((SELECT id FROM events WHERE title_ar LIKE '%ملتقى%' LIMIT 1),
 (SELECT id FROM partners WHERE name_ar LIKE '%التقنية%' LIMIT 1)),
((SELECT id FROM events WHERE title_ar LIKE '%ورشة%' LIMIT 1),
 (SELECT id FROM partners WHERE name_ar LIKE '%الجامعة%' LIMIT 1));

-- Add event stakeholder links  
INSERT INTO event_stakeholder_links (event_id, stakeholder_id) VALUES
((SELECT id FROM events WHERE title_ar LIKE '%ملتقى%' LIMIT 1),
 (SELECT id FROM stakeholders WHERE name_ar LIKE '%المطورين%' LIMIT 1)),
((SELECT id FROM events WHERE title_ar LIKE '%ورشة%' LIMIT 1),
 (SELECT id FROM stakeholders WHERE name_ar LIKE '%الطلاب%' LIMIT 1));

-- Add event challenge links
INSERT INTO event_challenge_links (event_id, challenge_id) VALUES
((SELECT id FROM events WHERE title_ar LIKE '%ملتقى%' LIMIT 1),
 (SELECT id FROM challenges WHERE title_ar LIKE '%التعليم%' LIMIT 1)),
((SELECT id FROM events WHERE title_ar LIKE '%ورشة%' LIMIT 1), 
 (SELECT id FROM challenges WHERE title_ar LIKE '%البيئة%' LIMIT 1));

-- Add event focus question links
INSERT INTO event_focus_question_links (event_id, focus_question_id) VALUES
((SELECT id FROM events WHERE title_ar LIKE '%ملتقى%' LIMIT 1),
 (SELECT id FROM focus_questions WHERE question_text_ar LIKE '%التقنيات%' LIMIT 1)),
((SELECT id FROM events WHERE title_ar LIKE '%ورشة%' LIMIT 1),
 (SELECT id FROM focus_questions WHERE question_text_ar LIKE '%البيئة%' LIMIT 1));

-- Seed idea_tag_links (connecting ideas to tags)
INSERT INTO idea_tag_links (idea_id, tag_id, added_by) VALUES
-- منصة التعليم الذكي tags
((SELECT id FROM ideas WHERE title_ar = 'منصة التعليم الذكي' LIMIT 1),
 (SELECT id FROM idea_tags WHERE name_ar = 'التعليم' LIMIT 1),
 (SELECT user_id FROM innovators WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'علي' AND last_name = 'المحمد') LIMIT 1)),
 
((SELECT id FROM ideas WHERE title_ar = 'منصة التعليم الذكي' LIMIT 1), 
 (SELECT id FROM idea_tags WHERE name_ar = 'التقنية' LIMIT 1),
 (SELECT user_id FROM innovators WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'علي' AND last_name = 'المحمد') LIMIT 1)),

-- نظام إدارة النفايات الذكي tags  
((SELECT id FROM ideas WHERE title_ar = 'نظام إدارة النفايات الذكي' LIMIT 1),
 (SELECT id FROM idea_tags WHERE name_ar = 'البيئة' LIMIT 1), 
 (SELECT user_id FROM innovators WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'مريم' AND last_name = 'الأحمد') LIMIT 1)),
 
((SELECT id FROM ideas WHERE title_ar = 'نظام إدارة النفايات الذكي' LIMIT 1),
 (SELECT id FROM idea_tags WHERE name_ar = 'الاستدامة' LIMIT 1),
 (SELECT user_id FROM innovators WHERE user_id = (SELECT id FROM profiles WHERE first_name = 'مريم' AND last_name = 'الأحمد') LIMIT 1));