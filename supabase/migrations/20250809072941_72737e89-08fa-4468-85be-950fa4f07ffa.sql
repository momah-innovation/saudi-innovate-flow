-- Drop the existing policy that might not be working correctly
DROP POLICY IF EXISTS "Admins can manage sectors" ON sectors;

-- Create a new comprehensive RLS policy for sectors that works with the current auth system
CREATE POLICY "Admin and Super Admin can manage sectors" ON sectors
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles ur 
    JOIN roles r ON ur.role_id = r.id 
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM user_roles ur 
    JOIN roles r ON ur.role_id = r.id 
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('admin', 'super_admin')
  )
);

-- Also create a policy for public read access if needed for public sector browsing
CREATE POLICY "Public can view sectors" ON sectors
FOR SELECT 
TO anon, authenticated
USING (true);