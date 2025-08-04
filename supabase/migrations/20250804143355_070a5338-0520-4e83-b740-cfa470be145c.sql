-- Phase 1: Fix the view creation and continue with infrastructure setup
-- Remove existing views and recreate without column conflicts

DROP VIEW IF EXISTS public.v_comprehensive_challenges;
DROP VIEW IF EXISTS public.v_comprehensive_ideas;

-- Create performance optimization views with proper column aliasing
CREATE OR REPLACE VIEW public.v_comprehensive_challenges AS
SELECT 
  c.*,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', t.id,
        'name_ar', t.name_ar,
        'name_en', t.name_en,
        'color', t.color,
        'category', t.category
      )
    ) FILTER (WHERE t.id IS NOT NULL), 
    '[]'::json
  ) as challenge_tags,
  COALESCE(COUNT(DISTINCT cp.id), 0) as participants_count,
  COALESCE(COUNT(DISTINCT cs.id), 0) as submissions_count
FROM challenges c
LEFT JOIN challenge_tags ct ON c.id = ct.challenge_id
LEFT JOIN tags t ON ct.tag_id = t.id
LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id
LEFT JOIN challenge_submissions cs ON c.id = cs.challenge_id
GROUP BY c.id;

CREATE OR REPLACE VIEW public.v_comprehensive_ideas AS
SELECT 
  i.*,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', t.id,
        'name_ar', t.name_ar,
        'name_en', t.name_en,
        'color', t.color,
        'category', t.category
      )
    ) FILTER (WHERE t.id IS NOT NULL), 
    '[]'::json
  ) as idea_tags,
  COALESCE(COUNT(DISTINCT il.id), 0) as likes_count,
  COALESCE(COUNT(DISTINCT ic.id), 0) as comments_count
FROM ideas i
LEFT JOIN idea_tag_links itl ON i.id = itl.idea_id
LEFT JOIN tags t ON itl.tag_id = t.id
LEFT JOIN idea_likes il ON i.id = il.idea_id
LEFT JOIN idea_comments ic ON i.id = ic.idea_id
GROUP BY i.id;

-- Seed essential organizational data
INSERT INTO sectors (name, name_ar, description, description_ar) VALUES
('Technology', 'التقنية', 'Technology and Innovation Sector', 'قطاع التقنية والابتكار'),
('Healthcare', 'الصحة', 'Healthcare Sector', 'قطاع الصحة'),
('Education', 'التعليم', 'Education Sector', 'قطاع التعليم'),
('Finance', 'المالية', 'Financial Sector', 'القطاع المالي'),
('Energy', 'الطاقة', 'Energy Sector', 'قطاع الطاقة'),
('Transportation', 'النقل', 'Transportation Sector', 'قطاع النقل'),
('Environment', 'البيئة', 'Environmental Sector', 'قطاع البيئة'),
('Tourism', 'السياحة', 'Tourism Sector', 'قطاع السياحة')
ON CONFLICT (name) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar;

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