-- Update opportunity_analytics table structure to match expected schema

-- First, let's backup any existing data if there is any
CREATE TEMP TABLE temp_opportunity_analytics_backup AS 
SELECT * FROM public.opportunity_analytics;

-- Drop the current table (it has wrong structure)
DROP TABLE public.opportunity_analytics CASCADE;

-- Recreate with the correct structure expected by the application
CREATE TABLE public.opportunity_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  application_count INTEGER NOT NULL DEFAULT 0,
  bookmark_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint to partnership_opportunities
ALTER TABLE public.opportunity_analytics 
ADD CONSTRAINT fk_opportunity_analytics_opportunity_id 
FOREIGN KEY (opportunity_id) 
REFERENCES public.partnership_opportunities(id) 
ON DELETE CASCADE;

-- Create unique constraint to ensure one analytics record per opportunity
ALTER TABLE public.opportunity_analytics 
ADD CONSTRAINT uq_opportunity_analytics_opportunity_id 
UNIQUE (opportunity_id);

-- Enable RLS
ALTER TABLE public.opportunity_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for opportunity_analytics
CREATE POLICY "Anyone can view opportunity analytics" 
ON public.opportunity_analytics 
FOR SELECT 
USING (true);

CREATE POLICY "Team members can manage opportunity analytics" 
ON public.opportunity_analytics 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create trigger to update updated_at
CREATE TRIGGER update_opportunity_analytics_updated_at
BEFORE UPDATE ON public.opportunity_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial analytics records for existing opportunities
INSERT INTO public.opportunity_analytics (opportunity_id, view_count, like_count, application_count, bookmark_count)
SELECT 
  po.id,
  0 as view_count,
  0 as like_count,
  0 as application_count,
  0 as bookmark_count
FROM public.partnership_opportunities po
ON CONFLICT (opportunity_id) DO NOTHING;