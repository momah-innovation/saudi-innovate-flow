-- Storage Bucket RLS Policies Implementation
-- This creates comprehensive Row-Level Security policies for all storage buckets

-- ==========================================
-- PUBLIC BUCKET POLICIES (Everyone can view, role-based upload)
-- ==========================================

-- User Avatars - Users can upload their own, everyone can view
CREATE POLICY "Public can view user avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-avatars-public');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-avatars-public' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-avatars-public' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-avatars-public' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Ideas Images - Authenticated users can upload, everyone can view
CREATE POLICY "Public can view idea images"
ON storage.objects FOR SELECT
USING (bucket_id = 'ideas-images-public');

CREATE POLICY "Authenticated users can manage idea images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'ideas-images-public' 
  AND auth.uid() IS NOT NULL
);

-- Challenges Images - Team members can upload, everyone can view
CREATE POLICY "Public can view challenge images"
ON storage.objects FOR SELECT
USING (bucket_id = 'challenges-images-public');

CREATE POLICY "Team members can manage challenge images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'challenges-images-public' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Opportunities Images - Team members can upload, everyone can view
CREATE POLICY "Public can view opportunity images"
ON storage.objects FOR SELECT
USING (bucket_id = 'opportunities-images-public');

CREATE POLICY "Team members can manage opportunity images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'opportunities-images-public' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Campaigns Images - Team members can upload, everyone can view
CREATE POLICY "Public can view campaign images"
ON storage.objects FOR SELECT
USING (bucket_id = 'campaigns-images-public');

CREATE POLICY "Team members can manage campaign images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'campaigns-images-public' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Partner Images - Team members can upload, everyone can view
CREATE POLICY "Public can view partner images"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-images');

CREATE POLICY "Team members can manage partner images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'partner-images' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Event Resources - Team members can upload, everyone can view
CREATE POLICY "Public can view event resources"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-resources');

CREATE POLICY "Team members can manage event resources"
ON storage.objects FOR ALL
USING (
  bucket_id = 'event-resources' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- ==========================================
-- PRIVATE BUCKET POLICIES (Restricted Access)
-- ==========================================

-- User Documents - Owner only
CREATE POLICY "Users can access their own documents"
ON storage.objects FOR ALL
USING (
  bucket_id = 'user-documents-private' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Ideas Documents - Owner + Team members
CREATE POLICY "Ideas document access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'ideas-documents-private' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Ideas Attachments - Owner + Team members
CREATE POLICY "Ideas attachment access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'ideas-attachments-private' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Challenges Documents - Team members only
CREATE POLICY "Team members can access challenge documents"
ON storage.objects FOR ALL
USING (
  bucket_id = 'challenges-documents-private' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Challenges Attachments - Team members only
CREATE POLICY "Team members can access challenge attachments"
ON storage.objects FOR ALL
USING (
  bucket_id = 'challenges-attachments-private' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Opportunities Attachments - Team members only
CREATE POLICY "Team members can access opportunity attachments"
ON storage.objects FOR ALL
USING (
  bucket_id = 'opportunities-attachments-private' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Opportunities Documents - Team members only
CREATE POLICY "Team members can access opportunity documents"
ON storage.objects FOR ALL
USING (
  bucket_id = 'opportunities-documents-private' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Temporary Uploads - Owner only with automatic cleanup
CREATE POLICY "Users can access their own temporary uploads"
ON storage.objects FOR ALL
USING (
  bucket_id = 'temp-uploads-private' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Campaign Materials - Team members only
CREATE POLICY "Team members can access campaign materials"
ON storage.objects FOR ALL
USING (
  bucket_id = 'campaigns-materials' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- ==========================================
-- ADMIN-ONLY BUCKET POLICIES
-- ==========================================

-- System buckets - Admin only access
CREATE POLICY "Admins can access team logos"
ON storage.objects FOR ALL
USING (
  bucket_id = 'team-logos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can access sector images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'sector-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can access partner logos"
ON storage.objects FOR ALL
USING (
  bucket_id = 'partner-logos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can access dashboard images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'dashboard-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- ==========================================
-- ENABLE RLS ON STORAGE.OBJECTS
-- ==========================================

-- Enable RLS on storage.objects table if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;