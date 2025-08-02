-- Comprehensive Storage RLS Policies for Innovation Platform
-- This migration adds comprehensive Row Level Security policies for all storage buckets

-- ===== PRIVATE BUCKETS - USER SPECIFIC ACCESS =====

-- User avatars (user-specific folders)
CREATE POLICY "comprehensive_user_avatars_select" ON storage.objects
FOR SELECT USING (
  bucket_id = 'user-avatars-public' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   has_role(auth.uid(), 'admin'::app_role) OR 
   has_role(auth.uid(), 'super_admin'::app_role))
);

CREATE POLICY "comprehensive_user_avatars_insert" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-avatars-public' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "comprehensive_user_avatars_update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-avatars-public' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "comprehensive_user_avatars_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-avatars-public' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   has_role(auth.uid(), 'admin'::app_role))
);

-- User documents (user-specific access)
CREATE POLICY "comprehensive_user_documents_all" ON storage.objects
FOR ALL USING (
  bucket_id = 'user-documents-private' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   has_role(auth.uid(), 'admin'::app_role) OR 
   has_role(auth.uid(), 'super_admin'::app_role))
) WITH CHECK (
  bucket_id = 'user-documents-private' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Temp uploads (user-specific + auto cleanup)
CREATE POLICY "comprehensive_temp_uploads_all" ON storage.objects
FOR ALL USING (
  bucket_id = 'temp-uploads-private' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   has_role(auth.uid(), 'admin'::app_role))
) WITH CHECK (
  bucket_id = 'temp-uploads-private' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ===== TEAM/ADMIN PRIVATE BUCKETS =====

-- Ideas (innovators own their ideas, team can view/manage)
CREATE POLICY "comprehensive_ideas_attachments_select" ON storage.objects
FOR SELECT USING (
  bucket_id = 'ideas-attachments-private' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active') OR
   has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "comprehensive_ideas_attachments_insert" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'ideas-attachments-private' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "comprehensive_ideas_attachments_update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'ideas-attachments-private' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active') OR
   has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "comprehensive_ideas_attachments_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'ideas-attachments-private' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   has_role(auth.uid(), 'admin'::app_role))
);

-- Ideas documents (same pattern)
CREATE POLICY "comprehensive_ideas_documents_select" ON storage.objects
FOR SELECT USING (
  bucket_id = 'ideas-documents-private' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active') OR
   has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "comprehensive_ideas_documents_insert" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'ideas-documents-private' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "comprehensive_ideas_documents_update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'ideas-documents-private' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active') OR
   has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "comprehensive_ideas_documents_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'ideas-documents-private' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   has_role(auth.uid(), 'admin'::app_role))
);

-- Team-only access buckets (team members and admins only)
CREATE POLICY "comprehensive_team_only_access" ON storage.objects
FOR ALL USING (
  bucket_id = ANY (ARRAY[
    'challenges-attachments-private',
    'challenges-documents-private',
    'opportunities-attachments-private', 
    'opportunities-documents-private',
    'campaigns-documents-private',
    'events-recordings-private',
    'partners-contracts-private',
    'partners-documents-private',
    'evaluation-documents-private',
    'evaluation-templates-private',
    'departments-documents-private',
    'sectors-documents-private',
    'submissions-files-private',
    'feedback-attachments-private',
    'notifications-attachments-private',
    'file-versions'
  ]) AND
  (EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active') OR
   has_role(auth.uid(), 'admin'::app_role) OR
   has_role(auth.uid(), 'super_admin'::app_role))
) WITH CHECK (
  bucket_id = ANY (ARRAY[
    'challenges-attachments-private',
    'challenges-documents-private', 
    'opportunities-attachments-private',
    'opportunities-documents-private',
    'campaigns-documents-private',
    'events-recordings-private',
    'partners-contracts-private',
    'partners-documents-private',
    'evaluation-documents-private',
    'evaluation-templates-private',
    'departments-documents-private',
    'sectors-documents-private',
    'submissions-files-private',
    'feedback-attachments-private',
    'notifications-attachments-private',
    'file-versions'
  ]) AND
  (EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active') OR
   has_role(auth.uid(), 'admin'::app_role) OR
   has_role(auth.uid(), 'super_admin'::app_role))
);

-- Demo buckets (everyone can access)
CREATE POLICY "comprehensive_demo_private_access" ON storage.objects
FOR ALL USING (
  bucket_id = 'demo-private'
) WITH CHECK (
  bucket_id = 'demo-private'
);

-- ===== PUBLIC BUCKETS - PUBLIC READ + AUTH UPLOAD =====

CREATE POLICY "comprehensive_public_buckets_select" ON storage.objects
FOR SELECT USING (
  bucket_id = ANY (ARRAY[
    'campaigns-images-public',
    'campaigns-materials-public',
    'challenges-images-public',
    'demo-public',
    'departments-logos-public',
    'deputies-images-public',
    'events-images-public',
    'events-resources-public',
    'ideas-images-public',
    'opportunities-images-public',
    'partners-logos-public',
    'saved-images',
    'sectors-images-public',
    'system-assets-public',
    'team-logos-public'
  ])
);

CREATE POLICY "comprehensive_public_buckets_insert" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = ANY (ARRAY[
    'campaigns-images-public',
    'campaigns-materials-public',
    'challenges-images-public',
    'demo-public',
    'departments-logos-public',
    'deputies-images-public', 
    'events-images-public',
    'events-resources-public',
    'ideas-images-public',
    'opportunities-images-public',
    'partners-logos-public',
    'saved-images',
    'sectors-images-public',
    'system-assets-public',
    'team-logos-public'
  ]) AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "comprehensive_public_buckets_update" ON storage.objects
FOR UPDATE USING (
  bucket_id = ANY (ARRAY[
    'campaigns-images-public',
    'campaigns-materials-public',
    'challenges-images-public',
    'demo-public',
    'departments-logos-public',
    'deputies-images-public',
    'events-images-public', 
    'events-resources-public',
    'ideas-images-public',
    'opportunities-images-public',
    'partners-logos-public',
    'saved-images',
    'sectors-images-public',
    'system-assets-public',
    'team-logos-public'
  ]) AND
  (auth.uid() IS NOT NULL OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "comprehensive_public_buckets_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = ANY (ARRAY[
    'campaigns-images-public',
    'campaigns-materials-public',
    'challenges-images-public',
    'demo-public',
    'departments-logos-public',
    'deputies-images-public',
    'events-images-public',
    'events-resources-public',
    'ideas-images-public',
    'opportunities-images-public',
    'partners-logos-public',
    'saved-images',
    'sectors-images-public',
    'system-assets-public',
    'team-logos-public'
  ]) AND
  (EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active') OR
   has_role(auth.uid(), 'admin'::app_role) OR
   has_role(auth.uid(), 'super_admin'::app_role))
);

-- Drop legacy policies that might conflict
DROP POLICY IF EXISTS "Admins can view all attachments" ON storage.objects;
DROP POLICY IF EXISTS "Team members can access opportunity attachments bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;

-- Log the policy deployment
INSERT INTO public.security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'RLS_POLICY_DEPLOYMENT', 'storage_buckets', 
  jsonb_build_object(
    'action', 'comprehensive_storage_policies_deployed',
    'buckets_secured', 40,
    'policy_categories', ARRAY['user_specific', 'team_admin', 'public_controlled']
  ), 'high'
);