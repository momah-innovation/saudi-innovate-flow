-- Fix infinite recursion in workspace_members policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view workspace members" ON public.workspace_members;
DROP POLICY IF EXISTS "Users can view workspace members for accessible workspaces" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace admins can manage members" ON public.workspace_members;

-- Create non-recursive policies
CREATE POLICY "Users can view workspace members for accessible workspaces"
ON public.workspace_members FOR SELECT
USING (
  -- User can see their own membership
  user_id = auth.uid()
  OR
  -- User is workspace owner (direct check)
  workspace_id IN (
    SELECT id FROM workspaces 
    WHERE owner_id = auth.uid()
  )
  OR
  -- Workspace is public
  workspace_id IN (
    SELECT id FROM workspaces 
    WHERE privacy_level = 'public'
  )
  OR
  -- User is admin/super_admin
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin') 
    AND is_active = true
  )
);

-- Admin policy for managing members (non-recursive)
CREATE POLICY "Workspace admins can manage members"
ON public.workspace_members FOR ALL
USING (
  -- Workspace owner can manage
  workspace_id IN (
    SELECT id FROM workspaces 
    WHERE owner_id = auth.uid()
  )
  OR
  -- System admin can manage
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin') 
    AND is_active = true
  )
)
WITH CHECK (
  -- Same checks for inserts/updates
  workspace_id IN (
    SELECT id FROM workspaces 
    WHERE owner_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin') 
    AND is_active = true
  )
);