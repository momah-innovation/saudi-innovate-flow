-- Add more sample partnership opportunities (check for existing first)
INSERT INTO partnership_opportunities (
  title_ar, title_en, description_ar, description_en, opportunity_type, 
  budget_min, budget_max, deadline, contact_person, contact_email, status,
  requirements, benefits, sector_id
) 
SELECT * FROM (VALUES 
  (
    'تطوير حلول إنترنت الأشياء للصناعة',
    'Industrial IoT Solutions Development',
    'فرصة شراكة لتطوير وتنفيذ حلول إنترنت الأشياء المتقدمة للقطاع الصناعي',
    'Partnership opportunity to develop and implement advanced IoT solutions for industrial sector',
    'collaboration',
    600000, 1200000,
    '2024-12-15'::date,
    'م. خالد الأحمد',
    'khalid.ahmad@mcit.gov.sa',
    'open',
    '{"arabic": "خبرة في تطوير حلول إنترنت الأشياء، شهادات الأمان الصناعي", "english": "IoT development expertise, industrial security certifications"}'::jsonb,
    '{"efficiency": "تحسين الكفاءة التشغيلية", "cost_savings": "توفير التكاليف", "scale": "تطبيق على نطاق واسع"}'::jsonb,
    '1b264813-966e-4734-8266-7be9d0508f73'::uuid
  ),
  (
    'برنامج الشراكة في الأمن السيبراني',
    'Cybersecurity Partnership Program',
    'شراكة استراتيجية لتعزيز الأمن السيبراني في القطاع الحكومي',
    'Strategic partnership to enhance cybersecurity in government sector',
    'sponsorship',
    800000, 1500000,
    '2024-11-30'::date,
    'د. ريم النمر',
    'reem.alnamir@ncsc.gov.sa',
    'open',
    '{"arabic": "خبرة في الأمن السيبراني، شهادات دولية معتمدة", "english": "Cybersecurity expertise, certified international credentials"}'::jsonb,
    '{"security": "تعزيز الأمان الرقمي", "reputation": "سمعة حكومية قوية", "growth": "فرص نمو في القطاع الأمني"}'::jsonb,
    '2b264813-966e-4734-8266-7be9d0508f74'::uuid
  ),
  (
    'مبادرة التحول الرقمي للمدن',
    'Digital Transformation for Cities Initiative',
    'برنامج شامل للتحول الرقمي يهدف إلى تطوير المدن الذكية',
    'Comprehensive digital transformation program aimed at developing smart cities',
    'funding',
    1000000, 2000000,
    '2025-01-20'::date,
    'م. عبدالعزيز الخالدي',
    'abdulaziz.alkhalidi@momra.gov.sa',
    'open',
    '{"arabic": "خبرة في تطوير المدن الذكية، محفظة مشاريع ناجحة", "english": "Smart cities development expertise, successful project portfolio"}'::jsonb,
    '{"impact": "تأثير واسع على المجتمع", "visibility": "ظهور إعلامي قوي", "expansion": "فرص توسع إقليمية"}'::jsonb,
    '3b264813-966e-4734-8266-7be9d0508f75'::uuid
  )
) AS v(title_ar, title_en, description_ar, description_en, opportunity_type, budget_min, budget_max, deadline, contact_person, contact_email, status, requirements, benefits, sector_id)
WHERE NOT EXISTS (
  SELECT 1 FROM partnership_opportunities po WHERE po.title_ar = v.title_ar
);

-- Add opportunity bookmarks table
CREATE TABLE IF NOT EXISTS opportunity_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES partnership_opportunities(id) ON DELETE CASCADE,
  notes TEXT,
  priority VARCHAR(10) DEFAULT 'medium',
  reminder_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

-- Enable RLS on opportunity_bookmarks
ALTER TABLE opportunity_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for opportunity bookmarks (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'opportunity_bookmarks' 
    AND policyname = 'Users can manage their own opportunity bookmarks'
  ) THEN
    CREATE POLICY "Users can manage their own opportunity bookmarks" ON opportunity_bookmarks
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;