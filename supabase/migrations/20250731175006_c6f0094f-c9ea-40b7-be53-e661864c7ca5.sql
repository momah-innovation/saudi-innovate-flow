-- Ensure opportunity_shares table exists with proper structure
CREATE TABLE IF NOT EXISTS public.opportunity_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  user_id UUID,
  platform TEXT NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.opportunity_shares ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view opportunity shares" 
ON public.opportunity_shares 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create shares" 
ON public.opportunity_shares 
FOR INSERT 
WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_opportunity_shares_opportunity_id ON public.opportunity_shares(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_shares_user_id ON public.opportunity_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_shares_created_at ON public.opportunity_shares(created_at);