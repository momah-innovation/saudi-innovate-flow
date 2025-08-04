-- Phase 1: Complete foundation setup with proper schema handling
-- Check if columns exist before adding them and seed with existing structure

-- Check if description_ar column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sectors' AND column_name = 'description_ar') THEN
        ALTER TABLE sectors ADD COLUMN description_ar TEXT;
    END IF;
END $$;

-- Check if description_ar column exists in departments
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'departments' AND column_name = 'description_ar') THEN
        ALTER TABLE departments ADD COLUMN description_ar TEXT;
    END IF;
END $$;

-- Check if description_ar column exists in deputies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'deputies' AND column_name = 'description_ar') THEN
        ALTER TABLE deputies ADD COLUMN description_ar TEXT;
    END IF;
END $$;

-- Seed essential organizational data with existing structure
INSERT INTO sectors (name, name_ar, description, vision_2030_alignment) VALUES
('Technology', 'التقنية', 'Technology and Innovation Sector', 'Supporting digital transformation and innovation in line with Vision 2030'),
('Healthcare', 'الصحة', 'Healthcare Sector', 'Improving healthcare quality and accessibility'),
('Education', 'التعليم', 'Education Sector', 'Transforming education to meet future needs'),
('Finance', 'المالية', 'Financial Sector', 'Enhancing financial services and fintech innovation'),
('Energy', 'الطاقة', 'Energy Sector', 'Promoting renewable energy and sustainability'),
('Transportation', 'النقل', 'Transportation Sector', 'Building smart and sustainable transportation systems'),
('Environment', 'البيئة', 'Environmental Sector', 'Protecting environment and promoting sustainability'),
('Tourism', 'السياحة', 'Tourism Sector', 'Developing tourism infrastructure and experiences')
ON CONFLICT (name) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  vision_2030_alignment = EXCLUDED.vision_2030_alignment;

INSERT INTO deputies (name, name_ar, deputy_minister, contact_email) VALUES
('Digital Transformation', 'التحول الرقمي', 'Dr. Ahmed Al-Rashid', 'digital@gov.sa'),
('Innovation & Development', 'الابتكار والتطوير', 'Dr. Sarah Al-Otaibi', 'innovation@gov.sa'),
('Strategic Planning', 'التخطيط الاستراتيجي', 'Eng. Mohammed Al-Zahrani', 'planning@gov.sa'),
('Public Services', 'الخدمات العامة', 'Dr. Fatima Al-Mansouri', 'services@gov.sa')
ON CONFLICT (name) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  deputy_minister = EXCLUDED.deputy_minister,
  contact_email = EXCLUDED.contact_email;

INSERT INTO departments (name, name_ar, department_head, budget_allocation) VALUES
('Information Technology', 'تقنية المعلومات', 'Eng. Khalid Al-Harbi', 50000000),
('Data Analytics', 'تحليل البيانات', 'Dr. Nora Al-Ghamdi', 30000000),
('Cybersecurity', 'الأمن السيبراني', 'Maj. Omar Al-Shehri', 40000000),
('Digital Services', 'الخدمات الرقمية', 'Ms. Reem Al-Dosari', 35000000),
('AI & Machine Learning', 'الذكاء الاصطناعي والتعلم الآلي', 'Dr. Yasser Al-Mutairi', 45000000)
ON CONFLICT (name) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  department_head = EXCLUDED.department_head,
  budget_allocation = EXCLUDED.budget_allocation;

-- Seed sample challenges with realistic data
INSERT INTO challenges (
  title_ar, description_ar, challenge_type, priority_level, 
  status, estimated_budget, start_date, end_date, created_by
) VALUES
('تطوير منصة الخدمات الحكومية الموحدة', 
 'تطوير منصة رقمية موحدة تتيح للمواطنين والمقيمين الوصول إلى جميع الخدمات الحكومية من مكان واحد بطريقة سهلة وآمنة',
 'digital_transformation', 'high', 'active', 25000000, 
 CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months', 
 (SELECT id FROM auth.users LIMIT 1)),
 
('نظام ذكي لإدارة المرور', 
 'تطوير نظام ذكي يستخدم الذكاء الاصطناعي وإنترنت الأشياء لتحسين تدفق المرور وتقليل الازدحام في المدن الكبرى',
 'smart_cities', 'high', 'active', 15000000,
 CURRENT_DATE, CURRENT_DATE + INTERVAL '8 months', 
 (SELECT id FROM auth.users LIMIT 1)),
 
('منصة التعليم الإلكتروني التفاعلي', 
 'إنشاء منصة تعليمية تفاعلية تدعم التعلم عن بُعد وتوفر تجربة تعليمية متطورة للطلاب في جميع المراحل',
 'education', 'medium', 'planning', 12000000,
 CURRENT_DATE + INTERVAL '1 month', CURRENT_DATE + INTERVAL '10 months', 
 (SELECT id FROM auth.users LIMIT 1));

-- Seed sample ideas
INSERT INTO ideas (
  title_ar, description_ar, status, challenge_id, innovator_id
) VALUES
('تطبيق ذكي للمواعيد الطبية', 
 'تطبيق محمول يتيح حجز المواعيد الطبية، متابعة التقارير الطبية، وتلقي تذكيرات بالمواعيد والأدوية',
 'submitted', 
 (SELECT id FROM challenges WHERE title_ar LIKE '%منصة الخدمات%' LIMIT 1),
 (SELECT id FROM innovators LIMIT 1)),
 
('نظام مراقبة جودة الهواء', 
 'شبكة من أجهزة الاستشعار الذكية لمراقبة جودة الهواء في الوقت الفعلي وتقديم تقارير للجمهور',
 'under_review', 
 (SELECT id FROM challenges WHERE title_ar LIKE '%نظام ذكي%' LIMIT 1),
 (SELECT id FROM innovators LIMIT 1));

-- Create sample events
INSERT INTO events (
  title_ar, description_ar, event_type, format, 
  event_date, registration_deadline, max_participants, status
) VALUES
('هاكاثون الابتكار الحكومي 2024', 
 'مسابقة تقنية مدتها 48 ساعة لتطوير حلول مبتكرة للتحديات الحكومية',
 'hackathon', 'hybrid', 
 CURRENT_DATE + INTERVAL '2 months', CURRENT_DATE + INTERVAL '1 month', 200, 'upcoming'),
 
('ورشة عمل: الذكاء الاصطناعي في الخدمات العامة', 
 'ورشة تدريبية متخصصة حول تطبيقات الذكاء الاصطناعي في تحسين الخدمات الحكومية',
 'workshop', 'in_person', 
 CURRENT_DATE + INTERVAL '3 weeks', CURRENT_DATE + INTERVAL '2 weeks', 50, 'registration_open'),
 
('مؤتمر التحول الرقمي', 
 'مؤتمر سنوي يجمع خبراء التقنية وصناع القرار لمناقشة مستقبل التحول الرقمي',
 'conference', 'virtual', 
 CURRENT_DATE + INTERVAL '4 months', CURRENT_DATE + INTERVAL '3 months', 500, 'planning');