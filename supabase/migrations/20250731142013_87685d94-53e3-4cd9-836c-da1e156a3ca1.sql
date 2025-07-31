-- Create opportunity management tables (avoiding trigger conflicts)

-- Create opportunity categories table
CREATE TABLE IF NOT EXISTS public.opportunity_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description_ar TEXT,
  description_en TEXT,
  icon VARCHAR(50) DEFAULT 'folder',
  color VARCHAR(20) DEFAULT '#3B82F6',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create opportunity applications table
CREATE TABLE IF NOT EXISTS public.opportunity_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  applicant_id UUID NOT NULL,
  application_type VARCHAR(50) DEFAULT 'individual',
  organization_name VARCHAR(255),
  contact_person VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  proposal_summary TEXT,
  expected_budget NUMERIC,
  timeline_months INTEGER,
  team_size INTEGER,
  relevant_experience TEXT,
  attachment_urls TEXT[],
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create opportunity likes table
CREATE TABLE IF NOT EXISTS public.opportunity_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(opportunity_id, user_id)
);

-- Create opportunity comments table  
CREATE TABLE IF NOT EXISTS public.opportunity_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  user_id UUID NOT NULL,
  parent_comment_id UUID,
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create opportunity analytics table
CREATE TABLE IF NOT EXISTS public.opportunity_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  recorded_by UUID
);

-- Add new fields to partnership_opportunities
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'category_id') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN category_id UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'image_url') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN image_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'requirements') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN requirements JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'benefits') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN benefits JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'priority_level') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN priority_level VARCHAR(20) DEFAULT 'medium';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'visibility') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN visibility VARCHAR(20) DEFAULT 'public';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'location') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN location VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'target_audience') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN target_audience JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'success_metrics') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN success_metrics TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'created_by') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN created_by UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'partnership_opportunities' 
                 AND column_name = 'manager_id') THEN
    ALTER TABLE public.partnership_opportunities ADD COLUMN manager_id UUID;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.opportunity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.opportunity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for opportunity_categories
CREATE POLICY "Users can view active categories" ON public.opportunity_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Team members can manage categories" ON public.opportunity_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policies for opportunity_applications
CREATE POLICY "Users can view their own applications" ON public.opportunity_applications
  FOR SELECT USING (applicant_id = auth.uid());

CREATE POLICY "Users can create applications" ON public.opportunity_applications
  FOR INSERT WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Users can update their own applications" ON public.opportunity_applications
  FOR UPDATE USING (applicant_id = auth.uid());

CREATE POLICY "Team members can manage all applications" ON public.opportunity_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policies for opportunity_likes
CREATE POLICY "Users can manage their own likes" ON public.opportunity_likes
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view likes count" ON public.opportunity_likes
  FOR SELECT USING (true);

-- RLS Policies for opportunity_comments
CREATE POLICY "Users can view public comments" ON public.opportunity_comments
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create comments" ON public.opportunity_comments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own comments" ON public.opportunity_comments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Team members can manage all comments" ON public.opportunity_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policies for opportunity_analytics
CREATE POLICY "Team members can manage analytics" ON public.opportunity_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Insert sample opportunity categories
INSERT INTO public.opportunity_categories (name_ar, name_en, description_ar, description_en, icon, color, sort_order) VALUES
('الرعاية والتمويل', 'Sponsorship & Funding', 'فرص الرعاية والدعم المالي للمشاريع والمبادرات', 'Sponsorship and financial support opportunities for projects and initiatives', 'dollar-sign', '#10B981', 1),
('التعاون والشراكة', 'Collaboration & Partnership', 'فرص التعاون المؤسسي والشراكات الاستراتيجية', 'Institutional collaboration and strategic partnership opportunities', 'handshake', '#3B82F6', 2),
('البحث والتطوير', 'Research & Development', 'فرص البحث العلمي والتطوير التقني', 'Scientific research and technical development opportunities', 'microscope', '#8B5CF6', 3),
('التدريب والتأهيل', 'Training & Development', 'برامج التدريب وتطوير القدرات', 'Training programs and capacity development', 'graduation-cap', '#F59E0B', 4),
('الاستشارات والخدمات', 'Consulting & Services', 'فرص تقديم الاستشارات والخدمات المتخصصة', 'Consulting and specialized services opportunities', 'briefcase', '#EF4444', 5);