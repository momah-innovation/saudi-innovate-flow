-- Phase 1: Ensure all tables have proper tag system support
-- Add missing tag relationships for all major entities

-- Create comprehensive tag relationships for all entities
CREATE TABLE IF NOT EXISTS public.department_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(department_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.deputy_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deputy_id UUID NOT NULL REFERENCES deputies(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(deputy_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.sector_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(sector_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.service_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(service_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.domain_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(domain_id, tag_id)
);

-- Create performance optimization views
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
  ) as tags,
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
  ) as tags,
  COALESCE(COUNT(DISTINCT il.id), 0) as likes_count,
  COALESCE(COUNT(DISTINCT ic.id), 0) as comments_count
FROM ideas i
LEFT JOIN idea_tag_links itl ON i.id = itl.idea_id
LEFT JOIN tags t ON itl.tag_id = t.id
LEFT JOIN idea_likes il ON i.id = il.idea_id
LEFT JOIN idea_comments ic ON i.id = ic.idea_id
GROUP BY i.id;

-- Enable RLS on new tag tables
ALTER TABLE public.department_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deputy_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tag tables
CREATE POLICY "Everyone can view tag relationships" ON public.department_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage department tags" ON public.department_tags 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Everyone can view deputy tags" ON public.deputy_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage deputy tags" ON public.deputy_tags 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Everyone can view sector tags" ON public.sector_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage sector tags" ON public.sector_tags 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Everyone can view service tags" ON public.service_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage service tags" ON public.service_tags 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Everyone can view domain tags" ON public.domain_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage domain tags" ON public.domain_tags 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Seed comprehensive tag data with English names and proper i18n support
INSERT INTO tags (name_ar, name_en, color, category, icon, is_system) VALUES
-- Technology Tags
('تقنية المعلومات', 'Information Technology', '#3B82F6', 'technology', 'laptop', true),
('الذكاء الاصطناعي', 'Artificial Intelligence', '#8B5CF6', 'technology', 'cpu', true),
('البيانات الضخمة', 'Big Data', '#059669', 'technology', 'database', true),
('الحوسبة السحابية', 'Cloud Computing', '#06B6D4', 'technology', 'cloud', true),
('إنترنت الأشياء', 'Internet of Things', '#F59E0B', 'technology', 'wifi', true),
('البلوك تشين', 'Blockchain', '#EF4444', 'technology', 'shield', true),
('الأمن السيبراني', 'Cybersecurity', '#DC2626', 'security', 'shield-check', true),
('التطبيقات المحمولة', 'Mobile Applications', '#10B981', 'technology', 'smartphone', true),

-- Domain Tags
('الصحة', 'Healthcare', '#EC4899', 'domain', 'heart', true),
('التعليم', 'Education', '#6366F1', 'domain', 'graduation-cap', true),
('النقل', 'Transportation', '#F97316', 'domain', 'car', true),
('البيئة', 'Environment', '#22C55E', 'domain', 'leaf', true),
('الطاقة', 'Energy', '#EAB308', 'domain', 'zap', true),
('المالية', 'Finance', '#3B82F6', 'domain', 'dollar-sign', true),
('الزراعة', 'Agriculture', '#84CC16', 'domain', 'sprout', true),
('السياحة', 'Tourism', '#06B6D4', 'domain', 'map-pin', true),

-- Process Tags
('التطوير', 'Development', '#8B5CF6', 'process', 'code', true),
('البحث', 'Research', '#059669', 'process', 'search', true),
('التصميم', 'Design', '#EC4899', 'process', 'palette', true),
('الاختبار', 'Testing', '#F59E0B', 'process', 'check-circle', true),
('التطبيق', 'Implementation', '#EF4444', 'process', 'play', true),
('التقييم', 'Evaluation', '#6366F1', 'process', 'star', true),

-- Priority Tags
('عالي الأولوية', 'High Priority', '#DC2626', 'priority', 'alert-triangle', true),
('متوسط الأولوية', 'Medium Priority', '#F59E0B', 'priority', 'alert-circle', true),
('منخفض الأولوية', 'Low Priority', '#22C55E', 'priority', 'info', true),
('طارئ', 'Urgent', '#7C2D12', 'priority', 'zap', true),

-- Status Tags
('نشط', 'Active', '#22C55E', 'status', 'play-circle', true),
('مكتمل', 'Completed', '#059669', 'status', 'check-circle', true),
('معلق', 'Pending', '#F59E0B', 'status', 'clock', true),
('مؤجل', 'Delayed', '#EF4444', 'status', 'pause-circle', true),
('مسودة', 'Draft', '#6B7280', 'status', 'edit', true),

-- Vision 2030 Tags
('رؤية 2030', 'Vision 2030', '#1E40AF', 'vision2030', 'flag', true),
('التحول الرقمي', 'Digital Transformation', '#7C3AED', 'vision2030', 'smartphone', true),
('الاقتصاد الرقمي', 'Digital Economy', '#059669', 'vision2030', 'trending-up', true),
('جودة الحياة', 'Quality of Life', '#EC4899', 'vision2030', 'heart', true),
('الاستدامة', 'Sustainability', '#22C55E', 'vision2030', 'leaf', true)

ON CONFLICT (name_ar) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  color = EXCLUDED.color,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  is_system = EXCLUDED.is_system;