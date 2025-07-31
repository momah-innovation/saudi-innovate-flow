-- Seed sample events data with valid categories
INSERT INTO public.events (
  title_ar,
  description_ar,
  event_date,
  start_time,
  end_time,
  location,
  format,
  event_type,
  event_category,
  status,
  max_participants,
  registered_participants,
  actual_participants,
  event_visibility,
  image_url
) VALUES
-- Today's Events
('مؤتمر الذكاء الاصطناعي والابتكار', 'مؤتمر متخصص في تطبيقات الذكاء الاصطناعي في القطاعات الحكومية والخاصة، يجمع خبراء محليين وعالميين لمناقشة أحدث التطورات والتحديات', CURRENT_DATE, '09:00', '17:00', 'مركز الرياض الدولي للمؤتمرات والمعارض', 'in_person', 'conference', 'standalone', 'active', 500, 347, 0, 'public', '/event-images/innovation-conference.jpg'),

('ورشة عمل تطوير الحلول الذكية', 'ورشة تفاعلية تهدف إلى تطوير مهارات المشاركين في بناء الحلول التقنية المبتكرة باستخدام أحدث التقنيات والأدوات', CURRENT_DATE, '14:00', '18:00', 'مدينة الملك عبد العزيز للعلوم والتقنية', 'hybrid', 'workshop', 'workshop', 'active', 50, 38, 0, 'public', '/event-images/innovation-workshop.jpg'),

-- Tomorrow's Events
('قمة المدن الذكية السعودية', 'قمة استراتيجية تناقش مستقبل المدن الذكية في المملكة العربية السعودية ودورها في تحقيق رؤية 2030', CURRENT_DATE + INTERVAL '1 day', '10:00', '16:00', 'فندق الريتز كارلتون الرياض', 'in_person', 'summit', 'standalone', 'active', 300, 245, 0, 'public', '/event-images/smart-city.jpg'),

('هاكاثون الابتكار الحكومي', 'مسابقة برمجية مكثفة لمدة 48 ساعة تهدف إلى تطوير حلول مبتكرة للتحديات الحكومية الراهنة', CURRENT_DATE + INTERVAL '1 day', '09:00', '18:00', 'جامعة الملك سعود', 'in_person', 'hackathon', 'campaign_event', 'active', 100, 89, 0, 'public', '/event-images/innovation-lightbulb.jpg'),

-- Next Week Events
('معرض التقنيات الناشئة', 'معرض شامل يستعرض أحدث التقنيات الناشئة والابتكارات في مجالات متنوعة من الذكاء الاصطناعي إلى البلوك تشين', CURRENT_DATE + INTERVAL '5 days', '09:00', '19:00', 'مركز الرياض الدولي للمعارض', 'in_person', 'expo', 'standalone', 'upcoming', 1000, 567, 0, 'public', '/event-images/tech-conference.jpg'),

('ندوة الأمن السيبراني والحماية الرقمية', 'ندوة متخصصة تناقش أهمية الأمن السيبراني وأفضل الممارسات لحماية البيانات والمعلومات الحساسة', CURRENT_DATE + INTERVAL '7 days', '13:00', '17:00', NULL, 'virtual', 'seminar', 'training', 'upcoming', 200, 134, 0, 'public', '/event-images/tech-summit.jpg'),

-- Future Events
('مؤتمر الصحة الرقمية والطب الذكي', 'مؤتمر يركز على تطبيقات التكنولوجيا في القطاع الصحي وكيفية استخدام الذكاء الاصطناعي لتحسين الخدمات الطبية', CURRENT_DATE + INTERVAL '14 days', '08:30', '16:30', 'مستشفى الملك فيصل التخصصي', 'hybrid', 'conference', 'standalone', 'upcoming', 400, 123, 0, 'public', '/event-images/digital-summit.jpg'),

('ورشة عمل ريادة الأعمال التقنية', 'ورشة تدريبية مكثفة تهدف إلى إعداد وتأهيل رواد الأعمال في المجال التقني وتقديم الدعم اللازم لبناء الشركات الناشئة', CURRENT_DATE + INTERVAL '21 days', '09:00', '15:00', 'واحة الرياض للتقنية', 'in_person', 'workshop', 'training', 'upcoming', 75, 42, 0, 'public', '/event-images/innovation-idea.jpg'),

-- Past Events
('منتدى الابتكار الحكومي السنوي', 'منتدى سنوي يجمع القيادات الحكومية والخبراء لمناقشة آليات تطوير الخدمات الحكومية وتعزيز الابتكار في القطاع العام', CURRENT_DATE - INTERVAL '7 days', '09:00', '17:00', 'مركز الملك عبد الله المالي', 'in_person', 'forum', 'campaign_event', 'completed', 600, 578, 520, 'public', '/event-images/innovation.jpg'),

('دورة تدريبية: البيانات الضخمة والتحليلات الذكية', 'دورة تدريبية متقدمة تغطي أساسيات البيانات الضخمة وتقنيات التحليل المتطورة وكيفية استخراج القيم الاستراتيجية من البيانات', CURRENT_DATE - INTERVAL '14 days', '10:00', '16:00', NULL, 'virtual', 'training', 'training', 'completed', 150, 142, 138, 'public', '/event-images/tech-workshop.jpg');

-- Add some event participants for realistic data
INSERT INTO public.event_participants (event_id, user_id, registration_date, participation_type, status)
SELECT 
  e.id,
  (SELECT id FROM auth.users LIMIT 1),
  e.created_at,
  'individual',
  CASE 
    WHEN e.status = 'completed' THEN 'attended'
    ELSE 'registered'
  END
FROM public.events e
WHERE e.registered_participants > 0 AND EXISTS (SELECT 1 FROM auth.users LIMIT 1);

-- Add some event likes
INSERT INTO public.event_likes (event_id, user_id)
SELECT 
  e.id,
  (SELECT id FROM auth.users LIMIT 1)
FROM public.events e, (SELECT id FROM auth.users LIMIT 1) u
WHERE random() < 0.6; -- 60% chance of having a like

-- Add some event bookmarks
INSERT INTO public.event_bookmarks (event_id, user_id, priority)
SELECT 
  e.id,
  (SELECT id FROM auth.users LIMIT 1),
  CASE 
    WHEN random() < 0.3 THEN 'high'
    WHEN random() < 0.6 THEN 'medium'
    ELSE 'low'
  END
FROM public.events e, (SELECT id FROM auth.users LIMIT 1) u
WHERE random() < 0.4; -- 40% chance of being bookmarked

-- Add some event feedback for completed events
INSERT INTO public.event_feedback (event_id, user_id, rating, feedback_text, would_recommend)
SELECT 
  e.id,
  (SELECT id FROM auth.users LIMIT 1),
  FLOOR(random() * 3 + 3)::integer, -- Rating between 3-5
  CASE 
    WHEN random() < 0.5 THEN 'فعالية ممتازة ومفيدة، استفدت كثيراً من المحتوى المقدم والخبرات المشاركة'
    ELSE 'تنظيم رائع ومحتوى قيم، أنصح بحضور مثل هذه الفعاليات'
  END,
  random() < 0.9 -- 90% would recommend
FROM public.events e, (SELECT id FROM auth.users LIMIT 1) u
WHERE e.status = 'completed';