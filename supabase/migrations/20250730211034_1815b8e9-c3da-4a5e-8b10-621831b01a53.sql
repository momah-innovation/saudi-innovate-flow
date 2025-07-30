-- Create comprehensive dashboard tables and seed data

-- Dashboard analytics table
CREATE TABLE IF NOT EXISTS public.dashboard_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  metric_name VARCHAR NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_category VARCHAR DEFAULT 'general',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- User achievements table for gamification
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  achievement_type VARCHAR NOT NULL,
  achievement_name_ar VARCHAR NOT NULL,
  achievement_name_en VARCHAR NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  points_earned INTEGER DEFAULT 0,
  badge_icon VARCHAR,
  badge_color VARCHAR DEFAULT '#3B82F6',
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Dashboard notifications table
CREATE TABLE IF NOT EXISTS public.dashboard_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title_ar VARCHAR NOT NULL,
  title_en VARCHAR NOT NULL,
  message_ar TEXT NOT NULL,
  message_en TEXT NOT NULL,
  type VARCHAR DEFAULT 'info', -- info, success, warning, error
  priority VARCHAR DEFAULT 'normal', -- high, normal, low
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Innovation trends table
CREATE TABLE IF NOT EXISTS public.innovation_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trend_name_ar VARCHAR NOT NULL,
  trend_name_en VARCHAR NOT NULL,
  trend_category VARCHAR NOT NULL,
  growth_percentage NUMERIC,
  current_value NUMERIC,
  previous_value NUMERIC,
  trend_direction VARCHAR DEFAULT 'stable', -- up, down, stable
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Dashboard widgets table for personalization
CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  widget_type VARCHAR NOT NULL,
  widget_position INTEGER DEFAULT 0,
  widget_size VARCHAR DEFAULT 'medium', -- small, medium, large
  is_visible BOOLEAN DEFAULT true,
  widget_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dashboard_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own analytics" ON public.dashboard_analytics
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements" ON public.user_achievements
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notifications" ON public.dashboard_notifications
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view innovation trends" ON public.innovation_trends
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own widgets" ON public.dashboard_widgets
FOR ALL USING (auth.uid() = user_id);

-- Seed data
INSERT INTO public.innovation_trends (trend_name_ar, trend_name_en, trend_category, growth_percentage, current_value, previous_value, trend_direction, period_start, period_end) VALUES
('الذكاء الاصطناعي', 'Artificial Intelligence', 'technology', 45.2, 245, 169, 'up', '2024-01-01', '2024-01-31'),
('إنترنت الأشياء', 'Internet of Things', 'technology', 32.8, 189, 142, 'up', '2024-01-01', '2024-01-31'),
('البلوك تشين', 'Blockchain', 'technology', -12.3, 76, 87, 'down', '2024-01-01', '2024-01-31'),
('الحوسبة السحابية', 'Cloud Computing', 'infrastructure', 28.7, 312, 242, 'up', '2024-01-01', '2024-01-31'),
('المدن الذكية', 'Smart Cities', 'urban', 23.4, 156, 126, 'up', '2024-01-01', '2024-01-31'),
('الطاقة المتجددة', 'Renewable Energy', 'energy', 19.8, 203, 169, 'up', '2024-01-01', '2024-01-31'),
('الأمن السيبراني', 'Cybersecurity', 'security', 41.2, 298, 211, 'up', '2024-01-01', '2024-01-31'),
('التعلم الآلي', 'Machine Learning', 'technology', 38.6, 267, 193, 'up', '2024-01-01', '2024-01-31');

-- Sample achievements
INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name_ar, achievement_name_en, description_ar, description_en, points_earned, badge_icon, badge_color) 
SELECT 
  u.id,
  'first_idea',
  'أول فكرة',
  'First Idea',
  'تم تقديم أول فكرة ابتكارية',
  'Submitted your first innovative idea',
  100,
  'lightbulb',
  '#10B981'
FROM auth.users u
WHERE EXISTS (SELECT 1 FROM ideas WHERE innovator_id IN (SELECT id FROM innovators WHERE user_id = u.id))
ON CONFLICT DO NOTHING;

-- Sample notifications
INSERT INTO public.dashboard_notifications (user_id, title_ar, title_en, message_ar, message_en, type, priority)
SELECT 
  u.id,
  'مرحباً بك في لوحة القيادة',
  'Welcome to Dashboard',
  'نرحب بك في لوحة القيادة الجديدة والمحسنة للابتكار',
  'Welcome to the new and improved innovation dashboard',
  'info',
  'normal'
FROM auth.users u
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dashboard_analytics_user_metric ON public.dashboard_analytics(user_id, metric_name);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_type ON public.user_achievements(user_id, achievement_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_notifications_user_read ON public.dashboard_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_innovation_trends_category ON public.innovation_trends(trend_category);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_user_position ON public.dashboard_widgets(user_id, widget_position);

-- Function to calculate user dashboard stats
CREATE OR REPLACE FUNCTION public.calculate_user_dashboard_stats(target_user_id UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
  idea_count INTEGER;
  challenge_count INTEGER;
  event_count INTEGER;
  achievement_points INTEGER;
  innovation_score NUMERIC;
BEGIN
  -- Get idea count
  SELECT COUNT(*) INTO idea_count
  FROM ideas i
  JOIN innovators inn ON i.innovator_id = inn.id
  WHERE inn.user_id = target_user_id;
  
  -- Get challenge participation count
  SELECT COUNT(DISTINCT cp.challenge_id) INTO challenge_count
  FROM challenge_participants cp
  WHERE cp.user_id = target_user_id;
  
  -- Get event participation count
  SELECT COUNT(*) INTO event_count
  FROM event_participants ep
  WHERE ep.user_id = target_user_id;
  
  -- Get total achievement points
  SELECT COALESCE(SUM(points_earned), 0) INTO achievement_points
  FROM user_achievements
  WHERE user_id = target_user_id;
  
  -- Calculate innovation score (weighted average)
  innovation_score := (idea_count * 0.4 + challenge_count * 0.3 + event_count * 0.2 + (achievement_points / 100) * 0.1);
  
  stats := json_build_object(
    'idea_count', idea_count,
    'challenge_count', challenge_count,
    'event_count', event_count,
    'achievement_points', achievement_points,
    'innovation_score', ROUND(innovation_score, 1),
    'calculated_at', now()
  );
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;