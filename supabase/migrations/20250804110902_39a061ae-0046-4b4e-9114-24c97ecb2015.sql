-- Create the views and complete tag system setup after fixing tag table structure

-- First, check and fix tags table if needed
DO $$
BEGIN
  -- Add missing columns to tags table if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'name') THEN
    ALTER TABLE public.tags ADD COLUMN name VARCHAR(100) NOT NULL DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'name_ar') THEN
    ALTER TABLE public.tags ADD COLUMN name_ar VARCHAR(100) NOT NULL DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'description') THEN
    ALTER TABLE public.tags ADD COLUMN description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'description_ar') THEN
    ALTER TABLE public.tags ADD COLUMN description_ar TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'category') THEN
    ALTER TABLE public.tags ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'general';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'color') THEN
    ALTER TABLE public.tags ADD COLUMN color VARCHAR(7) NOT NULL DEFAULT '#3B82F6';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'is_system') THEN
    ALTER TABLE public.tags ADD COLUMN is_system BOOLEAN NOT NULL DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tags' AND column_name = 'usage_count') THEN
    ALTER TABLE public.tags ADD COLUMN usage_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create comprehensive views for improved performance
CREATE OR REPLACE VIEW public.challenges_with_details AS
SELECT 
  c.*,
  COUNT(DISTINCT cp.id) as participant_count,
  COUNT(DISTINCT cs.id) as submission_count,
  COUNT(DISTINCT cc.id) as comment_count,
  COUNT(DISTINCT ct.id) as tag_count,
  ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  s.name as sector_name,
  s.name_ar as sector_name_ar,
  d.name as department_name,
  d.name_ar as department_name_ar,
  dep.name as deputy_name,
  dep.name_ar as deputy_name_ar
FROM public.challenges c
LEFT JOIN public.challenge_participants cp ON c.id = cp.challenge_id AND cp.status = 'active'
LEFT JOIN public.challenge_submissions cs ON c.id = cs.challenge_id
LEFT JOIN public.challenge_comments cc ON c.id = cc.challenge_id
LEFT JOIN public.challenge_tags ct ON c.id = ct.challenge_id
LEFT JOIN public.tags t ON ct.tag_id = t.id
LEFT JOIN public.sectors s ON c.sector_id = s.id
LEFT JOIN public.departments d ON c.department_id = d.id
LEFT JOIN public.deputies dep ON c.deputy_id = dep.id
GROUP BY c.id, s.id, s.name, s.name_ar, d.id, d.name, d.name_ar, dep.id, dep.name, dep.name_ar;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_challenge_tags_challenge_id ON public.challenge_tags(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_tags_tag_id ON public.challenge_tags(tag_id);

-- Insert seed data for tags if table is empty
INSERT INTO public.tags (name, name_ar, description, description_ar, category, color, is_system)
SELECT * FROM (VALUES
  ('Technology', 'تقنية', 'Technology-related content', 'محتوى متعلق بالتقنية', 'technology', '#3B82F6', false),
  ('Innovation', 'ابتكار', 'Innovation and creativity', 'الابتكار والإبداع', 'theme', '#10B981', false),
  ('Healthcare', 'صحة', 'Healthcare and medical', 'الرعاية الصحية والطبية', 'sector', '#EF4444', false),
  ('Education', 'تعليم', 'Education and learning', 'التعليم والتعلم', 'sector', '#F59E0B', false),
  ('Finance', 'مالية', 'Financial services', 'الخدمات المالية', 'sector', '#8B5CF6', false),
  ('Sustainability', 'استدامة', 'Environmental sustainability', 'الاستدامة البيئية', 'theme', '#059669', false),
  ('Digital Transformation', 'تحول رقمي', 'Digital transformation initiatives', 'مبادرات التحول الرقمي', 'technology', '#6366F1', false),
  ('Artificial Intelligence', 'ذكاء اصطناعي', 'AI and machine learning', 'الذكاء الاصطناعي والتعلم الآلي', 'technology', '#EC4899', false),
  ('Blockchain', 'بلوك تشين', 'Blockchain technology', 'تقنية البلوك تشين', 'technology', '#F97316', false),
  ('IoT', 'إنترنت الأشياء', 'Internet of Things', 'إنترنت الأشياء', 'technology', '#06B6D4', false),
  ('Research', 'بحث', 'Research and development', 'البحث والتطوير', 'theme', '#84CC16', false),
  ('Startup', 'شركة ناشئة', 'Startup and entrepreneurship', 'الشركات الناشئة وريادة الأعمال', 'theme', '#F43F5E', false)
) AS new_tags(name, name_ar, description, description_ar, category, color, is_system)
ON CONFLICT (name, category) DO NOTHING;