-- Add missing translation keys for AICenter page
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES 
-- AI Center main page keys
('ai.page_title', 'AI Innovation Center', 'مركز الذكاء الاصطناعي للابتكار', 'ai'),
('ai.page_description', 'Explore cutting-edge AI features to enhance your innovation journey', 'استكشف أحدث ميزات الذكاء الاصطناعي لتعزيز رحلة الابتكار لديك', 'ai'),
('ai.features_available', 'Features Available', 'الميزات المتاحة', 'ai'),
('ai.beta_features', 'Beta Features', 'ميزات تجريبية', 'ai'),
('ai.accuracy_rate', 'Accuracy Rate', 'معدل الدقة', 'ai'),
('ai.monthly_usage', 'Monthly Usage', 'الاستخدام الشهري', 'ai'),
('ai.beta_label', 'BETA', 'تجريبي', 'ai'),
('ai.max_usage', 'Max usage', 'الحد الأقصى للاستخدام', 'ai'),
('ai.usage_per_month', 'per month', 'شهرياً', 'ai'),
('ai.use_feature', 'Use Feature', 'استخدم الميزة', 'ai'),
('ai.not_available', 'Not Available', 'غير متاح', 'ai'),

-- AI feature names and descriptions
('ai.idea_evaluation', 'Idea Evaluation', 'تقييم الأفكار', 'ai'),
('ai.idea_evaluation_desc', 'Comprehensive AI-powered idea evaluation', 'تقييم شامل للأفكار بالذكاء الاصطناعي', 'ai'),
('ai.challenge_assist', 'Challenge Assistant', 'مساعد التحديات', 'ai'),
('ai.challenge_assist_desc', 'AI assistance for creating and developing challenges', 'مساعدة الذكاء الاصطناعي في إنشاء وتطوير التحديات', 'ai'),
('ai.similar_ideas', 'Similar Ideas Detection', 'كشف الأفكار المشابهة', 'ai'),
('ai.similar_ideas_desc', 'Detect similar ideas to prevent duplication', 'كشف الأفكار المشابهة لمنع التكرار', 'ai'),
('ai.smart_partner_matching', 'Smart Partner Matching', 'مطابقة الشركاء الذكية', 'ai'),
('ai.smart_partner_matching_desc', 'AI-powered partner recommendations', 'توصيات الشركاء بالذكاء الاصطناعي', 'ai'),
('ai.focus_questions', 'Focus Question Generation', 'توليد أسئلة التركيز', 'ai'),
('ai.focus_questions_desc', 'Generate focus questions for challenges', 'توليد أسئلة التركيز للتحديات', 'ai'),
('ai.smart_analytics', 'Smart Analytics', 'التحليلات الذكية', 'ai'),
('ai.smart_analytics_desc', 'Advanced AI-powered analytics', 'تحليلات متقدمة بالذكاء الاصطناعي', 'ai'),

-- Tab names
('tab.features', 'Features', 'الميزات', 'ui'),
('tab.recommendations', 'Recommendations', 'التوصيات', 'ui'),
('tab.evaluation', 'Evaluation', 'التقييم', 'ui'),
('tab.settings', 'Settings', 'الإعدادات', 'ui'),

-- Example content keys  
('example.smart_gov_app_title', 'Smart Government App', 'تطبيق الحكومة الذكية', 'examples'),
('example.smart_gov_app_description', 'A mobile application that provides seamless access to government services', 'تطبيق محمول يوفر وصولاً سلساً للخدمات الحكومية', 'examples')
ON CONFLICT (translation_key) DO NOTHING;