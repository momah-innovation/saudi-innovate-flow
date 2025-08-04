-- Fix security definer views and add comprehensive tagging system
-- Create performance optimization views

-- 1. Create comprehensive tag system for all entities
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL UNIQUE,
  name_ar VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  color VARCHAR(7) DEFAULT '#3B82F6',
  description_en TEXT,
  description_ar TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Create policy for tags
CREATE POLICY "Everyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Team members can manage tags" ON public.tags FOR ALL 
USING (
  EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active')
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 2. Create optimized views for better performance
CREATE OR REPLACE VIEW public.ideas_with_stats AS
SELECT 
  i.*,
  COALESCE(likes.like_count, 0) as like_count,
  COALESCE(comments.comment_count, 0) as comment_count,
  COALESCE(evaluations.avg_score, 0) as avg_evaluation_score,
  p.name as innovator_name,
  p.profile_image_url as innovator_avatar
FROM ideas i
LEFT JOIN profiles p ON i.innovator_id = p.id
LEFT JOIN (
  SELECT idea_id, COUNT(*) as like_count 
  FROM idea_likes 
  GROUP BY idea_id
) likes ON i.id = likes.idea_id
LEFT JOIN (
  SELECT idea_id, COUNT(*) as comment_count 
  FROM idea_comments 
  GROUP BY idea_id
) comments ON i.id = comments.idea_id
LEFT JOIN (
  SELECT idea_id, AVG((technical_feasibility + financial_viability + market_potential + strategic_alignment + innovation_level) / 5.0) as avg_score
  FROM idea_evaluations 
  GROUP BY idea_id
) evaluations ON i.id = evaluations.idea_id;

CREATE OR REPLACE VIEW public.challenges_with_stats AS
SELECT 
  c.*,
  COALESCE(participants.participant_count, 0) as participant_count,
  COALESCE(submissions.submission_count, 0) as submission_count,
  COALESCE(comments.comment_count, 0) as comment_count,
  p.name as creator_name
FROM challenges c
LEFT JOIN profiles p ON c.created_by = p.id
LEFT JOIN (
  SELECT challenge_id, COUNT(*) as participant_count 
  FROM challenge_participants 
  WHERE status = 'active'
  GROUP BY challenge_id
) participants ON c.id = participants.challenge_id
LEFT JOIN (
  SELECT challenge_id, COUNT(*) as submission_count 
  FROM challenge_submissions 
  WHERE status != 'draft'
  GROUP BY challenge_id
) submissions ON c.id = submissions.challenge_id
LEFT JOIN (
  SELECT challenge_id, COUNT(*) as comment_count 
  FROM challenge_comments 
  GROUP BY challenge_id
) comments ON c.id = comments.challenge_id;

CREATE OR REPLACE VIEW public.events_with_stats AS
SELECT 
  e.*,
  COALESCE(participants.participant_count, 0) as participant_count,
  COALESCE(likes.like_count, 0) as like_count,
  COALESCE(feedback.avg_rating, 0) as avg_rating,
  p.name as manager_name
FROM events e
LEFT JOIN profiles p ON e.event_manager_id = p.id
LEFT JOIN (
  SELECT event_id, COUNT(*) as participant_count 
  FROM event_participants 
  WHERE status = 'confirmed'
  GROUP BY event_id
) participants ON e.id = participants.event_id
LEFT JOIN (
  SELECT event_id, COUNT(*) as like_count 
  FROM event_likes 
  GROUP BY event_id
) likes ON e.id = likes.event_id
LEFT JOIN (
  SELECT event_id, AVG(rating) as avg_rating 
  FROM event_feedback 
  GROUP BY event_id
) feedback ON e.id = feedback.event_id;

-- 3. Add tag support to existing tables (if not already present)
DO $$ 
BEGIN
  -- Add tags column to ideas if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'tags') THEN
    ALTER TABLE ideas ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  
  -- Add tags column to challenges if not exists  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'tags') THEN
    ALTER TABLE challenges ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  
  -- Add tags column to opportunities if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'tags') THEN
    ALTER TABLE opportunities ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  
  -- Add tags column to events if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'tags') THEN
    ALTER TABLE events ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  
  -- Add tags column to partners if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'tags') THEN
    ALTER TABLE partners ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ideas_tags ON ideas USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_challenges_tags ON challenges USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_opportunities_tags ON opportunities USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_events_tags ON events USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_partners_tags ON partners USING gin(tags);

-- 5. Create function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Update usage count for tags
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update tag usage counts
    UPDATE tags 
    SET usage_count = (
      SELECT COUNT(*) FROM (
        SELECT unnest(tags) as tag FROM ideas WHERE tags IS NOT NULL
        UNION ALL
        SELECT unnest(tags) as tag FROM challenges WHERE tags IS NOT NULL
        UNION ALL
        SELECT unnest(tags) as tag FROM opportunities WHERE tags IS NOT NULL
        UNION ALL
        SELECT unnest(tags) as tag FROM events WHERE tags IS NOT NULL
        UNION ALL
        SELECT unnest(tags) as tag FROM partners WHERE tags IS NOT NULL
      ) tag_usage WHERE tag_usage.tag = tags.name_en
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 6. Create triggers for tag usage tracking
DROP TRIGGER IF EXISTS update_tag_usage_ideas ON ideas;
CREATE TRIGGER update_tag_usage_ideas
  AFTER INSERT OR UPDATE OF tags ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage();

DROP TRIGGER IF EXISTS update_tag_usage_challenges ON challenges;
CREATE TRIGGER update_tag_usage_challenges
  AFTER INSERT OR UPDATE OF tags ON challenges
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage();

DROP TRIGGER IF EXISTS update_tag_usage_opportunities ON opportunities;
CREATE TRIGGER update_tag_usage_opportunities
  AFTER INSERT OR UPDATE OF tags ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage();

DROP TRIGGER IF EXISTS update_tag_usage_events ON events;
CREATE TRIGGER update_tag_usage_events
  AFTER INSERT OR UPDATE OF tags ON events
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage();

DROP TRIGGER IF EXISTS update_tag_usage_partners ON partners;
CREATE TRIGGER update_tag_usage_partners
  AFTER INSERT OR UPDATE OF tags ON partners
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage();

-- 7. Populate tags with common innovation and government tags
INSERT INTO tags (name_en, name_ar, category, color, description_en, description_ar) VALUES
-- Technology Tags
('artificial-intelligence', 'الذكاء الاصطناعي', 'technology', '#8B5CF6', 'Artificial Intelligence and Machine Learning', 'الذكاء الاصطناعي والتعلم الآلي'),
('blockchain', 'البلوك تشين', 'technology', '#10B981', 'Blockchain and Distributed Ledger Technology', 'تقنية البلوك تشين والدفاتر الموزعة'),
('iot', 'إنترنت الأشياء', 'technology', '#F59E0B', 'Internet of Things', 'إنترنت الأشياء'),
('cloud-computing', 'الحوسبة السحابية', 'technology', '#3B82F6', 'Cloud Computing and Infrastructure', 'الحوسبة السحابية والبنية التحتية'),
('cybersecurity', 'الأمن السيبراني', 'technology', '#EF4444', 'Cybersecurity and Data Protection', 'الأمن السيبراني وحماية البيانات'),
('big-data', 'البيانات الضخمة', 'technology', '#8B5CF6', 'Big Data Analytics', 'تحليل البيانات الضخمة'),
('mobile-apps', 'التطبيقات المحمولة', 'technology', '#06B6D4', 'Mobile Applications', 'التطبيقات المحمولة'),

-- Government Sectors
('health', 'الصحة', 'sector', '#10B981', 'Healthcare and Medical Services', 'الرعاية الصحية والخدمات الطبية'),
('education', 'التعليم', 'sector', '#3B82F6', 'Education and Learning', 'التعليم والتعلم'),
('transportation', 'النقل', 'sector', '#F59E0B', 'Transportation and Mobility', 'النقل والتنقل'),
('finance', 'المالية', 'sector', '#10B981', 'Finance and Economic Services', 'الخدمات المالية والاقتصادية'),
('energy', 'الطاقة', 'sector', '#EF4444', 'Energy and Utilities', 'الطاقة والمرافق'),
('agriculture', 'الزراعة', 'sector', '#22C55E', 'Agriculture and Food Security', 'الزراعة والأمن الغذائي'),
('environment', 'البيئة', 'sector', '#22C55E', 'Environment and Sustainability', 'البيئة والاستدامة'),

-- Vision 2030 Themes
('vision-2030', 'رؤية 2030', 'vision', '#8B5CF6', 'Saudi Vision 2030 Initiative', 'مبادرة رؤية السعودية 2030'),
('digital-transformation', 'التحول الرقمي', 'vision', '#3B82F6', 'Digital Transformation', 'التحول الرقمي'),
('smart-cities', 'المدن الذكية', 'vision', '#06B6D4', 'Smart Cities Development', 'تطوير المدن الذكية'),
('economic-diversification', 'التنويع الاقتصادي', 'vision', '#F59E0B', 'Economic Diversification', 'التنويع الاقتصادي'),
('quality-of-life', 'جودة الحياة', 'vision', '#10B981', 'Quality of Life Improvement', 'تحسين جودة الحياة'),
('sustainability', 'الاستدامة', 'vision', '#22C55E', 'Environmental Sustainability', 'الاستدامة البيئية'),

-- Innovation Categories
('innovation', 'الابتكار', 'category', '#8B5CF6', 'Innovation and Creativity', 'الابتكار والإبداع'),
('entrepreneurship', 'ريادة الأعمال', 'category', '#F59E0B', 'Entrepreneurship and Startups', 'ريادة الأعمال والشركات الناشئة'),
('research', 'البحث', 'category', '#3B82F6', 'Research and Development', 'البحث والتطوير'),
('collaboration', 'التعاون', 'category', '#10B981', 'Collaboration and Partnerships', 'التعاون والشراكات'),
('efficiency', 'الكفاءة', 'category', '#06B6D4', 'Efficiency and Optimization', 'الكفاءة والتحسين'),
('citizen-services', 'خدمات المواطن', 'category', '#EF4444', 'Citizen Services', 'خدمات المواطن')

ON CONFLICT (name_en) DO NOTHING;