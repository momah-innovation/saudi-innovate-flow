-- Create missing tables for enhanced Ideas page

-- Create idea_templates table
CREATE TABLE IF NOT EXISTS public.idea_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'general',
  template_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create idea_bookmarks table
CREATE TABLE IF NOT EXISTS public.idea_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  idea_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

-- Create idea_likes table  
CREATE TABLE IF NOT EXISTS public.idea_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  idea_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

-- Create idea_comments table
CREATE TABLE IF NOT EXISTS public.idea_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  comment_type VARCHAR(50) DEFAULT 'general',
  is_internal BOOLEAN DEFAULT false,
  parent_comment_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create idea_analytics table
CREATE TABLE IF NOT EXISTS public.idea_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC,
  recorded_by UUID,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(idea_id, metric_name, recorded_at)
);

-- Add new columns to ideas table if they don't exist
ALTER TABLE public.ideas 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS feasibility_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS impact_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS innovation_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS alignment_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS overall_score NUMERIC DEFAULT 0;

-- Enable RLS on all tables
ALTER TABLE public.idea_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for idea_templates
CREATE POLICY "Anyone can view active templates" ON public.idea_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage templates" ON public.idea_templates
  FOR ALL USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Create RLS policies for idea_bookmarks
CREATE POLICY "Users can manage their own bookmarks" ON public.idea_bookmarks
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for idea_likes  
CREATE POLICY "Anyone can view idea likes" ON public.idea_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON public.idea_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own likes" ON public.idea_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for idea_comments
CREATE POLICY "Anyone can view public comments" ON public.idea_comments
  FOR SELECT USING (is_internal = false OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can add comments" ON public.idea_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON public.idea_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON public.idea_comments
  FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for idea_analytics
CREATE POLICY "Team members can view analytics" ON public.idea_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "System can manage analytics" ON public.idea_analytics
  FOR ALL USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_idea_templates_updated_at
  BEFORE UPDATE ON public.idea_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_idea_comments_updated_at
  BEFORE UPDATE ON public.idea_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for idea templates
INSERT INTO public.idea_templates (name, name_ar, description, description_ar, category, template_data) VALUES
('Technology Innovation', 'الابتكار التقني', 'Template for technology-based innovation ideas', 'قالب للأفكار الابتكارية التقنية', 'technology', '{"sections":["problem","solution","technology","implementation","impact"]}'::jsonb),
('Process Improvement', 'تحسين العمليات', 'Template for process optimization ideas', 'قالب لأفكار تحسين العمليات', 'process', '{"sections":["current_process","problems","proposed_solution","benefits","implementation_plan"]}'::jsonb),
('Digital Transformation', 'التحول الرقمي', 'Template for digital transformation initiatives', 'قالب لمبادرات التحول الرقمي', 'digital', '{"sections":["current_state","digital_vision","technologies","roadmap","expected_outcomes"]}'::jsonb),
('Sustainability Initiative', 'مبادرة الاستدامة', 'Template for environmental and sustainability ideas', 'قالب للأفكار البيئية والاستدامة', 'sustainability', '{"sections":["environmental_impact","solution","sustainability_metrics","implementation","long_term_benefits"]}'::jsonb),
('Customer Experience', 'تجربة العملاء', 'Template for customer experience improvement ideas', 'قالب لأفكار تحسين تجربة العملاء', 'customer', '{"sections":["current_experience","pain_points","proposed_solution","customer_benefits","success_metrics"]}'::jsonb);

-- Insert sample placeholder images for ideas that don't have images
UPDATE public.ideas 
SET image_url = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop'
WHERE image_url IS NULL AND random() > 0.5;

UPDATE public.ideas 
SET image_url = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop'
WHERE image_url IS NULL AND random() > 0.7;

UPDATE public.ideas 
SET image_url = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'
WHERE image_url IS NULL;

-- Update ideas with random scores and engagement metrics
UPDATE public.ideas SET
  feasibility_score = (random() * 4 + 6)::numeric(3,1),
  impact_score = (random() * 4 + 6)::numeric(3,1),
  innovation_score = (random() * 4 + 6)::numeric(3,1),
  alignment_score = (random() * 4 + 6)::numeric(3,1),
  view_count = floor(random() * 500 + 10)::integer,
  like_count = floor(random() * 50 + 1)::integer,
  comment_count = floor(random() * 20 + 1)::integer,
  featured = (random() > 0.8);

-- Calculate overall scores
UPDATE public.ideas SET
  overall_score = ((feasibility_score + impact_score + innovation_score + alignment_score) / 4)::numeric(3,1);

-- Add some sample comments for existing ideas
INSERT INTO public.idea_comments (idea_id, author_id, content, comment_type)
SELECT 
  i.id,
  (SELECT id FROM auth.users ORDER BY random() LIMIT 1),
  CASE (random() * 5)::integer
    WHEN 0 THEN 'هذه فكرة ممتازة! أعتقد أن لها إمكانية كبيرة للتطبيق.'
    WHEN 1 THEN 'مقترح رائع، لكن نحتاج لمزيد من التفاصيل حول التنفيذ.'
    WHEN 2 THEN 'أحب هذا المفهوم، كيف يمكن قياس النجاح؟'
    WHEN 3 THEN 'فكرة مبتكرة جداً، ما هي التحديات المتوقعة؟'
    ELSE 'مثير للاهتمام، هل يمكن تطبيقها على نطاق أوسع؟'
  END,
  'general'
FROM public.ideas i
WHERE random() > 0.7
LIMIT 50;