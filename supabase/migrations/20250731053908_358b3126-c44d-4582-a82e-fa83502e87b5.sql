-- Create event reviews table
CREATE TABLE IF NOT EXISTS public.event_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fk_event_reviews_event_id 
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  UNIQUE(user_id, event_id)
);

-- Create event waitlist table
CREATE TABLE IF NOT EXISTS public.event_waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  position_in_queue integer,
  notification_sent boolean DEFAULT false,
  joined_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  CONSTRAINT fk_event_waitlist_event_id 
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  UNIQUE(user_id, event_id)
);

-- Create event attendee interests tracking
CREATE TABLE IF NOT EXISTS public.event_attendee_interests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  interest_score decimal DEFAULT 1.0,
  last_interaction timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, event_type)
);

-- Create event recommendations table
CREATE TABLE IF NOT EXISTS public.event_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  event_id uuid NOT NULL,
  recommendation_score decimal DEFAULT 0.5,
  reason text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fk_event_recommendations_event_id 
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  UNIQUE(user_id, event_id)
);

-- Enable RLS on new tables
ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendee_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own event reviews" 
ON public.event_reviews 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view event reviews" 
ON public.event_reviews 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can manage their own waitlist entries" 
ON public.event_waitlist 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interests" 
ON public.event_attendee_interests 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own recommendations" 
ON public.event_recommendations 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Update some events with better images
UPDATE public.events 
SET image_url = CASE 
  WHEN event_type = 'conference' THEN '/event-images/innovation-conference.jpg'
  WHEN event_type = 'workshop' THEN '/event-images/tech-workshop.jpg'
  WHEN event_type = 'summit' THEN '/event-images/tech-summit.jpg'
  WHEN event_type = 'expo' THEN '/event-images/innovation-idea.jpg'
  ELSE image_url
END
WHERE image_url = '/event-images/innovation.jpg';