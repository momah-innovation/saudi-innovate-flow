-- Add image_url column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing events with image URLs based on event type
UPDATE public.events 
SET image_url = CASE 
  WHEN event_type = 'conference' THEN '/event-images/conference.jpg'
  WHEN event_type = 'workshop' THEN '/event-images/workshop.jpg'
  WHEN event_type = 'meetup' THEN '/event-images/tech-meetup.jpg'
  WHEN event_type = 'webinar' THEN '/event-images/webinar.jpg'
  ELSE '/event-images/innovation.jpg'
END
WHERE image_url IS NULL;

-- Insert additional seed events for a richer experience
INSERT INTO public.events (
  title_ar, description_ar, event_date, start_time, end_time, 
  location, format, event_type, event_category, status, 
  max_participants, registered_participants, actual_participants,
  budget, image_url
) VALUES 
-- Upcoming events
('ورشة عمل الذكاء الاصطناعي للمبتدئين', 'تعلم أساسيات الذكاء الاصطناعي وتطبيقاته في الأعمال', 
 CURRENT_DATE + INTERVAL '5 days', '09:00', '17:00', 
 'مركز الابتكار التقني', 'in_person', 'workshop', 'education', 'scheduled', 
 30, 18, 0, 500, '/event-images/workshop.jpg'),

('مؤتمر الابتكار الرقمي 2024', 'أكبر تجمع لقادة التكنولوجيا والابتكار في المنطقة', 
 CURRENT_DATE + INTERVAL '15 days', '08:00', '18:00', 
 'مركز المؤتمرات الدولي', 'hybrid', 'conference', 'featured', 'scheduled', 
 500, 342, 0, 15000, '/event-images/conference.jpg'),

('لقاء شهري للمطورين', 'شبكة واجتماع مطوري البرمجيات المحليين', 
 CURRENT_DATE + INTERVAL '8 days', '18:00', '21:00', 
 'مقهى التكنولوجيا', 'in_person', 'meetup', 'networking', 'scheduled', 
 50, 35, 0, 200, '/event-images/tech-meetup.jpg'),

('ندوة عبر الإنترنت: مستقبل البلوك تشين', 'استكشاف تقنيات البلوك تشين وتطبيقاتها المستقبلية', 
 CURRENT_DATE + INTERVAL '3 days', '19:00', '20:30', 
 NULL, 'virtual', 'webinar', 'education', 'scheduled', 
 200, 87, 0, 0, '/event-images/webinar.jpg'),

('هاكاثون الابتكار الطبي', 'تطوير حلول تقنية للتحديات الطبية في 48 ساعة', 
 CURRENT_DATE + INTERVAL '20 days', '09:00', '18:00', 
 'مجمع الابتكار الطبي', 'in_person', 'hackathon', 'competition', 'scheduled', 
 100, 67, 0, 10000, '/event-images/innovation.jpg'),

-- Today's events
('جلسة عصف ذهني: حلول المدن الذكية', 'تطوير أفكار مبتكرة للمدن الذكية المستدامة', 
 CURRENT_DATE, '14:00', '17:00', 
 'مركز التميز للابتكار', 'in_person', 'brainstorm', 'innovation', 'ongoing', 
 25, 23, 20, 300, '/event-images/innovation.jpg'),

-- Past events
('مؤتمر الأمن السيبراني', 'أحدث الاتجاهات في الأمن السيبراني والحماية الرقمية', 
 CURRENT_DATE - INTERVAL '10 days', '09:00', '16:00', 
 'فندق الريتز كارلتون', 'hybrid', 'conference', 'security', 'completed', 
 300, 285, 280, 8000, '/event-images/conference.jpg'),

('ورشة تطوير التطبيقات المحمولة', 'تعلم تطوير التطبيقات باستخدام React Native', 
 CURRENT_DATE - INTERVAL '5 days', '10:00', '15:00', 
 'أكاديمية البرمجة', 'in_person', 'workshop', 'education', 'completed', 
 20, 20, 18, 800, '/event-images/workshop.jpg'),

('ندوة ريادة الأعمال النسائية', 'تمكين المرأة في مجال ريادة الأعمال والتكنولوجيا', 
 CURRENT_DATE - INTERVAL '15 days', '17:00', '19:00', 
 'مركز الأعمال النسائي', 'hybrid', 'seminar', 'entrepreneurship', 'completed', 
 80, 76, 70, 1200, '/event-images/conference.jpg');

-- Create storage bucket for event attachments and resources
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-resources', 'event-resources', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for event resources
CREATE POLICY "Event resources are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'event-resources');

CREATE POLICY "Authenticated users can upload event resources" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'event-resources' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own event resources" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'event-resources' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create event bookmarks table for user favorites
CREATE TABLE IF NOT EXISTS public.event_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Enable RLS for event bookmarks
ALTER TABLE public.event_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for event bookmarks
CREATE POLICY "Users can manage their own event bookmarks" 
ON public.event_bookmarks 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create event feedback table
CREATE TABLE IF NOT EXISTS public.event_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  would_recommend BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS for event feedback
ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for event feedback
CREATE POLICY "Users can manage their own feedback" 
ON public.event_feedback 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view event feedback" 
ON public.event_feedback 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER update_event_feedback_updated_at
  BEFORE UPDATE ON public.event_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();