-- PHASE 6: FINAL IMPLEMENTATION - COMPREHENSIVE SEED DATA & ENHANCEMENTS (Fixed)

-- First, let's check what constraints exist on tags table
DO $$
BEGIN
    -- Add more comprehensive seed data to tags table (with proper conflict handling)
    INSERT INTO tags (name_en, name_ar, category, color, description_en, description_ar) VALUES
    -- More sector tags
    ('Agriculture', 'الزراعة', 'sector', '#22C55E', 'Agricultural innovation and smart farming', 'الابتكار الزراعي والزراعة الذكية'),
    ('Defense', 'الدفاع', 'sector', '#525252', 'Defense and security solutions', 'حلول الدفاع والأمن'),
    ('Tourism', 'السياحة', 'sector', '#06B6D4', 'Tourism and hospitality innovations', 'ابتكارات السياحة والضيافة'),
    ('Sports', 'الرياضة', 'sector', '#F97316', 'Sports technology and fitness', 'تقنيات الرياضة واللياقة'),
    ('Real Estate', 'العقارات', 'sector', '#8B5CF6', 'Property technology and smart buildings', 'تقنيات العقارات والمباني الذكية'),
    ('Retail', 'التجارة', 'sector', '#EC4899', 'Retail innovation and e-commerce', 'ابتكار التجارة والتجارة الإلكترونية'),

    -- Technology tags
    ('Blockchain', 'البلوك تشين', 'technology', '#F59E0B', 'Distributed ledger technology', 'تقنية الدفتر الموزع'),
    ('IoT', 'إنترنت الأشياء', 'technology', '#3B82F6', 'Internet of Things solutions', 'حلول إنترنت الأشياء'),
    ('Cloud Computing', 'الحوسبة السحابية', 'technology', '#06B6D4', 'Cloud infrastructure and services', 'البنية التحتية السحابية والخدمات'),
    ('Cybersecurity', 'الأمن السيبراني', 'technology', '#DC2626', 'Information security and privacy', 'أمن المعلومات والخصوصية'),
    ('5G', 'الجيل الخامس', 'technology', '#7C3AED', 'Fifth generation wireless technology', 'تقنية الجيل الخامس اللاسلكية'),
    ('Robotics', 'الروبوتات', 'technology', '#EA580C', 'Robotic systems and automation', 'أنظمة الروبوتات والأتمتة'),
    ('VR/AR', 'الواقع الافتراضي/المعزز', 'technology', '#EC4899', 'Virtual and Augmented Reality', 'الواقع الافتراضي والمعزز'),

    -- Approach/methodology tags
    ('Design Thinking', 'التفكير التصميمي', 'approach', '#10B981', 'Human-centered design methodology', 'منهجية التصميم المتمحور حول الإنسان'),
    ('Agile', 'المرونة', 'approach', '#3B82F6', 'Agile development methodology', 'منهجية التطوير المرنة'),
    ('Lean Startup', 'الشركة الناشئة المرنة', 'approach', '#F59E0B', 'Lean startup methodology', 'منهجية الشركة الناشئة المرنة'),
    ('Open Innovation', 'الابتكار المفتوح', 'approach', '#06B6D4', 'Collaborative innovation approach', 'نهج الابتكار التعاوني'),

    -- Challenge type tags  
    ('Hackathon', 'الهاكاثون', 'type', '#8B5CF6', 'Innovation hackathon event', 'فعالية هاكاثون الابتكار'),
    ('Competition', 'المسابقة', 'type', '#DC2626', 'Innovation competition', 'مسابقة الابتكار'),
    ('Workshop', 'ورشة العمل', 'type', '#059669', 'Hands-on workshop', 'ورشة عمل تطبيقية'),
    ('Accelerator', 'المسرع', 'type', '#7C3AED', 'Startup accelerator program', 'برنامج مسرع الشركات الناشئة'),

    -- Priority and status tags
    ('Critical', 'حرج', 'priority', '#DC2626', 'Critical priority level', 'مستوى أولوية حرج'),
    ('Medium Priority', 'أولوية متوسطة', 'priority', '#F59E0B', 'Medium priority level', 'مستوى أولوية متوسط'),
    ('Low Priority', 'أولوية منخفضة', 'priority', '#22C55E', 'Low priority level', 'مستوى أولوية منخفض'),

    -- Impact and outcome tags
    ('Social Impact', 'التأثير الاجتماعي', 'impact', '#10B981', 'Positive social impact solutions', 'حلول التأثير الاجتماعي الإيجابي'),
    ('Economic Growth', 'النمو الاقتصادي', 'impact', '#F59E0B', 'Economic development and growth', 'التنمية والنمو الاقتصادي'),
    ('Environmental', 'البيئي', 'impact', '#22C55E', 'Environmental conservation', 'الحفاظ على البيئة'),

    -- Vision 2030 alignment tags
    ('Vision 2030', 'رؤية 2030', 'theme', '#6366F1', 'Saudi Vision 2030 aligned', 'متماشي مع رؤية السعودية 2030'),
    ('NEOM', 'نيوم', 'theme', '#EC4899', 'NEOM megacity project', 'مشروع مدينة نيوم'),
    ('Quality of Life', 'جودة الحياة', 'theme', '#10B981', 'Improving quality of life', 'تحسين جودة الحياة')
    ON CONFLICT DO NOTHING;

EXCEPTION
    WHEN OTHERS THEN
        -- If conflict constraint doesn't exist, ignore and continue
        NULL;
END$$;

-- Create performance views for better query optimization (these may already exist)
CREATE OR REPLACE VIEW public.challenges_with_stats AS
SELECT 
  c.*,
  COUNT(DISTINCT cp.id) as participant_count,
  COUNT(DISTINCT cs.id) as submission_count,
  ARRAY_AGG(DISTINCT t.name_en ORDER BY t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar ORDER BY t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color ORDER BY t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  AVG(cf.rating) as average_rating,
  COUNT(DISTINCT cf.id) as feedback_count
FROM challenges c
LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id AND cp.status = 'active'
LEFT JOIN challenge_submissions cs ON c.id = cs.challenge_id AND cs.status = 'submitted'
LEFT JOIN challenge_tags ct ON c.id = ct.challenge_id
LEFT JOIN tags t ON ct.tag_id = t.id
LEFT JOIN challenge_feedback cf ON c.id = cf.challenge_id
GROUP BY c.id;

CREATE OR REPLACE VIEW public.ideas_with_stats AS
SELECT 
  i.*,
  p.name as innovator_name,
  p.name_ar as innovator_name_ar,
  c.title_ar as challenge_title,
  COUNT(DISTINCT ic.id) as comment_count,
  COUNT(DISTINCT il.id) as like_count,
  ARRAY_AGG(DISTINCT t.name_en ORDER BY t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar ORDER BY t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color ORDER BY t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors
FROM ideas i
LEFT JOIN innovators inn ON i.innovator_id = inn.id
LEFT JOIN profiles p ON inn.user_id = p.id
LEFT JOIN challenges c ON i.challenge_id = c.id
LEFT JOIN idea_comments ic ON i.id = ic.idea_id
LEFT JOIN idea_likes il ON i.id = il.idea_id
LEFT JOIN idea_tags it ON i.id = it.idea_id
LEFT JOIN tags t ON it.tag_id = t.id
GROUP BY i.id, p.name, p.name_ar, c.title_ar;

CREATE OR REPLACE VIEW public.events_with_stats AS
SELECT 
  e.*,
  COUNT(DISTINCT ep.id) as actual_participants,
  COUNT(DISTINCT el.id) as like_count,
  COUNT(DISTINCT eb.id) as bookmark_count,
  AVG(ef.rating) as average_rating,
  COUNT(DISTINCT ef.id) as feedback_count,
  ARRAY_AGG(DISTINCT t.name_en ORDER BY t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar ORDER BY t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color ORDER BY t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors
FROM events e
LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.attendance_status = 'attended'
LEFT JOIN event_likes el ON e.id = el.event_id
LEFT JOIN event_bookmarks eb ON e.id = eb.event_id
LEFT JOIN event_feedback ef ON e.id = ef.event_id
LEFT JOIN event_tags et ON e.id = et.event_id
LEFT JOIN tags t ON et.tag_id = t.id
GROUP BY e.id;

-- Log the completion of initial setup
INSERT INTO public.analytics_events (
  event_type,
  event_category,
  properties,
  timestamp
) VALUES (
  'phase_initialization',
  'implementation',
  jsonb_build_object(
    'phase', 'Phase 6 - Final Implementation Start',
    'progress', '0%',
    'features_planned', ARRAY[
      'comprehensive_seed_data',
      'performance_views', 
      'enhanced_tagging',
      'file_upload_integration',
      'advanced_search',
      'i18n_completion'
    ],
    'start_time', NOW()
  ),
  NOW()
);