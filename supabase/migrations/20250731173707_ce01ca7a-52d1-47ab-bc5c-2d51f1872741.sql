-- Create missing opportunity_audit_log table
CREATE TABLE IF NOT EXISTS public.opportunity_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  changed_by UUID,
  old_values JSONB,
  new_values JSONB,
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.opportunity_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Team members can view audit logs" 
ON public.opportunity_audit_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Add missing columns to opportunity_analytics
ALTER TABLE public.opportunity_analytics 
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT now();

ALTER TABLE public.opportunity_analytics 
ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_opportunity_audit_log_opportunity_id ON public.opportunity_audit_log(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_audit_log_created_at ON public.opportunity_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_opportunity_audit_log_changed_by ON public.opportunity_audit_log(changed_by);