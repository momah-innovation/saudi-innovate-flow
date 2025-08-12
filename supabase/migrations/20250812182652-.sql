-- Fix final critical security issues

-- 1. Check if evaluation criteria and templates policies exist first
CREATE POLICY "Team members can view evaluation criteria" 
ON public.evaluation_criteria 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'evaluator'::app_role)
);

CREATE POLICY "Team members can view evaluation templates" 
ON public.evaluation_templates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'evaluator'::app_role)
);

-- Drop any overly permissive policies
DROP POLICY IF EXISTS "Everyone can view evaluation criteria" ON public.evaluation_criteria;
DROP POLICY IF EXISTS "Everyone can view evaluation templates" ON public.evaluation_templates;
DROP POLICY IF EXISTS "Authenticated users can view evaluation criteria" ON public.evaluation_criteria;
DROP POLICY IF EXISTS "Authenticated users can view evaluation templates" ON public.evaluation_templates;