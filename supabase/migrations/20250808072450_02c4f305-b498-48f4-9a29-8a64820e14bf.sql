-- Add App.tsx public page translations (new keys only)
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- About page
('page.about_title', 'About Ruwad Platform', 'حول منصة رواد', 'pages'),
('page.about_description', 'Ruwad Platform is the leading government innovation platform in the Kingdom of Saudi Arabia, aimed at accelerating digital transformation and achieving Vision 2030 goals.', 'منصة رواد هي منصة الابتكار الحكومي الرائدة في المملكة العربية السعودية، تهدف إلى تسريع التحول الرقمي وتحقيق أهداف رؤية 2030.', 'pages'),
('page.our_vision_title', 'Our Vision', 'رؤيتنا', 'pages'),
('page.our_vision_description', 'To be the leading platform in enabling government innovation and developing innovative solutions that serve citizens and residents.', 'أن نكون المنصة الرائدة في تمكين الابتكار الحكومي وتطوير الحلول المبتكرة التي تخدم المواطنين والمقيمين.', 'pages'),
('page.our_mission_title', 'Our Mission', 'مهمتنا', 'pages'),
('page.our_mission_description', 'Facilitating collaboration between government entities, the private sector, and innovators to find innovative solutions to government challenges.', 'تسهيل التعاون بين الجهات الحكومية والقطاع الخاص والمبتكرين لإيجاد حلول مبتكرة للتحديات الحكومية.', 'pages'),

-- Campaigns page
('page.campaigns_title', 'Innovation Campaigns', 'حملات الابتكار', 'pages'),
('page.campaigns_description', 'Explore ongoing innovation campaigns across different government sectors.', 'استكشف الحملات الجارية للابتكار عبر القطاعات الحكومية المختلفة.', 'pages'),
('campaign.digital_transformation', 'Digital Transformation', 'التحول الرقمي', 'campaigns'),
('campaign.digital_transformation_desc', 'Initiatives to accelerate digital transformation in government services', 'مبادرات لتسريع التحول الرقمي في الخدمات الحكومية', 'campaigns'),
('campaign.smart_cities', 'Smart Cities', 'المدن الذكية', 'campaigns'),
('campaign.smart_cities_desc', 'Innovative solutions for developing smart and sustainable cities', 'حلول مبتكرة لتطوير المدن الذكية والمستدامة', 'campaigns'),
('campaign.artificial_intelligence', 'Artificial Intelligence', 'الذكاء الاصطناعي', 'campaigns'),
('campaign.artificial_intelligence_desc', 'AI applications in public services', 'تطبيقات الذكاء الاصطناعي في الخدمات العامة', 'campaigns'),

-- Innovation marketplace
('page.marketplace_title', 'Innovation Marketplace', 'سوق الابتكار', 'pages'),
('page.marketplace_description', 'Discover innovation opportunities and partnerships in the government sector.', 'اكتشف الفرص والشراكات الابتكارية في القطاع الحكومي.', 'pages'),
('marketplace.available_opportunities', 'Available Opportunities', 'الفرص المتاحة', 'marketplace'),
('marketplace.partnerships', 'Partnerships', 'الشراكات', 'marketplace');