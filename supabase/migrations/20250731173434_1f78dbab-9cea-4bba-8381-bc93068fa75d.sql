-- Create opportunity_shares table that's missing
CREATE TABLE IF NOT EXISTS public.opportunity_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  user_id UUID,
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  share_type TEXT DEFAULT 'link',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.opportunity_shares ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all opportunity shares" 
ON public.opportunity_shares 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create opportunity shares" 
ON public.opportunity_shares 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_opportunity_shares_opportunity_id ON public.opportunity_shares(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_shares_user_id ON public.opportunity_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_shares_shared_at ON public.opportunity_shares(shared_at);