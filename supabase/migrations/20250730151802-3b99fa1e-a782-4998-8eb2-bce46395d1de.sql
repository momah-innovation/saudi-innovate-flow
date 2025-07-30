-- Create event resources table for storing downloadable materials
CREATE TABLE IF NOT EXISTS public.event_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  resource_type VARCHAR(50) NOT NULL, -- 'document', 'video', 'image', 'link'
  file_url TEXT,
  file_size_mb DECIMAL,
  file_format VARCHAR(10),
  download_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  availability_status VARCHAR(50) DEFAULT 'available', -- 'available', 'coming_soon', 'unavailable'
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Enable RLS on event_resources
ALTER TABLE public.event_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for event_resources
CREATE POLICY "Anyone can view public event resources" 
ON public.event_resources 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Team members can manage event resources" 
ON public.event_resources 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create event likes table for tracking user likes on events
CREATE TABLE IF NOT EXISTS public.event_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS on event_likes  
ALTER TABLE public.event_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for event_likes
CREATE POLICY "Users can manage their own event likes" 
ON public.event_likes 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view event likes count" 
ON public.event_likes 
FOR SELECT 
USING (true);

-- Add missing columns to events table if they don't exist
DO $$
BEGIN
  -- Add image_url if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'image_url') THEN
    ALTER TABLE public.events ADD COLUMN image_url TEXT;
  END IF;
  
  -- Add end_time if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'end_time') THEN
    ALTER TABLE public.events ADD COLUMN end_time TIME WITHOUT TIME ZONE;
  END IF;
  
  -- Add end_date if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'end_date') THEN
    ALTER TABLE public.events ADD COLUMN end_date DATE;
  END IF;
  
  -- Add description_ar if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'description_ar') THEN
    ALTER TABLE public.events ADD COLUMN description_ar TEXT;
  END IF;
  
  -- Add is_recurring if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_recurring') THEN
    ALTER TABLE public.events ADD COLUMN is_recurring BOOLEAN DEFAULT false;
  END IF;
  
  -- Add partner_organizations if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'partner_organizations') THEN
    ALTER TABLE public.events ADD COLUMN partner_organizations TEXT[];
  END IF;
  
  -- Add related_focus_questions if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'related_focus_questions') THEN
    ALTER TABLE public.events ADD COLUMN related_focus_questions TEXT[];
  END IF;
END $$;

-- Create function to get event statistics
CREATE OR REPLACE FUNCTION get_event_stats(event_uuid UUID)
RETURNS JSON AS $$
DECLARE
  participants_count INTEGER;
  likes_count INTEGER;
  bookmarks_count INTEGER;
  feedback_count INTEGER;
  avg_rating DECIMAL;
BEGIN
  -- Get participants count
  SELECT COUNT(*) INTO participants_count
  FROM event_participants
  WHERE event_id = event_uuid;
  
  -- Get likes count
  SELECT COUNT(*) INTO likes_count
  FROM event_likes
  WHERE event_id = event_uuid;
  
  -- Get bookmarks count
  SELECT COUNT(*) INTO bookmarks_count
  FROM event_bookmarks
  WHERE event_id = event_uuid;
  
  -- Get feedback count and average rating
  SELECT COUNT(*), AVG(rating) INTO feedback_count, avg_rating
  FROM event_feedback
  WHERE event_id = event_uuid;
  
  RETURN json_build_object(
    'participants_count', participants_count,
    'likes_count', likes_count,
    'bookmarks_count', bookmarks_count,
    'feedback_count', feedback_count,
    'average_rating', COALESCE(avg_rating, 0)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_resources_updated_at
BEFORE UPDATE ON public.event_resources
FOR EACH ROW
EXECUTE FUNCTION update_event_resources_updated_at();