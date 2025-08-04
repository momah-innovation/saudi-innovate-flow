-- Insert more AI feature toggles for Phase 5
INSERT INTO public.ai_feature_toggles (
  feature_name, feature_name_ar, description, description_ar, 
  is_enabled, is_beta, required_subscription_tier, feature_category
) VALUES 
('smart_analytics', 'التحليلات الذكية', 'Advanced AI-powered analytics and insights', 'تحليلات متقدمة ورؤى بالذكاء الاصطناعي', true, true, 'Professional', 'analytics'),
('content_generation', 'توليد المحتوى', 'AI-powered content generation for challenges and ideas', 'توليد المحتوى بالذكاء الاصطناعي للتحديات والأفكار', true, true, 'Professional', 'content'),
('trend_analysis', 'تحليل الاتجاهات', 'Analyze innovation trends and patterns', 'تحليل اتجاهات وأنماط الابتكار', false, true, 'Enterprise', 'analytics'),
('collaboration_matching', 'مطابقة التعاون', 'AI-powered team and collaboration matching', 'مطابقة الفرق والتعاون بالذكاء الاصطناعي', false, true, 'Enterprise', 'collaboration');

-- Update progress documentation
UPDATE public.system_settings 
SET setting_value = jsonb_build_object(
  'phase', 5,
  'progress_percentage', 20,
  'current_focus', 'AI Integration Implementation',
  'last_update', now()
)
WHERE setting_key = 'project_phase_status';