-- Add more system settings for comprehensive coverage
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
-- Question and focus settings
('focus_question_types', '["general", "technical", "business", "impact", "implementation", "social", "ethical", "medical", "regulatory"]', 'question', 'Types of focus questions'),
('question_type_options', '["open_ended", "multiple_choice", "yes_no", "rating", "ranking"]', 'question', 'Question type options'),

-- Experience and evaluation
('experience_levels', '["beginner", "intermediate", "advanced", "expert"]', 'evaluation', 'Experience levels'),
('evaluator_types', '["lead_expert", "evaluator", "reviewer", "subject_matter_expert", "external_consultant"]', 'evaluation', 'Types of evaluators'),

-- Language settings
('supported_languages', '[{"code": "en", "label": "English", "nativeLabel": "English"}, {"code": "ar", "label": "Arabic", "nativeLabel": "العربية"}, {"code": "he", "label": "Hebrew", "nativeLabel": "עברית"}, {"code": "fa", "label": "Persian", "nativeLabel": "فارسی"}]', 'language', 'Supported languages'),
('ui_language_options', '["en", "ar"]', 'language', 'UI language options'),

-- Stakeholder settings
('stakeholder_influence_levels', '["high", "medium", "low"]', 'stakeholder', 'Influence levels for stakeholders'),
('stakeholder_interest_levels', '["high", "medium", "low"]', 'stakeholder', 'Interest levels for stakeholders'),
('stakeholder_categories', '["government", "private_sector", "academic", "civil_society", "international", "media", "experts"]', 'stakeholder', 'Categories for stakeholders'),
('engagement_levels', '["high", "medium", "low"]', 'stakeholder', 'Engagement levels'),

-- Idea and innovation settings
('idea_assignment_types', '["reviewer", "evaluator", "implementer", "observer"]', 'idea', 'Assignment types for ideas'),
('idea_maturity_levels', '["concept", "prototype", "pilot", "scaling"]', 'idea', 'Maturity levels for ideas'),
('priority_levels', '["low", "medium", "high", "urgent"]', 'system', 'Priority levels'),

-- Campaign settings
('campaign_theme_options', '["digital_transformation", "sustainability", "smart_cities", "healthcare", "education", "fintech", "energy", "transportation"]', 'campaign', 'Theme options for campaigns'),

-- Organization and relationship settings
('relationship_types', '["direct", "indirect", "collaborative", "competitive", "supportive"]', 'system', 'Types of relationships'),
('organization_types', '["operational", "strategic", "administrative", "technical", "support"]', 'system', 'Types of organizations'),
('assignment_types', '["campaign", "event", "project", "content", "analysis"]', 'system', 'Types of assignments'),
('extended_status_options', '["planning", "scheduled", "ongoing", "postponed", "draft", "published"]', 'system', 'Extended status options'),

-- Sector and categorization
('sector_types', '["health", "education", "transport", "environment", "economy", "technology", "finance", "defense", "social"]', 'sector', 'Types of sectors'),
('tag_categories', '["innovation", "digital", "sustainability", "efficiency", "technology", "business", "social", "environmental"]', 'tag', 'Categories for tags'),
('sensitivity_levels', '["normal", "sensitive", "confidential"]', 'system', 'Sensitivity levels'),

-- Frequency and timing settings
('frequency_options', '["hourly", "daily", "weekly", "monthly", "yearly"]', 'system', 'Frequency options'),
('backup_frequency_options', '["hourly", "daily", "weekly", "monthly"]', 'system', 'Backup frequency options'),
('report_frequency_options', '["daily", "weekly", "monthly"]', 'system', 'Report frequency options'),
('reminder_frequency_options', '["daily", "weekly", "monthly"]', 'system', 'Reminder frequency options'),
('recurrence_pattern_options', '["daily", "weekly", "monthly", "yearly"]', 'system', 'Recurrence pattern options'),
('time_range_options', '["all", "last_30", "last_90", "last_year"]', 'system', 'Time range options'),

-- Role request settings
('role_request_justifications', '["domain_expertise", "evaluation_experience", "academic_background", "industry_experience", "certification", "volunteer_contribution"]', 'role', 'Justifications for role requests'),

-- UI and theme settings
('chart_color_palette', '["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#ff7c7c", "#8dd9cc"]', 'ui', 'Color palette for charts'),
('chart_visualization_colors', '["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16"]', 'ui', 'Colors for chart visualizations'),
('theme_variants', '["modern", "minimal", "vibrant"]', 'ui', 'Theme variants'),
('theme_color_schemes', '["light", "dark", "auto"]', 'ui', 'Color schemes for themes'),
('theme_border_radius_options', '["none", "sm", "md", "lg", "xl"]', 'ui', 'Border radius options for themes'),

-- Filter and navigation settings
('challenge_filter_status_options', '["all", "draft", "published", "active", "closed", "archived"]', 'filter', 'Status options for challenge filters'),
('navigation_menu_visibility_roles', '["admin", "super_admin", "team_member", "evaluator", "domain_expert"]', 'navigation', 'Roles for navigation menu visibility'),
('data_export_formats', '["csv", "excel", "pdf", "json"]', 'export', 'Data export formats')

ON CONFLICT (setting_key) DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    updated_at = now();

-- Add more lists to system_lists table
INSERT INTO public.system_lists (list_key, list_values, category, description) VALUES
('idea_categories', '["technology", "business_process", "product", "service", "policy", "research"]', 'idea', 'Categories for ideas'),
('evaluation_criteria', '["feasibility", "impact", "innovation", "cost", "timeline", "scalability"]', 'evaluation', 'Criteria for evaluation'),
('user_role_types', '["admin", "super_admin", "team_member", "evaluator", "domain_expert", "innovator"]', 'user', 'Types of user roles'),
('campaign_themes', '["digital_transformation", "sustainability", "smart_cities", "healthcare", "education"]', 'campaign', 'Themes for campaigns'),
('available_themes', '["light", "dark", "auto", "high_contrast"]', 'ui', 'Available UI themes'),
('team_specializations', '["innovation_strategy", "project_management", "research_analysis", "stakeholder_engagement", "change_management"]', 'team', 'Team specialization areas'),
('team_roles', '["innovation_manager", "data_analyst", "content_creator", "project_manager", "research_analyst"]', 'team', 'Team role types')
ON CONFLICT (list_key) DO UPDATE SET 
    list_values = EXCLUDED.list_values,
    updated_at = now();