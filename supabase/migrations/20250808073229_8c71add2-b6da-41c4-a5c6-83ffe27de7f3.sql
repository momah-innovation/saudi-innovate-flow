-- Add Analytics page translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Analytics page
('page.analytics_title', 'Analytics', 'التحليلات', 'pages'),
('page.analytics_description', 'Comprehensive analytics for performance, trends, and key metrics', 'تحليلات شاملة للأداء والاتجاهات والمؤشرات الرئيسية', 'pages'),
('button.export_report', 'Export Report', 'تصدير التقرير', 'buttons'),

-- Metrics
('metric.total_users', 'Total Users', 'إجمالي المستخدمين', 'metrics'),
('metric.active_projects', 'Active Projects', 'المشاريع النشطة', 'metrics'),
('metric.completed_challenges', 'Completed Challenges', 'التحديات المكتملة', 'metrics'),
('metric.revenue', 'Revenue', 'الإيرادات', 'metrics'),
('metric.growth_rate', 'Growth Rate', 'معدل النمو', 'metrics'),
('metric.engagement_rate', 'Engagement Rate', 'معدل المشاركة', 'metrics'),

-- Tabs
('tab.overview', 'Overview', 'نظرة عامة', 'ui'),
('tab.users', 'Users', 'المستخدمين', 'ui'),
('tab.projects', 'Projects', 'المشاريع', 'ui'),
('tab.financial', 'Financial', 'المالية', 'ui'),
('tab.performance', 'Performance', 'الأداء', 'ui'),

-- Challenge examples
('challenge.digital_transformation_gov', 'Digital Transformation for Organizations', 'التحول الرقمي للمؤسسات', 'challenges'),
('challenge.ai_solutions', 'AI Solutions', 'حلول الذكاء الاصطناعي', 'challenges'),
('challenge.environmental_sustainability', 'Environmental Sustainability', 'الاستدامة البيئية', 'challenges'),

-- Categories
('category.technology', 'Technology', 'تقنية', 'categories'),
('category.ai', 'AI', 'ذكاء اصطناعي', 'categories'),
('category.environment', 'Environment', 'بيئة', 'categories'),

-- Labels
('label.participants', 'Participants', 'المشاركين', 'ui'),
('label.submissions', 'Submissions', 'المساهمات', 'ui'),
('label.completion_rate', 'Completion Rate', 'معدل الإكمال', 'ui'),
('label.complete', 'Complete', 'مكتمل', 'ui'),
('action.view_details', 'View Details', 'عرض التفاصيل', 'actions');