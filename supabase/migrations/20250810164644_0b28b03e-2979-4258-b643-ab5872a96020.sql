-- Add missing translation keys for remaining hardcoded strings found in components
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
-- IdeasManagementList component translations
('admin.ideas.management_title', 'إدارة الأفكار الابتكارية', 'Ideas Management', 'admin'),
('admin.ideas.management_description', 'إدارة شاملة لجميع الأفكار المقدمة في النظام', 'Comprehensive management of all submitted ideas', 'admin'),
('admin.ideas.new_idea_button', 'فكرة جديدة', 'New Idea', 'admin'),
('admin.ideas.total_ideas', 'إجمالي الأفكار', 'Total Ideas', 'admin'),
('admin.ideas.under_review', 'قيد المراجعة', 'Under Review', 'admin'),
('admin.ideas.approved', 'موافق عليها', 'Approved', 'admin'),
('admin.ideas.featured', 'مميزة', 'Featured', 'admin'),
('admin.ideas.search_placeholder', 'البحث في الأفكار...', 'Search ideas...', 'admin'),
('admin.ideas.all_statuses', 'كل الحالات', 'All Statuses', 'admin'),
('admin.ideas.all_levels', 'كل المستويات', 'All Levels', 'admin'),
('admin.ideas.no_ideas_title', 'لا توجد أفكار', 'No Ideas Found', 'admin'),
('admin.ideas.no_ideas_description', 'لم يتم العثور على أفكار مطابقة للفلاتر المحددة', 'No ideas match the selected filters', 'admin'),

-- IdeaWizard component translations  
('idea_wizard.details_title', 'تفاصيل الفكرة', 'Idea Details', 'idea_wizard'),
('idea_wizard.details_description', 'حدد حالة الفكرة ومستوى نضجها', 'Set idea status and maturity level', 'idea_wizard'),
('idea_wizard.status_label', 'حالة الفكرة', 'Idea Status', 'idea_wizard'),
('idea_wizard.maturity_label', 'مستوى النضج', 'Maturity Level', 'idea_wizard'),
('idea_wizard.campaigns_events_title', 'الحملات والفعاليات', 'Campaigns & Events', 'idea_wizard'),
('idea_wizard.campaigns_events_description', 'ربط الفكرة بالحملات والفعاليات (اختياري)', 'Link idea to campaigns and events (optional)', 'idea_wizard'),
('idea_wizard.challenges_questions_title', 'التحديات والأسئلة المحورية', 'Challenges & Focus Questions', 'idea_wizard'),
('idea_wizard.challenges_questions_description', 'ربط الفكرة بالتحديات والأسئلة المحورية', 'Link idea to challenges and focus questions', 'idea_wizard'),
('idea_wizard.additional_content_title', 'محتوى إضافي', 'Additional Content', 'idea_wizard'),
('idea_wizard.additional_content_description', 'معلومات تفصيلية عن الفكرة', 'Detailed information about the idea', 'idea_wizard'),

-- Status translations
('idea_status.draft', 'مسودة', 'Draft', 'status'),
('idea_status.submitted', 'مقدم', 'Submitted', 'status'),
('idea_status.under_review', 'قيد المراجعة', 'Under Review', 'status'),
('idea_status.approved', 'موافق عليه', 'Approved', 'status'),
('idea_status.rejected', 'مرفوض', 'Rejected', 'status'),

-- Maturity level translations
('idea_maturity.concept', 'مفهوم', 'Concept', 'maturity'),
('idea_maturity.prototype', 'نموذج أولي', 'Prototype', 'maturity'),
('idea_maturity.pilot', 'تجريبي', 'Pilot', 'maturity'),
('idea_maturity.scaling', 'توسع', 'Scaling', 'maturity')

ON CONFLICT (translation_key) DO UPDATE SET
text_ar = EXCLUDED.text_ar,
text_en = EXCLUDED.text_en,
category = EXCLUDED.category;