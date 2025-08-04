-- Phase 3: Comprehensive Tag System Implementation
-- Adding tag system support to all major tables with many-to-many relationships

-- Create tags table for centralized tag management
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description_en TEXT,
  description_ar TEXT,
  color VARCHAR(7) DEFAULT '#6366F1',
  icon VARCHAR(50) DEFAULT 'tag',
  category VARCHAR(50) DEFAULT 'general',
  is_system BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tags
CREATE POLICY "Everyone can view active tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Team members can manage tags" ON public.tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Create junction tables for many-to-many tag relationships

-- Challenge tags
CREATE TABLE IF NOT EXISTS public.challenge_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, tag_id)
);

-- Event tags
CREATE TABLE IF NOT EXISTS public.event_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, tag_id)
);

-- Campaign tags
CREATE TABLE IF NOT EXISTS public.campaign_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, tag_id)
);

-- Opportunity tags
CREATE TABLE IF NOT EXISTS public.opportunity_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(opportunity_id, tag_id)
);

-- Idea tags
CREATE TABLE IF NOT EXISTS public.idea_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, tag_id)
);

-- Partner tags
CREATE TABLE IF NOT EXISTS public.partner_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(partner_id, tag_id)
);

-- Stakeholder tags
CREATE TABLE IF NOT EXISTS public.stakeholder_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stakeholder_id UUID NOT NULL REFERENCES stakeholders(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(stakeholder_id, tag_id)
);

-- Innovation Success Story tags
CREATE TABLE IF NOT EXISTS public.innovation_success_story_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES innovation_success_stories(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, tag_id)
);

-- User profile tags for skills and interests
CREATE TABLE IF NOT EXISTS public.user_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  tag_type VARCHAR(20) DEFAULT 'skill' CHECK (tag_type IN ('skill', 'interest', 'expertise', 'certification')),
  proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tag_id, tag_type)
);

-- Enable RLS on all tag junction tables
ALTER TABLE public.challenge_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_success_story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tag junction tables (similar pattern for all)
CREATE POLICY "Everyone can view tag relationships" ON public.challenge_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage challenge tags" ON public.challenge_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Everyone can view event tags" ON public.event_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage event tags" ON public.event_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Everyone can view campaign tags" ON public.campaign_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage campaign tags" ON public.campaign_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Everyone can view opportunity tags" ON public.opportunity_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage opportunity tags" ON public.opportunity_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Everyone can view idea tags" ON public.idea_tags FOR SELECT USING (true);
CREATE POLICY "Users can manage their idea tags" ON public.idea_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM ideas i WHERE i.id = idea_tags.idea_id AND i.innovator_id IN (
      SELECT id FROM innovators WHERE user_id = auth.uid()
    )) OR
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Everyone can view partner tags" ON public.partner_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage partner tags" ON public.partner_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Everyone can view stakeholder tags" ON public.stakeholder_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage stakeholder tags" ON public.stakeholder_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Everyone can view success story tags" ON public.innovation_success_story_tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage success story tags" ON public.innovation_success_story_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Users can view their own profile tags" ON public.user_tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own profile tags" ON public.user_tags
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_category ON public.tags(category);
CREATE INDEX IF NOT EXISTS idx_tags_usage_count ON public.tags(usage_count DESC);

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

CREATE INDEX IF NOT EXISTS idx_partner_tags_partner_id ON public.partner_tags(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tags_tag_id ON public.partner_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_stakeholder_tags_stakeholder_id ON public.stakeholder_tags(stakeholder_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_tags_tag_id ON public.stakeholder_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_user_tags_user_id ON public.user_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_tag_id ON public.user_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_type ON public.user_tags(tag_type);

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags 
    SET usage_count = usage_count + 1,
        updated_at = NOW()
    WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tags 
    SET usage_count = GREATEST(usage_count - 1, 0),
        updated_at = NOW()
    WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically update tag usage counts
CREATE OR REPLACE TRIGGER trigger_update_tag_usage_challenge_tags
  AFTER INSERT OR DELETE ON public.challenge_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

CREATE OR REPLACE TRIGGER trigger_update_tag_usage_event_tags
  AFTER INSERT OR DELETE ON public.event_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

CREATE OR REPLACE TRIGGER trigger_update_tag_usage_campaign_tags
  AFTER INSERT OR DELETE ON public.campaign_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

CREATE OR REPLACE TRIGGER trigger_update_tag_usage_opportunity_tags
  AFTER INSERT OR DELETE ON public.opportunity_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

CREATE OR REPLACE TRIGGER trigger_update_tag_usage_idea_tags
  AFTER INSERT OR DELETE ON public.idea_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

CREATE OR REPLACE TRIGGER trigger_update_tag_usage_partner_tags
  AFTER INSERT OR DELETE ON public.partner_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

CREATE OR REPLACE TRIGGER trigger_update_tag_usage_stakeholder_tags
  AFTER INSERT OR DELETE ON public.stakeholder_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

CREATE OR REPLACE TRIGGER trigger_update_tag_usage_user_tags
  AFTER INSERT OR DELETE ON public.user_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

-- Insert default system tags for common use cases
INSERT INTO public.tags (name_en, name_ar, slug, description_en, description_ar, category, is_system, color, icon) VALUES
  ('Technology', 'التكنولوجيا', 'technology', 'Technology-related content', 'محتوى متعلق بالتكنولوجيا', 'sector', true, '#3B82F6', 'laptop'),
  ('Innovation', 'الابتكار', 'innovation', 'Innovation and creativity', 'الابتكار والإبداع', 'theme', true, '#10B981', 'lightbulb'),
  ('Artificial Intelligence', 'الذكاء الاصطناعي', 'ai', 'AI and machine learning', 'الذكاء الاصطناعي وتعلم الآلة', 'technology', true, '#8B5CF6', 'brain'),
  ('Sustainability', 'الاستدامة', 'sustainability', 'Environmental sustainability', 'الاستدامة البيئية', 'theme', true, '#059669', 'leaf'),
  ('Healthcare', 'الرعاية الصحية', 'healthcare', 'Healthcare and medical', 'الرعاية الصحية والطبية', 'sector', true, '#DC2626', 'heart'),
  ('Education', 'التعليم', 'education', 'Education and learning', 'التعليم والتعلم', 'sector', true, '#F59E0B', 'graduation-cap'),
  ('Finance', 'المالية', 'finance', 'Financial services', 'الخدمات المالية', 'sector', true, '#7C3AED', 'banknote'),
  ('Energy', 'الطاقة', 'energy', 'Energy and renewable resources', 'الطاقة والموارد المتجددة', 'sector', true, '#EA580C', 'zap'),
  ('Transportation', 'النقل', 'transportation', 'Transportation and mobility', 'النقل والتنقل', 'sector', true, '#0EA5E9', 'car'),
  ('Smart Cities', 'المدن الذكية', 'smart-cities', 'Smart city initiatives', 'مبادرات المدن الذكية', 'theme', true, '#6366F1', 'building'),
  ('Research', 'البحث', 'research', 'Research and development', 'البحث والتطوير', 'type', true, '#84CC16', 'search'),
  ('Prototype', 'النموذج الأولي', 'prototype', 'Prototype development', 'تطوير النموذج الأولي', 'type', true, '#F97316', 'package'),
  ('Pilot Program', 'البرنامج التجريبي', 'pilot-program', 'Pilot program implementation', 'تنفيذ البرنامج التجريبي', 'type', true, '#EC4899', 'rocket'),
  ('High Priority', 'أولوية عالية', 'high-priority', 'High priority items', 'عناصر ذات أولوية عالية', 'priority', true, '#EF4444', 'alert-circle'),
  ('Collaboration', 'التعاون', 'collaboration', 'Collaborative efforts', 'الجهود التعاونية', 'approach', true, '#06B6D4', 'users')
ON CONFLICT (slug) DO NOTHING;

-- Add updated_at trigger for tags table
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();