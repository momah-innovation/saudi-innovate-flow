-- Add image_url field to challenges table
ALTER TABLE public.challenges ADD COLUMN image_url TEXT;

-- Update challenges with appropriate images based on challenge type
UPDATE public.challenges SET image_url = 
  CASE 
    WHEN challenge_type = 'digital_transformation' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/digital-transformation.jpg'
    WHEN challenge_type = 'smart_city' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/smart-city.jpg'
    WHEN challenge_type = 'ai_technology' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/ai-technology.jpg'
    WHEN challenge_type = 'innovation' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/innovation-lightbulb.jpg'
    WHEN challenge_type = 'development' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/code-development.jpg'
    WHEN challenge_type = 'technology' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/circuit-board-tech.jpg'
    WHEN challenge_type = 'workspace' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/digital-workspace.jpg'
    ELSE 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/programming-challenge.jpg'
  END
WHERE challenge_type IS NOT NULL;