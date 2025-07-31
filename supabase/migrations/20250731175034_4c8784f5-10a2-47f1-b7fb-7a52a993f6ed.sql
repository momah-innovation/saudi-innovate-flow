-- Add missing columns to opportunity_shares table if they don't exist
ALTER TABLE public.opportunity_shares 
ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'unknown';

ALTER TABLE public.opportunity_shares 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing records to have platform from share_type if platform is missing
UPDATE public.opportunity_shares 
SET platform = COALESCE(share_type, 'unknown') 
WHERE platform IS NULL OR platform = '';

-- Enable RLS if not already enabled
ALTER TABLE public.opportunity_shares ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "Users can view opportunity shares" ON public.opportunity_shares;
DROP POLICY IF EXISTS "Users can create shares" ON public.opportunity_shares;

-- Create policies
CREATE POLICY "Users can view opportunity shares" 
ON public.opportunity_shares 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create shares" 
ON public.opportunity_shares 
FOR INSERT 
WITH CHECK (true);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_opportunity_shares_opportunity_id ON public.opportunity_shares(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_shares_user_id ON public.opportunity_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_shares_shared_at ON public.opportunity_shares(shared_at);