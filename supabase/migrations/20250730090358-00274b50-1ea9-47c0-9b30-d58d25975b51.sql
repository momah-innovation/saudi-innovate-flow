-- Upload challenge images to storage and update database
-- First update challenges table with new image URLs from storage
UPDATE public.challenges SET image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/java-programming.jpg' WHERE challenge_type = 'technical' AND id = (SELECT id FROM public.challenges WHERE challenge_type = 'technical' LIMIT 1);
UPDATE public.challenges SET image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/web-development.jpg' WHERE challenge_type = 'business' AND id = (SELECT id FROM public.challenges WHERE challenge_type = 'business' LIMIT 1);
UPDATE public.challenges SET image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/innovation-lightbulb.jpg' WHERE challenge_type = 'environmental' AND id = (SELECT id FROM public.challenges WHERE challenge_type = 'environmental' LIMIT 1);
UPDATE public.challenges SET image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/digital-transformation.jpg' WHERE challenge_type = 'health' AND id = (SELECT id FROM public.challenges WHERE challenge_type = 'health' LIMIT 1);
UPDATE public.challenges SET image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/coding-workspace.jpg' WHERE challenge_type = 'educational' AND id = (SELECT id FROM public.challenges WHERE challenge_type = 'educational' LIMIT 1);

-- Set default images for challenges by type
UPDATE public.challenges SET image_url = 
  CASE 
    WHEN challenge_type = 'technical' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/code-development.jpg'
    WHEN challenge_type = 'business' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/digital-workspace.jpg'
    WHEN challenge_type = 'environmental' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/smart-city.jpg'
    WHEN challenge_type = 'health' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/innovation-lightbulb-blue.jpg'
    WHEN challenge_type = 'educational' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/programming-challenge.jpg'
    ELSE 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/ai-technology.jpg'
  END
WHERE image_url IS NULL OR image_url = '';

-- Update events table with new image URLs from storage
UPDATE public.events SET image_url = 
  CASE 
    WHEN format = 'in_person' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/event-resources/conference.jpg'
    WHEN format = 'virtual' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/event-resources/webinar.jpg'
    WHEN format = 'hybrid' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/event-resources/tech-meetup.jpg'
    ELSE 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/event-resources/innovation.jpg'
  END
WHERE image_url IS NULL OR image_url = '';

-- Set workshop image for workshop type events
UPDATE public.events SET image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/event-resources/workshop.jpg' 
WHERE event_type = 'workshop';