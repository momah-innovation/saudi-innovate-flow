-- Add missing columns to innovation_team_members for enhanced team management
ALTER TABLE public.innovation_team_members 
ADD COLUMN IF NOT EXISTS join_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS status CHARACTER VARYING DEFAULT 'active',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS contact_email CHARACTER VARYING,
ADD COLUMN IF NOT EXISTS department CHARACTER VARYING;