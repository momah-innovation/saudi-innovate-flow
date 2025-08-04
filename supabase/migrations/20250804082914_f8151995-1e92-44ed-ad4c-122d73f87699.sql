-- Phase 3 Remaining Extensions: Subscription System, AI Preferences, Analytics, and Media Content

-- 1. Subscription Plans Table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'SAR',
  features JSONB DEFAULT '[]'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  stripe_price_id VARCHAR(255),
  stripe_product_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. User Subscriptions Table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  usage_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Organization Subscriptions Table
CREATE TABLE public.org_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  admin_user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  seats_included INTEGER DEFAULT 1,
  seats_used INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  billing_email VARCHAR(255),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  organization_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. AI Preferences Table
CREATE TABLE public.ai_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ai_enabled BOOLEAN DEFAULT true,
  idea_evaluation_ai BOOLEAN DEFAULT true,
  challenge_assist BOOLEAN DEFAULT true,
  similar_idea_detection BOOLEAN DEFAULT true,
  smart_partner_matching BOOLEAN DEFAULT false,
  focus_question_generation BOOLEAN DEFAULT true,
  language_preference VARCHAR(10) DEFAULT 'ar',
  creativity_level VARCHAR(20) DEFAULT 'balanced',
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  custom_prompts JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- 5. AI Feature Toggles Table (System-wide)
CREATE TABLE public.ai_feature_toggles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_name VARCHAR(100) NOT NULL UNIQUE,
  feature_name_ar VARCHAR(100) NOT NULL,
  description TEXT,
  description_ar TEXT,
  is_enabled BOOLEAN DEFAULT false,
  is_beta BOOLEAN DEFAULT true,
  required_subscription_tier VARCHAR(50),
  usage_limit_per_month INTEGER,
  model_configuration JSONB DEFAULT '{}'::jsonb,
  feature_category VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Enhanced Analytics Events Table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id VARCHAR(255),
  event_type VARCHAR(100) NOT NULL,
  event_category VARCHAR(50),
  entity_type VARCHAR(50),
  entity_id UUID,
  properties JSONB DEFAULT '{}'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  page_url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed BOOLEAN DEFAULT false
);

-- 7. Media Content Tables
CREATE TABLE public.media_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  content_type VARCHAR(50) NOT NULL, -- 'podcast', 'webinar', 'video', 'document'
  content_url TEXT NOT NULL,
  thumbnail_url TEXT,
  transcript_url TEXT,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  language VARCHAR(10) DEFAULT 'ar',
  author_id UUID,
  organization VARCHAR(255),
  published_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Knowledge Base Articles
CREATE TABLE public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  excerpt TEXT,
  excerpt_ar TEXT,
  category VARCHAR(100),
  difficulty_level VARCHAR(20) DEFAULT 'beginner',
  estimated_read_time INTEGER,
  author_id UUID,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feature_toggles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Subscription Plans
CREATE POLICY "Everyone can view active subscription plans"
ON public.subscription_plans FOR SELECT
USING (is_active = true AND is_public = true);

CREATE POLICY "Admins can manage subscription plans"
ON public.subscription_plans FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for User Subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.user_subscriptions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subscriptions"
ON public.user_subscriptions FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions"
ON public.user_subscriptions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for Organization Subscriptions
CREATE POLICY "Org admins can manage their subscriptions"
ON public.org_subscriptions FOR ALL
USING (admin_user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for AI Preferences
CREATE POLICY "Users can manage their AI preferences"
ON public.ai_preferences FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS Policies for AI Feature Toggles
CREATE POLICY "Everyone can view enabled AI features"
ON public.ai_feature_toggles FOR SELECT
USING (is_enabled = true);

CREATE POLICY "Admins can manage AI feature toggles"
ON public.ai_feature_toggles FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for Analytics Events
CREATE POLICY "Users can create analytics events"
ON public.analytics_events FOR INSERT
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can view all analytics"
ON public.analytics_events FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for Media Content
CREATE POLICY "Everyone can view public media content"
ON public.media_content FOR SELECT
USING (is_public = true);

CREATE POLICY "Authors can manage their content"
ON public.media_content FOR ALL
USING (author_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for Knowledge Base
CREATE POLICY "Everyone can view published articles"
ON public.knowledge_base FOR SELECT
USING (is_published = true);

CREATE POLICY "Authors can manage their articles"
ON public.knowledge_base FOR ALL
USING (author_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Junction tables for tags
CREATE TABLE public.media_content_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID NOT NULL REFERENCES public.media_content(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  added_by UUID,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(media_id, tag_id)
);

CREATE TABLE public.knowledge_base_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.knowledge_base(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  added_by UUID,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(article_id, tag_id)
);

-- Enable RLS on junction tables
ALTER TABLE public.media_content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for junction tables
CREATE POLICY "Everyone can view media content tags"
ON public.media_content_tags FOR SELECT
USING (true);

CREATE POLICY "Authors can manage media content tags"
ON public.media_content_tags FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.media_content mc 
    WHERE mc.id = media_content_tags.media_id 
    AND (mc.author_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Everyone can view knowledge base tags"
ON public.knowledge_base_tags FOR SELECT
USING (true);

CREATE POLICY "Authors can manage knowledge base tags"
ON public.knowledge_base_tags FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.knowledge_base kb 
    WHERE kb.id = knowledge_base_tags.article_id 
    AND (kb.author_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Create indexes for performance
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_org_subscriptions_admin ON public.org_subscriptions(admin_user_id);
CREATE INDEX idx_ai_preferences_user_id ON public.ai_preferences(user_id);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_timestamp ON public.analytics_events(timestamp);
CREATE INDEX idx_analytics_events_entity ON public.analytics_events(entity_type, entity_id);
CREATE INDEX idx_media_content_type ON public.media_content(content_type);
CREATE INDEX idx_media_content_published ON public.media_content(published_at);
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_base_published ON public.knowledge_base(is_published);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, name_ar, description, description_ar, price_monthly, price_yearly, features, limits) VALUES
('Free Tier', 'الباقة المجانية', 'Basic access to innovation platform', 'وصول أساسي لمنصة الابتكار', 0, 0, 
 '["Basic idea submission", "Public challenges view", "Community access"]'::jsonb,
 '{"ideas_per_month": 5, "challenges_per_month": 2, "ai_usage_per_month": 10}'::jsonb),
('Professional', 'المحترف', 'Enhanced features for active innovators', 'ميزات متقدمة للمبتكرين النشطين', 199, 1990,
 '["Unlimited ideas", "Advanced analytics", "Priority support", "AI assistance"]'::jsonb,
 '{"ideas_per_month": -1, "challenges_per_month": 10, "ai_usage_per_month": 100}'::jsonb),
('Enterprise', 'المؤسسة', 'Full platform access for organizations', 'وصول كامل للمنصة للمؤسسات', 999, 9990,
 '["Custom branding", "Advanced security", "Dedicated support", "Unlimited everything"]'::jsonb,
 '{"ideas_per_month": -1, "challenges_per_month": -1, "ai_usage_per_month": -1}'::jsonb);

-- Insert default AI feature toggles
INSERT INTO public.ai_feature_toggles (feature_name, feature_name_ar, description, description_ar, is_enabled, required_subscription_tier) VALUES
('idea_evaluation', 'تقييم الأفكار', 'AI-powered idea scoring and feedback', 'تقييم الأفكار وتقديم التعليقات بالذكاء الاصطناعي', true, 'Professional'),
('challenge_assist', 'مساعد التحديات', 'AI assistance for challenge creation', 'مساعدة الذكاء الاصطناعي في إنشاء التحديات', true, 'Professional'),
('similar_idea_detection', 'اكتشاف الأفكار المشابهة', 'Detect similar ideas to prevent duplication', 'اكتشاف الأفكار المشابهة لمنع التكرار', true, 'Free Tier'),
('smart_partner_matching', 'مطابقة الشركاء الذكية', 'AI-powered partner recommendations', 'توصيات الشركاء بالذكاء الاصطناعي', false, 'Enterprise'),
('focus_question_generation', 'توليد الأسئلة المحورية', 'Generate focus questions for challenges', 'توليد الأسئلة المحورية للتحديات', true, 'Professional');

-- Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_org_subscriptions_updated_at BEFORE UPDATE ON public.org_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_preferences_updated_at BEFORE UPDATE ON public.ai_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_feature_toggles_updated_at BEFORE UPDATE ON public.ai_feature_toggles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_content_updated_at BEFORE UPDATE ON public.media_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();