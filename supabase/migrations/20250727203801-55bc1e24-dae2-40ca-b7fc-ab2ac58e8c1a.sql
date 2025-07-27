-- Remove English columns and keep only Arabic fields across all tables

-- Campaigns table
ALTER TABLE public.campaigns 
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS description;

-- Events table  
ALTER TABLE public.events
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS description;

-- Challenges table
ALTER TABLE public.challenges
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS description;

-- Focus questions table
ALTER TABLE public.focus_questions
DROP COLUMN IF EXISTS question_text;

-- Ideas table
ALTER TABLE public.ideas
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS description;

-- Landing page content table
ALTER TABLE public.landing_page_content
DROP COLUMN IF EXISTS title_en,
DROP COLUMN IF EXISTS content_en;

-- Landing page FAQs table
ALTER TABLE public.landing_page_faqs
DROP COLUMN IF EXISTS question_en,
DROP COLUMN IF EXISTS answer_en;

-- Insights table
ALTER TABLE public.insights
DROP COLUMN IF EXISTS insight_text;

-- Update column constraints to make Arabic fields required where appropriate
ALTER TABLE public.campaigns 
ALTER COLUMN title_ar SET NOT NULL;

ALTER TABLE public.events
ALTER COLUMN title_ar SET NOT NULL;

ALTER TABLE public.challenges
ALTER COLUMN title_ar SET NOT NULL,
ALTER COLUMN description_ar SET NOT NULL;

ALTER TABLE public.focus_questions
ALTER COLUMN question_text_ar SET NOT NULL;

ALTER TABLE public.ideas
ALTER COLUMN title_ar SET NOT NULL,
ALTER COLUMN description_ar SET NOT NULL;

ALTER TABLE public.landing_page_content
ALTER COLUMN title_ar SET NOT NULL,
ALTER COLUMN content_ar SET NOT NULL;

ALTER TABLE public.landing_page_faqs
ALTER COLUMN question_ar SET NOT NULL,
ALTER COLUMN answer_ar SET NOT NULL;

ALTER TABLE public.insights
ALTER COLUMN insight_text_ar SET NOT NULL;