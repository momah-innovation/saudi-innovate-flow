-- Add configurable lists to system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
-- Challenge configuration lists
('challenge_priority_levels', '["low", "medium", "high"]', 'challenge', 'Available priority levels for challenges'),
('challenge_sensitivity_levels', '["normal", "sensitive", "confidential"]', 'challenge', 'Available sensitivity levels for challenges'),
('challenge_types', '["technology", "sustainability", "healthcare", "education", "governance"]', 'challenge', 'Available challenge types'),

-- Role configuration lists
('available_user_roles', '[
  {"value": "innovator", "label": "Innovator", "description": "Default role for new users"},
  {"value": "evaluator", "label": "Evaluator", "description": "Evaluate challenge submissions and ideas"},
  {"value": "domain_expert", "label": "Domain Expert", "description": "Subject matter expert in specific domains"},
  {"value": "sector_lead", "label": "Sector Lead", "description": "Lead and coordinate sector activities"},
  {"value": "challenge_manager", "label": "Challenge Manager", "description": "Manage and oversee challenges"},
  {"value": "expert_coordinator", "label": "Expert Coordinator", "description": "Coordinate expert assignments and activities"},
  {"value": "content_manager", "label": "Content Manager", "description": "Manage platform content and resources"},
  {"value": "data_analyst", "label": "Data Analyst", "description": "Analyze platform data and generate insights"},
  {"value": "user_manager", "label": "User Manager", "description": "Manage user accounts and permissions"},
  {"value": "role_manager", "label": "Role Manager", "description": "Manage role assignments and permissions"},
  {"value": "admin", "label": "Admin", "description": "Administrative access"}
]', 'user', 'Available user roles for invitations and requests'),

('requestable_user_roles', '[
  {"value": "evaluator", "label": "Evaluator", "description": "Evaluate challenge submissions and ideas"},
  {"value": "domain_expert", "label": "Domain Expert", "description": "Subject matter expert in specific domains"}
]', 'user', 'User roles that can be requested (non-administrative)'),

-- Team management lists
('team_role_options', '[
  "Innovation Manager",
  "Data Analyst", 
  "Content Creator",
  "Project Manager",
  "Research Analyst",
  "Strategy Consultant",
  "Technology Specialist",
  "Campaign Manager",
  "Event Coordinator"
]', 'team', 'Available CIC roles for team members'),

('team_specialization_options', '[
  "Innovation Strategy & Planning",
  "Project Management & Execution", 
  "Research & Market Analysis",
  "Stakeholder Engagement",
  "Change Management",
  "Performance Measurement & KPIs",
  "Content Creation & Communication",
  "Event Management & Coordination",
  "Partnership Development",
  "Training & Development",
  "Process Optimization",
  "Quality Assurance & Evaluation",
  "Data Analytics & Insights",
  "Technology Innovation & Development",
  "Digital Transformation",
  "Risk Assessment & Management",
  "Financial Analysis & Budgeting",
  "Legal & Compliance",
  "Public Relations & Marketing",
  "Strategic Partnerships",
  "International Relations & Global Trends"
]', 'team', 'Available specialization areas for team members');