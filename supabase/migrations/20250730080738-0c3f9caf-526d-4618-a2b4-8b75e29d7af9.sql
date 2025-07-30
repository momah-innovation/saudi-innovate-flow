-- Update challenges with appropriate images based on challenge type
UPDATE public.challenges SET image_url = 
  CASE 
    WHEN challenge_type = 'تحول رقمي' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/digital-transformation.jpg'
    WHEN challenge_type = 'مدينة ذكية' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/smart-city.jpg'
    WHEN challenge_type = 'ذكاء اصطناعي' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/ai-technology.jpg'
    WHEN challenge_type = 'ابتكار' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/innovation-lightbulb.jpg'
    WHEN challenge_type = 'تطوير' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/code-development.jpg'
    WHEN challenge_type = 'تقنية' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/circuit-board-tech.jpg'
    WHEN challenge_type = 'بيئة عمل' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/digital-workspace.jpg'
    WHEN challenge_type = 'ابتكار صحي' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/ai-technology.jpg'
    WHEN challenge_type = 'استدامة' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/innovation-lightbulb.jpg'
    WHEN challenge_type = 'تعليم' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/digital-workspace.jpg'
    WHEN challenge_type = 'حوكمة' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/digital-transformation.jpg'
    ELSE 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/programming-challenge.jpg'
  END
WHERE challenge_type IS NOT NULL;