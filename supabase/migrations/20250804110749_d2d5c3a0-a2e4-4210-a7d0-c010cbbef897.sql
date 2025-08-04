-- Fixed Phase 4 Completion: Enhanced Tag System and Many-to-Many Relations
-- First create the tags table if it doesn't exist

DO $$
BEGIN
  -- Create tags table if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tags') THEN
    CREATE TABLE public.tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      name_ar VARCHAR(100) NOT NULL,
      description TEXT,
      description_ar TEXT,
      category VARCHAR(50) NOT NULL DEFAULT 'general',
      color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
      is_system BOOLEAN NOT NULL DEFAULT false,
      usage_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      created_by UUID REFERENCES auth.users(id),
      UNIQUE(name, category),
      UNIQUE(name_ar, category)
    );
    
    ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Everyone can view tags" ON public.tags FOR SELECT USING (true);
    CREATE POLICY "Team members can manage tags" ON public.tags FOR ALL 
    USING (
      EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid()) OR 
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;

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
END $$;

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
WHERE NOT EXISTS (SELECT 1 FROM public.tags LIMIT 1);