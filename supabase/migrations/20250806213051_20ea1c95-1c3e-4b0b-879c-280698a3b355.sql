-- Create new bilingual translations table
CREATE TABLE public.system_translations_new (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_key TEXT NOT NULL UNIQUE,
  text_en TEXT NOT NULL,
  text_ar TEXT NOT NULL,
  category CHARACTER VARYING DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_translations_new ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view translations" 
ON public.system_translations_new 
FOR SELECT 
USING (true);

CREATE POLICY "Team members can manage translations" 
ON public.system_translations_new 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Migrate data from old table to new structure
INSERT INTO public.system_translations_new (translation_key, text_en, text_ar, category, created_at, updated_at)
SELECT 
  en.translation_key,
  en.translation_text as text_en,
  COALESCE(ar.translation_text, en.translation_text) as text_ar,
  en.category,
  en.created_at,
  en.updated_at
FROM public.system_translations en
LEFT JOIN public.system_translations ar ON (
  en.translation_key = ar.translation_key 
  AND ar.language_code = 'ar'
)
WHERE en.language_code = 'en';

-- Add any Arabic-only keys that might exist
INSERT INTO public.system_translations_new (translation_key, text_en, text_ar, category, created_at, updated_at)
SELECT 
  ar.translation_key,
  ar.translation_text as text_en, -- fallback to Arabic if no English
  ar.translation_text as text_ar,
  ar.category,
  ar.created_at,
  ar.updated_at
FROM public.system_translations ar
WHERE ar.language_code = 'ar'
  AND NOT EXISTS (
    SELECT 1 FROM public.system_translations en 
    WHERE en.translation_key = ar.translation_key 
    AND en.language_code = 'en'
  );

-- Drop old table and rename new one
DROP TABLE public.system_translations;
ALTER TABLE public.system_translations_new RENAME TO system_translations;

-- Create indexes for better performance
CREATE INDEX idx_system_translations_key ON public.system_translations(translation_key);
CREATE INDEX idx_system_translations_category ON public.system_translations(category);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION public.update_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_system_translations_updated_at
BEFORE UPDATE ON public.system_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_translations_updated_at();