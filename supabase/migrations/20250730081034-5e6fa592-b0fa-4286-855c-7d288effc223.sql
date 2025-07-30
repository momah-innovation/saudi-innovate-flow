-- Upload new challenge images to storage and update challenge records

-- Update existing challenges with new high-quality images
UPDATE public.challenges SET image_url = 
  CASE 
    WHEN challenge_type = 'تحول رقمي' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/java-programming.jpg'
    WHEN challenge_type = 'ذكاء اصطناعي' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/circuit-board-advanced.jpg'
    WHEN challenge_type = 'ابتكار' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/innovation-lightbulb-blue.jpg'
    WHEN challenge_type = 'تطوير' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/web-development.jpg'
    WHEN challenge_type = 'تقنية' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/coding-workspace.jpg'
    WHEN challenge_type = 'ابتكار صحي' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/circuit-board-advanced.jpg'
    WHEN challenge_type = 'استدامة' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/innovation-lightbulb-blue.jpg'
    WHEN challenge_type = 'تعليم' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/coding-workspace.jpg'
    WHEN challenge_type = 'حوكمة' THEN 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/java-programming.jpg'
    ELSE 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenge-attachments/programming-challenge.jpg'
  END
WHERE challenge_type IS NOT NULL;