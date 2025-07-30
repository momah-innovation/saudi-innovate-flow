-- Seed evaluation criteria with comprehensive real-world criteria
INSERT INTO evaluation_criteria (name, name_ar, description, description_ar, category, weight, min_score, max_score, scoring_guide, scoring_guide_ar, is_required, is_active) VALUES
-- Technical Feasibility Criteria
('Technical Feasibility', 'الجدوى التقنية', 'Evaluates the technical viability and implementation complexity of the idea', 'تقييم الجدوى التقنية وتعقيد التنفيذ للفكرة', 'technical', 20, 1, 10, '1-3: Very difficult/not feasible, 4-6: Moderately feasible with challenges, 7-8: Feasible with minor challenges, 9-10: Highly feasible', '1-3: صعب جداً/غير قابل للتنفيذ، 4-6: قابل للتنفيذ مع تحديات متوسطة، 7-8: قابل للتنفيذ مع تحديات بسيطة، 9-10: قابل للتنفيذ بسهولة', true, true),

('Resource Availability', 'توفر الموارد', 'Assesses the availability of required resources (human, financial, technological)', 'تقييم توفر الموارد المطلوبة (بشرية، مالية، تقنية)', 'technical', 15, 1, 10, '1-3: Resources not available, 4-6: Some resources available, 7-8: Most resources available, 9-10: All resources readily available', '1-3: الموارد غير متوفرة، 4-6: بعض الموارد متوفرة، 7-8: معظم الموارد متوفرة، 9-10: جميع الموارد متوفرة', true, true),

('Infrastructure Requirements', 'متطلبات البنية التحتية', 'Evaluates the infrastructure needs and current readiness', 'تقييم احتياجات البنية التحتية والجاهزية الحالية', 'technical', 10, 1, 10, '1-3: Major infrastructure gaps, 4-6: Some infrastructure needed, 7-8: Minor infrastructure updates needed, 9-10: Infrastructure ready', '1-3: فجوات كبيرة في البنية التحتية، 4-6: بعض البنية التحتية مطلوبة، 7-8: تحديثات بسيطة مطلوبة، 9-10: البنية التحتية جاهزة', true, true),

-- Financial Viability Criteria
('Cost-Benefit Analysis', 'تحليل التكلفة والفائدة', 'Analyzes the financial investment versus expected returns', 'تحليل الاستثمار المالي مقابل العوائد المتوقعة', 'financial', 25, 1, 10, '1-3: Poor ROI/high cost, 4-6: Moderate ROI, 7-8: Good ROI, 9-10: Excellent ROI', '1-3: عائد ضعيف/تكلفة عالية، 4-6: عائد متوسط، 7-8: عائد جيد، 9-10: عائد ممتاز', true, true),

('Budget Requirements', 'متطلبات الميزانية', 'Assesses the total budget needed and availability', 'تقييم إجمالي الميزانية المطلوبة ومدى توفرها', 'financial', 15, 1, 10, '1-3: Budget far exceeds available funds, 4-6: Budget slightly high, 7-8: Budget manageable, 9-10: Budget well within limits', '1-3: الميزانية تتجاوز الأموال المتاحة بكثير، 4-6: الميزانية مرتفعة قليلاً، 7-8: الميزانية قابلة للإدارة، 9-10: الميزانية ضمن الحدود', true, true),

('Revenue Potential', 'إمكانية الإيرادات', 'Evaluates potential for revenue generation or cost savings', 'تقييم إمكانية توليد الإيرادات أو توفير التكاليف', 'financial', 10, 1, 10, '1-3: No clear revenue/savings, 4-6: Limited revenue potential, 7-8: Good revenue potential, 9-10: High revenue potential', '1-3: لا إيرادات/توفير واضح، 4-6: إمكانية إيرادات محدودة، 7-8: إمكانية إيرادات جيدة، 9-10: إمكانية إيرادات عالية', false, true),

-- Market & Impact Criteria
('Market Need', 'الحاجة السوقية', 'Assesses the demand and market size for the solution', 'تقييم الطلب وحجم السوق للحل المقترح', 'market', 20, 1, 10, '1-3: No clear market need, 4-6: Limited market need, 7-8: Strong market need, 9-10: Critical market need', '1-3: لا حاجة سوقية واضحة، 4-6: حاجة سوقية محدودة، 7-8: حاجة سوقية قوية، 9-10: حاجة سوقية حرجة', true, true),

('Social Impact', 'التأثير الاجتماعي', 'Evaluates the positive impact on society and communities', 'تقييم التأثير الإيجابي على المجتمع والمجتمعات', 'market', 15, 1, 10, '1-3: No social impact, 4-6: Limited social benefit, 7-8: Significant social benefit, 9-10: Transformative social impact', '1-3: لا تأثير اجتماعي، 4-6: فائدة اجتماعية محدودة، 7-8: فائدة اجتماعية كبيرة، 9-10: تأثير اجتماعي تحويلي', true, true),

('Competitive Advantage', 'الميزة التنافسية', 'Assesses uniqueness and competitive positioning', 'تقييم التفرد والموقع التنافسي', 'market', 10, 1, 10, '1-3: No competitive advantage, 4-6: Some differentiation, 7-8: Clear competitive advantage, 9-10: Significant competitive advantage', '1-3: لا ميزة تنافسية، 4-6: بعض التمايز، 7-8: ميزة تنافسية واضحة، 9-10: ميزة تنافسية كبيرة', false, true),

-- Strategic Alignment Criteria
('Vision 2030 Alignment', 'التوافق مع رؤية 2030', 'Evaluates alignment with Saudi Vision 2030 objectives', 'تقييم التوافق مع أهداف رؤية السعودية 2030', 'strategic', 25, 1, 10, '1-3: No alignment, 4-6: Partial alignment, 7-8: Good alignment, 9-10: Perfect alignment', '1-3: لا توافق، 4-6: توافق جزئي، 7-8: توافق جيد، 9-10: توافق مثالي', true, true),

('Organizational Strategy', 'الاستراتيجية التنظيمية', 'Assesses alignment with organizational goals and priorities', 'تقييم التوافق مع أهداف وأولويات المنظمة', 'strategic', 20, 1, 10, '1-3: Conflicts with strategy, 4-6: Neutral alignment, 7-8: Supports strategy, 9-10: Core strategic initiative', '1-3: يتعارض مع الاستراتيجية، 4-6: توافق محايد، 7-8: يدعم الاستراتيجية، 9-10: مبادرة استراتيجية أساسية', true, true),

('KPI Impact', 'تأثير مؤشرات الأداء', 'Evaluates potential impact on key performance indicators', 'تقييم التأثير المحتمل على مؤشرات الأداء الرئيسية', 'strategic', 15, 1, 10, '1-3: Negative KPI impact, 4-6: Neutral KPI impact, 7-8: Positive KPI impact, 9-10: Significant KPI improvement', '1-3: تأثير سلبي على المؤشرات، 4-6: تأثير محايد، 7-8: تأثير إيجابي، 9-10: تحسن كبير في المؤشرات', true, true),

-- Innovation Level Criteria
('Novelty', 'الحداثة', 'Assesses how new and original the idea is', 'تقييم مدى جدة وأصالة الفكرة', 'innovation', 20, 1, 10, '1-3: Not novel/already exists, 4-6: Some novelty, 7-8: Quite novel, 9-10: Highly novel/breakthrough', '1-3: ليست جديدة/موجودة بالفعل، 4-6: بعض الجدة، 7-8: جديدة إلى حد كبير، 9-10: جديدة جداً/اختراق', true, true),

('Technology Innovation', 'الابتكار التقني', 'Evaluates the technological innovation aspect', 'تقييم جانب الابتكار التقني', 'innovation', 15, 1, 10, '1-3: Uses existing technology, 4-6: Minor tech improvements, 7-8: Significant tech innovation, 9-10: Breakthrough technology', '1-3: يستخدم تقنية موجودة، 4-6: تحسينات تقنية بسيطة، 7-8: ابتكار تقني كبير، 9-10: تقنية اختراق', false, true),

('Scalability', 'قابلية التوسع', 'Assesses the potential for scaling the solution', 'تقييم إمكانية توسيع الحل', 'innovation', 10, 1, 10, '1-3: Not scalable, 4-6: Limited scalability, 7-8: Good scalability, 9-10: Highly scalable', '1-3: غير قابل للتوسع، 4-6: قابلية توسع محدودة، 7-8: قابلية توسع جيدة، 9-10: قابل للتوسع بدرجة عالية', false, true),

-- Risk Assessment Criteria
('Implementation Risk', 'مخاطر التنفيذ', 'Evaluates risks associated with implementation', 'تقييم المخاطر المرتبطة بالتنفيذ', 'risk', 15, 1, 10, '1-3: Very high risk, 4-6: Moderate risk, 7-8: Low risk, 9-10: Very low risk', '1-3: مخاطر عالية جداً، 4-6: مخاطر متوسطة، 7-8: مخاطر منخفضة، 9-10: مخاطر منخفضة جداً', true, true),

('Regulatory Compliance', 'الامتثال التنظيمي', 'Assesses compliance with regulations and standards', 'تقييم الامتثال للأنظمة والمعايير', 'risk', 10, 1, 10, '1-3: Major compliance issues, 4-6: Some compliance concerns, 7-8: Mostly compliant, 9-10: Full compliance', '1-3: مشاكل امتثال كبيرة، 4-6: بعض مخاوف الامتثال، 7-8: امتثال في الغالب، 9-10: امتثال كامل', true, true);

-- Seed evaluation templates for different types of evaluations
INSERT INTO evaluation_templates (name, name_ar, description, description_ar, evaluation_type, criteria_config, scoring_method, is_default, is_active) VALUES
-- Comprehensive Evaluation Template
('Comprehensive Innovation Evaluation', 'تقييم الابتكار الشامل', 'Complete evaluation covering all aspects of innovation ideas', 'تقييم كامل يغطي جميع جوانب الأفكار الابتكارية', 'comprehensive', 
'[
  {"criteria_name": "Technical Feasibility", "weight": 20, "is_required": true},
  {"criteria_name": "Resource Availability", "weight": 15, "is_required": true},
  {"criteria_name": "Cost-Benefit Analysis", "weight": 25, "is_required": true},
  {"criteria_name": "Market Need", "weight": 20, "is_required": true},
  {"criteria_name": "Vision 2030 Alignment", "weight": 25, "is_required": true},
  {"criteria_name": "Organizational Strategy", "weight": 20, "is_required": true},
  {"criteria_name": "Novelty", "weight": 20, "is_required": true},
  {"criteria_name": "Implementation Risk", "weight": 15, "is_required": true},
  {"criteria_name": "Regulatory Compliance", "weight": 10, "is_required": true}
]'::jsonb, 'weighted_average', true, true),

-- Technical Feasibility Template
('Technical Feasibility Assessment', 'تقييم الجدوى التقنية', 'Focused evaluation on technical aspects and implementation', 'تقييم مركز على الجوانب التقنية والتنفيذ', 'technical', 
'[
  {"criteria_name": "Technical Feasibility", "weight": 35, "is_required": true},
  {"criteria_name": "Resource Availability", "weight": 25, "is_required": true},
  {"criteria_name": "Infrastructure Requirements", "weight": 20, "is_required": true},
  {"criteria_name": "Technology Innovation", "weight": 15, "is_required": false},
  {"criteria_name": "Implementation Risk", "weight": 25, "is_required": true}
]'::jsonb, 'weighted_average', false, true),

-- Financial Assessment Template
('Financial Viability Assessment', 'تقييم الجدوى المالية', 'Evaluation focused on financial aspects and ROI', 'تقييم مركز على الجوانب المالية وعائد الاستثمار', 'financial', 
'[
  {"criteria_name": "Cost-Benefit Analysis", "weight": 40, "is_required": true},
  {"criteria_name": "Budget Requirements", "weight": 30, "is_required": true},
  {"criteria_name": "Revenue Potential", "weight": 20, "is_required": false},
  {"criteria_name": "Implementation Risk", "weight": 10, "is_required": true}
]'::jsonb, 'weighted_average', false, true),

-- Strategic Alignment Template
('Strategic Alignment Assessment', 'تقييم التوافق الاستراتيجي', 'Evaluation focused on strategic fit and organizational alignment', 'تقييم مركز على التوافق الاستراتيجي والتنظيمي', 'strategic', 
'[
  {"criteria_name": "Vision 2030 Alignment", "weight": 35, "is_required": true},
  {"criteria_name": "Organizational Strategy", "weight": 30, "is_required": true},
  {"criteria_name": "KPI Impact", "weight": 20, "is_required": true},
  {"criteria_name": "Social Impact", "weight": 15, "is_required": false}
]'::jsonb, 'weighted_average', false, true),

-- Quick Assessment Template
('Quick Innovation Screening', 'الفرز السريع للابتكار', 'Rapid evaluation for initial idea screening', 'تقييم سريع للفرز الأولي للأفكار', 'screening', 
'[
  {"criteria_name": "Market Need", "weight": 30, "is_required": true},
  {"criteria_name": "Technical Feasibility", "weight": 25, "is_required": true},
  {"criteria_name": "Vision 2030 Alignment", "weight": 25, "is_required": true},
  {"criteria_name": "Novelty", "weight": 20, "is_required": true}
]'::jsonb, 'simple_average', false, true),

-- Innovation Challenge Template
('Innovation Challenge Evaluation', 'تقييم تحدي الابتكار', 'Specialized evaluation for innovation challenges and competitions', 'تقييم متخصص لتحديات ومسابقات الابتكار', 'challenge', 
'[
  {"criteria_name": "Novelty", "weight": 25, "is_required": true},
  {"criteria_name": "Technology Innovation", "weight": 20, "is_required": true},
  {"criteria_name": "Scalability", "weight": 15, "is_required": true},
  {"criteria_name": "Market Need", "weight": 20, "is_required": true},
  {"criteria_name": "Competitive Advantage", "weight": 15, "is_required": false},
  {"criteria_name": "Social Impact", "weight": 15, "is_required": false}
]'::jsonb, 'weighted_average', false, true);

-- Seed evaluation rules for automated decision making
INSERT INTO evaluation_rules (name, name_ar, condition_type, condition_value, action_type, action_value, priority, is_active, metadata) VALUES
-- Score-based rules
('Auto Approve High Scores', 'الموافقة التلقائية للدرجات العالية', 'score_threshold', 8.5, 'auto_approve', 'Automatically approved due to high evaluation score', 1, true, '{"min_evaluations": 2, "applies_to": ["comprehensive", "strategic"]}'::jsonb),

('Auto Reject Low Scores', 'الرفض التلقائي للدرجات المنخفضة', 'score_threshold', 3.0, 'auto_reject', 'Automatically rejected due to low evaluation score', 1, true, '{"min_evaluations": 2, "applies_to": ["comprehensive"]}'::jsonb),

('Flag for Review', 'وضع علامة للمراجعة', 'score_range', 5.0, 'flag_review', 'Flagged for additional review due to moderate score', 2, true, '{"min_score": 4.0, "max_score": 6.0, "requires_senior_review": true}'::jsonb),

-- Risk-based rules
('High Risk Alert', 'تنبيه المخاطر العالية', 'criteria_score', 3.0, 'require_review', 'Requires risk assessment review', 1, true, '{"criteria": "implementation_risk", "escalate_to": "risk_committee"}'::jsonb),

('Compliance Check Required', 'فحص الامتثال مطلوب', 'criteria_score', 5.0, 'require_compliance_review', 'Requires regulatory compliance review', 1, true, '{"criteria": "regulatory_compliance", "department": "legal"}'::jsonb),

-- Budget-based rules
('High Budget Approval', 'موافقة الميزانية العالية', 'criteria_score', 7.0, 'require_budget_approval', 'Requires senior budget approval', 1, true, '{"criteria": "budget_requirements", "approval_level": "director"}'::jsonb),

-- Strategic alignment rules
('Vision 2030 Priority', 'أولوية رؤية 2030', 'criteria_score', 8.0, 'priority_track', 'Fast-tracked due to high Vision 2030 alignment', 1, true, '{"criteria": "vision_2030_alignment", "track": "strategic_priority"}'::jsonb),

-- Innovation level rules
('Breakthrough Innovation', 'ابتكار اختراق', 'criteria_score', 9.0, 'innovation_award', 'Qualifies for innovation excellence recognition', 2, true, '{"criteria": "novelty", "recognition_level": "excellence"}'::jsonb);

-- Seed evaluation system settings
INSERT INTO evaluation_system_settings (setting_key, setting_value, category, description, is_system) VALUES
-- General Settings
('evaluation_scale_max', '10', 'general', 'Maximum score for evaluation criteria', true),
('evaluation_scale_min', '1', 'general', 'Minimum score for evaluation criteria', true),
('required_evaluations_count', '2', 'general', 'Minimum number of evaluations required before auto-decisions', false),
('allow_self_evaluation', 'false', 'general', 'Whether users can evaluate their own ideas', false),

-- Scoring Settings
('default_scoring_method', '"weighted_average"', 'scoring', 'Default method for calculating final scores', false),
('score_precision', '2', 'scoring', 'Number of decimal places for scores', true),
('enable_score_normalization', 'true', 'scoring', 'Whether to normalize scores across evaluators', false),

-- Workflow Settings
('auto_approve_threshold', '8.5', 'workflow', 'Score threshold for automatic approval', false),
('auto_reject_threshold', '3.0', 'workflow', 'Score threshold for automatic rejection', false),
('review_required_threshold', '6.0', 'workflow', 'Score threshold requiring additional review', false),
('enable_automated_decisions', 'true', 'workflow', 'Whether to enable automated approval/rejection', false),

-- Notification Settings
('notify_on_evaluation_complete', 'true', 'notifications', 'Send notification when evaluation is completed', false),
('notify_on_auto_decision', 'true', 'notifications', 'Send notification on automated decisions', false),
('evaluation_reminder_days', '3', 'notifications', 'Days before sending evaluation reminder', false),

-- Quality Control Settings
('enable_evaluation_validation', 'true', 'quality', 'Enable validation of evaluation scores', false),
('max_score_deviation', '2.0', 'quality', 'Maximum allowed deviation between evaluator scores', false),
('require_evaluation_comments', 'true', 'quality', 'Require comments for low or high scores', false),
('enable_peer_review', 'false', 'quality', 'Enable peer review of evaluations', false),

-- Security Settings
('evaluation_access_level', '"team_members"', 'security', 'Who can access evaluation results', false),
('anonymous_evaluations', 'false', 'security', 'Whether evaluations are anonymous', false),
('evaluation_deadline_enforcement', 'true', 'security', 'Enforce evaluation deadlines', false),

-- Analytics Settings
('track_evaluation_metrics', 'true', 'analytics', 'Track evaluation performance metrics', false),
('evaluation_analytics_retention', '365', 'analytics', 'Days to retain evaluation analytics data', true),
('enable_evaluator_performance_tracking', 'true', 'analytics', 'Track individual evaluator performance', false);