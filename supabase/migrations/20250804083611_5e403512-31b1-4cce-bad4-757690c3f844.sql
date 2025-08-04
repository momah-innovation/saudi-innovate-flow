-- Populate Media Content with relevant innovation-focused content
INSERT INTO public.media_content (title, title_ar, description, description_ar, content_type, content_url, thumbnail_url, duration_seconds, language, organization, published_at, is_featured, is_public, metadata) VALUES

-- Podcasts
('Innovation Leadership in Government', 'قيادة الابتكار في الحكومة', 'Insights from Saudi government innovation leaders on transforming public services', 'رؤى من قادة الابتكار الحكومي السعودي حول تحويل الخدمات العامة', 'podcast', 'https://example.com/podcast/innovation-leadership.mp3', 'https://example.com/thumbnails/podcast1.jpg', 2400, 'ar', 'رؤية 2030', '2024-01-15 10:00:00+00', true, true, '{"host": "د. أحمد المالكي", "season": 1, "episode": 1}'),

('Digital Transformation Stories', 'قصص التحول الرقمي', 'Real stories of digital transformation across Saudi ministries', 'قصص حقيقية للتحول الرقمي عبر الوزارات السعودية', 'podcast', 'https://example.com/podcast/digital-transformation.mp3', 'https://example.com/thumbnails/podcast2.jpg', 3600, 'ar', 'وزارة الاتصالات وتقنية المعلومات', '2024-01-20 14:00:00+00', true, true, '{"host": "م. سارة العتيبي", "season": 1, "episode": 2}'),

('AI in Public Sector', 'الذكاء الاصطناعي في القطاع العام', 'Exploring AI applications in government services and decision making', 'استكشاف تطبيقات الذكاء الاصطناعي في الخدمات الحكومية واتخاذ القرارات', 'podcast', 'https://example.com/podcast/ai-public-sector.mp3', 'https://example.com/thumbnails/podcast3.jpg', 2880, 'ar', 'هيئة البيانات والذكاء الاصطناعي', '2024-02-01 09:00:00+00', false, true, '{"host": "د. محمد الشمري", "season": 1, "episode": 3}'),

-- Webinars
('Innovation Challenge Design Workshop', 'ورشة تصميم تحديات الابتكار', 'Learn how to design effective innovation challenges that drive meaningful solutions', 'تعلم كيفية تصميم تحديات ابتكار فعالة تقود إلى حلول مفيدة', 'webinar', 'https://example.com/webinars/challenge-design.mp4', 'https://example.com/thumbnails/webinar1.jpg', 5400, 'ar', 'مركز محمد بن راشد للابتكار الحكومي', '2024-01-25 16:00:00+00', true, true, '{"presenter": "د. فاطمة النعيمي", "participants": 250, "recording_quality": "HD"}'),

('Stakeholder Engagement Best Practices', 'أفضل ممارسات إشراك أصحاب المصلحة', 'Strategies for effective stakeholder engagement in government innovation projects', 'استراتيجيات الإشراك الفعال لأصحاب المصلحة في مشاريع الابتكار الحكومي', 'webinar', 'https://example.com/webinars/stakeholder-engagement.mp4', 'https://example.com/thumbnails/webinar2.jpg', 4800, 'ar', 'معهد الإدارة العامة', '2024-02-05 10:00:00+00', false, true, '{"presenter": "م. خالد الحربي", "participants": 180, "recording_quality": "HD"}'),

-- Videos
('Vision 2030 Innovation Showcase', 'معرض ابتكارات رؤية 2030', 'Highlighting breakthrough innovations contributing to Saudi Vision 2030 goals', 'تسليط الضوء على الابتكارات الرائدة التي تساهم في أهداف رؤية السعودية 2030', 'video', 'https://example.com/videos/vision2030-showcase.mp4', 'https://example.com/thumbnails/video1.jpg', 1800, 'ar', 'مكتب رؤية السعودية 2030', '2024-01-10 12:00:00+00', true, true, '{"resolution": "4K", "subtitles": ["ar", "en"], "category": "showcase"}'),

('Smart City Solutions Demo', 'عرض حلول المدن الذكية', 'Demonstrating cutting-edge smart city technologies implemented in Saudi cities', 'عرض تقنيات المدن الذكية المتطورة المطبقة في المدن السعودية', 'video', 'https://example.com/videos/smart-cities.mp4', 'https://example.com/thumbnails/video2.jpg', 2700, 'ar', 'وزارة الشؤون البلدية والقروية والإسكان', '2024-02-10 15:00:00+00', false, true, '{"resolution": "HD", "location": "الرياض", "technology": "IoT"}'),

-- Documents
('Innovation Framework Guide', 'دليل إطار الابتكار', 'Comprehensive guide for implementing innovation frameworks in government organizations', 'دليل شامل لتطبيق أطر الابتكار في المنظمات الحكومية', 'document', 'https://example.com/docs/innovation-framework.pdf', 'https://example.com/thumbnails/doc1.jpg', NULL, 'ar', 'مركز الابتكار الحكومي', '2024-01-05 08:00:00+00', true, true, '{"pages": 45, "format": "PDF", "version": "2.0"}'),

('Digital Services Design Manual', 'دليل تصميم الخدمات الرقمية', 'Step-by-step manual for designing user-centered digital government services', 'دليل خطوة بخطوة لتصميم الخدمات الحكومية الرقمية المتمحورة حول المستخدم', 'document', 'https://example.com/docs/digital-services-manual.pdf', 'https://example.com/thumbnails/doc2.jpg', NULL, 'ar', 'الهيئة السعودية للحكومة الرقمية', '2024-01-18 11:00:00+00', false, true, '{"pages": 78, "format": "PDF", "interactive": true}');

-- Populate Knowledge Base with relevant articles
INSERT INTO public.knowledge_base (title, title_ar, content, content_ar, excerpt, excerpt_ar, category, difficulty_level, estimated_read_time, is_published, is_featured) VALUES

('Getting Started with Innovation Challenges', 'البدء في تحديات الابتكار', 
'Innovation challenges are a powerful tool for solving complex problems by engaging diverse communities of innovators. This guide covers the fundamentals of creating, managing, and evaluating innovation challenges that drive meaningful outcomes.

## Understanding Innovation Challenges

Innovation challenges work by presenting a specific problem or opportunity to a community of potential solvers. Participants submit their ideas, which are then evaluated based on predefined criteria. The best solutions are selected for further development or implementation.

## Key Components

1. **Clear Problem Definition**: Start with a well-defined challenge statement
2. **Target Audience**: Identify who you want to participate
3. **Evaluation Criteria**: Establish clear judging criteria
4. **Timeline**: Set realistic deadlines for each phase
5. **Resources**: Provide necessary support and incentives

## Best Practices

- Keep the challenge focused but not overly restrictive
- Provide clear guidelines and examples
- Offer meaningful incentives and recognition
- Create opportunities for collaboration
- Plan for implementation of winning solutions

## Common Pitfalls to Avoid

- Vague problem statements
- Unrealistic timelines
- Insufficient resources for implementation
- Poor communication with participants
- Lack of follow-through on results',

'تحديات الابتكار هي أداة قوية لحل المشاكل المعقدة من خلال إشراك مجتمعات متنوعة من المبتكرين. يغطي هذا الدليل أساسيات إنشاء وإدارة وتقييم تحديات الابتكار التي تحقق نتائج مفيدة.

## فهم تحديات الابتكار

تعمل تحديات الابتكار من خلال عرض مشكلة أو فرصة محددة على مجتمع من الحلالين المحتملين. يقدم المشاركون أفكارهم، والتي يتم تقييمها بناءً على معايير محددة مسبقاً. يتم اختيار أفضل الحلول للتطوير أو التنفيذ الإضافي.

## المكونات الرئيسية

1. **تعريف واضح للمشكلة**: ابدأ ببيان تحدي محدد جيداً
2. **الجمهور المستهدف**: حدد من تريد أن يشارك
3. **معايير التقييم**: ضع معايير تحكيم واضحة
4. **الجدول الزمني**: حدد مواعيد نهائية واقعية لكل مرحلة
5. **الموارد**: قدم الدعم والحوافز اللازمة

## أفضل الممارسات

- اجعل التحدي مركزاً ولكن ليس مقيداً بشكل مفرط
- قدم إرشادات وأمثلة واضحة
- اعرض حوافز واعتراف ذي معنى
- أنشئ فرص للتعاون
- خطط لتنفيذ الحلول الفائزة

## المخاطر الشائعة التي يجب تجنبها

- بيانات المشاكل الغامضة
- الجداول الزمنية غير الواقعية
- الموارد غير الكافية للتنفيذ
- التواصل السيء مع المشاركين
- نقص المتابعة للنتائج',

'Learn the fundamentals of creating effective innovation challenges that engage communities and drive meaningful solutions.',
'تعلم أساسيات إنشاء تحديات ابتكار فعالة تشرك المجتمعات وتحقق حلول مفيدة.',
'Innovation Management', 'beginner', 8, true, true),

('Advanced Evaluation Frameworks', 'أطر التقييم المتقدمة',
'Effective evaluation is crucial for identifying the most promising innovative solutions. This comprehensive guide explores various evaluation frameworks and methodologies used in government innovation challenges.

## Multi-Criteria Decision Analysis (MCDA)

MCDA provides a structured approach to evaluation when multiple criteria must be considered:

### Technical Feasibility (25%)
- Implementation complexity
- Technology readiness level
- Resource requirements
- Risk assessment

### Impact Potential (30%)
- Scale of problem addressed
- Number of beneficiaries
- Measurable outcomes
- Long-term sustainability

### Innovation Level (20%)
- Novelty of approach
- Creative use of technology
- Breakthrough potential
- Differentiation from existing solutions

### Strategic Alignment (15%)
- Alignment with organizational goals
- Policy compliance
- Stakeholder support
- Political feasibility

### Financial Viability (10%)
- Cost-effectiveness
- Return on investment
- Funding availability
- Budget constraints

## Evaluation Process

1. **Initial Screening**: Filter submissions based on basic criteria
2. **Detailed Assessment**: Apply full evaluation framework
3. **Expert Review**: Subject matter expert evaluation
4. **Public Engagement**: Community feedback where appropriate
5. **Final Selection**: Weighted scoring and ranking

## Bias Mitigation

- Use multiple evaluators per submission
- Implement blind review processes
- Provide evaluator training
- Document decision rationale
- Include diverse perspectives

## Technology-Assisted Evaluation

Modern evaluation can be enhanced with:
- AI-powered similarity detection
- Automated initial screening
- Sentiment analysis of submissions
- Data visualization tools
- Collaborative scoring platforms',

'التقييم الفعال أمر بالغ الأهمية لتحديد الحلول الابتكارية الأكثر واعدية. يستكشف هذا الدليل الشامل أطر ومنهجيات التقييم المختلفة المستخدمة في تحديات الابتكار الحكومي.

## تحليل القرار متعدد المعايير

يوفر تحليل القرار متعدد المعايير نهجاً منظماً للتقييم عندما يجب مراعاة معايير متعددة:

### الجدوى التقنية (25%)
- تعقد التنفيذ
- مستوى جاهزية التكنولوجيا
- متطلبات الموارد
- تقييم المخاطر

### إمكانية التأثير (30%)
- نطاق المشكلة المعالجة
- عدد المستفيدين
- النتائج القابلة للقياس
- الاستدامة طويلة الأمد

### مستوى الابتكار (20%)
- حداثة النهج
- الاستخدام الإبداعي للتكنولوجيا
- إمكانية الاختراق
- التمييز عن الحلول الموجودة

### التوافق الاستراتيجي (15%)
- التوافق مع الأهداف التنظيمية
- الامتثال للسياسات
- دعم أصحاب المصلحة
- الجدوى السياسية

### الجدوى المالية (10%)
- فعالية التكلفة
- العائد على الاستثمار
- توفر التمويل
- قيود الميزانية

## عملية التقييم

1. **الفرز الأولي**: تصفية المشاركات بناءً على المعايير الأساسية
2. **التقييم التفصيلي**: تطبيق إطار التقييم الكامل
3. **مراجعة الخبراء**: تقييم خبراء الموضوع
4. **المشاركة العامة**: تعليقات المجتمع عند الاقتضاء
5. **الاختيار النهائي**: التسجيل والترتيب المرجح

## تخفيف التحيز

- استخدام عدة مقيمين لكل مشاركة
- تنفيذ عمليات المراجعة المجهولة
- توفير تدريب المقيمين
- توثيق مبررات القرار
- تضمين وجهات نظر متنوعة

## التقييم بمساعدة التكنولوجيا

يمكن تعزيز التقييم الحديث بـ:
- اكتشاف التشابه بالذكاء الاصطناعي
- الفرز الأولي الآلي
- تحليل المشاعر للمشاركات
- أدوات تصور البيانات
- منصات التسجيل التعاونية',

'Master advanced evaluation frameworks and methodologies for assessing innovative solutions in government challenges.',
'إتقان أطر ومنهجيات التقييم المتقدمة لتقييم الحلول الابتكارية في التحديات الحكومية.',
'Evaluation', 'advanced', 15, true, true),

('Digital Transformation Roadmap', 'خارطة طريق التحول الرقمي',
'Digital transformation in government requires a strategic approach that balances technological advancement with organizational change management. This roadmap provides a structured path for successful digital transformation initiatives.

## Assessment Phase (Months 1-2)

### Current State Analysis
- Technology infrastructure audit
- Process mapping and analysis
- Stakeholder needs assessment
- Digital maturity evaluation
- Gap analysis and prioritization

### Strategic Planning
- Vision and objectives definition
- Success metrics establishment
- Resource allocation planning
- Timeline development
- Risk assessment and mitigation

## Foundation Phase (Months 3-6)

### Infrastructure Development
- Cloud migration strategy
- Security framework implementation
- Data architecture design
- Integration platform setup
- Performance monitoring tools

### Capacity Building
- Staff training programs
- Change management initiatives
- Digital literacy enhancement
- Leadership development
- Culture transformation

## Implementation Phase (Months 7-18)

### Service Digitization
- Priority service identification
- User experience design
- Agile development approach
- Continuous testing and iteration
- Gradual rollout strategy

### Data and Analytics
- Data governance framework
- Analytics platform implementation
- Dashboard development
- Performance measurement
- Insight generation

## Optimization Phase (Months 19-24)

### Performance Enhancement
- System optimization
- Process refinement
- User feedback integration
- Efficiency improvements
- Scalability planning

### Innovation Integration
- Emerging technology adoption
- AI and automation implementation
- Predictive analytics deployment
- Innovation labs establishment
- Future-proofing strategies

## Success Factors

1. **Leadership Commitment**: Strong executive sponsorship
2. **User-Centric Design**: Focus on citizen and employee needs
3. **Agile Methodology**: Iterative development and deployment
4. **Change Management**: Comprehensive organizational support
5. **Continuous Learning**: Adaptive approach to challenges

## Common Challenges

- Resistance to change
- Legacy system constraints
- Skills and capacity gaps
- Budget limitations
- Security concerns

## Measurement and KPIs

- Service delivery speed
- User satisfaction scores
- Process efficiency gains
- Cost reduction metrics
- Digital adoption rates',

'التحول الرقمي في الحكومة يتطلب نهجاً استراتيجياً يوازن بين التقدم التكنولوجي وإدارة التغيير التنظيمي. توفر خارطة الطريق هذه مساراً منظماً لمبادرات التحول الرقمي الناجحة.

## مرحلة التقييم (الشهران 1-2)

### تحليل الوضع الحالي
- مراجعة البنية التحتية التقنية
- رسم وتحليل العمليات
- تقييم احتياجات أصحاب المصلحة
- تقييم النضج الرقمي
- تحليل الفجوات والأولويات

### التخطيط الاستراتيجي
- تعريف الرؤية والأهداف
- وضع مقاييس النجاح
- تخطيط تخصيص الموارد
- تطوير الجدول الزمني
- تقييم وتخفيف المخاطر

## مرحلة الأسس (الشهور 3-6)

### تطوير البنية التحتية
- استراتيجية الهجرة السحابية
- تنفيذ إطار الأمان
- تصميم هندسة البيانات
- إعداد منصة التكامل
- أدوات مراقبة الأداء

### بناء القدرات
- برامج تدريب الموظفين
- مبادرات إدارة التغيير
- تعزيز المعرفة الرقمية
- تطوير القيادة
- تحويل الثقافة

## مرحلة التنفيذ (الشهور 7-18)

### رقمنة الخدمات
- تحديد الخدمات ذات الأولوية
- تصميم تجربة المستخدم
- نهج التطوير الرشيق
- الاختبار والتكرار المستمر
- استراتيجية الطرح التدريجي

### البيانات والتحليلات
- إطار حوكمة البيانات
- تنفيذ منصة التحليلات
- تطوير لوحات المعلومات
- قياس الأداء
- توليد الرؤى

## مرحلة التحسين (الشهور 19-24)

### تعزيز الأداء
- تحسين النظام
- تحسين العمليات
- دمج تعليقات المستخدمين
- تحسينات الكفاءة
- تخطيط قابلية التوسع

### دمج الابتكار
- اعتماد التقنيات الناشئة
- تنفيذ الذكاء الاصطناعي والأتمتة
- نشر التحليلات التنبؤية
- إنشاء مختبرات الابتكار
- استراتيجيات مقاومة المستقبل

## عوامل النجاح

1. **التزام القيادة**: رعاية تنفيذية قوية
2. **التصميم المتمحور حول المستخدم**: التركيز على احتياجات المواطنين والموظفين
3. **المنهجية الرشيقة**: التطوير والنشر التكراري
4. **إدارة التغيير**: الدعم التنظيمي الشامل
5. **التعلم المستمر**: النهج التكيفي للتحديات

## التحديات الشائعة

- مقاومة التغيير
- قيود الأنظمة القديمة
- فجوات المهارات والقدرات
- قيود الميزانية
- المخاوف الأمنية

## القياس ومؤشرات الأداء الرئيسية

- سرعة تقديم الخدمة
- درجات رضا المستخدمين
- مكاسب كفاءة العمليات
- مقاييس خفض التكلفة
- معدلات اعتماد التقنيات الرقمية',

'A comprehensive roadmap for successful digital transformation in government organizations, covering assessment, implementation, and optimization phases.',
'خارطة طريق شاملة للتحول الرقمي الناجح في المؤسسات الحكومية، تغطي مراحل التقييم والتنفيذ والتحسين.',
'Digital Transformation', 'intermediate', 12, true, false),

('AI Ethics in Government', 'أخلاقيات الذكاء الاصطناعي في الحكومة',
'As artificial intelligence becomes increasingly integrated into government services, establishing ethical frameworks and guidelines becomes crucial for responsible AI deployment.

## Core Ethical Principles

### Transparency and Explainability
Government AI systems must be transparent in their decision-making processes. Citizens have the right to understand how AI influences decisions that affect them.

- Clear documentation of AI system capabilities and limitations
- Explainable AI techniques for complex decisions
- Regular public reporting on AI system performance
- Accessible explanations for non-technical audiences

### Fairness and Non-Discrimination
AI systems must treat all citizens fairly and avoid perpetuating or amplifying existing biases.

- Bias detection and mitigation strategies
- Diverse and representative training data
- Regular fairness audits and assessments
- Inclusive design processes

### Privacy and Data Protection
Protecting citizen privacy while leveraging data for public benefit requires careful balance.

- Data minimization principles
- Purpose limitation for data collection
- Strong security and encryption measures
- Clear consent mechanisms

### Accountability and Responsibility
Clear lines of accountability must exist for AI-driven decisions and outcomes.

- Human oversight requirements
- Appeal and review processes
- Regular auditing and monitoring
- Clear responsibility frameworks

## Implementation Guidelines

### Risk Assessment Framework
- Identify high-risk AI applications
- Conduct thorough impact assessments
- Implement appropriate safeguards
- Regular risk monitoring and updates

### Governance Structures
- AI ethics committees
- Cross-functional review boards
- External advisory panels
- Public consultation processes

### Technical Standards
- Algorithmic impact assessments
- Bias testing requirements
- Performance monitoring standards
- Security and privacy protocols

## Regulatory Compliance

Government AI deployments must comply with existing and emerging regulations:

- Data protection laws
- Anti-discrimination legislation
- Public records requirements
- International AI governance frameworks

## Continuous Monitoring

- Regular algorithm audits
- Performance tracking
- Bias monitoring systems
- Public feedback mechanisms
- Impact assessment updates

## Stakeholder Engagement

Successful AI ethics implementation requires engagement with:

- Citizens and affected communities
- Technical experts and researchers
- Civil society organizations
- International partners
- Industry stakeholders',

'مع دمج الذكاء الاصطناعي بشكل متزايد في الخدمات الحكومية، يصبح وضع الأطر والمبادئ التوجيهية الأخلاقية أمراً بالغ الأهمية للنشر المسؤول للذكاء الاصطناعي.

## المبادئ الأخلاقية الأساسية

### الشفافية وقابلية التفسير
يجب أن تكون أنظمة الذكاء الاصطناعي الحكومية شفافة في عمليات اتخاذ القرار. للمواطنين الحق في فهم كيف يؤثر الذكاء الاصطناعي على القرارات التي تؤثر عليهم.

- توثيق واضح لقدرات وحدود نظام الذكاء الاصطناعي
- تقنيات الذكاء الاصطناعي القابلة للتفسير للقرارات المعقدة
- تقارير عامة منتظمة عن أداء نظام الذكاء الاصطناعي
- تفسيرات ميسرة للجماهير غير التقنية

### العدالة وعدم التمييز
يجب أن تعامل أنظمة الذكاء الاصطناعي جميع المواطنين بإنصاف وتتجنب إدامة أو تضخيم التحيزات الموجودة.

- استراتيجيات اكتشاف وتخفيف التحيز
- بيانات تدريب متنوعة وممثلة
- عمليات تدقيق وتقييم عدالة منتظمة
- عمليات تصميم شاملة

### الخصوصية وحماية البيانات
حماية خصوصية المواطنين مع الاستفادة من البيانات للمنفعة العامة يتطلب توازناً دقيقاً.

- مبادئ تقليل البيانات
- تحديد الغرض لجمع البيانات
- تدابير أمان وتشفير قوية
- آليات موافقة واضحة

### المساءلة والمسؤولية
يجب أن توجد خطوط واضحة للمساءلة عن القرارات والنتائج المدفوعة بالذكاء الاصطناعي.

- متطلبات الإشراف البشري
- عمليات الاستئناف والمراجعة
- التدقيق والمراقبة المنتظمة
- أطر مسؤولية واضحة

## إرشادات التنفيذ

### إطار تقييم المخاطر
- تحديد تطبيقات الذكاء الاصطناعي عالية المخاطر
- إجراء تقييمات تأثير شاملة
- تنفيذ ضمانات مناسبة
- مراقبة وتحديثات المخاطر المنتظمة

### هياكل الحوكمة
- لجان أخلاقيات الذكاء الاصطناعي
- مجالس مراجعة متعددة الوظائف
- لجان استشارية خارجية
- عمليات التشاور العام

### المعايير التقنية
- تقييمات تأثير الخوارزمية
- متطلبات اختبار التحيز
- معايير مراقبة الأداء
- بروتوكولات الأمان والخصوصية

## الامتثال التنظيمي

يجب أن تمتثل عمليات نشر الذكاء الاصطناعي الحكومية للوائح الموجودة والناشئة:

- قوانين حماية البيانات
- تشريعات مكافحة التمييز
- متطلبات السجلات العامة
- أطر الحوكمة الدولية للذكاء الاصطناعي

## المراقبة المستمرة

- عمليات تدقيق الخوارزمية المنتظمة
- تتبع الأداء
- أنظمة مراقبة التحيز
- آليات التعليقات العامة
- تحديثات تقييم التأثير

## إشراك أصحاب المصلحة

يتطلب التنفيذ الناجح لأخلاقيات الذكاء الاصطناعي إشراك:

- المواطنين والمجتمعات المتأثرة
- الخبراء التقنيين والباحثين
- منظمات المجتمع المدني
- الشركاء الدوليين
- أصحاب المصلحة في الصناعة',

'Essential guidelines for implementing ethical AI frameworks in government services, ensuring responsible and fair AI deployment.',
'مبادئ توجيهية أساسية لتنفيذ أطر الذكاء الاصطناعي الأخلاقية في الخدمات الحكومية، لضمان النشر المسؤول والعادل للذكاء الاصطناعي.',
'AI Ethics', 'advanced', 18, true, true);

-- Tag the media content and knowledge base articles
INSERT INTO public.media_content_tags (media_id, tag_id, added_by) 
SELECT mc.id, t.id, NULL
FROM media_content mc, tags t
WHERE (mc.title LIKE '%Innovation%' AND t.name_en = 'Innovation')
   OR (mc.title LIKE '%Digital%' AND t.name_en = 'Digital Transformation')
   OR (mc.title LIKE '%AI%' AND t.name_en = 'Artificial Intelligence')
   OR (mc.title LIKE '%Government%' AND t.name_en = 'Government')
   OR (mc.content_type = 'podcast' AND t.name_en = 'Technology')
   OR (mc.content_type = 'webinar' AND t.name_en = 'Education')
   OR (mc.organization LIKE '%رؤية%' AND t.name_en = 'Vision 2030');

INSERT INTO public.knowledge_base_tags (article_id, tag_id, added_by)
SELECT kb.id, t.id, NULL
FROM knowledge_base kb, tags t
WHERE (kb.title LIKE '%Challenge%' AND t.name_en = 'Innovation')
   OR (kb.title LIKE '%Evaluation%' AND t.name_en = 'Evaluation')
   OR (kb.title LIKE '%Digital%' AND t.name_en = 'Digital Transformation')
   OR (kb.title LIKE '%AI%' AND t.name_en = 'Artificial Intelligence')
   OR (kb.category = 'Innovation Management' AND t.name_en = 'Management')
   OR (kb.difficulty_level = 'advanced' AND t.name_en = 'Advanced');