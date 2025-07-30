-- Check what tables exist and add missing columns only
DO $$ 
BEGIN
  -- Add new columns to ideas table if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'image_url') THEN
    ALTER TABLE public.ideas ADD COLUMN image_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'featured') THEN
    ALTER TABLE public.ideas ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'view_count') THEN
    ALTER TABLE public.ideas ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'like_count') THEN
    ALTER TABLE public.ideas ADD COLUMN like_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'comment_count') THEN
    ALTER TABLE public.ideas ADD COLUMN comment_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'feasibility_score') THEN
    ALTER TABLE public.ideas ADD COLUMN feasibility_score NUMERIC DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'impact_score') THEN
    ALTER TABLE public.ideas ADD COLUMN impact_score NUMERIC DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'innovation_score') THEN
    ALTER TABLE public.ideas ADD COLUMN innovation_score NUMERIC DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'alignment_score') THEN
    ALTER TABLE public.ideas ADD COLUMN alignment_score NUMERIC DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'overall_score') THEN
    ALTER TABLE public.ideas ADD COLUMN overall_score NUMERIC DEFAULT 0;
  END IF;
END $$;

-- Update existing ideas with sample data
UPDATE public.ideas SET
  feasibility_score = CASE WHEN feasibility_score = 0 THEN (random() * 4 + 6)::numeric(3,1) ELSE feasibility_score END,
  impact_score = CASE WHEN impact_score = 0 THEN (random() * 4 + 6)::numeric(3,1) ELSE impact_score END,
  innovation_score = CASE WHEN innovation_score = 0 THEN (random() * 4 + 6)::numeric(3,1) ELSE innovation_score END,
  alignment_score = CASE WHEN alignment_score = 0 THEN (random() * 4 + 6)::numeric(3,1) ELSE alignment_score END,
  view_count = CASE WHEN view_count = 0 THEN floor(random() * 500 + 10)::integer ELSE view_count END,
  like_count = CASE WHEN like_count = 0 THEN floor(random() * 50 + 1)::integer ELSE like_count END,
  comment_count = CASE WHEN comment_count = 0 THEN floor(random() * 20 + 1)::integer ELSE comment_count END,
  featured = CASE WHEN featured = false AND random() > 0.8 THEN true ELSE featured END;

-- Calculate overall scores
UPDATE public.ideas SET
  overall_score = CASE 
    WHEN overall_score = 0 THEN ((feasibility_score + impact_score + innovation_score + alignment_score) / 4)::numeric(3,1) 
    ELSE overall_score 
  END;