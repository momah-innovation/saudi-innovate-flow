-- Landing Page Content Management Tables
-- FAQ Section with bilingual support
CREATE TABLE public.landing_page_faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_en TEXT NOT NULL,
  question_ar TEXT,
  answer_en TEXT NOT NULL,
  answer_ar TEXT,
  order_sequence INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  category VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Public Statistics for Landing Page (anonymized metrics)
CREATE TABLE public.public_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL UNIQUE,
  metric_value INTEGER NOT NULL DEFAULT 0,
  metric_description_en TEXT,
  metric_description_ar TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  icon_name VARCHAR(50),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Landing Page Content Sections (for "How It Works", etc.)
CREATE TABLE public.landing_page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key VARCHAR(100) NOT NULL UNIQUE,
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  content_en TEXT NOT NULL,
  content_ar TEXT,
  section_type VARCHAR(50) DEFAULT 'content',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.landing_page_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (no authentication required)
CREATE POLICY "Anyone can view active FAQs" 
ON public.landing_page_faqs 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view visible statistics" 
ON public.public_statistics 
FOR SELECT 
USING (is_visible = true);

CREATE POLICY "Anyone can view active content" 
ON public.landing_page_content 
FOR SELECT 
USING (is_active = true);

-- Admin/Team member policies for content management
CREATE POLICY "Team members can manage FAQs" 
ON public.landing_page_faqs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage statistics" 
ON public.public_statistics 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage content" 
ON public.landing_page_content 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Add updated_at triggers
CREATE TRIGGER update_landing_page_faqs_updated_at
  BEFORE UPDATE ON public.landing_page_faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_landing_page_content_updated_at
  BEFORE UPDATE ON public.landing_page_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial FAQ data
INSERT INTO public.landing_page_faqs (question_en, question_ar, answer_en, answer_ar, category, order_sequence) VALUES
('What is the Ruwād Innovation System?', 'ما هو نظام رواد للابتكار؟', 'The Ruwād Innovation System is a comprehensive platform designed to accelerate innovation across government sectors, fostering collaboration and driving measurable outcomes aligned with Saudi Vision 2030.', 'نظام رواد للابتكار هو منصة شاملة مصممة لتسريع الابتكار عبر القطاعات الحكومية، وتعزيز التعاون وتحقيق نتائج قابلة للقياس تتماشى مع رؤية السعودية 2030.', 'general', 1),

('Who can participate in innovation challenges?', 'من يمكنه المشاركة في تحديات الابتكار؟', 'Government employees, innovation experts, and authorized partners can participate in challenges based on their roles and clearance levels.', 'يمكن للموظفين الحكوميين وخبراء الابتكار والشركاء المخولين المشاركة في التحديات بناءً على أدوارهم ومستويات التخويل الخاصة بهم.', 'participation', 2),

('How are ideas evaluated?', 'كيف يتم تقييم الأفكار؟', 'Ideas are evaluated by domain experts using standardized criteria including strategic alignment, feasibility, innovation level, and potential impact.', 'يتم تقييم الأفكار من قبل خبراء المجال باستخدام معايير موحدة تشمل التوافق الاستراتيجي والجدوى ومستوى الابتكار والتأثير المحتمل.', 'process', 3),

('How do I request access to the platform?', 'كيف أطلب الوصول إلى المنصة؟', 'Use the "Access Platform" button to sign up. Your access will be reviewed and approved based on your role and organizational affiliation.', 'استخدم زر "الوصول إلى المنصة" للتسجيل. سيتم مراجعة وصولك والموافقة عليه بناءً على دورك والانتماء التنظيمي.', 'access', 4);

-- Insert initial statistics (anonymized)
INSERT INTO public.public_statistics (metric_name, metric_value, metric_description_en, metric_description_ar, display_order, icon_name) VALUES
('total_innovations', 0, 'Total Innovation Projects', 'إجمالي مشاريع الابتكار', 1, 'lightbulb'),
('active_challenges', 0, 'Active Challenges', 'التحديات النشطة', 2, 'target'),
('government_participants', 0, 'Government Participants', 'المشاركون الحكوميون', 3, 'users'),
('success_rate', 85, 'Success Rate (%)', 'معدل النجاح (%)', 4, 'trending-up');

-- Insert initial content sections
INSERT INTO public.landing_page_content (section_key, title_en, title_ar, content_en, content_ar, section_type, display_order) VALUES
('how_it_works_step_1', 'Identify Challenges', 'تحديد التحديات', 'Government entities identify innovation challenges aligned with Vision 2030 strategic objectives.', 'تحدد الجهات الحكومية تحديات الابتكار المتماشية مع الأهداف الاستراتيجية لرؤية 2030.', 'process_step', 1),

('how_it_works_step_2', 'Develop Solutions', 'تطوير الحلول', 'Innovation teams and experts collaborate to develop creative solutions and implementation strategies.', 'تتعاون فرق الابتكار والخبراء لتطوير حلول إبداعية واستراتيجيات التنفيذ.', 'process_step', 2),

('how_it_works_step_3', 'Evaluate & Implement', 'التقييم والتنفيذ', 'Solutions are evaluated by domain experts and successfully approved ideas move to implementation phase.', 'يتم تقييم الحلول من قبل خبراء المجال والأفكار المعتمدة بنجاح تنتقل إلى مرحلة التنفيذ.', 'process_step', 3);