-- Create content moderation logs table
CREATE TABLE public.content_moderation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID,
  content_type VARCHAR(50) NOT NULL, -- 'idea', 'challenge', 'comment', etc.
  content_text TEXT NOT NULL,
  moderation_result JSONB NOT NULL DEFAULT '{}',
  flagged BOOLEAN DEFAULT false,
  confidence_score DECIMAL(3,2),
  categories_detected TEXT[],
  moderated_by VARCHAR(20) DEFAULT 'ai', -- 'ai' or 'manual'
  reviewer_id UUID,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'requires_review'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create AI tag suggestions table
CREATE TABLE public.ai_tag_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL,
  entity_type VARCHAR(50) NOT NULL, -- 'idea', 'challenge', 'opportunity', etc.
  suggested_tags JSONB NOT NULL DEFAULT '[]',
  confidence_scores JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  suggested_by VARCHAR(20) DEFAULT 'ai',
  reviewed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create smart search index table
CREATE TABLE public.smart_search_index (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  content_vector JSONB, -- Will store vector embeddings
  keywords TEXT[],
  semantic_tags TEXT[],
  popularity_score DECIMAL(5,2) DEFAULT 0,
  relevance_factors JSONB DEFAULT '{}',
  last_indexed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create project management AI insights table
CREATE TABLE public.project_ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  project_type VARCHAR(50) NOT NULL, -- 'challenge', 'opportunity', 'campaign'
  insights JSONB NOT NULL DEFAULT '{}',
  recommendations JSONB NOT NULL DEFAULT '[]',
  risk_assessment JSONB DEFAULT '{}',
  timeline_predictions JSONB DEFAULT '{}',
  resource_optimization JSONB DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  confidence_level DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create predictive user behavior table
CREATE TABLE public.user_behavior_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prediction_type VARCHAR(50) NOT NULL, -- 'engagement', 'contribution', 'collaboration'
  predictions JSONB NOT NULL DEFAULT '{}',
  behavioral_patterns JSONB DEFAULT '{}',
  recommendation_scores JSONB DEFAULT '{}',
  next_likely_actions TEXT[],
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  prediction_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create competitive intelligence table
CREATE TABLE public.competitive_intelligence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sector_id UUID,
  analysis_type VARCHAR(50) NOT NULL, -- 'market_trends', 'competitor_analysis', 'innovation_gaps'
  data_sources TEXT[],
  insights JSONB NOT NULL DEFAULT '{}',
  trends_identified JSONB DEFAULT '[]',
  opportunities JSONB DEFAULT '[]',
  threats JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  confidence_level DECIMAL(3,2) DEFAULT 0.0,
  analysis_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create AI-powered email templates table
CREATE TABLE public.ai_email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name VARCHAR(255) NOT NULL,
  template_category VARCHAR(100) NOT NULL, -- 'notification', 'campaign', 'follow_up'
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- Available template variables
  tone VARCHAR(50) DEFAULT 'professional', -- 'professional', 'friendly', 'formal'
  language VARCHAR(5) DEFAULT 'ar',
  generated_by VARCHAR(20) DEFAULT 'ai',
  usage_count INTEGER DEFAULT 0,
  effectiveness_score DECIMAL(3,2) DEFAULT 0.0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create document analysis results table
CREATE TABLE public.document_analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_record_id UUID NOT NULL,
  document_type VARCHAR(100),
  extracted_text TEXT,
  key_insights JSONB DEFAULT '[]',
  sentiment_analysis JSONB DEFAULT '{}',
  topics_detected TEXT[],
  entities_found JSONB DEFAULT '[]',
  summary TEXT,
  action_items JSONB DEFAULT '[]',
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  processing_time_ms INTEGER,
  analyzed_by VARCHAR(20) DEFAULT 'ai',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.content_moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tag_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_search_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behavior_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_analysis_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for content moderation logs
CREATE POLICY "Team members can view moderation logs"
  ON public.content_moderation_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "AI system can create moderation logs"
  ON public.content_moderation_logs FOR INSERT
  WITH CHECK (true);

-- Create RLS policies for AI tag suggestions
CREATE POLICY "Users can view tag suggestions for their content"
  ON public.ai_tag_suggestions FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = auth.uid() AND itm.status = 'active'
      ) OR has_role(auth.uid(), 'admin'::app_role)
    )
  );

CREATE POLICY "AI system can create tag suggestions"
  ON public.ai_tag_suggestions FOR INSERT
  WITH CHECK (true);

-- Create RLS policies for smart search index
CREATE POLICY "Users can view search index"
  ON public.smart_search_index FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "AI system can manage search index"
  ON public.smart_search_index FOR ALL
  USING (true);

-- Create RLS policies for project AI insights
CREATE POLICY "Team members can view project insights"
  ON public.project_ai_insights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Create RLS policies for user behavior predictions
CREATE POLICY "Users can view their own behavior predictions"
  ON public.user_behavior_predictions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Team members can view all behavior predictions"
  ON public.user_behavior_predictions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Create RLS policies for competitive intelligence
CREATE POLICY "Team members can view competitive intelligence"
  ON public.competitive_intelligence FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Create RLS policies for AI email templates
CREATE POLICY "Users can view email templates"
  ON public.ai_email_templates FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Team members can manage email templates"
  ON public.ai_email_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Create RLS policies for document analysis
CREATE POLICY "Users can view analysis of their documents"
  ON public.document_analysis_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM file_records fr 
      WHERE fr.id = file_record_id AND fr.uploader_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Create indexes for better performance
CREATE INDEX idx_content_moderation_content_type ON public.content_moderation_logs(content_type);
CREATE INDEX idx_content_moderation_status ON public.content_moderation_logs(status);
CREATE INDEX idx_ai_tag_suggestions_entity ON public.ai_tag_suggestions(entity_id, entity_type);
CREATE INDEX idx_smart_search_entity ON public.smart_search_index(entity_id, entity_type);
CREATE INDEX idx_project_insights_project ON public.project_ai_insights(project_id, project_type);
CREATE INDEX idx_user_predictions_user ON public.user_behavior_predictions(user_id, prediction_type);
CREATE INDEX idx_competitive_intelligence_sector ON public.competitive_intelligence(sector_id);
CREATE INDEX idx_document_analysis_file ON public.document_analysis_results(file_record_id);

-- Update ai_feature_toggles with new features
INSERT INTO public.ai_feature_toggles (
  feature_name, feature_name_ar, description, description_ar, 
  is_enabled, is_beta, feature_category, model_configuration
) VALUES 
-- Content Moderation
('content_moderation', 'فحص المحتوى', 
 'Automated content moderation and quality assurance', 
 'فحص المحتوى التلقائي وضمان الجودة', 
 true, false, 'content_management', 
 '{"model": "gpt-4o-mini", "temperature": 0.3, "max_tokens": 1000}'),

-- Automated Tagging
('automated_tagging', 'العلامات التلقائية', 
 'AI-powered automatic tagging system', 
 'نظام العلامات التلقائي بالذكاء الاصطناعي', 
 true, false, 'content_management', 
 '{"model": "gpt-4o-mini", "temperature": 0.5, "max_tokens": 500}'),

-- Email Intelligence
('email_intelligence', 'ذكاء البريد الإلكتروني', 
 'Smart email generation and communication optimization', 
 'توليد البريد الإلكتروني الذكي وتحسين التواصل', 
 true, true, 'communication', 
 '{"model": "gpt-4o-mini", "temperature": 0.7, "max_tokens": 2000}'),

-- Document Intelligence
('document_intelligence', 'ذكاء الوثائق', 
 'AI-powered document analysis and summarization', 
 'تحليل الوثائق والتلخيص بالذكاء الاصطناعي', 
 true, true, 'content_analysis', 
 '{"model": "gpt-4o-mini", "temperature": 0.4, "max_tokens": 3000}'),

-- Predictive User Behavior
('predictive_behavior', 'السلوك التنبؤي', 
 'Anticipate user needs and actions', 
 'توقع احتياجات وأفعال المستخدمين', 
 true, true, 'analytics', 
 '{"model": "gpt-4o-mini", "temperature": 0.6, "max_tokens": 1500}'),

-- Smart Search
('smart_search', 'البحث الذكي', 
 'Semantic search across all platform content', 
 'البحث الدلالي عبر جميع محتويات المنصة', 
 true, false, 'search_discovery', 
 '{"model": "text-embedding-3-small", "dimensions": 1536}'),

-- Project Management AI
('project_management_ai', 'إدارة المشاريع الذكية', 
 'AI-driven project planning and management', 
 'تخطيط وإدارة المشاريع بالذكاء الاصطناعي', 
 true, true, 'project_management', 
 '{"model": "gpt-4o-mini", "temperature": 0.5, "max_tokens": 2500}'),

-- Innovation Portfolio Management
('portfolio_management', 'إدارة محفظة الابتكار', 
 'AI-driven innovation strategy and portfolio optimization', 
 'استراتيجية الابتكار وتحسين المحفظة بالذكاء الاصطناعي', 
 true, true, 'strategic_planning', 
 '{"model": "gpt-4o-mini", "temperature": 0.4, "max_tokens": 3000}'),

-- Competitive Intelligence
('competitive_intelligence', 'الذكاء التنافسي', 
 'Market analysis and competitive positioning', 
 'تحليل السوق والموقع التنافسي', 
 true, true, 'market_analysis', 
 '{"model": "gpt-4o-mini", "temperature": 0.5, "max_tokens": 4000}'),

-- Automated Research Assistant
('research_assistant', 'مساعد البحث التلقائي', 
 'AI-powered research and information gathering', 
 'البحث وجمع المعلومات بالذكاء الاصطناعي', 
 true, true, 'research', 
 '{"model": "gpt-4o-mini", "temperature": 0.6, "max_tokens": 3500}'),

-- Real-time Collaboration Enhancement
('collaboration_enhancement', 'تحسين التعاون الفوري', 
 'AI-powered real-time collaboration features', 
 'ميزات التعاون الفوري بالذكاء الاصطناعي', 
 true, true, 'collaboration', 
 '{"model": "gpt-4o-mini", "temperature": 0.7, "max_tokens": 2000}');

-- Create AI usage tracking table
CREATE TABLE public.ai_usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  feature_name VARCHAR(100) NOT NULL,
  usage_type VARCHAR(50) NOT NULL, -- 'api_call', 'feature_use', 'token_consumption'
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost_estimate DECIMAL(10,4) DEFAULT 0.0,
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI usage"
  ON public.ai_usage_tracking FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Team members can view all AI usage"
  ON public.ai_usage_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE INDEX idx_ai_usage_user_feature ON public.ai_usage_tracking(user_id, feature_name);
CREATE INDEX idx_ai_usage_created_at ON public.ai_usage_tracking(created_at);