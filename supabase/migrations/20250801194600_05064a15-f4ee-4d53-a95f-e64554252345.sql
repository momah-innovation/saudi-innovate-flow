-- Update comprehensive policies to include missing buckets

-- Update public buckets select policy to include missing public buckets
DROP POLICY IF EXISTS "comprehensive_public_buckets_select" ON storage.objects;
CREATE POLICY "comprehensive_public_buckets_select"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = ANY (ARRAY[
    'challenges-images-public',
    'opportunities-images-public', 
    'campaigns-images-public',
    'campaigns-materials-public',
    'events-images-public',
    'events-resources-public',
    'departments-logos-public',
    'sectors-images-public',
    'deputies-images-public',
    'partners-logos-public',
    'system-assets-public',
    'ideas-images-public'
  ])
);

-- Update team public buckets insert policy to include missing buckets
DROP POLICY IF EXISTS "comprehensive_team_public_buckets_insert" ON storage.objects;
CREATE POLICY "comprehensive_team_public_buckets_insert"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = ANY (ARRAY[
    'challenges-images-public',
    'opportunities-images-public',
    'campaigns-images-public', 
    'campaigns-materials-public',
    'events-images-public',
    'events-resources-public',
    'partners-logos-public'
  ])
  AND (
    EXISTS (
      SELECT 1 FROM innovation_team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    ) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Update team private insert policy to include missing private buckets
DROP POLICY IF EXISTS "comprehensive_team_private_insert" ON storage.objects;
CREATE POLICY "comprehensive_team_private_insert"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = ANY (ARRAY[
    'challenges-documents-private',
    'challenges-attachments-private',
    'opportunities-attachments-private',
    'opportunities-documents-private',
    'campaigns-documents-private',
    'partners-documents-private',
    'evaluation-documents-private',
    'evaluation-templates-private',
    'ideas-documents-private',
    'ideas-attachments-private'
  ])
  AND (
    EXISTS (
      SELECT 1 FROM innovation_team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    ) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Update team private select policy to include missing private buckets
DROP POLICY IF EXISTS "comprehensive_team_private_select" ON storage.objects;
CREATE POLICY "comprehensive_team_private_select"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = ANY (ARRAY[
    'challenges-documents-private',
    'challenges-attachments-private', 
    'opportunities-attachments-private',
    'opportunities-documents-private',
    'campaigns-documents-private',
    'partners-documents-private',
    'evaluation-documents-private',
    'evaluation-templates-private',
    'ideas-documents-private',
    'ideas-attachments-private'
  ])
  AND (
    (auth.uid()::text = (storage.foldername(name))[1])
    OR EXISTS (
      SELECT 1 FROM innovation_team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    ) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Create comprehensive team private update policy
CREATE POLICY "comprehensive_team_private_update"
ON storage.objects
FOR UPDATE
TO public
USING (
  bucket_id = ANY (ARRAY[
    'challenges-documents-private',
    'challenges-attachments-private',
    'opportunities-attachments-private', 
    'opportunities-documents-private',
    'campaigns-documents-private',
    'partners-documents-private',
    'evaluation-documents-private',
    'evaluation-templates-private',
    'ideas-documents-private',
    'ideas-attachments-private'
  ])
  AND (
    (auth.uid()::text = (storage.foldername(name))[1])
    OR EXISTS (
      SELECT 1 FROM innovation_team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    ) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Create comprehensive team private delete policy
CREATE POLICY "comprehensive_team_private_delete"
ON storage.objects
FOR DELETE
TO public
USING (
  bucket_id = ANY (ARRAY[
    'challenges-documents-private',
    'challenges-attachments-private',
    'opportunities-attachments-private',
    'opportunities-documents-private', 
    'campaigns-documents-private',
    'partners-documents-private',
    'evaluation-documents-private',
    'evaluation-templates-private',
    'ideas-documents-private',
    'ideas-attachments-private'
  ])
  AND (
    (auth.uid()::text = (storage.foldername(name))[1])
    OR EXISTS (
      SELECT 1 FROM innovation_team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    ) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);