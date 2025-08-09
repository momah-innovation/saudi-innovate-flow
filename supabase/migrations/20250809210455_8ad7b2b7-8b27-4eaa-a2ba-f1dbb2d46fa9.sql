-- Add missing English fields to campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add missing English fields to challenges table  
ALTER TABLE public.challenges
ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add missing English fields to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add missing English fields to ideas table
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add missing English fields to departments table
ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS name_en VARCHAR(255);

-- Add missing English fields to deputies table
ALTER TABLE public.deputies
ADD COLUMN IF NOT EXISTS name_en VARCHAR(255);

-- Add missing English fields to sectors table
ALTER TABLE public.sectors
ADD COLUMN IF NOT EXISTS name_en VARCHAR(255);

-- Add missing English fields to domains table
ALTER TABLE public.domains
ADD COLUMN IF NOT EXISTS name_en VARCHAR(255);

-- Add missing English fields to partners table
ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS name_en VARCHAR(255);

-- Add missing English fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS name_en VARCHAR(255);

-- Add missing English fields to focus_questions table
ALTER TABLE public.focus_questions
ADD COLUMN IF NOT EXISTS question_text_en TEXT;

-- Add missing English fields to opportunities table (if it exists)
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add missing English fields to challenge_submissions table
ALTER TABLE public.challenge_submissions
ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_en TEXT;