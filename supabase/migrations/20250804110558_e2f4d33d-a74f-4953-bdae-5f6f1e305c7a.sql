-- Phase 4 Completion: Enhanced Tag System and Many-to-Many Relations
-- Adding missing tables to tag system and improving relationships

-- First, let's add missing tag relationships for all entities
DO $$
BEGIN
  -- Add tag support for ideas if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_tags') THEN
    CREATE TABLE public.idea_tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      idea_id UUID NOT NULL,
      tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
      added_by UUID REFERENCES auth.users(id),
      added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      UNIQUE(idea_id, tag_id)
    );
    
    ALTER TABLE public.idea_tags ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Everyone can view idea tags" ON public.idea_tags FOR SELECT USING (true);
    CREATE POLICY "Users can manage idea tags" ON public.idea_tags FOR ALL 
    USING (
      EXISTS (
        SELECT 1 FROM public.ideas i 
        WHERE i.id = idea_tags.idea_id AND i.innovator_id IN (
          SELECT id FROM public.innovators WHERE user_id = auth.uid()
        )
      ) OR 
      EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid()) OR 
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;

  -- Add tag support for opportunities if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'opportunity_tags') THEN
    CREATE TABLE public.opportunity_tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      opportunity_id UUID NOT NULL,
      tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
      added_by UUID REFERENCES auth.users(id),
      added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      UNIQUE(opportunity_id, tag_id)
    );
    
    ALTER TABLE public.opportunity_tags ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Everyone can view opportunity tags" ON public.opportunity_tags FOR SELECT USING (true);
    CREATE POLICY "Team members can manage opportunity tags" ON public.opportunity_tags FOR ALL 
    USING (
      EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid()) OR 
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;

  -- Add tag support for events if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_tags') THEN
    CREATE TABLE public.event_tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID NOT NULL,
      tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
      added_by UUID REFERENCES auth.users(id),
      added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      UNIQUE(event_id, tag_id)
    );
    
    ALTER TABLE public.event_tags ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Everyone can view event tags" ON public.event_tags FOR SELECT USING (true);
    CREATE POLICY "Team members can manage event tags" ON public.event_tags FOR ALL 
    USING (
      EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid()) OR 
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;

  -- Add support for organization tags (departments, sectors, etc.)
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sector_tags') THEN
    CREATE TABLE public.sector_tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sector_id UUID NOT NULL,
      tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
      added_by UUID REFERENCES auth.users(id),
      added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      UNIQUE(sector_id, tag_id)
    );
    
    ALTER TABLE public.sector_tags ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Everyone can view sector tags" ON public.sector_tags FOR SELECT USING (true);
    CREATE POLICY "Team members can manage sector tags" ON public.sector_tags FOR ALL 
    USING (
      EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid()) OR 
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;

  -- Add department tags
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'department_tags') THEN
    CREATE TABLE public.department_tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      department_id UUID NOT NULL,
      tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
      added_by UUID REFERENCES auth.users(id),
      added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      UNIQUE(department_id, tag_id)
    );
    
    ALTER TABLE public.department_tags ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Everyone can view department tags" ON public.department_tags FOR SELECT USING (true);
    CREATE POLICY "Team members can manage department tags" ON public.department_tags FOR ALL 
    USING (
      EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid()) OR 
      has_role(auth.uid(), 'admin'::app_role)
    );
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

-- Create events with details view
CREATE OR REPLACE VIEW public.events_with_details AS
SELECT 
  e.*,
  COUNT(DISTINCT ep.id) as participant_count,
  COUNT(DISTINCT ef.id) as feedback_count,
  COUNT(DISTINCT et.id) as tag_count,
  ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  s.name as sector_name,
  s.name_ar as sector_name_ar
FROM public.events e
LEFT JOIN public.event_participants ep ON e.id = ep.event_id
LEFT JOIN public.event_feedback ef ON e.id = ef.event_id
LEFT JOIN public.event_tags et ON e.id = et.event_id
LEFT JOIN public.tags t ON et.tag_id = t.id
LEFT JOIN public.sectors s ON e.sector_id = s.id
GROUP BY e.id, s.id, s.name, s.name_ar;

-- Create campaigns with details view
CREATE OR REPLACE VIEW public.campaigns_with_details AS
SELECT 
  c.*,
  COUNT(DISTINCT ct.id) as tag_count,
  ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  s.name as sector_name,
  s.name_ar as sector_name_ar,
  d.name as department_name,
  d.name_ar as department_name_ar,
  dep.name as deputy_name,
  dep.name_ar as deputy_name_ar
FROM public.campaigns c
LEFT JOIN public.campaign_tags ct ON c.id = ct.campaign_id
LEFT JOIN public.tags t ON ct.tag_id = t.id
LEFT JOIN public.sectors s ON c.sector_id = s.id
LEFT JOIN public.departments d ON c.department_id = d.id
LEFT JOIN public.deputies dep ON c.deputy_id = dep.id
GROUP BY c.id, s.id, s.name, s.name_ar, d.id, d.name, d.name_ar, dep.id, dep.name, dep.name_ar;

-- Create opportunities with details view  
CREATE OR REPLACE VIEW public.opportunities_with_details AS
SELECT 
  o.*,
  COUNT(DISTINCT oa.id) as application_count,
  COUNT(DISTINCT ol.id) as like_count,
  COUNT(DISTINCT ot.id) as tag_count,
  ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  s.name as sector_name,
  s.name_ar as sector_name_ar
FROM public.opportunities o
LEFT JOIN public.opportunity_applications oa ON o.id = oa.opportunity_id
LEFT JOIN public.opportunity_likes ol ON o.id = ol.opportunity_id
LEFT JOIN public.opportunity_tags ot ON o.id = ot.opportunity_id
LEFT JOIN public.tags t ON ot.tag_id = t.id
LEFT JOIN public.sectors s ON o.sector_id = s.id
GROUP BY o.id, s.id, s.name, s.name_ar;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_challenge_tags_challenge_id ON public.challenge_tags(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_tags_tag_id ON public.challenge_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_event_tags_event_id ON public.event_tags(event_id);
CREATE INDEX IF NOT EXISTS idx_event_tags_tag_id ON public.event_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_campaign_tags_campaign_id ON public.campaign_tags(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_tags_tag_id ON public.campaign_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_tags_opportunity_id ON public.opportunity_tags(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_tags_tag_id ON public.opportunity_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_idea_tags_idea_id ON public.idea_tags(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_tags_tag_id ON public.idea_tags(tag_id);

-- Insert seed data for tags if tables are empty
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
WHERE NOT EXISTS (SELECT 1 FROM public.tags LIMIT 1);