-- First, check what values exist in challenge_type column
-- Remove constraint temporarily
ALTER TABLE public.challenges DROP CONSTRAINT IF EXISTS challenges_challenge_type_check;

-- Update any NULL challenge_type values to 'technical'
UPDATE public.challenges 
SET challenge_type = 'technical' 
WHERE challenge_type IS NULL;

-- Update existing values to proper English equivalents
UPDATE public.challenges 
SET challenge_type = 'technical' 
WHERE challenge_type NOT IN ('technical', 'business', 'environmental', 'health', 'educational');

-- Now add the constraint back
ALTER TABLE public.challenges ADD CONSTRAINT challenges_challenge_type_check 
CHECK (challenge_type IN ('technical', 'business', 'environmental', 'health', 'educational'));

-- Update image_url for existing challenges
UPDATE public.challenges 
SET image_url = '/challenge-images/circuit-board-tech.jpg'
WHERE image_url IS NULL AND challenge_type = 'technical';

UPDATE public.challenges 
SET image_url = '/challenge-images/digital-transformation.jpg'
WHERE image_url IS NULL AND challenge_type = 'business';

UPDATE public.challenges 
SET image_url = '/challenge-images/innovation-lightbulb-blue.jpg'
WHERE image_url IS NULL AND challenge_type = 'environmental';

UPDATE public.challenges 
SET image_url = '/challenge-images/ai-technology.jpg'
WHERE image_url IS NULL AND challenge_type = 'health';

UPDATE public.challenges 
SET image_url = '/challenge-images/programming-challenge.jpg'
WHERE image_url IS NULL AND challenge_type = 'educational';

-- Set default image for any remaining NULL image_url
UPDATE public.challenges 
SET image_url = '/challenge-images/innovation-lightbulb.jpg'
WHERE image_url IS NULL;