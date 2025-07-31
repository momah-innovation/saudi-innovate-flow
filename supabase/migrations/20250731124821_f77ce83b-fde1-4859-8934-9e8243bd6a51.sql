-- Seed partnership opportunities with realistic data
INSERT INTO partnership_opportunities (
  title_ar, title_en, description_ar, description_en, opportunity_type, 
  budget_min, budget_max, deadline, status, requirements_ar, requirements_en,
  benefits, contact_person, contact_email, sector_id, department_id, created_at
) VALUES 

-- Digital Transformation Opportunities
(
  'رعاية تحدي الذكاء الاصطناعي في الحكومة', 
  'AI in Government Challenge Sponsorship',
  'فرصة رعاية تحدي الذكاء الاصطناعي لتطوير حلول ذكية للخدمات الحكومية',
  'Opportunity to sponsor AI challenge for developing smart government services',
  'sponsorship',
  500000, 1000000,
  '2024-12-31',
  'open',
  'خبرة في تقنيات الذكاء الاصطناعي، التزام مالي لمدة 12 شهر',
  'AI technology expertise, 12-month financial commitment',
  '{"visibility": "High brand exposure", "networking": "Access to top innovators", "impact": "Contribute to digital transformation"}',
  'د. أحمد السعيد',
  'ahmed.alsaeed@mci.gov.sa',
  '1b264813-966e-4734-8266-7be9d0508f73',
  NULL,
  NOW()
),

-- Healthcare Innovation
(
  'شراكة تطوير منصة الصحة الرقمية',
  'Digital Health Platform Partnership',
  'تعاون استراتيجي لتطوير منصة متكاملة للخدمات الصحية الرقمية',
  'Strategic collaboration to develop integrated digital health services platform',
  'collaboration',
  750000, 1500000,
  '2024-11-15',
  'open',
  'خبرة في الحلول الصحية الرقمية، شهادات الأمان المطلوبة',
  'Digital health solutions expertise, required security certifications',
  '{"market_access": "Access to healthcare sector", "innovation": "Co-innovation opportunities", "scale": "National implementation potential"}',
  'د. فاطمة المالكي',
  'fatima.almalki@moh.gov.sa',
  '2b264813-966e-4734-8266-7be9d0508f74',
  NULL,
  NOW()
),

-- Smart Cities
(
  'تمويل مبادرة المدن الذكية المستدامة',
  'Sustainable Smart Cities Initiative Funding',
  'فرصة تمويل مشاريع البنية التحتية الذكية للمدن المستدامة',
  'Funding opportunity for smart infrastructure projects in sustainable cities',
  'funding',
  300000, 800000,
  '2024-10-30',
  'open',
  'خبرة في تقنيات المدن الذكية، محفظة مشاريع سابقة',
  'Smart city technologies expertise, portfolio of previous projects',
  '{"pilot_projects": "Pilot implementation opportunities", "scale": "Multi-city deployment", "recognition": "Government partnership recognition"}',
  'م. عبدالله الشهري',
  'abdullah.alshahri@momra.gov.sa',
  '3b264813-966e-4734-8266-7be9d0508f75',
  NULL,
  NOW()
),

-- Education Technology
(
  'شراكة برنامج التعليم التفاعلي',
  'Interactive Education Program Partnership',
  'تطوير منصات تعليمية تفاعلية باستخدام التقنيات الحديثة',
  'Develop interactive educational platforms using modern technologies',
  'collaboration',
  400000, 900000,
  '2024-09-20',
  'open',
  'تجربة في تطوير المنصات التعليمية، دعم فني مستمر',
  'Educational platform development experience, ongoing technical support',
  '{"education_impact": "Impact millions of students", "innovation": "Educational innovation leadership", "expansion": "Regional expansion opportunities"}',
  'د. نورا القحطاني',
  'nora.alqahtani@moe.gov.sa',
  '1b264813-966e-4734-8266-7be9d0508f73',
  NULL,
  NOW()
),

-- Research & Development
(
  'دعم مختبر الابتكار التقني',
  'Tech Innovation Lab Support',
  'رعاية مختبر للبحث والتطوير في التقنيات الناشئة',
  'Sponsor research and development lab for emerging technologies',
  'research',
  200000, 600000,
  '2024-08-15',
  'open',
  'استثمار في البحث والتطوير، شراكة أكاديمية',
  'R&D investment commitment, academic partnership',
  '{"research_access": "Access to cutting-edge research", "talent": "Access to top researchers", "ip": "Intellectual property opportunities"}',
  'د. محمد الدوسري',
  'mohammed.aldosari@kacst.edu.sa',
  '1b264813-966e-4734-8266-7be9d0508f73',
  NULL,
  NOW()
),

-- Environmental Technology
(
  'تمويل حلول الطاقة المتجددة',
  'Renewable Energy Solutions Funding',
  'دعم مالي لتطوير تقنيات الطاقة المتجددة والحلول البيئية',
  'Financial support for renewable energy technologies and environmental solutions',
  'funding',
  600000, 1200000,
  '2024-12-01',
  'open',
  'خبرة في تقنيات الطاقة المتجددة، التزام بيئي',
  'Renewable energy technology expertise, environmental commitment',
  '{"sustainability": "Environmental impact", "market": "Growing renewable market", "support": "Government policy support"}',
  'م. سعد الغامدي',
  'saad.alghamdi@energy.gov.sa',
  '1b264813-966e-4734-8266-7be9d0508f73',
  NULL,
  NOW()
);

-- Insert sample partnership analytics data
INSERT INTO partnership_analytics (
  partner_id, metric_name, metric_value, period_start, period_end, 
  category, metadata, recorded_by
) VALUES
-- Sample analytics for different partners
(
  '8066cfaf-4a91-4985-922b-74f6a286c441', -- Current user as example partner
  'total_investment',
  750000,
  '2024-01-01',
  '2024-06-30',
  'financial',
  '{"currency": "SAR", "projects_count": 3}',
  '8066cfaf-4a91-4985-922b-74f6a286c441'
),
(
  '8066cfaf-4a91-4985-922b-74f6a286c441',
  'partnership_score',
  85,
  '2024-01-01',
  '2024-06-30',
  'performance',
  '{"satisfaction_rating": 4.5, "delivery_rating": 4.2}',
  '8066cfaf-4a91-4985-922b-74f6a286c441'
);