-- Add comprehensive translations for all array-based settings
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Challenge types
('challenge_types.innovation', 'Innovation', 'الابتكار', 'challenges'),
('challenge_types.improvement', 'Improvement', 'التحسين', 'challenges'),
('challenge_types.research', 'Research', 'البحث', 'challenges'),
('challenge_types.development', 'Development', 'التطوير', 'challenges'),

-- Idea categories
('idea_categories.technology', 'Technology', 'التقنية', 'ideas'),
('idea_categories.sustainability', 'Sustainability', 'الاستدامة', 'ideas'),
('idea_categories.healthcare', 'Healthcare', 'الرعاية الصحية', 'ideas'),
('idea_categories.education', 'Education', 'التعليم', 'ideas'),
('idea_categories.finance', 'Finance', 'المالية', 'ideas'),
('idea_categories.transportation', 'Transportation', 'النقل', 'ideas'),
('idea_categories.energy', 'Energy', 'الطاقة', 'ideas'),
('idea_categories.manufacturing', 'Manufacturing', 'التصنيع', 'ideas'),

-- Evaluation criteria
('evaluation_criteria.technical_feasibility', 'Technical Feasibility', 'الجدوى التقنية', 'evaluation'),
('evaluation_criteria.financial_viability', 'Financial Viability', 'الجدوى المالية', 'evaluation'),
('evaluation_criteria.market_potential', 'Market Potential', 'إمكانات السوق', 'evaluation'),
('evaluation_criteria.strategic_alignment', 'Strategic Alignment', 'التوافق الاستراتيجي', 'evaluation'),
('evaluation_criteria.innovation_level', 'Innovation Level', 'مستوى الابتكار', 'evaluation'),
('evaluation_criteria.sustainability_impact', 'Sustainability Impact', 'تأثير الاستدامة', 'evaluation'),

-- Themes
('themes.ai_innovation', 'AI Innovation', 'ابتكار الذكاء الاصطناعي', 'general'),
('themes.sustainability', 'Sustainability', 'الاستدامة', 'general'),
('themes.digital_transformation', 'Digital Transformation', 'التحول الرقمي', 'general'),
('themes.smart_cities', 'Smart Cities', 'المدن الذكية', 'general'),
('themes.healthcare_innovation', 'Healthcare Innovation', 'ابتكار الرعاية الصحية', 'general'),
('themes.fintech', 'FinTech', 'التقنية المالية', 'general'),
('themes.edtech', 'EdTech', 'تقنية التعليم', 'general'),

-- Partner types
('partner_types.government', 'Government', 'حكومي', 'partners'),
('partner_types.private', 'Private', 'خاص', 'partners'),
('partner_types.academic', 'Academic', 'أكاديمي', 'partners'),
('partner_types.non_profit', 'Non-Profit', 'غير ربحي', 'partners'),
('partner_types.international', 'International', 'دولي', 'partners'),
('partner_types.startup', 'Startup', 'شركة ناشئة', 'partners'),
('partner_types.corporate', 'Corporate', 'شركة كبرى', 'partners'),

-- Event types
('event_types.workshop', 'Workshop', 'ورشة عمل', 'events'),
('event_types.seminar', 'Seminar', 'ندوة', 'events'),
('event_types.conference', 'Conference', 'مؤتمر', 'events'),
('event_types.hackathon', 'Hackathon', 'هاكاثون', 'events'),
('event_types.networking', 'Networking', 'التواصل', 'events'),
('event_types.training', 'Training', 'تدريب', 'events'),
('event_types.presentation', 'Presentation', 'عرض تقديمي', 'events'),

-- Event formats
('event_formats.virtual', 'Virtual', 'افتراضي', 'events'),
('event_formats.in_person', 'In-Person', 'حضوري', 'events'),
('event_formats.hybrid', 'Hybrid', 'مختلط', 'events'),

-- Stakeholder categories
('stakeholder_categories.internal', 'Internal', 'داخلي', 'stakeholders'),
('stakeholder_categories.external', 'External', 'خارجي', 'stakeholders'),
('stakeholder_categories.partner', 'Partner', 'شريك', 'stakeholders'),
('stakeholder_categories.government', 'Government', 'حكومي', 'stakeholders'),
('stakeholder_categories.community', 'Community', 'مجتمعي', 'stakeholders'),
('stakeholder_categories.expert', 'Expert', 'خبير', 'stakeholders'),

-- User roles
('user_roles.innovator', 'Innovator', 'مبتكر', 'users'),
('user_roles.expert', 'Expert', 'خبير', 'users'),
('user_roles.admin', 'Admin', 'مدير', 'users'),
('user_roles.team_member', 'Team Member', 'عضو فريق', 'users'),
('user_roles.evaluator', 'Evaluator', 'مقيم', 'users'),
('user_roles.mentor', 'Mentor', 'موجه', 'users'),

-- Campaign themes
('campaign_themes.innovation', 'Innovation', 'الابتكار', 'campaigns'),
('campaign_themes.digital', 'Digital', 'رقمي', 'campaigns'),
('campaign_themes.sustainability', 'Sustainability', 'الاستدامة', 'campaigns'),
('campaign_themes.entrepreneurship', 'Entrepreneurship', 'ريادة الأعمال', 'campaigns'),
('campaign_themes.research', 'Research', 'البحث', 'campaigns'),
('campaign_themes.development', 'Development', 'التطوير', 'campaigns'),

-- Opportunity types
('opportunity_types.funding', 'Funding', 'تمويل', 'opportunities'),
('opportunity_types.partnership', 'Partnership', 'شراكة', 'opportunities'),
('opportunity_types.training', 'Training', 'تدريب', 'opportunities'),
('opportunity_types.mentorship', 'Mentorship', 'إرشاد', 'opportunities'),
('opportunity_types.research', 'Research', 'بحث', 'opportunities'),
('opportunity_types.collaboration', 'Collaboration', 'تعاون', 'opportunities'),

-- Priority levels
('priority_levels.low', 'Low', 'منخفض', 'general'),
('priority_levels.medium', 'Medium', 'متوسط', 'general'),
('priority_levels.high', 'High', 'عالي', 'general'),
('priority_levels.urgent', 'Urgent', 'عاجل', 'general'),

-- Sector types
('sector_types.government', 'Government', 'حكومي', 'sectors'),
('sector_types.private', 'Private', 'خاص', 'sectors'),
('sector_types.non_profit', 'Non-Profit', 'غير ربحي', 'sectors'),
('sector_types.academic', 'Academic', 'أكاديمي', 'sectors'),
('sector_types.healthcare', 'Healthcare', 'رعاية صحية', 'sectors'),
('sector_types.technology', 'Technology', 'تقنية', 'sectors'),
('sector_types.finance', 'Finance', 'مالية', 'sectors'),
('sector_types.energy', 'Energy', 'طاقة', 'sectors')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();