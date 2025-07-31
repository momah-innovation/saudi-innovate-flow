-- Add missing columns to idea_bookmarks table to match other bookmark tables
ALTER TABLE public.idea_bookmarks 
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS priority character varying DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS reminder_date timestamp with time zone;

-- Add missing columns to challenge_bookmarks table 
ALTER TABLE public.challenge_bookmarks 
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS priority character varying DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS reminder_date timestamp with time zone;

-- Add missing columns to event_bookmarks table
ALTER TABLE public.event_bookmarks 
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS priority character varying DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS reminder_date timestamp with time zone;