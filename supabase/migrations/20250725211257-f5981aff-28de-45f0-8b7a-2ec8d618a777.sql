-- First, add policies for admins to manage challenges
CREATE POLICY "Admins can manage challenges"
ON public.challenges
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Add policies for focus questions
CREATE POLICY "Admins can manage focus questions"
ON public.focus_questions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Add some sample organizational structure data first
INSERT INTO public.sectors (id, name, name_ar, description, vision_2030_alignment) VALUES
('1b264813-966e-4734-8266-7be9d0508f73', 'Digital Transformation', 'التحول الرقمي', 'Advancing digital capabilities across government services', 'Digital Government 2030'),
('2b264813-966e-4734-8266-7be9d0508f74', 'Healthcare Innovation', 'الابتكار الصحي', 'Improving healthcare delivery through innovation', 'Quality of Life Program'),
('3b264813-966e-4734-8266-7be9d0508f75', 'Smart Cities', 'المدن الذكية', 'Building intelligent urban infrastructure', 'NEOM and Smart Cities');

INSERT INTO public.deputies (id, name, name_ar, deputy_minister, contact_email, sector_id) VALUES
('2b7c6d72-3811-4684-b0f8-bd0c935b2f0d', 'Deputy for Digital Innovation', 'نائب الابتكار الرقمي', 'Dr. Ahmed Al-Rashid', 'ahmed.alrashid@momah.gov.sa', '1b264813-966e-4734-8266-7be9d0508f73'),
('2b7c6d72-3811-4684-b0f8-bd0c935b2f0e', 'Deputy for Smart Services', 'نائب الخدمات الذكية', 'Dr. Sarah Al-Mahmoud', 'sarah.mahmoud@momah.gov.sa', '2b264813-966e-4734-8266-7be9d0508f74');

INSERT INTO public.departments (id, name, name_ar, department_head, budget_allocation, deputy_id) VALUES
('a0f6d473-45d8-4681-a836-37ed317d8151', 'Digital Services Department', 'قسم الخدمات الرقمية', 'Eng. Omar Al-Zahrani', 50000000.00, '2b7c6d72-3811-4684-b0f8-bd0c935b2f0d'),
('a0f6d473-45d8-4681-a836-37ed317d8152', 'Innovation Lab Department', 'قسم مختبر الابتكار', 'Dr. Fatima Al-Qahtani', 25000000.00, '2b7c6d72-3811-4684-b0f8-bd0c935b2f0e');

INSERT INTO public.domains (id, name, name_ar, domain_lead, specialization, department_id) VALUES
('642acc90-a9d6-44d3-9008-a3e8ce900566', 'Artificial Intelligence', 'الذكاء الاصطناعي', 'Dr. Mohammed Al-Ansari', 'Machine Learning, Natural Language Processing, Computer Vision', 'a0f6d473-45d8-4681-a836-37ed317d8151'),
('642acc90-a9d6-44d3-9008-a3e8ce900567', 'Internet of Things', 'إنترنت الأشياء', 'Eng. Nora Al-Mutairi', 'Sensor Networks, Smart Devices, Edge Computing', 'a0f6d473-45d8-4681-a836-37ed317d8152');

INSERT INTO public.sub_domains (id, name, name_ar, technical_focus, domain_id) VALUES
('3bf644b0-493f-46f2-8779-6e409b3ab711', 'Natural Language Processing', 'معالجة اللغة الطبيعية', 'Arabic NLP, Sentiment Analysis, Text Classification', '642acc90-a9d6-44d3-9008-a3e8ce900566'),
('3bf644b0-493f-46f2-8779-6e409b3ab712', 'Smart Sensors', 'أجهزة الاستشعار الذكية', 'Environmental Monitoring, Predictive Maintenance', '642acc90-a9d6-44d3-9008-a3e8ce900567');

INSERT INTO public.services (id, name, name_ar, service_type, citizen_facing, digital_maturity_score, sub_domain_id) VALUES
('67dd45c7-5b49-4eab-be28-48725e7a7603', 'Government Chatbot Service', 'خدمة روبوت المحادثة الحكومي', 'digital_service', true, 85, '3bf644b0-493f-46f2-8779-6e409b3ab711'),
('67dd45c7-5b49-4eab-be28-48725e7a7604', 'Smart City Dashboard', 'لوحة المدينة الذكية', 'platform_service', false, 70, '3bf644b0-493f-46f2-8779-6e409b3ab712');

-- Now add sample challenges
INSERT INTO public.challenges (
  id, title, title_ar, description, description_ar, 
  sector_id, deputy_id, department_id, domain_id, sub_domain_id, service_id,
  priority_level, status, challenge_type, start_date, end_date,
  estimated_budget, actual_budget, vision_2030_goal, kpi_alignment,
  challenge_owner_id, created_by, sensitivity_level
) VALUES
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 
 'AI-Powered Arabic Language Processing for Government Services', 
 'معالجة اللغة العربية بالذكاء الاصطناعي للخدمات الحكومية',
 'Develop an advanced natural language processing system to understand and respond to Arabic queries in government digital services, improving citizen experience and reducing response times.',
 'تطوير نظام متقدم لمعالجة اللغة الطبيعية لفهم والرد على الاستفسارات باللغة العربية في الخدمات الحكومية الرقمية، مما يحسن تجربة المواطن ويقلل أوقات الاستجابة.',
 '1b264813-966e-4734-8266-7be9d0508f73', '2b7c6d72-3811-4684-b0f8-bd0c935b2f0d', 'a0f6d473-45d8-4681-a836-37ed317d8151',
 '642acc90-a9d6-44d3-9008-a3e8ce900566', '3bf644b0-493f-46f2-8779-6e409b3ab711', '67dd45c7-5b49-4eab-be28-48725e7a7603',
 'high', 'published', 'digital_transformation', '2025-07-25', '2025-12-08',
 2500000.00, NULL, 'Digital Government transformation to provide seamless Arabic language services', 'Improve citizen satisfaction score by 40%, reduce query response time by 60%',
 '8066cfaf-4a91-4985-922b-74f6a286c441', '8066cfaf-4a91-4985-922b-74f6a286c441', 'normal'),

('64cafee8-48ab-40e2-bbf4-951ae4c03617',
 'Smart City IoT Infrastructure Optimization',
 'تحسين البنية التحتية لإنترنت الأشياء للمدن الذكية',
 'Design and implement an IoT sensor network for real-time monitoring of city infrastructure, traffic flow, and environmental conditions to enable data-driven urban planning.',
 'تصميم وتنفيذ شبكة من أجهزة استشعار إنترنت الأشياء للمراقبة في الوقت الفعلي لبنية المدينة التحتية وحركة المرور والظروف البيئية لتمكين التخطيط الحضري القائم على البيانات.',
 '3b264813-966e-4734-8266-7be9d0508f75', '2b7c6d72-3811-4684-b0f8-bd0c935b2f0e', 'a0f6d473-45d8-4681-a836-37ed317d8152',
 '642acc90-a9d6-44d3-9008-a3e8ce900567', '3bf644b0-493f-46f2-8779-6e409b3ab712', '67dd45c7-5b49-4eab-be28-48725e7a7604',
 'medium', 'published', 'smart_infrastructure', '2025-08-01', '2026-02-15',
 4200000.00, NULL, 'Smart Cities initiative as part of NEOM vision and urban development goals', 'Reduce traffic congestion by 25%, improve air quality monitoring accuracy by 90%',
 '8066cfaf-4a91-4985-922b-74f6a286c441', '8066cfaf-4a91-4985-922b-74f6a286c441', 'normal'),

('65cafee8-48ab-40e2-bbf4-951ae4c03618',
 'Healthcare AI Diagnostic Assistant',
 'مساعد تشخيص الذكاء الاصطناعي للرعاية الصحية',
 'Create an AI-powered diagnostic assistance system to support healthcare professionals in early disease detection and treatment recommendations, focusing on common conditions in the Saudi population.',
 'إنشاء نظام مساعدة تشخيصية مدعوم بالذكاء الاصطناعي لدعم أخصائيي الرعاية الصحية في الكشف المبكر عن الأمراض وتوصيات العلاج، مع التركيز على الحالات الشائعة في السكان السعوديين.',
 '2b264813-966e-4734-8266-7be9d0508f74', '2b7c6d72-3811-4684-b0f8-bd0c935b2f0e', 'a0f6d473-45d8-4681-a836-37ed317d8152',
 '642acc90-a9d6-44d3-9008-a3e8ce900566', '3bf644b0-493f-46f2-8779-6e409b3ab711', '67dd45c7-5b49-4eab-be28-48725e7a7603',
 'high', 'published', 'healthcare_innovation', '2025-09-01', '2026-06-30',
 6500000.00, NULL, 'Quality of Life Program - improving healthcare delivery and outcomes', 'Increase diagnostic accuracy by 35%, reduce average diagnosis time by 50%',
 '8066cfaf-4a91-4985-922b-74f6a286c441', '8066cfaf-4a91-4985-922b-74f6a286c441', 'sensitive');

-- Add focus questions for the challenges
INSERT INTO public.focus_questions (challenge_id, question_text, question_text_ar, question_type, order_sequence, is_sensitive) VALUES
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'How can we improve the accuracy of Arabic dialect recognition in government chatbots?', 'كيف يمكننا تحسين دقة التعرف على اللهجات العربية في روبوتات المحادثة الحكومية؟', 'technical', 1, false),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'What methods can reduce response latency while maintaining high accuracy in Arabic NLP?', 'ما هي الطرق التي يمكن أن تقلل من زمن الاستجابة مع الحفاظ على دقة عالية في معالجة اللغة العربية؟', 'technical', 2, false),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'How can we ensure cultural sensitivity and appropriateness in AI responses?', 'كيف يمكننا ضمان الحساسية الثقافية والملاءمة في ردود الذكاء الاصطناعي؟', 'social', 3, false),

('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'Which IoT sensors would be most effective for monitoring urban air quality in desert climates?', 'ما هي أجهزة استشعار إنترنت الأشياء الأكثر فعالية لمراقبة جودة الهواء الحضري في المناخ الصحراوي؟', 'technical', 1, false),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'How can we optimize power consumption for IoT devices in extreme weather conditions?', 'كيف يمكننا تحسين استهلاك الطاقة لأجهزة إنترنت الأشياء في ظروف الطقس القاسية؟', 'technical', 2, false),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'What data privacy measures should be implemented for citywide IoT networks?', 'ما هي تدابير خصوصية البيانات التي يجب تنفيذها لشبكات إنترنت الأشياء على مستوى المدينة؟', 'regulatory', 3, false),

('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'How can AI diagnostic tools be tailored for genetic conditions prevalent in the Saudi population?', 'كيف يمكن تخصيص أدوات التشخيص بالذكاء الاصطناعي للحالات الوراثية السائدة في السكان السعوديين؟', 'medical', 1, true),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'What integration methods work best with existing hospital information systems?', 'ما هي طرق التكامل التي تعمل بشكل أفضل مع أنظمة معلومات المستشفيات الحالية؟', 'technical', 2, false),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'How can we ensure AI recommendations maintain physician autonomy in decision-making?', 'كيف يمكننا ضمان أن توصيات الذكاء الاصطناعي تحافظ على استقلالية الطبيب في اتخاذ القرارات؟', 'ethical', 3, true);