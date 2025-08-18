-- Resolve circular RLS recursion between workspaces and workspace_members
-- 1) Drop recursive workspaces policies that reference workspace_members
DROP POLICY IF EXISTS "Users can view workspaces they have access to" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view accessible workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners and admins can update workspaces" ON public.workspaces;

-- 2) Re-create safe, function-based policies (non-recursive in RLS)
-- View workspaces: rely on SECURITY DEFINER helper function
CREATE POLICY "Users can view workspaces via access function"
ON public.workspaces FOR SELECT
USING (
  has_workspace_access(id, auth.uid())
);

-- Update workspaces: owners, admins, or explicit permission via function
CREATE POLICY "Owners/admins can update workspaces"
ON public.workspaces FOR UPDATE
USING (
  -- Owner can always update
  owner_id = auth.uid()
  OR
  -- Platform admins
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
  OR
  -- Users with admin-level permission within the workspace
  has_workspace_permission(id, auth.uid(), 'admin')
)
WITH CHECK (
  owner_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
  OR has_workspace_permission(id, auth.uid(), 'admin')
);

-- Leave INSERT policy as-is (owner_id = auth.uid())