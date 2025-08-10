-- Fix all translation keys to use English-only keys
-- First, let's standardize all status, priority, and common values

-- Update existing translation keys that have Arabic keys (if any)
UPDATE public.system_translations 
SET translation_key = 'status.active'
WHERE translation_key = 'نشط' OR text_ar = 'نشط' AND text_en = 'Active';

UPDATE public.system_translations 
SET translation_key = 'status.inactive'
WHERE translation_key = 'غير نشط' OR text_ar = 'غير نشط' AND text_en = 'Inactive';

UPDATE public.system_translations 
SET translation_key = 'status.pending'
WHERE translation_key = 'معلق' OR text_ar = 'معلق' AND text_en = 'Pending';

-- Add standardized status translations
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
-- Status translations
('status.active', 'نشط', 'Active', 'status'),
('status.inactive', 'غير نشط', 'Inactive', 'status'),
('status.pending', 'معلق', 'Pending', 'status'),
('status.approved', 'مقبول', 'Approved', 'status'),
('status.rejected', 'مرفوض', 'Rejected', 'status'),
('status.draft', 'مسودة', 'Draft', 'status'),
('status.published', 'منشور', 'Published', 'status'),
('status.completed', 'مكتمل', 'Completed', 'status'),
('status.cancelled', 'ملغي', 'Cancelled', 'status'),
('status.on_hold', 'معلق', 'On Hold', 'status'),

-- Priority translations  
('priority.high', 'عالي', 'High', 'priority'),
('priority.medium', 'متوسط', 'Medium', 'priority'), 
('priority.low', 'منخفض', 'Low', 'priority'),

-- Level translations
('level.high', 'عالي', 'High', 'level'),
('level.medium', 'متوسط', 'Medium', 'level'),
('level.low', 'منخفض', 'Low', 'level'),

-- Visibility translations
('visibility.public', 'عام', 'Public', 'visibility'),
('visibility.internal', 'داخلي', 'Internal', 'visibility'),
('visibility.restricted', 'مقيد', 'Restricted', 'visibility'),
('visibility.private', 'خاص', 'Private', 'visibility')

ON CONFLICT (translation_key) DO UPDATE SET
text_ar = EXCLUDED.text_ar,
text_en = EXCLUDED.text_en,
category = EXCLUDED.category;