-- PHASE 4C: Add Missing Translation Entries
-- Add translation entries for new categories introduced in the migration

INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Priority translations
('priority.low', 'Low', 'منخفض', 'priority'),
('priority.medium', 'Medium', 'متوسط', 'priority'),
('priority.high', 'High', 'عالي', 'priority'),
('priority.urgent', 'Urgent', 'عاجل', 'priority'),

-- Expert role translations
('expert_role.evaluator', 'Evaluator', 'مقيم', 'expert_role'),
('expert_role.mentor', 'Mentor', 'موجه', 'expert_role'),
('expert_role.reviewer', 'Reviewer', 'مراجع', 'expert_role'),
('expert_role.advisor', 'Advisor', 'مستشار', 'expert_role'),

-- Partnership type translations
('partnership_type.collaborator', 'Collaborator', 'متعاون', 'partnership_type'),
('partnership_type.sponsor', 'Sponsor', 'راعي', 'partnership_type'),
('partnership_type.technical', 'Technical Partner', 'شريك تقني', 'partnership_type'),
('partnership_type.financial', 'Financial Partner', 'شريك مالي', 'partnership_type'),

-- Partnership role translations
('partnership_role.sponsor', 'Sponsor', 'راعي', 'partnership_role'),
('partnership_role.partner', 'Partner', 'شريك', 'partnership_role'),
('partnership_role.supporter', 'Supporter', 'داعم', 'partnership_role'),
('partnership_role.collaborator', 'Collaborator', 'متعاون', 'partnership_role'),

-- AI category translations
('ai_category.general', 'General', 'عام', 'ai_category'),
('ai_category.content', 'Content', 'محتوى', 'ai_category'),
('ai_category.analysis', 'Analysis', 'تحليل', 'ai_category'),
('ai_category.recommendation', 'Recommendation', 'توصية', 'ai_category'),

-- Subscription translations
('subscription.basic', 'Basic', 'أساسي', 'subscription'),
('subscription.premium', 'Premium', 'مميز', 'subscription'),
('subscription.enterprise', 'Enterprise', 'مؤسسي', 'subscription'),

-- Creativity level translations
('creativity.balanced', 'Balanced', 'متوازن', 'creativity'),
('creativity.conservative', 'Conservative', 'محافظ', 'creativity'),
('creativity.creative', 'Creative', 'إبداعي', 'creativity'),
('creativity.experimental', 'Experimental', 'تجريبي', 'creativity'),

-- Language translations
('language.ar', 'Arabic', 'العربية', 'language'),
('language.en', 'English', 'الإنجليزية', 'language'),

-- Activity translations
('activity.create', 'Create', 'إنشاء', 'activity'),
('activity.update', 'Update', 'تحديث', 'activity'),
('activity.delete', 'Delete', 'حذف', 'activity'),
('activity.view', 'View', 'عرض', 'activity'),
('activity.like', 'Like', 'إعجاب', 'activity'),
('activity.comment', 'Comment', 'تعليق', 'activity'),
('activity.share', 'Share', 'مشاركة', 'activity'),

-- Entity translations
('entity.challenge', 'Challenge', 'تحدي', 'entity'),
('entity.idea', 'Idea', 'فكرة', 'entity'),
('entity.event', 'Event', 'فعالية', 'entity'),
('entity.opportunity', 'Opportunity', 'فرصة', 'entity'),
('entity.campaign', 'Campaign', 'حملة', 'entity'),

-- Requirement translations
('requirement.technical', 'Technical', 'تقني', 'requirement'),
('requirement.business', 'Business', 'تجاري', 'requirement'),
('requirement.legal', 'Legal', 'قانوني', 'requirement'),
('requirement.documentation', 'Documentation', 'توثيق', 'requirement'),
('requirement.presentation', 'Presentation', 'عرض تقديمي', 'requirement'),
('requirement.criteria', 'Criteria', 'معايير', 'requirement'),
('requirement.validation', 'Validation', 'تحقق', 'requirement'),

-- Recommendation translations
('recommendation.approve', 'Approve', 'موافقة', 'recommendation'),
('recommendation.reject', 'Reject', 'رفض', 'recommendation'),
('recommendation.needs_improvement', 'Needs Improvement', 'يحتاج تحسين', 'recommendation'),
('recommendation.conditional_approval', 'Conditional Approval', 'موافقة مشروطة', 'recommendation'),

-- Risk translations
('risk.low', 'Low Risk', 'مخاطر منخفضة', 'risk'),
('risk.medium', 'Medium Risk', 'مخاطر متوسطة', 'risk'),
('risk.high', 'High Risk', 'مخاطر عالية', 'risk'),
('risk.critical', 'Critical Risk', 'مخاطر حرجة', 'risk'),

-- Share method translations
('share_method.link', 'Link', 'رابط', 'share_method'),
('share_method.email', 'Email', 'بريد إلكتروني', 'share_method'),
('share_method.social', 'Social Media', 'وسائل التواصل', 'share_method'),
('share_method.embed', 'Embed', 'تضمين', 'share_method'),

-- Presence translations
('presence.viewing', 'Viewing', 'مشاهدة', 'presence'),
('presence.editing', 'Editing', 'تحرير', 'presence'),
('presence.idle', 'Idle', 'خامل', 'presence'),
('presence.away', 'Away', 'غائب', 'presence')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();