-- Remove individual list item records and replace with array-based approach
DELETE FROM system_settings WHERE setting_key IN (
  'challenge_type_innovation', 'challenge_type_improvement', 'challenge_type_research', 'challenge_type_development',
  'idea_category_technology', 'idea_category_sustainability', 'idea_category_healthcare', 'idea_category_education',
  'evaluation_criteria_technical_feasibility', 'evaluation_criteria_financial_viability', 'evaluation_criteria_market_potential',
  'theme_ai_innovation', 'theme_sustainability', 'theme_digital_transformation',
  'partner_type_government', 'partner_type_private', 'partner_type_academic',
  'event_type_workshop', 'event_type_seminar', 'event_type_conference',
  'event_format_virtual', 'event_format_in_person', 'event_format_hybrid',
  'stakeholder_category_internal', 'stakeholder_category_external', 'stakeholder_category_partner',
  'user_role_innovator', 'user_role_expert', 'user_role_admin',
  'campaign_theme_innovation', 'campaign_theme_digital', 'campaign_theme_sustainability',
  'opportunity_type_funding', 'opportunity_type_partnership', 'opportunity_type_training',
  'priority_level_low', 'priority_level_medium', 'priority_level_high',
  'sector_type_government', 'sector_type_private', 'sector_type_non_profit'
);

-- Insert array-based settings
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type, is_localizable, description) VALUES
-- Challenge types
('challenge_types', '["innovation", "improvement", "research", "development"]', 'challenges', 'array', true, 'Available challenge types'),

-- Idea categories  
('idea_categories', '["technology", "sustainability", "healthcare", "education", "finance", "transportation", "energy", "manufacturing"]', 'ideas', 'array', true, 'Available idea categories'),

-- Evaluation criteria
('evaluation_criteria', '["technical_feasibility", "financial_viability", "market_potential", "strategic_alignment", "innovation_level", "sustainability_impact"]', 'evaluation', 'array', true, 'Evaluation criteria for ideas and challenges'),

-- Themes
('available_themes', '["ai_innovation", "sustainability", "digital_transformation", "smart_cities", "healthcare_innovation", "fintech", "edtech"]', 'general', 'array', true, 'Available themes for challenges and campaigns'),

-- Partner types
('partner_types', '["government", "private", "academic", "non_profit", "international", "startup", "corporate"]', 'partners', 'array', true, 'Available partner types'),

-- Event types and formats
('event_types', '["workshop", "seminar", "conference", "hackathon", "networking", "training", "presentation"]', 'events', 'array', true, 'Available event types'),
('event_formats', '["virtual", "in_person", "hybrid"]', 'events', 'array', true, 'Available event formats'),

-- Stakeholder categories
('stakeholder_categories', '["internal", "external", "partner", "government", "community", "expert"]', 'stakeholders', 'array', true, 'Available stakeholder categories'),

-- User roles (for display purposes)
('user_role_types', '["innovator", "expert", "admin", "team_member", "evaluator", "mentor"]', 'users', 'array', true, 'Available user role types'),

-- Campaign themes
('campaign_themes', '["innovation", "digital", "sustainability", "entrepreneurship", "research", "development"]', 'campaigns', 'array', true, 'Available campaign themes'),

-- Opportunity types
('opportunity_types', '["funding", "partnership", "training", "mentorship", "research", "collaboration"]', 'opportunities', 'array', true, 'Available opportunity types'),

-- Priority levels
('priority_levels', '["low", "medium", "high", "urgent"]', 'general', 'array', true, 'Available priority levels'),

-- Sector types
('sector_types', '["government", "private", "non_profit", "academic", "healthcare", "technology", "finance", "energy"]', 'sectors', 'array', true, 'Available sector types')

ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  data_type = EXCLUDED.data_type,
  is_localizable = EXCLUDED.is_localizable,
  description = EXCLUDED.description,
  updated_at = NOW();