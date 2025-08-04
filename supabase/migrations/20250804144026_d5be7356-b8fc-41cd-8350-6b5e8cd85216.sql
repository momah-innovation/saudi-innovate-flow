-- Phase 1: Simple data seeding without conflicts
-- Use INSERT WHERE NOT EXISTS pattern for safety

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sectors' AND column_name = 'description_ar') THEN
        ALTER TABLE sectors ADD COLUMN description_ar TEXT;
    END IF;
END $$;

-- Seed sectors safely
INSERT INTO sectors (name, name_ar, description, vision_2030_alignment)
SELECT 'Technology', 'التقنية', 'Technology and Innovation Sector', 'Supporting digital transformation and innovation in line with Vision 2030'
WHERE NOT EXISTS (SELECT 1 FROM sectors WHERE name = 'Technology');

INSERT INTO sectors (name, name_ar, description, vision_2030_alignment)
SELECT 'Healthcare', 'الصحة', 'Healthcare Sector', 'Improving healthcare quality and accessibility'
WHERE NOT EXISTS (SELECT 1 FROM sectors WHERE name = 'Healthcare');

INSERT INTO sectors (name, name_ar, description, vision_2030_alignment)
SELECT 'Education', 'التعليم', 'Education Sector', 'Transforming education to meet future needs'
WHERE NOT EXISTS (SELECT 1 FROM sectors WHERE name = 'Education');

INSERT INTO sectors (name, name_ar, description, vision_2030_alignment)
SELECT 'Finance', 'المالية', 'Financial Sector', 'Enhancing financial services and fintech innovation'
WHERE NOT EXISTS (SELECT 1 FROM sectors WHERE name = 'Finance');

-- Seed deputies safely
INSERT INTO deputies (name, name_ar, deputy_minister, contact_email)
SELECT 'Digital Transformation', 'التحول الرقمي', 'Dr. Ahmed Al-Rashid', 'digital@gov.sa'
WHERE NOT EXISTS (SELECT 1 FROM deputies WHERE name = 'Digital Transformation');

INSERT INTO deputies (name, name_ar, deputy_minister, contact_email)
SELECT 'Innovation & Development', 'الابتكار والتطوير', 'Dr. Sarah Al-Otaibi', 'innovation@gov.sa'
WHERE NOT EXISTS (SELECT 1 FROM deputies WHERE name = 'Innovation & Development');

-- Seed departments safely
INSERT INTO departments (name, name_ar, department_head, budget_allocation)
SELECT 'Information Technology', 'تقنية المعلومات', 'Eng. Khalid Al-Harbi', 50000000
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Information Technology');

INSERT INTO departments (name, name_ar, department_head, budget_allocation)
SELECT 'Data Analytics', 'تحليل البيانات', 'Dr. Nora Al-Ghamdi', 30000000
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Data Analytics');