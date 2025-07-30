-- Create idea bookmarks table
CREATE TABLE IF NOT EXISTS public.idea_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  idea_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

-- Create idea likes table
CREATE TABLE IF NOT EXISTS public.idea_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  idea_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

-- Create idea analytics table
CREATE TABLE IF NOT EXISTS public.idea_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC NOT NULL,
  recorded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(idea_id, metric_name)
);

-- Create idea notifications table
CREATE TABLE IF NOT EXISTS public.idea_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  sender_id UUID,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create idea templates table
CREATE TABLE IF NOT EXISTS public.idea_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  template_data JSONB NOT NULL DEFAULT '{}',
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.idea_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON public.idea_bookmarks;
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.idea_likes;
DROP POLICY IF EXISTS "Anyone can view likes count" ON public.idea_likes;
DROP POLICY IF EXISTS "Team members can manage analytics" ON public.idea_analytics;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.idea_notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.idea_notifications;
DROP POLICY IF EXISTS "Anyone can view active templates" ON public.idea_templates;
DROP POLICY IF EXISTS "Admins can manage templates" ON public.idea_templates;

-- Create RLS policies for idea_bookmarks
CREATE POLICY "Users can manage their own bookmarks" ON public.idea_bookmarks
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for idea_likes
CREATE POLICY "Users can manage their own likes" ON public.idea_likes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes count" ON public.idea_likes
  FOR SELECT USING (true);

-- Create RLS policies for idea_analytics
CREATE POLICY "Team members can manage analytics" ON public.idea_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Create RLS policies for idea_notifications
CREATE POLICY "Users can view their own notifications" ON public.idea_notifications
  FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.idea_notifications
  FOR UPDATE USING (recipient_id = auth.uid());

-- Create RLS policies for idea_templates
CREATE POLICY "Anyone can view active templates" ON public.idea_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage templates" ON public.idea_templates
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add image_url column to ideas table if it doesn't exist
ALTER TABLE public.ideas 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_idea_bookmarks_user_id ON public.idea_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_idea_likes_idea_id ON public.idea_likes(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_analytics_idea_id ON public.idea_analytics(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_notifications_recipient_id ON public.idea_notifications(recipient_id);

-- Insert seed data for idea templates
INSERT INTO public.idea_templates (name, name_ar, description, description_ar, template_data, category) VALUES
('Business Innovation', 'ابتكار الأعمال', 'Template for business innovation ideas', 'قالب لأفكار ابتكار الأعمال', 
 '{"sections": ["business_model", "market_analysis", "competitive_advantage"]}', 'business'),
('Technology Solution', 'الحل التقني', 'Template for technology-based solutions', 'قالب للحلول التقنية',
 '{"sections": ["technical_specs", "implementation", "scalability"]}', 'technology'),
('Social Impact', 'التأثير الاجتماعي', 'Template for social impact initiatives', 'قالب لمبادرات التأثير الاجتماعي',
 '{"sections": ["social_problem", "target_audience", "impact_measurement"]}', 'social'),
('Environmental Solution', 'الحل البيئي', 'Template for environmental initiatives', 'قالب للمبادرات البيئية',
 '{"sections": ["environmental_impact", "sustainability", "green_technology"]}', 'environment')
ON CONFLICT DO NOTHING;