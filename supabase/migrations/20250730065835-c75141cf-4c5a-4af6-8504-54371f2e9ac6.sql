-- Clear existing seed data to avoid conflicts
DELETE FROM template_criteria;
DELETE FROM evaluation_rules;
DELETE FROM evaluation_templates;
DELETE FROM evaluation_criteria;
DELETE FROM evaluation_system_settings;

-- Insert comprehensive evaluation criteria covering all scenarios
INSERT INTO evaluation_criteria (name, name_ar, description, description_ar, category, weight, is_required, min_score, max_score, scoring_guide, scoring_guide_ar, is_active) VALUES

-- Technical Criteria
('Technical Feasibility', 'الجدوى التقنية', 'Assess the technical implementation feasibility and complexity', 'تقييم إمكانية التنفيذ التقني والتعقيد', 'technical', 20, true, 1, 10, 
'1-3: High technical barriers, requires new technology development
4-6: Moderate complexity, some technical challenges
7-8: Standard implementation with available technology
9-10: Simple implementation with existing systems', 
'1-3: حواجز تقنية عالية، يتطلب تطوير تقنيات جديدة
4-6: تعقيد متوسط، بعض التحديات التقنية
7-8: تنفيذ قياسي بالتقنيات المتاحة
9-10: تنفيذ بسيط بالأنظمة الموجودة'),

('Technology Readiness Level', 'مستوى جاهزية التقنية', 'Evaluate the maturity level of required technology', 'تقييم مستوى نضج التقنية المطلوبة', 'technical', 15, true, 1, 10,
'1-2: Basic research phase
3-4: Proof of concept demonstrated
5-6: Technology validated in relevant environment
7-8: System prototype demonstrated
9-10: System proven in operational environment',
'1-2: مرحلة البحث الأساسي
3-4: إثبات المفهوم
5-6: تقنية مثبتة في بيئة ذات صلة
7-8: نموذج أولي للنظام
9-10: نظام مثبت في بيئة تشغيلية'),

('System Integration Complexity', 'تعقيد تكامل النظام', 'Assess integration requirements with existing systems', 'تقييم متطلبات التكامل مع الأنظمة الموجودة', 'technical', 12, false, 1, 10,
'1-3: Major system overhaul required, high integration complexity
4-6: Moderate integration with some system modifications
7-8: Standard APIs available, minimal integration effort
9-10: Plug-and-play integration with existing systems',
'1-3: يتطلب إعادة هيكلة كبيرة للنظام، تعقيد تكامل عالي
4-6: تكامل متوسط مع بعض تعديلات النظام
7-8: واجهات برمجية قياسية متاحة، جهد تكامل أدنى
9-10: تكامل سهل مع الأنظمة الموجودة'),

-- Financial Criteria
('Financial Viability', 'الجدوى المالية', 'Comprehensive financial analysis including ROI, NPV, and payback period', 'تحليل مالي شامل يشمل العائد على الاستثمار والقيمة الحالية الصافية', 'financial', 25, true, 1, 10,
'1-3: Negative ROI, high risk, long payback (>5 years)
4-6: Break-even or low ROI, moderate risk, medium payback (2-5 years)
7-8: Good ROI (15-25%), acceptable risk, reasonable payback (1-2 years)
9-10: Excellent ROI (>25%), low risk, quick payback (<1 year)',
'1-3: عائد سلبي، مخاطر عالية، فترة استرداد طويلة (>5 سنوات)
4-6: نقطة التعادل أو عائد منخفض، مخاطر متوسطة (2-5 سنوات)
7-8: عائد جيد (15-25%)، مخاطر مقبولة (1-2 سنة)
9-10: عائد ممتاز (>25%)، مخاطر منخفضة (<1 سنة)'),

('Budget Requirements', 'متطلبات الميزانية', 'Evaluate initial investment and ongoing operational costs', 'تقييم الاستثمار الأولي والتكاليف التشغيلية المستمرة', 'financial', 18, true, 1, 10,
'1-3: Very high budget requirement (>$1M), significant operational costs
4-6: Moderate budget requirement ($100K-$1M), manageable costs
7-8: Reasonable budget requirement ($10K-$100K), low operational costs
9-10: Low budget requirement (<$10K), minimal operational costs',
'1-3: متطلبات ميزانية عالية جداً (>$1M)، تكاليف تشغيلية كبيرة
4-6: متطلبات ميزانية متوسطة ($100K-$1M)، تكاليف قابلة للإدارة
7-8: متطلبات ميزانية معقولة ($10K-$100K)، تكاليف تشغيلية منخفضة
9-10: متطلبات ميزانية منخفضة (<$10K)، تكاليف تشغيلية أدنى'),

('Cost-Benefit Analysis', 'تحليل التكلفة والعائد', 'Ratio of expected benefits to implementation costs', 'نسبة المنافع المتوقعة إلى تكاليف التنفيذ', 'financial', 15, false, 1, 10,
'1-3: Benefits barely cover costs, poor cost-benefit ratio
4-6: Benefits moderately exceed costs, acceptable ratio
7-8: Strong benefits relative to costs, good value proposition
9-10: Exceptional benefits with minimal costs, outstanding value',
'1-3: المنافع بالكاد تغطي التكاليف، نسبة ضعيفة
4-6: المنافع تتجاوز التكاليف بشكل متوسط، نسبة مقبولة
7-8: منافع قوية مقارنة بالتكاليف، قيمة جيدة
9-10: منافع استثنائية بتكاليف أدنى، قيمة متميزة'),

-- Market Criteria
('Market Potential', 'إمكانات السوق', 'Size of addressable market and growth potential', 'حجم السوق القابل للوصول وإمكانات النمو', 'market', 20, true, 1, 10,
'1-3: Small niche market, limited growth potential
4-6: Moderate market size with steady growth
7-8: Large market with strong growth opportunities
9-10: Massive market with explosive growth potential',
'1-3: سوق متخصص صغير، إمكانات نمو محدودة
4-6: حجم سوق متوسط مع نمو ثابت
7-8: سوق كبير مع فرص نمو قوية
9-10: سوق ضخم مع إمكانات نمو هائلة'),

('Competitive Advantage', 'الميزة التنافسية', 'Uniqueness and differentiation from existing solutions', 'التفرد والتمايز عن الحلول الموجودة', 'market', 18, true, 1, 10,
'1-3: No clear competitive advantage, many similar solutions
4-6: Some differentiation but competitors exist
7-8: Clear competitive advantage with unique features
9-10: Significant differentiation, first-mover advantage',
'1-3: لا توجد ميزة تنافسية واضحة، حلول مشابهة كثيرة
4-6: بعض التمايز لكن يوجد منافسون
7-8: ميزة تنافسية واضحة مع ميزات فريدة
9-10: تمايز كبير، ميزة الريادة في السوق'),

('Customer Demand', 'طلب العملاء', 'Evidence of customer need and willingness to pay', 'دليل على حاجة العملاء واستعدادهم للدفع', 'market', 16, false, 1, 10,
'1-3: Unclear customer demand, no validation
4-6: Some customer interest expressed
7-8: Strong customer demand validated through research
9-10: Proven customer demand with pre-orders or commitments',
'1-3: طلب عملاء غير واضح، لا يوجد تأكيد
4-6: بعض اهتمام العملاء المعبر عنه
7-8: طلب عملاء قوي مثبت من خلال البحث
9-10: طلب عملاء مثبت مع طلبات مسبقة أو التزامات'),

-- Strategic Criteria
('Strategic Alignment', 'التوافق الاستراتيجي', 'Alignment with organizational vision, mission, and strategic objectives', 'التوافق مع رؤية المنظمة ورسالتها وأهدافها الاستراتيجية', 'strategic', 22, true, 1, 10,
'1-3: Poor alignment with organizational strategy
4-6: Moderate alignment with some strategic goals
7-8: Strong alignment with key strategic objectives
9-10: Perfect alignment with core organizational strategy',
'1-3: توافق ضعيف مع استراتيجية المنظمة
4-6: توافق متوسط مع بعض الأهداف الاستراتيجية
7-8: توافق قوي مع الأهداف الاستراتيجية الرئيسية
9-10: توافق مثالي مع الاستراتيجية التنظيمية الأساسية'),

('Vision 2030 Alignment', 'التوافق مع رؤية 2030', 'Contribution to Vision 2030 goals and national transformation', 'المساهمة في أهداف رؤية 2030 والتحول الوطني', 'strategic', 20, true, 1, 10,
'1-3: No clear contribution to Vision 2030 objectives
4-6: Some contribution to transformation goals
7-8: Strong contribution to multiple Vision 2030 pillars
9-10: Exceptional contribution to national transformation priorities',
'1-3: لا توجد مساهمة واضحة في أهداف رؤية 2030
4-6: بعض المساهمة في أهداف التحول
7-8: مساهمة قوية في ركائز متعددة لرؤية 2030
9-10: مساهمة استثنائية في أولويات التحول الوطني'),

('Organizational Impact', 'التأثير التنظيمي', 'Expected impact on organizational processes and capabilities', 'التأثير المتوقع على العمليات والقدرات التنظيمية', 'strategic', 15, false, 1, 10,
'1-3: Minimal organizational impact
4-6: Moderate impact on specific departments
7-8: Significant impact across multiple functions
9-10: Transformational impact on entire organization',
'1-3: تأثير تنظيمي أدنى
4-6: تأثير متوسط على إدارات محددة
7-8: تأثير كبير عبر وظائف متعددة
9-10: تأثير تحويلي على المنظمة بأكملها'),

-- Innovation Criteria
('Innovation Level', 'مستوى الابتكار', 'Degree of novelty and creativity in the proposed solution', 'درجة الجدة والإبداع في الحل المقترح', 'innovation', 20, true, 1, 10,
'1-3: Incremental improvement to existing solutions
4-6: Moderate innovation with some novel aspects
7-8: Significant innovation with new approaches
9-10: Breakthrough innovation, paradigm-shifting',
'1-3: تحسين تدريجي للحلول الموجودة
4-6: ابتكار متوسط مع بعض الجوانب الجديدة
7-8: ابتكار كبير مع مناهج جديدة
9-10: ابتكار اختراقي، يغير النموذج'),

('Intellectual Property Potential', 'إمكانية الملكية الفكرية', 'Potential for patents, trademarks, or other IP protection', 'إمكانية الحصول على براءات اختراع أو حماية ملكية فكرية أخرى', 'innovation', 12, false, 1, 10,
'1-3: No IP potential, common knowledge
4-6: Some IP potential, limited protection possible
7-8: Strong IP potential, patentable innovations
9-10: Exceptional IP value, multiple protection opportunities',
'1-3: لا توجد إمكانية ملكية فكرية، معرفة عامة
4-6: بعض إمكانية الملكية الفكرية، حماية محدودة ممكنة
7-8: إمكانية قوية للملكية الفكرية، ابتكارات قابلة للحماية
9-10: قيمة ملكية فكرية استثنائية، فرص حماية متعددة'),

('Disruptive Potential', 'الإمكانية التخريبية', 'Potential to disrupt existing markets or create new ones', 'إمكانية تعطيل الأسواق الموجودة أو إنشاء أسواق جديدة', 'innovation', 18, false, 1, 10,
'1-3: No disruptive potential, sustaining innovation
4-6: Some market disruption possible
7-8: Significant disruptive potential in specific sectors
9-10: Massive disruption potential, industry transformation',
'1-3: لا توجد إمكانية تخريبية، ابتكار داعم
4-6: بعض تعطيل السوق ممكن
7-8: إمكانية تخريبية كبيرة في قطاعات محددة
9-10: إمكانية تخريب هائلة، تحول الصناعة'),

-- Implementation Criteria
('Implementation Complexity', 'تعقيد التنفيذ', 'Overall complexity of implementing the solution', 'التعقيد الإجمالي لتنفيذ الحل', 'implementation', 15, true, 1, 10,
'1-3: Extremely complex, multiple phases, high coordination needed
4-6: Moderately complex, some coordination required
7-8: Manageable complexity, standard implementation
9-10: Simple implementation, minimal complexity',
'1-3: معقد للغاية، مراحل متعددة، تنسيق عالي مطلوب
4-6: معقد بشكل متوسط، بعض التنسيق مطلوب
7-8: تعقيد قابل للإدارة، تنفيذ قياسي
9-10: تنفيذ بسيط، تعقيد أدنى'),

('Resource Requirements', 'متطلبات الموارد', 'Human, technical, and material resources needed', 'الموارد البشرية والتقنية والمادية المطلوبة', 'implementation', 18, true, 1, 10,
'1-3: Extensive resources required, significant staffing needs
4-6: Moderate resource requirements, manageable staffing
7-8: Reasonable resource needs, existing team capable
9-10: Minimal resources required, current capacity sufficient',
'1-3: موارد واسعة مطلوبة، احتياجات كبيرة للموظفين
4-6: متطلبات موارد متوسطة، موظفون قابلون للإدارة
7-8: احتياجات موارد معقولة، الفريق الحالي قادر
9-10: موارد أدنى مطلوبة، القدرة الحالية كافية'),

('Timeline Feasibility', 'جدوى الجدول الزمني', 'Realistic timeline for implementation and delivery', 'جدول زمني واقعي للتنفيذ والتسليم', 'implementation', 14, false, 1, 10,
'1-3: Unrealistic timeline, significant delays expected
4-6: Challenging timeline, some delays possible
7-8: Realistic timeline, achievable milestones
9-10: Conservative timeline, early delivery possible',
'1-3: جدول زمني غير واقعي، تأخيرات كبيرة متوقعة
4-6: جدول زمني صعب، بعض التأخيرات ممكنة
7-8: جدول زمني واقعي، معالم قابلة للتحقيق
9-10: جدول زمني محافظ، تسليم مبكر ممكن'),

-- Risk Criteria
('Risk Assessment', 'تقييم المخاطر', 'Overall risk evaluation including technical, financial, and market risks', 'تقييم المخاطر الإجمالي بما في ذلك المخاطر التقنية والمالية والسوقية', 'risk', 16, true, 1, 10,
'1-3: High risk, multiple risk factors, uncertain outcomes
4-6: Moderate risk, some risk factors manageable
7-8: Low risk, well-understood challenges
9-10: Very low risk, minimal uncertainty',
'1-3: مخاطر عالية، عوامل خطر متعددة، نتائج غير مؤكدة
4-6: مخاطر متوسطة، بعض عوامل الخطر قابلة للإدارة
7-8: مخاطر منخفضة، تحديات مفهومة جيداً
9-10: مخاطر منخفضة جداً، عدم يقين أدنى'),

('Regulatory Compliance', 'الامتثال التنظيمي', 'Compliance with relevant regulations and standards', 'الامتثال للوائح والمعايير ذات الصلة', 'risk', 14, true, 1, 10,
'1-3: Significant regulatory hurdles, compliance uncertain
4-6: Some regulatory requirements, manageable compliance
7-8: Clear regulatory path, standard compliance
9-10: No regulatory barriers, full compliance assured',
'1-3: عقبات تنظيمية كبيرة، امتثال غير مؤكد
4-6: بعض المتطلبات التنظيمية، امتثال قابل للإدارة
7-8: مسار تنظيمي واضح، امتثال قياسي
9-10: لا توجد حواجز تنظيمية، امتثال كامل مضمون'),

('Security Considerations', 'اعتبارات الأمان', 'Data security, privacy, and cybersecurity implications', 'أمان البيانات والخصوصية وتداعيات الأمن السيبراني', 'risk', 12, false, 1, 10,
'1-3: Significant security risks, major vulnerabilities
4-6: Some security concerns, manageable with proper measures
7-8: Standard security requirements, well-established solutions
9-10: No security risks, enhanced security features',
'1-3: مخاطر أمنية كبيرة، نقاط ضعف رئيسية
4-6: بعض المخاوف الأمنية، قابلة للإدارة بتدابير مناسبة
7-8: متطلبات أمنية قياسية، حلول راسخة
9-10: لا توجد مخاطر أمنية، ميزات أمنية محسنة'),

-- Sustainability Criteria
('Environmental Impact', 'التأثير البيئي', 'Environmental sustainability and carbon footprint considerations', 'الاستدامة البيئية واعتبارات البصمة الكربونية', 'sustainability', 10, false, 1, 10,
'1-3: Negative environmental impact, increases carbon footprint
4-6: Neutral environmental impact
7-8: Positive environmental impact, reduces carbon footprint
9-10: Exceptional environmental benefits, carbon negative',
'1-3: تأثير بيئي سلبي، يزيد البصمة الكربونية
4-6: تأثير بيئي محايد
7-8: تأثير بيئي إيجابي، يقلل البصمة الكربونية
9-10: منافع بيئية استثنائية، سالب الكربون'),

('Social Impact', 'التأثير الاجتماعي', 'Impact on society, communities, and quality of life', 'التأثير على المجتمع والمجتمعات المحلية وجودة الحياة', 'sustainability', 12, false, 1, 10,
'1-3: Negative social impact or no social benefit
4-6: Minimal social impact
7-8: Positive social impact, improves quality of life
9-10: Exceptional social benefits, transformative impact',
'1-3: تأثير اجتماعي سلبي أو لا توجد منفعة اجتماعية
4-6: تأثير اجتماعي أدنى
7-8: تأثير اجتماعي إيجابي، يحسن جودة الحياة
9-10: منافع اجتماعية استثنائية، تأثير تحويلي'),

('Economic Sustainability', 'الاستدامة الاقتصادية', 'Long-term economic viability and contribution to economic growth', 'الجدوى الاقتصادية طويلة المدى والمساهمة في النمو الاقتصادي', 'sustainability', 14, false, 1, 10,
'1-3: Economically unsustainable, temporary benefits only
4-6: Short-term economic benefits, uncertain sustainability
7-8: Sustainable economic model with long-term benefits
9-10: Exceptional economic sustainability, creates lasting value',
'1-3: غير مستدام اقتصادياً، منافع مؤقتة فقط
4-6: منافع اقتصادية قصيرة المدى، استدامة غير مؤكدة
7-8: نموذج اقتصادي مستدام مع منافع طويلة المدى
9-10: استدامة اقتصادية استثنائية، ينشئ قيمة دائمة');

-- Insert comprehensive evaluation templates for different scenarios
INSERT INTO evaluation_templates (name, name_ar, description, description_ar, evaluation_type, is_default, criteria_config, scoring_method, is_active) VALUES

('Innovation Screening Template', 'قالب فحص الابتكار', 'Quick screening for innovative ideas focusing on novelty and feasibility', 'فحص سريع للأفكار المبتكرة مع التركيز على الجدة والجدوى', 'innovation_screening', true, 
'[{"weight": 25}, {"weight": 20}, {"weight": 20}, {"weight": 15}, {"weight": 20}]', 'weighted_average', true),

('Comprehensive Innovation Evaluation', 'تقييم الابتكار الشامل', 'Detailed evaluation for innovative projects covering all aspects', 'تقييم مفصل للمشاريع المبتكرة يغطي جميع الجوانب', 'innovation', true,
'[{"weight": 18}, {"weight": 22}, {"weight": 18}, {"weight": 20}, {"weight": 15}, {"weight": 7}]', 'weighted_average', true),

('Technical Feasibility Assessment', 'تقييم الجدوى التقنية', 'Technical-focused evaluation for technology projects', 'تقييم مركز على التقنية للمشاريع التقنية', 'technical', false,
'[{"weight": 30}, {"weight": 25}, {"weight": 20}, {"weight": 15}, {"weight": 10}]', 'weighted_average', true),

('Financial Viability Analysis', 'تحليل الجدوى المالية', 'Financial-focused evaluation emphasizing ROI and cost-benefit', 'تقييم مركز على المالية مع التأكيد على العائد وتحليل التكلفة والعائد', 'financial', false,
'[{"weight": 35}, {"weight": 30}, {"weight": 20}, {"weight": 15}]', 'weighted_average', true),

('Market Opportunity Assessment', 'تقييم فرصة السوق', 'Market-focused evaluation for commercial viability', 'تقييم مركز على السوق للجدوى التجارية', 'market', false,
'[{"weight": 30}, {"weight": 25}, {"weight": 20}, {"weight": 15}, {"weight": 10}]', 'weighted_average', true),

('Strategic Alignment Review', 'مراجعة التوافق الاستراتيجي', 'Strategic evaluation for organizational alignment', 'تقييم استراتيجي للتوافق التنظيمي', 'strategic', false,
'[{"weight": 35}, {"weight": 30}, {"weight": 20}, {"weight": 15}]', 'weighted_average', true),

('Risk Assessment Template', 'قالب تقييم المخاطر', 'Risk-focused evaluation for high-stakes projects', 'تقييم مركز على المخاطر للمشاريع عالية المخاطر', 'risk', false,
'[{"weight": 25}, {"weight": 25}, {"weight": 25}, {"weight": 15}, {"weight": 10}]', 'weighted_average', true),

('Sustainability Impact Evaluation', 'تقييم تأثير الاستدامة', 'Sustainability-focused evaluation for environmental and social impact', 'تقييم مركز على الاستدامة للتأثير البيئي والاجتماعي', 'sustainability', false,
'[{"weight": 30}, {"weight": 25}, {"weight": 25}, {"weight": 20}]', 'weighted_average', true),

('Quick Preliminary Screening', 'الفحص الأولي السريع', 'Fast preliminary evaluation for initial idea filtering', 'تقييم أولي سريع لتصفية الأفكار الأولية', 'preliminary', false,
'[{"weight": 30}, {"weight": 25}, {"weight": 25}, {"weight": 20}]', 'simple_average', true),

('Research Project Evaluation', 'تقييم المشروع البحثي', 'Specialized evaluation for research and development projects', 'تقييم متخصص لمشاريع البحث والتطوير', 'research', false,
'[{"weight": 25}, {"weight": 20}, {"weight": 20}, {"weight": 15}, {"weight": 10}, {"weight": 10}]', 'weighted_average', true),

('Digital Transformation Assessment', 'تقييم التحول الرقمي', 'Evaluation template for digital transformation initiatives', 'قالب تقييم لمبادرات التحول الرقمي', 'digital_transformation', false,
'[{"weight": 25}, {"weight": 20}, {"weight": 20}, {"weight": 15}, {"weight": 10}, {"weight": 10}]', 'weighted_average', true),

('Process Improvement Evaluation', 'تقييم تحسين العمليات', 'Template for evaluating process improvement initiatives', 'قالب لتقييم مبادرات تحسين العمليات', 'process_improvement', false,
'[{"weight": 20}, {"weight": 25}, {"weight": 20}, {"weight": 15}, {"weight": 10}, {"weight": 10}]', 'weighted_average', true);

-- Insert comprehensive evaluation rules covering all scenarios
INSERT INTO evaluation_rules (name, name_ar, condition_type, condition_value, action_type, action_value, priority, is_active, metadata) VALUES

-- Auto-approval rules
('Excellence Auto-Approval', 'الموافقة التلقائية للتميز', 'min_score', 9.0, 'auto_approve', 'approved_excellent', 1, true,
'{"notification": true, "escalation": false, "reason": "Exceptional score merits immediate approval"}'),

('High-Score Auto-Approval', 'الموافقة التلقائية للنتيجة العالية', 'min_score', 8.0, 'auto_approve', 'approved_high_score', 2, true,
'{"notification": true, "escalation": false, "reason": "High score indicates strong viability"}'),

('Innovation Breakthrough Approval', 'موافقة الابتكار الاختراقي', 'criteria_score', 9.0, 'auto_approve', 'approved_innovation', 1, true,
'{"criteria": "Innovation Level", "notification": true, "fast_track": true}'),

-- Auto-rejection rules
('Poor Score Auto-Rejection', 'الرفض التلقائي للنتيجة الضعيفة', 'max_score', 3.0, 'auto_reject', 'rejected_poor_score', 3, true,
'{"notification": true, "feedback_required": true, "reason": "Score below minimum threshold"}'),

('Technical Infeasibility Rejection', 'رفض عدم الجدوى التقنية', 'criteria_score', 2.0, 'auto_reject', 'rejected_technical', 2, true,
'{"criteria": "Technical Feasibility", "notification": true, "feedback_required": true}'),

('Financial Unviability Rejection', 'رفض عدم الجدوى المالية', 'criteria_score', 2.0, 'auto_reject', 'rejected_financial', 2, true,
'{"criteria": "Financial Viability", "notification": true, "feedback_required": true}'),

-- Review and escalation rules
('Moderate Score Review', 'مراجعة النتيجة المتوسطة', 'avg_score', 6.0, 'flag_review', 'needs_detailed_review', 4, true,
'{"notification": true, "assign_senior_evaluator": true, "deadline_days": 5}'),

('High-Risk Project Review', 'مراجعة المشروع عالي المخاطر', 'criteria_score', 3.0, 'flag_review', 'high_risk_review', 3, true,
'{"criteria": "Risk Assessment", "notification": true, "escalate_to": "risk_committee"}'),

('Strategic Misalignment Review', 'مراجعة عدم التوافق الاستراتيجي', 'criteria_score', 4.0, 'flag_review', 'strategic_review', 4, true,
'{"criteria": "Strategic Alignment", "notification": true, "escalate_to": "strategy_team"}'),

('Budget Threshold Review', 'مراجعة حد الميزانية', 'criteria_score', 4.0, 'escalate_approval', 'budget_committee', 3, true,
'{"criteria": "Budget Requirements", "notification": true, "approval_level": "senior_management"}'),

-- Assignment rules
('Innovation Expert Assignment', 'تعيين خبير الابتكار', 'criteria_score', 8.0, 'assign_evaluator', 'innovation_expert', 5, true,
'{"criteria": "Innovation Level", "notification": true, "evaluator_type": "innovation_specialist"}'),

('Technical Expert Assignment', 'تعيين الخبير التقني', 'criteria_score', 7.0, 'assign_evaluator', 'technical_expert', 5, true,
'{"criteria": "Technical Feasibility", "notification": true, "evaluator_type": "technical_specialist"}'),

('Financial Analyst Assignment', 'تعيين محلل مالي', 'criteria_score', 7.0, 'assign_evaluator', 'financial_analyst', 5, true,
'{"criteria": "Financial Viability", "notification": true, "evaluator_type": "financial_specialist"}'),

-- Notification and follow-up rules
('Deadline Reminder', 'تذكير الموعد النهائي', 'days_pending', 3, 'send_notification', 'deadline_reminder', 6, true,
'{"notification_type": "reminder", "escalate_after_days": 7, "reminder_frequency": "daily"}'),

('Evaluator Assignment Notification', 'إشعار تعيين المقيم', 'status_change', 1, 'send_notification', 'evaluator_assigned', 7, true,
'{"notification_type": "assignment", "include_guidelines": true, "deadline_days": 7}'),

('Completion Notification', 'إشعار الإكمال', 'evaluation_complete', 1, 'send_notification', 'evaluation_complete', 8, true,
'{"notification_type": "completion", "include_summary": true, "notify_stakeholders": true}'),

-- Workflow automation rules
('Fast-Track High Innovation', 'المسار السريع للابتكار العالي', 'criteria_score', 9.0, 'fast_track', 'innovation_fast_track', 2, true,
'{"criteria": "Innovation Level", "skip_stages": ["preliminary_review"], "expedite_timeline": true}'),

('Standard Review Process', 'عملية المراجعة القياسية', 'avg_score', 5.0, 'standard_process', 'normal_workflow', 10, true,
'{"notification": false, "standard_timeline": true, "normal_process": true}'),

-- Quality assurance rules
('Inconsistent Scores Review', 'مراجعة النتائج غير المتسقة', 'score_variance', 3.0, 'flag_review', 'score_inconsistency', 3, true,
'{"notification": true, "require_consensus": true, "additional_evaluator": true}'),

('Bias Detection Alert', 'تنبيه اكتشاف التحيز', 'evaluator_pattern', 2.0, 'flag_review', 'potential_bias', 2, true,
'{"notification": true, "review_evaluator_history": true, "assign_different_evaluator": true}');

-- Insert system settings for different configurations
INSERT INTO evaluation_system_settings (setting_key, setting_value, description, category, is_system) VALUES

-- Scoring system settings
('scoring_scale', '{"min": 1, "max": 10, "type": "numeric", "decimals": 1}', 'Default scoring scale for evaluations', 'scoring', true),
('calculation_method', '{"method": "weighted_average", "round_to": 1, "handle_missing": "exclude"}', 'How final scores are calculated', 'scoring', true),
('score_normalization', '{"enabled": true, "method": "z_score", "outlier_threshold": 2.5}', 'Score normalization to handle evaluator bias', 'scoring', false),

-- Threshold settings
('approval_thresholds', '{"excellent": 8.5, "good": 7.0, "acceptable": 5.0, "poor": 3.0}', 'Score thresholds for different approval levels', 'thresholds', true),
('criteria_thresholds', '{"technical_minimum": 4.0, "financial_minimum": 5.0, "strategic_minimum": 6.0}', 'Minimum scores required for specific criteria', 'thresholds', false),
('risk_thresholds', '{"high_risk": 3.0, "medium_risk": 5.0, "low_risk": 7.0}', 'Risk assessment thresholds', 'thresholds', false),

-- Workflow settings
('evaluation_workflow', '{"stages": ["preliminary", "detailed", "final"], "parallel_evaluation": true, "consensus_required": false}', 'Evaluation workflow configuration', 'workflow', true),
('assignment_rules', '{"auto_assign": true, "load_balancing": true, "expertise_matching": true, "avoid_conflicts": true}', 'Rules for automatic evaluator assignment', 'workflow', true),
('escalation_rules', '{"auto_escalate": true, "escalation_levels": 3, "timeout_days": 7}', 'Automatic escalation configuration', 'workflow', false),

-- Deadline and timing settings
('evaluation_deadlines', '{"default_days": 7, "urgent_days": 3, "complex_days": 14, "reminder_days": [3, 1]}', 'Evaluation deadlines and reminders', 'timing', true),
('business_hours', '{"start": "08:00", "end": "17:00", "timezone": "Asia/Riyadh", "working_days": [1,2,3,4,5]}', 'Business hours for deadline calculations', 'timing', true),
('holiday_calendar', '{"country": "SA", "custom_holidays": [], "exclude_weekends": true}', 'Holiday calendar for deadline adjustments', 'timing', false),

-- Quality settings
('quality_controls', '{"min_evaluators": 2, "max_evaluators": 5, "consensus_threshold": 0.8, "bias_detection": true}', 'Quality control measures', 'quality', true),
('evaluator_qualifications', '{"min_experience": 2, "required_certifications": [], "expertise_areas": ["technical", "financial", "strategic"]}', 'Minimum qualifications for evaluators', 'quality', false),
('feedback_requirements', '{"strengths_required": true, "weaknesses_required": true, "recommendations_required": true, "min_length": 50}', 'Required feedback components', 'quality', true),

-- Notification settings
('notification_preferences', '{"email_enabled": true, "sms_enabled": false, "in_app_enabled": true, "frequency": "immediate"}', 'Default notification preferences', 'notifications', true),
('notification_templates', '{"assignment": "eval_assignment", "completion": "eval_complete", "reminder": "deadline_reminder"}', 'Notification template mappings', 'notifications', false),
('stakeholder_notifications', '{"notify_submitter": true, "notify_manager": true, "notify_committee": false}', 'Stakeholder notification settings', 'notifications', false),

-- Security and privacy settings
('data_retention', '{"evaluation_data": 2555, "personal_data": 1095, "backup_frequency": 30}', 'Data retention policies in days', 'security', true),
('access_controls', '{"role_based": true, "attribute_based": false, "session_timeout": 480}', 'Access control configuration', 'security', true),
('audit_settings', '{"log_all_actions": true, "log_data_changes": true, "retention_days": 2555}', 'Audit logging configuration', 'security', false),

-- Performance settings
('performance_metrics', '{"target_completion_time": 5, "target_quality_score": 4.0, "max_pending_evaluations": 50}', 'Performance targets and limits', 'performance', false),
('system_limits', '{"max_file_size": 10485760, "max_evaluations_per_user": 100, "concurrent_evaluations": 10}', 'System resource limits', 'performance', true),
('cache_settings', '{"cache_duration": 3600, "cache_evaluation_data": true, "cache_user_preferences": true}', 'Caching configuration for performance', 'performance', false),

-- Integration settings
('api_settings', '{"rate_limit": 1000, "timeout": 30, "retry_attempts": 3}', 'API configuration for external integrations', 'integration', false),
('export_formats', '{"pdf": true, "excel": true, "csv": true, "json": false}', 'Available export formats', 'integration', true),
('external_systems', '{"erp_integration": false, "crm_integration": false, "notification_service": true}', 'External system integration flags', 'integration', false),

-- Customization settings
('ui_customization', '{"theme": "default", "logo_url": "", "color_scheme": "blue", "rtl_support": true}', 'User interface customization', 'customization', false),
('report_customization', '{"include_charts": true, "include_recommendations": true, "format": "detailed"}', 'Report generation customization', 'customization', false),
('language_settings', '{"default_language": "ar", "supported_languages": ["ar", "en"], "auto_translate": false}', 'Multi-language configuration', 'customization', true);