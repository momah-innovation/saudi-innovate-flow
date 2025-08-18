-- Fix infinite recursion in workspace_members RLS policy
DROP POLICY IF EXISTS "Users can view workspace members" ON public.workspace_members;
DROP POLICY IF EXISTS "Users can manage workspace memberships" ON public.workspace_members;

-- Create safe workspace members policies without recursion
CREATE POLICY "Users can view workspace members"
ON public.workspace_members FOR SELECT
USING (
  -- User can see members of workspaces they belong to OR public workspaces
  workspace_id IN (
    SELECT w.id FROM public.workspaces w 
    WHERE w.privacy_level = 'public'
    OR w.owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.workspace_members wm2 
      WHERE wm2.workspace_id = w.id 
      AND wm2.user_id = auth.uid() 
      AND wm2.status = 'active'
    )
  )
);

CREATE POLICY "Users can manage their own membership"
ON public.workspace_members FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Workspace owners can manage memberships"
ON public.workspace_members FOR ALL
USING (
  workspace_id IN (
    SELECT id FROM public.workspaces 
    WHERE owner_id = auth.uid()
  )
)
WITH CHECK (
  workspace_id IN (
    SELECT id FROM public.workspaces 
    WHERE owner_id = auth.uid()
  )
);

-- Add workspace storage buckets for file management
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('workspace-documents', 'workspace-documents', false),
  ('workspace-images', 'workspace-images', false),
  ('workspace-shared', 'workspace-shared', true)
ON CONFLICT (id) DO NOTHING;

-- Create workspace storage policies
CREATE POLICY "Workspace members can view workspace documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'workspace-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT w.id::text FROM public.workspaces w 
    JOIN public.workspace_members wm ON w.id = wm.workspace_id
    WHERE wm.user_id = auth.uid() AND wm.status = 'active'
  )
);

CREATE POLICY "Workspace members can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'workspace-documents' AND
  (storage.foldername(name))[1] IN (
    SELECT w.id::text FROM public.workspaces w 
    JOIN public.workspace_members wm ON w.id = wm.workspace_id
    WHERE wm.user_id = auth.uid() AND wm.status = 'active'
  )
);

-- Create workspace analytics table for edge function data
CREATE TABLE IF NOT EXISTS public.workspace_analytics_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
  workspace_type text NOT NULL,
  analytics_data jsonb NOT NULL DEFAULT '{}',
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on analytics cache
ALTER TABLE public.workspace_analytics_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics for their workspaces"
ON public.workspace_analytics_cache FOR SELECT
USING (
  workspace_id IN (
    SELECT w.id FROM public.workspaces w 
    JOIN public.workspace_members wm ON w.id = wm.workspace_id
    WHERE wm.user_id = auth.uid() AND wm.status = 'active'
  )
);

-- System function for updating analytics cache
CREATE OR REPLACE FUNCTION public.update_workspace_analytics_cache(
  p_workspace_id uuid,
  p_workspace_type text,
  p_analytics_data jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.workspace_analytics_cache (workspace_id, workspace_type, analytics_data)
  VALUES (p_workspace_id, p_workspace_type, p_analytics_data)
  ON CONFLICT (workspace_id) 
  DO UPDATE SET 
    analytics_data = p_analytics_data,
    last_updated = now();
END;
$$;