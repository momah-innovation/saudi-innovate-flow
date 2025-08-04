-- Complete tag system setup with correct column names and improved relationships

-- Create comprehensive views for improved performance using correct column names
CREATE OR REPLACE VIEW public.challenges_with_details AS
SELECT 
  c.*,
  COUNT(DISTINCT cp.id) as participant_count,
  COUNT(DISTINCT cs.id) as submission_count,
  COUNT(DISTINCT cc.id) as comment_count,
  COUNT(DISTINCT ct.id) as tag_count,
  ARRAY_AGG(DISTINCT t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  s.name as sector_name,
  s.name_ar as sector_name_ar,
  d.name as department_name,
  d.name_ar as department_name_ar,
  dep.name as deputy_name,
  dep.name_ar as deputy_name_ar
FROM public.challenges c
LEFT JOIN public.challenge_participants cp ON c.id = cp.challenge_id AND cp.status = 'active'
LEFT JOIN public.challenge_submissions cs ON c.id = cs.challenge_id
LEFT JOIN public.challenge_comments cc ON c.id = cc.challenge_id
LEFT JOIN public.challenge_tags ct ON c.id = ct.challenge_id
LEFT JOIN public.tags t ON ct.tag_id = t.id
LEFT JOIN public.sectors s ON c.sector_id = s.id
LEFT JOIN public.departments d ON c.department_id = d.id
LEFT JOIN public.deputies dep ON c.deputy_id = dep.id
GROUP BY c.id, s.id, s.name, s.name_ar, d.id, d.name, d.name_ar, dep.id, dep.name, dep.name_ar;

-- Create events with details view
CREATE OR REPLACE VIEW public.events_with_details AS
SELECT 
  e.*,
  COUNT(DISTINCT ep.id) as participant_count,
  COUNT(DISTINCT ef.id) as feedback_count,
  COUNT(DISTINCT et.id) as tag_count,
  ARRAY_AGG(DISTINCT t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  s.name as sector_name,
  s.name_ar as sector_name_ar
FROM public.events e
LEFT JOIN public.event_participants ep ON e.id = ep.event_id
LEFT JOIN public.event_feedback ef ON e.id = ef.event_id
LEFT JOIN public.event_tags et ON e.id = et.event_id
LEFT JOIN public.tags t ON et.tag_id = t.id
LEFT JOIN public.sectors s ON e.sector_id = s.id
GROUP BY e.id, s.id, s.name, s.name_ar;

-- Create campaigns with details view
CREATE OR REPLACE VIEW public.campaigns_with_details AS
SELECT 
  c.*,
  COUNT(DISTINCT ct.id) as tag_count,
  ARRAY_AGG(DISTINCT t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  s.name as sector_name,
  s.name_ar as sector_name_ar,
  d.name as department_name,
  d.name_ar as department_name_ar,
  dep.name as deputy_name,
  dep.name_ar as deputy_name_ar
FROM public.campaigns c
LEFT JOIN public.campaign_tags ct ON c.id = ct.campaign_id
LEFT JOIN public.tags t ON ct.tag_id = t.id
LEFT JOIN public.sectors s ON c.sector_id = s.id
LEFT JOIN public.departments d ON c.department_id = d.id
LEFT JOIN public.deputies dep ON c.deputy_id = dep.id
GROUP BY c.id, s.id, s.name, s.name_ar, d.id, d.name, d.name_ar, dep.id, dep.name, dep.name_ar;

-- Create opportunities with details view  
CREATE OR REPLACE VIEW public.opportunities_with_details AS
SELECT 
  o.*,
  COUNT(DISTINCT oa.id) as application_count,
  COUNT(DISTINCT ol.id) as like_count,
  COUNT(DISTINCT ot.id) as tag_count,
  ARRAY_AGG(DISTINCT t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  s.name as sector_name,
  s.name_ar as sector_name_ar
FROM public.opportunities o
LEFT JOIN public.opportunity_applications oa ON o.id = oa.opportunity_id
LEFT JOIN public.opportunity_likes ol ON o.id = ol.opportunity_id
LEFT JOIN public.opportunity_tags ot ON o.id = ot.opportunity_id
LEFT JOIN public.tags t ON ot.tag_id = t.id
LEFT JOIN public.sectors s ON o.sector_id = s.id
GROUP BY o.id, s.id, s.name, s.name_ar;

-- Insert seed data for tags using correct column names
INSERT INTO public.tags (name_en, name_ar, description_en, description_ar, category, color, is_system)
VALUES
  ('Technology', 'تقنية', 'Technology-related content', 'محتوى متعلق بالتقنية', 'technology', '#3B82F6', false),
  ('Innovation', 'ابتكار', 'Innovation and creativity', 'الابتكار والإبداع', 'theme', '#10B981', false),
  ('Healthcare', 'صحة', 'Healthcare and medical', 'الرعاية الصحية والطبية', 'sector', '#EF4444', false),
  ('Education', 'تعليم', 'Education and learning', 'التعليم والتعلم', 'sector', '#F59E0B', false),
  ('Finance', 'مالية', 'Financial services', 'الخدمات المالية', 'sector', '#8B5CF6', false),
  ('Sustainability', 'استدامة', 'Environmental sustainability', 'الاستدامة البيئية', 'theme', '#059669', false),
  ('Digital Transformation', 'تحول رقمي', 'Digital transformation initiatives', 'مبادرات التحول الرقمي', 'technology', '#6366F1', false),
  ('Artificial Intelligence', 'ذكاء اصطناعي', 'AI and machine learning', 'الذكاء الاصطناعي والتعلم الآلي', 'technology', '#EC4899', false),
  ('Blockchain', 'بلوك تشين', 'Blockchain technology', 'تقنية البلوك تشين', 'technology', '#F97316', false),
  ('IoT', 'إنترنت الأشياء', 'Internet of Things', 'إنترنت الأشياء', 'technology', '#06B6D4', false),
  ('Research', 'بحث', 'Research and development', 'البحث والتطوير', 'theme', '#84CC16', false),
  ('Startup', 'شركة ناشئة', 'Startup and entrepreneurship', 'الشركات الناشئة وريادة الأعمال', 'theme', '#F43F5E', false)
WHERE NOT EXISTS (SELECT 1 FROM public.tags WHERE name_en = 'Technology');