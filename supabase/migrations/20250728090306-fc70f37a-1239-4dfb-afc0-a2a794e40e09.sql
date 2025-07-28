-- Remove English fields from stakeholders table and translate interface
-- Drop English name column if it exists
ALTER TABLE public.stakeholders DROP COLUMN IF EXISTS name;

-- Rename Arabic name column to be the primary name
ALTER TABLE public.stakeholders RENAME COLUMN name_ar TO name;